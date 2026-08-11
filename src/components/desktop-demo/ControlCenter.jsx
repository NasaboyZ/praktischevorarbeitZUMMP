import { formatSize, formatTimeline } from '../../lib/data';
import MoodPicker, { MOOD_LABELS, MOOD_ICONS } from './MoodPicker';
import ImageUpload from './ImageUpload';
import AudioRecorder from './AudioRecorder';

const TABS = [
  { key:'quick', label:'Stimmung' },
  { key:'diary', label:'Tagebuch' },
  { key:'media', label:'Fotos & Audio' },
];

const LAYER_BREAKDOWN = [
  { label:'L1 Session + Meta', color:'var(--r)', pct: 20 },
  { label:'L2 Text + Einträge', color:'var(--g)', pct: 40 },
  { label:'L3 Medien + Binär', color:'var(--b)', pct: 40 },
];

export default function ControlCenter({
  userData, setUserData,
  activeTab, setActiveTab,
  timeline, setTimeline,
  dataSize, timelineDays,
}) {
  return (
    <div style={{ overflowY:'auto', padding:'20px 20px' }}>
      {/* Tabs */}
      <div style={{ display:'flex', gap:6, marginBottom:20 }}>
        {TABS.map(({ key, label }) => (
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
              <div style={{ fontFamily:'var(--f-mono)', fontSize:18, fontWeight:600, color: dataSize > 2331 ? 'var(--err)' : 'var(--ok)' }}>
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
            {LAYER_BREAKDOWN.map(({ label, color, pct }) => (
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
  );
}
