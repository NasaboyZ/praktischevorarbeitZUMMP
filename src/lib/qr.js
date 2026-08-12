// ── QR Generation & Color Multiplexing ─────────────────────────────────────
import QRCode from 'qrcode';

export const QR_SIZE = 280;
const BASE_OPTS = { width: QR_SIZE, margin: 2, errorCorrectionLevel: 'M' };

// Render QR to offscreen canvas, returns { canvas, imageData }
async function qrToCanvas(text, opts = {}) {
  const canvas = document.createElement('canvas');
  canvas.width = QR_SIZE; canvas.height = QR_SIZE;
  await QRCode.toCanvas(canvas, text || ' ', {
    ...BASE_OPTS, ...opts,
    color: { dark: '#000000', light: '#ffffff' },
  });
  return { canvas, imageData: canvas.getContext('2d').getImageData(0, 0, QR_SIZE, QR_SIZE) };
}

// true if pixel i is a dark module in a B&W QR
function isDark(data, i) { return data[i * 4] < 128; }

// Create a monochrome channel canvas (colored tint for visualization)
function makeLayerCanvas(imageData, ch) {
  const canvas = document.createElement('canvas');
  canvas.width = QR_SIZE; canvas.height = QR_SIZE;
  const ctx = canvas.getContext('2d');
  const out = ctx.createImageData(QR_SIZE, QR_SIZE);
  const PALETTE = {
    r: [220, 40, 40],
    g: [30, 210, 100],
    b: [60, 130, 255],
  };
  const [pr, pg, pb] = PALETTE[ch];
  for (let i = 0; i < QR_SIZE * QR_SIZE; i++) {
    const idx = i * 4;
    const dark = isDark(imageData.data, i);
    out.data[idx]     = dark ? pr : 14;
    out.data[idx + 1] = dark ? pg : 18;
    out.data[idx + 2] = dark ? pb : 30;
    out.data[idx + 3] = 255;
  }
  ctx.putImageData(out, 0, 0);
  return canvas;
}

// Color-multiplex 3 QR texts → { colorDataUrl, layerDataUrls[3], error }
export async function generateColorQR(text1, text2, text3) {
  const t1 = text1 || 'layer1';
  const t2 = text2 || 'layer2';
  const t3 = text3 || 'layer3';

  let r1, r2, r3;
  try {
    [r1, r2, r3] = await Promise.all([
      qrToCanvas(t1),
      qrToCanvas(t2),
      qrToCanvas(t3),
    ]);
  } catch {
    return { colorDataUrl: null, layerDataUrls: null, error: 'CAPACITY_EXCEEDED' };
  }

  // Composite canvas
  const canvas = document.createElement('canvas');
  canvas.width = QR_SIZE; canvas.height = QR_SIZE;
  const ctx = canvas.getContext('2d');
  const out = ctx.createImageData(QR_SIZE, QR_SIZE);

  for (let i = 0; i < QR_SIZE * QR_SIZE; i++) {
    const idx = i * 4;
    const rD = isDark(r1.imageData.data, i);
    const gD = isDark(r2.imageData.data, i);
    const bD = isDark(r3.imageData.data, i);
    out.data[idx]     = rD ? 220 : 14;
    out.data[idx + 1] = gD ? 210 : 18;
    out.data[idx + 2] = bD ? 255 : 30;
    out.data[idx + 3] = 255;
  }
  ctx.putImageData(out, 0, 0);

  // Individual colored layers for X-Ray mode
  const l1 = makeLayerCanvas(r1.imageData, 'r');
  const l2 = makeLayerCanvas(r2.imageData, 'g');
  const l3 = makeLayerCanvas(r3.imageData, 'b');

  return {
    colorDataUrl: canvas.toDataURL(),
    layerDataUrls: [l1.toDataURL(), l2.toDataURL(), l3.toDataURL()],
    error: null,
  };
}

// Try encoding text into a normal QR
export async function tryGenerateNormalQR(text) {
  const size = new TextEncoder().encode(text).length;
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      ...BASE_OPTS,
      color: { dark: '#DCE8F8', light: '#0D1525' },
    });
    return { dataUrl, error: null, size };
  } catch {
    return { dataUrl: null, error: 'CAPACITY_EXCEEDED', size };
  }
}

// Standard session QR (actually scannable by phone)
export async function generateSessionQR(mobileUrl) {
  return QRCode.toDataURL(mobileUrl, {
    width: QR_SIZE,
    margin: 2,
    errorCorrectionLevel: 'H',
    color: { dark: '#DCE8F8', light: '#0D1525' },
  });
}
