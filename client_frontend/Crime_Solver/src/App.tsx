import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ScaryVideoBackground } from './components/ScaryVideoBackground';
import { HolographicTerminal } from './components/HolographicTerminal';
import { CaseDashboard } from './components/CaseDashboard';
import { CaseBriefingModal } from './components/CaseBriefingModal';
import { CrimeSceneExplorer } from './components/CrimeSceneExplorer';
import { HorrorAmbience } from './components/HorrorAmbience';
import { DEFAULT_CASES } from './data/defaultCases';
import type { CaseData } from './types';

const InvestigationApp: React.FC = () => {
  const { user, updateUserScore } = useAuth();
  const [cases, setCases] = useState<CaseData[]>(DEFAULT_CASES);
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [showBriefing, setShowBriefing] = useState<boolean>(false);
  const [isInInvestigation, setIsInInvestigation] = useState<boolean>(false);
  const [isLoadingCases, setIsLoadingCases] = useState<boolean>(false);

  // Fetch Cases from Spring Boot Backend with automatic local fallback
  useEffect(() => {
    if (!user) return;

    const fetchCases = async () => {
      try {
        const savedToken = localStorage.getItem('cib_token');
        const headers: Record<string, string> = {};
        if (savedToken) headers['Authorization'] = `Bearer ${savedToken}`;

        const res = await fetch('/api/cases', { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCases(data);
          }
        }
      } catch (err) {
        console.warn('Backend offline or Netlify deployment mode: using bundled CIB case dossiers.', err);
      } finally {
        setIsLoadingCases(false);
      }
    };

    fetchCases();
  }, [user]);

  const handleSelectCase = (caseItem: CaseData) => {
    setSelectedCase(caseItem);
    setShowBriefing(true);
  };

  const handleEnterCrimeScene = () => {
    setShowBriefing(false);
    setIsInInvestigation(true);
  };

  const handleReturnToDashboard = () => {
    setIsInInvestigation(false);
    setShowBriefing(false);
    setSelectedCase(null);
  };

  return (
    <div className="relative min-h-screen bg-[#050000] text-red-100 font-sans selection:bg-red-900/50 selection:text-red-200">
      
      {/* Global Horror Ambience (Sound & Lightning) */}
      <HorrorAmbience />

      {/* Dynamic Looping Scary Video Background */}
      <ScaryVideoBackground variant={isInInvestigation ? 'scene' : 'menu'} />

      {/* Main Flow Router */}
      <div className="relative z-10">
        {!user ? (
          <HolographicTerminal />
        ) : isInInvestigation && selectedCase ? (
          <CrimeSceneExplorer
            caseData={selectedCase}
            onReturnToDashboard={handleReturnToDashboard}
            onUpdateScore={(score, caseId) => updateUserScore(score, caseId)}
          />
        ) : (
          <>
            <CaseDashboard
              cases={cases}
              onSelectCase={handleSelectCase}
              isLoading={isLoadingCases}
            />

            {showBriefing && selectedCase && (
              <CaseBriefingModal
                caseData={selectedCase}
                onClose={() => setShowBriefing(false)}
                onEnterInvestigation={handleEnterCrimeScene}
              />
            )}
          </>
        )}
      </div>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <InvestigationApp />
    </AuthProvider>
  );
}
