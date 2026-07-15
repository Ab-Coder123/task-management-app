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
  { bg: 'rgba(99, 102, 241, 0.1)',  border: 'rgba(99, 102, 241, 0.25)',  text: '#4f46e5' }, // indigo
  { bg: 'rgba(236, 72, 153, 0.08)',  border: 'rgba(236, 72, 153, 0.2)', text: '#db2777' }, // pink
  { bg: 'rgba(245, 158, 11, 0.08)',  border: 'rgba(245, 158, 11, 0.2)', text: '#d97706' }, // amber
  { bg: 'rgba(16, 185, 129, 0.08)',  border: 'rgba(16, 185, 129, 0.2)', text: '#059669' }, // emerald
  { bg: 'rgba(239, 68, 68, 0.08)',   border: 'rgba(239, 68, 68, 0.2)',  text: '#dc2626' }, // red
  { bg: 'rgba(59, 130, 246, 0.08)',  border: 'rgba(59, 130, 246, 0.2)', text: '#2563eb' }, // blue
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
            className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/95 active:scale-95 transition-all shadow-200"
          >
            <Plus className="h-4 w-4" />
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Dark blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsCreateModalOpen(false);
                setIsUserDropdownOpen(false);
              }}
              className="fixed inset-0 bg-black/30 backdrop-blur-md"
            />

            {/* Modal Dialog Content - Fixed to Solid White background, narrower max-w-sm, and no scrollbars (overflow-visible) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: 'spring', duration: 0.45, bounce: 0.2 }}
              className="bg-white w-full max-w-sm rounded-3xl p-5 relative shadow-600 text-right z-10 border border-slate-200 overflow-visible"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsUserDropdownOpen(false);
                }}
                className="absolute top-4 left-4 p-1.5 rounded-xl text-muted-foreground hover:bg-muted transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* 3D Floating Clipboard Animation */}
              <div className="flex justify-center items-center py-2 mb-1">
                <div className="relative w-16 h-16 perspective-1000 flex items-center justify-center">
                  
                  {/* Outer floating ambient glow ring */}
                  <motion.div
                    animate={{
                      scale: [0.95, 1.05, 0.95],
                      opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 rounded-full bg-primary/10 blur-md pointer-events-none"
                  />

                  {/* 3D Clipboard Sheet */}
                  <motion.div
                    animate={{ 
                      rotateY: [-10, 10, -10], 
                      rotateX: [12, 22, 12],
                      y: [-2, 2, -2]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 6, 
                      ease: "easeInOut" 
                    }}
                    className="absolute w-10 h-13 bg-gradient-to-br from-white to-slate-50 rounded-xl shadow-200 flex flex-col p-1.5 preserve-3d"
                    style={{ transformStyle: 'preserve-3d', border: '1px solid rgba(255,255,255,0.85)' }}
                  >
                    {/* Metal Clip */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-5 h-2 bg-gradient-to-b from-slate-300 to-slate-450 rounded shadow-sm" />
                    
                    {/* Checklist lines */}
                    <div className="w-full h-1 bg-blue-100 rounded-full mt-2" />
                    <div className="w-11/12 h-1 bg-indigo-50 rounded-full mt-1" />
                    <div className="w-8/12 h-1 bg-slate-100 rounded-full mt-1" />
                  </motion.div>

                  {/* Floating 3D Checkmark Circle */}
                  <motion.div
                    animate={{ 
                      y: [2, -5, 2],
                      rotate: [8, -8, 8],
                      scale: [0.96, 1.04, 0.96]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 4.5, 
                      ease: "easeInOut" 
                    }}
                    className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-300 text-white border-2 border-white preserve-3d"
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    <Check className="h-3 w-3 stroke-[3]" />
                  </motion.div>
                </div>
              </div>

              <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2 mb-1">
                <Edit3 className="h-5 w-5 text-primary" />
                إنشاء مهمة جديدة وتعيينها
              </h3>
              <p className="text-[11px] text-muted-foreground font-semibold mb-4">
                املأ الحقول أدناه لتعيين مهمة مخصصة لأعضاء الفريق بنجاح.
              </p>

              <form onSubmit={handleCreateTask} className="space-y-3.5">
                {/* Task Title */}
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    اسم المهمة
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ما هي المهمة الجديدة؟"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-250 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-right transition-all shadow-sm focus:border-primary/80"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    الوصف / التفاصيل
                  </label>
                  <textarea
                    rows={2.5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اكتب تفاصيل أو متطلبات المهمة هنا..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-250 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-right transition-all resize-none shadow-sm focus:border-primary/80"
                  />
                </div>

                {/* Custom Multi-Select Dropdown for Assigning Task - Solid White & Clean dropdown list */}
                <div className="relative">
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    تعيين المهمة إلى
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-white border border-slate-250 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-right shadow-sm cursor-pointer min-h-[38px] focus:border-primary/80"
                  >
                    <span>
                      {assignedTo.length === 0
                        ? 'اختر أعضاء الفريق...'
                        : `تم تحديد ${assignedTo.length} أعضاء`}
                    </span>
                    {/* Selected Avatars stack inside button */}
                    {assignedTo.length > 0 && (
                      <div className="flex items-center -space-x-1.5 space-x-reverse">
                        {assignedTo.slice(0, 3).map((id) => {
                          const user = approvedUsers.find(u => u._id === id);
                          if (!user) return null;
                          const ac = avatarColor(user.username);
                          return user.avatar ? (
                            <img key={user._id} src={user.avatar} className="h-5 w-5 rounded-full border border-card object-cover shrink-0" />
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
                        
                        {/* Solid white dropdown list panel */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.15 }}
                          className="absolute left-0 right-0 mt-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-600 max-h-48 overflow-y-auto z-40 space-y-0.5 text-right"
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
                                className={`w-full flex items-center gap-2.5 p-1.5 rounded-xl text-xs font-semibold text-right transition-all hover:bg-slate-50 cursor-pointer ${
                                  isSelected ? 'bg-primary/5 text-primary font-bold' : 'text-foreground'
                                }`}
                              >
                                {/* Custom Checkbox */}
                                <div className={`h-4 w-4 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                                  isSelected ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'
                                }`}>
                                  {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                                </div>
                                
                                {/* User avatar or fallback */}
                                {user.avatar ? (
                                  <img src={user.avatar} className="h-6 w-6 rounded-full object-cover shrink-0 shadow-200" />
                                ) : (
                                  <div className="h-6 w-6 rounded-full flex items-center justify-center text-[8px] font-bold uppercase shrink-0" style={{ background: ac.bg, border: `1px solid ${ac.border}`, color: ac.text }}>
                                    {getAvatarFallback(user.username)}
                                  </div>
                                )}
                                
                                {/* User Name & Email */}
                                <div className="flex flex-col grow select-none text-right">
                                  <span className="font-bold text-foreground flex items-center gap-1 justify-start">
                                    {user.username}
                                    {user.role === 'admin' && (
                                      <BadgeCheck className="h-4 w-4 text-blue-500 fill-blue-500/10 shrink-0" />
                                    )}
                                  </span>
                                  <span className="text-[9px] text-muted-foreground/80">{user.email}</span>
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

                <div className="grid grid-cols-2 gap-3">
                  {/* Task Type */}
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                      نوع المهمة
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as TaskType)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-250 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer text-right shadow-sm focus:border-primary/80"
                    >
                      <option value="feature">ميزة جديدة</option>
                      <option value="bug">إصلاح مشكلة (Bug)</option>
                      <option value="improvement">تحسين أداء</option>
                      <option value="documentation">توثيق / ملفات</option>
                    </select>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                      الأهمية
                    </label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TaskPriority)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-250 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer text-right shadow-sm focus:border-primary/80"
                    >
                      <option value="low">منخفضة</option>
                      <option value="medium">متوسطة</option>
                      <option value="high">عالية</option>
                      <option value="critical">حرجة</option>
                    </select>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-[11px] font-bold text-muted-foreground mb-1">
                    تاريخ الاستحقاق
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-muted-foreground/60">
                      <Calendar className="h-4 w-4" />
                    </span>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white border border-slate-250 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-right transition-all shadow-sm cursor-pointer focus:border-primary/80"
                    />
                  </div>
                </div>

                {/* Attachments Uploader (queue before task create) */}
                <div className="border-t border-border/30 pt-3">
                  <p className="text-[11px] font-bold text-muted-foreground mb-2">المرفقات (اختياري)</p>
                  <AttachmentUploader
                    onFilesQueued={(files) => setQueuedFiles(files)}
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/30 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateModalOpen(false);
                      setIsUserDropdownOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-muted hover:bg-muted/80 text-muted-foreground transition-all cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/95 transition-all shadow-200 cursor-pointer"
                  >
                    {isCreating ? 'جاري الإنشاء...' : 'إنشاء وتعيين'}
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
