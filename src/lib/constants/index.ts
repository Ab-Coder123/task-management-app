import { TaskPriority, TaskStatus, TaskType } from "../types";

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'overdue', label: 'Overdue' },
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export const TASK_TYPES: { value: TaskType; label: string }[] = [
  { value: 'feature', label: 'Feature' },
  { value: 'bug', label: 'Bug' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'documentation', label: 'Documentation' },
];

export const USER_STATUSES = [
  { value: 'pending', label: 'Pending Verification' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
];

export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'Users Management', href: '/admin/users', icon: 'Users' },
  { label: 'Tasks Management', href: '/admin/tasks', icon: 'CheckSquare' },
  { label: 'Completed Tasks', href: '/admin/tasks/completed', icon: 'FolderCheck' },
  { label: 'Comments Moderation', href: '/admin/comments', icon: 'MessageSquare' },
  { label: 'Notifications', href: '/admin/notifications', icon: 'Bell' },
];

export const USER_NAV_ITEMS = [
  { label: 'My Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
];
