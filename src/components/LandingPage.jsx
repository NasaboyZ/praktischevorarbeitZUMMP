import Hero from './landing/Hero';
import PrincipleSection from './landing/PrincipleSection';
import ConceptSection from './landing/ConceptSection';
import StepsSection from './landing/StepsSection';
import BenefitsSection from './landing/BenefitsSection';
import StatsSection from './landing/StatsSection';
import PreviewSection from './landing/PreviewSection';
import FinalCta from './landing/FinalCta';
import Footer from './landing/Footer';

export default function LandingPage({ onStart }) {
  return (
    <div style={{ background: '#FFFFFF', color: '#111827', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}>
      <Hero onStart={onStart} />
      <PrincipleSection onStart={onStart} />
      <ConceptSection />
      <StepsSection />
      <BenefitsSection />
      <StatsSection />
      <PreviewSection />
      <FinalCta onStart={onStart} />
      <Footer />
    </div>
  );
}
