import { useState } from 'react';
import { ArrowLeft, Phone, MoreVertical, CheckCheck, Pin } from 'lucide-react';
import type { User, Message, Classroom } from '../types';
import { DM_MESSAGES } from '../data';
import ComposerBar from '../components/ComposerBar';
import { getClassroomMessages } from '../classroomData';

const ROLE_COLOR: Record<string, string> = {
  teacher: 'text-[#7C3AED]',
  parent: 'text-[#475569]',
  student: 'text-[#10B981]',
  management: 'text-[#D97706]',
  admin: 'text-[#EF4444]',
};

function MessageBubble({ msg, schoolPrimary }: { msg: Message; schoolPrimary: string }) {
  return (
    <div className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} mb-2`}>
      {!msg.isMe && (
        <div className="w-7 h-7 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[11px] font-bold text-[#475569] mr-2 mt-auto shrink-0">
          {msg.sender.split(' ').map(w => w[0]).join('').slice(0, 2)}
        </div>
      )}
      <div className={`max-w-[75%] ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
        {!msg.isMe && (
          <span className={`text-[11px] font-semibold mb-0.5 ${ROLE_COLOR[msg.senderRole]}`}>{msg.sender}</span>
        )}
        <div
          className={`px-3.5 py-2.5 rounded-[14px] text-[14px] leading-relaxed min-h-[44px] flex items-center ${
            msg.isMe
              ? 'text-white rounded-br-[4px]'
              : 'bg-white border border-[#E2E8F0] text-[#0F172A] rounded-bl-[4px]'
          }`}
          style={msg.isMe ? { background: schoolPrimary } : {}}
        >
          {msg.attachment ? (
            <div className="space-y-1">
              <p>{msg.content}</p>
              <div className="flex items-center gap-2 mt-1 px-2.5 py-2 rounded-[8px] bg-white/20 border border-white/30 text-[12px]">
                📄 {msg.attachment.name}
              </div>
            </div>
          ) : msg.content}
        </div>
        <div className="flex items-center gap-1 mt-0.5 px-0.5">
          <span className="text-[11px] text-[#94A3B8]">{msg.time}</span>
          {msg.isMe && (
            <CheckCheck size={11} className={msg.read ? 'text-[#2563EB]' : 'text-[#94A3B8]'} />
          )}
        </div>
      </div>
    </div>
  );
}

interface ChatScreenProps {
  user: User;
  mode: 'dm' | 'group';
  onBack: () => void;
  classroom?: Classroom | null;
}

export default function ChatScreen({ user, mode, onBack, classroom }: ChatScreenProps) {
  const isGroup = mode === 'group';
  const [messages, setMessages] = useState<Message[]>(
    isGroup && classroom ? getClassroomMessages(classroom.id) : DM_MESSAGES,
  );
  const [typing, setTyping] = useState(false);

  const handleSend = (text: string) => {
    const newMsg: Message = {
      id: String(Date.now()),
      sender: user.name,
      senderRole: user.role,
      content: text,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      read: false,
    };
    setMessages(prev => [...prev, newMsg]);

    if (!isGroup) {
      setTyping(true);
      setTimeout(() => {
        setTyping(false);
        setMessages(prev => [...prev, {
          id: String(Date.now() + 1),
          sender: 'Ms. Kavitha Nair',
          senderRole: 'teacher',
          content: 'Thank you for your message! I\'ll get back to you shortly.',
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          isMe: false,
          read: false,
        }]);
      }, 2000);
    }
  };

  const headerName = isGroup ? classroom?.name ?? 'Classroom' : 'Ms. Kavitha Nair';
  const headerSub = isGroup ? `${classroom?.memberCount ?? 0} members · ${classroom?.subtitle ?? 'Group'}` : 'Class Teacher · Biology';

  return (
    <div className="flex flex-col h-full bg-[#F7F8FA]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <button onClick={onBack} className="text-[#475569] hover:text-[#0F172A] transition-colors p-1 -ml-1">
          <ArrowLeft size={20} />
        </button>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold shrink-0"
          style={{ background: user.school.primary }}
        >
          {isGroup ? classroom?.initials ?? 'CR' : 'KN'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#0F172A] truncate">{headerName}</p>
          <p className="text-[12px] text-[#94A3B8]">{headerSub}</p>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-[#94A3B8] hover:text-[#475569] transition-colors">
            <Phone size={17} />
          </button>
          <button className="p-2 text-[#94A3B8] hover:text-[#475569] transition-colors">
            <MoreVertical size={17} />
          </button>
        </div>
      </div>

      {/* Pinned strip for group */}
      {isGroup && (
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 border-b border-amber-100">
          <Pin size={12} className="text-amber-600" />
          <p className="text-[12px] text-amber-800 font-medium">
            📌 Reminder: Mid-term exams start October 20.
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 hide-scroll">
        {/* Date separator */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#E2E8F0]" />
          <span className="text-[11px] text-[#94A3B8] font-medium">Today</span>
          <div className="flex-1 h-px bg-[#E2E8F0]" />
        </div>

        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} schoolPrimary={user.school.primary} />
        ))}

        {typing && (
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-full bg-[#E2E8F0] flex items-center justify-center text-[11px] font-bold text-[#475569] shrink-0">
              KN
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-[14px] rounded-bl-[4px] px-4 py-3 flex gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]"
                  style={{ animation: `pulse-warn 1s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
          </div>
        )}
        <div className="h-2" />
      </div>

      <ComposerBar
        onSend={handleSend}
        schoolPrimary={user.school.primary}
        placeholder={isGroup ? `Message ${classroom?.name ?? 'classroom'}…` : 'Message Ms. Kavitha Nair…'}
      />
    </div>
  );
}
