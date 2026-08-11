import { useState } from 'react';
import DesktopDemo from './components/DesktopDemo';
import MobileView from './components/MobileView';
import LandingPage from './components/LandingPage';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const isMobile = params.has('mobile');
  const [showDemo, setShowDemo] = useState(false);

  if (isMobile) return <MobileView />;
  if (showDemo) return <DesktopDemo />;
  return <LandingPage onStart={() => setShowDemo(true)} />;
}
