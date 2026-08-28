import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CyberBackground } from './components/CyberBackground';
import { HolographicTerminal } from './components/HolographicTerminal';
import { CaseDashboard } from './components/CaseDashboard';
import { CaseBriefingModal } from './components/CaseBriefingModal';
import { CrimeSceneExplorer } from './components/CrimeSceneExplorer';
import type { CaseData } from './types';

const InvestigationApp: React.FC = () => {
  const { user, updateUserScore } = useAuth();
  const [cases, setCases] = useState<CaseData[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [showBriefing, setShowBriefing] = useState<boolean>(false);
  const [isInInvestigation, setIsInInvestigation] = useState<boolean>(false);
  const [isLoadingCases, setIsLoadingCases] = useState<boolean>(true);

  // Fetch Cases from Spring Boot Backend
  useEffect(() => {
    if (!user) return;

    const fetchCases = async () => {
      setIsLoadingCases(true);
      try {
        const savedToken = localStorage.getItem('cib_token');
        const headers: Record<string, string> = {};
        if (savedToken) headers['Authorization'] = `Bearer ${savedToken}`;

        const res = await fetch('/api/cases', { headers });
        if (res.ok) {
          const data = await res.json();
          setCases(data);
        }
      } catch (err) {
        console.error('Failed to load cases from backend', err);
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
    <div className="relative min-h-screen bg-[#06080d] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      
      {/* 3D Dynamic Particle Background */}
      <CyberBackground />

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
