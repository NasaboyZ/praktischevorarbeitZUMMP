export default function Badge({ children, className = '' }) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border border-[rgba(59,138,255,0.22)] bg-(--blue-dim) px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-(--blue) ${className}`}
    >
      {children}
    </div>
  );
}
