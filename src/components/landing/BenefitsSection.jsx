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
    <section id="warum" style={{ background: '#FFFFFF', padding: '90px 40px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <InView>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <Badge style={{ margin: '0 auto 16px' }}>Relevanz</Badge>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 14 }}>
              Warum Mental Health<br />von diesem Ansatz profitiert
            </h2>
            <p style={{ color: '#4B607D', fontSize: 16, maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              Emotionale Daten sind hochsensibel. Mein Konzept zeigt, wie reichhaltige
              private Daten ohne Kompromisse übertragen werden können.
            </p>
          </div>
        </InView>

        <AnimatedGroup preset="zoom" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {BENEFITS.map(({ icon, color, title, stat, desc }) => (
            <motion.div
              key={title}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                padding: '36px 28px', textAlign: 'center',
                background: '#F7F9FD', borderRadius: 16, border: '1px solid #E4EDF6',
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 16 }}>{icon}</div>
              <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 12 }}>{title}</div>
              <div style={{ fontSize: 14, color: '#4B607D', lineHeight: 1.7, marginBottom: 22 }}>{desc}</div>
              <div style={{
                display: 'inline-block', padding: '7px 20px', borderRadius: 100,
                background: `${color}12`, color,
                fontWeight: 800, fontSize: 18, fontFamily: 'Roboto Mono, monospace',
                border: `1px solid ${color}25`,
              }}>{stat}</div>
            </motion.div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
