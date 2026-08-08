import { useState, useEffect, useRef } from 'react';
import { connectMobile } from '../lib/ws';

const MOOD_ICONS = ['', '😞', '😕', '😐', '😊', '😄'];
const MOOD_LABELS = ['', 'Schlecht', 'Weniger gut', 'Okay', 'Gut', 'Fantastisch'];

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
}

// ── Reconstruction animation ───────────────────────────────────────────────
function Reconstructing({ onDone }) {
  const [step, setStep] = useState(0);
  const steps = ['Layer 1 entschlüsseln', 'Layer 2 entschlüsseln', 'Layer 3 entschlüsseln', 'Medien wiederherstellen', 'Fertig'];

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setStep(i);
      if (i >= steps.length) { clearInterval(t); setTimeout(onDone, 500); }
    }, 600);
    return () => clearInterval(t);
  }, [onDone, steps.length]);

  return (
    <div style={{ padding: '40px 24px', textAlign: 'center' }}>
      <div style={{
        fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--blue)',
        letterSpacing: '0.1em', marginBottom: 24,
      }}>
        REKONSTRUIERE DATEN…
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 280, margin: '0 auto' }}>
        {steps.map((s, i) => (
          <div key={s} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 14px', borderRadius: 8,
            background: i < step ? 'var(--ok-bg)' : i === step ? 'var(--blue-dim)' : 'var(--bg-surface)',
            border: `1px solid ${i < step ? 'rgba(34,197,94,0.25)' : i === step ? 'rgba(59,138,255,0.35)' : 'var(--bd-subtle)'}`,
            transition: 'all 0.4s var(--ease)',
          }}>
            <span style={{ fontSize: 14 }}>
              {i < step ? '✓' : i === step ? '⠿' : '○'}
            </span>
            <span style={{
              fontFamily: 'var(--f-mono)', fontSize: 11,
              color: i < step ? 'var(--ok)' : i === step ? 'var(--blue)' : 'var(--tx-dim)',
            }}>
              {s}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Memory Card ────────────────────────────────────────────────────────────
function MemoryCard({ payload }) {
  const { model, mediaData } = payload;
  const latestEntry = model?.entries?.[0];
  const author = model?.author || 'Anonym';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-deep)',
      padding: '0 0 40px',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, rgba(59,138,255,0.15) 0%, rgba(34,217,122,0.08) 100%)',
        borderBottom: '1px solid var(--bd-subtle)',
        textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--ok)', letterSpacing: '0.15em', marginBottom: 4 }}>
          ✓ REKONSTRUKTION ERFOLGREICH
        </div>
        <div style={{ fontFamily: 'var(--f-display)', fontSize: 24, fontWeight: 800, color: 'var(--tx-primary)' }}>
          {author}
        </div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--tx-muted)', marginTop: 2 }}>
          Mood Memory — Session {model?.session_id}
        </div>
      </div>

      <div style={{ padding: '20px 16px', maxWidth: 480, margin: '0 auto' }}>
        {/* Latest entry */}
        {latestEntry && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--bd-default)',
            borderRadius: 14,
            overflow: 'hidden',
            marginBottom: 16,
            animation: 'fadeUp 0.5s var(--ease) both',
          }}>
            {/* Date + mood */}
            <div style={{
              padding: '14px 16px',
              background: 'var(--bg-surface)',
              borderBottom: '1px solid var(--bd-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--tx-secondary)' }}>
                {formatDate(latestEntry.date)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 22 }}>{MOOD_ICONS[latestEntry.mood]}</span>
                <div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 14, fontWeight: 700 }}>
                    {latestEntry.mood}/5
                  </div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9, color: 'var(--tx-muted)' }}>
                    {MOOD_LABELS[latestEntry.mood]}
                  </div>
                </div>
              </div>
            </div>

            {/* Text */}
            {latestEntry.text && (
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--tx-primary)', fontStyle: 'italic' }}>
                  „{latestEntry.text}"
                </div>
              </div>
            )}

            {/* Images */}
            {latestEntry.images?.length > 0 && (
              <div style={{ padding: '0 16px 14px' }}>
                <div className="label" style={{ marginBottom: 8 }}>FOTOS</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                  {latestEntry.images.map((img) => {
                    const media = mediaData?.[img.id];
                    return media ? (
                      <img
                        key={img.id}
                        src={media.dataUrl}
                        alt="Hochgeladenes Foto"
                        style={{
                          width: '100%',
                          aspectRatio: '1',
                          objectFit: 'cover',
                          borderRadius: 8,
                          border: '1px solid var(--bd-subtle)',
                          animation: 'fadeUp 0.5s var(--ease) both',
                        }}
                      />
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Audio */}
            {latestEntry.audio && mediaData?.['audio_001'] && (
              <div style={{ padding: '0 16px 14px' }}>
                <div className="label" style={{ marginBottom: 8 }}>SPRACHMEMO</div>
                <div style={{
                  padding: '10px 14px', borderRadius: 10,
                  background: 'var(--bg-surface)', border: '1px solid var(--bd-default)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: 18 }}>🎙</span>
                  <audio controls src={mediaData['audio_001'].dataUrl} style={{ flex: 1, height: 32 }} />
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--tx-muted)', flexShrink: 0 }}>
                    {latestEntry.audio.duration}s
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timeline if multiple entries */}
        {model?.entries?.length > 1 && (
          <div style={{ animation: 'fadeUp 0.5s var(--ease) 0.2s both' }}>
            <div className="label" style={{ marginBottom: 12 }}>
              TIMELINE — {model.entries.length} EINTRÄGE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {model.entries.slice(1, 6).map((entry, i) => (
                <div key={entry.date || i} style={{
                  padding: '10px 14px', borderRadius: 10,
                  background: 'var(--bg-card)', border: '1px solid var(--bd-subtle)',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: 18 }}>{MOOD_ICONS[entry.mood]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--tx-secondary)' }}>
                      {formatDate(entry.date)}
                    </div>
                    {entry.text && (
                      <div style={{ fontSize: 12, color: 'var(--tx-muted)', marginTop: 2 }}>
                        {entry.text.slice(0, 60)}{entry.text.length > 60 ? '…' : ''}
                      </div>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, fontWeight: 600 }}>
                    {entry.mood}/5
                  </div>
                </div>
              ))}
              {model.entries.length > 6 && (
                <div style={{
                  textAlign: 'center', fontFamily: 'var(--f-mono)', fontSize: 11,
                  color: 'var(--tx-muted)', padding: '8px',
                }}>
                  + {model.entries.length - 6} weitere Einträge
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info footer */}
        <div style={{
          marginTop: 24, padding: '12px 14px', borderRadius: 10,
          background: 'var(--blue-dim)', border: '1px solid rgba(59,138,255,0.25)',
          fontSize: 11, lineHeight: 1.6, color: 'var(--tx-secondary)',
        }}>
          <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--blue)' }}>Multi-Layer QR Demo</span>
          {' '}— Diese Daten wurden über einen Farb-multiplex-QR-Code und WebSocket-Verbindung übertragen und hier rekonstruiert.
        </div>
      </div>
    </div>
  );
}

// ── Mobile View (main export) ──────────────────────────────────────────────
export default function MobileView() {
  const params    = new URLSearchParams(window.location.search);
  const sessionId = params.get('s') || '';

  const [phase,    setPhase]    = useState('connecting');
  const [progress, setProgress] = useState({ received: 0, total: 0 });
  const [payload,  setPayload]  = useState(null);
  const [error,    setError]    = useState(null);
  const connRef = useRef(null);

  useEffect(() => {
    if (!sessionId) {
      setError('Ungültige URL — scanne den QR-Code mit deiner Kamera-App');
      return;
    }

    const conn = connectMobile(sessionId, {
      onOpen:       () => setPhase('waiting'),
      onReceiving:  () => setPhase('receiving'),
      onProgress:   (p) => setProgress(p),
      onData:       (data) => { setPayload(data); setPhase('reconstructing'); },
      onError:      () => setError('Verbindung fehlgeschlagen — VITE_ABLY_KEY muss in Vercel gesetzt sein'),
    });
    connRef.current = conn;
    return () => conn.close();
  }, [sessionId]);

  const Spinner = () => (
    <div style={{
      width: 40, height: 40, borderRadius: '50%',
      border: '3px solid var(--bd-strong)', borderTopColor: 'var(--blue)',
      animation: 'spin 1s linear infinite', margin: '0 auto 20px',
    }} />
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-deep)', fontFamily: 'var(--f-body)' }}>

      {error && (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 16 }}>⚠️</div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 13, color: 'var(--err)', lineHeight: 1.6 }}>{error}</div>
        </div>
      )}

      {!error && phase === 'connecting' && (
        <div style={{ padding: '70px 24px', textAlign: 'center' }}>
          <Spinner />
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--blue)', letterSpacing: '0.1em' }}>VERBINDE…</div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--tx-muted)', marginTop: 8 }}>Session {sessionId}</div>
        </div>
      )}

      {!error && phase === 'waiting' && (
        <div style={{ padding: '70px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>📱</div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--ok)', letterSpacing: '0.12em' }}>✓ VERBUNDEN</div>
          <div style={{ fontFamily: 'var(--f-display)', fontSize: 22, fontWeight: 700, marginTop: 8 }}>Session {sessionId}</div>
          <div style={{ fontSize: 13, color: 'var(--tx-secondary)', marginTop: 12, lineHeight: 1.6 }}>
            Warte auf Daten vom Desktop…
          </div>
        </div>
      )}

      {!error && phase === 'receiving' && (
        <div style={{ padding: '70px 24px', textAlign: 'center' }}>
          <Spinner />
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--blue)', letterSpacing: '0.1em' }}>
            EMPFANGE DATEN…
          </div>
          {progress.total > 0 && (
            <div style={{ maxWidth: 240, margin: '16px auto 0' }}>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, color: 'var(--tx-muted)', marginBottom: 6 }}>
                {progress.received} / {progress.total} Segmente
              </div>
              <div style={{ height: 3, background: 'var(--bd-default)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2, background: 'var(--blue)',
                  width: `${Math.round(progress.received / progress.total * 100)}%`,
                  transition: 'width 0.3s',
                }} />
              </div>
            </div>
          )}
        </div>
      )}

      {!error && phase === 'reconstructing' && (
        <Reconstructing onDone={() => setPhase('done')} />
      )}

      {!error && phase === 'done' && payload && (
        <MemoryCard payload={payload} />
      )}
    </div>
  );
}
