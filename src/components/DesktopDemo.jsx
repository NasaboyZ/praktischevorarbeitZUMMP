import { useState, useEffect, useCallback, useRef } from 'react';
import {
  buildDataModel, buildPayload, splitDataForLayers,
  calculateDataSize, formatSize, getTimelineDays, formatTimeline, getCapacityInfo,
  generateSessionId, QR_CAPACITY_BY_LEVEL,
} from '../lib/data';
import { generateColorQR, tryGenerateNormalQR, generateSessionQR } from '../lib/qr';
import { fetchServerInfo, connectDesktop, sendPayload } from '../lib/ws';
import XRayMode from './XRayMode';
import JsonViewer from './JsonViewer';

// ── Helpers ────────────────────────────────────────────────────────────────
const MOOD_LABELS = ['', 'Schlecht', 'Weniger gut', 'Okay', 'Gut', 'Fantastisch'];
const MOOD_ICONS  = ['', '😞', '😕', '😐', '😊', '😄'];

function MoodPicker({ value, onChange }) {
  return (
    <div style={{ display:'flex', gap:6 }}>
      {[1,2,3,4,5].map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          title={MOOD_LABELS[m]}
          style={{
            fontSize:22, background:'none', border:'none', cursor:'pointer',
            opacity: value === m ? 1 : 0.3,
            transform: value === m ? 'scale(1.25)' : 'scale(1)',
            transition:'all 0.15s ease',
          }}
        >{MOOD_ICONS[m]}</button>
      ))}
    </div>
  );
}

