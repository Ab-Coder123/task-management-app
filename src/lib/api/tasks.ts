import { apiFetch } from './base';
import { Task, RawTask, TaskStatus, TaskType, TaskPriority, User, TaskAttachment } from '../types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://taskmanager-backend-flax.vercel.app';


// Helper to extract Unix timestamp from MongoDB ObjectId
function getTimestampFromObjectId(id: string): string | null {
  if (!id || id.length !== 24) return null;
  try {
    const timestamp = parseInt(id.substring(0, 8), 16) * 1000;
    if (!isNaN(timestamp) && timestamp > 0) {
      return new Date(timestamp).toISOString();
    }
  } catch (e) {
    console.error('Failed to parse ObjectId timestamp', e);
  }
  return null;
}

// ─── Normalisation helpers ───────────────────────────────────────────────────

function normaliseType(raw?: string): TaskType {
  if (!raw) return 'feature';
  const map: Record<string, TaskType> = {
    development: 'feature',
    feature: 'feature',
    bug: 'bug',
    bugfix: 'bug',
    'bug fix': 'bug',
    improvement: 'improvement',
    documentation: 'documentation',
    docs: 'documentation',
  };
  return map[raw.toLowerCase()] ?? 'feature';
}

function normalisePriority(raw?: string): TaskPriority {
  if (!raw) return 'medium';
  const map: Record<string, TaskPriority> = {
    low: 'low',
    medium: 'medium',
    high: 'high',
    critical: 'critical',
  };
  return map[raw.toLowerCase()] ?? 'medium';
}

function normaliseStatus(raw?: string): TaskStatus {
  if (!raw) return 'pending';
  const map: Record<string, TaskStatus> = {
    pending: 'pending',
    in_progress: 'in_progress',
    inprogress: 'in_progress',
    'in progress': 'in_progress',
    completed: 'completed',
    done: 'completed',
    overdue: 'overdue',
  };
  return map[raw.toLowerCase()] ?? 'pending';
}

// Helper to check if a date string is valid and parseable
function isValidDateString(str?: string): boolean {
  if (!str || str === 'null' || str === 'undefined' || str === 'Invalid Date' || str.trim() === '') return false;
  const d = new Date(str);
  return !isNaN(d.getTime()) && d.getFullYear() > 1990;
}

// ─── Main mapper  (RawTask → Task) ──────────────────────────────────────────

function mapRawTask(raw: RawTask): Task {
  let completedAt = isValidDateString(raw.completedAt) ? raw.completedAt : undefined;
  let createdAt = isValidDateString(raw.createdAt) ? raw.createdAt! : '';

  // Extract from MongoDB ObjectId if database did not return valid createdAt
  if (!createdAt) {
    const extracted = getTimestampFromObjectId(raw._id);
    if (isValidDateString(extracted || undefined)) {
      createdAt = extracted!;
    } else if (isValidDateString(raw.Due_date)) {
      createdAt = raw.Due_date;
    } else {
      createdAt = new Date().toISOString();
    }
  }

  // Load completion date from LocalStorage fallback if not returned by server DB schema
  if (!completedAt && typeof window !== 'undefined') {
    try {
      const localCompleted = JSON.parse(localStorage.getItem('task_completed_dates') || '{}');
      if (isValidDateString(localCompleted[raw._id])) {
        completedAt = localCompleted[raw._id];
      }
    } catch (e) {
      console.error('Error loading local completion dates', e);
    }
  }

  // If task status is completed but completedAt is still missing, auto-assign due date or createdAt
  const status = normaliseStatus(raw.Status);
  if (status === 'completed' && !completedAt) {
    completedAt = isValidDateString(raw.Due_date) ? raw.Due_date : createdAt;
  }

  // Normalise assignedTo as an array (handling string, string array, or populated User array)
  let assignedToArr: string[] | User[] = [];
  if (Array.isArray(raw.assignedTo)) {
    assignedToArr = raw.assignedTo;
  } else if (raw.assignedTo && typeof raw.assignedTo === 'string') {
    assignedToArr = [raw.assignedTo];
  }

  return {
    _id: raw._id,
    title: raw.Name_task ?? '',
    description: raw.Description ?? '',
    type: normaliseType(raw.type_task),
    priority: normalisePriority(raw.priority),
    status,
    assignedTo: assignedToArr,
    dueDate: raw.Due_date ?? '',
    createdAt,
    completedAt,
    isPrivate: raw.isPrivate ?? false,
    createdBy: raw.createdBy,
    privateChecklist: raw.privateChecklist ?? [],
    attachments: raw.attachments ?? [],
  };
}

// ─── Reverse mapper  (Task → backend payload) ────────────────────────────────

