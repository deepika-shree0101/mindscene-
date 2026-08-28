export type ClearanceLevel = 'LEVEL-1 ROOKIE' | 'LEVEL-2 AGENT' | 'LEVEL-3 CONFIDENTIAL' | 'TOP-SECRET CIB';

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  badgeNumber: string;
  rank: string;
  clearanceLevel: string;
  score: number;
  completedCaseIds: string[];
  token?: string;
}

export interface Clue {
  id: string;
  title: string;
  type: 'OBJECT' | 'DOCUMENT' | 'PHOTO' | 'STATEMENT' | 'FORENSIC';
  description: string;
  visualIcon: string;
  locationFound: string;
  forensicAnalysis: string;
  isCrucial?: boolean;
}

export interface Hotspot {
  id: string;
  title: string;
  description: string;
  xPercent: number;
  yPercent: number;
  iconType: string;
  linkedClueId?: string;
  inspectionDialogue?: string;
}

export interface CrimeScene {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  visualTheme: string;
  ambientType: string;
  hotspots: Hotspot[];
}

export interface Suspect {
  id: string;
  name: string;
  role: string;
  age: number;
  relationship: string;
  motive: string;
  alibi: string;
  avatarIcon: string;
  initialStatements: string[];
  unlockedStatements: string[];
}

export interface CaseData {
  id: string;
  caseNumber: string;
  title: string;
  subtitle: string;
  synopsis: string;
  difficulty: 'ROOKIE' | 'DETECTIVE' | 'MASTERMIND';
  estimatedTime: string;
  crimeType: string;
  timeOfCrime: string;
  location: string;
  victimName: string;
  victimStatus: string;
  briefingText: string;
  thumbnailTheme: string;
  scenes: CrimeScene[];
  clues: Clue[];
  suspects: Suspect[];
}

export interface UserProgress {
  caseId: string;
  discoveredClueIds: string[];
  inspectedHotspotIds: string[];
  unlockedSceneIds: string[];
  connectedCluePairs: string[];
  isSolved: boolean;
  score: number;
  timeSpentSeconds: number;
}

export interface DeductionResult {
  isCorrect: boolean;
  score: number;
  title: string;
  evaluationSummary: string;
  trueCulpritName: string;
  trueMotive: string;
  trueSequenceOfEvents: string;
  crucialCluesFound: string[];
  crucialCluesMissed: string[];
  totalCluesDiscovered: number;
  totalCluesInCase: number;
  timeTakenSeconds: number;
  badgeAwarded: string;
}
