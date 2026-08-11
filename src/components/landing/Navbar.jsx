import { useState } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollProgress } from '@/hooks/useScrollProgress';
// 1. Motion importieren
import { motion, AnimatePresence } from 'motion/react';

const SECTIONS = [
  { id: 'konzept', label: 'Das Konzept' },
  { id: 'ablauf',  label: 'Ablauf in 4 Schritten' },
  { id: 'warum',   label: 'Warum Mental Health' },
  { id: 'vorschau', label: 'Vorschau' },
];

export default function Navbar({ onStart }) {
  const progress = useScrollProgress();
  const [open, setOpen] = useState(false);

  const goTo = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-100 flex items-center justify-center bg-white/90 px-6 py-3 backdrop-blur-xl md:px-10">
      <div className="relative">
        <Button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="h-10 gap-3 rounded-full pl-4 pr-1.5"
        >
          {open ? <X className="size-4" /> : <MenuIcon className="size-4" />}
          <span className="text-[13px] font-semibold">Menü</span>
          <span className="rounded-full bg-white/15 px-2.5 py-1 font-mono text-[11px] tabular-nums">
            {progress}%
          </span>
        </Button>

  
        <AnimatePresence>
          {open && (
            /* 3. motion.div mit initial, animate und exit Zuständen */
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute origin-top-right right-0 top-[calc(100%+8px)] w-60 overflow-hidden rounded-xl border border-(--bd-subtle) bg-white shadow-[0_16px_40px_rgba(17,24,39,0.12)]"
            >
              {SECTIONS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => goTo(s.id)}
                  className="block w-full px-4 py-3 text-left text-sm text-(--tx-secondary) transition-colors hover:bg-(--bg-surface) hover:text-(--tx-primary)"
                >
                  {s.label}
                </button>
              ))}
              <button
                onClick={() => { setOpen(false); onStart(); }}
                className="block w-full border-t border-(--bd-subtle) px-4 py-3 text-left text-sm font-semibold text-(--blue) hover:bg-(--blue-dim)"
              >
                Demo starten →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}