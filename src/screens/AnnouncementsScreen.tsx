import { useState } from 'react';
import { ArrowLeft, Plus, X, ChevronRight, Bell, Clock, Users } from 'lucide-react';
import type { User, Notice } from '../types';
import { NOTICES } from '../data';

const PRIORITY_STYLE: Record<string, string> = {
  urgent: 'border-l-4 border-l-[#F59E0B]',
  normal: 'border-l-4 border-l-[#E2E8F0]',
};

function ComposerModal({ onClose, schoolPrimary }: { onClose: () => void; schoolPrimary: string }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [audience, setAudience] = useState('all');
  const [channels, setChannels] = useState({ inapp: true, sms: false, email: false });
  const [scheduled, setScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');

  const toggleChannel = (k: keyof typeof channels) =>
    setChannels(prev => ({ ...prev, [k]: !prev[k] }));

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-[24px] sm:rounded-[24px] w-full max-w-[520px] overflow-hidden max-h-[90vh] overflow-y-auto hide-scroll">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] sticky top-0 bg-white">
          <h3 className="font-semibold text-[#0F172A]">New Announcement</h3>
          <button onClick={onClose} className="text-[#94A3B8]"><X size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Title */}
          <div>
            <label className="text-[12px] font-semibold text-[#475569] uppercase tracking-wide mb-1.5 block">Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. School Closed – Gandhi Jayanti"
              className="w-full border border-[#E2E8F0] rounded-[8px] px-3 py-2.5 text-[14px] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20"
            />
          </div>

          {/* Body */}
          <div>
            <label className="text-[12px] font-semibold text-[#475569] uppercase tracking-wide mb-1.5 block">Message</label>
            <div className="border border-[#E2E8F0] rounded-[8px] overflow-hidden focus-within:border-[#2563EB]">
              {/* Lite toolbar */}
              <div className="flex gap-1 px-2 py-1.5 border-b border-[#E2E8F0] bg-[#F7F8FA]">
                {['B', 'I', 'U'].map(f => (
                  <button key={f} className="w-6 h-6 rounded-[4px] text-[12px] font-bold text-[#475569] hover:bg-[#E2E8F0] flex items-center justify-center">{f}</button>
                ))}
                <div className="w-px bg-[#E2E8F0] mx-1" />
                {['• List', '1. List'].map(f => (
                  <button key={f} className="px-2 h-6 rounded-[4px] text-[11px] text-[#475569] hover:bg-[#E2E8F0]">{f}</button>
                ))}
              </div>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={4}
                placeholder="Write your announcement…"
                className="w-full px-3 py-2.5 text-[14px] text-[#0F172A] placeholder-[#94A3B8] outline-none resize-none"
              />
            </div>
          </div>

          {/* Audience */}
          <div>
            <label className="text-[12px] font-semibold text-[#475569] uppercase tracking-wide mb-2 block">Audience</label>
            <div className="flex flex-wrap gap-2">
              {[
                { val: 'all', label: 'All School', icon: <Users size={12} /> },
                { val: 'classes', label: 'Selected Classes', icon: <Users size={12} /> },
                { val: 'single', label: 'Single Classroom', icon: <Users size={12} /> },
              ].map(a => (
                <button
                  key={a.val}
                  onClick={() => setAudience(a.val)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-pill border text-[13px] font-medium transition-all ${
                    audience === a.val
                      ? 'text-white border-transparent'
                      : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#2563EB]/30'
                  }`}
                  style={audience === a.val ? { background: schoolPrimary } : {}}
                >
                  {a.icon} {a.label}
                </button>
              ))}
            </div>
            {audience === 'classes' && (
              <div className="mt-2 flex flex-wrap gap-2">
                {['Class 9-A', 'Class 9-B', 'Class 10-A', 'Class 10-B'].map(c => (
                  <label key={c} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded accent-[#2563EB]" />
                    <span className="text-[13px] text-[#0F172A]">{c}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Channels */}
          <div>
            <label className="text-[12px] font-semibold text-[#475569] uppercase tracking-wide mb-2 block">Channels</label>
            <div className="space-y-2">
              {[
                { key: 'inapp' as const, label: 'In-app notification', desc: 'Push to app immediately' },
                { key: 'sms' as const, label: 'SMS', desc: 'Text to registered numbers' },
                { key: 'email' as const, label: 'Email', desc: 'Send to parent email addresses' },
              ].map(ch => (
                <label key={ch.key} className="flex items-center gap-3 cursor-pointer p-2.5 rounded-[8px] hover:bg-[#F7F8FA]">
                  <div
                    className={`w-10 h-6 rounded-pill transition-all cursor-pointer ${channels[ch.key] ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]'}`}
                    onClick={() => toggleChannel(ch.key)}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-sm m-0.5 transition-all ${channels[ch.key] ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-[#0F172A]">{ch.label}</p>
                    <p className="text-[12px] text-[#94A3B8]">{ch.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Schedule send */}
          <div>
            <label className="flex items-center gap-2.5 cursor-pointer mb-2">
              <input
                type="checkbox"
                className="w-4 h-4 rounded accent-[#2563EB]"
                checked={scheduled}
                onChange={e => setScheduled(e.target.checked)}
              />
              <span className="text-[13px] font-medium text-[#0F172A]">Schedule send</span>
            </label>
            {scheduled && (
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={e => setScheduleDate(e.target.value)}
                className="w-full border border-[#E2E8F0] rounded-[8px] px-3 py-2.5 text-[14px] outline-none focus:border-[#2563EB]"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              className="flex-1 h-11 rounded-[8px] border border-[#E2E8F0] text-[#475569] font-semibold hover:bg-[#F7F8FA]"
              onClick={onClose}
            >
              Save Draft
            </button>
            <button
              className="flex-1 h-11 rounded-[8px] text-white font-semibold"
              style={{ background: schoolPrimary }}
              onClick={onClose}
            >
              {scheduled ? 'Schedule' : 'Publish Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AnnouncementsScreenProps {
  user: User;
  onBack: () => void;
}

export default function AnnouncementsScreen({ user, onBack }: AnnouncementsScreenProps) {
  const [notices, setNotices] = useState<Notice[]>(NOTICES);
  const [showComposer, setShowComposer] = useState(false);
  const [selected, setSelected] = useState<Notice | null>(null);

  const canCompose = user.role === 'teacher' || user.role === 'management' || user.role === 'admin';

  const markRead = (id: string) => {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  if (selected) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#E2E8F0]">
          <button onClick={() => setSelected(null)} className="text-[#475569] p-1 -ml-1">
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-[16px] font-bold text-[#0F172A] flex-1 truncate">{selected.title}</h2>
        </div>
        <div className="flex-1 overflow-y-auto hide-scroll p-4">
          <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-5">
            {!selected.read && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-pill text-[11px] font-bold text-amber-700 mb-4">
                <Bell size={10} /> NEW
              </div>
            )}
            <h3 className="text-[20px] font-bold text-[#0F172A] leading-snug mb-3">{selected.title}</h3>
            <div className="flex items-center gap-3 text-[12px] text-[#94A3B8] mb-5">
              <span className="flex items-center gap-1"><Users size={11} /> {selected.author}</span>
              <span className="flex items-center gap-1"><Clock size={11} /> {selected.time}</span>
            </div>
            <p className="text-[15px] text-[#475569] leading-relaxed">{selected.summary}</p>
            <p className="text-[15px] text-[#475569] leading-relaxed mt-3">
              Please ensure your ward is aware of this notice and makes the necessary arrangements. Contact the school office for any queries.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <button onClick={onBack} className="text-[#475569] p-1 -ml-1">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-[16px] font-bold text-[#0F172A] flex-1">Announcements</h2>
        {canCompose && (
          <button
            onClick={() => setShowComposer(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-white text-[13px] font-medium"
            style={{ background: user.school.primary }}
          >
            <Plus size={13} /> New
          </button>
        )}
      </div>

      {/* Unread count */}
      {notices.filter(n => !n.read).length > 0 && (
        <div className="px-4 py-2.5 bg-amber-50 border-b border-amber-100">
          <p className="text-[13px] text-amber-800 font-medium">
            {notices.filter(n => !n.read).length} unread announcement{notices.filter(n => !n.read).length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto hide-scroll p-4">
        <div className="space-y-2.5">
          {notices.map(n => (
            <div
              key={n.id}
              className={`bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden cursor-pointer hover:border-[#2563EB]/20 hover:shadow-sm transition-all ${PRIORITY_STYLE[n.priority]} ${n.read ? 'opacity-70' : ''}`}
              onClick={() => { setSelected(n); markRead(n.id); }}
            >
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!n.read && (
                        <span className="text-[11px] font-bold text-[#F59E0B] bg-amber-50 px-2 py-0.5 rounded-pill uppercase">New</span>
                      )}
                      {n.priority === 'urgent' && (
                        <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-pill uppercase">Urgent</span>
                      )}
                    </div>
                    <p className="text-[14px] font-semibold text-[#0F172A] leading-snug mb-1">{n.title}</p>
                    <p className="text-[13px] text-[#475569] line-clamp-2 leading-relaxed">{n.summary}</p>
                    <div className="flex items-center gap-3 mt-2 text-[12px] text-[#94A3B8]">
                      <span>{n.author}</span>
                      <span>·</span>
                      <span>{n.time}</span>
                    </div>
                  </div>
                  <ChevronRight size={15} className="text-[#E2E8F0] mt-0.5 shrink-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showComposer && <ComposerModal onClose={() => setShowComposer(false)} schoolPrimary={user.school.primary} />}
    </div>
  );
}
