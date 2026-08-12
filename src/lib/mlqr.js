// ── Generalized N-Layer MLQR (Multi-Layered QR Code) ────────────────────────
// Implements the partition-based construction from Noppakaew, Khomkuth &
// Sriwilas (2018), "Construction of multi-layered QR codes utilizing
// partitions of positive integers", J. Math. Computer Sci. 18, 306–313.
//
// Instead of 1 QR code per RGB channel (today's 3-layer scheme: binary
// on/off = 0 or 255), each channel can carry several QR codes by giving each
// one a distinct intensity level from a partition of 255 built from a
// geometric sequence. Because the partition is constructed so no subset of
// values collides with another partition value, the summed channel
// intensity at each pixel uniquely determines which of that channel's
// layers were "white" there — making lossless un-layering possible with a
// precomputed sum→subset lookup table.

import QRCode from 'qrcode';

// Partition of `m` into `l` parts via geometric sequence {a^(n-1)} (paper §2.2).
// l=1 degenerates to [m] — today's binary single-layer-per-channel case.
export function computePartition(m, l, a = 2) {
  if (l <= 1) return [m];
  const s = Math.floor((m * (a - 1)) / (a ** l - 1));
  const parts = [];
  for (let i = 0; i <= l - 2; i++) parts.push(s * a ** i);
  const sumSoFar = parts.reduce((x, y) => x + y, 0);
  parts.push(m - sumSoFar);
  return parts;
}

// Split k layers across the 3 color channels as evenly as possible.
export function distributeLayers(k) {
  const base = Math.floor(k / 3);
  const rem = k % 3;
  return [0, 1, 2].map((i) => base + (i < rem ? 1 : 0));
}

function createModules(text, version, errorCorrectionLevel) {
  return QRCode.create(text || ' ', { version, errorCorrectionLevel }).modules;
}

// Smallest QR version that fits every text at the given EC level — all
// layers must share one version so their module grids align pixel-for-pixel.
function findSharedVersion(texts, errorCorrectionLevel) {
  let maxVersion = 1;
  for (const t of texts) {
    const qr = QRCode.create(t || ' ', { errorCorrectionLevel });
    maxVersion = Math.max(maxVersion, qr.version);
  }
  return maxVersion;
}

// Precompute sum → included-layer-bitmask for one channel's partition.
function buildSumLookup(partition) {
  const table = new Int16Array(256).fill(-1);
  const l = partition.length;
  for (let mask = 0; mask < (1 << l); mask++) {
    let sum = 0;
    for (let i = 0; i < l; i++) if (mask & (1 << i)) sum += partition[i];
    if (sum <= 255) table[sum] = mask;
  }
  return table;
}

function now() {
  return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

// ── Encode ───────────────────────────────────────────────────────────────
// texts: array of k strings, one per layer (assigned to channels R,G,B in order).
export function encodeMLQR(texts, { errorCorrectionLevel = 'M', base = 2 } = {}) {
  const t0 = now();
  const k = texts.length;
  const version = findSharedVersion(texts, errorCorrectionLevel);
  const t1 = now();

  const modulesList = texts.map((t) => createModules(t, version, errorCorrectionLevel));
  const size = modulesList[0].size;
  const t2 = now();

  const groupSizes = distributeLayers(k);
  const partitions = groupSizes.map((g) => computePartition(255, g, base));
  const t3 = now();

  const rgb = new Uint8ClampedArray(size * size * 3);
  let layerCursor = 0;
  for (let ch = 0; ch < 3; ch++) {
    const g = groupSizes[ch];
    const partition = partitions[ch];
    for (let li = 0; li < g; li++) {
      const modules = modulesList[layerCursor];
      const intensity = partition[li];
      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          if (!modules.get(row, col)) { // light module → carries this layer's color
            rgb[(row * size + col) * 3 + ch] += intensity;
          }
        }
      }
      layerCursor++;
    }
  }
  const t4 = now();

  return {
    size, version, groupSizes, partitions, rgb,
    timing: {
      findVersion: t1 - t0,
      generateModules: t2 - t1,
      partitionCalc: t3 - t2,
      composite: t4 - t3,
      total: t4 - t0,
    },
  };
}

// ── Decode / un-layer ───────────────────────────────────────────────────
// Returns k module matrices (Uint8Array, 1 = dark), in the same layer order as encode.
export function decodeMLQR({ size, groupSizes, partitions, rgb }) {
  const t0 = now();
  const lookups = partitions.map(buildSumLookup);
  const t1 = now();

  const layers = [];
  for (let ch = 0; ch < 3; ch++) {
    const g = groupSizes[ch];
    const table = lookups[ch];
    const layerMats = Array.from({ length: g }, () => new Uint8Array(size * size));
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const v = rgb[(row * size + col) * 3 + ch];
        const mask = table[v];
        for (let li = 0; li < g; li++) {
          const white = mask !== -1 && (mask & (1 << li)) !== 0;
          layerMats[li][row * size + col] = white ? 0 : 1;
        }
      }
    }
    layers.push(...layerMats);
  }
  const t2 = now();

  return { layers, timing: { buildLookup: t1 - t0, unlayer: t2 - t1, total: t2 - t0 } };
}
