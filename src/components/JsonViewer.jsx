import { useEffect } from 'react';

export default function JsonViewer({ data, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Show model without large media blobs
  const display = { ...data };
  if (display.entries?.length > 3) {
    display.entries = [...display.entries.slice(0, 3), { '...': `(${display.entries.length - 3} weitere Einträge)` }];
  }
  const json = JSON.stringify(display, null, 2);

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        width: '82vw', maxWidth: 700,
        maxHeight: '85vh',
        background: 'var(--bg-card)',
        border: '1px solid var(--bd-strong)',
        borderRadius: 14,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        animation: 'fadeUp 0.3s var(--ease) both',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--bd-subtle)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div className="label label-blue">Datenstruktur</div>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 18, fontWeight: 700, marginTop: 2 }}>
              JSON Payload
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose}>ESC</button>
        </div>

        <div style={{
          flex: 1, overflowY: 'auto',
          padding: '16px 20px',
        }}>
          <div style={{
            padding: '10px 14px', marginBottom: 12,
            borderRadius: 8, background: 'var(--blue-dim)',
            border: '1px solid rgba(59,138,255,0.25)',
            fontSize: 12, color: 'var(--tx-secondary)', lineHeight: 1.5,
          }}>
            Diese Struktur wird in die drei QR-Ebenen aufgeteilt. Mediendaten (Bilder, Audio) werden
            binär komprimiert und über WebSocket übertragen — nicht als Base64 im QR-Code.
          </div>

          <pre style={{
            fontFamily: 'var(--f-mono)',
            fontSize: 12,
            lineHeight: 1.7,
            color: 'var(--tx-primary)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--bd-subtle)',
            borderRadius: 8,
            padding: '14px 16px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {json.split('\n').map((line, i) => {
              let color = 'var(--tx-primary)';
              if (line.includes('"') && line.includes(':')) {
                const key = line.match(/"([^"]+)":/)?.[1];
                if (key) color = 'var(--blue)';
              }
              if (line.match(/^\s+"[^"]+",?$/) && !line.includes(':')) color = 'var(--ok)';
              if (line.match(/:\s+\d+,?$/)) color = 'var(--warn)';
              if (line.includes('true') || line.includes('false')) color = 'var(--r)';
              return (
                <span key={i} style={{ display: 'block' }}>
                  {line.includes(':') ? (
                    <>
                      <span style={{ color: 'var(--blue)' }}>{line.split(':')[0]}</span>
                      <span style={{ color: 'var(--tx-muted)' }}>:</span>
                      <span style={{ color: 'var(--tx-primary)' }}>{line.split(':').slice(1).join(':')}</span>
                    </>
                  ) : (
                    <span style={{ color }}>{line}</span>
                  )}
                </span>
              );
            })}
          </pre>
        </div>
      </div>
    </div>
  );
}
