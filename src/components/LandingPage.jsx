import Hero from './landing/Hero';
import PrincipleSection from './landing/PrincipleSection';
import ConceptSection from './landing/ConceptSection';
import AboutSection from './landing/AboutSection';
import HighlightsSection from './landing/HighlightsSection';
import Footer from './landing/Footer';

export default function LandingPage({ onStart }) {
  return (
    <div className="overflow-x-hidden bg-white text-(--tx-primary)">
      <Hero onStart={onStart} />
      <PrincipleSection onStart={onStart} />
      <ConceptSection />
      <AboutSection />
      <HighlightsSection />
      <Footer />
    </div>
  );
}
