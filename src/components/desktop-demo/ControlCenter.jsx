import { useState } from 'react';
import { de } from 'date-fns/locale';
import { ArrowRight, ArrowLeft, Plus, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  formatSize, isoToLocalDate, localDateToIso, addDaysIso,
  createEmptyEntry, getLayerSizes, mergeDraftIntoEntries,
} from '../../lib/data';
import ImageUpload from './ImageUpload';
import AudioRecorder from './AudioRecorder';

const MOOD_OPTIONS = [
  { key: 'entspannt',   label: 'Entspannt',   icon: '😎' },
  { key: 'aufgeregt',   label: 'Aufgeregt',   icon: '🙂' },
  { key: 'dankbar',     label: 'Dankbar',     icon: '☺️' },
  { key: 'zufrieden',   label: 'Zufrieden',   icon: '🙂' },
  { key: 'wuetend',     label: 'Wütend',      icon: '😣' },
  { key: 'gestresst',   label: 'Gestresst',   icon: '😅' },
  { key: 'traurig',     label: 'Traurig',     icon: '☹️' },
  { key: 'verzweifelt', label: 'Verzweifelt', icon: '😟' },
  { key: 'genervt',     label: 'Genervt',     icon: '😒' },
];
const LOCATION_OPTIONS = [
  { key: 'zuhause', label: 'Zuhause', icon: '🏠' },
  { key: 'familie', label: 'Familie', icon: '👨‍👩‍👧' },
  { key: 'freunde', label: 'Freunde', icon: '🎉' },
  { key: 'party',   label: 'Party',   icon: '🎊' },
  { key: 'arbeit',  label: 'Arbeit',  icon: '💼' },
];

const LAYER_META = [
  { label: 'Ebene 1 · Rot (+ Meta)', color: 'var(--r)' },
  { label: 'Ebene 2 · Grün',         color: 'var(--g)' },
  { label: 'Ebene 3 · Blau',         color: 'var(--b)' },
];

function TagPicker({ options, value, onChange, onAddCustom, addPlaceholder = 'Eigener Begriff…' }) {
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState('');

  const toggle = (key) => {
    onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
  };

  const submitCustom = () => {
    const trimmed = text.trim();
    if (trimmed) onAddCustom(trimmed);
    setText('');
    setAdding(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map(({ key, label, icon }) => (
        <Button
          key={key}
          type="button"
          variant="pill"
          aria-pressed={value.includes(key)}
          onClick={() => toggle(key)}
          className="h-auto gap-1.5 px-4 py-2 text-sm font-medium"
        >
          <span>{icon}</span>
          {label}
        </Button>
      ))}
      {adding ? (
        <input
          type="text"
          autoFocus
          value={text}
          placeholder={addPlaceholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); submitCustom(); }
            if (e.key === 'Escape') { setText(''); setAdding(false); }
          }}
          onBlur={submitCustom}
          style={{ width: 160 }}
          className="py-2! text-sm!"
        />
      ) : (
        <Button
          type="button"
          variant="pill"
          onClick={() => setAdding(true)}
          className="h-auto gap-1.5 border-dashed px-4 py-2 text-sm font-medium text-(--tx-muted)"
        >
          + Hinzufügen
        </Button>
      )}
    </div>
  );
}

