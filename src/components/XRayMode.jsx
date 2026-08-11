import { useState, useEffect } from 'react';
import { formatSize } from '../lib/data';

const LAYERS = [
  { idx: 0, key: 'L1', label: 'SESSION + ROUTING', desc: 'Session-ID, Basis-Metadaten, Verbindungsinfo', color: 'var(--r)', dim: 'var(--r-dim)', border: 'rgba(255,69,69,0.35)' },
  { idx: 1, key: 'L2', label: 'STRUKTURIERTE DATEN', desc: 'JSON-Einträge, Text, Stimmungsdaten', color: 'var(--g)', dim: 'var(--g-dim)', border: 'rgba(34,217,122,0.35)' },
  { idx: 2, key: 'L3', label: 'MEDIEN + BINÄR', desc: 'Bilder, Audio, Binäre Payloads', color: 'var(--b)', dim: 'var(--b-dim)', border: 'rgba(59,138,255,0.35)' },
];

export default function XRayMode({ colorQR, normalQR, dataSize, sessionId, onClose }) {
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setExploded(true), 200);
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => { clearTimeout(t); window.removeEventListener('keydown', handleKey); };
  }, [onClose]);

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: '92vw', maxWidth: 1100,
        maxHeight: '90vh',
        background: 'var(--bg-card)',
        border: '1px solid var(--bd-strong)',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeUp 0.35s var(--ease) both',
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--bd-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg-surface)',
        }}>
          <div>
            <div className="label label-blue">X-Ray Modus</div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 800, marginTop: 2 }}>
              DATENSCHICHTEN AUFDECKEN
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Schließen (ESC)
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

            {/* LEFT: Normal QR */}
            <div>
              <div style={{
                padding: '16px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--bd-default)',
                borderRadius: 12,
                textAlign: 'center',
              }}>
                <div className="label" style={{ marginBottom: 10 }}>NORMALER QR-CODE</div>
                <div style={{
                  display: 'inline-block',
                  padding: 8, borderRadius: 8,
                  border: '1px solid var(--bd-default)',
                  background: 'var(--bg-card)',
                }}>
                  {normalQR?.dataUrl
                    ? <img src={normalQR.dataUrl} alt="Normal QR" style={{ width: 160, display:'block', imageRendering:'pixelated' }} />
                    : <div style={{ width: 160, height: 160, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--tx-dim)', fontFamily:'var(--f-mono)', fontSize:10 }}>Kein QR</div>
                  }
                </div>
                <div style={{ marginTop: 14, padding: '12px', background: 'var(--bg-card)', borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--tx-secondary)', lineHeight: 1.6 }}>
                    Alle Daten auf <strong style={{ color: 'var(--tx-primary)' }}>einer einzigen Oberfläche</strong>.<br />
                    Mit steigender Datenmenge wird die Moduldichte zu hoch, bis der Code unlesbar wird.
                  </div>
                  <div style={{ marginTop: 10, fontFamily: 'var(--f-mono)', fontSize: 11 }}>
                    <span style={{ color: dataSize > 1273 ? 'var(--err)' : 'var(--warn)' }}>
                      {formatSize(dataSize)}
                    </span>
                    <span style={{ color: 'var(--tx-muted)' }}> / max. ~1.3 KB</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Multi-Layer explosion */}
            <div>
              <div style={{
                padding: '16px',
                background: 'rgba(59,138,255,0.04)',
                border: '1px solid rgba(59,138,255,0.2)',
                borderRadius: 12,
              }}>
                <div className="label label-blue" style={{ marginBottom: 10, textAlign: 'center' }}>
                  MULTI-LAYER QR — EXPLOSIONSANSICHT
                </div>

                {/* Exploded layers */}
                <div style={{
                  position: 'relative',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: exploded ? 28 : 0,
                  transition: 'gap 0.7s var(--ease)',
                  paddingBottom: 12,
                }}>
                  {LAYERS.map(({ idx, key, label, desc, color, dim, border }) => (
                    <div key={key} style={{
                      transition: 'transform 0.6s var(--ease), opacity 0.5s',
                      transform: exploded ? 'none' : `translateY(${idx * 20}px)`,
                      opacity: exploded ? 1 : (idx === 0 ? 1 : 0),
                      transitionDelay: `${idx * 0.1}s`,
                      width: '100%',
                    }}>
                      <div style={{
                        padding: '10px 14px',
                        background: dim,
                        border: `1px solid ${border}`,
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center', gap: 12,
                      }}>
                        {/* Mini QR layer */}
                        {colorQR?.layerDataUrls?.[idx] ? (
                          <img
                            src={colorQR.layerDataUrls[idx]}
                            alt={`Layer ${idx + 1}`}
                            style={{
                              width: 60, height: 60,
                              imageRendering: 'pixelated',
                              borderRadius: 6, flexShrink: 0,
                              border: `1px solid ${border}`,
                            }}
                          />
                        ) : (
                          <div style={{
                            width: 60, height: 60, borderRadius: 6,
                            background: dim, border: `1px solid ${border}`,
                            flexShrink: 0,
                          }} />
                        )}

                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color, fontWeight: 700, letterSpacing: '0.06em' }}>
                            {key} — {label}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--tx-secondary)', marginTop: 3 }}>
                            {desc}
                          </div>
                        </div>

                        <div style={{
                          fontFamily: 'var(--f-mono)', fontSize: 9,
                          color, background: `${color}15`,
                          border: `1px solid ${color}30`,
                          padding: '3px 8px', borderRadius: 4,
                        }}>
                          AKTIV
                        </div>
                      </div>

                      {idx < 2 && (
                        <div style={{
                          textAlign: 'center', padding: '4px 0',
                          fontFamily: 'var(--f-mono)', fontSize: 11,
                          color: 'var(--tx-dim)',
                          opacity: exploded ? 1 : 0,
                          transition: 'opacity 0.4s',
                          transitionDelay: `${idx * 0.1 + 0.3}s`,
                        }}>+</div>
                      )}
                    </div>
                  ))}

                  {/* Combined result */}
                  {exploded && (
                    <div style={{
                      width: '100%', animation: 'fadeUp 0.5s var(--ease) 0.5s both',
                      borderTop: '1px dashed var(--bd-strong)', paddingTop: 16,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        {colorQR?.colorDataUrl && (
                          <img
                            src={colorQR.colorDataUrl}
                            alt="Combined Color QR"
                            style={{ width: 80, height: 80, imageRendering: 'pixelated', borderRadius: 8, border: '1px solid rgba(59,138,255,0.4)' }}
                          />
                        )}
                        <div>
                          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--blue)', fontWeight: 700 }}>
                            = KOMBINIERTER FARB-QR
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--tx-secondary)', marginTop: 4 }}>
                            Farb-Multiplexing kombiniert alle drei Ebenen.<br />
                            Jedes farbige Modul trägt 3× Information.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom explanation */}
          <div style={{
            marginTop: 20,
            padding: '14px 20px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--bd-subtle)',
            borderRadius: 10,
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20,
          }}>
            {[
              { title: 'Farb-Multiplexing', text: 'Drei BW-QR-Codes werden über Rot-, Grün- und Blaukanal kombiniert. Jedes Pixel codiert drei Informationsbits gleichzeitig.' },
              { title: 'Farb-De-Multiplexing', text: 'Durch Trennung der Farbkanäle lassen sich die drei ursprünglichen QR-Codes rekonstruieren. Die Daten bleiben trennbar.' },
              { title: 'Session-Verbindung', text: `Session ${sessionId} verknüpft Desktop und Smartphone. Der QR-Code identifiziert die Session — alle Daten fließen über WebSocket.` },
            ].map(({ title, text }) => (
              <div key={title}>
                <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--blue)', letterSpacing: '0.1em', marginBottom: 6 }}>
                  {title.toUpperCase()}
                </div>
                <div style={{ fontSize: 12, color: 'var(--tx-secondary)', lineHeight: 1.6 }}>{text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
