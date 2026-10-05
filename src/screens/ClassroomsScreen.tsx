import { ArrowLeft, ChevronRight, MessageSquare, Users } from 'lucide-react';
import type { Classroom, User } from '../types';
import { getJoinedClassrooms } from '../classroomData';

interface ClassroomsScreenProps {
  user: User;
  onBack: () => void;
  onOpen: (classroom: Classroom) => void;
}

export default function ClassroomsScreen({ user, onBack, onOpen }: ClassroomsScreenProps) {
  const classrooms = getJoinedClassrooms(user.role);

  return (
    <div className="flex flex-col h-full bg-surface">
      <div className="flex items-center gap-3 px-4 py-3 bg-bg border-b border-border sticky top-0 z-10">
        <button type="button" onClick={onBack} className="text-mid hover:text-hi p-1 -ml-1" aria-label="Go back">
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <div className="flex-1">
          <p className="text-[16px] font-bold text-hi">Classrooms</p>
          <p className="text-[11px] text-lo">{classrooms.length} joined rooms</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto hide-scroll p-4">
        <div className="rounded-[14px] bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 p-3.5 mb-5 flex items-start gap-3">
          <MessageSquare size={18} className="text-primary shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <p className="text-[13px] font-semibold text-hi">Your joined classrooms</p>
            <p className="text-[12px] text-mid mt-0.5 leading-relaxed">
              Select a room to view its messages and participate in the conversation.
            </p>
          </div>
        </div>

        <p className="text-[11px] font-semibold text-lo uppercase tracking-wider mb-2">Joined</p>
        <div className="space-y-2.5">
          {classrooms.map(classroom => (
            <button
              type="button"
              key={classroom.id}
              onClick={() => onOpen(classroom)}
              className="w-full flex items-center gap-3 p-3.5 rounded-[14px] border border-border bg-bg hover:border-primary/40 text-left transition-colors"
            >
              <div
                className="w-11 h-11 rounded-[12px] text-white flex items-center justify-center text-[12px] font-bold shrink-0"
                style={{ background: user.school.primary }}
              >
                {classroom.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold text-hi truncate">{classroom.name}</p>
                  {classroom.unread > 0 && (
                    <span
                      className="min-w-5 h-5 px-1.5 rounded-pill text-white text-[10px] font-bold flex items-center justify-center"
                      style={{ background: user.school.primary }}
                    >
                      {classroom.unread}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[12px] text-lo mt-0.5">
                  <span>{classroom.subtitle}</span>
                  <span>·</span>
                  <Users size={12} strokeWidth={1.5} />
                  <span>{classroom.memberCount}</span>
                </div>
              </div>
              <ChevronRight size={17} className="text-lo shrink-0" strokeWidth={1.5} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
