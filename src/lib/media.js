// iOS Safari needs audio/mp4, Chrome uses audio/webm — pick best available
export function getBestAudioMime() {
  const candidates = [
    'audio/mp4;codecs=mp4a.40.2',  // AAC-LC — plays on iOS ✓
    'audio/mp4',
    'audio/webm;codecs=opus',
    'audio/webm',
  ];
  return candidates.find((t) => { try { return MediaRecorder.isTypeSupported(t); } catch { return false; } }) || '';
}

// Resize & compress image to stay under Ably's 65 KB message limit
export async function resizeImage(dataUrl, maxPx = 480, quality = 0.70) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width  = Math.round(img.width  * scale);
      c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.src = dataUrl;
  });
}
