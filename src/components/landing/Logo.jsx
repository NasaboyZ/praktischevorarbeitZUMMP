export default function Logo({ size = 30, showCaption = true, dark = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex shrink-0 items-center justify-center rounded-[7px] font-black text-white"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.5,
          background: 'linear-gradient(135deg, var(--r) 0%, var(--g) 50%, var(--b) 100%)',
        }}
      >
        Q
      </div>
      <div>
        <div className={`text-[13px] font-extrabold tracking-[0.06em] ${dark ? 'text-white' : 'text-(--tx-primary)'}`}>
          MULTI-LAYER QR
        </div>
        {showCaption && (
          <div className={`font-mono text-[9px] uppercase tracking-[0.12em] ${dark ? 'text-white/40' : 'text-(--tx-muted)'}`}>
            Bachelorarbeit · Demo
          </div>
        )}
      </div>
    </div>
  );
}
