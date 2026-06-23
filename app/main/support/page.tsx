"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Mail,
  MessageSquare,
  Bug,
  Lightbulb,
  Code2,
  Send,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<"contact" | "bug" | "feature">(
    "contact",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const sendMessageMut = useMutation(api.support.sendMessage);

  const handleSubmit = async () => {
    if (!name || !email || !subject || !message) {
      toast.error("Please fill all fields");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendMessageMut({
        name,
        email,
        subject,
        message,
        priority: activeTab !== "contact" ? priority : undefined,
        type: activeTab,
      });

      setShowSuccessDialog(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setPriority("medium");
      toast.success("Message sent successfully! We'll get back to you soon.");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-cyan-500" />
            <h1 className="text-xl font-semibold">Support</h1>
          </div>
          <div className="text-muted-foreground text-sm">
            We're here to help. Get in touch with us anytime.
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 bg-green-500/5 border-green-500/20 space-y-2">
          <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="font-semibold">Status</h3>
          <p className="text-sm text-muted-foreground">
            All systems operational
          </p>
          <p className="text-xs text-green-600 font-medium">🟢 Live</p>
        </div>

        <div className="border rounded-lg p-4 bg-blue-500/5 border-blue-500/20 space-y-2">
          <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="font-semibold">Response Time</h3>
          <p className="text-sm text-muted-foreground">
            Usually within 24 hours
          </p>
        </div>

        <div className="border rounded-lg p-4 bg-purple-500/5 border-purple-500/20 space-y-2">
          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-2">
            <Mail className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="font-semibold">Email</h3>
          <a href="mailto:olusesikhalid43@gmail.com" className="text-sm text-muted-foreground hover:text-purple-400 transition-colors">olusesikhalid43@gmail.com</a>
        </div>
      </div>

      {/* Tabs */}
      <div className="border rounded-lg overflow-hidden">
        <div className="flex gap-0 bg-muted/30 border-b">
          {[
            { id: "contact", label: "Contact Us", icon: Mail },
            { id: "bug", label: "Report Bug", icon: Bug },
            { id: "feature", label: "Feature Request", icon: Lightbulb },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex-1 px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === id
                  ? "bg-purple-600 text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
          </div>

          {(activeTab === "bug" || activeTab === "feature") && (
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <Input
              id="subject"
              placeholder={
                activeTab === "bug"
                  ? "Describe the bug"
                  : activeTab === "feature"
                    ? "Feature title"
                    : "How can we help?"
              }
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              placeholder={
                activeTab === "bug"
                  ? "Steps to reproduce the bug, screenshots, browser info, etc."
                  : activeTab === "feature"
                    ? "Tell us about your feature idea and why you think it would be useful."
                    : "Tell us how we can help you. Include any details that might be helpful."
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border rounded-lg bg-background resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="border rounded-lg p-5 space-y-4">
        <h2 className="text-lg font-semibold">Common Support Questions</h2>

        <div className="space-y-3">
          {[
            {
              q: "How do I report a security issue?",
              a: "Please don't disclose security issues publicly. Email us at olusesikhalid43@gmail.com with details.",
            },
            {
              q: "What's your response time?",
              a: "We typically respond to support requests within 24 hours.",
            },
            {
              q: "Can I get my data back after deletion?",
              a: "Deleted notes go to Trash for 30 days before permanent deletion. Contact support if you need help.",
            },
            {
              q: "Where can I find the source code?",
              a: "Visit our GitHub repository at github.com/khalid-olusesi to view the source code and contribute.",
            },
          ].map((item, idx) => (
            <details
              key={idx}
              className="group border rounded-lg p-3 cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <summary className="font-medium flex items-center gap-2">
                <span>→</span>
                {item.q}
              </summary>
              <p className="mt-2 text-sm text-muted-foreground ml-6">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Contact & Resources */}
      <div className="border rounded-lg p-5 space-y-4">
        <h2 className="text-lg font-semibold">Contact & Resources</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="mailto:olusesikhalid43@gmail.com"
            className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Mail className="w-5 h-5" />
            <div>
              <p className="font-medium text-sm">Email</p>
              <p className="text-xs text-muted-foreground">
                olusesikhalid43@gmail.com
              </p>
            </div>
          </a>

          <a
            href="https://github.com/khalid-olusesi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Code2 className="w-5 h-5" />
            <div>
              <p className="font-medium text-sm">GitHub</p>
              <p className="text-xs text-muted-foreground">
                github.com/khalid-olusesi
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <AlertDialogTitle className="text-center">
              Message Sent!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Thank you for reaching out. We've received your message and will
              get back to you as soon as possible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-center">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Got It
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
