// ── QR Generation & Color Multiplexing ─────────────────────────────────────
import QRCode from 'qrcode';
import { encodeMLQR } from './mlqr';

const QR_SIZE = 280;
const BASE_OPTS = { width: QR_SIZE, margin: 2, errorCorrectionLevel: 'M' };

// Color-multiplex 3 QR texts via the partition-based MLQR encoder (mlqr.js) →
// { colorDataUrl, error }. l=1 layer per channel, i.e. the degenerate binary
// case of the generalized construction — same 3-layer data model as before,
// but the pixels are now the real encodeMLQR() output instead of a hand-rolled
// per-channel composite.
export async function generateColorQR(text1, text2, text3) {
  const texts = [text1 || 'layer1', text2 || 'layer2', text3 || 'layer3'];

  let encoded;
  try {
    encoded = encodeMLQR(texts, { errorCorrectionLevel: 'M' });
  } catch {
    return { colorDataUrl: null, error: 'CAPACITY_EXCEEDED' };
  }

  const { size, rgb } = encoded;
  const margin = 2;
  const dim = size + margin * 2;

  const canvas = document.createElement('canvas');
  canvas.width = dim; canvas.height = dim;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, dim, dim);

  const modules = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const idx = i * 4;
    modules.data[idx]     = rgb[i * 3];
    modules.data[idx + 1] = rgb[i * 3 + 1];
    modules.data[idx + 2] = rgb[i * 3 + 2];
    modules.data[idx + 3] = 255;
  }
  ctx.putImageData(modules, margin, margin);

  return { colorDataUrl: canvas.toDataURL(), error: null };
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
