'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  FolderCheck, 
  Clock, 
  AlertCircle,
  Search,
  Sparkles,
  Lock,
  Plus,
  Calendar,
  ChevronLeft,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { useTasks } from '@/lib/hooks/useTasks';
import { useAuthStore } from '@/lib/store/authStore';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { TaskStatus, Task } from '@/lib/types';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

export default function PersonalTasksPage() {
  const { user } = useAuthStore();
  const { tasks, isLoading, createTask, isCreating, completeTask, editTask, isEditing, deleteTask } = useTasks();
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  // Edit Task State
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editStatus, setEditStatus] = useState<TaskStatus>('pending');
  const [editDueDate, setEditDueDate] = useState('');

  if (isLoading || !mounted) {
    return <LoadingSpinner size="lg" className="h-[60vh]" />;
  }

  // Filter ONLY private tasks created by the current user or assigned to them
  const personalTasks = tasks.filter((t) => {
    const isAssigned = Array.isArray(t.assignedTo)
      ? t.assignedTo.some(id => (typeof id === 'string' ? id === user?._id : id?._id === user?._id))
      : t.assignedTo === user?._id;
    return t.isPrivate && (t.createdBy === user?._id || isAssigned);
  });

  // Statistics metrics
  const totalTasks = personalTasks.length;
  const completedTasks = personalTasks.filter((t) => t.status === 'completed').length;
  const activeTasks = personalTasks.filter((t) => t.status === 'in_progress' || t.status === 'pending').length;
  const overdueTasks = personalTasks.filter((t) => t.status === 'overdue').length;

  const handleCreatePersonalTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await createTask({
        title: newTaskTitle.trim(),
        description: newTaskDesc.trim() || 'مهمة شخصية خاصة.',
        status: 'pending',
        type: 'feature',
        priority: 'medium',
        assignedTo: user?._id ? [user._id] : [],
        isPrivate: true,
        dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
      });
      toast.success('تمت إضافة المهمة الخاصة بنجاح!');
      setNewTaskTitle('');
      setNewTaskDesc('');
      setIsAddFormOpen(false);
    } catch (err) {
      console.error('Failed to create private task:', err);
      toast.error('فشلت عملية إضافة المهمة.');
    }
  };

  const handleCompleteTask = async (id: string) => {
    try {
      await completeTask({ id, username: user?.username || 'User' });
      toast.success('تم إكمال المهمة الخاصة بنجاح!');
    } catch (err) {
      console.error('Failed to complete task:', err);
      toast.error('فشلت عملية إكمال المهمة.');
    }
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description || '');
    setEditStatus(task.status);
    setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTitle.trim()) return;

    try {
      await editTask({
        id: editingTask._id,
        data: {
          title: editTitle.trim(),
          description: editDesc.trim(),
          status: editStatus,
          dueDate: editDueDate ? new Date(editDueDate).toISOString() : editingTask.dueDate,
        }
      });
      toast.success('تم تحديث المهمة الشخصية بنجاح!');
      setEditingTask(null);
    } catch (err) {
      console.error('Failed to update task:', err);
      toast.error('فشلت عملية تحديث المهمة.');
    }
  };

  const handleDeleteTask = async (id: string, title: string) => {
    if (!window.confirm(`هل أنت متأكد من رغبتك في حذف المهمة "${title}"؟`)) return;
    try {
      await deleteTask(id);
      toast.success('تم حذف المهمة الشخصية بنجاح!');
    } catch (err) {
      console.error('Failed to delete task:', err);
      toast.error('فشلت عملية حذف المهمة.');
    }
  };

  // Filter tasks based on search and status tabs
  const filteredTasks = personalTasks.filter((task) => {
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesSearch = 
      !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusArabicLabel = (status: TaskStatus) => {
    switch (status) {
      case 'completed': return 'مكتملة';
      case 'in_progress': return 'قيد التنفيذ';
      case 'overdue': return 'متأخرة';
      case 'pending':
      default: return 'معلقة';
    }
  };

  const getStatusBadgeColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed': 
        return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'in_progress': 
        return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'overdue': 
        return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'pending':
      default: 
        return 'text-blue-600 bg-blue-50 border-blue-100';
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="space-y-6 text-right" 
      dir="rtl"
    >
      
      {/* Title & Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2 justify-start">
            <Lock className="h-6 w-6 text-primary" />
            <span>مهامي الشخصية (الخاصة)</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1.5">
            هنا يمكنك تنظيم ومتابعة مهامك الشخصية التي لا يمكن لأي شخص آخر في الفريق أو الأدمن رؤيتها.
          </p>
        </div>
        
        <button
          onClick={() => setIsAddFormOpen(!isAddFormOpen)}
          className="flex items-center gap-2 self-start md:self-auto px-4.5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/95 transition-all shadow-md active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة مهمة خاصة جديدة</span>
        </button>
      </div>

      {/* Add Task Collapsible Form */}
      <AnimatePresence>
        {isAddFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleCreatePersonalTask} className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3.5 shadow-sm">
              <h3 className="text-sm font-bold text-foreground">إنشاء مهمة خاصة جديدة</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="عنوان المهمة..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-250 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-right shadow-sm"
                />
                
                <input
                  type="text"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="وصف المهمة (اختياري)..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-250 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-right shadow-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-muted-foreground transition-all"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-sm"
                >
                  {isCreating ? 'جاري الحفظ...' : 'حفظ المهمة الشخصية'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {editingTask && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-card border border-border rounded-3xl p-6 w-full max-w-lg space-y-4 shadow-2xl"
              dir="rtl"
            >
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                  <Edit2 className="h-5 w-5 text-primary" />
                  <span>تعديل المهمة الشخصية</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="p-1 rounded-lg text-muted-foreground hover:bg-muted transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">عنوان المهمة</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/20 border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1.5">وصف المهمة</label>
                  <textarea
                    rows={3}
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-muted/20 border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-right resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">حالة المهمة</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
                      className="w-full px-3 py-2.5 rounded-xl bg-muted/20 border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-right"
                    >
                      <option value="pending">معلقة</option>
                      <option value="in_progress">قيد التنفيذ</option>
                      <option value="completed">مكتملة</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1.5">تاريخ الاستحقاق</label>
                    <input
                      type="date"
                      value={editDueDate}
                      onChange={(e) => setEditDueDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-muted/20 border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-right"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-border/40">
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-muted-foreground transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isEditing}
                    className="px-6 py-2.5 rounded-xl text-xs font-extrabold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-md"
                  >
                    {isEditing ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Tasks */}
        <div className="rounded-xl bg-card p-5 shadow-200 hover:shadow-300 hover:-translate-y-1.5 transition-all duration-350 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">إجمالي المهام</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CheckSquare className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground">{totalTasks}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">المهام الخاصة بك</p>
          </div>
        </div>

        {/* Pending / Active */}
        <div className="rounded-xl bg-card p-5 shadow-200 hover:shadow-300 hover:-translate-y-1.5 transition-all duration-350 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">قيد الإنجاز</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground">{activeTasks}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">المهام الجاري العمل عليها</p>
          </div>
        </div>

        {/* Completed */}
        <div className="rounded-xl bg-card p-5 shadow-200 hover:shadow-300 hover:-translate-y-1.5 transition-all duration-350 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">المهام المكتملة</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <FolderCheck className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground">{completedTasks}</h3>
            <p className="text-[10px] text-muted-foreground mt-1">
              {totalTasks > 0 ? `${Math.round((completedTasks / totalTasks) * 100)}% نسبة الإنجاز` : 'لا توجد مهام مكتملة'}
            </p>
          </div>
        </div>

        {/* Overdue */}
        <div className="rounded-xl bg-card p-5 shadow-200 hover:shadow-300 hover:-translate-y-1.5 transition-all duration-350 group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">مهام متأخرة</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <AlertCircle className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-foreground">{overdueTasks}</h3>
            <p className="text-[10px] text-rose-500 font-semibold mt-1">تجاوزت تاريخ الاستحقاق</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 justify-start">
          {(['all', 'pending', 'in_progress', 'completed', 'overdue'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
              style={statusFilter === status
                ? { background: '#2563eb', color: '#fff', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }
                : { background: 'var(--card)', color: 'var(--muted-foreground)', boxShadow: '0 2px 4px rgba(75,85,99,0.06)' }}
            >
              {status === 'all' ? 'الكل' : status === 'pending' ? 'معلقة' : status === 'in_progress' ? 'قيد التنفيذ' : status === 'completed' ? 'مكتملة' : 'متأخرة'}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث في عنوان المهمة أو وصفها..."
            className="w-full pl-3 pr-9 py-2 rounded-xl bg-card text-foreground placeholder-muted-foreground/60 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-right transition-all shadow-100 border-0"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-muted-foreground/60">
            <Search className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => (
          <div 
            key={task._id}
            className="rounded-2xl bg-card p-5 shadow-200 hover:shadow-300 hover:-translate-y-1 transition-all duration-350 flex flex-col justify-between border border-border/40"
          >
            <div className="flex items-center justify-between mb-3.5">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadgeColor(task.status)}`}>
                • {getStatusArabicLabel(task.status)}
              </span>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                خاصة
              </span>
            </div>

            <h4 className="text-[15px] font-bold text-foreground/90 mb-2 line-clamp-1 leading-snug">
              {task.title}
            </h4>
            <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
              {task.description}
            </p>

            <div className="flex items-center justify-between pt-3.5 mt-auto border-t border-border/30">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-[11px] font-semibold">تاريخ الاستحقاق: {new Date(task.dueDate).toLocaleDateString('ar-EG')}</span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => handleOpenEditModal(task)}
                  className="p-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-all shrink-0"
                  title="تعديل المهمة"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>

                <button
                  onClick={() => handleDeleteTask(task._id, task.title)}
                  className="p-1.5 rounded-lg border border-border bg-card hover:bg-rose-50 text-rose-600 transition-all shrink-0"
                  title="حذف المهمة"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>

                <Link
                  href={`/tasks/${task._id}`}
                  className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-all shrink-0"
                >
                  التفاصيل
                </Link>
                
                {task.status !== 'completed' && (
                  <button
                    onClick={() => handleCompleteTask(task._id)}
                    className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all cursor-pointer shrink-0"
                  >
                    إكمال
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12 rounded-xl border border-dashed border-border bg-card/10">
          <p className="text-xs text-muted-foreground font-semibold">لا توجد مهام خاصة مطابقة للبحث حالياً.</p>
        </div>
      )}

    </motion.div>
  );
}
