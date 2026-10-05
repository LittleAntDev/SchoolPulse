import { useState } from 'react';
import { ArrowLeft, Plus, CheckCircle2, Circle, Clock, AlertCircle, ChevronRight, Calendar, X } from 'lucide-react';
import type { User, Assignment } from '../types';
import { ASSIGNMENTS } from '../data';

function urgencyColor(days: number): string {
  if (days < 0) return 'text-[#94A3B8]';
  if (days === 0) return 'text-[#EF4444]';
  if (days <= 2) return 'text-[#F59E0B]';
  return 'text-[#10B981]';
}

function urgencyLabel(days: number): string {
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `Due in ${days}d`;
}

function AssignmentCard({ a, onToggle, schoolPrimary }: { a: Assignment; onToggle: (id: string) => void; schoolPrimary: string }) {
  return (
    <div className={`bg-white rounded-[14px] border border-[#E2E8F0] p-4 transition-all hover:shadow-sm ${a.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(a.id)}
          className="mt-0.5 shrink-0 transition-transform active:scale-90"
          aria-label={a.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {a.completed
            ? <CheckCircle2 size={20} className="text-[#10B981]" style={{ strokeWidth: 2 }} />
            : <Circle size={20} className="text-[#E2E8F0]" style={{ strokeWidth: 2 }} />
          }
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold text-[#475569] uppercase tracking-wide">{a.subject}</span>
            <span className={`text-[11px] font-bold flex items-center gap-0.5 ${urgencyColor(a.daysLeft)}`}>
              <Clock size={10} /> {urgencyLabel(a.daysLeft)}
            </span>
          </div>
          <p className={`text-[14px] font-semibold text-[#0F172A] leading-snug ${a.completed ? 'line-through text-[#94A3B8]' : ''}`}>
            {a.title}
          </p>
          {a.description && (
            <p className="text-[13px] text-[#475569] mt-1 leading-relaxed">{a.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[12px] text-[#94A3B8] flex items-center gap-1">
              <Calendar size={10} /> {a.dueDate}
            </span>
            <span className="text-[12px] text-[#94A3B8]">{a.classroom}</span>
          </div>
        </div>
        <ChevronRight size={15} className="text-[#E2E8F0] mt-0.5 shrink-0" />
      </div>
    </div>
  );
}

function TeacherBuilder({ onClose, schoolPrimary }: { onClose: () => void; schoolPrimary: string }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [due, setDue] = useState('');
  const [classrooms, setClassrooms] = useState<string[]>([]);
  const [notifyParents, setNotifyParents] = useState(true);
  const [preview, setPreview] = useState(false);

  const cls = ['Class 9-A', 'Class 9-B', 'Class 10-A'];

  const toggleCls = (c: string) =>
    setClassrooms(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  if (preview) {
    return (
      <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4">
        <div className="bg-white rounded-t-[24px] sm:rounded-[24px] w-full max-w-[480px] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#0F172A]">Preview (Student View)</h3>
            <button onClick={() => setPreview(false)} className="text-[#94A3B8]"><X size={18} /></button>
          </div>
          <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-4">
            <div className="flex items-start gap-3">
              <Circle size={20} className="text-[#E2E8F0] mt-0.5 shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-semibold text-[#475569] uppercase">Science</span>
                  <span className="text-[11px] font-bold text-[#F59E0B] flex items-center gap-0.5">
                    <Clock size={10} /> {due ? `Due ${due}` : 'No due date'}
                  </span>
                </div>
                <p className="text-[14px] font-semibold text-[#0F172A]">{title || 'Assignment title…'}</p>
                {desc && <p className="text-[13px] text-[#475569] mt-1">{desc}</p>}
                <div className="flex gap-2 mt-2">
                  {classrooms.map(c => (
                    <span key={c} className="text-[11px] text-[#94A3B8]">{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button
            className="w-full h-11 rounded-[8px] text-white font-semibold mt-4"
            style={{ background: schoolPrimary }}
            onClick={onClose}
          >
            Publish Assignment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-[24px] sm:rounded-[24px] w-full max-w-[480px] overflow-hidden max-h-[90vh] overflow-y-auto hide-scroll">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0] sticky top-0 bg-white">
          <h3 className="font-semibold text-[#0F172A]">New Assignment</h3>
          <button onClick={onClose} className="text-[#94A3B8]"><X size={18} /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-[#475569] uppercase tracking-wide mb-1.5 block">Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Chapter 5 – Photosynthesis Worksheet"
              className="w-full border border-[#E2E8F0] rounded-[8px] px-3 py-2.5 text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#475569] uppercase tracking-wide mb-1.5 block">Instructions</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={3}
              placeholder="Describe the assignment…"
              className="w-full border border-[#E2E8F0] rounded-[8px] px-3 py-2.5 text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB] resize-none"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#475569] uppercase tracking-wide mb-1.5 block">Due Date</label>
            <input
              type="date"
              value={due}
              onChange={e => setDue(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-[8px] px-3 py-2.5 text-[14px] text-[#0F172A] outline-none focus:border-[#2563EB]"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#475569] uppercase tracking-wide mb-1.5 block">Classrooms</label>
            <div className="space-y-2">
              {cls.map(c => (
                <label key={c} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded accent-[#2563EB]" checked={classrooms.includes(c)} onChange={() => toggleCls(c)} />
                  <span className="text-[14px] text-[#0F172A]">{c}</span>
                </label>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded accent-[#2563EB]" checked={notifyParents} onChange={e => setNotifyParents(e.target.checked)} />
            <span className="text-[13px] text-[#475569]">Notify parents when published</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button
              className="flex-1 h-11 rounded-[8px] border border-[#E2E8F0] text-[#475569] font-semibold text-[14px] hover:bg-[#F7F8FA]"
              onClick={() => setPreview(true)}
            >
              Preview
            </button>
            <button
              className="flex-1 h-11 rounded-[8px] text-white font-semibold text-[14px]"
              style={{ background: schoolPrimary }}
              onClick={onClose}
            >
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface HomeworkScreenProps {
  user: User;
  onBack: () => void;
}

export default function HomeworkScreen({ user, onBack }: HomeworkScreenProps) {
  const [assignments, setAssignments] = useState<Assignment[]>(ASSIGNMENTS);
  const [showBuilder, setShowBuilder] = useState(false);
  const [tab, setTab] = useState<'pending' | 'done'>('pending');

  const isTeacher = user.role === 'teacher';

  const toggle = (id: string) => {
    setAssignments(prev =>
      prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a)
    );
  };

  const pending = assignments.filter(a => !a.completed);
  const done = assignments.filter(a => a.completed);
  const list = tab === 'pending' ? pending : done;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <button onClick={onBack} className="text-[#475569] hover:text-[#0F172A] p-1 -ml-1">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-[16px] font-bold text-[#0F172A] flex-1">
          {isTeacher ? 'Homework Builder' : 'My Homework'}
        </h2>
        {isTeacher && (
          <button
            onClick={() => setShowBuilder(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-white text-[13px] font-medium"
            style={{ background: user.school.primary }}
          >
            <Plus size={13} /> New
          </button>
        )}
      </div>

      {/* Tabs (student/parent view) */}
      {!isTeacher && (
        <div className="flex border-b border-[#E2E8F0] bg-white px-4">
          {(['pending', 'done'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-3 px-4 text-[14px] font-medium border-b-2 transition-all capitalize ${
                tab === t ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-[#94A3B8] hover:text-[#475569]'
              }`}
            >
              {t === 'pending' ? `Pending (${pending.length})` : `Done (${done.length})`}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto hide-scroll p-4">
        {isTeacher ? (
          <div className="space-y-2.5">
            <div className="rounded-[14px] border border-[#E2E8F0] bg-white p-4 mb-4">
              <p className="text-[13px] font-semibold text-[#0F172A] mb-1">Pending submissions</p>
              <p className="text-[13px] text-[#94A3B8]">12 students haven't submitted <span className="font-semibold text-[#0F172A]">"Photosynthesis Worksheet"</span></p>
              <button className="mt-2 text-[13px] font-medium flex items-center gap-1" style={{ color: user.school.primary }}>
                Send reminder <ChevronRight size={12} />
              </button>
            </div>
            {assignments.map(a => (
              <div key={a.id} className="bg-white rounded-[14px] border border-[#E2E8F0] p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-semibold text-[#475569] uppercase tracking-wide">{a.subject}</span>
                      <span className={`text-[11px] font-semibold ${urgencyColor(a.daysLeft)}`}>{urgencyLabel(a.daysLeft)}</span>
                    </div>
                    <p className="text-[14px] font-semibold text-[#0F172A]">{a.title}</p>
                    <p className="text-[12px] text-[#94A3B8] mt-1">{a.classroom} · Due {a.dueDate}</p>
                  </div>
                  {a.daysLeft < 0 && <AlertCircle size={16} className="text-[#94A3B8] mt-0.5" />}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {list.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 size={40} className="text-[#10B981] mb-3" />
                <p className="font-semibold text-[#0F172A]">
                  {tab === 'pending' ? 'All caught up!' : 'No completed assignments yet'}
                </p>
                <p className="text-[13px] text-[#94A3B8] mt-1">
                  {tab === 'pending' ? 'No pending homework. Great work!' : 'Complete an assignment to see it here.'}
                </p>
              </div>
            ) : (
              list.map(a => (
                <AssignmentCard key={a.id} a={a} onToggle={toggle} schoolPrimary={user.school.primary} />
              ))
            )}
          </div>
        )}
      </div>

      {showBuilder && <TeacherBuilder onClose={() => setShowBuilder(false)} schoolPrimary={user.school.primary} />}
    </div>
  );
}
