import {
  MessageSquare, Bell, CalendarDays, FileText, BookOpen,
  Users, Settings, LayoutDashboard, School, ChevronDown, LogOut
} from 'lucide-react';
import type { Screen, User } from '../types';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  screen: Screen;
  roles: string[];
}

const NAV_ITEMS: SidebarItem[] = [
  { icon: <MessageSquare size={18} />, label: 'Home', screen: 'home', roles: ['parent', 'student', 'teacher', 'management', 'admin'] },
  { icon: <Bell size={18} />, label: 'Announcements', screen: 'announcements', roles: ['parent', 'student', 'teacher', 'management', 'admin'] },
  { icon: <CalendarDays size={18} />, label: 'Calendar', screen: 'calendar', roles: ['parent', 'student', 'teacher', 'management', 'admin'] },
  { icon: <FileText size={18} />, label: 'Content', screen: 'content', roles: ['parent', 'student', 'teacher', 'management', 'admin'] },
  { icon: <BookOpen size={18} />, label: 'Homework', screen: 'homework', roles: ['parent', 'student', 'teacher'] },
  { icon: <MessageSquare size={18} />, label: 'Direct Messages', screen: 'chat', roles: ['parent', 'student', 'teacher', 'management', 'admin'] },
  { icon: <Users size={18} />, label: 'Classrooms', screen: 'group-chat', roles: ['parent', 'student', 'teacher', 'management', 'admin'] },
  { icon: <LayoutDashboard size={18} />, label: 'Dashboard', screen: 'dashboard', roles: ['management', 'admin'] },
  { icon: <School size={18} />, label: 'Manage Schools', screen: 'dashboard', roles: ['admin'] },
  { icon: <Settings size={18} />, label: 'App Settings', screen: 'dashboard', roles: ['admin'] },
];

const ROLE_BADGE: Record<string, { label: string; color: string }> = {
  parent: { label: 'Parent', color: 'bg-blue-100 text-blue-700' },
  student: { label: 'Student', color: 'bg-emerald-100 text-emerald-700' },
  teacher: { label: 'Teacher', color: 'bg-violet-100 text-violet-700' },
  management: { label: 'Principal', color: 'bg-amber-100 text-amber-700' },
  admin: { label: 'Admin', color: 'bg-rose-100 text-rose-700' },
};

interface SidebarProps {
  user: User;
  current: Screen;
  onNav: (s: Screen) => void;
  collapsed?: boolean;
  onLogout: () => void;
}

export default function Sidebar({ user, current, onNav, collapsed = false, onLogout }: SidebarProps) {
  const items = NAV_ITEMS.filter(i => i.roles.includes(user.role));
  const badge = ROLE_BADGE[user.role];

  return (
    <aside
      className={`h-screen bg-white border-r border-[#E2E8F0] flex flex-col transition-all duration-200 shrink-0 ${collapsed ? 'w-[60px]' : 'w-[220px]'}`}
      style={{ '--school-primary': user.school.primary } as React.CSSProperties}
    >
      {/* School header */}
      <div className={`flex items-center gap-3 p-4 border-b border-[#E2E8F0] ${collapsed ? 'justify-center px-0' : ''}`}>
        <div
          className="w-9 h-9 rounded-[8px] flex items-center justify-center text-white text-xs font-bold shrink-0"
          style={{ background: user.school.primary }}
        >
          {user.school.crest}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#0F172A] truncate leading-tight">{user.school.name}</p>
            <button className="text-[11px] text-[#94A3B8] flex items-center gap-0.5 hover:text-[#475569]">
              Switch <ChevronDown size={10} />
            </button>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto hide-scroll">
        {items.map(item => {
          const active = current === item.screen || (current === 'classroom-chat' && item.screen === 'group-chat');
          return (
            <button
              key={item.label}
              onClick={() => onNav(item.screen)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 mx-1 rounded-[8px] text-[13px] font-medium transition-all
                ${collapsed ? 'justify-center w-[44px] mx-auto' : ''}
                ${active
                  ? 'text-white'
                  : 'text-[#475569] hover:bg-[#F7F8FA] hover:text-[#0F172A]'}`}
              style={active ? { background: user.school.primary } : {}}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className={`p-3 border-t border-[#E2E8F0] ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: user.school.primary }}
          >
            {user.avatar}
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ background: user.school.primary }}
            >
              {user.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#0F172A] truncate">{user.name}</p>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-pill font-medium ${badge.color}`}>{badge.label}</span>
            </div>
            <button onClick={onLogout} className="text-[#94A3B8] hover:text-[#475569] transition-colors" title="Sign out">
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
