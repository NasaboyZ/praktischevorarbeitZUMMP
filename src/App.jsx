import DesktopDemo from './components/DesktopDemo';
import MobileView from './components/MobileView';

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const isMobile = params.has('mobile');
  return isMobile ? <MobileView /> : <DesktopDemo />;
}
