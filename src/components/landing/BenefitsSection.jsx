import { motion } from 'motion/react';
import { InView, AnimatedGroup } from '../motion/index.jsx';
import Badge from './Badge';

const BENEFITS = [
  { icon: '🔒', color: '#22C55E', title: '100% Privat', stat: '0 Server',
    desc: 'Kein Cloud-Dienst berührt deine Daten. Stimmungsverläufe bleiben zwischen deinen Geräten — übertragen nur als kurzlebiger QR-Code.' },
  { icon: '⚡', color: '#3B8AFF', title: 'Blitzschnell', stat: '< 1s',
    desc: 'Von der Eingabe bis zum Ergebnis auf dem Smartphone unter einer Sekunde — direktes WebSocket-Streaming, ohne Upload-Delay.' },
  { icon: '📦', color: '#00C4D9', title: 'Reichhaltige Daten', stat: '3× Kapazität',
    desc: 'Stimmung, Tagebucheintrag, Foto und Sprachmemo — alles in einem Scan. Ein normaler QR würde bei dieser Datenmenge zusammenbrechen.' },
];

export default function BenefitsSection() {
  return (
    <section id="warum" className="bg-white px-10 py-22.5">
      <div className="mx-auto max-w-270">
        <InView>
          <div className="mb-14 text-center">
            <Badge className="mx-auto mb-4">Relevanz</Badge>
            <h2 className="mb-3.5 text-4xl font-extrabold">
              Warum Mental Health<br />von diesem Ansatz profitiert
            </h2>
            <p className="mx-auto max-w-140 text-base leading-[1.7] text-(--tx-secondary)">
              Emotionale Daten sind hochsensibel. Mein Konzept zeigt, wie reichhaltige
              private Daten ohne Kompromisse übertragen werden können.
            </p>
          </div>
        </InView>

        <AnimatedGroup preset="zoom" className="grid grid-cols-3 gap-6">
          {BENEFITS.map(({ icon, color, title, stat, desc }) => (
            <motion.div
              key={title}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-[#E4EDF6] bg-[#F7F9FD] px-7 py-9 text-center"
            >
              <div className="mb-4 text-[44px]">{icon}</div>
              <div className="mb-3 text-xl font-extrabold">{title}</div>
              <div className="mb-5.5 text-sm leading-[1.7] text-(--tx-secondary)">{desc}</div>
              <div
                className="inline-block rounded-full px-5 py-1.75 font-mono text-lg font-extrabold"
                style={{ background: `${color}12`, color, border: `1px solid ${color}25` }}
              >{stat}</div>
            </motion.div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
