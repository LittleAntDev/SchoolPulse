import { useState } from 'react';
import { ArrowLeft, Users, LayoutDashboard, FileText, TrendingUp, TrendingDown, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import type { User } from '../types';
import { TEACHERS, UPLOAD_STATS, CLASSROOMS_DATA, SCHOOLS } from '../data';

const STATS = [
  { label: 'Teachers', value: 48, delta: 2, icon: <Users size={18} />, color: '#2563EB', bg: 'bg-blue-50' },
  { label: 'Students', value: 1240, delta: 45, icon: <Users size={18} />, color: '#10B981', bg: 'bg-emerald-50' },
  { label: 'Classrooms', value: 36, delta: 0, icon: <LayoutDashboard size={18} />, color: '#7C3AED', bg: 'bg-violet-50' },
  { label: 'Content Items', value: 284, delta: 18, icon: <FileText size={18} />, color: '#F59E0B', bg: 'bg-amber-50' },
];

const DONUT_DATA = [
  { name: 'Read', value: 68, color: '#10B981' },
  { name: 'Unread', value: 32, color: '#E2E8F0' },
];

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  inactive: 'bg-[#F7F8FA] text-[#94A3B8]',
};

interface DashboardScreenProps {
  user: User;
  onBack: () => void;
}

function SchoolThemePreview({ school }: { school: (typeof SCHOOLS)[keyof typeof SCHOOLS] }) {
  return (
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-7 h-7 rounded-[8px] flex items-center justify-center text-white text-[10px] font-bold" style={{ background: school.primary }}>
          {school.crest}
        </span>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-hi truncate">{school.name}</p>
          <p className="text-[10px] text-lo">Live theme preview</p>
        </div>
      </div>
      <div className="rounded-[14px] border border-border bg-surface overflow-hidden">
        <div className="h-2" style={{ background: school.primary }} />
        <div className="p-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-pill text-white flex items-center justify-center text-[9px] font-bold" style={{ background: school.primary }}>
              {school.crest}
            </div>
            <div>
              <div className="w-20 h-2 rounded-pill bg-border" />
              <div className="w-12 h-1.5 rounded-pill bg-border mt-1.5" />
            </div>
          </div>
          <div className="rounded-[8px] bg-bg border border-border p-2.5 mt-3">
            <p className="text-[10px] font-semibold text-hi">Welcome back, Arjun</p>
            <p className="text-[9px] text-lo mt-0.5">You have 2 updates today</p>
          </div>
          <button
            type="button"
            className="w-full rounded-pill text-white text-[10px] font-semibold py-2 mt-2"
            style={{ background: school.primary }}
          >
            View updates
          </button>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-pill" style={{ background: school.accent }} />
            <span className="text-[9px] text-lo">Accent and status color</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-mid">
        <ShieldCheck size={12} className="text-accent" strokeWidth={1.5} />
        WCAG AA on primary CTA
      </div>
    </div>
  );
}

