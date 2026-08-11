import { AnimatedGroup } from '../motion/index.jsx';

const STATS = [
  { value: '100%', label: 'Lokal & Privat' },
  { value: '< 1s', label: 'Übertragungszeit' },
  { value: '3×',   label: 'Mehr Kapazität' },
  { value: '0',    label: 'Server benötigt' },
];

export default function StatsSection() {
  return (
    <section className="bg-(--tx-primary) px-10 py-14">
      <AnimatedGroup preset="slide" className="mx-auto grid max-w-225 grid-cols-4 gap-6 text-center">
        {STATS.map(({ value, label }) => (
          <div key={label}>
            <div className="bg-linear-to-br from-(--blue) to-(--cyan) bg-clip-text text-[44px] font-extrabold text-transparent">
              {value}
            </div>
            <div className="mt-1.5 text-[13px] text-(--tx-muted)">{label}</div>
          </div>
        ))}
      </AnimatedGroup>
    </section>
  );
}
