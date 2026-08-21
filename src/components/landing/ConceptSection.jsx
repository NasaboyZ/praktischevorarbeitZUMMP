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
    <section id="konzept" className="bg-white px-5 py-14 sm:px-10 sm:py-18 lg:py-22.5">
      <div className="mx-auto grid max-w-270 grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-18">

        <InView>
          <div>
            <Badge className="mb-5">Das Konzept</Badge>
            <h2 className="mb-5 text-[clamp(1.875rem,7vw,2.375rem)] font-extrabold leading-tight">
              Das Noppakaew-Prinzip<br className="hidden sm:block" /> hinter dem Multi-Layer QR
            </h2>
            <p className="mb-5 text-base leading-[1.8] text-(--tx-secondary)">
              Zuerst werden die Daten auf mehrere gleich große Schwarz-Weiß-QR-Codes verteilt.
              Deren helle Module erhalten unterschiedliche Intensitäten in Rot, Grün oder Blau und
              werden anschließend <strong className="text-(--tx-primary)">pixelgenau überlagert</strong>.
            </p>
            <p className="mb-8 text-base leading-[1.8] text-(--tx-secondary)">
              Die Intensitätswerte stammen aus einer Partition von <strong className="text-(--tx-primary)">255</strong>,
              aufgebaut mit einer geometrischen Folge. Dadurch bleibt jede Summe eindeutig: Beim
              Entschichten lässt sich erkennen, welche ursprünglichen QR-Layer an einem Pixel hell oder
              dunkel waren. Die Demo zeigt den verständlichen Spezialfall mit drei Ebenen — je einer in R, G und B.
            </p>
            <AnimatedGroup preset="slide" className="flex flex-col gap-3">
              {[
                { color: '#FF5757', label: '1. QR-Layer erzeugen', desc: 'Daten werden auf gleich große Schwarz-Weiß-Codes verteilt.' },
                { color: '#22C55E', label: '2. Intensitäten zuweisen', desc: 'Eindeutige Werte aus einer Partition von 255 färben die hellen Module.' },
                { color: '#3B8AFF', label: '3. Layer überlagern', desc: 'Die Summen in den RGB-Kanälen bilden einen farbigen MLQR-Code.' },
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
            <div className="flex max-w-full scale-75 items-center gap-3 sm:scale-100">
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
                  3 Layer · 1 Code
                </div>
              </motion.div>
            </div>

            <div className="max-w-90 rounded-xl border border-[rgba(59,138,255,0.15)] bg-[rgba(59,138,255,0.05)] px-5 py-4 text-center text-sm leading-[1.6] text-(--tx-secondary)">
              Weil die Intensitätssummen eindeutig zerlegt werden können, lassen sich die einzelnen
              Schwarz-Weiß-Layer später wieder aus dem farbigen Code rekonstruieren.
            </div>

            {/* Capacity bars */}
            <div className="w-full max-w-90 rounded-xl border border-(--bd-subtle) bg-[#F5F8FF] px-4.5 py-4">
              {[
                { label: 'Normaler QR', pct: 33, color: '#EF4444', note: '1 Datenebene' },
                { label: 'Demo-MLQR', pct: 100, color: '#22C55E', note: '3 Datenebenen' },
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
