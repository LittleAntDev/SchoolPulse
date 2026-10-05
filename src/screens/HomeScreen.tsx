import { useRef, useState } from 'react';
import {
  ChevronRight, FileText, BookOpen, MessageSquare, Users,
  Bell, PlusCircle, Upload, Video, LayoutDashboard,
  School, Settings, CalendarDays
} from 'lucide-react';
import type { User, Screen } from '../types';
import { NOTICES, ASSIGNMENTS, CALENDAR_EVENTS } from '../data';
import ComposerBar from '../components/ComposerBar';

const PILL_SETS: Record<string, { label: string; icon: React.ReactNode; screen: Screen }[]> = {
  parent: [
    { label: "Find a Note", icon: <FileText size={13} />, screen: 'content' },
    { label: "My Child's HW", icon: <BookOpen size={13} />, screen: 'homework' },
    { label: "Chat Class Teacher", icon: <MessageSquare size={13} />, screen: 'chat' },
    { label: "Classroom Group", icon: <Users size={13} />, screen: 'group-chat' },
    { label: "Contents Library", icon: <FileText size={13} />, screen: 'content' },
  ],
  student: [
    { label: "My Assignments", icon: <BookOpen size={13} />, screen: 'homework' },
    { label: "Homework Due", icon: <Bell size={13} />, screen: 'homework' },
    { label: "Notes & Content", icon: <FileText size={13} />, screen: 'content' },
    { label: "Ask Teacher", icon: <MessageSquare size={13} />, screen: 'chat' },
    { label: "Classroom", icon: <Users size={13} />, screen: 'group-chat' },
  ],
  teacher: [
    { label: "New Announcement", icon: <Bell size={13} />, screen: 'announcements' },
    { label: "Assign Homework", icon: <BookOpen size={13} />, screen: 'homework' },
    { label: "Upload Note", icon: <Upload size={13} />, screen: 'content' },
    { label: "Share YouTube", icon: <Video size={13} />, screen: 'content' },
    { label: "My Classrooms", icon: <Users size={13} />, screen: 'group-chat' },
  ],
  management: [
    { label: "Dashboard", icon: <LayoutDashboard size={13} />, screen: 'dashboard' },
    { label: "Manage Teachers", icon: <Users size={13} />, screen: 'dashboard' },
    { label: "School Notices", icon: <Bell size={13} />, screen: 'announcements' },
    { label: "Annual Calendar", icon: <CalendarDays size={13} />, screen: 'calendar' },
    { label: "Classrooms", icon: <Users size={13} />, screen: 'group-chat' },
  ],
  admin: [
    { label: "Dashboard", icon: <LayoutDashboard size={13} />, screen: 'dashboard' },
    { label: "Manage Schools", icon: <School size={13} />, screen: 'dashboard' },
    { label: "App Settings", icon: <Settings size={13} />, screen: 'dashboard' },
    { label: "School Notices", icon: <Bell size={13} />, screen: 'announcements' },
    { label: "Annual Calendar", icon: <CalendarDays size={13} />, screen: 'calendar' },
    { label: "Assign Homework", icon: <BookOpen size={13} />, screen: 'homework' },
  ],
};

function greeting(name: string) {
  const h = new Date().getHours();
  const prefix = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return `${prefix}, ${name.split(' ')[0]} 👋`;
}

