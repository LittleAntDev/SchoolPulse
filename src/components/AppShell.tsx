import { useState, useEffect } from 'react';
import type { User, Screen } from '../types';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';

interface AppShellProps {
  user: User;
  current: Screen;
  onNav: (s: Screen) => void;
  onLogout: () => void;
  dark: boolean;
  onToggleTheme: () => void;
  children: React.ReactNode;
}

export default function AppShell({ user, current, onNav, onLogout, dark, onToggleTheme, children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const usesFullDesktopWidth = [
    'announcements',
    'calendar',
    'content',
    'homework',
    'chat',
    'group-chat',
    'classroom-chat',
  ].includes(current);

  useEffect(() => {
    setSidebarCollapsed(window.innerWidth < 1200 && window.innerWidth >= 768);
  }, []);

  if (isMobile) {
    return (
      <div className="relative flex flex-col h-screen overflow-hidden bg-surface">
        <div className="fixed top-16 right-3 z-50">
          <ThemeToggle dark={dark} onToggle={onToggleTheme} compact />
        </div>
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar
        user={user}
        current={current}
        onNav={onNav}
        collapsed={sidebarCollapsed}
        onLogout={onLogout}
      />

      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Toggle sidebar button */}
        <div className="flex items-center px-4 py-2.5 border-b border-border bg-bg">
          <button
            onClick={() => setSidebarCollapsed(c => !c)}
            className="p-1.5 rounded-[6px] text-[#94A3B8] hover:bg-[#F7F8FA] hover:text-[#475569] transition-all"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="3" width="14" height="1.5" rx="0.75" fill="currentColor" />
              <rect x="1" y="7.25" width="14" height="1.5" rx="0.75" fill="currentColor" />
              <rect x="1" y="11.5" width="14" height="1.5" rx="0.75" fill="currentColor" />
            </svg>
          </button>
          <div className="flex-1" />
          <ThemeToggle dark={dark} onToggle={onToggleTheme} />
          {/* Desktop right rail quick stats */}
          <div className="flex items-center gap-4 text-[12px] text-[#94A3B8]">
            <span className="font-medium text-[#0F172A]">{user.school.name}</span>
            <div className="w-px h-4 bg-[#E2E8F0]" />
            <span>AY 2026–27</span>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Main content — max-width feed */}
          <div className="flex-1 overflow-hidden">
            <div className={`h-full ${usesFullDesktopWidth ? 'w-full' : 'max-w-[760px] mx-auto'}`}>
              {children}
            </div>
          </div>

          {/* Right rail — management/admin only */}
          {!usesFullDesktopWidth && (user.role === 'management' || user.role === 'admin') && (
            <div className="w-[280px] border-l border-[#E2E8F0] bg-white overflow-y-auto hide-scroll p-4 shrink-0">
              <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">KPI Overview</p>
              <div className="space-y-2.5">
                {[
                  { label: 'Teachers', value: '48', delta: '+2' },
                  { label: 'Students', value: '1,240', delta: '+45' },
                  { label: 'Classrooms', value: '36', delta: '—' },
                  { label: 'Content Items', value: '284', delta: '+18' },
                ].map(kpi => (
                  <div key={kpi.label} className="flex items-center justify-between p-3 rounded-[8px] bg-[#F7F8FA]">
                    <div>
                      <p className="text-[18px] font-bold text-[#0F172A]">{kpi.value}</p>
                      <p className="text-[11px] text-[#94A3B8]">{kpi.label}</p>
                    </div>
                    <span className="text-[12px] font-semibold text-[#10B981]">{kpi.delta}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                <p className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Recent Activity</p>
                <div className="space-y-2">
                  {[
                    { text: 'Ms. Kavitha uploaded Biology notes', time: '9 min ago' },
                    { text: 'Notice published: Sports Day', time: '2h ago' },
                    { text: 'Homework assigned: Class 9-A', time: '3h ago' },
                  ].map((a, i) => (
                    <div key={i} className="text-[12px]">
                      <p className="text-[#475569] leading-snug">{a.text}</p>
                      <p className="text-[#94A3B8]">{a.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
