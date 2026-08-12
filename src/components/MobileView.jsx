import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { connectMobile } from '../lib/ws';
import { Calendar, Image as ImageIcon, Mic, Database, ChevronDown } from "lucide-react";

const MOOD_ICONS = ['', '😞', '😕', '😐', '😊', '😄'];

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
}

const LAYER_THEMES = [
  { accent: '#3b82f6', label: '01', background: '#111827', text: '#FFEB3B' },
  { accent: '#9D174D', label: '02', background: '#F9A8D4', text: '#111827' },
  { accent: '#92400E', label: '03', background: '#FEF3C7', text: '#111827' },
];

function prettifyJson(value) {
  return JSON.stringify(value, null, 2);
}

function buildLayerPayloads(model) {
  if (!model?.entries) return [];
  const { entries, ...meta } = model;
  const buckets = [[], [], []];
  entries.forEach((entry, index) => buckets[index % 3].push(entry));
  return buckets.map((bucketEntries, index) => ({
    ...LAYER_THEMES[index],
    title: `Layer ${String(index + 1).padStart(2, '0')}`,
    payload: index === 0
      ? { ...meta, entries: bucketEntries }
      : { session_id: meta.session_id, entries: bucketEntries },
    itemCount: bucketEntries.length,
  }));
}

