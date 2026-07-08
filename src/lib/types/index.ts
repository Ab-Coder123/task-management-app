// User Types
export type UserRole = 'admin' | 'user';
export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface User {
  _id: string; // MongoDB standard ID used by the backend
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  avatar?: string;
}

// Task Types
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskType = 'bug' | 'feature' | 'improvement' | 'documentation';

export interface ChecklistItem {
  _id: string;
  userId: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

// Raw shape returned directly from the backend/database
export interface RawTask {
  _id: string;
  Name_task: string;       // maps to → title
  Description: string;     // maps to → description
  type_task: string;       // maps to → type
  priority?: string;       
  Status: string;          // maps to → status
  assignedTo: string | string[] | User[]; // maps to → assignedTo (can be array or populated User objects)
  Due_date: string;        // maps to → dueDate
  createdAt?: string;
  completedAt?: string;
  isPrivate?: boolean;
  createdBy?: string | User;
  privateChecklist?: ChecklistItem[];
  __v?: number;
}

export interface Task {
  _id: string; // MongoDB standard ID
  title: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo: string[] | User[]; // Array of User IDs or Populated User Objects
  dueDate: string;
  createdAt: string;
  completedAt?: string;
  isPrivate?: boolean;
  createdBy?: string | User;
  privateChecklist?: ChecklistItem[];
}

// Comment Types
export interface Comment {
  _id: string; // MongoDB standard ID
  taskId: string;
  userId: string | User; // Populated User Object
  authorId?: string;
  authorName?: string;
  authorRole?: string;
  user?: User; // Joined user object
  task?: Task; // Joined task object
  content: string;
  createdAt: string;
  isReviewed: boolean;
}

// Notification Types
export type NotificationType = 'new_user' | 'task_completed' | 'new_comment' | 'task_created' | 'task_updated';

export interface Notification {
  _id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  metadata?: {
    userId?: string;
    taskId?: string;
    commentId?: string;
    username?: string;
    taskTitle?: string;
    assignedTo?: string[];
  };
}

// Stats for Admin Dashboard
export interface AdminStats {
  totalUsers: number;
  pendingUsers: number;
  approvedUsers: number;
  totalTasks: number;
  completedTasks: number;
}
