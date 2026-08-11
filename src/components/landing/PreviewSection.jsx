import { InView } from '../motion/index.jsx';
import Badge from './Badge';

export default function PreviewSection() {
  return (
    <section id="vorschau" style={{ background: '#F4F8FF', padding: '90px 40px', textAlign: 'center' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <InView>
          <div>
            <Badge style={{ margin: '0 auto 16px' }}>Vorschau</Badge>
            <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>So sieht das Demo aus</h2>
            <p style={{ color: '#4B607D', fontSize: 16, marginBottom: 48, lineHeight: 1.7 }}>
              Desktop: Daten eingeben &amp; QR generieren — Smartphone: alle Ebenen live empfangen.
            </p>
          </div>
        </InView>
      </div>
    </section>
  );
}
