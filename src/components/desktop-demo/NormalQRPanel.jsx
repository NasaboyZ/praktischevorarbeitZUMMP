import { TriangleAlert, LockKeyhole } from 'lucide-react';
import { QR_CAPACITY_BY_LEVEL, formatSize, getCapacityInfo } from '../../lib/data';

const LEVEL_COLOR = { ok: 'var(--tx-primary)', warn: 'var(--warn)', err: 'var(--err)' };

export default function NormalQRPanel({ qrState, dataSize }) {
  // Darken on either signal: the real encoder failing, or the visible data-size
  // estimate (which also counts referenced photo/audio bytes) crossing the M-level cap.
  const exceeded = qrState.error === 'CAPACITY_EXCEEDED' || dataSize > QR_CAPACITY_BY_LEVEL.M;
  const capacity = getCapacityInfo(dataSize, QR_CAPACITY_BY_LEVEL.L);

  return (
    <div className="mx-auto flex h-full w-full max-w-100 flex-col rounded-3xl bg-white px-9 py-9 shadow-[0_20px_60px_rgba(255,87,87,0.08)]">
      <div className="mb-6">
        <div className="mb-1 font-serif text-sm italic font-semibold text-(--r)">Ebene 1</div>
        <h2 className="font-serif text-3xl font-bold">Klassischer Code</h2>
        <p className="mt-2 text-sm leading-[1.6] text-(--tx-secondary)">
          Herkömmliche Schwarz-Weiß-QR-Technologie mit stark begrenzter Datendichte.
        </p>
      </div>

      <div
        className={`mb-7 flex aspect-square w-full flex-col items-center justify-center gap-3 rounded-2xl transition-colors duration-500 ${
          exceeded ? 'bg-(--tx-primary)' : 'bg-[rgba(255,87,87,0.05)]'
        }`}
      >
        {exceeded ? (
          <>
            <LockKeyhole className="size-9 text-(--r)" />
            <div className="text-center">
              <div className="font-mono text-xs font-bold tracking-widest text-white">
                KAPAZITÄT ÜBERSCHRITTEN
              </div>
              <div className="mt-1 font-mono text-[11px] text-white/50">
                Fläche reicht nicht mehr aus
              </div>
            </div>
          </>
        ) : qrState.dataUrl ? (
          <img
            src={qrState.dataUrl}
            alt="Normaler QR-Code"
            className="w-4/5 rounded-lg [image-rendering:pixelated]"
          />
        ) : (
          <span className="font-mono text-xs text-(--tx-dim)">Daten eingeben…</span>
        )}
      </div>

      <div className="flex flex-col divide-y divide-(--bd-subtle) border-y border-(--bd-subtle)">
        <div className="flex items-center justify-between py-3.5 text-sm">
          <span className="text-(--tx-secondary)">Datenkapazität</span>
          <span className="font-bold" style={{ color: LEVEL_COLOR[capacity.level] }}>
            {formatSize(dataSize)} / {formatSize(QR_CAPACITY_BY_LEVEL.L)}
          </span>
        </div>
        <div className="flex items-center justify-between py-3.5 text-sm">
          <span className="text-(--tx-secondary)">Farbkanäle</span>
          <span className="font-bold text-(--r)">Keine (1-bit Mono)</span>
        </div>
        <div className="flex items-center justify-between py-3.5 text-sm">
          <span className="text-(--tx-secondary)">Kamera-Ausrichtung</span>
          <span className="font-bold">Erforderlich</span>
        </div>
      </div>

      <div className={`mt-6 flex items-start gap-2.5 rounded-2xl p-4 text-sm leading-[1.6] transition-colors duration-500 ${
        exceeded ? 'bg-[rgba(255,87,87,0.08)] text-(--tx-secondary)' : 'bg-[rgba(109,91,208,0.07)] text-(--tx-secondary)'
      }`}>
        <TriangleAlert className={`mt-0.5 size-4 shrink-0 ${exceeded ? 'text-(--r)' : 'text-(--violet)'}`} />
        {exceeded
          ? <span><strong className="text-(--r)">Kapazität überschritten:</strong> Zu viele Daten für eine Fläche — der Code bricht zusammen.</span>
          : <span><strong className="text-(--tx-primary)">Warnung:</strong> Längerer Text führt zu unleserlich feinen Rastern.</span>}
      </div>
    </div>
  );
}
