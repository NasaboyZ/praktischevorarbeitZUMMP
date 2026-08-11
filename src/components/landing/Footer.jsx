export default function Footer() {
  return (
    <footer style={{ background: '#0D1117', padding: '28px 40px' }}>
      <div style={{
        maxWidth: 1080, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: 'linear-gradient(135deg, #FF5757 0%, #22C55E 50%, #3B8AFF 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, color: '#fff', fontSize: 13,
          }}>Q</div>
          <span style={{ color: '#4B607D', fontSize: 13 }}>Multi-Layer QR Code · Bachelorarbeit Demo</span>
        </div>
        <span style={{ color: '#2D3E55', fontSize: 12, fontFamily: 'monospace' }}>
          Demo-Prototyp · Nur für Forschungszwecke
        </span>
      </div>
    </footer>
  );
}
