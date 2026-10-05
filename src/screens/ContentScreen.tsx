import { useState } from 'react';
import { ArrowLeft, Grid3X3, List, Download, Share2, Upload, X, CheckCircle2, Loader2, Video, Image, FileText, Search } from 'lucide-react';
import type { User } from '../types';
import { CONTENT_ITEMS } from '../data';

const TYPE_BADGE: Record<string, { icon: React.ReactNode; label: string; bg: string; text: string }> = {
  pdf:  { icon: <FileText size={12} />, label: 'PDF',     bg: 'bg-rose-50',    text: 'text-rose-700' },
  img:  { icon: <Image size={12} />,    label: 'IMG',     bg: 'bg-blue-50',    text: 'text-blue-700' },
  yt:   { icon: <Video size={12} />,    label: '▶ YouTube', bg: 'bg-red-50',   text: 'text-red-700' },
};

type UploadPhase = null | 'dropping' | 'compressing' | 'selecting' | 'done';

function UploadModal({ onClose, schoolPrimary }: { onClose: () => void; schoolPrimary: string }) {
  const [phase, setUploadPhase] = useState<UploadPhase>(null);
  const [selected, setSelected] = useState<string[]>([]);

  const classrooms = ['Class 9-A', 'Class 9-B', 'Class 10-A', 'Class 10-B'];

  const startUpload = () => {
    setUploadPhase('compressing');
    setTimeout(() => setUploadPhase('selecting'), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-t-[24px] sm:rounded-[24px] w-full max-w-[480px] overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
          <h3 className="font-semibold text-[#0F172A]">Upload Content</h3>
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#475569]">
            <X size={18} />
          </button>
        </div>

        <div className="p-5">
          {!phase && (
            <div
              className="border-2 border-dashed border-[#E2E8F0] rounded-[14px] p-8 text-center cursor-pointer hover:border-[#2563EB]/40 hover:bg-blue-50/30 transition-all"
              onDragOver={e => e.preventDefault()}
              onDrop={() => { setUploadPhase('dropping'); startUpload(); }}
              onClick={() => { setUploadPhase('dropping'); startUpload(); }}
            >
              <Upload size={28} className="mx-auto text-[#94A3B8] mb-3" />
              <p className="text-[14px] font-medium text-[#475569] mb-1">Drag & drop or click to upload</p>
              <p className="text-[12px] text-[#94A3B8]">PDF, Images, or YouTube link</p>
            </div>
          )}

          {phase === 'compressing' && (
            <div className="text-center py-8">
              <Loader2 size={28} className="mx-auto text-[#2563EB] spin-ring mb-3" />
              <p className="text-[14px] font-semibold text-[#0F172A]">Optimizing…</p>
              <p className="text-[13px] text-[#94A3B8] mt-1">4.2 MB → 1.1 MB ✓</p>
              <div className="mt-4 bg-[#E2E8F0] rounded-pill h-1.5 overflow-hidden">
                <div className="h-full rounded-pill bg-[#2563EB] w-2/3 transition-all" />
              </div>
            </div>
          )}

          {phase === 'selecting' && (
            <div>
              <div className="flex items-center gap-2 p-3 rounded-[8px] bg-emerald-50 border border-emerald-200 mb-4">
                <CheckCircle2 size={16} className="text-[#10B981]" />
                <span className="text-[13px] text-emerald-800 font-medium">Photosynthesis_Notes.pdf – 4.2 MB → 1.1 MB</span>
              </div>
              <p className="text-[13px] font-semibold text-[#0F172A] mb-2">Select classrooms</p>
              <div className="space-y-2 mb-4">
                {classrooms.map(c => (
                  <label key={c} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded accent-[#2563EB]"
                      checked={selected.includes(c)}
                      onChange={e => setSelected(prev => e.target.checked ? [...prev, c] : prev.filter(x => x !== c))}
                    />
                    <span className="text-[14px] text-[#0F172A]">{c}</span>
                  </label>
                ))}
              </div>
              <label className="flex items-center gap-2.5 mb-4">
                <input type="checkbox" className="w-4 h-4 rounded accent-[#2563EB]" defaultChecked />
                <span className="text-[13px] text-[#475569]">Notify parents when published</span>
              </label>
              <button
                className="w-full h-11 rounded-[8px] text-white font-semibold text-[14px] transition-all"
                style={{ background: schoolPrimary }}
                onClick={() => setUploadPhase('done')}
              >
                Publish to {selected.length || '…'} classrooms
              </button>
            </div>
          )}

          {phase === 'done' && (
            <div className="text-center py-8">
              <CheckCircle2 size={40} className="mx-auto text-[#10B981] mb-3" />
              <p className="font-semibold text-[#0F172A]">Published successfully!</p>
              <p className="text-[13px] text-[#94A3B8] mt-1">Content shared to {selected.length} classrooms.</p>
              <button onClick={onClose} className="mt-4 text-[14px] font-medium text-[#2563EB] hover:underline">
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ContentScreenProps {
  user: User;
  onBack: () => void;
}

export default function ContentScreen({ user, onBack }: ContentScreenProps) {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'all' | 'pdf' | 'img' | 'yt'>('all');
  const [search, setSearch] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  const canUpload = user.role === 'teacher' || user.role === 'management' || user.role === 'admin';

  const filtered = CONTENT_ITEMS.filter(c =>
    (filter === 'all' || c.type === filter) &&
    (c.title.toLowerCase().includes(search.toLowerCase()) || c.subject.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-[#E2E8F0] sticky top-0 z-10">
        <button onClick={onBack} className="text-[#475569] hover:text-[#0F172A] p-1 -ml-1">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-[16px] font-bold text-[#0F172A] flex-1">Content Library</h2>
        <button
          onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')}
          className="p-2 text-[#94A3B8] hover:text-[#475569]"
        >
          {view === 'grid' ? <List size={18} /> : <Grid3X3 size={18} />}
        </button>
        {canUpload && (
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-pill text-white text-[13px] font-medium"
            style={{ background: user.school.primary }}
          >
            <Upload size={13} /> Upload
          </button>
        )}
      </div>

      {/* Search */}
      <div className="px-4 py-3 bg-white border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2 rounded-[8px] border border-[#E2E8F0] bg-[#F7F8FA] px-3 py-2">
          <Search size={14} className="text-[#94A3B8]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search notes, subject…"
            className="flex-1 bg-transparent text-[14px] text-[#0F172A] placeholder-[#94A3B8] outline-none"
          />
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto hide-scroll bg-white border-b border-[#E2E8F0]">
        {(['all', 'pdf', 'img', 'yt'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-pill text-[13px] font-medium border whitespace-nowrap transition-all ${
              filter === f
                ? 'text-white border-transparent'
                : 'bg-white text-[#475569] border-[#E2E8F0] hover:border-[#2563EB]/30'
            }`}
            style={filter === f ? { background: user.school.primary, borderColor: user.school.primary } : {}}
          >
            {f === 'all' ? 'All' : f === 'yt' ? '▶ YouTube' : f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto hide-scroll p-4">
        {view === 'grid' ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(item => {
              const badge = TYPE_BADGE[item.type];
              return (
                <div key={item.id} className="bg-white rounded-[14px] border border-[#E2E8F0] overflow-hidden hover:border-[#2563EB]/30 hover:shadow-sm transition-all cursor-pointer">
                  <div className="h-24 bg-[#F7F8FA] flex items-center justify-center">
                    {item.type === 'yt' ? (
                      <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center">
                        <span className="text-white text-lg">▶</span>
                      </div>
                    ) : item.type === 'pdf' ? (
                      <FileText size={28} className="text-[#94A3B8]" />
                    ) : (
                      <Image size={28} className="text-[#94A3B8]" />
                    )}
                  </div>
                  <div className="p-2.5">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-[4px] ${badge.bg} ${badge.text}`}>
                        {badge.icon} {badge.label}
                      </span>
                    </div>
                    <p className="text-[13px] font-semibold text-[#0F172A] line-clamp-2 leading-snug">{item.title}</p>
                    <p className="text-[11px] text-[#94A3B8] mt-1">{item.subject}</p>
                    {item.compressedSize && (
                      <p className="text-[11px] text-[#10B981] mt-0.5">{item.size} → {item.compressedSize} ✓</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(item => {
              const badge = TYPE_BADGE[item.type];
              return (
                <div key={item.id} className="bg-white rounded-[14px] border border-[#E2E8F0] p-3.5 hover:border-[#2563EB]/30 hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center ${badge.bg}`}>
                      <span className={badge.text}>{badge.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-[4px] ${badge.bg} ${badge.text}`}>{badge.label}</span>
                        <span className="text-[11px] text-[#94A3B8]">{item.classroom}</span>
                      </div>
                      <p className="text-[14px] font-semibold text-[#0F172A] truncate">{item.title}</p>
                      <p className="text-[12px] text-[#94A3B8]">{item.uploadedBy} · {item.uploadedAt}</p>
                      {item.compressedSize && (
                        <p className="text-[11px] text-[#10B981] mt-0.5">{item.size} → {item.compressedSize} ✓</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button className="p-2 text-[#94A3B8] hover:text-[#475569]" title="Share"><Share2 size={14} /></button>
                      <button className="p-2 text-[#94A3B8] hover:text-[#475569]" title="Download"><Download size={14} /></button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} schoolPrimary={user.school.primary} />}
    </div>
  );
}
