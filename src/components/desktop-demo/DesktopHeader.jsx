import Pipeline from './Pipeline';
import { hasAblyKey } from '../../lib/ws';

export default function DesktopHeader({ sessionId, pipeStep, wsConnected, onXRay, onJson, onReset }) {
  return (
    <header style={{
      position:'relative', zIndex:10,
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'14px 28px',
      borderBottom:'1px solid var(--bd-subtle)',
      background:'rgba(255,255,255,0.95)',
      backdropFilter:'blur(12px)',
      gap:16,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{
            width:28, height:28, borderRadius:6,
            background:'linear-gradient(135deg, var(--r) 0%, var(--g) 50%, var(--b) 100%)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:14, fontWeight:900,
          }}>Q</div>
          <div>
            <div style={{ fontFamily:'var(--f-display)', fontSize:14, fontWeight:800, letterSpacing:'0.08em' }}>
              MULTI-LAYER QR
            </div>
            <div className="label">Bachelorarbeit Demo</div>
          </div>
        </div>

        {/* Pipeline */}
        <div className="desktop-only" style={{ paddingLeft:20, borderLeft:'1px solid var(--bd-subtle)' }}>
          <Pipeline step={pipeStep} />
        </div>
      </div>

      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {/* Session ID */}
        <div style={{ textAlign:'right' }}>
          <div className="label">Session</div>
          <div style={{ fontFamily:'var(--f-mono)', fontSize:18, fontWeight:700, color:'var(--blue)', letterSpacing:'0.15em' }}>
            {sessionId}
          </div>
        </div>

        {/* Connection status */}
        <span className={`status-badge ${wsConnected ? 's-ok' : 's-blue'}`}>
          <span className="dot" />
          {wsConnected ? 'SMARTPHONE' : hasAblyKey() ? 'BEREIT' : 'KEIN API KEY'}
        </span>

        {/* Actions */}
        <button className="btn btn-ghost" onClick={onXRay} title="X-Ray: Datenschichten aufdecken">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
          X-RAY
        </button>
        <button className="btn btn-ghost" onClick={onJson}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
          JSON
        </button>
        <button className="btn btn-danger" onClick={onReset}>
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
          </svg>
          Reset
        </button>
      </div>
    </header>
  );
}
