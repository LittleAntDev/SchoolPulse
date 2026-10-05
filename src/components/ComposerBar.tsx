import { useState, useRef } from 'react';
import { Send, Mic, Paperclip, X } from 'lucide-react';

interface ComposerBarProps {
  onSend: (msg: string) => void;
  schoolPrimary?: string;
  placeholder?: string;
}

export default function ComposerBar({ onSend, schoolPrimary = '#2563EB', placeholder = 'Ask anything…' }: ComposerBarProps) {
  const [text, setText] = useState('');
  const [voiceMode, setVoiceMode] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const send = () => {
    const msg = (voiceMode ? voiceText : text).trim();
    if (!msg) return;
    onSend(msg);
    setText('');
    setVoiceText('');
    setVoiceMode(false);
  };

  const startVoice = () => {
    holdTimer.current = setTimeout(() => {
      setVoiceMode(true);
      setVoiceText('Listening…');
      setTimeout(() => setVoiceText('Show me today\'s homework…'), 800);
    }, 200);
  };

  const endVoice = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (!voiceMode) return;
  };

  if (voiceMode) {
    return (
      <div
        className="sticky bottom-0 left-0 right-0 border-t border-[#E2E8F0] bg-white px-4 py-3 safe-area-pb"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-[760px] mx-auto">
          <div className="flex items-center gap-3 rounded-[14px] border-2 px-4 py-3" style={{ borderColor: schoolPrimary }}>
            {/* Waveform */}
            <div className="flex items-center gap-0.5 shrink-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`w-[3px] rounded-full wave-bar`}
                  style={{ background: schoolPrimary, height: '8px', animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <p className="flex-1 text-[14px] text-[#0F172A] italic">{voiceText}</p>
            <button
              onClick={() => { setVoiceMode(false); setVoiceText(''); }}
              className="text-[#94A3B8] hover:text-[#0F172A] transition-colors"
            >
              <X size={16} />
            </button>
            <button
              onClick={send}
              className="w-9 h-9 rounded-pill flex items-center justify-center text-white transition-all active:scale-95"
              style={{ background: schoolPrimary }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="sticky bottom-0 left-0 right-0 border-t border-[#E2E8F0] bg-white px-4 py-3"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      <div className="max-w-[760px] mx-auto">
        <div className="flex items-center gap-2 rounded-[14px] border border-[#E2E8F0] bg-[#F7F8FA] px-3 py-2 focus-within:border-[#2563EB] focus-within:bg-white transition-all">
          <span className="text-[#94A3B8] text-[16px]">💬</span>
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-[14px] text-[#0F172A] placeholder-[#94A3B8] outline-none"
          />
          <div className="flex items-center gap-1.5">
            <button
              className="text-[#94A3B8] hover:text-[#475569] transition-colors p-1 rounded-[6px] hover:bg-[#E2E8F0]"
              title="Attach file"
            >
              <Paperclip size={15} />
            </button>
            <button
              className="text-[#94A3B8] hover:text-[#475569] transition-colors p-1 rounded-[6px] hover:bg-[#E2E8F0]"
              onMouseDown={startVoice}
              onMouseUp={endVoice}
              onTouchStart={startVoice}
              onTouchEnd={endVoice}
              title="Hold to speak"
              aria-label="Hold to record voice message"
            >
              <Mic size={15} />
            </button>
            {text.trim() && (
              <button
                onClick={send}
                className="w-8 h-8 rounded-pill flex items-center justify-center text-white transition-all active:scale-95"
                style={{ background: schoolPrimary }}
              >
                <Send size={13} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
