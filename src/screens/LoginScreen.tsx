import { useState, useRef, useEffect } from 'react';
import { ArrowRight, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import type { User } from '../types';
import { DEMO_ACCOUNTS } from '../data';
import ThemeToggle from '../components/ThemeToggle';

type Phase = 'phone' | 'otp' | 'verifying' | 'success' | 'error';

const ROLE_LABELS: Record<string, string> = {
  parent: 'Parent',
  student: 'Student',
  teacher: 'Teacher',
  management: 'Principal',
  admin: 'Admin',
};

const ROLE_COLORS: Record<string, string> = {
  parent: 'bg-blue-50 text-blue-700 border-blue-200',
  student: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  teacher: 'bg-violet-50 text-violet-700 border-violet-200',
  management: 'bg-amber-50 text-amber-700 border-amber-200',
  admin: 'bg-rose-50 text-rose-700 border-rose-200',
};

interface LoginScreenProps {
  onLogin: (user: User) => void;
  onStartIdScan: () => void;
  dark: boolean;
  onToggleTheme: () => void;
}

export default function LoginScreen({ onLogin, onStartIdScan, dark, onToggleTheme }: LoginScreenProps) {
  const [phase, setPhase] = useState<Phase>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (phase === 'otp' && timer > 0) {
      const t = setTimeout(() => setTimer(t => t - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [phase, timer]);

  const handlePhoneSubmit = () => {
    if (phone.length < 10) { setError('Enter a valid 10-digit mobile number'); return; }
    setError('');
    setPhase('otp');
    setTimer(30);
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
    if (next.every(d => d !== '')) {
      setTimeout(() => verifyOtp(next.join('')), 100);
    }
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const verifyOtp = (code: string, selectedUser?: User) => {
    setPhase('verifying');
    setTimeout(() => {
      if (code === '999999') {
        const user = selectedUser ?? DEMO_ACCOUNTS.find(u => u.phone === phone) ?? DEMO_ACCOUNTS[0];
        setPhase('success');
        setTimeout(() => onLogin(user), 800);
      } else {
        setPhase('error');
        setOtp(['', '', '', '', '', '']);
        setTimeout(() => { setPhase('otp'); otpRefs.current[0]?.focus(); }, 1500);
      }
    }, 1200);
  };

  const fillDemo = (user: User) => {
    setPhone(user.phone);
    setPhase('otp');
    setOtp(['9', '9', '9', '9', '9', '9']);
    setTimer(30);
    setTimeout(() => verifyOtp('999999', user), 300);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle dark={dark} onToggle={onToggleTheme} compact />
      </div>
      <div className="w-full max-w-[400px]">
        {/* Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-[14px] bg-[#2563EB] text-white text-xl font-bold mb-4">SP</div>
          <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">SchoolPulse</h1>
          <p className="text-[#475569] text-sm mt-1">School communication, simplified.</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[14px] border border-[#E2E8F0] p-6 shadow-sm">
          {phase === 'phone' && (
            <div className="slide-up">
              <h2 className="font-semibold text-[#0F172A] text-base mb-1">Sign in</h2>
              <p className="text-[#94A3B8] text-[13px] mb-5">Enter your registered mobile number</p>

              <div className="flex gap-2 mb-4">
                <div className="flex items-center gap-1.5 border border-[#E2E8F0] rounded-[8px] px-3 h-11 text-[#0F172A] text-sm font-medium bg-[#F7F8FA] shrink-0">
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handlePhoneSubmit()}
                  placeholder="Mobile number"
                  className="flex-1 border border-[#E2E8F0] rounded-[8px] px-3 h-11 text-[#0F172A] text-sm outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                  autoFocus
                />
              </div>

              {error && (
                <p className="text-[#EF4444] text-[13px] mb-3 flex items-center gap-1.5">
                  <AlertCircle size={13} /> {error}
                </p>
              )}

              <button
                onClick={handlePhoneSubmit}
                className="w-full h-11 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-[8px] flex items-center justify-center gap-2 transition-colors"
              >
                Continue <ArrowRight size={16} />
              </button>
              <div className="flex items-center gap-3 my-5">
                <div className="h-px flex-1 bg-border" />
                <span className="text-[11px] font-medium text-lo uppercase tracking-wide">New to SchoolPulse?</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <button
                type="button"
                onClick={onStartIdScan}
                className="w-full h-11 bg-bg hover:bg-surface text-hi font-semibold rounded-pill border border-border flex items-center justify-center gap-2 transition-colors"
              >
                Scan school ID card
              </button>
            </div>
          )}

          {(phase === 'otp' || phase === 'verifying' || phase === 'error') && (
            <div className="slide-up">
              <button
                onClick={() => { setPhase('phone'); setOtp(['', '', '', '', '', '']); }}
                className="text-[#2563EB] text-[13px] font-medium mb-4 flex items-center gap-1 hover:underline"
              >
                ← +91 {phone}
              </button>
              <h2 className="font-semibold text-[#0F172A] text-base mb-1">Enter OTP</h2>
              <p className="text-[#94A3B8] text-[13px] mb-5">Sent to +91 {phone}</p>

              <div className="flex gap-2 mb-5 justify-between">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={el => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKey(i, e)}
                    className={`w-11 h-12 text-center text-lg font-bold border rounded-[8px] outline-none transition-all
                      ${phase === 'error' ? 'border-[#EF4444] bg-red-50 text-[#EF4444]' : 'border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 text-[#0F172A]'}`}
                  />
                ))}
              </div>

              {phase === 'verifying' && (
                <div className="flex items-center justify-center gap-2 text-[#475569] text-[13px] mb-4">
                  <Loader2 size={14} className="spin-ring" /> Verifying…
                </div>
              )}
              {phase === 'error' && (
                <p className="text-[#EF4444] text-[13px] text-center mb-4 flex items-center justify-center gap-1.5">
                  <AlertCircle size={13} /> Incorrect OTP. Try again.
                </p>
              )}

              {phase === 'otp' && (
                <div className="flex items-center justify-between">
                  <p className="text-[#94A3B8] text-[13px]">Resend in {timer > 0 ? `00:${String(timer).padStart(2, '0')}` : ''}</p>
                  {timer === 0 && (
                    <button
                      onClick={() => { setTimer(30); }}
                      className="text-[#2563EB] text-[13px] font-medium flex items-center gap-1 hover:underline"
                    >
                      <RefreshCw size={12} /> Resend OTP
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {phase === 'success' && (
            <div className="flex flex-col items-center py-4 slide-up">
              <CheckCircle2 size={40} className="text-[#10B981] mb-3" />
              <p className="font-semibold text-[#0F172A]">Verified!</p>
              <p className="text-[#94A3B8] text-[13px] mt-1">Signing you in…</p>
            </div>
          )}
        </div>

        {/* Demo Chips */}
        <div className="mt-4 border-2 border-dashed border-purple-300 rounded-[14px] p-4 bg-purple-50">
          <p className="text-[11px] font-semibold text-purple-600 uppercase tracking-wide mb-3">Dev Preview — Quick Sign-In</p>
          <div className="flex flex-wrap gap-2">
            {DEMO_ACCOUNTS.map(u => (
              <button
                key={u.id}
                onClick={() => fillDemo(u)}
                className={`px-3 py-1.5 rounded-pill border text-[12px] font-medium transition-all hover:scale-105 active:scale-95 ${ROLE_COLORS[u.role]}`}
              >
                {ROLE_LABELS[u.role]}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-purple-400 mt-2">OTP: 999999 for all accounts</p>
        </div>
      </div>
    </div>
  );
}
