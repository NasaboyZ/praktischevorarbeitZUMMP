import { useState, useEffect, useRef } from 'react';
import {
  buildDataModel, buildPayload, splitDataForLayers,
  calculateDataSize, getTimelineDays, generateSessionId,
} from '../lib/data';
import { generateColorQR, tryGenerateNormalQR, generateSessionQR } from '../lib/qr';
import { connectDesktop, sendPayload, getMobileBaseUrl } from '../lib/ws';
import XRayMode from './XRayMode';
import JsonViewer from './JsonViewer';
import DesktopHeader from './desktop-demo/DesktopHeader';
import DesktopFooter from './desktop-demo/DesktopFooter';
import ControlCenter from './desktop-demo/ControlCenter';
import NormalQRPanel from './desktop-demo/NormalQRPanel';
import MultiLayerQRPanel from './desktop-demo/MultiLayerQRPanel';

const INITIAL_USER_DATA = () => ({
  name: '', mood: 4, text: '', images: [], audio: null,
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
  const [pipeStep,    setPipeStep]    = useState(-1);
  const [showXRay,    setShowXRay]    = useState(false);
  const [showJson,    setShowJson]    = useState(false);
  const [activeTab,   setActiveTab]   = useState('quick');
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
      setPipeStep(0);
      for (let i = 1; i <= 6; i++) {
        await new Promise((r) => setTimeout(r, 160));
        setPipeStep(i);
      }
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

  // Manual re-send (called from button)
  const handleResend = () => {
    if (!connRef.current) return;
    const payload = buildPayload({ ...userData, sessionId }, timelineDays);
    sendPayload(connRef.current, payload);
  };

  // ─ Reset ─
  const handleReset = () => {
    setUserData(INITIAL_USER_DATA());
    setTimeline(0);
    setNormalQR({ dataUrl:null, error:null, size:0 });
    setColorQR(null);
    setWsConnected(false);
    setPipeStep(-1);
  };

  const dataModel = buildDataModel({ ...userData, sessionId }, timelineDays);

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'var(--bg-deep)' }}>

      {/* ── Background grid ── */}
      <div className="grid-bg" style={{
        position:'fixed', inset:0, pointerEvents:'none', zIndex:0, opacity:0.4,
      }} />

      <DesktopHeader
        sessionId={sessionId}
        pipeStep={pipeStep}
        wsConnected={wsConnected}
        onXRay={() => setShowXRay(true)}
        onJson={() => setShowJson(true)}
        onReset={handleReset}
      />

      {/* ── Main 3-column layout ── */}
      <main style={{
        flex:1, display:'grid',
        gridTemplateColumns:'1fr 1.4fr 1fr',
        position:'relative', zIndex:1,
        minHeight:0,
      }}>

        {/* ── LEFT: Normal QR ── */}
        <div style={{ borderRight:'1px solid var(--bd-subtle)', overflowY:'auto' }}>
          <NormalQRPanel
            qrState={normalQR}
            dataSize={dataSize}
            timelineDays={timelineDays}
          />
        </div>

        {/* ── CENTER: Control Center ── */}
        <ControlCenter
          userData={userData}
          setUserData={setUserData}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          timeline={timeline}
          setTimeline={setTimeline}
          dataSize={dataSize}
          timelineDays={timelineDays}
        />

        {/* ── RIGHT: Multi-Layer QR ── */}
        <div style={{ borderLeft:'1px solid var(--bd-subtle)', overflowY:'auto' }}>
          <MultiLayerQRPanel
            colorQR={colorQR}
            sessionQR={sessionQR}
            sessionId={sessionId}
            wsConnected={wsConnected}
          />
        </div>
      </main>

      <DesktopFooter wsConnected={wsConnected} onResend={handleResend} />

      {/* ── Overlays ── */}
      {showXRay && (
        <XRayMode
          colorQR={colorQR}
          normalQR={normalQR}
          dataSize={dataSize}
          sessionId={sessionId}
          onClose={() => setShowXRay(false)}
        />
      )}
      {showJson && (
        <JsonViewer data={dataModel} onClose={() => setShowJson(false)} />
      )}
    </div>
  );
}
