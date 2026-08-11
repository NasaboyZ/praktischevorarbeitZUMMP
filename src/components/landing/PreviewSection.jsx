import { InView } from '../motion/index.jsx';
import Badge from './Badge';

export default function PreviewSection() {
  return (
    <section id="vorschau" className="bg-[#F4F8FF] px-10 py-22.5 text-center">
      <div className="mx-auto max-w-270">
        <InView>
          <div>
            <Badge className="mx-auto mb-4">Vorschau</Badge>
            <h2 className="mb-3 text-[36px] font-extrabold">So sieht das Demo aus</h2>
            <p className="mb-12 text-base leading-[1.7] text-(--tx-secondary)">
              Desktop: Daten eingeben &amp; QR generieren — Smartphone: alle Ebenen live empfangen.
            </p>
          </div>
        </InView>
      </div>
    </section>
  );
}