function ImageUpload({ images, onChange }) {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onChange((prev) => [...prev, {
          id: `img_${Date.now()}_${Math.random().toString(36).slice(2,5)}`,
          file, dataUrl: ev.target.result,
          type: file.type, size: file.size,
          name: file.name,
        }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  return (
    <div>
      <label
        style={{
          display:'flex', alignItems:'center', gap:8, cursor:'pointer',
          padding:'7px 10px', borderRadius:8,
          border:'1px dashed var(--bd-strong)', color:'var(--tx-secondary)',
          fontSize:12, fontFamily:'var(--f-mono)', transition:'all 0.15s',
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor='var(--blue)'}
        onMouseOut={(e) => e.currentTarget.style.borderColor='var(--bd-strong)'}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
        </svg>
        {images.length ? `${images.length} Foto${images.length>1?'s':''} geladen` : 'Fotos hochladen'}
        <input type="file" accept="image/*" multiple onChange={handleFiles} style={{display:'none'}} />
      </label>
      {images.length > 0 && (
        <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
          {images.map((img) => (
            <div key={img.id} style={{ position:'relative' }}>
              <img src={img.dataUrl} alt="" style={{
                width:44, height:44, objectFit:'cover', borderRadius:6,
                border:'1px solid var(--bd-strong)',
              }} />
              <button
                onClick={() => onChange((p) => p.filter((x) => x.id !== img.id))}
                style={{
                  position:'absolute', top:-5, right:-5,
                  background:'var(--err)', border:'none', color:'#fff',
                  borderRadius:'50%', width:16, height:16,
                  fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                }}
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AudioRecorder({ audio, onAudio }) {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const mrRef   = useRef(null);
  const timerRef = useRef(null);

  const start = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      const chunks = [];
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = (ev) => {
          onAudio({ blob, dataUrl: ev.target.result, type: 'audio/webm', duration: elapsed, size: blob.size });
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      mrRef.current = mr;
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch { alert('Mikrofon-Zugriff verweigert.'); }
  };

  const stop = () => {
    mrRef.current?.stop();
    clearInterval(timerRef.current);
    setRecording(false);
  };

  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      {!recording && !audio && (
        <button className="btn btn-ghost" onClick={start} style={{ fontSize:11 }}>
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3zm-1 13.93V18H9v2h6v-2h-2v-2.07A7 7 0 0019 9h-2a5 5 0 01-10 0H5a7 7 0 006 6.93z"/>
          </svg>
          Aufnehmen
        </button>
      )}
      {recording && (
        <button className="btn btn-danger" onClick={stop}>
          <span style={{ width:8,height:8, background:'var(--err)', borderRadius:2, display:'inline-block', animation:'blink 1s infinite' }} />
          {elapsed}s — Stop
        </button>
      )}
      {audio && !recording && (
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <audio controls src={audio.dataUrl} style={{ height:28, maxWidth:160 }} />
          <span style={{ fontFamily:'var(--f-mono)', fontSize:10, color:'var(--tx-muted)' }}>
            {audio.duration}s
          </span>
          <button onClick={() => onAudio(null)} className="btn btn-danger" style={{ padding:'2px 8px' }}>×</button>
        </div>
      )}
    </div>
  );
}

// ── Pipeline Component ─────────────────────────────────────────────────────
const STEPS = ['USER DATA','STRUCTURE','COMPRESS','SPLIT LAYERS','ENCODE','QR'];
function Pipeline({ step }) {
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

// ── Normal QR Panel ────────────────────────────────────────────────────────
function NormalQRPanel({ qrState, dataSize, timelineDays }) {
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

// ── Multi-Layer QR Panel ───────────────────────────────────────────────────
function MultiLayerQRPanel({ colorQR, sessionQR, sessionId, mobileUrl, wsConnected }) {
  const [showScanQR, setShowScanQR] = useState(false);

  const layers = [
    { key:'L1', label:'Session · Routing', color:'var(--r)', dimColor:'var(--r-dim)' },
    { key:'L2', label:'Strukturierte Daten', color:'var(--g)', dimColor:'var(--g-dim)' },
    { key:'L3', label:'Medien · Binär', color:'var(--b)', dimColor:'var(--b-dim)' },
  ];

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
        {layers.map(({ key, label, color, dimColor }) => (
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

// ── Main Desktop Demo ───────────────────────────────────────────────────────
export default function DesktopDemo() {
  // ─ State ─
  const [sessionId]    = useState(generateSessionId);
  const [serverInfo, setServerInfo] = useState(null);
  const [userData, setUserData] = useState({
    name: '', mood: 4, text: '', images: [], audio: null,
    date: new Date().toISOString().split('T')[0],
  });
  const [timeline,  setTimeline]  = useState(0);    // 0-100
  const [normalQR,  setNormalQR]  = useState({ dataUrl: null, error: null, size: 0 });
  const [colorQR,   setColorQR]   = useState(null);
  const [sessionQR, setSessionQR] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [pipeStep,  setPipeStep]  = useState(-1);
  const [showXRay,  setShowXRay]  = useState(false);
  const [showJson,  setShowJson]  = useState(false);
  const [activeTab, setActiveTab] = useState('quick');
  const wsRef = useRef(null);
  const genTimer = useRef(null);

  const timelineDays = getTimelineDays(timeline);
  const dataSize     = calculateDataSize(userData, timelineDays);

  // ─ Fetch server info & connect WebSocket ─
  useEffect(() => {
    fetchServerInfo().then((info) => {
      setServerInfo(info);
      const wsUrl = `ws://${info.ip}:${info.port}`;
      const ws = connectDesktop(sessionId, wsUrl, {
        onMobileConnected: () => setWsConnected(true),
        onDataRequested:   () => {
          const payload = buildPayload({ ...userData, sessionId }, timelineDays);
          sendPayload(ws, payload);
        },
      });
      wsRef.current = ws;
    });
    return () => wsRef.current?.close();
  }, []); // eslint-disable-line

  // ─ Generate session QR whenever serverInfo changes ─
  useEffect(() => {
    if (!serverInfo) return;
    const { ip, port, frontendPort } = serverInfo;
    const wsUrl    = `ws://${ip}:${port}`;
    const mobileUrl = `http://${ip}:${frontendPort}/?mobile=1&s=${sessionId}&ws=${encodeURIComponent(wsUrl)}`;
    generateSessionQR(mobileUrl).then(setSessionQR);
  }, [serverInfo, sessionId]);

  // ─ Regenerate QR codes on data change (debounced) ─
  useEffect(() => {
    clearTimeout(genTimer.current);
    genTimer.current = setTimeout(async () => {
      // Pipeline animation
      setPipeStep(0);
      const steps = [0,1,2,3,4,5];
      for (let i = 1; i <= steps.length; i++) {
        await new Promise((r) => setTimeout(r, 180));
        setPipeStep(i);
      }

      const model   = buildDataModel({ ...userData, sessionId }, timelineDays);
      const jsonStr = JSON.stringify(model);

      // Normal QR
      const nqr = await tryGenerateNormalQR(jsonStr);
      setNormalQR(nqr);

      // Multi-layer QR: 3 data splits
      const [l1text, l2text, l3text] = splitDataForLayers(model);
      const cqr = await generateColorQR(l1text, l2text, l3text);
      setColorQR(cqr);

    }, 600);
    return () => clearTimeout(genTimer.current);
  }, [userData, timeline, sessionId, timelineDays]);

  // ─ Send payload when mobile connects ─
  useEffect(() => {
    if (wsConnected && wsRef.current) {
      const payload = buildPayload({ ...userData, sessionId }, timelineDays);
      sendPayload(wsRef.current, payload);
    }
  }, [wsConnected]); // eslint-disable-line

  // ─ Reset ─
  const handleReset = () => {
    setUserData({ name:'', mood:4, text:'', images:[], audio:null,
      date: new Date().toISOString().split('T')[0] });
    setTimeline(0);
    setNormalQR({ dataUrl:null, error:null, size:0 });
    setColorQR(null);
    setWsConnected(false);
    setPipeStep(-1);
  };

  const mobileUrl = serverInfo
    ? `http://${serverInfo.ip}:${serverInfo.frontendPort}/?mobile=1&s=${sessionId}&ws=${encodeURIComponent(`ws://${serverInfo.ip}:${serverInfo.port}`)}`
    : '';

  const dataModel = buildDataModel({ ...userData, sessionId }, timelineDays);

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'var(--bg-deep)' }}>

      {/* ── Background grid ── */}
      <div className="grid-bg" style={{
        position:'fixed', inset:0, pointerEvents:'none', zIndex:0, opacity:0.4,
      }} />

      {/* ── Header ── */}
      <header style={{
        position:'relative', zIndex:10,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'14px 28px',
        borderBottom:'1px solid var(--bd-subtle)',
        background:'rgba(9,14,28,0.95)',
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
            {wsConnected ? 'SMARTPHONE' : serverInfo ? 'BEREIT' : 'VERBINDE...'}
          </span>

          {/* Actions */}
          <button
            className="btn btn-ghost"
            onClick={() => setShowXRay(true)}
            title="X-Ray: Datenschichten aufdecken"
          >
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
            X-RAY
          </button>
          <button className="btn btn-ghost" onClick={() => setShowJson(true)}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
            JSON
          </button>
          <button className="btn btn-danger" onClick={handleReset}>
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
            </svg>
            Reset
          </button>
        </div>
      </header>

      {/* ── Main 3-column layout ── */}
      <main style={{
        flex:1, display:'grid',
        gridTemplateColumns:'1fr 1.4fr 1fr',
        position:'relative', zIndex:1,
        minHeight:0,
      }}>

        {/* ── LEFT: Normal QR ── */}
        <div style={{
          borderRight:'1px solid var(--bd-subtle)',
          overflowY:'auto',
        }}>
          <NormalQRPanel
            qrState={normalQR}
            dataSize={dataSize}
            timelineDays={timelineDays}
          />
        </div>

        {/* ── CENTER: Control Center ── */}
        <div style={{ overflowY:'auto', padding:'20px 20px' }}>
          {/* Tabs */}
          <div style={{ display:'flex', gap:6, marginBottom:20 }}>
            {[
              { key:'quick', label:'Stimmung' },
              { key:'diary', label:'Tagebuch' },
              { key:'media', label:'Fotos & Audio' },
            ].map(({ key, label }) => (
              <button
                key={key}
                className={`btn ${activeTab===key ? 'btn-blue' : 'btn-ghost'}`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── Input fields ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

            {/* Name + Date (always visible) */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div>
                <div className="label" style={{ marginBottom:5 }}>Name</div>
                <input
                  type="text"
                  placeholder="z.B. Anna Muster"
                  value={userData.name}
                  onChange={(e) => setUserData((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <div className="label" style={{ marginBottom:5 }}>Datum</div>
                <input
                  type="date"
                  value={userData.date}
                  onChange={(e) => setUserData((p) => ({ ...p, date: e.target.value }))}
                />
              </div>
            </div>

            {/* Mood */}
            <div>
              <div className="label" style={{ marginBottom:6 }}>
                Stimmung — {MOOD_LABELS[userData.mood]} {MOOD_ICONS[userData.mood]}
              </div>
              <MoodPicker value={userData.mood} onChange={(m) => setUserData((p) => ({ ...p, mood: m }))} />
            </div>

            {/* Text (diary + media tabs) */}
            {(activeTab === 'diary' || activeTab === 'media') && (
              <div>
                <div className="label" style={{ marginBottom:5 }}>Tagebucheintrag</div>
                <textarea
                  placeholder="Was ist heute passiert? Wie hast du dich gefühlt?"
                  value={userData.text}
                  onChange={(e) => setUserData((p) => ({ ...p, text: e.target.value }))}
                  style={{ minHeight: activeTab === 'diary' ? 120 : 80 }}
                />
                <div style={{ fontFamily:'var(--f-mono)', fontSize:9, color:'var(--tx-muted)', marginTop:3 }}>
                  {userData.text.length} Zeichen
                </div>
              </div>
            )}

            {/* Images & Audio (media tab) */}
            {activeTab === 'media' && (
              <>
                <div>
                  <div className="label" style={{ marginBottom:5 }}>Fotos</div>
                  <ImageUpload
                    images={userData.images}
                    onChange={(fn) => setUserData((p) => ({ ...p, images: typeof fn==='function' ? fn(p.images) : fn }))}
                  />
                </div>
                <div>
                  <div className="label" style={{ marginBottom:5 }}>Sprachmemo</div>
                  <AudioRecorder audio={userData.audio} onAudio={(a) => setUserData((p) => ({ ...p, audio: a }))} />
                </div>
              </>
            )}

            {/* ── Timeline slider ── */}
            <div style={{
              padding:'14px 16px', borderRadius:10,
              background:'var(--bg-surface)', border:'1px solid var(--bd-default)',
              marginTop:4,
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                <div>
                  <div className="label">Timeline — Stress Test</div>
                  <div style={{ fontFamily:'var(--f-display)', fontSize:22, fontWeight:700, marginTop:2 }}>
                    {formatTimeline(timelineDays)}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div className="label">Datengröße</div>
                  <div style={{ fontFamily:'var(--f-mono)', fontSize:18, fontWeight:600, color: dataSize > 1273 ? 'var(--err)' : 'var(--ok)' }}>
                    {formatSize(dataSize)}
                  </div>
                </div>
              </div>
              <input
                type="range"
                min={0} max={100}
                value={timeline}
                onChange={(e) => setTimeline(Number(e.target.value))}
              />
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:5 }}>
                <span style={{ fontFamily:'var(--f-mono)', fontSize:9, color:'var(--tx-muted)' }}>1 Tag</span>
                <span style={{ fontFamily:'var(--f-mono)', fontSize:9, color:'var(--tx-muted)' }}>10 Jahre</span>
              </div>
            </div>

            {/* ── Data breakdown ── */}
            <div style={{
              padding:'10px 14px', borderRadius:10,
              background:'var(--bg-surface)', border:'1px solid var(--bd-subtle)',
            }}>
              <div className="label" style={{ marginBottom:8 }}>Datenverteilung auf Ebenen</div>
              <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
                {[
                  { label:'L1 Session + Meta', color:'var(--r)', pct: 20 },
                  { label:'L2 Text + Einträge', color:'var(--g)', pct: 40 },
                  { label:'L3 Medien + Binär', color:'var(--b)', pct: 40 },
                ].map(({ label, color, pct }) => (
                  <div key={label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <div style={{ width:8, height:8, borderRadius:2, background:color, flexShrink:0 }} />
                    <div style={{ fontFamily:'var(--f-mono)', fontSize:10, color:'var(--tx-secondary)', flex:1 }}>
                      {label}
                    </div>
                    <div style={{ fontFamily:'var(--f-mono)', fontSize:10, color }}>
                      {formatSize(Math.round(dataSize * pct / 100))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Concept note ── */}
          <div style={{
            marginTop:20, padding:'12px 16px', borderRadius:10,
            background:'rgba(59,138,255,0.06)', border:'1px solid rgba(59,138,255,0.2)',
            fontSize:12, lineHeight:1.6, color:'var(--tx-secondary)',
          }}>
            <strong style={{ color:'var(--blue)', fontFamily:'var(--f-mono)', fontSize:11 }}>WIE ES FUNKTIONIERT</strong>
            <br />
            Drei normale QR-Codes werden über die Farbkanäle kombiniert: Rot = Ebene 1, Grün = Ebene 2, Blau = Ebene 3.
            Jedes farbige Modul trägt Information aller drei Ebenen gleichzeitig.
          </div>
        </div>

        {/* ── RIGHT: Multi-Layer QR ── */}
        <div style={{
          borderLeft:'1px solid var(--bd-subtle)',
          overflowY:'auto',
        }}>
          <MultiLayerQRPanel
            colorQR={colorQR}
            sessionQR={sessionQR}
            sessionId={sessionId}
            mobileUrl={mobileUrl}
            wsConnected={wsConnected}
          />
        </div>
      </main>

      {/* ── Footer / Connection bar ── */}
      <footer style={{
        position:'relative', zIndex:10,
        padding:'10px 28px',
        borderTop:'1px solid var(--bd-subtle)',
        background:'rgba(9,14,28,0.95)',
        backdropFilter:'blur(12px)',
        display:'flex', alignItems:'center', gap:20, flexWrap:'wrap',
      }}>
        <span className="label">
          {wsConnected
            ? 'Smartphone verbunden — Daten werden übertragen'
            : serverInfo
            ? `Server: ${serverInfo.ip}:${serverInfo.port} · QR-Code anklicken zum Scannen`
            : 'WebSocket-Server wird gestartet... (npm run dev im Terminal)'}
        </span>

        <div style={{ display:'flex', gap:12, marginLeft:'auto', alignItems:'center' }}>
          <span style={{ fontFamily:'var(--f-mono)', fontSize:10, color:'var(--tx-dim)' }}>
            REAL: QR-Generierung, Session, Scan, Datenübertragung, Medienrekonstruktion
          </span>
          <span style={{ fontFamily:'var(--f-mono)', fontSize:10, color:'var(--tx-dim)' }}>
            DEMO: Timeline-Simulation, Datenschichten-Visualisierung
          </span>
        </div>
      </footer>

      {/* ── Overlays ── */}
      {showXRay && (
        <XRayMode
          colorQR={colorQR}
          normalQR={normalQR}
          dataSize={dataSize}
          sessionId={sessionId}
          onClose={() => setShowXRay(false)}
        />
      )}
      {showJson && (
        <JsonViewer data={dataModel} onClose={() => setShowJson(false)} />
      )}
    </div>
  );
}
