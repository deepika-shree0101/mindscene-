import React, { useState } from 'react';
import type { CaseData, Clue, DeductionResult } from '../types';
import { sound } from '../utils/soundEngine';
import confetti from 'canvas-confetti';
import { ShieldCheck, ShieldAlert, Award, Clock, ArrowRight, RotateCcw, X, Check, FileCheck } from 'lucide-react';

interface DeductionModalProps {
  caseData: CaseData;
  discoveredClues: Clue[];
  timeTakenSeconds: number;
  onClose: () => void;
  onCaseSolved: (score: number) => void;
  onReturnToDashboard: () => void;
}

export const DeductionModal: React.FC<DeductionModalProps> = ({
  caseData,
  discoveredClues,
  timeTakenSeconds,
  onClose,
  onCaseSolved,
  onReturnToDashboard,
}) => {
  const [selectedCulpritId, setSelectedCulpritId] = useState<string>('');
  const [motiveText, setMotiveText] = useState<string>('');
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<DeductionResult | null>(null);

  const toggleEvidence = (clueId: string) => {
    sound.playKeyClick();
    setSelectedEvidenceIds((prev) =>
      prev.includes(clueId) ? prev.filter((id) => id !== clueId) : [...prev, clueId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCulpritId) {
      sound.playAccessDenied();
      return;
    }

    setIsSubmitting(true);
    sound.playKeyClick();

    try {
      const savedToken = localStorage.getItem('cib_token');
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (savedToken) headers['Authorization'] = `Bearer ${savedToken}`;

      const res = await fetch(`/api/cases/${caseData.id}/deduce`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          culpritId: selectedCulpritId,
          motive: motiveText,
          selectedEvidenceIds,
          timeTakenSeconds,
        }),
      });

      if (res.ok) {
        const data: DeductionResult = await res.json();
        setResult(data);
        if (data.isCorrect) {
          sound.playCaseSolved();
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#38bdf8', '#fbbf24', '#34d399'],
          });
          onCaseSolved(data.score);
        } else {
          sound.playAccessDenied();
        }
        return;
      }
    } catch {
      // Standalone Netlify Mode: Client-Side Deductive Resolution
    }

    // Client-side fallback evaluation
    const isVanceCase = caseData.id.includes('blackwood') || caseData.title.toLowerCase().includes('blackwood');
    const isKiraCase = caseData.id.includes('penthouse') || caseData.title.toLowerCase().includes('penthouse');

    const isCorrect = isVanceCase
      ? selectedCulpritId.toLowerCase().includes('vance')
      : isKiraCase
      ? selectedCulpritId.toLowerCase().includes('kira')
      : true;

    const crucialClueIds = isVanceCase
      ? ['clue-med-note', 'clue-sedative-goblet', 'clue-orthopedic-shoe', 'clue-staged-lock']
      : ['clue-tungsten-weight', 'clue-rogue-device'];

    const crucialFound = crucialClueIds.filter((id) => selectedEvidenceIds.includes(id));
    const crucialMissed = crucialClueIds.filter((id) => !selectedEvidenceIds.includes(id));

    let score = 0;
    if (isCorrect) score += 500;
    score += crucialFound.length * 150;
    if (timeTakenSeconds < 300) score += 200;

    const solved = isCorrect && crucialFound.length >= 1;
    const badge = solved ? (score >= 900 ? 'MASTER DETECTIVE' : 'CLEARED INVESTIGATOR') : 'INCONCLUSIVE LEAD';

    const localResult: DeductionResult = {
      isCorrect: solved,
      score,
      title: solved
        ? 'CASE CLOSED // HOMICIDE ARREST AUTHORIZED'
        : 'CASE UNSOLVED // INSUFFICIENT PROBABLE CAUSE',
      evaluationSummary: solved
        ? 'Outstanding forensic deduction, Detective. Your analysis correctly unmasked the perpetrator and tied the physical evidence together without reasonable doubt.'
        : 'The evidence presented was insufficient or the accused suspect holds a verified alibi. The District Attorney cannot proceed with formal charges.',
      trueCulpritName: isVanceCase ? 'Dr. Julian Vance (Personal Physician)' : 'Kira Mercer (Chief Cybersecurity Architect)',
      trueMotive: isVanceCase
        ? 'Lord Blackwood discovered Dr. Vance was embezzling funds from the estate medical foundation and was preparing to report him to the medical board.'
        : 'Recruited by an international syndicate with a multi-million dollar bounty for the Heart of Kronos diamond.',
      trueSequenceOfEvents: isVanceCase
        ? 'Dr. Vance spiked Lord Blackwood’s wine with a neuro-tranquilizer. Once unconscious, Vance cut the balcony latch from inside to stage a burglary, then moved the victim through the secret bookshelf passage to an awaiting speedboat at the cliff dock.'
        : 'Kira installed a rogue transceiver behind the server rack to broadcast a camera loop, entered the vault with master admin credentials, and swapped the gem with an exact-weight tungsten slug.',
      crucialCluesFound: crucialFound,
      crucialCluesMissed: crucialMissed,
      totalCluesDiscovered: discoveredClues.length,
      totalCluesInCase: caseData.clues.length,
      timeTakenSeconds,
      badgeAwarded: badge,
    };

    setResult(localResult);
    if (solved) {
      sound.playCaseSolved();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#38bdf8', '#fbbf24', '#34d399'],
      });
      onCaseSolved(score);
    } else {
      sound.playAccessDenied();
    }
    setIsSubmitting(false);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0d121c] border-2 border-orange-500/50 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 text-left max-h-[90vh] overflow-y-auto">
        
        {!result ? (
          <>
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-400 text-slate-950">
                  FINAL VERDICT PHASE
                </span>
                <h1 className="text-2xl font-creepster font-extrabold text-white mt-1">
                  DELIVER CASE ACCUSATION
                </h1>
              </div>

              <button
                onClick={() => {
                  sound.playKeyClick();
                  onClose();
                }}
                className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-orange-400 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Question 1: Who is the Culprit? */}
              <div>
                <label className="block text-xs font-mono text-orange-400 uppercase tracking-wider mb-2 font-bold">
                  1. WHO IS THE PERPETRATOR RESPONSIBLE?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {caseData.suspects.map((suspect) => {
                    const isSelected = selectedCulpritId === suspect.id;
                    return (
                      <div
                        key={suspect.id}
                        onClick={() => {
                          sound.playKeyClick();
                          setSelectedCulpritId(suspect.id);
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-[#182133] border-orange-400 ring-2 ring-orange-400/50 shadow-xl'
                            : 'bg-[#131926] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 mb-2">
                          <div className="w-9 h-9 rounded-full bg-orange-950 border border-orange-500 flex items-center justify-center text-orange-300 font-bold font-mono text-xs">
                            {suspect.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xs font-sans font-bold text-white">{suspect.name}</h4>
                            <span className="text-[10px] font-mono text-orange-400">{suspect.role}</span>
                          </div>
                        </div>
                        <span className="text-xs font-sans text-slate-300 line-clamp-2 italic leading-snug">
                          "{suspect.motive}"
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Question 2: Motive */}
              <div>
                <label className="block text-xs font-mono text-orange-400 uppercase tracking-wider mb-2 font-bold">
                  2. WHAT WAS THEIR MOTIVE & HOW WAS IT EXECUTED?
                </label>
                <textarea
                  value={motiveText}
                  onChange={(e) => setMotiveText(e.target.value)}
                  placeholder="Explain why and how they committed the crime (e.g. laced the wine, staged the balcony break-in)..."
                  className="w-full bg-[#090c14] border border-slate-700 focus:border-orange-400 text-slate-100 font-sans text-xs p-3.5 rounded-xl outline-none h-24 leading-relaxed"
                />
              </div>

              {/* Question 3: Supporting Evidence */}
              <div>
                <label className="block text-xs font-mono text-orange-400 uppercase tracking-wider mb-2 font-bold flex items-center justify-between">
                  <span>3. ATTACH RELEVANT SUPPORTING EVIDENCE ({selectedEvidenceIds.length} SELECTED)</span>
                  <span className="text-slate-400 text-[10px]">{discoveredClues.length} available</span>
                </label>

                {discoveredClues.length === 0 ? (
                  <p className="text-xs font-sans text-orange-300 bg-orange-950/40 p-3.5 rounded-xl border border-orange-800/80">
                    ⚠️ Warning: You haven't gathered any clues yet. Return to the crime scenes and scan for evidence first.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                    {discoveredClues.map((clue, idx) => {
                      const isChecked = selectedEvidenceIds.includes(clue.id);
                      return (
                        <div
                          key={clue.id}
                          onClick={() => toggleEvidence(clue.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-orange-950/60 border-orange-400 text-orange-200'
                              : 'bg-[#131926] border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="bg-orange-400 text-slate-950 font-mono text-[9px] font-black px-1.5 py-0.5 rounded shrink-0">
                              #0{idx + 1}
                            </span>
                            <span className="text-xs font-sans font-medium text-slate-100 truncate">{clue.title}</span>
                          </div>
                          <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ml-2 ${
                            isChecked ? 'bg-orange-500 border-orange-400 text-slate-950' : 'border-slate-700'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Submit Action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <div className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-red-400" />
                  <span>TIME LOGGED: <strong className="text-white">{formatTime(timeTakenSeconds)}</strong></span>
                </div>

                <button
                  type="submit"
                  disabled={!selectedCulpritId || isSubmitting}
                  className="px-7 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-slate-950 font-creepster font-bold text-xs tracking-wider shadow-lg hover:shadow-orange-500/30 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <FileCheck className="w-4 h-4 stroke-[2.5]" />
                  <span>{isSubmitting ? 'EVALUATING CASE LOGIC...' : 'DELIVER ACCUSATION 🔎'}</span>
                </button>
              </div>

            </form>
          </>
        ) : (
          /* CASE RESULT SCREEN */
          <div className="space-y-6 text-center">
            
            <div className={`p-6 sm:p-8 rounded-2xl border-2 ${
              result.isCorrect
                ? 'bg-rose-950/80 border-rose-500 shadow-2xl'
                : 'bg-red-950/80 border-red-500 shadow-2xl'
            }`}>
              {result.isCorrect ? (
                <ShieldCheck className="w-16 h-16 text-rose-400 mx-auto mb-2 animate-bounce" />
              ) : (
                <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-2" />
              )}
              
              <h1 className="text-3xl font-creepster font-black text-white">
                {result.title}
              </h1>

              <p className="text-sm font-sans text-slate-200 mt-2 max-w-xl mx-auto leading-relaxed">
                {result.evaluationSummary}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-5 pt-4 border-t border-slate-800/80 font-mono text-xs">
                <div className="text-orange-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>SCORE: <strong className="text-white font-bold">{result.score} PTS</strong></span>
                </div>
                <div className="text-red-400 flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>TIME: <strong className="text-white font-bold">{formatTime(result.timeTakenSeconds)}</strong></span>
                </div>
                <div className="text-rose-300">
                  RANK BADGE: <strong className="text-white font-bold">{result.badgeAwarded}</strong>
                </div>
              </div>
            </div>

            {/* True Case Resolution Narrative */}
            <div className="bg-[#131926] border border-slate-800 rounded-xl p-5 text-left font-sans text-xs space-y-3 shadow-lg">
              <div className="text-orange-400 font-mono font-bold uppercase border-b border-slate-800 pb-2 text-xs">
                CLASSIFIED CASE RESOLUTION DOSSIER
              </div>
              
              <div>
                <strong className="text-slate-400 font-mono text-[10px] uppercase block">TRUE PERPETRATOR:</strong>
                <span className="text-white font-bold text-sm">{result.trueCulpritName}</span>
              </div>

              <div>
                <strong className="text-slate-400 font-mono text-[10px] uppercase block">PROVEN MOTIVE:</strong>
                <p className="text-slate-200 mt-0.5 text-sm">{result.trueMotive}</p>
              </div>

              <div>
                <strong className="text-slate-400 font-mono text-[10px] uppercase block">SEQUENCE OF EVENTS:</strong>
                <p className="text-slate-200 mt-0.5 leading-relaxed text-sm">{result.trueSequenceOfEvents}</p>
              </div>
            </div>

            {/* Crucial Clues Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left font-sans text-xs">
              <div className="bg-rose-950/40 border border-rose-800 p-3.5 rounded-xl">
                <span className="text-rose-400 font-mono font-bold block mb-1">CRUCIAL EVIDENCE FOUND:</span>
                <span className="text-slate-200 text-sm font-semibold">{result.crucialCluesFound.length} key clues attached</span>
              </div>
              <div className="bg-orange-950/40 border border-orange-800 p-3.5 rounded-xl">
                <span className="text-orange-400 font-mono font-bold block mb-1">CRUCIAL EVIDENCE OVERLOOKED:</span>
                <span className="text-slate-200 text-sm font-semibold">{result.crucialCluesMissed.length} key clues missed</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {!result.isCorrect && (
                <button
                  onClick={() => setResult(null)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-700 hover:border-orange-400 text-slate-200 font-sans font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>RE-EXAMINE CRIME SCENE</span>
                </button>
              )}

              <button
                onClick={onReturnToDashboard}
                className="w-full sm:w-auto px-7 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-creepster font-bold text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg"
              >
                <span>RETURN TO CASE ARCHIVE</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
