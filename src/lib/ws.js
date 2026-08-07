// ── WebSocket Client ─────────────────────────────────────────────────────────

let desktopWs = null;

export async function fetchServerInfo() {
  try {
    const res = await fetch('http://localhost:3001/api/info');
    return await res.json();
  } catch {
    return { ip: 'localhost', port: 3001, frontendPort: 5173 };
  }
}

export function connectDesktop(sessionId, wsUrl, callbacks = {}) {
  const ws = new WebSocket(wsUrl);
  desktopWs = ws;

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'register', session: sessionId, role: 'desktop' }));
    callbacks.onOpen?.();
  };

  ws.onmessage = (e) => {
    let msg;
    try { msg = JSON.parse(e.data); } catch { return; }
    if (msg.type === 'mobile_connected') callbacks.onMobileConnected?.(msg);
    if (msg.type === 'data_requested')   callbacks.onDataRequested?.(msg);
    if (msg.type === 'registered')       callbacks.onRegistered?.(msg);
  };

  ws.onerror = () => callbacks.onError?.();
  ws.onclose = () => callbacks.onClose?.();

  return ws;
}

export function sendPayload(ws, payload) {
  if (ws?.readyState === 1) {
    ws.send(JSON.stringify({ type: 'send_data', payload }));
    return true;
  }
  return false;
}

export function connectMobile(sessionId, wsUrl, callbacks = {}) {
  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'register', session: sessionId, role: 'mobile' }));
    callbacks.onOpen?.();
  };

  ws.onmessage = (e) => {
    let msg;
    try { msg = JSON.parse(e.data); } catch { return; }
    if (msg.type === 'data')       callbacks.onData?.(msg.payload);
    if (msg.type === 'registered') callbacks.onRegistered?.(msg);
  };

  ws.onerror = () => callbacks.onError?.();
  ws.onclose = () => callbacks.onClose?.();

  return ws;
}
