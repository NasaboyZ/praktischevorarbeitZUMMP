import { motion } from 'motion/react';
import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import redFace from '../../assets/hero-Smiles/rotesgesicht-emoji.png';
import orangeFace from '../../assets/hero-Smiles/oranges-gesicht-emoji.png';
import greenFace from '../../assets/hero-Smiles/gruenesgesicht-emoji.png';

const LAYERS = [
  { id: 'R', title: 'Stimmung', value: 'aufgeregt', color: '#ff5757', face: redFace, offset: '-rotate-6 -translate-x-7' },
  { id: 'G', title: 'Kontext', value: 'mit Freunden', color: '#22c55e', face: greenFace, offset: 'rotate-3 translate-x-4 -translate-y-5' },
  { id: 'B', title: 'Erinnerung', value: '18:42 · Zürich', color: '#3b8aff', face: orangeFace, offset: '-rotate-2 -translate-x-1 -translate-y-9' },
];

function LayerCard({ layer, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, x: 36, rotate: 0 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.25 + index * 0.12, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={`relative mx-auto grid w-[82%] max-w-105 grid-cols-[1fr_auto] items-end gap-5 border-2 bg-white p-5 shadow-[8px_10px_0_#111827] sm:p-6 ${layer.offset}`}
      style={{ borderColor: layer.color }}
    >
      <div>
        <div className="mb-8 flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase">
          <span className="grid size-7 place-items-center text-white" style={{ backgroundColor: layer.color }}>{layer.id}</span>
          Layer 0{index + 1} / {layer.title}
        </div>
        <p className="text-xl font-semibold tracking-tight sm:text-2xl">{layer.value}</p>
      </div>
      <img src={layer.face} alt="" aria-hidden="true" className="size-15 object-contain sm:size-19" />
      <div
        aria-hidden="true"
        className="absolute top-4 right-4 size-10 opacity-20"
        style={{
          backgroundImage: `repeating-conic-gradient(${layer.color} 0 25%, transparent 0 50%)`,
          backgroundSize: '8px 8px',
        }}
      />
    </motion.article>
  );
}

export default function Hero({ onStart }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f7f4ee] px-6 pt-28 pb-16 sm:px-10 lg:pt-32">
      <div aria-hidden="true" className="absolute inset-y-0 left-[58%] hidden w-px bg-[#111827]/12 lg:block" />

      <div className="mx-auto grid max-w-300 items-center gap-18 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <div className="mb-9 flex items-center gap-4 font-mono text-[11px] font-semibold tracking-[0.16em] text-[#536176] uppercase">
            <span>Versuch 01</span>
            <span className="h-px w-12 bg-[#111827]/30" />
            <span>Multi-Layer QR</span>
          </div>

          <h1 className="max-w-165 font-serif text-[clamp(3.25rem,7vw,6.7rem)] leading-[0.88] font-semibold tracking-[-0.055em] text-[#111827]">
            Eine Erinnerung.
            <span className="mt-3 block font-sans text-[0.66em] leading-[0.96] font-black tracking-[-0.06em]">
              Drei sichtbare Ebenen.
            </span>
          </h1>

          <div className="mt-10 grid max-w-155 gap-7 border-t border-[#111827]/20 pt-7 sm:grid-cols-[1fr_auto] sm:items-end">
            <p className="max-w-110 text-base leading-7 text-[#536176] sm:text-lg">
              Dieser Prototyp zerlegt emotionale Daten in drei Farbkanäle und setzt sie zu einem einzigen QR-Code zusammen.
            </p>
            <ArrowDownRight className="hidden size-9 text-[#111827] sm:block" strokeWidth={1.5} />
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-5">
            <Button
              onClick={onStart}
              size="lg"
              className="h-14 rounded-none bg-[#111827] px-7 text-base font-bold text-white shadow-[5px_5px_0_#ff5757] hover:bg-[#263244]"
            >
              Versuch starten <ArrowRight className="size-4" />
            </Button>
            <span className="max-w-55 font-mono text-[11px] leading-5 text-[#6b778a] uppercase">
              Ohne Login<br />Daten bleiben lokal
            </span>
          </div>
        </motion.div>

        <div className="relative min-h-135 py-12 lg:pl-10">
          <div className="absolute top-0 right-0 font-mono text-[10px] tracking-[0.14em] text-[#536176] uppercase">
            Datensatz / Prototyp 01
          </div>
          <div className="flex flex-col pt-10">
            {LAYERS.map((layer, index) => <LayerCard key={layer.id} layer={layer} index={index} />)}
          </div>
          <p className="absolute right-0 bottom-0 max-w-50 text-right font-mono text-[10px] leading-4 tracking-[0.12em] text-[#536176] uppercase">
            Überlagerung<br />R + G + B = MLQR
          </p>
        </div>
      </div>
    </section>
  );
}
