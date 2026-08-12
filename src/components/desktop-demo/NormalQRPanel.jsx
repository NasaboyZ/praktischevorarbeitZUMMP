import { TriangleAlert } from 'lucide-react';
import { getCapacityInfo, QR_CAPACITY_BY_LEVEL } from '../../lib/data';

export default function NormalQRPanel({ qrState, dataSize }) {
  const cap = getCapacityInfo(dataSize);

  return (
    <div className="mx-auto flex h-full w-full max-w-100 flex-col rounded-3xl bg-white px-9 py-9 shadow-[0_20px_60px_rgba(255,87,87,0.08)]">
      <div className="mb-6">
        <div className="mb-1 font-serif text-sm italic font-semibold text-(--r)">Ebene 1</div>
        <h2 className="font-serif text-3xl font-bold">Klassischer Code</h2>
        <p className="mt-2 text-sm leading-[1.6] text-(--tx-secondary)">
          Herkömmliche Schwarz-Weiß-QR-Technologie mit stark begrenzter Datendichte.
        </p>
      </div>

      <div className="mb-7 flex aspect-square w-full items-center justify-center rounded-2xl bg-[rgba(255,87,87,0.05)]">
        {qrState.dataUrl ? (
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
          <span className="font-bold">Max. {QR_CAPACITY_BY_LEVEL.L.toLocaleString('de-DE')} Bytes</span>
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

      <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-[rgba(109,91,208,0.07)] p-4 text-sm leading-[1.6] text-(--tx-secondary)">
        <TriangleAlert className="mt-0.5 size-4 shrink-0 text-(--violet)" />
        {cap.exceeded
          ? <span><strong className="text-(--err)">Kapazität überschritten:</strong> Zu viele Daten für eine Fläche — der Code bricht zusammen.</span>
          : <span><strong className="text-(--tx-primary)">Warnung:</strong> Längerer Text führt zu unleserlich feinen Rastern.</span>}
      </div>
    </div>
  );
}
