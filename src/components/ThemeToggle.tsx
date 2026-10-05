import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  dark: boolean;
  onToggle: () => void;
  compact?: boolean;
}

export default function ThemeToggle({ dark, onToggle, compact = false }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${dark ? 'light' : 'dark'} mode`}
      title={`Switch to ${dark ? 'light' : 'dark'} mode`}
      className={`inline-flex items-center justify-center rounded-pill border border-border bg-bg text-mid hover:text-hi hover:bg-surface transition-colors ${
        compact ? 'w-9 h-9' : 'h-9 px-3 gap-2 text-[12px] font-semibold'
      }`}
    >
      {dark ? <Sun size={16} strokeWidth={1.5} /> : <Moon size={16} strokeWidth={1.5} />}
      {!compact && <span>{dark ? 'Light' : 'Dark'}</span>}
    </button>
  );
}
