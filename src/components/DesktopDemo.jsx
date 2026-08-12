import { useState, useEffect, useRef } from 'react';
import {
  buildDataModel, buildPayload, splitDataForLayers,
  calculateDataSize, generateSessionId,
} from '../lib/data';
import { generateColorQR, tryGenerateNormalQR, generateSessionQR } from '../lib/qr';
import { connectDesktop, sendPayload, getMobileBaseUrl } from '../lib/ws';
import ControlCenter from './desktop-demo/ControlCenter';
import NormalQRPanel from './desktop-demo/NormalQRPanel';
import MultiLayerQRPanel from './desktop-demo/MultiLayerQRPanel';

export default function DesktopDemo() {

  // ─ State ─
  const [sessionId]    = useState(generateSessionId);
  const [name,     setName]     = useState(() => {
    try { return localStorage.getItem('mlqr-name') || ''; } catch { return ''; }
  });
  const [entries,  setEntries]  = useState([]);
  const [normalQR,    setNormalQR]    = useState({ dataUrl: null, error: null, size: 0 });
  const [colorQR,     setColorQR]     = useState(null);
  const [sessionQR,   setSessionQR]   = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const [showScanQR,  setShowScanQR]  = useState(false);
  const connRef    = useRef(null);
  const genTimer   = useRef(null);
  // Refs to avoid stale closure when mobile joins
  const entriesRef = useRef(entries);
  const nameRef     = useRef(name);
  useEffect(() => { entriesRef.current = entries; }, [entries]);
  useEffect(() => { nameRef.current = name; }, [name]);

  // Name is the one thing worth remembering across visits — everything else
  // (session, entries) is meant to start fresh each time.
  useEffect(() => {
    try { localStorage.setItem('mlqr-name', name); } catch { /* private mode etc. */ }
  }, [name]);

  const dataSize = calculateDataSize(entries, { sessionId, name });

  const mobileUrl = `${getMobileBaseUrl()}/?mobile=1&s=${sessionId}`;

  // ─ Generate session QR on mount ─
  useEffect(() => {
    generateSessionQR(mobileUrl).then(setSessionQR);
  }, [mobileUrl]);

  // ─ Connect to Ably on mount ─
  useEffect(() => {
    const conn = connectDesktop(sessionId, {
      onOpen: () => {},
      onMobileConnected: () => {
        setWsConnected(true);
        // Send current data immediately when phone connects
        const payload = buildPayload(entriesRef.current, { sessionId, name: nameRef.current });
        sendPayload(conn, payload);
      },
      onError: () => {},
    });
    connRef.current = conn;
    return () => conn.close();
  }, [sessionId]); // eslint-disable-line

  // ─ Regenerate QR codes on data change (debounced) ─
  useEffect(() => {
    clearTimeout(genTimer.current);
    genTimer.current = setTimeout(async () => {
      const model   = buildDataModel(entries, { sessionId, name });
      const jsonStr = JSON.stringify(model);
      const nqr     = await tryGenerateNormalQR(jsonStr);
      setNormalQR(nqr);
      const [l1, l2, l3] = splitDataForLayers(model);
      const cqr = await generateColorQR(l1, l2, l3);
      setColorQR(cqr);
    }, 600);
    return () => clearTimeout(genTimer.current);
  }, [entries, sessionId, name]);

  return (
    <main
      className="grid min-h-screen grid-cols-[1fr_1.35fr_1fr] gap-6 px-6 pt-24 pb-6"
      style={{
        background: 'radial-gradient(ellipse 900px 500px at 0% 0%, rgba(109,91,208,0.07), transparent 60%), radial-gradient(ellipse 900px 500px at 100% 100%, rgba(255,87,87,0.05), transparent 60%), #FAF8FC',
      }}
    >
      {/* ── LEFT: Normal QR ── */}
      <div className="overflow-y-auto">
        <NormalQRPanel qrState={normalQR} dataSize={dataSize} />
      </div>

      {/* ── CENTER: Control Center ── */}
      <div className="overflow-y-auto">
        <ControlCenter
          entries={entries}
          setEntries={setEntries}
          name={name}
          setName={setName}
          dataSize={dataSize}
          onGenerate={() => setShowScanQR(true)}
        />
      </div>

      {/* ── RIGHT: Multi-Layer QR ── */}
      <div className="overflow-y-auto">
        <MultiLayerQRPanel
          colorQR={colorQR}
          sessionQR={sessionQR}
          sessionId={sessionId}
          wsConnected={wsConnected}
          dataSize={dataSize}
          showScanQR={showScanQR}
          setShowScanQR={setShowScanQR}
        />
      </div>
    </main>
  );
}
