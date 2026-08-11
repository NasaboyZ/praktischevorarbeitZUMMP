import { motion } from 'motion/react';
import { InView, AnimatedGroup } from '../motion/index.jsx';
import Badge from './Badge';

const STEPS = [
  { step: 1, emoji: '✍️', color: '#FF7E6B', bg: 'rgba(255,126,107,0.06)', border: 'rgba(255,126,107,0.20)',
    title: 'Stimmung eingeben',
    desc: 'Wähle deine Stimmung, schreibe einen Tagebucheintrag — optional mit Fotos & Sprachmemo.' },
  { step: 2, emoji: '⚡', color: '#3B8AFF', bg: 'rgba(59,138,255,0.06)', border: 'rgba(59,138,255,0.20)',
    title: 'QR generiert sich',
    desc: 'Sieh live, wie Daten in 3 Ebenen aufgeteilt und als farbiger Multi-Layer QR kodiert werden.' },
  { step: 3, emoji: '📱', color: '#22C55E', bg: 'rgba(34,197,94,0.06)',  border: 'rgba(34,197,94,0.20)',
    title: 'Smartphone scannen',
    desc: 'Scanne den Session-QR mit deinem Handy. Die App liest alle 3 Datenebenen gleichzeitig aus.' },
  { step: 4, emoji: '✨', color: '#00C4D9', bg: 'rgba(0,196,217,0.06)',  border: 'rgba(0,196,217,0.20)',
    title: 'Ergebnis erscheint',
    desc: 'Deine Daten erscheinen vollständig auf dem Handy — ohne Server, ohne Cloud, unter 1 Sekunde.' },
];

export default function StepsSection() {
  return (
    <section id="ablauf" style={{ background: '#F4F8FF', padding: '90px 40px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <InView>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <Badge style={{ margin: '0 auto 16px' }}>Deine Reise</Badge>
            <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 14 }}>
              So erlebst du die Demo<br />in 4 Schritten
            </h2>
            <p style={{ color: '#4B607D', fontSize: 16, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
              Von der Stimmungseingabe bis zum Ergebnis auf dem Smartphone — live, privat, in Sekunden.
            </p>
          </div>
        </InView>

        <AnimatedGroup preset="blur-slide" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {STEPS.map(({ step, emoji, color, border, title, desc }) => (
            <motion.div
              key={step}
              whileHover={{ y: -4, boxShadow: `0 12px 32px ${color}20` }}
              transition={{ duration: 0.2 }}
              style={{
                padding: '28px 22px', background: '#FFFFFF',
                borderRadius: 16, border: `1px solid ${border}`,
                boxShadow: '0 2px 20px rgba(0,0,0,0.04)',
                cursor: 'default',
              }}
            >
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 28, height: 28, borderRadius: '50%',
                background: color, color: '#fff',
                fontSize: 12, fontWeight: 800, marginBottom: 16,
              }}>{step}</div>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{title}</div>
              <div style={{ fontSize: 13, color: '#4B607D', lineHeight: 1.65 }}>{desc}</div>
            </motion.div>
          ))}
        </AnimatedGroup>
      </div>
    </section>
  );
}
