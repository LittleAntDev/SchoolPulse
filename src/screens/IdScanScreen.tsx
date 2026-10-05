import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  Check,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Lock,
  RefreshCw,
  ScanLine,
  ShieldCheck,
} from 'lucide-react';
import type { User } from '../types';
import { DEMO_ACCOUNTS } from '../data';

type ScanPhase = 'intro' | 'camera' | 'processing' | 'matched';

interface IdScanScreenProps {
  onBack: () => void;
  onComplete: (user: User) => void;
}

export default function IdScanScreen({ onBack, onComplete }: IdScanScreenProps) {
  const [phase, setPhase] = useState<ScanPhase>('intro');
  const [preview, setPreview] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const student = DEMO_ACCOUNTS.find(account => account.role === 'student')!;

  useEffect(() => {
    if (phase !== 'camera' || preview) return;

    let active = true;
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      .then(stream => {
        if (!active) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          void videoRef.current.play();
        }
      })
      .catch(() => setCameraError('Camera access is unavailable. Upload a clear photo instead.'));

    return () => {
      active = false;
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    };
  }, [phase, preview]);

  const processImage = (image: string) => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    setPreview(image);
    setPhase('processing');
    window.setTimeout(() => setPhase('matched'), 1400);
  };

  const capture = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      setCameraError('Camera is still starting. Try again or upload a photo.');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    processImage(canvas.toDataURL('image/jpeg', 0.82));
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => processImage(String(reader.result));
    reader.readAsDataURL(file);
  };

  const retry = () => {
    setPreview(null);
    setCameraError('');
    setPhase('camera');
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="h-16 px-4 flex items-center border-b border-border bg-bg">
        <button
          type="button"
          onClick={phase === 'intro' ? onBack : () => setPhase('intro')}
          className="w-10 h-10 -ml-2 rounded-pill flex items-center justify-center text-mid hover:bg-surface"
          aria-label="Go back"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
        <div className="flex-1 text-center">
          <p className="text-[14px] font-semibold text-hi">Connect your school</p>
          <p className="text-[11px] text-lo">Secure ID verification</p>
        </div>
        <div className="w-8" />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[440px]">
          {phase === 'intro' && (
            <div className="slide-up">
              <div className="w-16 h-16 rounded-[18px] bg-blue-50 dark:bg-blue-950/50 text-primary flex items-center justify-center mb-6">
                <ScanLine size={30} strokeWidth={1.5} />
              </div>
              <p className="text-[26px] leading-tight font-bold text-hi tracking-tight">Scan your school ID</p>
              <p className="text-[14px] leading-relaxed text-mid mt-3">
                We’ll use the details on your ID card to find your school and set up the right student profile.
              </p>

              <div className="bg-bg border border-border rounded-[14px] p-4 mt-7 space-y-4">
                {[
                  ['1', 'Place the front of your card inside the frame'],
                  ['2', 'Keep the card flat and avoid glare'],
                  ['3', 'Review your matched school profile'],
                ].map(([step, text]) => (
                  <div key={step} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-pill bg-surface text-hi text-[12px] font-bold flex items-center justify-center shrink-0">
                      {step}
                    </span>
                    <p className="text-[13px] text-mid">{text}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setPhase('camera')}
                className="w-full h-12 mt-6 rounded-pill bg-primary hover:bg-primary-hover text-white font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Camera size={18} strokeWidth={1.5} />
                Open camera
              </button>
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-lo mt-4">
                <Lock size={12} strokeWidth={1.5} />
                Your photo is encrypted and deleted after verification
              </div>
            </div>
          )}

          {phase === 'camera' && (
            <div className="slide-up">
              <div className="mb-4">
                <p className="text-[20px] font-bold text-hi">Position your ID card</p>
                <p className="text-[13px] text-mid mt-1">Make sure all four corners are visible.</p>
              </div>
              <div className="relative aspect-[4/3] rounded-[18px] overflow-hidden bg-[#111827] border border-border">
                {!cameraError && (
                  <video ref={videoRef} muted playsInline className="w-full h-full object-cover" />
                )}
                {cameraError && (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8">
                    <Camera size={30} className="text-slate-400 mb-3" strokeWidth={1.5} />
                    <p className="text-[13px] text-slate-300 leading-relaxed">{cameraError}</p>
                  </div>
                )}
                <div className="absolute inset-5 rounded-[12px] border-2 border-white/80">
                  <span className="absolute -top-0.5 -left-0.5 w-8 h-8 border-l-4 border-t-4 border-primary rounded-tl-[10px]" />
                  <span className="absolute -top-0.5 -right-0.5 w-8 h-8 border-r-4 border-t-4 border-primary rounded-tr-[10px]" />
                  <span className="absolute -bottom-0.5 -left-0.5 w-8 h-8 border-l-4 border-b-4 border-primary rounded-bl-[10px]" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-8 h-8 border-r-4 border-b-4 border-primary rounded-br-[10px]" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-5 mt-6">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-12 h-12 rounded-pill border border-border bg-bg text-mid flex items-center justify-center hover:bg-surface"
                  aria-label="Upload ID card photo"
                >
                  <ImagePlus size={20} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  onClick={capture}
                  disabled={Boolean(cameraError)}
                  className="w-16 h-16 rounded-pill bg-primary border-4 border-blue-100 dark:border-blue-950 text-white flex items-center justify-center disabled:opacity-40"
                  aria-label="Take photo"
                >
                  <Camera size={24} strokeWidth={1.5} />
                </button>
                <div className="w-12" />
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} className="hidden" />
            </div>
          )}

          {phase === 'processing' && (
            <div className="text-center slide-up">
              <div className="relative aspect-[4/3] rounded-[18px] overflow-hidden bg-[#111827] mb-6">
                {preview && <img src={preview} alt="Captured school ID" className="w-full h-full object-cover opacity-60" />}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Loader2 size={36} className="spin-ring mb-3" strokeWidth={1.5} />
                  <p className="text-[14px] font-semibold">Reading ID details…</p>
                  <p className="text-[12px] text-slate-300 mt-1">Checking school records securely</p>
                </div>
              </div>
            </div>
          )}

          {phase === 'matched' && (
            <div className="slide-up">
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-pill bg-emerald-50 dark:bg-emerald-950/50 text-accent flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={28} strokeWidth={1.5} />
                </div>
                <p className="text-[22px] font-bold text-hi">We found your profile</p>
                <p className="text-[13px] text-mid mt-1">Check that these details are correct.</p>
              </div>

              <div className="bg-bg border border-border rounded-[14px] overflow-hidden">
                <div className="p-4 flex items-center gap-3 border-b border-border">
                  <div
                    className="w-12 h-12 rounded-[12px] text-white flex items-center justify-center font-bold"
                    style={{ background: student.school.primary }}
                  >
                    {student.school.crest}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-hi">{student.school.name}</p>
                    <p className="text-[12px] text-lo">Verified school record</p>
                  </div>
                  <ShieldCheck size={20} className="ml-auto text-accent" strokeWidth={1.5} />
                </div>
                <dl className="p-4 grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-lo">Student</dt>
                    <dd className="text-[13px] font-semibold text-hi mt-1">{student.name}</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-lo">Student ID</dt>
                    <dd className="text-[13px] font-semibold text-hi mt-1">GPS-09-1842</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-lo">Class</dt>
                    <dd className="text-[13px] font-semibold text-hi mt-1">9-A</dd>
                  </div>
                  <div>
                    <dt className="text-[11px] uppercase tracking-wide text-lo">Academic year</dt>
                    <dd className="text-[13px] font-semibold text-hi mt-1">2026–27</dd>
                  </div>
                </dl>
              </div>

              <button
                type="button"
                onClick={() => onComplete(student)}
                className="w-full h-12 mt-5 rounded-pill bg-primary hover:bg-primary-hover text-white font-semibold flex items-center justify-center gap-2"
              >
                Confirm and continue <Check size={18} strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={retry}
                className="w-full h-11 mt-2 rounded-pill text-mid font-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-bg"
              >
                <RefreshCw size={15} strokeWidth={1.5} />
                Scan a different card
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