const EVENT_COLORS: Record<string, string> = {
  holiday: 'bg-rose-50 text-rose-700 border-rose-200',
  exam: 'bg-amber-50 text-amber-700 border-amber-200',
  event: 'bg-blue-50 text-blue-700 border-blue-200',
  vacation: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const EVENT_DOT: Record<string, string> = {
  holiday: 'bg-rose-500',
  exam: 'bg-amber-500',
  event: 'bg-blue-500',
  vacation: 'bg-emerald-500',
};

function SwipeDismiss({
  children,
  onDismiss,
}: {
  children: React.ReactNode;
  onDismiss: () => void;
}) {
  const touchStart = useRef(0);
  const dragged = useRef(false);
  const [offset, setOffset] = useState(0);
  const [leaving, setLeaving] = useState(false);

  return (
    <div
      className="transition-transform duration-200"
      style={{ transform: `translateX(${leaving ? '-110%' : `${offset}px`})`, touchAction: 'pan-y' }}
      onTouchStart={event => {
        touchStart.current = event.touches[0].clientX;
        dragged.current = false;
      }}
      onTouchMove={event => {
        const distance = event.touches[0].clientX - touchStart.current;
        if (Math.abs(distance) > 8) dragged.current = true;
        setOffset(Math.min(0, distance));
      }}
      onTouchEnd={() => {
        if (offset < -72) {
          setLeaving(true);
          window.setTimeout(onDismiss, 180);
        } else {
          setOffset(0);
        }
      }}
      onClickCapture={event => {
        if (dragged.current) {
          event.preventDefault();
          event.stopPropagation();
          dragged.current = false;
        }
      }}
    >
      {children}
    </div>
  );
}

interface HomeScreenProps {
  user: User;
  onNav: (s: Screen) => void;
  onSendMessage: (msg: string) => void;
}

export default function HomeScreen({ user, onNav, onSendMessage }: HomeScreenProps) {
  const storageKey = `schoolpulse-hidden-home-cards-${user.id}`;
  const [hiddenCards, setHiddenCards] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) ?? '[]') as string[];
    } catch {
      return [];
    }
  });
  const unreadNotice = hiddenCards.includes('announcements') ? undefined : NOTICES.find(n => !n.read);
  const upcomingEvent = CALENDAR_EVENTS.find(e => e.date >= '2026-10-01');
  const dueAssignment = ASSIGNMENTS.find(a => !a.completed && a.daysLeft <= 2);
  const pills = PILL_SETS[user.role] ?? [];

  const dateStr = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  const hideCard = (id: string) => {
    setHiddenCards(current => {
      const next = current.includes(id) ? current : [...current, id];
      localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto hide-scroll">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-5 pb-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-[8px] flex items-center justify-center text-white text-xs font-bold"
              style={{ background: user.school.primary }}
            >
              {user.school.crest}
            </div>
            <span className="text-[13px] font-semibold text-[#0F172A] leading-tight">{user.school.name}</span>
          </div>
          <span className="text-[13px] text-[#94A3B8] font-medium">{dateStr}</span>
        </div>

        {/* Greeting */}
        <div className="px-4 pt-3 pb-4">
          <h1 className="text-[20px] font-bold text-[#0F172A] leading-tight">{greeting(user.name)}</h1>
          {user.role === 'parent' && user.childName && (
            <p className="text-[13px] text-[#94A3B8] mt-0.5">Viewing for {user.childName}</p>
          )}
        </div>

        {/* Keep the dashboard immediately visible for school leaders on mobile. */}
        {(user.role === 'management' || user.role === 'admin') && (
          <div className="px-4 mb-3 md:hidden">
            <button
              type="button"
              className="w-full rounded-[14px] border border-primary/20 bg-bg p-4 text-left hover:border-primary/40 transition-colors"
              onClick={() => onNav('dashboard')}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-[10px] bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
                  <LayoutDashboard size={19} className="text-primary" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-hi">Open Dashboard</p>
                  <p className="text-[12px] text-lo mt-0.5">School performance and activity</p>
                </div>
                <ChevronRight size={17} className="text-lo" strokeWidth={1.5} />
              </div>
            </button>
          </div>
        )}

        {/* Unread Notice Card */}
        {unreadNotice && (
          <div className="mx-4 mb-3 slide-up">
            <SwipeDismiss onDismiss={() => hideCard('announcements')}>
              <div
                className="rounded-[14px] border border-[#E2E8F0] bg-white overflow-hidden cursor-pointer hover:border-[#F59E0B]/50 transition-all"
                onClick={() => onNav('announcements')}
              >
                <div className="flex">
                  <div className="w-1 bg-[#F59E0B] shrink-0" />
                  <div className="flex-1 p-3.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-[#F59E0B] bg-amber-50 px-2 py-0.5 rounded-pill uppercase tracking-wide pulse-warn">New</span>
                      <span className="text-[10px] text-[#94A3B8]">{unreadNotice.time} · Swipe left to hide</span>
                    </div>
                    <p className="text-[14px] font-semibold text-[#0F172A] leading-snug mb-1">{unreadNotice.title}</p>
                    <p className="text-[13px] text-[#475569] line-clamp-2 leading-relaxed">{unreadNotice.summary}</p>
                    <div className="flex items-center gap-1 mt-2 text-[#2563EB] text-[13px] font-medium">
                      Read more <ChevronRight size={13} />
                    </div>
                  </div>
                </div>
              </div>
            </SwipeDismiss>
          </div>
        )}

        {/* Context Cards */}
        <div className="px-4 space-y-2.5 mb-3">
          {/* Calendar event */}
          {upcomingEvent && !hiddenCards.includes('calendar') && (
            <SwipeDismiss onDismiss={() => hideCard('calendar')}>
              <div
                className={`rounded-[14px] border p-3.5 cursor-pointer hover:shadow-sm transition-all ${EVENT_COLORS[upcomingEvent.type]}`}
                onClick={() => onNav('calendar')}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${EVENT_DOT[upcomingEvent.type]}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium uppercase tracking-wide opacity-70 capitalize">{upcomingEvent.type}</p>
                    <p className="text-[14px] font-semibold leading-snug truncate">{upcomingEvent.title}</p>
                    <p className="text-[10px] opacity-60 mt-1">Swipe left to hide</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[12px] font-medium opacity-80">
                      {new Date(upcomingEvent.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              </div>
            </SwipeDismiss>
          )}

          {/* Assignment */}
          {dueAssignment && (user.role === 'student' || user.role === 'parent') && (
            <div
              className="hidden md:block rounded-[14px] border border-[#E2E8F0] bg-white p-3.5 cursor-pointer hover:border-[#2563EB]/30 hover:shadow-sm transition-all"
              onClick={() => onNav('homework')}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[11px] font-semibold text-[#475569] uppercase tracking-wide">{dueAssignment.subject}</span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-pill ${
                      dueAssignment.daysLeft <= 1 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'
                    }`}>
                      Due {dueAssignment.daysLeft <= 0 ? 'today' : `in ${dueAssignment.daysLeft}d`}
                    </span>
                  </div>
                  <p className="text-[14px] font-semibold text-[#0F172A] leading-snug truncate">{dueAssignment.title}</p>
                  <p className="text-[12px] text-[#94A3B8] mt-0.5">{dueAssignment.classroom}</p>
                </div>
                <BookOpen size={18} className="text-[#94A3B8] mt-0.5 shrink-0" />
              </div>
            </div>
          )}

          {/* Teacher: pending submissions */}
          {user.role === 'teacher' && (
            <div
              className="rounded-[14px] border border-[#E2E8F0] bg-white p-3.5 cursor-pointer hover:border-[#2563EB]/30 hover:shadow-sm transition-all"
              onClick={() => onNav('homework')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[8px] bg-violet-50 flex items-center justify-center">
                  <BookOpen size={18} className="text-violet-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-[#0F172A]">Homework Pending Review</p>
                  <p className="text-[13px] text-[#94A3B8]">12 submissions awaiting feedback</p>
                </div>
                <ChevronRight size={16} className="text-[#94A3B8]" />
              </div>
            </div>
          )}

          {/* Management/Admin: quick stats */}
          {(user.role === 'management' || user.role === 'admin') && (
            <div
              className="rounded-[14px] border border-[#E2E8F0] bg-white p-3.5 cursor-pointer hover:border-[#2563EB]/30 hover:shadow-sm transition-all"
              onClick={() => onNav('dashboard')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[8px] bg-blue-50 flex items-center justify-center">
                  <LayoutDashboard size={18} className="text-[#2563EB]" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-[#0F172A]">School at a Glance</p>
                  <p className="text-[13px] text-[#94A3B8]">1,240 students · 48 teachers · 36 classes</p>
                </div>
                <ChevronRight size={16} className="text-[#94A3B8]" />
              </div>
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="px-4 pb-2">
          <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Quick Actions</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2 px-4 pb-4">
          {pills.map(pill => (
            <button
              key={pill.label}
              onClick={() => onNav(pill.screen)}
              className="min-h-20 flex flex-col items-start justify-between gap-3 p-3 rounded-[14px] border border-border bg-bg text-mid text-[12px] font-semibold text-left hover:border-primary/40 hover:text-primary hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all active:scale-[0.98]"
            >
              <span className="w-8 h-8 rounded-[8px] bg-surface text-primary flex items-center justify-center">
                {pill.icon}
              </span>
              <span className="leading-snug">{pill.label}</span>
            </button>
          ))}
        </div>

        {/* Recent Activity / Feed placeholder */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">Recent Updates</p>
            <button className="text-[12px] text-[#2563EB] font-medium">View all</button>
          </div>
          <div className="space-y-2">
            {NOTICES.slice(1).map(n => (
              <div
                key={n.id}
                className="flex items-start gap-3 rounded-[14px] border border-[#E2E8F0] bg-white p-3 cursor-pointer hover:border-[#2563EB]/20 transition-all"
                onClick={() => onNav('announcements')}
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-[#E2E8F0]' : 'bg-[#F59E0B]'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#0F172A] truncate">{n.title}</p>
                  <p className="text-[12px] text-[#94A3B8] mt-0.5">{n.author} · {n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-24" />
      </div>

      {/* Composer */}
      <ComposerBar onSend={onSendMessage} schoolPrimary={user.school.primary} />
    </div>
  );
}
