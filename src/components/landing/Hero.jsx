import { motion } from 'motion/react';
import { TextEffect } from '../motion/index.jsx';
import { Button } from '@/components/ui/button';
import FaceOrbit from './FaceOrbit';

export default function Hero({ onStart }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#F3F7FF] px-6 pt-36 pb-20 text-center">
      <div className="mx-auto flex max-w-[800px] flex-col items-center">
        <h1 className="m-0 text-[clamp(36px,6vw,72px)] font-extrabold leading-[1.15]">
          <TextEffect as="span" preset="fade-in-blur" delay={0.15} style={{ display: 'block' }}>
            Stimmung entschlüsseln,
          </TextEffect>
          <TextEffect as="span" preset="fade-in-blur" delay={0.35} style={{ display: 'block', color: '#8FA6C9' }}>
            Multi-Layer QR erleben
          </TextEffect>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-6 max-w-[580px] text-lg leading-[1.75] text-[var(--tx-secondary)]"
        >
          Ein interaktives Demo, das zeigt wie{' '}
          <strong className="text-[var(--tx-primary)]">RGB-Farb-Multiplexing</strong> private
          Mood-Daten sicher überträgt — ohne Server, ohne Cloud, in Echtzeit.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mt-9 flex flex-col items-center gap-3"
        >
          <Button onClick={onStart} size="lg" className="h-[54px] rounded-full px-9 text-base font-bold">
            Demo starten
          </Button>
          <span className="font-mono text-[13px] text-[var(--tx-muted)]">
            Kein Login · Kein Server · 100% Lokal
          </span>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mt-16"
      >
        <FaceOrbit />
      </motion.div>
    </section>
  );
}
