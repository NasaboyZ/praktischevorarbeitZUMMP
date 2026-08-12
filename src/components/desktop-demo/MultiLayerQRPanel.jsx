import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { formatSize, QR_CAPACITY_BY_LEVEL, getCapacityInfo } from '../../lib/data';

const LEVEL_COLOR = { ok: 'var(--violet)', warn: 'var(--warn)', err: 'var(--err)' };
const MLQR_CAPACITY = QR_CAPACITY_BY_LEVEL.L * 3;

export default function MultiLayerQRPanel({ colorQR, sessionQR, sessionId, wsConnected, dataSize = 0 }) {
  const [showScanQR, setShowScanQR] = useState(false);
  const capacity = getCapacityInfo(dataSize, MLQR_CAPACITY);

  return (
    <div className="mx-auto flex h-full w-full max-w-100 flex-col rounded-3xl bg-white px-9 py-9 shadow-[0_20px_60px_rgba(109,91,208,0.10)]">
      <div className="mb-6">
        <h2 className="font-serif text-3xl font-bold">Multi-Layer Qr-Code</h2>
        <p className="mt-2 text-sm leading-[1.6] text-(--tx-secondary)">
          Gleichzeitige RGB-Übertragung für dreifache Datenkapazität auf gleicher Fläche.
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowScanQR((v) => !v)}
        title="Klick für Scan-QR"
        className="relative mb-7 flex aspect-square w-full cursor-pointer items-center justify-center rounded-2xl bg-[rgba(109,91,208,0.06)]"
      >
        {colorQR?.colorDataUrl && !showScanQR && (
          <img
            src={colorQR.colorDataUrl}
            alt="Multi-Layer QR-Code"
            className="w-4/5 rounded-lg [image-rendering:pixelated]"
          />
        )}
        {showScanQR && sessionQR && (
          <div className="text-center">
            <div className="mb-2 font-mono text-[10px] text-(--tx-muted)">SCAN-QR (Standard-Kamera)</div>
            <img src={sessionQR} alt="Session QR" className="mx-auto size-45 [image-rendering:pixelated]" />
          </div>
        )}
        {!colorQR?.colorDataUrl && !showScanQR && (
          <span className="font-mono text-xs text-(--tx-dim)">Daten eingeben…</span>
        )}
        <span className="absolute bottom-3 right-3.5 font-mono text-[10px] text-(--tx-muted)">
          {showScanQR ? '← Farb-QR' : 'Zum Scannen →'}
        </span>
        {wsConnected && (
          <span className="absolute left-3.5 top-3.5 flex items-center gap-1.5 rounded-full bg-(--ok-bg) px-2.5 py-1 font-mono text-[10px] text-(--ok)">
            <span className="dot" style={{ background: 'var(--ok)' }} /> VERBUNDEN
          </span>
        )}
      </button>

      <div className="flex flex-col divide-y divide-(--bd-subtle) border-y border-(--bd-subtle)">
        <div className="flex items-center justify-between py-3.5 text-sm">
          <span className="text-(--tx-secondary)">Datenkapazität</span>
          <span className="font-bold" style={{ color: LEVEL_COLOR[capacity.level] }}>
            {formatSize(dataSize)} / {formatSize(MLQR_CAPACITY)}
          </span>
        </div>
        <div className="flex items-center justify-between py-3.5 text-sm">
          <span className="text-(--tx-secondary)">Ebenenaufteilung</span>
          <span className="font-bold">Rot (1) | Grün (2) | Blau (3)</span>
        </div>
        <div className="flex items-center justify-between py-3.5 text-sm">
          <span className="text-(--tx-secondary)">Verarbeitungsart</span>
          <span className="font-bold text-(--r)">100% Clientseitig (Canvas)</span>
        </div>
        {!wsConnected && (
          <div className="flex items-center justify-between py-3.5 text-sm">
            <span className="text-(--tx-secondary)">Session</span>
            <span className="font-mono font-bold tracking-[0.15em] text-(--violet)">{sessionId}</span>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-[rgba(109,91,208,0.07)] p-4 text-sm leading-[1.6] text-(--tx-secondary)">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-(--violet)" />
        <span>
          <strong className="text-(--tx-primary)">Vorteil: Dreifacher Informationsgehalt</strong><br />
          Durch das De-Multiplexing im Client wird der Code vollautomatisch in die emotionalen
          Rohwerte zerlegt.
        </span>
      </div>
    </div>
  );
}
