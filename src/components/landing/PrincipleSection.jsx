import { InView } from '../motion/index.jsx';
import { Button } from '@/components/ui/button';
import stacksSvg from '../../assets/svg/stacks.svg';
import orangeFace from '../../assets/hero-Smiles/oranges-gesicht-emoji.png';

export default function PrincipleSection({ onStart }) {
  return (
    <section id="prinzip" style={{ background: '#FFFFFF', borderTop: '1px solid #E0E9F5', borderBottom: '1px solid #E0E9F5' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(160px, 280px) 1fr', borderBottom: '1px solid #E0E9F5' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '32px 20px', borderRight: '1px solid #E0E9F5',
        }}>
          <span style={{ fontStyle: 'italic', fontWeight: 700, fontSize: 15, color: '#4B607D' }}>
            (Das Prinzip)
          </span>
        </div>

        <InView style={{ padding: '64px 40px' }}>
          <h2 style={{ fontSize: 'clamp(30px,3.6vw,46px)', fontWeight: 800, lineHeight: 1.2, marginBottom: 20, maxWidth: 640 }}>
            Tracke deine Stimmung,{' '}
            <span style={{ color: '#8FA6C9' }}>wann immer dir danach ist</span>
          </h2>
          <p style={{ fontSize: 16, color: '#4B607D', lineHeight: 1.75, maxWidth: 560, marginBottom: 28 }}>
            Jede Eingabe wird sofort verarbeitet. Enthält ein Eintrag außergewöhnlich viele Daten —
            Text, Foto, Sprachmemo — erkennt das System das automatisch und bereitet ihn für die
            Kodierung in den farbigen Multi-Layer QR-Code vor.
          </p>
          <Button onClick={onStart} className="h-11 rounded-full px-8 font-bold">
            Demo starten
          </Button>
        </InView>
      </div>

      <InView
        variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
        style={{
          position: 'relative', width: '100%', aspectRatio: '1440 / 446',
          backgroundImage: 'linear-gradient(#E0E9F5 1px, transparent 1px), linear-gradient(90deg, #E0E9F5 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      >
        <img
          src={stacksSvg}
          alt=""
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
        <img
          src={orangeFace}
          alt="Schockierter oranger Smiley über dem aktuellen Dateneintrag"
          style={{
            position: 'absolute', left: '49.2%', top: '1.6%',
            transform: 'translate(-50%, -65%)',
            width: 'clamp(64px, 8vw, 108px)',
            filter: 'drop-shadow(0 10px 24px rgba(0,0,0,0.12))',
          }}
        />
        {/* Deckt das im SVG fest eingebrannte (englische) "Anxienty"-Label ab */}
        <div style={{
          position: 'absolute', left: '49.1%', top: '35%', transform: 'translate(-50%, -50%)',
          padding: '8px 20px', borderRadius: 100, background: '#FFFFFF',
          border: '1px solid #DBE2EB', boxShadow: '0 4px 14px rgba(17,24,39,0.06)',
          fontSize: 13, fontWeight: 700, color: '#172A41', whiteSpace: 'nowrap',
        }}>
          Erfasst
        </div>
      </InView>
    </section>
  );
}
