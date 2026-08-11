import { motion } from 'motion/react';
import { InView } from '../motion/index.jsx';

export default function FinalCta({ onStart }) {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #1A2A5E 0%, #0D1C3F 50%, #0A2240 100%)',
      padding: '90px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 700, height: 350, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,138,255,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <InView variants={{ hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } }}>
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontSize: 44, fontWeight: 800, color: '#FFFFFF', marginBottom: 16, lineHeight: 1.2 }}>
            Bereit, das Konzept<br />live zu erleben?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.70)', fontSize: 18, maxWidth: 480, margin: '0 auto 44px', lineHeight: 1.7 }}>
            Öffne die Demo, gib deine Stimmung ein und scanne den QR-Code
            mit deinem Smartphone — alles in Echtzeit.
          </p>
          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.05, boxShadow: '0 16px 56px rgba(59,138,255,0.60)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '17px 44px', borderRadius: 100,
              background: 'linear-gradient(135deg, #3B8AFF, #00C4D9)',
              border: 'none', color: '#fff',
              fontSize: 18, fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 8px 40px rgba(59,138,255,0.45)',
            }}
          >Demo starten →</motion.button>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 20, fontFamily: 'monospace' }}>
            Kein Account · Keine Cloud · Nur Konzept &amp; Technik
          </div>
        </div>
      </InView>
    </section>
  );
}
