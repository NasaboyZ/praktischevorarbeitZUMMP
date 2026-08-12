import { useState } from 'react';
import { de } from 'date-fns/locale';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { formatSize, formatTimeline, isoToLocalDate, localDateToIso, QR_CAPACITY_BY_LEVEL } from '../../lib/data';
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

function TagPicker({ options, value, onChange }) {
  const toggle = (key) => {
    onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
  };

  return (
    <div className="flex flex-wrap gap-2">
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
      <Button
        type="button"
        variant="pill"
        className="h-auto gap-1.5 border-dashed px-4 py-2 text-sm font-medium text-(--tx-muted)"
      >
        + Hinzufügen
      </Button>
    </div>
  );
}

const LAYER_BREAKDOWN = [
  { label: 'L1 Session + Meta',    color: 'var(--r)', pct: 20 },
  { label: 'L2 Text + Einträge',   color: 'var(--g)', pct: 40 },
  { label: 'L3 Medien + Binär',    color: 'var(--b)', pct: 40 },
];

export default function ControlCenter({
  userData, setUserData,
  timeline, setTimeline,
  dataSize, timelineDays,
}) {
  const [step, setStep] = useState(1);

  return (
    <div className="mx-auto flex h-full max-w-160 flex-col overflow-y-auto rounded-3xl bg-white px-10 py-9 shadow-[0_20px_60px_rgba(109,91,208,0.10)]">

      <div className="mb-7 text-center">
        <span className="mb-4 inline-block rounded-full border border-(--violet-dim) bg-(--violet-dim) px-4 py-1.5 font-serif text-xs italic font-semibold text-(--violet)">
          Bachelorarbeit Demo
        </span>
        <h1 className="font-serif text-[42px] font-bold leading-[1.15]">
          Emotionaler<br />Multiplex-Tracker
        </h1>
        <p className="mx-auto mt-3 max-w-105 text-sm leading-[1.7] text-(--tx-secondary)">
          Codieren Sie Ihre tägliche Gefühlswelt direkt über RGB-Farbkanäle. Wählen Sie ein Datum
          und erfassen Sie Ihren Zustand.
        </p>
      </div>

      {step === 1 && (
        <div className="flex flex-col gap-6">
          <Calendar
            mode="single"
            locale={de}
            selected={isoToLocalDate(userData.date)}
            onSelect={(d) => d && setUserData((p) => ({ ...p, date: localDateToIso(d) }))}
            className="mx-auto"
          />

          <div className="rounded-2xl border border-(--bd-subtle) p-5">
            <div className="mb-1 text-base font-bold">Wie fühlst du dich gerade?</div>
            <p className="mb-4 text-sm text-(--tx-muted)">Mehrfachauswahl möglich</p>
            <TagPicker
              options={MOOD_OPTIONS}
              value={userData.moods}
              onChange={(moods) => setUserData((p) => ({ ...p, moods }))}
            />
          </div>

          <div className="rounded-2xl border border-(--bd-subtle) p-5">
            <div className="mb-1 text-base font-bold">Ort</div>
            <p className="mb-4 text-sm text-(--tx-muted)">Wo genau fühlst du dich so?</p>
            <TagPicker
              options={LOCATION_OPTIONS}
              value={userData.location}
              onChange={(location) => setUserData((p) => ({ ...p, location }))}
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="mb-1.5 text-xs font-semibold text-(--tx-muted)">Name</div>
              <input
                type="text"
                placeholder="z.B. Anna Muster"
                value={userData.name}
                onChange={(e) => setUserData((p) => ({ ...p, name: e.target.value }))}
              />
            </div>
            <div>
              <div className="mb-1.5 text-xs font-semibold text-(--tx-muted)">Datum</div>
              <input
                type="date"
                value={userData.date}
                onChange={(e) => setUserData((p) => ({ ...p, date: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <div className="mb-1.5 text-xs font-semibold text-(--tx-muted)">Tagebucheintrag</div>
            <textarea
              placeholder="Was ist heute passiert? Wie hast du dich gefühlt?"
              value={userData.text}
              onChange={(e) => setUserData((p) => ({ ...p, text: e.target.value }))}
              style={{ minHeight: 100 }}
            />
            <div className="mt-1 font-mono text-[10px] text-(--tx-muted)">{userData.text.length} Zeichen</div>
          </div>

          <div>
            <div className="mb-1.5 text-xs font-semibold text-(--tx-muted)">Fotos</div>
            <ImageUpload
              images={userData.images}
              onChange={(fn) => setUserData((p) => ({ ...p, images: typeof fn === 'function' ? fn(p.images) : fn }))}
            />
          </div>

          <div>
            <div className="mb-1.5 text-xs font-semibold text-(--tx-muted)">Sprachmemo</div>
            <AudioRecorder audio={userData.audio} onAudio={(a) => setUserData((p) => ({ ...p, audio: a }))} />
          </div>

          <div className="rounded-2xl border border-(--bd-subtle) bg-(--bg-surface) p-5">
            <div className="mb-2.5 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-(--tx-muted)">Timeline — Stress-Test</div>
                <div className="font-serif text-xl font-bold">{formatTimeline(timelineDays)}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-semibold text-(--tx-muted)">Datengröße</div>
                <div className={`font-mono text-lg font-semibold ${dataSize > QR_CAPACITY_BY_LEVEL.M ? 'text-(--err)' : 'text-(--ok)'}`}>
                  {formatSize(dataSize)}
                </div>
              </div>
            </div>
            <input
              type="range"
              min={0} max={100}
              value={timeline}
              onChange={(e) => setTimeline(Number(e.target.value))}
            />
            <div className="mt-1 flex justify-between font-mono text-[10px] text-(--tx-muted)">
              <span>1 Tag</span>
              <span>10 Jahre</span>
            </div>
          </div>

          <div className="rounded-2xl border border-(--bd-subtle) p-4">
            <div className="mb-2 text-xs font-semibold text-(--tx-muted)">Datenverteilung auf Ebenen</div>
            <div className="flex flex-col gap-1.5">
              {LAYER_BREAKDOWN.map(({ label, color, pct }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="h-2 w-2 shrink-0 rounded-[2px]" style={{ background: color }} />
                  <div className="flex-1 font-mono text-[11px] text-(--tx-secondary)">{label}</div>
                  <div className="font-mono text-[11px]" style={{ color }}>
                    {formatSize(Math.round(dataSize * pct / 100))}
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
