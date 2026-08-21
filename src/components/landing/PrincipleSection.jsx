import { InView } from '../motion/index.jsx';
import { Button } from '@/components/ui/button';
import stacksSvg from '../../assets/svg/stacks.svg';
import orangeFace from '../../assets/hero-Smiles/oranges-gesicht-emoji.png';

export default function PrincipleSection({ onStart }) {
  return (
    <section id="prinzip" className="border-y border-(--bd-subtle) bg-white">
      <div className="grid grid-cols-1 border-b border-(--bd-subtle) md:grid-cols-[minmax(160px,280px)_1fr]">
        <div className="flex items-center justify-center border-b border-(--bd-subtle) px-5 py-6 md:border-r md:border-b-0 md:py-8">
          <span className="text-[15px] font-bold italic text-(--tx-secondary)">
            (Das Prinzip)
          </span>
        </div>

        <InView className="px-5 py-12 sm:px-10 sm:py-16">
          <h2 className="mb-5 max-w-160 text-[clamp(30px,3.6vw,46px)] font-extrabold leading-tight">
            Tracke deine Stimmung,{' '}
            <span className="text-[#8FA6C9]">wann immer dir danach ist</span>
          </h2>
          <p className="mb-7 max-w-140 text-base leading-[1.75] text-(--tx-secondary)">
            Jede Eingabe wird lokal im Browser verarbeitet. Datum, Stimmung, Text und Medien machen
            dabei live sichtbar, wie schnell die Kapazität eines normalen QR-Codes erreicht ist — und
            wie mehrere rekonstruierbare Layer dieselbe Codefläche erweitern.
          </p>
          <Button onClick={onStart} className="h-11 rounded-full px-8 font-bold">
            Demo starten
          </Button>
        </InView>
      </div>

      <InView
        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
        className="grid-bg relative hidden aspect-1440/446 w-full sm:block"
      >
        <img
          src={stacksSvg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
        />
        <img
          src={orangeFace}
          alt="Schockierter oranger Smiley über dem aktuellen Dateneintrag"
          className="absolute left-[49.2%] top-[1.6%] w-[clamp(64px,8vw,108px)] -translate-x-1/2 translate-y-[-65%] drop-shadow-[0_10px_24px_rgba(0,0,0,0.12)]"
        />
        <div className="absolute left-[49.1%] top-[35%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-white px-5 py-2 text-[13px] font-bold text-[#172A41]">
          Erfasst
        </div>
      </InView>
    </section>
  );
}
