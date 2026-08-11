import { motion } from 'motion/react';
import { InView, AnimatedGroup } from '../motion/index.jsx';
import Badge from './Badge';

const STEPS = [
  { step: 1, emoji: '✍️', color: '#FF7E6B', border: 'rgba(255,126,107,0.20)',
    title: 'Stimmung eingeben',
    desc: 'Wähle deine Stimmung, schreibe einen Tagebucheintrag — optional mit Fotos & Sprachmemo.' },
  { step: 2, emoji: '⚡', color: '#3B8AFF', border: 'rgba(59,138,255,0.20)',
    title: 'QR generiert sich',
    desc: 'Sieh live, wie Daten in 3 Ebenen aufgeteilt und als farbiger Multi-Layer QR kodiert werden.' },
  { step: 3, emoji: '📱', color: '#22C55E', border: 'rgba(34,197,94,0.20)',
    title: 'Smartphone scannen',
    desc: 'Scanne den Session-QR mit deinem Handy. Die App liest alle 3 Datenebenen gleichzeitig aus.' },
  { step: 4, emoji: '✨', color: '#00C4D9', border: 'rgba(0,196,217,0.20)',
    title: 'Ergebnis erscheint',
    desc: 'Deine Daten erscheinen vollständig auf dem Handy — ohne Server, ohne Cloud, unter 1 Sekunde.' },
];

export default function StepsSection() {
  return (
    <section id="ablauf" className="bg-[#F4F8FF] px-10 py-22.5">
      <div className="mx-auto max-w-270">
        <InView>
          <div className="mb-14 text-center">
            <Badge className="mx-auto mb-4">Deine Reise</Badge>
            <h2 className="mb-3.5 text-4xl font-extrabold">
              So erlebst du die Demo<br />in 4 Schritten
            </h2>
            <p className="mx-auto max-w-120 text-base leading-[1.7] text-(--tx-secondary)">
              Von der Stimmungseingabe bis zum Ergebnis auf dem Smartphone — live, privat, in Sekunden.
            </p>
          </div>
        </InView>

        <AnimatedGroup preset="blur-slide" className="grid grid-cols-4 gap-5">
          {STEPS.map(({ step, emoji, color, border, title, desc }) => (
            <motion.div
              key={step}
              whileHover={{ y: -4, boxShadow: `0 12px 32px ${color}20` }}
              transition={{ duration: 0.2 }}
              className="cursor-default rounded-2xl bg-white px-5.5 py-7 shadow-[0_2px_20px_rgba(0,0,0,0.04)]"
              style={{ border: `1px solid ${border}` }}
            >
              <div
                className="mb-4 inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold text-white"
                style={{ background: color }}
              >{step}</div>
              <div className="mb-3.5 text-4xl">{emoji}</div>
              <div className="mb-2.5 text-[15px] font-bold">{title}</div>
              <div className="text-[13px] leading-[1.65] text-(--tx-secondary)">{desc}</div>
            </motion.div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
