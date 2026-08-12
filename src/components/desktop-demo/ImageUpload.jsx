import { Image as ImageIcon, X } from 'lucide-react';
import { resizeImage } from '../../lib/media';

export default function ImageUpload({ images, onChange }) {
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        // Resize to ≤480 px JPEG so it stays under Ably's 65 KB message limit
        const resized = await resizeImage(ev.target.result);
        const approxSize = Math.round(resized.length * 0.75); // base64 → bytes estimate
        onChange((prev) => [...prev, {
          id: `img_${Date.now()}_${Math.random().toString(36).slice(2,5)}`,
          file, dataUrl: resized,
          type: 'image/jpeg', size: approxSize,
          name: file.name,
        }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  return (
    <div>
      <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-(--bd-strong) bg-(--bg-surface) text-(--tx-muted) transition-colors hover:border-(--violet) hover:text-(--violet)">
        <ImageIcon className="size-6" strokeWidth={1.5} />
        <span className="text-sm font-medium">
          {images.length ? `${images.length} Foto${images.length > 1 ? 's' : ''} geladen` : 'Bilder hinzufügen'}
        </span>
        <input type="file" accept="image/*" multiple onChange={handleFiles} className="hidden" />
      </label>
      {images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((img) => (
            <div key={img.id} className="relative">
              <img src={img.dataUrl} alt="" className="size-11 rounded-md border border-(--bd-strong) object-cover" />
              <button
                type="button"
                onClick={() => onChange((p) => p.filter((x) => x.id !== img.id))}
                className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-(--err) text-white"
              >
                <X className="size-2.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