function formatDateLabel(iso) {
  return isoToLocalDate(iso).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function latestDate(entries, fallback) {
  return entries.length ? entries.reduce((max, e) => (e.date > max ? e.date : max), entries[0].date) : fallback;
}

export default function ControlCenter({ entries, setEntries, draft, setDraft, name, setName, dataSize, onGenerate }) {
  const [step, setStep] = useState(1);
  const [justGenerated, setJustGenerated] = useState(false);
  const [customMoods, setCustomMoods] = useState([]);
  const [customLocations, setCustomLocations] = useState([]);

  const moodOptions = [...MOOD_OPTIONS, ...customMoods];
  const locationOptions = [...LOCATION_OPTIONS, ...customLocations];
  const moodIconByKey = Object.fromEntries(moodOptions.map((m) => [m.key, m.icon]));

  const addCustomMood = (text) => {
    setCustomMoods((prev) => (prev.some((m) => m.key === text) ? prev : [...prev, { key: text, label: text, icon: '✨' }]));
    setDraft((p) => (p.moods.includes(text) ? p : { ...p, moods: [...p.moods, text] }));
  };

  const addCustomLocation = (text) => {
    setCustomLocations((prev) => (prev.some((l) => l.key === text) ? prev : [...prev, { key: text, label: text, icon: '📍' }]));
    setDraft((p) => (p.location.includes(text) ? p : { ...p, location: [...p.location, text] }));
  };

  const handleDateSelect = (d) => {
    if (!d) return;
    const iso = localDateToIso(d);
    const existing = entries.find((e) => e.date === iso);
    setDraft(existing ? { ...existing } : createEmptyEntry(iso));
  };

  const commitDraft = () => {
    setEntries((prev) => mergeDraftIntoEntries(prev, draft));
  };

  const handleAddAnotherDay = () => {
    commitDraft();
    setDraft(createEmptyEntry(addDaysIso(draft.date, 1)));
    setStep(1);
  };

  const handleFinish = () => {
    commitDraft();
    setStep(3);
  };

  const goEditMore = () => {
    setDraft(createEmptyEntry(addDaysIso(latestDate(entries, draft.date), 1)));
    setStep(1);
  };

  const handleGenerateClick = () => {
    setJustGenerated(true);
    onGenerate?.();
    setTimeout(() => setJustGenerated(false), 2000);
  };

  const layerSizes = getLayerSizes(entries);

  return (
    <div className="mx-auto flex h-full max-w-160 flex-col overflow-y-auto rounded-3xl bg-white px-10 py-9 shadow-[0_20px_60px_rgba(109,91,208,0.10)]">

      <div className="mb-7 text-center">
        <span className="mb-4 inline-block rounded-full border border-(--violet-dim) bg-(--violet-dim) px-4 py-1.5 font-serif text-xs italic font-semibold text-(--violet)">
          Bachelorarbeit Demo
        </span>
        <h1 className="font-serif text-[42px] font-bold leading-[1.15]">
          Emotionaler<br />Multi-Layer QR-Code
        </h1>
        <p className="mx-auto mt-3 max-w-105 text-sm leading-[1.7] text-(--tx-secondary)">
          Codieren Sie Ihre tägliche Gefühlswelt direkt über RGB-Farbkanäle. Wählen Sie ein Datum
          und erfassen Sie Ihren Zustand.
        </p>
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-1.5 text-xs font-semibold text-(--tx-muted)">Name</div>
            <input
              type="text"
              placeholder="z.B. Anna Muster"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <Calendar
            mode="single"
            locale={de}
            selected={isoToLocalDate(draft.date)}
            onSelect={handleDateSelect}
            modifiers={{ hasEntry: entries.map((e) => isoToLocalDate(e.date)) }}
            className="mx-auto"
          />

          <div className="rounded-2xl border border-(--bd-subtle) p-5">
            <div className="mb-1 text-base font-bold">Wie fühlst du dich gerade?</div>
            <p className="mb-4 text-sm text-(--tx-muted)">Mehrfachauswahl möglich</p>
            <TagPicker
              options={moodOptions}
              value={draft.moods}
              onChange={(moods) => setDraft((p) => ({ ...p, moods }))}
              onAddCustom={addCustomMood}
              addPlaceholder="Eigenes Gefühl…"
            />
          </div>

          <div className="rounded-2xl border border-(--bd-subtle) p-5">
            <div className="mb-1 text-base font-bold">Ort</div>
            <p className="mb-4 text-sm text-(--tx-muted)">Wo genau fühlst du dich so?</p>
            <TagPicker
              options={locationOptions}
              value={draft.location}
              onChange={(location) => setDraft((p) => ({ ...p, location }))}
              onAddCustom={addCustomLocation}
              addPlaceholder="Eigener Ort…"
            />
          </div>

          <Button
            type="button"
            onClick={() => setStep(2)}
            className="h-12 self-center rounded-full bg-(--tx-primary) px-8 text-base font-bold text-white hover:bg-(--tx-primary)/85"
          >
            weiter <ArrowRight className="size-4" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-5">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex w-fit items-center gap-1.5 text-sm font-semibold text-(--tx-secondary) hover:text-(--tx-primary)"
          >
            <ArrowLeft className="size-3.5" /> zurück
          </button>

          <div className="rounded-2xl border border-(--bd-subtle) p-5">
            <div className="mb-1 text-base font-bold">Notiz</div>
            <p className="mb-4 text-sm text-(--tx-muted)">Willst du dazu was notieren?</p>
            <textarea
              placeholder="Schreibe hier deine Gedanken…"
              value={draft.text}
              onChange={(e) => setDraft((p) => ({ ...p, text: e.target.value }))}
              style={{ minHeight: 110 }}
            />
          </div>

          <div className="rounded-2xl border border-(--bd-subtle) p-5">
            <div className="mb-1 text-base font-bold">Bilder</div>
            <p className="mb-4 text-sm text-(--tx-muted)">Willst du Bilder einfügen?</p>
            <ImageUpload
              images={draft.images}
              onChange={(fn) => setDraft((p) => ({ ...p, images: typeof fn === 'function' ? fn(p.images) : fn }))}
            />
          </div>

          <div className="rounded-2xl border border-(--bd-subtle) p-5">
            <div className="mb-1 text-base font-bold">Sprachnotiz</div>
            <p className="mb-4 text-sm text-(--tx-muted)">Willst du eine Sprachnotiz erstellen?</p>
            <AudioRecorder audio={draft.audio} onAudio={(a) => setDraft((p) => ({ ...p, audio: a }))} />
          </div>

          <div className="mt-1 flex items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleAddAnotherDay}
              className="h-12 gap-1.5 rounded-full border-(--bd-strong) px-6 text-base font-bold"
            >
              <Plus className="size-4" /> Weiteren Tag hinzufügen
            </Button>
            <Button
              type="button"
              onClick={handleFinish}
              className="h-12 gap-1.5 rounded-full bg-(--tx-primary) px-6 text-base font-bold text-white hover:bg-(--tx-primary)/85"
            >
              Fertig — weiter <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-(--bd-subtle) p-8 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-(--violet-dim)">
              <Check className="size-6 text-(--violet)" />
            </div>
            <div className="font-serif text-2xl font-bold">Du bist bereit zu generieren</div>
            <p className="mx-auto mt-2 max-w-90 text-sm leading-[1.6] text-(--tx-secondary)">
              {entries.length} Tag{entries.length === 1 ? '' : 'e'} erfasst — deine Notizen, Bilder und
              Sprachaufzeichnungen wurden erfolgreich verarbeitet. Klicke unten, um deinen emotionalen
              Multiplex-Code zu erzeugen.
            </p>
            <div className="mx-auto mt-5 flex max-w-75 flex-col gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={goEditMore}
                className="h-11 gap-1.5 rounded-full border-(--bd-strong) px-6 text-base font-bold"
              >
                <Plus className="size-4" /> Weiteren Tag hinzufügen
              </Button>
              <Button
                type="button"
                onClick={handleGenerateClick}
                className="h-11 gap-1.5 rounded-full bg-(--tx-primary) px-6 text-base font-bold text-white hover:bg-(--tx-primary)/85"
              >
                {justGenerated ? (
                  <>Generiert <Check className="size-4" /></>
                ) : (
                  <>Generiere dein qr code <Sparkles className="size-4" /></>
                )}
              </Button>
            </div>
            <div className="mt-3 font-mono text-[10px] text-(--ok)">🔒 100% clientseitige Canvas-Verarbeitung</div>
          </div>

          {entries.length > 0 && (
            <div className="rounded-2xl border border-(--bd-subtle) p-4">
              <div className="mb-2 text-xs font-semibold text-(--tx-muted)">ERFASSTE TAGE</div>
              <div className="flex max-h-50 flex-col gap-1.5 overflow-y-auto">
                {[...entries].sort((a, b) => b.date.localeCompare(a.date)).map((e) => (
                  <div key={e.date} className="flex items-center gap-2.5 rounded-lg bg-(--bg-surface) px-3 py-2">
                    <span className="font-mono text-[11px] text-(--tx-secondary)">{formatDateLabel(e.date)}</span>
                    <span className="text-sm">{e.moods.map((m) => moodIconByKey[m] || '✨').join(' ')}</span>
                    {e.text && (
                      <span className="flex-1 truncate text-xs text-(--tx-muted)">{e.text}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-(--bd-subtle) p-4">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-xs font-semibold text-(--tx-muted)">Datenverteilung auf Ebenen</div>
              <div className="font-mono text-xs font-semibold text-(--tx-secondary)">{formatSize(dataSize)} gesamt</div>
            </div>
            <div className="flex flex-col gap-1.5">
              {LAYER_META.map(({ label, color }, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="h-2 w-2 shrink-0 rounded-xs" style={{ background: color }} />
                  <div className="flex-1 font-mono text-[11px] text-(--tx-secondary)">{label}</div>
                  <div className="font-mono text-[11px]" style={{ color }}>
                    {formatSize(layerSizes[i])}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-[rgba(109,91,208,0.07)] p-4 text-sm leading-[1.6] text-(--tx-secondary)">
            <strong className="font-mono text-xs text-(--violet)">WIE ES FUNKTIONIERT</strong>
            <br />
            Drei normale QR-Codes werden über die Farbkanäle kombiniert: Rot = Ebene 1, Grün = Ebene 2,
            Blau = Ebene 3. Jedes farbige Modul trägt Information aller drei Ebenen gleichzeitig.
          </div>
        </div>
      )}
    </div>
  );
}
