import { motion } from 'motion/react';
import { InView } from '../motion/index.jsx';

export default function FinalCta({ onStart }) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,#1A2A5E_0%,#0D1C3F_50%,#0A2240_100%)] px-10 py-22.5 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-87.5 w-175 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(59,138,255,0.18)_0%,transparent_70%)]" />
      <InView variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }}>
        <div className="relative">
          <h2 className="mb-4 text-[44px] font-extrabold leading-tight text-white">
            Bereit, das Konzept<br />live zu erleben?
          </h2>
          <p className="mx-auto mb-11 max-w-120 text-lg leading-[1.7] text-white/70">
            Öffne die Demo, gib deine Stimmung ein und scanne den QR-Code
            mit deinem Smartphone — alles in Echtzeit.
          </p>
          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.05, boxShadow: '0 16px 56px rgba(59,138,255,0.60)' }}
            whileTap={{ scale: 0.97 }}
            className="cursor-pointer rounded-full bg-[linear-gradient(135deg,#3B8AFF,#00C4D9)] px-11 py-4.25 text-lg font-extrabold text-white shadow-[0_8px_40px_rgba(59,138,255,0.45)]"
          >Demo starten →</motion.button>
          <div className="mt-5 font-mono text-[13px] text-white/45">
            Kein Account · Keine Cloud · Nur Konzept &amp; Technik
          </div>
        </div>
      </InView>
    </section>
  );
}
