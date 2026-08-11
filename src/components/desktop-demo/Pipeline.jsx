const STEPS = ['USER DATA','STRUCTURE','COMPRESS','SPLIT LAYERS','ENCODE','QR'];

export default function Pipeline({ step }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:4, flexWrap:'wrap' }}>
      {STEPS.map((s, i) => (
        <div key={s} style={{ display:'flex', alignItems:'center', gap:4 }}>
          <div style={{
            padding:'3px 8px', borderRadius:4,
            background: i <= step ? 'var(--blue-dim)' : 'transparent',
            border: `1px solid ${i <= step ? 'rgba(59,138,255,0.4)' : 'var(--bd-subtle)'}`,
            fontFamily:'var(--f-mono)', fontSize:9, letterSpacing:'0.06em',
            color: i <= step ? 'var(--blue)' : 'var(--tx-dim)',
            transition:'all 0.3s var(--ease)',
          }}>{s}</div>
          {i < STEPS.length - 1 && (
            <span style={{ color: i < step ? 'var(--blue)' : 'var(--tx-dim)', fontSize:10 }}>→</span>
          )}
        </div>
      ))}
    </div>
  );
}
