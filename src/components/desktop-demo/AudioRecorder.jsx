import { useState, useRef } from 'react';
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

  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      {!recording && !audio && (
        <button className="btn btn-ghost" onClick={start} style={{ fontSize:11 }}>
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3zm-1 13.93V18H9v2h6v-2h-2v-2.07A7 7 0 0019 9h-2a5 5 0 01-10 0H5a7 7 0 006 6.93z"/>
          </svg>
          Aufnehmen
        </button>
      )}
      {recording && (
        <button className="btn btn-danger" onClick={stop}>
          <span style={{ width:8,height:8, background:'var(--err)', borderRadius:2, display:'inline-block', animation:'blink 1s infinite' }} />
          {elapsed}s — Stop
        </button>
      )}
      {audio && !recording && (
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <audio controls src={audio.dataUrl} style={{ height:28, maxWidth:160 }} />
          <span style={{ fontFamily:'var(--f-mono)', fontSize:10, color:'var(--tx-muted)' }}>
            {audio.duration}s
          </span>
          <button onClick={() => onAudio(null)} className="btn btn-danger" style={{ padding:'2px 8px' }}>×</button>
        </div>
      )}
    </div>
  );
}
