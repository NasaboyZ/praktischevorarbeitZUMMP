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
      <label
        style={{
          display:'flex', alignItems:'center', gap:8, cursor:'pointer',
          padding:'7px 10px', borderRadius:8,
          border:'1px dashed var(--bd-strong)', color:'var(--tx-secondary)',
          fontSize:12, fontFamily:'var(--f-mono)', transition:'all 0.15s',
        }}
        onMouseOver={(e) => e.currentTarget.style.borderColor='var(--blue)'}
        onMouseOut={(e) => e.currentTarget.style.borderColor='var(--bd-strong)'}
      >
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
        </svg>
        {images.length ? `${images.length} Foto${images.length>1?'s':''} geladen` : 'Fotos hochladen'}
        <input type="file" accept="image/*" multiple onChange={handleFiles} style={{display:'none'}} />
      </label>
      {images.length > 0 && (
        <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
          {images.map((img) => (
            <div key={img.id} style={{ position:'relative' }}>
              <img src={img.dataUrl} alt="" style={{
                width:44, height:44, objectFit:'cover', borderRadius:6,
                border:'1px solid var(--bd-strong)',
              }} />
              <button
                onClick={() => onChange((p) => p.filter((x) => x.id !== img.id))}
                style={{
                  position:'absolute', top:-5, right:-5,
                  background:'var(--err)', border:'none', color:'#fff',
                  borderRadius:'50%', width:16, height:16,
                  fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                }}
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
