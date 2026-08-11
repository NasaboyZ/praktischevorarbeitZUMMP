import { motion } from 'motion/react';
import { InView, AnimatedGroup } from '../motion/index.jsx';
import Badge from './Badge';

// ── Decorative mini QR mocks ───────────────────────────────────────────────
const QR_PATTERN = [
  1,1,1,0,1,0,1,1,1,
  1,0,1,0,0,1,1,0,1,
  1,1,1,0,1,0,1,1,1,
  0,1,0,1,0,1,0,0,0,
  1,0,1,1,1,0,1,0,1,
  0,1,0,0,1,1,0,1,0,
  1,1,1,0,0,1,1,1,0,
  1,0,0,1,1,0,0,0,1,
  1,1,0,0,1,1,1,1,1,
];

function MiniQR({ color, size = 72 }) {
  return (
    <div style={{
      width: size, height: size,
      display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)',
      gap: 1.5, padding: 6,
      background: '#fff', borderRadius: 10,
      border: `2px solid ${color}45`,
      boxShadow: `0 6px 24px ${color}22`,
    }}>
      {QR_PATTERN.map((v, i) => (
        <div key={i} style={{ background: v ? color : 'transparent', borderRadius: 1 }} />
      ))}
    </div>
  );
}

const COLOR_CELLS = [
  '#FF5757','#22C55E','#3B8AFF','#FF5757','#22C55E','#3B8AFF','#FF5757','#22C55E','#3B8AFF',
  '#FF5757','#fff','#fff','#fff','#fff','#3B8AFF','#22C55E','#fff','#3B8AFF',
  '#FF5757','#fff','#22C55E','#22C55E','#22C55E','#fff','#FF5757','#fff','#3B8AFF',
  '#fff','#3B8AFF','#22C55E','#FF5757','#fff','#FF5757','#fff','#3B8AFF','#fff',
  '#3B8AFF','#fff','#22C55E','#3B8AFF','#22C55E','#fff','#FF5757','#fff','#22C55E',
  '#fff','#22C55E','#fff','#fff','#3B8AFF','#FF5757','#fff','#22C55E','#fff',
  '#FF5757','#22C55E','#3B8AFF','#fff','#22C55E','#FF5757','#FF5757','#3B8AFF','#fff',
  '#3B8AFF','#fff','#FF5757','#22C55E','#fff','#fff','#22C55E','#fff','#FF5757',
  '#FF5757','#3B8AFF','#fff','#3B8AFF','#22C55E','#FF5757','#3B8AFF','#22C55E','#FF5757',
];

function ColorQR({ size = 88 }) {
  return (
    <div style={{
      width: size, height: size,
      display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)',
      gap: 1.5, padding: 6,
      background: '#fff', borderRadius: 10,
      border: '2px solid rgba(59,138,255,0.35)',
      boxShadow: '0 8px 28px rgba(59,138,255,0.18)',
    }}>
      {COLOR_CELLS.map((c, i) => (
        <div key={i} style={{ background: c, borderRadius: 1 }} />
      ))}
    </div>
  );
}

export default function ConceptSection() {
  return (
    <section id="konzept" style={{ background: '#FFFFFF', padding: '90px 40px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>

        <InView>
          <div>
            <Badge style={{ marginBottom: 20 }}>Das Konzept</Badge>
            <h2 style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.2, marginBottom: 20 }}>
              Was ist ein<br />Multi-Layer QR-Code?
            </h2>
            <p style={{ fontSize: 16, color: '#4B607D', lineHeight: 1.8, marginBottom: 20 }}>
              Ein normaler QR-Code hat <strong style={{ color: '#111827' }}>eine Oberfläche</strong> —
              damit eine feste Kapazitätsgrenze von ~2 KB.
              Bei Fotos, Tagebucheinträgen und Sprachnotizen reicht das nicht.
            </p>
            <p style={{ fontSize: 16, color: '#4B607D', lineHeight: 1.8, marginBottom: 32 }}>
              Mein Ansatz: Drei unabhängige QR-Codes werden über die
              <strong style={{ color: '#111827' }}> RGB-Farbkanäle</strong> zu einem einzigen
              farbigen Code kombiniert. Das Ergebnis:{' '}
              <strong style={{ color: '#3B8AFF' }}>3× mehr Kapazität</strong> auf derselben Fläche.
            </p>
            <AnimatedGroup preset="slide" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { color: '#FF5757', label: 'Roter Kanal (L1)', desc: 'Session-Routing & Basis-Metadaten' },
                { color: '#22C55E', label: 'Grüner Kanal (L2)', desc: 'Strukturierte Stimmungs- & Textdaten' },
                { color: '#3B8AFF', label: 'Blauer Kanal (L3)', desc: 'Medien, Binär & Audio-Payloads' },
              ].map(({ color, label, desc }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 16px', borderRadius: 10,
                  background: `${color}08`, border: `1px solid ${color}25`,
                }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0 }} />
                  <div>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{label}:</span>{' '}
                    <span style={{ color: '#4B607D', fontSize: 14 }}>{desc}</span>
                  </div>
                </div>
              ))}
            </AnimatedGroup>
          </div>
        </InView>

        <InView variants={{ hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            {/* QR Layer Visual */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {[
                { color: '#FF5757', label: 'L1' },
                { color: '#22C55E', label: 'L2' },
                { color: '#3B8AFF', label: 'L3' },
              ].map(({ color, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
                  style={{ textAlign: 'center' }}
                >
                  <MiniQR color={color} size={72} />
                  <div style={{ fontSize: 10, color, marginTop: 6, fontFamily: 'monospace', fontWeight: 700 }}>{label}</div>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65, duration: 0.4 }}
                style={{ fontSize: 28, color: '#C0CEDF', fontWeight: 300, margin: '0 4px' }}
              >=</motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.75, type: 'spring', stiffness: 260, damping: 20 }}
                style={{ textAlign: 'center' }}
              >
                <ColorQR size={88} />
                <div style={{ fontSize: 10, color: '#3B8AFF', marginTop: 6, fontFamily: 'monospace', fontWeight: 700 }}>
                  3× Kapazität
                </div>
              </motion.div>
            </div>

            <div style={{
              padding: '16px 20px', borderRadius: 12,
              background: 'rgba(59,138,255,0.05)', border: '1px solid rgba(59,138,255,0.15)',
              fontSize: 14, color: '#4B607D', textAlign: 'center', maxWidth: 360, lineHeight: 1.6,
            }}>
              Durch <strong style={{ color: '#3B8AFF' }}>Farb-Multiplexing</strong> trägt jedes Pixel
              drei Bits gleichzeitig — eines pro Farbkanal.
            </div>

            {/* Capacity bars */}
            <div style={{ width: '100%', maxWidth: 360, padding: '16px 18px', borderRadius: 12, background: '#F5F8FF', border: '1px solid #E0E9F5' }}>
              {[
                { label: 'Normal QR', pct: 33, color: '#EF4444', note: '~2 KB max' },
                { label: 'Multi-Layer QR', pct: 100, color: '#22C55E', note: '~6 KB+' },
              ].map(({ label, pct, color, note }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 600 }}>{label}</span>
                    <span style={{ fontSize: 11, color: '#8A9FBD', fontFamily: 'monospace' }}>{note}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: '#E0E9F5', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: '100%', background: color, borderRadius: 3 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </InView>
      </div>
    </section>
  );
}
