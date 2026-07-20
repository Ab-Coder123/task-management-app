'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { apiFetch } from '@/lib/api/base';
import { Download, FileText, CheckCircle2, Users, BarChart3, TrendingUp, ShieldCheck, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface SummaryData {
  overview: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    pendingTasks: number;
    highPriorityTasks: number;
    mediumPriorityTasks: number;
    lowPriorityTasks: number;
    completionRate: number;
    totalUsers: number;
    verifiedUsers: number;
    totalComments: number;
  };
  topPerformers: Array<{
    _id: string;
    username: string;
    email: string;
    role: string;
    points: number;
    completedTasks: number;
    totalTasks: number;
  }>;
  recentTasks: Array<{
    _id: string;
    title: string;
    status: string;
    priority: string;
    category?: string;
  }>;
}

const pageVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } }
};

export default function AdminReportsPage() {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await apiFetch<SummaryData>('/api/reports/summary');
      setData(res);
    } catch (err: any) {
      toast.error(err.message || 'فشل في تحميل التحليلات والتقارير');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const exportData = await apiFetch<{ tasks: Array<any> }>('/api/reports/export/tasks');
      const rows = exportData.tasks || [];
      if (rows.length === 0) {
        toast.error('لا توجد مهام لتصديرها حالياً');
        return;
      }

      const headers = ['ID', 'Title', 'Category', 'Status', 'Priority', 'Points', 'Created At'];
      const csvContent = [
        headers.join(','),
        ...rows.map((r) =>
          [
            `"${r.id}"`,
            `"${(r.title || '').replace(/"/g, '""')}"`,
            `"${r.category || ''}"`,
            `"${r.status || ''}"`,
            `"${r.priority || ''}"`,
            r.points || 0,
            `"${r.createdAt || ''}"`
          ].join(',')
        )
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `TaskManagement_Report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('تم تصدير تقرير المهام (CSV) بنجاح');
    } catch (err: any) {
      toast.error('فشل في تصدير البيانات');
    } finally {
      setExporting(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      setExporting(true);
      const summary = data || (await apiFetch<SummaryData>('/api/reports/summary'));
      const blob = new Blob([JSON.stringify(summary, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `TaskManagement_Analytics_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('تم تصدير تقرير التحليلات الشامل (JSON) بنجاح');
    } catch (err: any) {
      toast.error('فشل في تصدير التقرير الشامل');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const overview = data?.overview;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="space-y-6 pb-12 text-right"
      dir="rtl"
    >
      <PageHeader
        title="التقارير المتقدمة وتصدير البيانات"
        description="تحليل شامل لإنتاجية المهام، أداء الأعضاء، وتصدير التقارير الإحصائية الرسمية"
        action={
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-extrabold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>تصدير المهام (CSV)</span>
            </button>
            <button
              onClick={handleExportJSON}
              disabled={exporting}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-extrabold text-foreground shadow-sm transition hover:bg-muted disabled:opacity-50 cursor-pointer"
            >
              <FileText className="h-4 w-4 text-primary" />
              <span>تقرير تحليلي (JSON)</span>
            </button>
          </div>
        }
      />

      {/* KPI Overview Cards - 100% Semantic Design & Responsive Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-100 hover:shadow-200 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">إجمالي المهام</span>
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-foreground">{overview?.totalTasks || 0}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">مسجلة بالنظام</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-100 hover:shadow-200 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">معدل الإنجاز</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{overview?.completionRate || 0}%</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">مكتملة بنجاح ({overview?.completedTasks || 0} مهمة)</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-100 hover:shadow-200 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">الأعضاء المعتمدون</span>
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-foreground">{overview?.verifiedUsers || 0}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">من إجمالي {overview?.totalUsers || 0} عضو</p>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-100 hover:shadow-200 transition-all duration-300">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">نشاط التعليقات</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-3xl font-extrabold text-foreground">{overview?.totalComments || 0}</p>
          <p className="mt-1 text-xs font-semibold text-muted-foreground">تعليق ومناقشة تفاعلية</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Priority breakdown - Semantic Tokens */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-100 lg:col-span-1 space-y-5">
          <h3 className="text-base font-extrabold text-foreground border-b border-border/40 pb-3">توزيع المهام حسب الأولوية</h3>
          <div className="space-y-4">
            <div>
              <div className="mb-1.5 flex justify-between text-xs font-bold">
                <span className="text-rose-600 dark:text-rose-400">أولوية عالية (High / Critical)</span>
                <span className="text-foreground">{overview?.highPriorityTasks || 0}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-rose-500 transition-all duration-500 rounded-full"
                  style={{
                    width: `${
                      overview?.totalTasks ? Math.min(100, Math.round(((overview.highPriorityTasks || 0) / overview.totalTasks) * 100)) : 0
                    }%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex justify-between text-xs font-bold">
                <span className="text-amber-600 dark:text-amber-400">أولوية متوسطة (Medium)</span>
                <span className="text-foreground">{overview?.mediumPriorityTasks || 0}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                  style={{
                    width: `${
                      overview?.totalTasks ? Math.min(100, Math.round(((overview.mediumPriorityTasks || 0) / overview.totalTasks) * 100)) : 0
                    }%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex justify-between text-xs font-bold">
                <span className="text-emerald-600 dark:text-emerald-400">أولوية منخفضة (Low)</span>
                <span className="text-foreground">{overview?.lowPriorityTasks || 0}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
                  style={{
                    width: `${
                      overview?.totalTasks ? Math.min(100, Math.round(((overview.lowPriorityTasks || 0) / overview.totalTasks) * 100)) : 0
                    }%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Top Performers Table - Fully Responsive & Semantic */}
        <div className="rounded-2xl border border-border/80 dark:border-transparent bg-card dark:bg-[#0f172a] p-6 shadow-100 dark:shadow-2xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              <span>أفضل الأعضاء إنجازاً للمهام</span>
            </h3>
            <span className="text-xs font-semibold text-muted-foreground">ترتيب تصاعدي بالنقاط</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs md:text-sm">
              <thead>
                <tr className="border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="pb-3 px-2">العضو</th>
                  <th className="pb-3 px-2">المهام المكتملة</th>
                  <th className="pb-3 px-2">إجمالي المهام</th>
                  <th className="pb-3 px-2">النقاط</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {(data?.topPerformers || []).length > 0 ? (
                  (data?.topPerformers || []).map((u, index) => (
                    <tr key={u._id} className="transition hover:bg-muted/50 font-semibold">
                      <td className="py-3 px-2 flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-amber-500/15 text-amber-600 border border-amber-500/30' :
                          index === 1 ? 'bg-slate-400/15 text-slate-600 dark:text-slate-300 border border-slate-400/30' :
                          index === 2 ? 'bg-amber-700/15 text-amber-700 dark:text-amber-500 border border-amber-700/30' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </span>
                        <span className="font-extrabold text-foreground">{u.username}</span>
                      </td>
                      <td className="py-3 px-2 font-extrabold text-emerald-600 dark:text-emerald-400">{u.completedTasks}</td>
                      <td className="py-3 px-2 text-muted-foreground">{u.totalTasks}</td>
                      <td className="py-3 px-2 font-extrabold text-amber-600 dark:text-amber-400">{u.points} نقطة</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-muted-foreground font-bold">
                      لا توجد بيانات متاحة حالياً
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
