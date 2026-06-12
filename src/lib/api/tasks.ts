import { apiFetch } from './base';
import { Task, RawTask, TaskStatus, TaskType, TaskPriority } from '../types';

// ─── Normalisation helpers ───────────────────────────────────────────────────

/** Backend type_task  →  frontend TaskType */
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

/** Backend priority  →  frontend TaskPriority */
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

/** Backend Status  →  frontend TaskStatus (handles capitalised values) */
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

// ─── Main mapper  (RawTask → Task) ──────────────────────────────────────────

function mapRawTask(raw: RawTask): Task {
  return {
    _id: raw._id,
    title: raw.Name_task ?? '',
    description: raw.Description ?? '',
    type: normaliseType(raw.type_task),
    priority: normalisePriority(raw.priority),
    status: normaliseStatus(raw.Status),
    assignedTo: raw.assignedTo ?? '',
    dueDate: raw.Due_date ?? '',
    createdAt: raw.createdAt ?? '',
    completedAt: raw.completedAt,
  };
}

// ─── Reverse mapper  (Task → backend payload) ────────────────────────────────

/**
 * Converts a frontend Partial<Task> to the exact field names
 * the backend route reads from req.body:
 *   addtask:    title, description, status, Due_date, assignedTo, type_task
 *   updatetask: title, description, status, Due_date, assignedTo, type_task
 */
function toBackendTask(data: Partial<Task>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  if (data.title !== undefined) out.title = data.title;
  if (data.description !== undefined) out.description = data.description;
  if (data.status !== undefined) out.status = data.status;
  if (data.type !== undefined) out.type_task = data.type;
  if (data.priority !== undefined) out.priority = data.priority;
  if (data.assignedTo !== undefined) out.assignedTo = data.assignedTo;
  if (data.dueDate !== undefined) out.Due_date = data.dueDate;
  if (data.completedAt !== undefined) out.completedAt = data.completedAt;
  return out;
}

// ─── API ────────────────────────────────────────────────────────────────────

export const tasksApi = {
  getTasks: async (): Promise<Task[]> => {
    const raw = await apiFetch<RawTask[]>('/api/tasks/gettasks', { method: 'GET' });
    return Array.isArray(raw) ? raw.map(mapRawTask) : [];
  },

  addTask: async (taskData: Partial<Task>): Promise<Task> => {
    // Backend returns plain text "new task added successfully" – not a JSON object.
    // We post the data and synthesise a Task from what we sent so callers
    // (e.g. notifications) can read .title without crashing.
   try {
    await apiFetch<string>('/api/tasks/addtask', {
      method: 'POST',
      bodyData: toBackendTask(taskData),
    });
    // Return a best-effort Task shape from the submitted data
    
    return {
      _id: '',
      title: taskData.title ?? '',
      description: taskData.description ?? '',
      type: taskData.type ?? 'feature',
      priority: taskData.priority ?? 'medium',
      status: taskData.status ?? 'pending',
      assignedTo: taskData.assignedTo ?? '',
      dueDate: taskData.dueDate ?? '',
      createdAt: new Date().toISOString(),
    };
    } catch (error) {
      console.error('Failed to create task', error);
      throw error;
    }
  },

  editTask: async (id: string, taskData: Partial<Task>): Promise<Task> => {
    const raw = await apiFetch<RawTask>(`/api/tasks/updatetasks_id=${id}`, {
      method: 'PUT',
      bodyData: toBackendTask(taskData),
    });
    return mapRawTask(raw);
  },

  deleteTask: (id: string) => {
    return apiFetch<{ message: string }>(`/api/tasks/deletetasks_id=${id}`, {
      method: 'DELETE',
    });
  },
};
