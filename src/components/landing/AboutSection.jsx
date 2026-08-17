import { Play, CalendarDays, Images, ChartNoAxesColumnIncreasing } from 'lucide-react';
import { InView } from '../motion/index.jsx';
import { Card, CardContent, CardFooter, CardTitle, CardDescription } from '@/components/ui/card';

const STEPS = [
  {
    icon: Play,
    title: 'Demo starten',
    description: 'Klicke auf „Demo starten“. Du brauchst weder ein Konto noch eine Installation.',
    detail: 'Los geht’s',
    color: 'var(--violet)',
    background: 'var(--violet-dim)',
  },
  {
    icon: CalendarDays,
    title: 'Tag, Gefühl und Ort wählen',
    description: 'Wähle ein Datum und beschreibe mit Gefühl und Ort, wie dein Tag gerade aussieht.',
    detail: 'Dein Eintrag',
    color: 'var(--g)',
    background: 'var(--g-dim)',
  },
  {
    icon: Images,
    title: 'Erinnerungen hinzufügen',
    description: 'Ergänze deinen Tag optional mit einer Notiz, Bildern oder einer Sprachnotiz.',
    detail: 'Text · Bild · Audio',
    color: 'var(--b)',
    background: 'var(--b-dim)',
  },
  {
    icon: ChartNoAxesColumnIncreasing,
    title: 'Den Unterschied erleben',
    description: 'Vergleiche live, wann ein normaler QR-Code an seine Grenze kommt und wie drei Layer dieselbe Fläche besser nutzen.',
    detail: 'Der Aha-Moment',
    color: 'var(--r)',
    background: 'var(--r-dim)',
  },
];

function CardNumber({ n }) {
  return (
    <div className="absolute left-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-(--bd-subtle) bg-white text-sm font-bold text-(--tx-primary)">
      {String(n).padStart(2, '0')}
    </div>
  );
}

export default function AboutSection() {
  return (
    <section id="projekt" className="border-y border-(--bd-subtle) bg-white">
      <div className="grid-bg grid grid-cols-1 border-b border-(--bd-subtle) md:grid-cols-[1fr_minmax(160px,280px)]">
        <InView className="px-10 py-16 md:pr-16">
          <h2 className="mb-5 text-[clamp(30px,3.6vw,46px)] font-extrabold leading-tight">
            Vier Schritte bis zum<br />
            <span className="text-[#8FA6C9]">Multi-Layer-Aha-Moment</span>
          </h2>
          <p className="max-w-165 text-base leading-[1.75] text-(--tx-secondary)">
            Diese Arbeit untersucht, wie sich persönliche Daten lokal bündeln und über einen
            Multi-Layer-QR-Code von einem Gerät auf ein anderes übertragen lassen. Die Demo macht
            den Kapazitätsunterschied sichtbar und führt dich Schritt für Schritt dorthin.
          </p>
          <div className="mt-6 max-w-165 rounded-xl border border-(--bd-subtle) bg-(--bg-surface) px-5 py-4 text-sm leading-[1.7] text-(--tx-secondary)">
            <strong className="text-(--tx-primary)">Was passiert mit deinen Daten?</strong>{' '}
            Einträge, Bilder und Audio liegen während der Eingabe nur im Arbeitsspeicher deines Browsers
            und werden nicht dauerhaft gespeichert. Beim Neuladen sind sie weg. Nur dein Name wird lokal
            auf deinem Gerät gemerkt. Eine Übertragung startet erst, wenn du die Transfersitzung mit einem
            Smartphone verbindest.
          </div>
        </InView>

        <div className="flex items-center justify-center border-t border-(--bd-subtle) px-5 py-8 md:border-l md:border-t-0">
          <span className="text-[15px] font-bold italic text-(--tx-secondary)">(So geht die Demo)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 px-10 py-16 md:grid-cols-2">
        {STEPS.map(({ icon: Icon, title, description, detail, color, background }, index) => (
          <InView key={title}>
            <Card className="h-full gap-0 py-0 ring-(--bd-subtle)">
              <CardContent className="relative flex min-h-56 items-center justify-center px-8 py-10">
                <CardNumber n={index + 1} />
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="flex h-18 w-18 items-center justify-center rounded-2xl" style={{ color, background }}>
                    <Icon className="size-8" />
                  </div>
                  <span className="rounded-full bg-(--bg-surface) px-4 py-1.5 font-mono text-xs font-semibold text-(--tx-secondary)">
                    {detail}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 px-8 py-7">
                <CardTitle className="text-xl font-extrabold">{title}</CardTitle>
                <CardDescription className="text-sm leading-[1.7] text-(--tx-secondary)">
                  {description}
                </CardDescription>
              </CardFooter>
            </Card>
          </InView>
        ))}
      </div>
    </section>
  );
}
