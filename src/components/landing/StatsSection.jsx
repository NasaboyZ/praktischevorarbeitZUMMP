import { AnimatedGroup } from '../motion/index.jsx';

const STATS = [
  { value: '100%', label: 'Lokal & Privat' },
  { value: '< 1s', label: 'Übertragungszeit' },
  { value: '3×',   label: 'Mehr Kapazität' },
  { value: '0',    label: 'Server benötigt' },
];

export default function StatsSection() {
  return (
    <section style={{ background: '#111827', padding: '56px 40px' }}>
      <AnimatedGroup preset="slide" style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, textAlign: 'center' }}>
        {STATS.map(({ value, label }) => (
          <div key={label}>
            <div style={{
              fontSize: 44, fontWeight: 800,
              background: 'linear-gradient(135deg, #3B8AFF, #00C4D9)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{value}</div>
            <div style={{ fontSize: 13, color: '#8A9FBD', marginTop: 6 }}>{label}</div>
          </div>
        ))}
      </AnimatedGroup>
    </section>
  );
}
