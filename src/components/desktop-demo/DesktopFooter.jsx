import { hasAblyKey } from '../../lib/ws';

export default function DesktopFooter({ wsConnected, onResend }) {
  return (
    <footer style={{
      position:'relative', zIndex:10,
      padding:'10px 28px',
      borderTop:'1px solid var(--bd-subtle)',
      background:'rgba(255,255,255,0.95)',
      backdropFilter:'blur(12px)',
      display:'flex', alignItems:'center', gap:20, flexWrap:'wrap',
    }}>
      <span className="label">
        {wsConnected
          ? 'Smartphone verbunden'
          : hasAblyKey()
          ? 'Ably verbunden · QR-Code anklicken → Scan-QR erscheint'
          : 'VITE_ABLY_KEY fehlt — Ably API Key in Vercel + .env.local eintragen'}
      </span>

      {wsConnected && (
        <button className="btn btn-blue" onClick={onResend} style={{ marginLeft:8 }}>
          <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
          </svg>
          Daten neu senden
        </button>
      )}

      <div style={{ display:'flex', gap:12, marginLeft:'auto', alignItems:'center' }}>
        <span style={{ fontFamily:'var(--f-mono)', fontSize:10, color:'var(--tx-dim)' }}>
          REAL: QR-Generierung, Session, Scan, Datenübertragung, Medienrekonstruktion
        </span>
        <span style={{ fontFamily:'var(--f-mono)', fontSize:10, color:'var(--tx-dim)' }}>
          DEMO: Timeline-Simulation, Datenschichten-Visualisierung
        </span>
      </div>
    </footer>
  );
}
