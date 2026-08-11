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
    <div
      className="grid grid-cols-9 gap-[1.5px] rounded-[10px] bg-white p-1.5"
      style={{ width: size, height: size, border: `2px solid ${color}45`, boxShadow: `0 6px 24px ${color}22` }}
    >
      {QR_PATTERN.map((v, i) => (
        <div key={i} className="rounded-[1px]" style={{ background: v ? color : 'transparent' }} />
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
    <div
      className="grid grid-cols-9 gap-[1.5px] rounded-[10px] border-2 border-[rgba(59,138,255,0.35)] bg-white p-1.5 shadow-[0_8px_28px_rgba(59,138,255,0.18)]"
      style={{ width: size, height: size }}
    >
      {COLOR_CELLS.map((c, i) => (
        <div key={i} className="rounded-[1px]" style={{ background: c }} />
      ))}
    </div>
  );
}

export default function ConceptSection() {
  return (
    <section id="konzept" className="bg-white px-10 py-22.5">
      <div className="mx-auto grid max-w-270 grid-cols-2 items-center gap-18">

        <InView>
          <div>
            <Badge className="mb-5">Das Konzept</Badge>
            <h2 className="mb-5 text-[38px] font-extrabold leading-tight">
              Was ist ein<br />Multi-Layer QR-Code?
            </h2>
            <p className="mb-5 text-base leading-[1.8] text-(--tx-secondary)">
              Ein normaler QR-Code hat <strong className="text-(--tx-primary)">eine Oberfläche</strong> —
              damit eine feste Kapazitätsgrenze von ~2 KB.
              Bei Fotos, Tagebucheinträgen und Sprachnotizen reicht das nicht.
            </p>
            <p className="mb-8 text-base leading-[1.8] text-(--tx-secondary)">
              Mein Ansatz: Drei unabhängige QR-Codes werden über die
              <strong className="text-(--tx-primary)"> RGB-Farbkanäle</strong> zu einem einzigen
              farbigen Code kombiniert. Das Ergebnis:{' '}
              <strong className="text-(--blue)">3× mehr Kapazität</strong> auf derselben Fläche.
            </p>
            <AnimatedGroup preset="slide" className="flex flex-col gap-3">
              {[
                { color: '#FF5757', label: 'Roter Kanal (L1)', desc: 'Session-Routing & Basis-Metadaten' },
                { color: '#22C55E', label: 'Grüner Kanal (L2)', desc: 'Strukturierte Stimmungs- & Textdaten' },
                { color: '#3B8AFF', label: 'Blauer Kanal (L3)', desc: 'Medien, Binär & Audio-Payloads' },
              ].map(({ color, label, desc }) => (
                <div
                  key={label}
                  className="flex items-center gap-3.5 rounded-[10px] px-4 py-3"
                  style={{ background: `${color}08`, border: `1px solid ${color}25` }}
                >
                  <div className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: color }} />
                  <div>
                    <span className="text-sm font-bold">{label}:</span>{' '}
                    <span className="text-sm text-(--tx-secondary)">{desc}</span>
                  </div>
                </div>
              ))}
            </AnimatedGroup>
          </div>
        </InView>

        <InView variants={{ hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } }}>
          <div className="flex flex-col items-center gap-6">
            {/* QR Layer Visual */}
            <div className="flex items-center gap-3">
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
                  className="text-center"
                >
                  <MiniQR color={color} size={72} />
                  <div className="mt-1.5 font-mono text-[10px] font-bold" style={{ color }}>{label}</div>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65, duration: 0.4 }}
                className="mx-1 text-[28px] font-light text-(--tx-dim)"
              >=</motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.75, type: 'spring', stiffness: 260, damping: 20 }}
                className="text-center"
              >
                <ColorQR size={88} />
                <div className="mt-1.5 font-mono text-[10px] font-bold text-(--blue)">
                  3× Kapazität
                </div>
              </motion.div>
            </div>

            <div className="max-w-90 rounded-xl border border-[rgba(59,138,255,0.15)] bg-[rgba(59,138,255,0.05)] px-5 py-4 text-center text-sm leading-[1.6] text-(--tx-secondary)">
              Durch <strong className="text-(--blue)">Farb-Multiplexing</strong> trägt jedes Pixel
              drei Bits gleichzeitig — eines pro Farbkanal.
            </div>

            {/* Capacity bars */}
            <div className="w-full max-w-90 rounded-xl border border-(--bd-subtle) bg-[#F5F8FF] px-4.5 py-4">
              {[
                { label: 'Normal QR', pct: 33, color: '#EF4444', note: '~2 KB max' },
                { label: 'Multi-Layer QR', pct: 100, color: '#22C55E', note: '~6 KB+' },
              ].map(({ label, pct, color, note }) => (
                <div key={label} className="mb-2.5">
                  <div className="mb-1 flex justify-between">
                    <span className="text-xs font-semibold">{label}</span>
                    <span className="font-mono text-[11px] text-(--tx-muted)">{note}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-[3px] bg-(--bd-subtle)">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.8, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-[3px]"
                      style={{ background: color }}
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
