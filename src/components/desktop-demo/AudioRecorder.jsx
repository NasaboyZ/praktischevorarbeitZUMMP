import { useState, useRef } from 'react';
import { Mic, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBestAudioMime } from '../../lib/media';

export default function AudioRecorder({ audio, onAudio }) {
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const mrRef    = useRef(null);
  const timerRef = useRef(null);

  const start = async () => {
    try {
      const stream   = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getBestAudioMime();
      const mr = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const chunks = [];
      mr.ondataavailable = (e) => chunks.push(e.data);
      mr.onstop = () => {
        const type = mr.mimeType || mimeType || 'audio/webm';
        const blob = new Blob(chunks, { type });
        const reader = new FileReader();
        reader.onload = (ev) => {
          onAudio({ blob, dataUrl: ev.target.result, type, duration: elapsed, size: blob.size });
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      mrRef.current = mr;
      setRecording(true);
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } catch { alert('Mikrofon-Zugriff verweigert.'); }
  };

  const stop = () => {
    mrRef.current?.stop();
    clearInterval(timerRef.current);
    setRecording(false);
  };

  if (audio && !recording) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-(--bd-subtle) bg-(--bg-surface) px-4 py-3">
        <audio controls src={audio.dataUrl} className="h-8 flex-1" />
        <span className="font-mono text-[11px] text-(--tx-muted)">{audio.duration}s</span>
        <button
          type="button"
          onClick={() => onAudio(null)}
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--err) text-white"
        >
          <X className="size-3.5" />
        </button>
      </div>
    );
  }

  if (recording) {
    return (
      <Button
        type="button"
        onClick={stop}
        className="h-12 w-full gap-2 rounded-full bg-(--err) text-base font-bold text-white hover:bg-(--err)/85"
      >
        <span className="size-2 animate-pulse rounded-full bg-white" />
        {elapsed}s — Aufnahme stoppen
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={start}
      className="h-12 w-full gap-2 rounded-full bg-(--tx-primary) text-base font-bold text-white hover:bg-(--tx-primary)/85"
    >
      <Mic className="size-4" />
      Aufnahme starten
    </Button>
  );
}
