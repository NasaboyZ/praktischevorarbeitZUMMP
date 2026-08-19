export default function Footer({ onHome }) {
  return (
    <footer className="bg-[#0D1117] px-6 py-8 text-white sm:px-10">
      <div className="mx-auto max-w-270">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6.5 w-6.5 items-center justify-center rounded-md bg-[linear-gradient(135deg,#FF5757_0%,#22C55E_50%,#3B8AFF_100%)] text-[13px] font-black text-white">
              Q
            </div>
            <span className="text-[13px] text-slate-300">Multi-Layer QR Code · Bachelorarbeit Demo</span>
          </div>
          <nav aria-label="Footer-Navigation" className="flex items-center gap-4 text-sm">
            <button
              type="button"
              onClick={onHome}
              className="cursor-pointer text-slate-200 underline-offset-4 hover:text-white hover:underline"
            >
              Zur Startseite
            </button>
            <a
              href="#impressum"
              className="text-slate-200 underline-offset-4 hover:text-white hover:underline"
            >
              Impressum
            </a>
          </nav>
        </div>

        <section id="impressum" aria-labelledby="impressum-title" className="mt-8 border-t border-white/15 pt-6">
          <h2 id="impressum-title" className="text-base font-semibold">Impressum</h2>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Verantwortlich für den Inhalt:<br />
            Josef Leite<br />
            <a className="hover:text-white hover:underline" href="mailto:josefleite.00@hotmail.com">
              josefleite.00@hotmail.com
            </a>
          </p>
        </section>

        <p className="mt-6 font-mono text-xs text-slate-500">
          Demo-Prototyp · Nur für Forschungszwecke
        </p>
      </div>
    </footer>
  );
}