function toBackendTask(data: Partial<Task>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.title !== undefined) {
    out.title = data.title;
    out.Name_task = data.title;
  }
  if (data.description !== undefined) {
    out.description = data.description;
    out.Description = data.description;
  }
  if (data.status !== undefined) {
    out.status = data.status;
    out.Status = data.status;
  }
  if (data.type !== undefined) {
    out.type_task = data.type;
  }
  if (data.priority !== undefined) {
    out.priority = data.priority;
  }
  if (data.assignedTo !== undefined) {
    // Keep it as an array (or list of IDs)
    out.assignedTo = Array.isArray(data.assignedTo)
      ? data.assignedTo.map(item => (typeof item === 'string' ? item : item._id))
      : data.assignedTo;
  }
  if (data.dueDate !== undefined) {
    out.Due_date = data.dueDate;
  }
  if (data.completedAt !== undefined) {
    out.completedAt = data.completedAt;
  }
  if (data.isPrivate !== undefined) {
    out.isPrivate = data.isPrivate;
  }
  return out;
}

// ─── API ────────────────────────────────────────────────────────────────────

export const tasksApi = {
  getTasks: async (): Promise<Task[]> => {
    const raw = await apiFetch<RawTask[]>('/api/tasks/gettasks', { method: 'GET' });
    return Array.isArray(raw) ? raw.map(mapRawTask) : [];
  },

  addTask: async (taskData: Partial<Task>): Promise<Task> => {
    const res = await apiFetch<{ message: string; task: RawTask }>('/api/tasks/addtask', {
      method: 'POST',
      bodyData: toBackendTask(taskData),
    });
    return mapRawTask(res.task);
  },

  editTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    // If updating status to completed, save completedAt locally as a fallback
    if (taskData.status === 'completed' || taskData.completedAt) {
      if (typeof window !== 'undefined') {
        try {
          const localCompleted = JSON.parse(localStorage.getItem('task_completed_dates') || '{}');
          localCompleted[id] = taskData.completedAt || new Date().toISOString();
          localStorage.setItem('task_completed_dates', JSON.stringify(localCompleted));
        } catch (e) {
          console.error('Error saving local completion date', e);
        }
      }
    }

    const raw = await apiFetch<RawTask>(`/api/tasks/updatetasks_id=${id}`, {
      method: 'PUT',
      bodyData: toBackendTask(taskData),
    });
    return mapRawTask(raw);
  },

  deleteTask: (id: string) => {
    // Remove local completed date cache if task is deleted
    if (typeof window !== 'undefined') {
      try {
        const localCompleted = JSON.parse(localStorage.getItem('task_completed_dates') || '{}');
        if (localCompleted[id]) {
          delete localCompleted[id];
          localStorage.setItem('task_completed_dates', JSON.stringify(localCompleted));
        }
      } catch (e) {
        console.error(e);
      }
    }
    return apiFetch<{ message: string }>(`/api/tasks/deletetasks_id=${id}`, {
      method: 'DELETE',
    });
  },

  // Private Checklist APIs (Phase 11)
  addChecklistItem: async (taskId: string, text: string): Promise<Task> => {
    const raw = await apiFetch<RawTask>(`/api/tasks/gettasks_id=${taskId}/checklist`, {
      method: 'POST',
      bodyData: { text },
    });
    return mapRawTask(raw);
  },

  toggleChecklistItem: async (taskId: string, itemId: string): Promise<Task> => {
    const raw = await apiFetch<RawTask>(`/api/tasks/gettasks_id=${taskId}/checklist/${itemId}/toggle`, {
      method: 'PUT',
    });
    return mapRawTask(raw);
  },

  deleteChecklistItem: async (taskId: string, itemId: string): Promise<Task> => {
    const raw = await apiFetch<RawTask>(`/api/tasks/gettasks_id=${taskId}/checklist/${itemId}`, {
      method: 'DELETE',
    });
    return mapRawTask(raw);
  },
};

// ─── Attachment API ──────────────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const s = localStorage.getItem('auth-storage');
    if (s) return JSON.parse(s).state?.token || null;
  } catch { /* ignore */ }
  return null;
}

export const attachmentsApi = {
  /** Upload files to a task (admin only) */
  uploadFiles: async (taskId: string, files: File[]): Promise<TaskAttachment[]> => {
    const token = getToken();
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));

    const res = await fetch(`${BASE_URL}/api/attachments/${taskId}/upload`, {
      method: 'POST',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(err.message);
    }
    const data = await res.json();
    return data.attachments || [];
  },

  /** Get attachment list for a task */
  getAttachments: async (taskId: string): Promise<TaskAttachment[]> => {
    const data = await apiFetch<{ attachments: TaskAttachment[] }>(`/api/attachments/${taskId}`);
    return data.attachments || [];
  },

  /** Get a signed (15-min) URL for secure file viewing/download */
  getSignedUrl: async (taskId: string, attachmentId: string): Promise<{ signedUrl: string; attachment: Partial<TaskAttachment> }> => {
    return apiFetch(`/api/attachments/${taskId}/signed/${attachmentId}`);
  },

  /** Delete an attachment (admin or task creator) */
  deleteAttachment: async (taskId: string, attachmentId: string): Promise<TaskAttachment[]> => {
    const data = await apiFetch<{ attachments: TaskAttachment[] }>(`/api/attachments/${taskId}/${attachmentId}`, {
      method: 'DELETE',
    });
    return data.attachments || [];
  },
};

