import { lazy, Suspense, useState } from 'react';

const LandingPage = lazy(() => import('./components/LandingPage'));
const Navbar = lazy(() => import('./components/landing/Navbar'));
const DesktopDemo = lazy(() => import('./components/DesktopDemo'));
const MobileView = lazy(() => import('./components/MobileView'));

function LoadingScreen() {
  return (
    <main className="grid min-h-screen place-items-center bg-(--bg-base) text-(--tx-secondary)">
      <p role="status">Ansicht wird geladen…</p>
    </main>
  );
}

export default function App() {
  const params = new URLSearchParams(window.location.search);
  const isMobile = params.has('mobile');
  const [showDemo, setShowDemo] = useState(false);

  if (isMobile) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <MobileView />
      </Suspense>
    );
  }

  if (showDemo) {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Navbar mode="demo" onHome={() => setShowDemo(false)} />
        <DesktopDemo />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Navbar onStart={() => setShowDemo(true)} />
      <LandingPage onStart={() => setShowDemo(true)} />
    </Suspense>
  );
}
