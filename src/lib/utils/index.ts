import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";
import { TaskPriority, TaskStatus, TaskType } from "../types";

// Classname merger helper
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Date formatter helper
export function formatDate(dateString?: string, formatStr: string = "PPP") {
  if (!dateString) return "N/A";
  try {
    return format(parseISO(dateString), formatStr);
  } catch (error) {
    return "Invalid Date";
  }
}

// Badge color helpers for UI
export function getPriorityColor(priority: TaskPriority) {
  switch (priority) {
    case "critical":
      return "bg-rose-500/10 text-rose-500 border-rose-500/20";
    case "high":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "medium":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "low":
    default:
      return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
  }
}

export function getStatusColor(status: TaskStatus) {
  switch ((status ?? '').toLowerCase()) {
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
    case 'in_progress':
    case 'inprogress':
      return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
    case 'overdue':
      return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    case 'pending':
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  }
}

export function getTypeLabel(type: TaskType) {
  switch ((type ?? '').toLowerCase()) {
    case 'bug':
      return 'Bug Fix';
    case 'feature':
    case 'development':
      return 'Feature Request';
    case 'improvement':
      return 'Improvement';
    case 'documentation':
    case 'docs':
      return 'Documentation';
    default:
      return type ?? 'Unknown';
  }
}

// Generates fallback text avatars based on username
export function getAvatarFallback(username: string) {
  if (!username) return "?";
  const parts = username.split(" ");
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return username.substring(0, 2).toUpperCase();
}
