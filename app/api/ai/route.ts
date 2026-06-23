import Groq from "groq-sdk";

const GROQ_MODEL = "llama-3.3-70b-versatile";
const MAX_NOTES_IN_PROMPT = 20;
const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "by",
  "from",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "can",
  "my",
  "me",
  "i",
  "you",
  "your",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "these",
  "those",
  "am",
  "all",
  "any",
  "about",
  "how",
  "when",
  "where",
  "why",
  "show",
  "tell",
  "give",
  "find",
  "summarize",
  "summary",
  "notes",
  "note",
]);

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type NoteContext = {
  id: string;
  title: string;
  tag?: string;
  createdAt: number;
  body: string;
};

type NoteSource = {
  noteId: string;
  title: string;
  excerpt: string;
};

type AiResponse = {
  answer: string;
  sources: NoteSource[];
};

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured");
  }

  return new Groq({ apiKey });
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function scoreNote(note: NoteContext, keywords: string[]): number {
  if (keywords.length === 0) return note.createdAt;

  const title = note.title.toLowerCase();
  const tag = (note.tag ?? "").toLowerCase();
  const body = stripHtml(note.body).toLowerCase();

  let score = 0;
  for (const keyword of keywords) {
    if (title.includes(keyword)) score += 8;
    if (tag.includes(keyword)) score += 6;
    if (body.includes(keyword)) score += 2;
  }

  return score > 0 ? score * 1_000_000 + note.createdAt : 0;
}

function selectRelevantNotes(
  messages: ChatMessage[],
  notes: NoteContext[],
): NoteContext[] {
  if (notes.length <= MAX_NOTES_IN_PROMPT) {
    return notes;
  }

  const lastUserMessage = [...messages]
    .reverse()
    .find((message) => message.role === "user");
  const keywords = extractKeywords(lastUserMessage?.content ?? "");

  const ranked = notes
    .map((note) => ({ note, score: scoreNote(note, keywords) }))
    .sort((a, b) => b.score - a.score);

  const matched = ranked
    .filter((entry) => entry.score > 0)
    .slice(0, MAX_NOTES_IN_PROMPT)
    .map((entry) => entry.note);

  if (matched.length >= Math.min(5, notes.length)) {
    return matched;
  }

  const recentFallback = [...notes]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, MAX_NOTES_IN_PROMPT);

  const seen = new Set<string>();
  const combined: NoteContext[] = [];

  for (const note of [...matched, ...recentFallback]) {
    if (seen.has(note.id)) continue;
    seen.add(note.id);
    combined.push(note);
    if (combined.length >= MAX_NOTES_IN_PROMPT) break;
  }

  return combined;
}

function formatNotesForPrompt(notes: NoteContext[]): string {
  if (notes.length === 0) {
    return "The user has no notes yet.";
  }

  return notes
    .slice()
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((note) => {
      const date = new Date(note.createdAt).toISOString().split("T")[0];
      const body = stripHtml(note.body).slice(0, 3000);
      return `- id: ${note.id} | [${date}] "${note.title}" (tag: ${note.tag ?? "none"})\n  ${body}`;
    })
    .join("\n\n");
}

function buildSystemPrompt(notes: NoteContext[]): string {
  return `You are KhalNote AI, a helpful assistant inside a personal notes app.

You must answer using ONLY the user's notes listed below. Do not invent note content. If the user asks about notes from a time period (for example "this week"), use each note's date to decide what is relevant. If no notes match, say so clearly and suggest what they could add.

Respond with valid JSON only, in this exact shape:
{
  "answer": "Your reply in plain text. Use **bold** for emphasis when helpful.",
  "sources": [
    { "noteId": "exact id from the notes list", "excerpt": "A short quote or summary (max 120 chars) from that note supporting your answer" }
  ]
}

Rules for sources:
- Include only notes you actually used. Use the exact "id" field from the notes list.
- Include 0-5 sources. Omit sources if none apply.
- Keep excerpts short and faithful to the note content.

USER'S NOTES:
${formatNotesForPrompt(notes)}`;
}

function parseAiResponse(raw: string, notes: NoteContext[]): AiResponse {
  let parsed: { answer?: string; sources?: Array<{ noteId?: string; excerpt?: string }> };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { answer: raw.trim(), sources: [] };
  }

  const answer =
    typeof parsed.answer === "string" && parsed.answer.trim()
      ? parsed.answer.trim()
      : raw.trim();

  const notesById = new Map(notes.map((note) => [note.id, note]));
  const sources: NoteSource[] = [];

  if (Array.isArray(parsed.sources)) {
    const seen = new Set<string>();
    for (const source of parsed.sources) {
      if (!source?.noteId || seen.has(source.noteId)) continue;
      const note = notesById.get(source.noteId);
      if (!note) continue;

      seen.add(source.noteId);
      const excerpt =
        typeof source.excerpt === "string" && source.excerpt.trim()
          ? source.excerpt.trim().slice(0, 160)
          : stripHtml(note.body).slice(0, 120);

      sources.push({
        noteId: note.id,
        title: note.title,
        excerpt,
      });

      if (sources.length >= 5) break;
    }
  }

  return { answer, sources };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages as ChatMessage[] | undefined;
    const notes = (body.notes ?? []) as NoteContext[];

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages are required" }, { status: 400 });
    }

    const relevantNotes = selectRelevantNotes(messages, notes);
    const groq = getGroqClient();
    const res = await groq.chat.completions.create({
      model: GROQ_MODEL,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: buildSystemPrompt(relevantNotes) },
        ...messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      ],
    });

    const raw = res.choices[0]?.message?.content;
    if (!raw) {
      return Response.json(
        { error: "No response received from Groq" },
        { status: 502 },
      );
    }

    const { answer, sources } = parseAiResponse(raw, relevantNotes);

    return Response.json({ answer, sources });
  } catch (error) {
    console.error("Groq API error:", error);

    const message =
      error instanceof Error ? error.message : "Failed to get AI response";

    return Response.json({ error: message }, { status: 500 });
  }
}
