import { useState } from 'react';
import LandingPage from './components/LandingPage';
import ImageDetector from './components/ImageDetector';

type Page = 'landing' | 'detector';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  return (
    <>
      {currentPage === 'landing' && (
        <LandingPage onGetStarted={() => setCurrentPage('detector')} />
      )}
      {currentPage === 'detector' && (
        <ImageDetector onBack={() => setCurrentPage('landing')} />
      )}
    </>
  );
}

export default App;
