import { motion } from 'motion/react';
import { InView, AnimatedGroup } from './motion/index.jsx';
import Navbar from './landing/Navbar';
import Hero from './landing/Hero';

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

// ── Shared styles ──────────────────────────────────────────────────────────
const BADGE = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '4px 14px', borderRadius: 100,
  background: 'rgba(59,138,255,0.08)', border: '1px solid rgba(59,138,255,0.22)',
  fontSize: 11, color: '#3B8AFF',
  fontFamily: 'Roboto Mono, monospace',
  letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600,
};

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

const BENEFITS = [
  { icon: '🔒', color: '#22C55E', title: '100% Privat', stat: '0 Server',
    desc: 'Kein Cloud-Dienst berührt deine Daten. Stimmungsverläufe bleiben zwischen deinen Geräten — übertragen nur als kurzlebiger QR-Code.' },
  { icon: '⚡', color: '#3B8AFF', title: 'Blitzschnell', stat: '< 1s',
    desc: 'Von der Eingabe bis zum Ergebnis auf dem Smartphone unter einer Sekunde — direktes WebSocket-Streaming, ohne Upload-Delay.' },
  { icon: '📦', color: '#00C4D9', title: 'Reichhaltige Daten', stat: '3× Kapazität',
    desc: 'Stimmung, Tagebucheintrag, Foto und Sprachmemo — alles in einem Scan. Ein normaler QR würde bei dieser Datenmenge zusammenbrechen.' },
];

const STATS = [
  { value: '100%', label: 'Lokal & Privat' },
  { value: '< 1s', label: 'Übertragungszeit' },
  { value: '3×',   label: 'Mehr Kapazität' },
  { value: '0',    label: 'Server benötigt' },
];

// ── Main Component ─────────────────────────────────────────────────────────
export default function LandingPage({ onStart }) {
  return (
    <div style={{ background: '#FFFFFF', color: '#111827', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>

      <Navbar onStart={onStart} />
      <Hero onStart={onStart} />

      {/* ── Was ist Multi-Layer QR? ── */}
      <section id="konzept" style={{ background: '#FFFFFF', padding: '90px 40px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, alignItems: 'center' }}>

          <InView>
            <div>
              <div style={{ ...BADGE, marginBottom: 20 }}>Das Konzept</div>
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

      {/* ── 4 Steps ── */}
      <section id="ablauf" style={{ background: '#F4F8FF', padding: '90px 40px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <InView>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ ...BADGE, margin: '0 auto 16px' }}>Deine Reise</div>
              <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 14 }}>
                So erlebst du die Demo<br />in 4 Schritten
              </h2>
              <p style={{ color: '#4B607D', fontSize: 16, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
                Von der Stimmungseingabe bis zum Ergebnis auf dem Smartphone — live, privat, in Sekunden.
              </p>
            </div>
          </InView>

          <AnimatedGroup preset="blur-slide" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {STEPS.map(({ step, emoji, color, bg, border, title, desc }) => (
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

      {/* ── Warum Mental Health? ── */}
      <section id="warum" style={{ background: '#FFFFFF', padding: '90px 40px' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <InView>
            <div style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ ...BADGE, margin: '0 auto 16px' }}>Relevanz</div>
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

      {/* ── Stats ── */}
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

      {/* ── Screenshot ── */}
      <section id="vorschau" style={{ background: '#F4F8FF', padding: '90px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1080, margin: '0 auto' }}>
          <InView>
            <div>
              <div style={{ ...BADGE, margin: '0 auto 16px' }}>Vorschau</div>
              <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>So sieht das Demo aus</h2>
              <p style={{ color: '#4B607D', fontSize: 16, marginBottom: 48, lineHeight: 1.7 }}>
                Desktop: Daten eingeben &amp; QR generieren — Smartphone: alle Ebenen live empfangen.
              </p>
            </div>
          </InView>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{
        background: 'linear-gradient(135deg, #1A2A5E 0%, #0D1C3F 50%, #0A2240 100%)',
        padding: '90px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 700, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,138,255,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <InView variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }}>
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontSize: 44, fontWeight: 800, color: '#FFFFFF', marginBottom: 16, lineHeight: 1.2 }}>
              Bereit, das Konzept<br />live zu erleben?
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: 18, maxWidth: 480, margin: '0 auto 44px', lineHeight: 1.7 }}>
              Öffne die Demo, gib deine Stimmung ein und scanne den QR-Code
              mit deinem Smartphone — alles in Echtzeit.
            </p>
            <motion.button
              onClick={onStart}
              whileHover={{ scale: 1.05, boxShadow: '0 16px 56px rgba(59,138,255,0.60)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                padding: '17px 44px', borderRadius: 100,
                background: 'linear-gradient(135deg, #3B8AFF, #00C4D9)',
                border: 'none', color: '#fff',
                fontSize: 18, fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 8px 40px rgba(59,138,255,0.45)',
              }}
            >Demo starten →</motion.button>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 20, fontFamily: 'monospace' }}>
              Kein Account · Keine Cloud · Nur Konzept &amp; Technik
            </div>
          </div>
        </InView>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#0D1117', padding: '28px 40px' }}>
        <div style={{
          maxWidth: 1080, margin: '0 auto',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 26, height: 26, borderRadius: 6,
              background: 'linear-gradient(135deg, #FF5757 0%, #22C55E 50%, #3B8AFF 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 900, color: '#fff', fontSize: 13,
            }}>Q</div>
            <span style={{ color: '#4B607D', fontSize: 13 }}>Multi-Layer QR Code · Bachelorarbeit Demo</span>
          </div>
          <span style={{ color: '#2D3E55', fontSize: 12, fontFamily: 'monospace' }}>
            Demo-Prototyp · Nur für Forschungszwecke
          </span>
        </div>
      </footer>
    </div>
  );
}
