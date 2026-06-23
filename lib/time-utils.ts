/**
 * Returns a human-readable relative time string like "Edited 2h ago" or "Edited just now"
 */
export function getRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 0) {
    return "just now";
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return "just now";
  } else if (minutes < 60) {
    return `${minutes}m ago`;
  } else if (hours < 24) {
    return `${hours}h ago`;
  } else if (days < 7) {
    return `${days}d ago`;
  } else if (weeks < 5) {
    return `${weeks}w ago`;
  } else if (months < 12) {
    return `${months}mo ago`;
  } else {
    return `${years}y ago`;
  }
}

/**
 * Returns true if the note was edited (updatedAt exists and is different from createdAt)
 */
export function wasEdited(createdAt: number, updatedAt?: number): boolean {
  if (!updatedAt) return false;
  // Consider a note edited only if the update occurred at least 5 seconds after creation.
  return Math.abs(updatedAt - createdAt) > 5000; // more than 5 seconds difference
}