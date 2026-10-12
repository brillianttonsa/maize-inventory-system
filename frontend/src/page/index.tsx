import { useState } from 'react';
import { Navbar } from '../components/website/common/Navbar';
import { AuthPanel } from '../components/website/AuthPanel';
import { HeroSection } from '../components/website/HeroSection';
import { Footer } from '../components/website/common/Footer';
import { SystemOverview } from '../components/website/SystemOverview';
import type { AuthMode } from '../types/website';


function Home() {
  const [authMode, setAuthMode] = useState<AuthMode | null>(null);
  const [authNotice, setAuthNotice] = useState('');


  const openAuth = (mode: AuthMode, notice = '') => {
    setAuthNotice(notice);
    setAuthMode(mode);
  };

  return (
    <>
      <Navbar onAuth={(mode) => openAuth(mode)} />

      <div className="min-h-screen bg-gray-50">
        <div id="home"><HeroSection /></div>
        <div id="about"> <SystemOverview /> </div>
      </div>

      <Footer />
      {authMode && (
        <AuthPanel
          mode={authMode}
          notice={authNotice}
          onModeChange={(mode) => {
            setAuthNotice('');
            setAuthMode(mode);
          }}
          onClose={() => setAuthMode(null)}
        />
      )}
    </>
  );
}

export default Home;
