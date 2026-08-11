import { formatSize, formatTimeline, getCapacityInfo, QR_CAPACITY_BY_LEVEL } from '../../lib/data';

export default function NormalQRPanel({ qrState, dataSize, timelineDays }) {
  const cap = getCapacityInfo(dataSize);
  const pctDisplay = Math.min(Math.round(cap.pct * 100), 100);
  const statusClass = cap.exceeded ? 's-err' : cap.level === 'warn' ? 's-warn' : 's-ok';
  const statusText  = cap.exceeded ? 'KAPAZITÄT ÜBERSCHRITTEN' : cap.level === 'warn' ? 'DICHTE HOCH' : 'SCAN BEREIT';

  return (
    <div style={{
      display:'flex', flexDirection:'column', gap:16, height:'100%',
      padding:'20px 16px',
    }}>
      {/* Header */}
      <div>
        <div className="label" style={{ marginBottom:4 }}>Klassischer Ansatz</div>
        <div style={{ fontFamily:'var(--f-display)', fontSize:20, fontWeight:700, color:'var(--tx-primary)' }}>
          NORMAL QR
        </div>
        <div style={{ fontFamily:'var(--f-mono)', fontSize:10, color:'var(--tx-muted)', marginTop:2 }}>
          Einzelne Oberfläche · Alle Daten
        </div>
      </div>

      {/* QR Display */}
      <div style={{
        position:'relative', borderRadius:12, overflow:'hidden',
        border: cap.exceeded ? '2px solid rgba(239,68,68,0.4)' : '2px solid var(--bd-default)',
        background: cap.exceeded ? 'rgba(239,68,68,0.05)' : 'var(--bg-surface)',
        transition:'border-color 0.4s',
        minHeight:200, display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        {qrState.dataUrl && !cap.exceeded && (
          <img
            src={qrState.dataUrl}
            alt="Normal QR Code"
            style={{
              width:'100%', maxWidth:240, display:'block',
              imageRendering:'pixelated',
            }}
          />
        )}

        {/* Overloaded state */}
        {cap.exceeded && (
          <div style={{ padding:24, textAlign:'center' }}>
            <div style={{ fontSize:32, marginBottom:8, filter:'grayscale(1) opacity(0.5)' }}>
              {/* Simulated busy QR */}
              <svg viewBox="0 0 21 21" width="140" style={{ display:'block', margin:'0 auto', opacity:0.4 }}>
                {Array.from({length:441}).map((_,i) => (
                  <rect key={i} x={i%21} y={Math.floor(i/21)} width="1" height="1"
                    fill={Math.random()>0.5?'#EF4444':'#0D1525'} />
                ))}
              </svg>
            </div>
            <div style={{ fontFamily:'var(--f-mono)', fontSize:11, color:'var(--err)', letterSpacing:'0.1em' }}>
              DATA LIMIT REACHED
            </div>
          </div>
        )}

        {/* Density overlay for warning state */}
        {cap.level === 'warn' && !cap.exceeded && (
          <div style={{
            position:'absolute', inset:0, pointerEvents:'none',
            background:'linear-gradient(135deg,rgba(245,158,11,0.08) 0%,transparent 60%)',
          }} />
        )}
      </div>

      {/* Capacity indicator */}
      <div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
          <span className="label">Kapazität</span>
          <span className={`status-badge ${statusClass}`}>
            <span className="dot" />
            {statusText}
          </span>
        </div>
        <div className="cap-bar">
          <div className="cap-fill" style={{
            width: `${pctDisplay}%`,
            background: cap.exceeded ? 'var(--err)' : cap.level === 'warn' ? 'var(--warn)' : 'var(--ok)',
          }} />
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
          <span style={{ fontFamily:'var(--f-mono)', fontSize:9, color:'var(--tx-muted)' }}>
            {formatSize(dataSize)} verbraucht
          </span>
          <span style={{ fontFamily:'var(--f-mono)', fontSize:9, color:'var(--tx-muted)' }}>
            {pctDisplay}% / max 2,33 KB (Level M)
          </span>
        </div>
      </div>

      {/* Explanation */}
      <div style={{
        padding:'10px 12px', borderRadius:8,
        background:'var(--bg-surface)', border:'1px solid var(--bd-subtle)',
        fontSize:12, lineHeight:1.6, color:'var(--tx-secondary)',
      }}>
        {cap.exceeded
          ? <>Zu viele Daten für eine Fläche. Der QR-Code bricht zusammen. Skaliert nicht.</>
          : cap.level === 'warn'
          ? <>Hohe Datendichte — Scan-Zuverlässigkeit sinkt. Nahe am Limit.</>
          : <>Kleine Datenmengen funktionieren gut. Füge mehr Daten hinzu, um die Grenzen zu testen.</>
        }
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        {[
          { label:'Datengröße', value: formatSize(dataSize) },
          { label:'Timeline', value: formatTimeline(timelineDays) },
        ].map(({ label, value }) => (
          <div key={label} style={{
            padding:'8px 10px', borderRadius:8,
            background:'var(--bg-surface)', border:'1px solid var(--bd-subtle)',
          }}>
            <div className="label" style={{ marginBottom:3 }}>{label}</div>
            <div style={{ fontFamily:'var(--f-mono)', fontSize:14, fontWeight:600 }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Capacity legend */}
      <div style={{
        padding:'10px 12px', borderRadius:8,
        background:'var(--bg-surface)', border:'1px solid var(--bd-subtle)',
      }}>
        <div className="label" style={{ marginBottom:7 }}>Kapazität nach Fehlerkorrektur (Version 40)</div>
        {[
          { level:'L', bytes: QR_CAPACITY_BY_LEVEL.L, note:'Max. Kapazität' },
          { level:'M', bytes: QR_CAPACITY_BY_LEVEL.M, note:'Standard ← Demo' },
          { level:'Q', bytes: QR_CAPACITY_BY_LEVEL.Q, note:'Robuster' },
          { level:'H', bytes: QR_CAPACITY_BY_LEVEL.H, note:'+ Logo-Einsatz' },
        ].map(({ level, bytes, note }) => {
          const isDemo = level === 'M';
          const barPct = bytes / QR_CAPACITY_BY_LEVEL.L * 100;
          return (
            <div key={level} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5 }}>
              <div style={{
                fontFamily:'var(--f-mono)', fontSize:10, fontWeight:700, width:14,
                color: isDemo ? 'var(--blue)' : 'var(--tx-muted)',
              }}>{level}</div>
              <div style={{ flex:1, height:3, borderRadius:2, background:'var(--bd-default)', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${barPct}%`, borderRadius:2,
                  background: isDemo ? 'var(--blue)' : 'var(--bd-strong)',
                  transition:'width 0.5s var(--ease)',
                }} />
              </div>
              <div style={{ fontFamily:'var(--f-mono)', fontSize:9, color: isDemo ? 'var(--blue)' : 'var(--tx-muted)', width:60, textAlign:'right' }}>
                {(bytes/1024).toFixed(2)} KB
              </div>
              <div style={{ fontFamily:'var(--f-mono)', fontSize:9, color:'var(--tx-dim)', width:72 }}>
                {note}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
