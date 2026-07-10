import { TaskPriority, TaskStatus, TaskType } from "../types";

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'معلقة' },
  { value: 'in_progress', label: 'قيد التنفيذ' },
  { value: 'completed', label: 'مكتملة' },
  { value: 'overdue', label: 'متأخرة' },
];

export const TASK_PRIORITIES: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'منخفضة' },
  { value: 'medium', label: 'متوسطة' },
  { value: 'high', label: 'عالية' },
  { value: 'critical', label: 'حرجة' },
];

export const TASK_TYPES: { value: TaskType; label: string }[] = [
  { value: 'feature', label: 'ميزة جديدة' },
  { value: 'bug', label: 'إصلاح خطأ' },
  { value: 'improvement', label: 'تحسين' },
  { value: 'documentation', label: 'توثيق' },
];

export const USER_STATUSES = [
  { value: 'pending', label: 'في انتظار التحقق' },
  { value: 'approved', label: 'تمت الموافقة' },
  { value: 'rejected', label: 'مرفوض' },
];

export const ADMIN_NAV_ITEMS = [
  { label: 'لوحة التحكم', href: '/admin/dashboard', icon: 'LayoutDashboard' },
  { label: 'إدارة المستخدمين', href: '/admin/users', icon: 'Users' },
  { label: 'إدارة المهام', href: '/admin/tasks', icon: 'CheckSquare' },
  { label: 'المهام المكتملة', href: '/admin/tasks/completed', icon: 'FolderCheck' },
  { label: 'إدارة التعليقات', href: '/admin/comments', icon: 'MessageSquare' },
  { label: 'التقارير والتصدير', href: '/admin/reports', icon: 'BarChart3' },
  { label: 'الإشعارات', href: '/admin/notifications', icon: 'Bell' },
];

export const USER_NAV_ITEMS = [
  { label: 'لوحة المهام الرئيسية', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'الإشعارات والتوجيهات', href: '/dashboard/notifications', icon: 'Bell' },
  { label: 'مهامي الخاصة', href: '/dashboard/personal-tasks', icon: 'Lock' },
];
