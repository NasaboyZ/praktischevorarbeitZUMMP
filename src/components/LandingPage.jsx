import Hero from './landing/Hero';
import PrincipleSection from './landing/PrincipleSection';
import ConceptSection from './landing/ConceptSection';
import AboutSection from './landing/AboutSection';
import StepsSection from './landing/StepsSection';
import BenefitsSection from './landing/BenefitsSection';
import StatsSection from './landing/StatsSection';
import PreviewSection from './landing/PreviewSection';
import FinalCta from './landing/FinalCta';
import Footer from './landing/Footer';

export default function LandingPage({ onStart }) {
  return (
    <div className="overflow-x-hidden bg-white text-(--tx-primary)">
      <Hero onStart={onStart} />
      <PrincipleSection onStart={onStart} />
      <ConceptSection />
      <AboutSection />
      <StepsSection />
      <BenefitsSection />
      <StatsSection />
      <PreviewSection />
      <FinalCta onStart={onStart} />
      <Footer />
    </div>
  );
}
