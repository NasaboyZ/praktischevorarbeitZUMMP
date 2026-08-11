export const MOOD_LABELS = ['', 'Schlecht', 'Weniger gut', 'Okay', 'Gut', 'Fantastisch'];
export const MOOD_ICONS  = ['', '😞', '😕', '😐', '😊', '😄'];

export default function MoodPicker({ value, onChange }) {
  return (
    <div style={{ display:'flex', gap:6 }}>
      {[1,2,3,4,5].map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          title={MOOD_LABELS[m]}
          style={{
            fontSize:22, background:'none', border:'none', cursor:'pointer',
            opacity: value === m ? 1 : 0.3,
            transform: value === m ? 'scale(1.25)' : 'scale(1)',
            transition:'all 0.15s ease',
          }}
        >{MOOD_ICONS[m]}</button>
      ))}
    </div>
  );
}