export default function DashboardScreen({ user, onBack }: DashboardScreenProps) {
  const [tab, setTab] = useState<'overview' | 'teachers' | 'schools'>('overview');

  const isAdmin = user.role === 'admin';

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <button onClick={onBack} className="text-[#475569] hover:text-[#0F172A] p-1 -ml-1">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-[16px] font-bold text-[#0F172A] flex-1">Dashboard</h2>
        <span className="text-[12px] text-[#94A3B8] font-medium bg-[#F7F8FA] px-2.5 py-1 rounded-pill border border-[#E2E8F0]">
          AY 2026–27
        </span>
      </div>

      {/* Tab nav */}
      <div className="flex border-b border-[#E2E8F0] bg-white px-4 overflow-x-auto hide-scroll">
        {([
          { key: 'overview', label: 'Overview' },
          { key: 'teachers', label: 'Teachers' },
          ...(isAdmin ? [{ key: 'schools', label: 'Schools' }] : []),
        ] as { key: string; label: string }[]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`py-3 px-4 text-[14px] font-medium border-b-2 whitespace-nowrap transition-all ${
              tab === t.key ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#94A3B8] hover:text-[#475569]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto hide-scroll">
        {tab === 'overview' && (
          <div className="p-4 space-y-5">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
              {STATS.map(s => (
                <div key={s.label} className="bg-white rounded-[14px] border border-[#E2E8F0] p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-9 h-9 rounded-[8px] flex items-center justify-center ${s.bg}`} style={{ color: s.color }}>
                      {s.icon}
                    </div>
                    <div className={`flex items-center gap-0.5 text-[12px] font-semibold ${s.delta >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      {s.delta >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      +{Math.abs(s.delta)}
                    </div>
                  </div>
                  <p className="text-[24px] font-bold text-[#0F172A] leading-none">{s.value.toLocaleString()}</p>
                  <p className="text-[12px] text-[#94A3B8] mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Content uploads area chart */}
            <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-4">
              <p className="text-[14px] font-semibold text-[#0F172A] mb-1">Content Uploads</p>
              <p className="text-[12px] text-[#94A3B8] mb-4">Past 4 months</p>
              <ResponsiveContainer width="100%" height={120}>
                <AreaChart data={UPLOAD_STATS} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="upGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={user.school.primary} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={user.school.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ fontWeight: 600, color: '#0F172A' }}
                  />
                  <Area type="monotone" dataKey="uploads" stroke={user.school.primary} strokeWidth={2} fill="url(#upGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Active classrooms bar */}
            <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-4">
              <p className="text-[14px] font-semibold text-[#0F172A] mb-1">Active Classrooms</p>
              <p className="text-[12px] text-[#94A3B8] mb-4">Students per class</p>
              <ResponsiveContainer width="100%" height={100}>
                <BarChart data={CLASSROOMS_DATA} barSize={24} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ border: '1px solid #E2E8F0', borderRadius: 8, fontSize: 12 }}
                    cursor={{ fill: 'rgba(0,0,0,0.04)' }}
                  />
                  <Bar dataKey="students" radius={[4, 4, 0, 0]} fill={user.school.primary} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Notice read-rate donut */}
            <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-4">
              <p className="text-[14px] font-semibold text-[#0F172A] mb-4">Notice Read Rate</p>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width={100} height={100}>
                  <PieChart>
                    <Pie data={DONUT_DATA} cx="50%" cy="50%" innerRadius={28} outerRadius={44} dataKey="value" startAngle={90} endAngle={-270} strokeWidth={0}>
                      {DONUT_DATA.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div>
                  <p className="text-[32px] font-bold text-[#0F172A] leading-none">68%</p>
                  <p className="text-[13px] text-[#94A3B8] mt-1">Read rate</p>
                  <div className="flex gap-4 mt-2">
                    {DONUT_DATA.map(d => (
                      <div key={d.name} className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                        <span className="text-[12px] text-[#475569]">{d.name} {d.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Academic year rollover banner */}
            <div className="rounded-[14px] border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[14px] font-semibold text-amber-800">Academic Year 2027–28 approaching</p>
                  <p className="text-[13px] text-amber-700 mt-0.5 leading-relaxed">
                    Classrooms will be re-created automatically. Students and parents will be re-linked. Old classrooms are archived as read-only.
                  </p>
                  <button className="mt-2 text-[13px] font-semibold text-amber-800 underline underline-offset-2">
                    Review promotion settings →
                  </button>
                </div>
              </div>
            </div>

            {/* Archived classroom example */}
            <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-4 opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[8px] bg-[#F7F8FA] flex items-center justify-center">
                  <LayoutDashboard size={16} className="text-[#94A3B8]" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-[#475569]">Class 8-A (2025–26)</p>
                  <p className="text-[12px] text-[#94A3B8]">Archived · Read-only</p>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-pill bg-[#F7F8FA] text-[#94A3B8] border border-[#E2E8F0]">
                  Closed 2025–26
                </span>
              </div>
            </div>
          </div>
        )}

        {tab === 'teachers' && (
          <div className="p-4">
            <div className="space-y-2.5">
              {TEACHERS.map(t => (
                <div key={t.id} className="bg-white rounded-[14px] border border-[#E2E8F0] p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
                      style={{ background: user.school.primary }}
                    >
                      {t.name.split(' ').slice(-1)[0][0]}{t.name.split(' ')[0][0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-semibold text-[#0F172A] truncate">{t.name}</p>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-pill ${STATUS_COLORS[t.status]}`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-[12px] text-[#94A3B8]">{t.subject}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {t.classrooms.map(c => (
                          <span key={c} className="text-[11px] font-medium px-2 py-0.5 rounded-[4px] bg-blue-50 text-blue-700">{c}</span>
                        ))}
                      </div>
                    </div>
                    <button className="text-[12px] font-medium text-[#2563EB] shrink-0 hover:underline">
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'schools' && isAdmin && (
          <div className="p-4">
            <p className="text-[13px] font-semibold text-[#475569] uppercase tracking-wide mb-3">Multi-School Tenancy</p>
            <section className="bg-bg rounded-[14px] border border-border p-4 mb-4">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-[14px] font-bold text-hi">Theme comparison</p>
                  <p className="text-[12px] text-lo mt-0.5">Compare tenant branding before publishing.</p>
                </div>
                <span className="text-[10px] font-semibold text-accent bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-pill whitespace-nowrap">
                  2 themes active
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {Object.values(SCHOOLS).map(school => (
                  <SchoolThemePreview key={school.id} school={school} />
                ))}
              </div>
            </section>
            <div className="grid gap-3">
              {Object.values(SCHOOLS).map(school => (
                <div key={school.id} className="bg-white rounded-[14px] border border-[#E2E8F0] p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-[14px] flex items-center justify-center text-white font-bold text-[15px]"
                      style={{ background: school.primary }}
                    >
                      {school.crest}
                    </div>
                    <div>
                      <p className="text-[15px] font-bold text-[#0F172A]">{school.name}</p>
                      <p className="text-[12px] text-[#94A3B8]">ID: {school.id}</p>
                    </div>
                    <div className="ml-auto">
                      <CheckCircle2 size={18} className="text-[#10B981]" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1 text-center p-2 bg-[#F7F8FA] rounded-[8px]">
                      <p className="text-[18px] font-bold text-[#0F172A]">620</p>
                      <p className="text-[11px] text-[#94A3B8]">Students</p>
                    </div>
                    <div className="flex-1 text-center p-2 bg-[#F7F8FA] rounded-[8px]">
                      <p className="text-[18px] font-bold text-[#0F172A]">24</p>
                      <p className="text-[11px] text-[#94A3B8]">Teachers</p>
                    </div>
                    <div className="flex-1 text-center p-2 bg-[#F7F8FA] rounded-[8px]">
                      <p className="text-[18px] font-bold text-[#0F172A]">18</p>
                      <p className="text-[11px] text-[#94A3B8]">Classes</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className="w-5 h-5 rounded-full" style={{ background: school.primary }} title={`Primary: ${school.primary}`} />
                    <div className="w-5 h-5 rounded-full" style={{ background: school.accent }} title={`Accent: ${school.accent}`} />
                    <span className="text-[11px] text-[#94A3B8] ml-1">Brand colors</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
