import { Workflow, Lock, Timer } from 'lucide-react';
import { InView } from '../motion/index.jsx';
import { Card, CardContent } from '@/components/ui/card';
import quadrate from '../../assets/svg/quadrate.svg';
import kreiss from '../../assets/svg/kreiss.svg';
import liniengruppe from '../../assets/svg/liniengorup.svg';

const HIGHLIGHTS = [
  {
    icon: Workflow,
    pattern: quadrate,
    value: '100%',
    desc: 'Läuft vollständig im Browser – eine einzelne HTML-Datei, kein Server, keine Installation.',
  },
  {
    icon: Lock,
    pattern: kreiss,
    value: 'Privat',
    desc: 'Deine Stimmungsdaten verlassen nie dein Gerät – übertragen wird nur ein kurzlebiger QR-Code.',
  },
  {
    icon: Timer,
    pattern: liniengruppe,
    value: '< 1s',
    desc: 'Von der Eingabe bis zur fertigen Farbkodierung vergeht weniger als eine Sekunde.',
  },
];

export default function HighlightsSection() {
  return (
    <section className="bg-white px-10 py-16">
      <div className="mx-auto max-w-270">
        <div className="mb-8 text-right">
          <span className="text-[15px] font-bold italic text-(--tx-secondary)">
            (So funktioniert's)
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {HIGHLIGHTS.map(({ icon: Icon, pattern, value, desc }) => (
            <InView key={value} className="h-full">
              <Card variant="secondary" className="h-full gap-0 py-0">
                <CardContent className="relative overflow-hidden px-0 pt-6">
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-45 overflow-hidden">
                    <img src={pattern} alt="" className="absolute right-0 top-0 h-auto w-52" />
                  </div>
                  <div className="relative flex h-45 flex-col justify-start px-6">
                    <div className="mb-auto flex h-9 w-9 items-center justify-center rounded-lg bg-white text-(--r) shadow-[0_2px_8px_rgba(17,24,39,0.06)]">
                      <Icon className="size-4.5" />
                    </div>
                    <div className="text-[40px] font-extrabold leading-none">{value}</div>
                  </div>
                </CardContent>
                <div className="flex-1 px-6 pb-6 text-sm leading-[1.7] text-(--tx-secondary)">
                  {desc}
                </div>
              </Card>
            </InView>
          ))}
        </div>
      </div>
    </section>
  );
}
