import { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import type { User, CalendarEvent } from '../types';
import { CALENDAR_EVENTS } from '../data';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const EVENT_COLORS: Record<string, { dot: string; bg: string; text: string; border: string }> = {
  holiday: { dot: 'bg-rose-500',    bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200' },
  exam:    { dot: 'bg-amber-500',   bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200' },
  event:   { dot: 'bg-blue-500',    bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200' },
  vacation:{ dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
};

function AddEventDrawer({ onClose, schoolPrimary }: { onClose: () => void; schoolPrimary: string }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<string>('event');

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-[24px] w-full max-w-[480px] mx-auto p-5 pb-8">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-[#0F172A]">Add Calendar Event</h3>
          <button onClick={onClose} className="text-[#94A3B8]"><X size={18} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold text-[#475569] uppercase tracking-wide mb-1.5 block">Event Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Annual Science Fair"
              className="w-full border border-[#E2E8F0] rounded-[8px] px-3 py-2.5 text-[14px] outline-none focus:border-[#2563EB]"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#475569] uppercase tracking-wide mb-1.5 block">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border border-[#E2E8F0] rounded-[8px] px-3 py-2.5 text-[14px] outline-none focus:border-[#2563EB]"
            />
          </div>
          <div>
            <label className="text-[12px] font-semibold text-[#475569] uppercase tracking-wide mb-1.5 block">Type</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(EVENT_COLORS).map(([t, c]) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`px-3 py-1.5 rounded-pill border text-[13px] font-medium capitalize transition-all ${
                    type === t ? `${c.bg} ${c.text} ${c.border}` : 'bg-white text-[#475569] border-[#E2E8F0]'
                  }`}
                >
                  <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${c.dot}`} />
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button
            className="w-full h-11 rounded-[8px] text-white font-semibold text-[14px]"
            style={{ background: schoolPrimary }}
            onClick={onClose}
          >
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
}

interface CalendarScreenProps {
  user: User;
  onBack: () => void;
}

export default function CalendarScreen({ user, onBack }: CalendarScreenProps) {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(9); // 0-indexed, October
  const [selectedDate, setSelectedDate] = useState<string | null>('2026-10-01');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [academicYear, setAcademicYear] = useState('2026-27');

  const canEdit = user.role === 'management' || user.role === 'admin' || user.role === 'teacher';

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  };

  const dateString = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const eventsOnDate = (dateStr: string) => CALENDAR_EVENTS.filter(e => e.date === dateStr);
  const selectedEvents = selectedDate ? CALENDAR_EVENTS.filter(e => e.date === selectedDate) : [];

  const monthEvents = CALENDAR_EVENTS.filter(e => e.date.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`));

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <button onClick={onBack} className="text-[#475569] hover:text-[#0F172A] p-1 -ml-1">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-[16px] font-bold text-[#0F172A] flex-1">Annual Calendar</h2>

        {/* Academic year stepper */}
        <div className="flex items-center gap-1 text-[13px] font-medium text-[#475569] border border-[#E2E8F0] rounded-pill px-3 py-1">
          <button onClick={() => setAcademicYear('2025-26')} className="text-[#94A3B8] hover:text-[#475569]">‹</button>
          <span className="px-1">{academicYear}</span>
          <button onClick={() => setAcademicYear('2027-28')} className="text-[#94A3B8] hover:text-[#475569]">›</button>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddEvent(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-white text-[13px] font-medium"
            style={{ background: user.school.primary }}
          >
            <Plus size={13} /> Add
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto hide-scroll">
        {/* Month nav */}
        <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-[#E2E8F0]">
          <button onClick={prevMonth} className="p-1.5 rounded-[8px] hover:bg-[#F7F8FA] text-[#475569]">
            <ChevronLeft size={18} />
          </button>
          <h3 className="text-[16px] font-bold text-[#0F172A]">{MONTHS[month]} {year}</h3>
          <button onClick={nextMonth} className="p-1.5 rounded-[8px] hover:bg-[#F7F8FA] text-[#475569]">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Legend */}
        <div className="flex gap-4 px-4 py-3 bg-white border-b border-[#E2E8F0] overflow-x-auto hide-scroll">
          {Object.entries(EVENT_COLORS).map(([type, c]) => (
            <div key={type} className="flex items-center gap-1.5 whitespace-nowrap">
              <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
              <span className="text-[12px] text-[#475569] capitalize">{type}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="bg-white border-b border-[#E2E8F0]">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-[#E2E8F0]">
            {DAYS.map(d => (
              <div key={d} className="py-2 text-center text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wide">
                {d}
              </div>
            ))}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-7">
            {/* Blank cells */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`blank-${i}`} className="p-2 min-h-[60px] border-b border-r border-[#E2E8F0]" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const d = i + 1;
              const ds = dateString(d);
              const events = eventsOnDate(ds);
              const isSelected = selectedDate === ds;
              const isToday = ds === '2026-10-01';

              return (
                <div
                  key={d}
                  onClick={() => setSelectedDate(ds)}
                  className={`p-2 min-h-[60px] border-b border-r border-[#E2E8F0] cursor-pointer transition-all ${
                    isSelected ? 'bg-blue-50' : 'hover:bg-[#F7F8FA]'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[13px] font-medium mb-1 ${
                    isToday ? 'text-white' : isSelected ? 'text-[#2563EB]' : 'text-[#0F172A]'
                  }`}
                    style={isToday ? { background: user.school.primary } : {}}
                  >
                    {d}
                  </div>
                  <div className="flex flex-wrap gap-0.5">
                    {events.slice(0, 2).map(e => (
                      <span key={e.id} className={`w-2 h-2 rounded-full ${EVENT_COLORS[e.type].dot}`} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected date events */}
        {selectedDate && (
          <div className="px-4 py-4">
            <h4 className="text-[13px] font-semibold text-[#475569] uppercase tracking-wide mb-3">
              {new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </h4>
            {selectedEvents.length === 0 ? (
              <p className="text-[13px] text-[#94A3B8]">No events on this day</p>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map(e => {
                  const c = EVENT_COLORS[e.type];
                  return (
                    <div key={e.id} className={`rounded-[14px] border p-3.5 ${c.bg} ${c.border}`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                        <p className={`text-[14px] font-semibold ${c.text}`}>{e.title}</p>
                        <span className={`ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-pill bg-white/60 capitalize ${c.text}`}>{e.type}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Agenda - Month events */}
        <div className="px-4 pb-6">
          <h4 className="text-[13px] font-semibold text-[#475569] uppercase tracking-wide mb-3">
            All Events · {MONTHS[month]}
          </h4>
          <div className="space-y-2">
            {monthEvents.length === 0 ? (
              <p className="text-[13px] text-[#94A3B8]">No events this month</p>
            ) : (
              monthEvents.map(e => {
                const c = EVENT_COLORS[e.type];
                return (
                  <div key={e.id} className={`flex items-center gap-3 rounded-[14px] border p-3 ${c.bg} ${c.border}`}>
                    <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center bg-white/60 shrink-0`}>
                      <span className={`text-[14px] font-bold ${c.text}`}>
                        {parseInt(e.date.split('-')[2])}
                      </span>
                    </div>
                    <div>
                      <p className={`text-[14px] font-semibold ${c.text}`}>{e.title}</p>
                      <p className={`text-[12px] opacity-70 capitalize ${c.text}`}>{e.type}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {showAddEvent && <AddEventDrawer onClose={() => setShowAddEvent(false)} schoolPrimary={user.school.primary} />}
    </div>
  );
}
