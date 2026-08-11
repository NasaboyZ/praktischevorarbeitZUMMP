import { useState } from 'react';

const LAYERS = [
  { key:'L1', label:'Session · Routing', color:'var(--r)', dimColor:'var(--r-dim)' },
  { key:'L2', label:'Strukturierte Daten', color:'var(--g)', dimColor:'var(--g-dim)' },
  { key:'L3', label:'Medien · Binär', color:'var(--b)', dimColor:'var(--b-dim)' },
];

export default function MultiLayerQRPanel({ colorQR, sessionQR, sessionId, wsConnected }) {
  const [showScanQR, setShowScanQR] = useState(false);

  return (
    <div style={{
      display:'flex', flexDirection:'column', gap:16, height:'100%',
      padding:'20px 16px',
      position:'relative',
    }}>
      {/* Blue glow accent */}
      <div style={{
        position:'absolute', top:-40, right:-40, width:200, height:200,
        borderRadius:'50%', background:'radial-gradient(circle, rgba(59,138,255,0.1) 0%, transparent 70%)',
        pointerEvents:'none',
      }} />

      {/* Header */}
      <div>
        <div className="label label-blue" style={{ marginBottom:4 }}>Multi-Layer Ansatz</div>
        <div style={{ fontFamily:'var(--f-display)', fontSize:20, fontWeight:700, color:'var(--blue)' }}>
          MULTI-LAYER QR
        </div>
        <div style={{ fontFamily:'var(--f-mono)', fontSize:10, color:'var(--tx-muted)', marginTop:2 }}>
          Farb-Multiplexing · 3 Ebenen
        </div>
      </div>

      {/* Color QR Display */}
      <div style={{
        position:'relative', borderRadius:12, overflow:'hidden',
        border:'2px solid rgba(59,138,255,0.35)',
        background:'var(--bg-surface)',
        boxShadow:'0 0 30px rgba(59,138,255,0.12)',
        minHeight:200, display:'flex', alignItems:'center', justifyContent:'center',
        cursor:'pointer',
      }}
        onClick={() => setShowScanQR(!showScanQR)}
        title="Klick für Scan-QR"
      >
        {colorQR?.colorDataUrl && !showScanQR && (
          <img
            src={colorQR.colorDataUrl}
            alt="Multi-Layer QR Code"
            style={{ width:'100%', maxWidth:240, display:'block', imageRendering:'pixelated' }}
          />
        )}
        {showScanQR && sessionQR && (
          <div style={{ textAlign:'center', padding:12 }}>
            <div className="label" style={{ marginBottom:8 }}>SCAN-QR (Standard-Kamera)</div>
            <img
              src={sessionQR}
              alt="Session QR"
              style={{ width:200, height:200, imageRendering:'pixelated' }}
            />
          </div>
        )}
        {!colorQR?.colorDataUrl && !showScanQR && (
          <div style={{ color:'var(--tx-dim)', fontFamily:'var(--f-mono)', fontSize:11 }}>
            Daten eingeben…
          </div>
        )}

        {/* Toggle hint */}
        <div style={{
          position:'absolute', bottom:6, right:8,
          fontFamily:'var(--f-mono)', fontSize:9, color:'var(--tx-muted)',
        }}>
          {showScanQR ? '← Farb-QR' : 'Zum Scannen →'}
        </div>
      </div>

      {/* Layer indicators */}
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        {LAYERS.map(({ key, label, color, dimColor }) => (
          <div key={key} style={{
            display:'flex', alignItems:'center', gap:10,
            padding:'6px 10px', borderRadius:8,
            background: dimColor, border:`1px solid ${color}33`,
          }}>
            <div style={{
              width:8, height:8, borderRadius:2, background:color, flexShrink:0,
            }} />
            <div style={{ fontFamily:'var(--f-mono)', fontSize:10, color }}>
              {key}
            </div>
            <div style={{ fontFamily:'var(--f-mono)', fontSize:10, color:'var(--tx-secondary)', flex:1 }}>
              {label}
            </div>
            <div style={{
              fontFamily:'var(--f-mono)', fontSize:9, color,
              background:'none', border:'none',
            }}>AKTIV</div>
          </div>
        ))}
      </div>

      {/* Connection status */}
      <div style={{
        padding:'10px 12px', borderRadius:10,
        border: wsConnected ? '1px solid rgba(34,197,94,0.35)' : '1px solid var(--bd-default)',
        background: wsConnected ? 'var(--ok-bg)' : 'var(--bg-surface)',
        transition:'all 0.4s',
      }}>
        {wsConnected ? (
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span className="dot" style={{ background:'var(--ok)' }} />
            <span style={{ fontFamily:'var(--f-mono)', fontSize:11, color:'var(--ok)' }}>
              SMARTPHONE VERBUNDEN
            </span>
          </div>
        ) : (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontFamily:'var(--f-mono)', fontSize:10, color:'var(--tx-muted)' }}>
                SESSION
              </div>
              <div style={{ fontFamily:'var(--f-mono)', fontSize:16, fontWeight:700, color:'var(--blue)', letterSpacing:'0.15em' }}>
                {sessionId}
              </div>
            </div>
            <div style={{ fontFamily:'var(--f-mono)', fontSize:10, color:'var(--tx-muted)', textAlign:'right' }}>
              Klicke auf den QR-Code<br/>zum Anzeigen des Scan-QR
            </div>
          </div>
        )}
      </div>

      {/* Status */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        <div style={{ padding:'8px 10px', borderRadius:8, background:'var(--bg-surface)', border:'1px solid var(--bd-subtle)' }}>
          <div className="label" style={{ marginBottom:3 }}>Status</div>
          <span className="status-badge s-ok"><span className="dot" />STABIL</span>
        </div>
        <div style={{ padding:'8px 10px', borderRadius:8, background:'var(--bg-surface)', border:'1px solid var(--bd-subtle)' }}>
          <div className="label" style={{ marginBottom:3 }}>Kapazität</div>
          <div style={{ fontFamily:'var(--f-mono)', fontSize:12, color:'var(--ok)' }}>3× MEHR</div>
        </div>
      </div>

      {/* Demo note */}
      <div style={{
        fontSize:11, lineHeight:1.5, color:'var(--tx-muted)',
        borderTop:'1px solid var(--bd-subtle)', paddingTop:10,
      }}>
        <span style={{ fontFamily:'var(--f-mono)', color:'var(--blue)', marginRight:4 }}>DEMO</span>
        Der Farb-QR zeigt das Multiplexing-Prinzip. Zum echten Scannen → klicke auf den QR-Code.
      </div>
    </div>
  );
}
