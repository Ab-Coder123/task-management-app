'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import TaskTable from '@/components/tasks/TaskTable';
import TaskFilters from '@/components/tasks/TaskFilters';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useTasks } from '@/lib/hooks/useTasks';
import { useUsers } from '@/lib/hooks/useUsers';
import { TaskType, TaskPriority, User } from '@/lib/types';
import { Plus, X, Calendar, Edit3, List, Layers, ShieldAlert, Check, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import AttachmentUploader from '@/components/attachments/AttachmentUploader';

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

const AVATAR_COLORS = [
  { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.25)', text: '#4f46e5' }, // indigo
  { bg: 'rgba(236, 72, 153, 0.08)', border: 'rgba(236, 72, 153, 0.2)', text: '#db2777' }, // pink
  { bg: 'rgba(245, 158, 11, 0.08)', border: 'rgba(245, 158, 11, 0.2)', text: '#d97706' }, // amber
  { bg: 'rgba(16, 185, 129, 0.08)', border: 'rgba(16, 185, 129, 0.2)', text: '#059669' }, // emerald
  { bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.2)', text: '#dc2626' }, // red
  { bg: 'rgba(59, 130, 246, 0.08)', border: 'rgba(59, 130, 246, 0.2)', text: '#2563eb' }, // blue
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

const getAvatarFallback = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

export default function AdminTasksPage() {
  const { tasks, isLoading: tasksLoading, deleteTask, completeTask, createTask, isCreating } = useTasks();
  const { users, isLoading: usersLoading } = useUsers();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Search & filter state  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  // Creation Popup State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [queuedFiles, setQueuedFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('feature');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assignedTo, setAssignedTo] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  // Target task for deletion dialog
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Loading indicator
  if (tasksLoading || usersLoading || !mounted) {
    return <LoadingSpinner size="lg" className="h-[50vh]" />;
  }

  // Join tasks with user records for presentation
  const tasksWithUsers = tasks.map((task) => {
    let assignedUsers: User[] = [];
    if (Array.isArray(task.assignedTo)) {
      assignedUsers = task.assignedTo.map(id => {
        if (typeof id === 'string') {
          return users.find(u => u._id === id);
        }
        return id; // if populated User object
      }).filter((u): u is User => !!u);
    } else if (task.assignedTo && typeof task.assignedTo === 'string') {
      const assignedId = task.assignedTo as any;
      const u = users.find(user => user._id === assignedId);
      if (u) assignedUsers = [u];
    }
    return {
      ...task,
      assignedUsers,
    };
  });

  // Filtering logic
  const filteredTasks = tasksWithUsers.filter((task) => {
    const matchesSearch =
      !search ||
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    const matchesType = typeFilter ? task.type === typeFilter : true;

    return matchesSearch && matchesStatus && matchesPriority && matchesType;
  });

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteTask(deleteTargetId);
      toast.success('تم حذف سجل المهمة بنجاح.');
    } catch (err) {
      console.error('Delete task failed', err);
      toast.error('فشلت عملية حذف المهمة.');
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || assignedTo.length === 0) {
      toast.error('يرجى ملء جميع الحقول المطلوبة واختيار عضو واحد على الأقل لتعيين المهمة.');
      return;
    }

    try {
      const selectedDueDate = dueDate ? new Date(dueDate).toISOString() : new Date(Date.now() + 86400000 * 3).toISOString();
      const newTask = await createTask({
        title: title.trim(),
        description: description.trim() || 'لا يوجد وصف مضاف.',
        status: 'pending',
        type,
        priority,
        assignedTo,
        dueDate: selectedDueDate,
        isPrivate: false
      });

      // Upload queued files if any
      if (queuedFiles.length > 0 && newTask?._id) {
        try {
          const { attachmentsApi } = await import('@/lib/api/tasks');
          await attachmentsApi.uploadFiles(newTask._id, queuedFiles);
          toast.success(`تم إنشاء المهمة ورفع ${queuedFiles.length} مرفق بنجاح!`);
        } catch (uploadErr: any) {
          toast.warning('تم إنشاء المهمة، لكن فشل رفع بعض المرفقات: ' + (uploadErr.message || ''));
        }
      } else {
        toast.success('تم إنشاء وتعيين المهمة بنجاح!');
      }

      setIsCreateModalOpen(false);
      setTitle('');
      setDescription('');
      setType('feature');
      setPriority('medium');
      setAssignedTo([]);
      setDueDate('');
      setQueuedFiles([]);
    } catch (err) {
      console.error('Task creation failed', err);
      toast.error('فشلت عملية إنشاء المهمة.');
    }
  };

  // Show all users since status is not defined in the backend SchemaUser
  const approvedUsers = users;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="space-y-6 text-right"
      dir="rtl"
    >
      <PageHeader
        title="محفظة المهام"
        description="استعرض المهام عبر المراحل، نفّذ الفلاتر، وحدّث تفاصيل المهام الموكلة لأعضاء الفريق."
        action={
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/95 active:scale-95 transition-all shadow-200"
          >
            <Plus className="h-5 w-5 bg-green-300 rounded-sm " />
            <span>إنشاء مهمة جديدة</span>
          </button>
        }
      />

      {/* Task Filters */}
      <TaskFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
      />

      {/* Task Table */}
      <TaskTable
        tasks={filteredTasks}
        onDelete={(id) => setDeleteTargetId(id)}
        onComplete={(id) => {
          completeTask({ id, username: 'Admin' });
          toast.success('تم وضع علامة اكتمال على المهمة بنجاح!');
        }}
      />

      {/* Delete Confirmation Dialogue */}
      <ConfirmDialog
        isOpen={deleteTargetId !== null}
        title="حذف سجل المهمة"
        description="هل أنت متأكد من رغبتك في حذف هذه المهمة؟ سيؤدي ذلك إلى إزالة كافة السجلات والتعليقات المرتبطة بها بشكل نهائي."
        confirmText="تأكيد حذف المهمة"
        cancelText="إلغاء"
        isDanger
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Create Task Popup Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:py-10 overflow-y-auto">
            {/* Dark blur overlay */}
            <div className="fixed inset-0 bg-black/40 backdrop-blur-md" onClick={() => { setIsCreateModalOpen(false); setIsUserDropdownOpen(false); }} />

            {/* Modal Dialog Content - Wide Two-Column layout (max-w-4xl) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }}
              className="bg-white dark:bg-[#0f172a] w-full max-w-4xl rounded-3xl p-6 md:p-8 relative shadow-xl text-right z-10 border border-slate-200 dark:border-slate-800 overflow-visible my-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsUserDropdownOpen(false);
                }}
                className="absolute top-6 left-6 p-2.5 rounded-xl text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-foreground transition-all cursor-pointer shadow-sm"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header Title & Description */}
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="relative w-12 h-12 flex items-center justify-center bg-primary/10 rounded-2xl shrink-0">
                  <Edit3 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                    📋 إنشاء وتعيين مهمة جديدة
                  </h3>
                  <p className="text-xs text-muted-foreground font-semibold mt-1">
                    أدخل عنوان ووصف المهمة بدقة، ثم حدد المسؤولين من الفريق وتاريخ التسليم المحدد.
                  </p>
                </div>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-6">
                {/* Two-Column Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                  {/* Column 1 (Right in RTL): Title & Description - 7 cols on lg */}
                  <div className="lg:col-span-7 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 space-y-5">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-foreground border-b border-slate-200 dark:border-slate-700/60 pb-3">
                      <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                      <span>البيانات الأساسية للمهمة</span>
                    </div>

                    {/* Task Title */}
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        اسم المهمة <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="مثال: تطوير صفحة تسجيل الدخول الجديدة..."
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-right transition-all shadow-sm focus:border-primary"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        وصف المهمة والخطوات المطلوبة <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={7}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="أدخل تفاصيل المهمة، قائمة التحقق، أو أي تعليمات خاصة بالفريق..."
                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-right transition-all resize-none shadow-sm focus:border-primary min-h-[200px]"
                      />
                    </div>
                  </div>

                  {/* Column 2 (Left in RTL): Assignee, Type/Priority & Due Date - 5 cols on lg */}
                  <div className="lg:col-span-5 bg-slate-50 dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700/80 rounded-2xl p-5 space-y-5">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-foreground border-b border-slate-200 dark:border-slate-700/60 pb-3">
                      <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                      <span>التصنيف وتعيين المسؤولين</span>
                    </div>

                    {/* Custom Multi-Select Dropdown for Assigning Task */}
                    <div className="relative">
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                        الموكل إليهم (أعضاء الفريق) <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-right shadow-sm cursor-pointer min-h-[46px] focus:border-primary"
                      >
                        <span>
                          {assignedTo.length === 0
                            ? '🔍 اضغط لاختيار أعضاء الفريق...'
                            : `✅ تم اختيار ${assignedTo.length} أعضاء`}
                        </span>
                        {/* Selected Avatars stack inside button */}
                        {assignedTo.length > 0 && (
                          <div className="flex items-center -space-x-1.5 space-x-reverse">
                            {assignedTo.slice(0, 3).map((id) => {
                              const user = approvedUsers.find(u => u._id === id);
                              if (!user) return null;
                              const ac = avatarColor(user.username);
                              return user.avatar ? (
                                <img key={user._id} src={user.avatar} className="h-5 w-5 rounded-full border border-card object-cover shrink-0 shadow-sm" />
                              ) : (
                                <div key={user._id} className="h-5 w-5 rounded-full flex items-center justify-center text-[7px] font-bold border border-card uppercase shrink-0" style={{ background: ac.bg, color: ac.text }}>
                                  {getAvatarFallback(user.username)}
                                </div>
                              );
                            })}
                            {assignedTo.length > 3 && (
                              <div className="h-5 w-5 rounded-full bg-muted border border-card flex items-center justify-center text-[7px] font-bold text-muted-foreground shrink-0">
                                +{assignedTo.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </button>

                      <AnimatePresence>
                        {isUserDropdownOpen && (
                          <>
                            {/* Overlay to handle click outside */}
                            <div className="fixed inset-0 z-30" onClick={() => setIsUserDropdownOpen(false)} />

                            {/* Solid card dropdown list panel */}
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute z-40 left-0 right-0 mt-2 p-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl max-h-60 overflow-y-auto space-y-1 text-right"
                            >
                              {approvedUsers.map((user) => {
                                const isSelected = assignedTo.includes(user._id);
                                const ac = avatarColor(user.username);
                                return (
                                  <button
                                    key={user._id}
                                    type="button"
                                    onClick={() => {
                                      if (isSelected) {
                                        setAssignedTo(assignedTo.filter(id => id !== user._id));
                                      } else {
                                        setAssignedTo([...assignedTo, user._id]);
                                      }
                                    }}
                                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-right transition-all hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer ${isSelected ? 'bg-primary/10 text-primary font-bold' : 'text-foreground'
                                      }`}
                                  >
                                    {/* Custom Checkbox */}
                                    <div className={`h-4.5 w-4.5 rounded-md border flex items-center justify-center transition-all shrink-0 ${isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'
                                      }`}>
                                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                                    </div>

                                    {/* User avatar or fallback */}
                                    {user.avatar ? (
                                      <img src={user.avatar} className="h-7 w-7 rounded-full object-cover shrink-0 shadow-sm" />
                                    ) : (
                                      <div className="h-7 w-7 rounded-full flex items-center justify-center text-[9px] font-bold uppercase shrink-0" style={{ background: ac.bg, border: `1px solid ${ac.border}`, color: ac.text }}>
                                        {getAvatarFallback(user.username)}
                                      </div>
                                    )}

                                    {/* User Name & Email */}
                                    <div className="flex flex-col grow select-none text-right">
                                      <span className="font-bold text-foreground flex items-center gap-1.5 justify-start">
                                        {user.username}
                                        {user.role === 'admin' && (
                                          <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/10 shrink-0" />
                                        )}
                                      </span>
                                      <span className="text-[10px] text-muted-foreground/80">{user.email}</span>
                                    </div>
                                  </button>
                                );
                              })}
                              {approvedUsers.length === 0 && (
                                <p className="text-center text-[10px] text-muted-foreground py-3 font-semibold">لا يوجد أعضاء نشطين بالفريق حالياً.</p>
                              )}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Task Type */}
                    <div className="w-full">
                      <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                        نوع المهمة
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value as TaskType)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer text-right shadow-sm focus:border-primary"
                      >
                        <option value="feature" className="bg-white dark:bg-[#0f172a] text-foreground">ميزة جديدة</option>
                        <option value="bug" className="bg-white dark:bg-[#0f172a] text-foreground">إصلاح مشكلة (Bug)</option>
                        <option value="improvement" className="bg-white dark:bg-[#0f172a] text-foreground">تحسين أداء</option>
                        <option value="documentation" className="bg-white dark:bg-[#0f172a] text-foreground">توثيق / ملفات</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Priority */}
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                          الأهمية
                        </label>
                        <select
                          value={priority}
                          onChange={(e) => setPriority(e.target.value as TaskPriority)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all appearance-none cursor-pointer text-right shadow-sm focus:border-primary"
                        >
                          <option value="low" className="bg-white dark:bg-[#0f172a] text-foreground">منخفضة</option>
                          <option value="medium" className="bg-white dark:bg-[#0f172a] text-foreground">متوسطة</option>
                          <option value="high" className="bg-white dark:bg-[#0f172a] text-foreground">عالية</option>
                          <option value="critical" className="bg-white dark:bg-[#0f172a] text-foreground">حرجة</option>
                        </select>
                      </div>

                      {/* Due Date */}
                      <div>
                        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                          تاريخ الاستحقاق <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-muted-foreground/60">
                            <Calendar className="h-4.5 w-4.5" />
                          </span>
                          <input
                            type="date"
                            required
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-foreground text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/30 text-right transition-all shadow-sm cursor-pointer focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Attachments Uploader - Full Width across bottom */}
                <div className="border-t border-border pt-5">
                  <p className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                    <span>📎 المرفقات والملفات الدائمة</span>
                    <span className="text-[10px] text-muted-foreground font-normal">(اختياري - يمكنك سحب وإفلات الملفات هنا)</span>
                  </p>
                  <AttachmentUploader
                    onFilesQueued={(files) => setQueuedFiles(files)}
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-5 border-t border-border">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setIsUserDropdownOpen(false);
                    }}
                    className="px-6 py-3 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-muted-foreground transition-all cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-8 py-3 rounded-xl text-xs font-extrabold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-lg shadow-primary/25 cursor-pointer flex items-center gap-2"
                  >
                    {isCreating ? 'جاري الإنشاء...' : 'إنشاء وتعيين المهمة'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
