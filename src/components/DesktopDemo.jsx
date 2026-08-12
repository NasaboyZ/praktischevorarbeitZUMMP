import { useState, useEffect, useRef } from 'react';
import {
  buildDataModel, buildPayload, splitDataForLayers,
  calculateDataSize, getTimelineDays, generateSessionId,
} from '../lib/data';
import { generateColorQR, tryGenerateNormalQR, generateSessionQR } from '../lib/qr';
import { connectDesktop, sendPayload, getMobileBaseUrl } from '../lib/ws';
import ControlCenter from './desktop-demo/ControlCenter';
import NormalQRPanel from './desktop-demo/NormalQRPanel';
import MultiLayerQRPanel from './desktop-demo/MultiLayerQRPanel';

const INITIAL_USER_DATA = () => ({
  name: '', moods: [], location: [], text: '', images: [], audio: null,
  date: new Date().toISOString().split('T')[0],
});

export default function DesktopDemo() {
  // ─ State ─
  const [sessionId]    = useState(generateSessionId);
  const [userData, setUserData] = useState(INITIAL_USER_DATA);
  const [timeline,    setTimeline]    = useState(0);
  const [normalQR,    setNormalQR]    = useState({ dataUrl: null, error: null, size: 0 });
  const [colorQR,     setColorQR]     = useState(null);
  const [sessionQR,   setSessionQR]   = useState(null);
  const [wsConnected, setWsConnected] = useState(false);
  const connRef    = useRef(null);
  const genTimer   = useRef(null);
  // Refs to avoid stale closure when mobile joins
  const userDataRef     = useRef(userData);
  const timelineDaysRef = useRef(1);
  useEffect(() => { userDataRef.current = userData; }, [userData]);

  const timelineDays = getTimelineDays(timeline);
  const dataSize     = calculateDataSize(userData, timelineDays);
  useEffect(() => { timelineDaysRef.current = timelineDays; }, [timelineDays]);

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
        const payload = buildPayload(
          { ...userDataRef.current, sessionId },
          timelineDaysRef.current
        );
        sendPayload(conn, payload);
      },
      onError: () => {},
    });
    connRef.current = conn;
    return () => conn.close();
  }, [sessionId]); // eslint-disable-line

  // ─ Regenerate QR codes on data/timeline change (debounced) ─
  useEffect(() => {
    clearTimeout(genTimer.current);
    genTimer.current = setTimeout(async () => {
      const model   = buildDataModel({ ...userData, sessionId }, timelineDays);
      const jsonStr = JSON.stringify(model);
      const nqr     = await tryGenerateNormalQR(jsonStr);
      setNormalQR(nqr);
      const [l1, l2, l3] = splitDataForLayers(model);
      const cqr = await generateColorQR(l1, l2, l3);
      setColorQR(cqr);
    }, 600);
    return () => clearTimeout(genTimer.current);
  }, [userData, timeline, sessionId, timelineDays]);

  return (
    <main
      className="grid min-h-screen grid-cols-[1fr_1.35fr_1fr] gap-6 p-6"
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
          userData={userData}
          setUserData={setUserData}
          timeline={timeline}
          setTimeline={setTimeline}
          dataSize={dataSize}
          timelineDays={timelineDays}
        />
      </div>

      {/* ── RIGHT: Multi-Layer QR ── */}
      <div className="overflow-y-auto">
        <MultiLayerQRPanel
          colorQR={colorQR}
          sessionQR={sessionQR}
          sessionId={sessionId}
          wsConnected={wsConnected}
        />
      </div>
    </main>
  );
}
