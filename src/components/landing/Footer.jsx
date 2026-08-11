export default function Footer() {
  return (
    <footer className="bg-[#0D1117] px-10 py-7">
      <div className="mx-auto flex max-w-270 flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6.5 w-6.5 items-center justify-center rounded-md bg-[linear-gradient(135deg,#FF5757_0%,#22C55E_50%,#3B8AFF_100%)] text-[13px] font-black text-white">
            Q
          </div>
          <span className="text-[13px] text-(--tx-secondary)">Multi-Layer QR Code · Bachelorarbeit Demo</span>
        </div>
        <span className="font-mono text-xs text-[#2D3E55]">
          Demo-Prototyp · Nur für Forschungszwecke
        </span>
      </div>
    </footer>
  );
}
