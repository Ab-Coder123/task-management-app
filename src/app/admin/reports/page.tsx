'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/shared/PageHeader';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { apiFetch } from '@/lib/api/base';
import { Download, FileText, CheckCircle2, AlertTriangle, Users, BarChart3, TrendingUp, ShieldCheck } from 'lucide-react';
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
    <div className="space-y-6 pb-12" dir="rtl">
      <PageHeader
        title="التقارير المتقدمة وتصدير البيانات"
        description="تحليل شامل لإنتاجية المهام، أداء الأعضاء، وتصدير التقارير الرسمية"
        action={
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              disabled={exporting}
              className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-primary-500 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>تصدير المهام (CSV)</span>
            </button>
            <button
              onClick={handleExportJSON}
              disabled={exporting}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
            >
              <FileText className="h-4 w-4" />
              <span>تقرير تحليلي (JSON)</span>
            </button>
          </div>
        }
      />

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">إجمالي المهام</span>
            <BarChart3 className="h-6 w-6 text-primary-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">{overview?.totalTasks || 0}</p>
          <p className="mt-1 text-xs text-slate-500">مسجلة بالنظام</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">معدل الإنجاز</span>
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-emerald-400">{overview?.completionRate || 0}%</p>
          <p className="mt-1 text-xs text-slate-500">مكتملة بنجاح ({overview?.completedTasks || 0} مهمة)</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">الأعضاء المعتمدين</span>
            <ShieldCheck className="h-6 w-6 text-indigo-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">{overview?.verifiedUsers || 0}</p>
          <p className="mt-1 text-xs text-slate-500">من إجمالي {overview?.totalUsers || 0} عضو</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">نشاط التعليقات</span>
            <TrendingUp className="h-6 w-6 text-amber-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">{overview?.totalComments || 0}</p>
          <p className="mt-1 text-xs text-slate-500">تعليق ومناقشة تفاعلية</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Priority breakdown */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg lg:col-span-1">
          <h3 className="mb-4 text-base font-bold text-white">توزيع المهام حسب الأولوية</h3>
          <div className="space-y-4">
            <div>
              <div className="mb-1 flex justify-between text-xs font-semibold">
                <span className="text-rose-400">أولوية عالية (High)</span>
                <span className="text-slate-300">{overview?.highPriorityTasks || 0}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{
                    width: `${
                      overview?.totalTasks ? Math.min(100, Math.round(((overview.highPriorityTasks || 0) / overview.totalTasks) * 100)) : 0
                    }%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-xs font-semibold">
                <span className="text-amber-400">أولوية متوسطة (Medium)</span>
                <span className="text-slate-300">{overview?.mediumPriorityTasks || 0}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{
                    width: `${
                      overview?.totalTasks ? Math.min(100, Math.round(((overview.mediumPriorityTasks || 0) / overview.totalTasks) * 100)) : 0
                    }%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="mb-1 flex justify-between text-xs font-semibold">
                <span className="text-emerald-400">أولوية منخفضة (Low)</span>
                <span className="text-slate-300">{overview?.lowPriorityTasks || 0}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
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

        {/* Top Performers Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg lg:col-span-2">
          <h3 className="mb-4 text-base font-bold text-white">أفضل الأعضاء إنجازاً للمهام</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-semibold text-slate-400">
                  <th className="pb-3">العضو</th>
                  <th className="pb-3">المهام المكتملة</th>
                  <th className="pb-3">إجمالي المهام</th>
                  <th className="pb-3">النقاط</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(data?.topPerformers || []).length > 0 ? (
                  (data?.topPerformers || []).map((u) => (
                    <tr key={u._id} className="transition hover:bg-slate-800/40">
                      <td className="py-3 font-medium text-white">{u.username}</td>
                      <td className="py-3 font-semibold text-emerald-400">{u.completedTasks}</td>
                      <td className="py-3 text-slate-300">{u.totalTasks}</td>
                      <td className="py-3 font-bold text-amber-400">{u.points} نقطة</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      لا توجد بيانات متاحة حالياً
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
