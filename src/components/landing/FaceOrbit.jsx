import frame from '../../assets/hero-Smiles/frame.png';
import redFace from '../../assets/hero-Smiles/rotesgesicht-emoji.png';
import orangeFace from '../../assets/hero-Smiles/oranges-gesicht-emoji.png';
import greenFace from '../../assets/hero-Smiles/gruenesgesicht-emoji.png';
import purpleFace from '../../assets/hero-Smiles/vieloutes-gesicht.png';
import FloatingFace from './FloatingFace';

// frame.png is a 1439×1316 canvas, but the artwork only fills y:0–1017 —
// the rest is transparent padding. We crop to that with object-fit:cover
// and size the faces off the same coordinate space so they land on the arc.
const FACES = [
  { src: orangeFace, alt: 'Schockierter oranger Smiley', top: '60%', left: '23%',   size: '10.6%', delay: 0,   duration: 4.2 },
  { src: redFace,    alt: 'Schockierter roter Smiley',   top: '60%', left: '75.5%', size: '10.6%', delay: 0.5, duration: 4.6 },
  { src: purpleFace, alt: 'Trauriger violetter Smiley',  top: '84%', left: '13%',   size: '9.2%',  delay: 1.1, duration: 5.0 },
  { src: greenFace,  alt: 'Fröhlicher grüner Smiley',    top: '84%', left: '86%',   size: '9.2%',  delay: 0.8, duration: 4.4 },
];

export default function FaceOrbit() {
  return (
    <div className="relative mx-auto w-full max-w-[900px]" style={{ aspectRatio: '1439 / 1017' }}>
      <img
        src={frame}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-top opacity-70"
      />
      {FACES.map((f) => (
        <FloatingFace key={f.alt} {...f} />
      ))}
    </div>
  );
}
