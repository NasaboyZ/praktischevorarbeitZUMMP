export default function Badge({ children, style }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 14px', borderRadius: 100,
      background: 'rgba(59,138,255,0.08)', border: '1px solid rgba(59,138,255,0.22)',
      fontSize: 11, color: '#3B8AFF',
      fontFamily: 'Roboto Mono, monospace',
      letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 600,
      ...style,
    }}>
      {children}
    </div>
  );
}