// ── Rekonstruktions-Animation ───────────────────────────────────────────────
function Reconstructing({ onDone }) {
  const [step, setStep] = useState(0);
  const steps = ['Layer 1 entschlüsseln', 'Layer 2 entschlüsseln', 'Layer 3 entschlüsseln', 'Medien wiederherstellen', 'Fertig'];
  const bars = [
    { label: '01', background: '#111827', color: '#FFEB3B' },
    { label: '02', background: '#F9A8D4', color: '#111827' },
    { label: '03', background: '#FEF3C7', color: '#111827' },
    { label: '04', background: '#3b82f6', color: '#ffffff' },
    { label: '05', background: '#22c55e', color: '#ffffff' },
  ];

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setStep(i);
      if (i >= steps.length) { clearInterval(t); setTimeout(onDone, 500); }
    }, 700);
    return () => clearInterval(t);
  }, [onDone, steps.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-linear-to-b from-blue-50/50 to-background">
      <div className="font-mono text-[13px] text-blue-500 tracking-widest mb-8">
        REKONSTRUKTION STARTET
      </div>
      <div className="flex flex-col gap-3 w-full max-w-80">
        {steps.map((s, i) => (
          <motion.div
            key={s}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: i <= step ? 1 : 0.5, y: 0 }}
            transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
            className={`flex flex-col gap-3 p-4 rounded-2xl bg-background border transition-all duration-300 ${i <= step ? 'border-border' : 'border-transparent'}`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="font-mono text-xs tracking-wider text-foreground">
                {s}
              </div>
              <span className="font-mono text-xs font-bold text-muted-foreground">
                {bars[i].label}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-7 rounded-full flex items-center justify-center" 
                style={{ background: bars[i].background }}
              >
                <span className="text-xs font-bold" style={{ color: bars[i].color }}>{bars[i].label}</span>
              </div>
              <div className="flex-1 h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-300 ease-out"
                  style={{ 
                    width: i <= step ? '100%' : '0%', 
                    background: bars[i].background 
                  }} 
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ── Memory Card Component ──────────────────────────────────────────────────
function MemoryCard({ payload }) {
  const { model, mediaData } = payload;
  const entries = model?.entries ?? [];
  const author = model?.author || 'Anonym';
  const layers = useMemo(() => buildLayerPayloads(model), [model]);

  // Steuerungs-States für Akkordeons (immer nur 1 Element geöffnet)
  const [openEntryIndex, setOpenEntryIndex] = useState(0);
  const [isTechDetailsOpen, setIsTechDetailsOpen] = useState(false);

  const toggleEntry = (index) => {
    setOpenEntryIndex(prev => prev === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background pb-12 overflow-x-hidden">
      {/* Header */}
      <div className="px-5 py-6 bg-linear-to-br from-blue-500/10 to-green-500/5 text-center">
        <p className="font-mono text-[10px] text-green-600 dark:text-green-400 tracking-widest mb-1">
          ✓ REKONSTRUKTION ERFOLGREICH
        </p>
        <h1 className="text-2xl font-extrabold text-foreground">{author}</h1>
        <p className="font-mono text-xs text-muted-foreground mt-1">
          Mood Memory — Session {model?.session_id}
        </p>
      </div>

      <div className="max-w-md mx-auto mt-6 px-4 space-y-4">
        
        {/* Vertikale Akkordeon-Liste für Einträge */}
        {entries.length > 0 && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="px-1 mb-2 flex items-center justify-between">
              <h2 className="font-mono text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Deine Einträge
              </h2>
              <span className="text-xs text-muted-foreground">{entries.length} Tage</span>
            </div>

            <div className="space-y-3">
              {entries.map((entry, index) => {
                const isOpen = openEntryIndex === index;
                const selectedAudio = entry.audio ? mediaData?.[entry.audio.id] : null;

                return (
                  <div 
                    key={entry.date || index}
                    className="bg-card border border-border/80 rounded-2xl overflow-hidden transition-all duration-200 shadow-xs"
                  >
                    {/* Header der Karte mit Datum, umrandetem Mood-Badge & Pfeil */}
                    <button
                      type="button"
                      onClick={() => toggleEntry(index)}
                      className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="text-sm font-semibold text-foreground">
                          {formatDate(entry.date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        {entry.mood != null && (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-background border border-border text-foreground text-xs font-mono font-semibold shadow-xs">
                            <span className="text-sm">{MOOD_ICONS[entry.mood]}</span>
                            <span>{entry.mood}/5</span>
                          </div>
                        )}
                        <ChevronDown 
                          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
                        />
                      </div>
                    </button>

                    {/* Inhalt der Karte (Lazy-rendered beim Aufklappen) */}
                    {isOpen && (
                      <div className="px-4 pb-5 pt-2 space-y-4 animate-in fade-in duration-200">
                        {entry.text ? (
                          <p className="text-base leading-relaxed text-foreground italic bg-muted/20 p-3 rounded-xl border border-border/40">
                            „{entry.text}“
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">Keine Notiz vorhanden</p>
                        )}

                        {/* Bilder-Grid */}
                        {entry.images?.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                              <ImageIcon className="w-3.5 h-3.5" /> FOTOS
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              {entry.images.map((img) => {
                                const media = mediaData?.[img.id];
                                return media ? (
                                  <img
                                    key={img.id}
                                    src={media.dataUrl}
                                    alt="Foto"
                                    className="w-full aspect-square object-cover rounded-xl border border-border/60 bg-muted"
                                    loading="lazy"
                                  />
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}

                        {/* Sprachmemo */}
                        {entry.audio && selectedAudio && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                              <Mic className="w-3.5 h-3.5" /> SPRACHMEMO
                            </div>
                            <div className="p-2 rounded-xl bg-muted border flex items-center gap-3">
                              <audio controls src={selectedAudio.dataUrl} className="flex-1 h-9" />
                              <span className="text-[10px] font-mono text-muted-foreground shrink-0 pr-2">
                                {entry.audio.duration}s
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Technische Details Akkordeon */}
        <div className="pt-2 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <div className="w-full bg-card border rounded-2xl overflow-hidden shadow-xs">
            <button
              type="button"
              onClick={() => setIsTechDetailsOpen(!isTechDetailsOpen)}
              className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Technische Details & Layer</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Multiplex QR-Code Daten ansehen
                  </span>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isTechDetailsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isTechDetailsOpen && (
              <div className="p-4 space-y-4 animate-in fade-in duration-200 border-t border-border/50">
                {layers.map((layer) => (
                  <div 
                    key={layer.title} 
                    className="rounded-xl overflow-hidden border border-border"
                  >
                    <div 
                      className="flex items-center justify-between p-3.5" 
                      style={{ background: layer.background }}
                    >
                      <div>
                        <div className="font-mono text-[10px] tracking-widest" style={{ color: layer.accent }}>
                          {layer.title}
                        </div>
                        <div className="font-bold text-base" style={{ color: layer.text }}>
                          {layer.itemCount} Einträge
                        </div>
                      </div>
                      <div className="font-mono text-xs opacity-70" style={{ color: layer.text }}>
                        {layer.title === 'Layer 01' ? 'Meta + Daten' : 'Nur Daten'}
                      </div>
                    </div>
                    <div className="bg-slate-900 p-3 overflow-x-auto">
                      <pre className="text-[10px] leading-relaxed text-slate-300 font-mono">
                        {prettifyJson(layer.payload)}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Mobile View (Main Export) ──────────────────────────────────────────────
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
    <div className="w-10 h-10 rounded-full border-4 border-muted border-t-blue-500 animate-spin mx-auto mb-5" />
  );

  return (
    <div className="min-h-screen bg-background text-foreground">

      {error && (
        <div className="p-10 text-center animate-in fade-in zoom-in-95">
          <div className="text-4xl mb-4">⚠️</div>
          <div className="font-mono text-sm text-destructive leading-relaxed">{error}</div>
        </div>
      )}

      {!error && phase === 'connecting' && (
        <div className="pt-24 px-6 text-center animate-in fade-in">
          <Spinner />
          <div className="font-mono text-xs text-blue-500 tracking-widest">VERBINDE…</div>
          <div className="font-mono text-[10px] text-muted-foreground mt-2">Session {sessionId}</div>
        </div>
      )}

      {!error && phase === 'waiting' && (
        <div className="pt-24 px-6 text-center animate-in fade-in zoom-in-95">
          <div className="text-5xl mb-4">📱</div>
          <div className="font-mono text-xs text-green-500 tracking-widest">✓ VERBUNDEN</div>
          <div className="text-2xl font-bold mt-3">Session {sessionId}</div>
          <div className="text-sm text-muted-foreground mt-4 leading-relaxed">
            Warte auf Daten vom Desktop…
          </div>
        </div>
      )}

      {!error && phase === 'receiving' && (
        <div className="pt-24 px-6 text-center animate-in fade-in">
          <Spinner />
          <div className="font-mono text-xs text-blue-500 tracking-widest mb-4">
            EMPFANGE DATEN…
          </div>
          {progress.total > 0 && (
            <div className="max-w-60 mx-auto">
              <div className="font-mono text-[10px] text-muted-foreground mb-2 flex justify-between">
                <span>Lade Segmente</span>
                <span>{progress.received} / {progress.total}</span>
              </div>
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${Math.round((progress.received / progress.total) * 100)}%` }}
                />
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