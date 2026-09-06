import type { CaseData, Clue, Suspect } from '../types';

export interface InterrogationReply {
  text: string;
  stressChange: number;
  isLie: boolean;
  mood: 'CALM' | 'DEFENSIVE' | 'HOSTILE' | 'NERVOUS' | 'CRACKING';
}

// Slang and broken-English mapping dictionary
const SLANG_REPLACEMENTS: [RegExp, string][] = [
  [/\bu\b/gi, 'you'],
  [/\bur\b/gi, 'your'],
  [/\burs\b/gi, 'yours'],
  [/\br\b/gi, 'are'],
  [/\bwat\b|\bwht\b|\bwut\b/gi, 'what'],
  [/\bwen\b/gi, 'when'],
  [/\bwer\b|\bwhr\b/gi, 'where'],
  [/\by\b|\bwhi\b/gi, 'why'],
  [/\bcuz\b|\bbc\b|\bbcoz\b|\bbcz\b/gi, 'because'],
  [/\bdidnt\b/gi, "didn't"],
  [/\bdont\b/gi, "don't"],
  [/\bdoesnt\b/gi, "doesn't"],
  [/\bcant\b/gi, "can't"],
  [/\bwont\b/gi, "won't"],
  [/\bidk\b/gi, "don't know"],
  [/\bdunno\b/gi, "don't know"],
  [/\bkno\b/gi, 'know'],
  [/\bgimme\b/gi, 'give me'],
  [/\bgotta\b/gi, 'got to'],
  [/\blemme\b/gi, 'let me'],
  [/\bpls\b|\bplz\b/gi, 'please'],
  [/\blyin\b/gi, 'lying'],
  [/\bded\b/gi, 'dead'],
  [/\bsus\b/gi, 'suspicious'],
  [/\bmoni\b/gi, 'money'],
];

export function normalizeDetectiveQuery(raw: string): string {
  let cleaned = raw.trim();
  for (const [pattern, replacement] of SLANG_REPLACEMENTS) {
    cleaned = cleaned.replace(pattern, replacement);
  }
  return cleaned.toLowerCase();
}

type IntentType =
  | 'ACCUSATION_KILL'
  | 'ALIBI_WHEREABOUTS'
  | 'MOTIVE_WHY'
  | 'MONEY_DEBT_WILL'
  | 'WINE_POISON_DRINK'
  | 'MEDICAL_NOTE_DOSAGE'
  | 'SECRET_PASSAGE_ESCAPE'
  | 'BOOTPRINTS_SHOES'
  | 'BALCONY_LOCK_STAGED'
  | 'RELATIONSHIP_VICTIM'
  | 'ABOUT_OTHER_SUSPECT'
  | 'NERVOUS_SWEATING'
  | 'CALLING_OUT_LIE'
  | 'CONFESS_PRESSURE'
  | 'THREAT_PRISON'
  | 'SAW_ANYONE_WITNESS'
  | 'TIMELINE_HOURS'
  | 'LAWYER_RIGHTS'
  | 'EVIDENCE_CONFRONT'
  | 'GREETING_CASUAL'
  | 'GENERAL_UNKNOWN';

export function detectIntent(_query: string, normalized: string): IntentType {
  const q = normalized;

  // Direct Murder Accusations
  if (
    q.includes('kill') ||
    q.includes('murder') ||
    q.includes('you did it') ||
    q.includes('u did it') ||
    q.includes('it was you') ||
    q.includes('culprit') ||
    q.includes('guilty') ||
    q.includes('blood on your hands') ||
    q.includes('admit you did')
  ) {
    return 'ACCUSATION_KILL';
  }

  // Wine / Poison / Chemical / Goblet
  if (
    q.includes('wine') ||
    q.includes('goblet') ||
    q.includes('glass') ||
    q.includes('poison') ||
    q.includes('tranquilizer') ||
    q.includes('doxylamine') ||
    q.includes('spiked') ||
    q.includes('drink') ||
    q.includes('sedative') ||
    q.includes('tea')
  ) {
    return 'WINE_POISON_DRINK';
  }

  // Medical Note / Prescription / Dosage
  if (
    q.includes('prescription') ||
    q.includes('dosage') ||
    q.includes('medical note') ||
    q.includes('paralysis') ||
    q.includes('dr v') ||
    q.includes('burnt note') ||
    q.includes('doctor note')
  ) {
    return 'MEDICAL_NOTE_DOSAGE';
  }

  // Shoes / Bootprints / Tread
  if (
    q.includes('shoe') ||
    q.includes('boot') ||
    q.includes('footprint') ||
    q.includes('orthopedic') ||
    q.includes('tread') ||
    q.includes('muddy') ||
    q.includes('size 10')
  ) {
    return 'BOOTPRINTS_SHOES';
  }

  // Secret Passage / Wall / Bookshelf / Corridor
  if (
    q.includes('secret') ||
    q.includes('passage') ||
    q.includes('bookshelf') ||
    q.includes('corridor') ||
    q.includes('tunnel') ||
    q.includes('dock') ||
    q.includes('boathouse') ||
    q.includes('mechanism')
  ) {
    return 'SECRET_PASSAGE_ESCAPE';
  }

  // Balcony Lock / Staged Break-in
  if (
    q.includes('balcony') ||
    q.includes('lock') ||
    q.includes('latch') ||
    q.includes('pliers') ||
    q.includes('staged') ||
    q.includes('french door')
  ) {
    return 'BALCONY_LOCK_STAGED';
  }

  // Alibi & Location
  if (
    q.includes('where were you') ||
    q.includes('where was you') ||
    q.includes('where u was') ||
    q.includes('alibi') ||
    q.includes('what were you doing') ||
    q.includes('what was you doing') ||
    q.includes('what u doing') ||
    q.includes('where did you go') ||
    q.includes('guest clinic') ||
    q.includes('west wing') ||
    q.includes('patio')
  ) {
    return 'ALIBI_WHEREABOUTS';
  }

  // Money, Debts, Will, Inheritance
  if (
    q.includes('money') ||
    q.includes('debt') ||
    q.includes('inherit') ||
    q.includes('will') ||
    q.includes('cash') ||
    q.includes('owe') ||
    q.includes('bank') ||
    q.includes('embezzle') ||
    q.includes('financial') ||
    q.includes('rich') ||
    q.includes('greedy')
  ) {
    return 'MONEY_DEBT_WILL';
  }

  // Motive & Reasons
  if (
    q.includes('why') ||
    q.includes('motive') ||
    q.includes('reason') ||
    q.includes('why did you') ||
    q.includes('hate him') ||
    q.includes('angry') ||
    q.includes('grudge')
  ) {
    return 'MOTIVE_WHY';
  }

  // Inquiring about other suspects
  if (
    q.includes('vance') ||
    q.includes('evelyn') ||
    q.includes('graves') ||
    q.includes('butler') ||
    q.includes('doctor') ||
    q.includes('daughter') ||
    q.includes('someone else') ||
    q.includes('who else')
  ) {
    return 'ABOUT_OTHER_SUSPECT';
  }

  // Calling out lies
  if (
    q.includes('lying') ||
    q.includes('liar') ||
    q.includes('lie') ||
    q.includes('truth') ||
    q.includes('honest') ||
    q.includes('stop lying') ||
    q.includes('bullshit') ||
    q.includes('fake')
  ) {
    return 'CALLING_OUT_LIE';
  }

  // Physical signs of nervousness
  if (
    q.includes('sweat') ||
    q.includes('nervous') ||
    q.includes('scared') ||
    q.includes('shaking') ||
    q.includes('trembling') ||
    q.includes('polygraph') ||
    q.includes('heart rate')
  ) {
    return 'NERVOUS_SWEATING';
  }

  // Pressure to confess
  if (
    q.includes('confess') ||
    q.includes('admit') ||
    q.includes('give up') ||
    q.includes('spill') ||
    q.includes('own up') ||
    q.includes('caught')
  ) {
    return 'CONFESS_PRESSURE';
  }

  // Threat of Prison / Law
  if (
    q.includes('jail') ||
    q.includes('prison') ||
    q.includes('arrest') ||
    q.includes('cuffs') ||
    q.includes('behind bars') ||
    q.includes('charge') ||
    q.includes('sentence')
  ) {
    return 'THREAT_PRISON';
  }

  // Witness / Sights / Sounds
  if (
    q.includes('see') ||
    q.includes('saw') ||
    q.includes('hear') ||
    q.includes('heard') ||
    q.includes('witness') ||
    q.includes('notice anything') ||
    q.includes('sounds')
  ) {
    return 'SAW_ANYONE_WITNESS';
  }

  // Relationship with victim
  if (
    q.includes('relationship') ||
    q.includes('how do you know') ||
    q.includes('how you know') ||
    q.includes('friend') ||
    q.includes('boss') ||
    q.includes('father') ||
    q.includes('patient') ||
    q.includes('close to him')
  ) {
    return 'RELATIONSHIP_VICTIM';
  }

  // Time / Timeline
  if (
    q.includes('time') ||
    q.includes('clock') ||
    q.includes('midnight') ||
    q.includes('23:45') ||
    q.includes('23:15') ||
    q.includes('hour') ||
    q.includes('minutes')
  ) {
    return 'TIMELINE_HOURS';
  }

  // General evidence confrontation
  if (
    q.includes('evidence') ||
    q.includes('proof') ||
    q.includes('camera') ||
    q.includes('fingerprint') ||
    q.includes('dna') ||
    q.includes('clue') ||
    q.includes('found this')
  ) {
    return 'EVIDENCE_CONFRONT';
  }

  // Lawyer or rights
  if (
    q.includes('lawyer') ||
    q.includes('attorney') ||
    q.includes('counsel') ||
    q.includes('rights')
  ) {
    return 'LAWYER_RIGHTS';
  }

  // Greetings or casual openers
  if (
    q.startsWith('hi') ||
    q.startsWith('hello') ||
    q.startsWith('hey') ||
    q === 'who are you' ||
    q.includes('whats up') ||
    q.includes('bro')
  ) {
    return 'GREETING_CASUAL';
  }

  return 'GENERAL_UNKNOWN';
}

export class SuspectDialogueManager {
  private usedResponseIndices: Map<string, number[]> = new Map();
  private lastIntent: IntentType | null = null;
  private consecutiveSameIntentCount = 0;

  public getResponse(
    rawQuery: string,
    suspect: Suspect,
    caseData: CaseData,
    stressLevel: number,
    presentedClue?: Clue
  ): InterrogationReply {
    const normalized = normalizeDetectiveQuery(rawQuery);
    const intent = presentedClue ? 'EVIDENCE_CONFRONT' : detectIntent(rawQuery, normalized);

    // Track repeated presses
    if (intent === this.lastIntent && intent !== 'GENERAL_UNKNOWN') {
      this.consecutiveSameIntentCount++;
    } else {
      this.consecutiveSameIntentCount = 0;
      this.lastIntent = intent;
    }

    // Handle repeated identical pressing
    if (this.consecutiveSameIntentCount >= 2) {
      return this.handleRepetitionReaction(suspect, stressLevel);
    }

    // Presented clue handling
    if (presentedClue) {
      return this.handlePresentedClue(presentedClue, suspect, stressLevel);
    }

    // Dispatch based on suspect identity or fall back to generic persona
    const suspectKey = suspect.name.toLowerCase();

    if (suspectKey.includes('vance')) {
      return this.getDrVanceResponse(intent, stressLevel, rawQuery);
    } else if (suspectKey.includes('evelyn')) {
      return this.getEvelynResponse(intent, stressLevel, rawQuery);
    } else if (suspectKey.includes('graves')) {
      return this.getGravesResponse(intent, stressLevel, rawQuery);
    }

    // Generic Suspect Generator for any future cases
    return this.getDynamicSuspectResponse(intent, suspect, caseData, stressLevel, rawQuery);
  }

  private pickNonRepeating(key: string, options: string[]): string {
    const used = this.usedResponseIndices.get(key) || [];
    const available = options
      .map((_, i) => i)
      .filter((i) => !used.includes(i));

    const selectedIdx =
      available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : Math.floor(Math.random() * options.length);

    const updated = [...used, selectedIdx].slice(-Math.max(1, options.length - 2));
    this.usedResponseIndices.set(key, updated);

    return options[selectedIdx];
  }

  private handleRepetitionReaction(suspect: Suspect, stressLevel: number): InterrogationReply {
    const suspectKey = suspect.name.toLowerCase();
    const isVance = suspectKey.includes('vance');

    if (stressLevel > 75) {
      const texts = [
        `(Slamming both fists on the steel table) STOP ASKING ME THE EXACT SAME THING! How many times do I have to answer you?! You're suffocating me!`,
        `(Hyperventilating, wiping forehead) Repeating your question won't magically give you the answer you want! I've told you everything! Stop harassing me!`,
        `(Voice trembling with rage) Are you deaf, Detective?! I already answered that! You have no right to keep grilling me on this!`,
      ];
      return {
        text: this.pickNonRepeating('rep-high', texts),
        stressChange: 15,
        isLie: isVance,
        mood: 'CRACKING',
      };
    } else {
      const texts = [
        `Detective, you already asked me that. My answer hasn't changed in the last thirty seconds and it won't change now.`,
        `Are you trying to wear me down through repetition? Because it's not going to work. Review your notes.`,
        `I gave you my statement. Repeating your question won't alter the facts. Move on to something relevant.`,
        `You seem fixated on this point. I have nothing to add beyond what I just told you.`,
      ];
      return {
        text: this.pickNonRepeating('rep-low', texts),
        stressChange: 8,
        isLie: false,
        mood: 'DEFENSIVE',
      };
    }
  }

  private handlePresentedClue(clue: Clue, suspect: Suspect, _stressLevel: number): InterrogationReply {
    const clueTitle = clue.title.toLowerCase();
    const isVance = suspect.name.toLowerCase().includes('vance');

    if (isVance) {
      if (clueTitle.includes('note') || clueTitle.includes('prescription')) {
        return {
          text: `(Stiffens noticeably, eyes darting to the floor) That prescription?! Where did you dig that up?! It was an exploratory dosage calculation for his severe sleep apnea! 'Induce temporary paralysis'—that was an academic note warning against overdose, not a premeditated recipe!`,
          stressChange: 26,
          isLie: true,
          mood: 'CRACKING',
        };
      }
      if (clueTitle.includes('glass') || clueTitle.includes('wine') || clueTitle.includes('goblet')) {
        return {
          text: `(Voice cracking, pulling at collar) The crystal goblet?! Doxylamine residue...?! Detective, I prepare medicines downstairs in the clinic. Cross-contamination happens! Someone else must have carried the drink up to Arthur! You can't connect that glass to my hands!`,
          stressChange: 28,
          isLie: true,
          mood: 'CRACKING',
        };
      }
      if (clueTitle.includes('shoe') || clueTitle.includes('boot') || clueTitle.includes('footprint')) {
        return {
          text: `(Tugging nervously at his cuffs) Orthopedic shoe prints on the rainy balcony...? Thousands of medical practitioners wear non-slip orthopedic boots! It proves someone with bad arches walked out there, that is all! Stop trying to fit my foot into your pre-written narrative!`,
          stressChange: 24,
          isLie: true,
          mood: 'HOSTILE',
        };
      }
      if (clueTitle.includes('latch') || clueTitle.includes('lock')) {
        return {
          text: `(Swallowing dryly) The latch was cut from the inside...? Well... that simply proves the kidnapper was hiding inside the study before Lord Blackwood entered! I was in the downstairs dispensary all evening! Check with the butler!`,
          stressChange: 22,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }
      return {
        text: `(Backing his chair away from the table) Why are you throwing ${clue.title} in my face?! You're taking forensic artifacts out of context to build a witch hunt!`,
        stressChange: 18,
        isLie: true,
        mood: 'NERVOUS',
      };
    }

    // For innocent suspects (Evelyn or Graves)
    if (suspect.name.toLowerCase().includes('evelyn')) {
      if (clueTitle.includes('note') || clueTitle.includes('prescription')) {
        return {
          text: `(Leaning in, inspecting the document) Wait... that handwriting! That's Dr. Vance's script! Look at the capital 'V' at the bottom! He was prescribing lethal paralytics to my father?! I told you that quack was up to something!`,
          stressChange: -5,
          isLie: false,
          mood: 'CALM',
        };
      }
      if (clueTitle.includes('shoe') || clueTitle.includes('footprint')) {
        return {
          text: `Look at those heavy orthopedic treads! I wear Italian stiletto boots, Detective! Dr. Vance has worn those clunky orthopedic shoes ever since his knee surgery. Go check his wardrobe!`,
          stressChange: -5,
          isLie: false,
          mood: 'CALM',
        };
      }
      return {
        text: `You found ${clue.title}? It wasn't mine. But if you look closely at who had the motive and physical access, the pieces will point away from me.`,
        stressChange: 5,
        isLie: false,
        mood: 'CALM',
      };
    }

    // Graves
    return {
      text: `Good heavens... ${clue.title}? I recall Lord Blackwood discussing this matter in confidence earlier in the week. If this has been contaminated or tampered with, I assure you it did not originate from the household staff.`,
      stressChange: 5,
      isLie: false,
      mood: 'CALM',
    };
  }

  // ================= DR. JULIAN VANCE (THE CULPRIT) =================
  private getDrVanceResponse(intent: IntentType, stress: number, _rawQuery: string): InterrogationReply {
    const key = `vance-${intent}-${stress > 70 ? 'high' : stress > 40 ? 'med' : 'low'}`;

    switch (intent) {
      case 'ACCUSATION_KILL': {
        if (stress > 75) {
          const highAccusations = [
            `(Slamming both hands on the desk, face flushed crimson) HE WAS GOING TO RUIN MY ENTIRE LIFE! Over petty foundation disbursements! Thirty years of loyal medical dedication, keeping his ailing heart beating, and he threatened to have me struck off the register! He wouldn't listen to reason!`,
            `(Gasping for breath, clutching his chest) You think you're so clever, don't you?! You don't know what it was like living under Lord Blackwood's thumb! He treated everyone like disposable pawns! It wasn't supposed to be violent... he was just supposed to sleep!`,
            `(Eyes wild, head shaking vigorously) Alright! Alright, you want the truth?! I didn't want him dead! I needed collateral! But he woke up too early... he started reaching for the alarm cord! I panicked! Are you happy now?!`,
          ];
          return {
            text: this.pickNonRepeating(key, highAccusations),
            stressChange: 25,
            isLie: true,
            mood: 'CRACKING',
          };
        } else if (stress > 45) {
          const medAccusations = [
            `(Straightening his posture rigidly) Mind your tone, Detective! I am a respected medical professional in this county. Accusing me of murder without a signed warrant is borderline slander!`,
            `(Chuckles nervously, adjusting his spectacles) Me? Kill Arthur? That's preposterous. I was the one keeping him alive with targeted cardiovascular therapies! Why destroy my best patient?`,
            `(Jaw tightening) You're clutching at straws because your department couldn't find an intruder on the estate grounds! Don't lay the blame at my clinic door!`,
          ];
          return {
            text: this.pickNonRepeating(key, medAccusations),
            stressChange: 16,
            isLie: true,
            mood: 'HOSTILE',
          };
        } else {
          const lowAccusations = [
            `(Smiling thinly, leaning back calmly) An amusing theory, Detective, but entirely fictional. I was in the guest clinic reviewing cardiograms when the sirens sounded.`,
            `If you spent half as much time examining the broken balcony door as you do harassing Lord Blackwood's physician, you might actually catch the kidnapper.`,
            `I have taken the Hippocratic Oath, officer. I preserve life; I do not extinguish it. Your theatrical accusations don't impress me.`,
          ];
          return {
            text: this.pickNonRepeating(key, lowAccusations),
            stressChange: 10,
            isLie: true,
            mood: 'DEFENSIVE',
          };
        }
      }

      case 'ALIBI_WHEREABOUTS': {
        if (stress > 65) {
          const alibiStressed = [
            `I... I already gave my timeline! I was in the guest clinic... well, mostly in the clinic! I may have stepped into the pantry for a glass of water around 23:30, but that hardly makes me a criminal!`,
            `Why are you dissecting every single minute?! In a sprawling forty-room manor, people move around! I was reviewing medical charts! Nobody watches you when you're reading!`,
          ];
          return {
            text: this.pickNonRepeating(key, alibiStressed),
            stressChange: 14,
            isLie: true,
            mood: 'NERVOUS',
          };
        }
        const alibiNormal = [
          `As I stated to your patrol team: from 22:30 until the emergency sirens triggered at 23:45, I was sequestered in the west-wing guest clinic updating Lord Blackwood's bi-weekly medical dossier.`,
          `I was downstairs in the clinical quarters. Yes, I was alone—charting medication balances does not require a committee. You can check the desk lamp log if you don't believe me.`,
          `My alibi is airtight, Detective. I was preparing his morning dosages. Why would I jeopardize my standing when I had scheduled appointments the next morning?`,
        ];
        return {
          text: this.pickNonRepeating(key, alibiNormal),
          stressChange: 8,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }

      case 'WINE_POISON_DRINK': {
        const wineReplies = [
          `(Throat clearing, fingers fidgeting) Doxylamine tranquilizer in the vintage goblet...? Look, Lord Blackwood suffered from debilitating insomnia. He frequently demanded sedatives mixed into herbal infusions! If he took it with alcohol, that was against my strict medical advice!`,
          `(Frowning defensively) I never poured his wine! Graves is the butler; beverages are the butler's domain! If someone spiked his glass, interrogate whoever handled the decanter!`,
          `(Voice tight) Concentrated sedatives can be ordered by anyone online through grey-market pharmacies. Just because it's a medical compound doesn't mean it originated from my dispensary!`,
        ];
        return {
          text: this.pickNonRepeating(key, wineReplies),
          stressChange: 18,
          isLie: true,
          mood: 'NERVOUS',
        };
      }

      case 'MEDICAL_NOTE_DOSAGE': {
        const noteReplies = [
          `(Rubbing his temple, visibly sweating) The torn note under the paperweight...? I write dozens of pharmacological dosage memos every week! 'Induce temporary paralysis'—I was noting the toxicological limits of muscle relaxants to prevent accidental overdose! It was a protective safeguard, not an attack plan!`,
          `You found my scribbled notes?! That was private medical research! Taking fragments of laboratory notes out of clinical context is irresponsible detective work!`,
        ];
        return {
          text: this.pickNonRepeating(key, noteReplies),
          stressChange: 20,
          isLie: true,
          mood: 'CRACKING',
        };
      }

      case 'MONEY_DEBT_WILL': {
        const moneyReplies = [
          `(Bristling with indignation) My personal financial standing is completely irrelevant! Yes, some offshore biotechnology investments took a downturn—everyone took hits in the recent market contraction! That doesn't mean I abducted my wealthiest benefactor!`,
          `Lord Blackwood paid me a generous annual retainer. Why on earth would I cut off my primary source of revenue? Your financial motive holds no water, Detective!`,
          `(Voice rising) Who told you about my debts?! Was it Evelyn?! That ungrateful girl has been spreading venom ever since she was written out of the will!`,
        ];
        return {
          text: this.pickNonRepeating(key, moneyReplies),
          stressChange: 17,
          isLie: true,
          mood: 'HOSTILE',
        };
      }

      case 'SECRET_PASSAGE_ESCAPE': {
        const passageReplies = [
          `(Eyes widening slightly, swallowing) Secret passage behind the bookcase...? Blackwood Manor is an eighteenth-century estate riddled with architectural eccentricities and old servant corridors. I am a visiting physician, not the estate architect!`,
          `Scratches on the parquet leading to the cliff dock? Perhaps the true intruders used it to spirit him away into a speedboat! If so, shouldn't your coastguard be scanning the water instead of keeping me locked in this interrogation box?!`,
        ];
        return {
          text: this.pickNonRepeating(key, passageReplies),
          stressChange: 19,
          isLie: true,
          mood: 'NERVOUS',
        };
      }

      case 'BOOTPRINTS_SHOES': {
        const bootReplies = [
          `(Looking down at his shoes, then looking up sharply) Size 10 orthopedic shoes? I have a severe lumbar condition that requires corrective footwear, as do millions of middle-aged citizens! Do you intend to arrest everyone who wears supportive soles?!`,
          `Those mud prints on the balcony balustrade could belong to anyone! Construction workers, groundskeepers, or private security! You have no forensic proof they match my specific gait wear!`,
        ];
        return {
          text: this.pickNonRepeating(key, bootReplies),
          stressChange: 16,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }

      case 'BALCONY_LOCK_STAGED': {
        return {
          text: `(Nervously tapping fingers) The balcony lock cut from the inside? That merely proves the culprit was hiding inside the manor grounds before the storm broke. I have nothing to do with locks or burglary tools!`,
          stressChange: 15,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }

      case 'ABOUT_OTHER_SUSPECT': {
        const otherReplies = [
          `If you want a real suspect, interrogate Evelyn Blackwood! She was in the study screaming at her father only two hours before the disappearance! She was cut out of the will in favor of a charity—she had everything to lose!`,
          `Thomas Graves is ninety percent senile. He leaves master keys on the pantry table all the time. Anyone could have picked up the study key and walked straight in!`,
        ];
        return {
          text: this.pickNonRepeating(key, otherReplies),
          stressChange: 6,
          isLie: false,
          mood: 'DEFENSIVE',
        };
      }

      case 'CALLING_OUT_LIE': {
        if (stress > 70) {
          return {
            text: `(Breathing heavily, pulling at tie) Lie?! You think I'm lying?! I've given you thirty years of medical service, saving lives, and you sit there barking accusations! What do you want me to say?! That I wanted this nightmare?!`,
            stressChange: 18,
            isLie: true,
            mood: 'CRACKING',
          };
        }
        return {
          text: `I resent that accusation, Detective. Every word I have spoken is verifiable fact. If you perceive inconsistencies, it is due to the extreme shock of losing a dear friend and patient.`,
          stressChange: 11,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }

      case 'NERVOUS_SWEATING': {
        return {
          text: `(Wiping sweat from his forehead with a handkerchief) Of course I'm sweating! You have me locked in an airless interrogation cell under high-intensity halogen lamps, treating me like a street hoodlum! Anyone would be physically agitated!`,
          stressChange: 14,
          isLie: true,
          mood: 'HOSTILE',
        };
      }

      case 'CONFESS_PRESSURE': {
        if (stress > 70) {
          return {
            text: `(Head in trembling hands, sobbing hoarsely) I... I never meant for anyone to die! The foundation auditors were arriving Monday morning... Lord Blackwood told me he would show no mercy! I just needed time to liquidate my assets and replace the funds!`,
            stressChange: 25,
            isLie: true,
            mood: 'CRACKING',
          };
        }
        return {
          text: `Confess to what?! You have no crime to pin on me, Detective! You are on a fishing expedition hoping I'll crumble under intimidation!`,
          stressChange: 15,
          isLie: true,
          mood: 'HOSTILE',
        };
      }

      case 'THREAT_PRISON': {
        return {
          text: `(Snorting with nervous disdain) Prison?! On what charges?! You cannot hold a reputable physician without filing an official indictment, and no prosecutor will sign off on this circus!`,
          stressChange: 16,
          isLie: true,
          mood: 'HOSTILE',
        };
      }

      case 'RELATIONSHIP_VICTIM': {
        return {
          text: `Arthur and I were confidants for over twenty years. I monitored his cardiac arrhythmias and guided him through his bereavement. We were colleagues, friends, and intellectual equals.`,
          stressChange: 8,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }

      case 'TIMELINE_HOURS': {
        return {
          text: `The timeline is crystal clear: I administered his 22:30 mild tranquilizer infusion, returned downstairs to the clinic by 22:45, and remained there until the estate alarm activated at 23:45.`,
          stressChange: 9,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }

      default: {
        const genericDrVance = [
          `Detective, I have answered your questions with patience. If you do not have formal charges to bring, you cannot hold me indefinitely.`,
          `You're grasping at conversational shadows. Focus on the physical perimeter and the missing boat at the lower dock.`,
          `Lord Blackwood's health was fragile. If he was subjected to cold rain on that cliffside, every minute we waste here endangers his life!`,
          `I have provided my statement. I suggest you consult the physical evidence before jumping to reckless assumptions.`,
          `Ask yourself who actually had the most to lose from Lord Blackwood changing his testamentary documents. It certainly wasn't me.`,
        ];
        return {
          text: this.pickNonRepeating('vance-generic', genericDrVance),
          stressChange: 8,
          isLie: false,
          mood: 'DEFENSIVE',
        };
      }
    }
  }

  // ================= EVELYN BLACKWOOD (INNOCENT DAUGHTER) =================
  private getEvelynResponse(intent: IntentType, _stress: number, _rawQuery: string): InterrogationReply {
    const key = `evelyn-${intent}`;

    switch (intent) {
      case 'ACCUSATION_KILL': {
        const accReplies = [
          `(Eyes flashing with genuine fury) Are you out of your mind?! He was my father! Did we fight? Absolutely. He was stubborn, controlling, and emotionally distant. But kill him?! You have no right to throw murder accusations in my face!`,
          `(Scoffing bitterly, crossing arms) Oh, brilliant detective work! Blame the disinherited daughter! If I wanted his money, murdering him right after he rewrote the will would make me the prime suspect—I'm an artist, not an idiot!`,
          `(Voice trembling slightly with grief and anger) Look into my eyes, Detective. I loved him, despite everything. Whoever did this to him deserves to rot, and you're wasting time interrogating me while the real snake is laughing!`,
        ];
        return {
          text: this.pickNonRepeating(key, accReplies),
          stressChange: 12,
          isLie: false,
          mood: 'HOSTILE',
        };
      }

      case 'ALIBI_WHEREABOUTS': {
        const alibiReplies = [
          `I was on the rear stone terrace smoking a cigarette from 23:25 until almost 23:50. Graves the butler saw me through the pantry window when he was fetching the silver service. Ask him!`,
          `I needed fresh air after that miserable dinner. I sat by the fountain listening to the storm. It was freezing, but it was better than being inside that suffocating manor.`,
        ];
        return {
          text: this.pickNonRepeating(key, alibiReplies),
          stressChange: -4,
          isLie: false,
          mood: 'CALM',
        };
      }

      case 'MONEY_DEBT_WILL': {
        const willReplies = [
          `Yes, he cut me out of the main estate will two months ago. He wanted to leave seventy percent of his fortune to a marine conservation trust. Was I furious? Yes! I screamed at him! But I didn't stage a kidnapping over it!`,
          `Money comes and goes, Detective. I have my own gallery exhibitions in London. I didn't need his millions to survive, and I certainly didn't need blood on my conscience.`,
        ];
        return {
          text: this.pickNonRepeating(key, willReplies),
          stressChange: 6,
          isLie: false,
          mood: 'DEFENSIVE',
        };
      }

      case 'ABOUT_OTHER_SUSPECT': {
        const suspectLeads = [
          `(Leaning forward eagerly) If you want to know who is behind this, look at Dr. Vance! At 23:20, I saw him hurrying through the side gallery carrying a heavy black duffel bag toward the boathouse trail! He looked like a ghost!`,
          `Dr. Vance has been bleeding my father's foundation dry for over a year! Two days ago, I overheard Father shouting in the study: 'You're a thief, Julian, and I'll see you in prison!' Go check the bank correspondence!`,
          `Graves is harmless—he's been with the family since before I was born. But Dr. Vance had complete control over father's medication and health records. That man is pure venom under a doctor's coat.`,
        ];
        return {
          text: this.pickNonRepeating(key, suspectLeads),
          stressChange: -6,
          isLie: false,
          mood: 'CALM',
        };
      }

      case 'WINE_POISON_DRINK': {
        return {
          text: `I despise dry vintage red wine; I only drink gin. Dr. Vance was the only one allowed to touch Father's evening drinks because he insisted on mixing his herbal tinctures personally. Ask Vance what was in that glass!`,
          stressChange: 4,
          isLie: false,
          mood: 'CALM',
        };
      }

      case 'CALLING_OUT_LIE': {
        return {
          text: `I have no reason to lie to you! I hated the way he treated me, but I would never hurt him! Look at my phone records, look at the terrace security cameras!`,
          stressChange: 6,
          isLie: false,
          mood: 'DEFENSIVE',
        };
      }

      default: {
        const genericEvelyn = [
          `I want to find my father just as badly as you do. Stop treating me like a criminal and go search the boathouse!`,
          `You're barking up the wrong tree, Detective. Look closely at who stood to lose their entire medical career if Father exposed them.`,
          `I have told you everything I saw. I have nothing to hide.`,
        ];
        return {
          text: this.pickNonRepeating('evelyn-gen', genericEvelyn),
          stressChange: 5,
          isLie: false,
          mood: 'CALM',
        };
      }
    }
  }

  // ================= THOMAS GRAVES (INNOCENT BUTLER) =================
  private getGravesResponse(intent: IntentType, _stress: number, _rawQuery: string): InterrogationReply {
    const key = `graves-${intent}`;

    switch (intent) {
      case 'ACCUSATION_KILL': {
        return {
          text: `(Placing hand over heart, bowing slightly) Detective, I have served the Blackwood lineage faithfully for thirty-two years. I held his Lordship when he took his first steps as an infant. To suggest I would commit violence against him is an unspeakable dishonor.`,
          stressChange: 10,
          isLie: false,
          mood: 'DEFENSIVE',
        };
      }

      case 'ALIBI_WHEREABOUTS': {
        return {
          text: `At 23:15, his Lordship rang the study bell. I brought him fresh decanter water. At 23:25, I was inspecting the front perimeter gates with our private security guards due to the heavy lightning storm. The guards will vouch for my presence throughout.`,
          stressChange: -5,
          isLie: false,
          mood: 'CALM',
        };
      }

      case 'ABOUT_OTHER_SUSPECT': {
        const butlerIntel = [
          `If I may speak candidly without breaching household etiquette... His Lordship had an intense altercation with Dr. Vance yesterday afternoon regarding irregular withdrawals from the Blackwood Memorial Medical Fund.`,
          `Dr. Vance explicitly requested that no staff enter the study corridor after 23:00, claiming his Lordship required total sensory silence for a new neurological treatment. In hindsight, sir, that struck me as deeply irregular.`,
          `Miss Evelyn was indeed agitated earlier in the week, but she was seated on the terrace when the alarm triggered. I observed her through the pantry windows myself.`,
        ];
        return {
          text: this.pickNonRepeating(key, butlerIntel),
          stressChange: -4,
          isLie: false,
          mood: 'CALM',
        };
      }

      case 'WINE_POISON_DRINK': {
        return {
          text: `I decanted the Chateau Margaux at 20:00, sir. However, Dr. Vance took the goblet into his clinic room at 23:05, stating he needed to dissolve his Lordship's evening sedative. I did not handle the glass thereafter.`,
          stressChange: 6,
          isLie: false,
          mood: 'CALM',
        };
      }

      default: {
        return {
          text: `I remain at your full disposal, Detective. Anything that assists in recovering his Lordship safely shall be answered with complete fidelity.`,
          stressChange: 4,
          isLie: false,
          mood: 'CALM',
        };
      }
    }
  }

  // ================= DYNAMIC SUSPECT GENERATOR (FOR ANY CUSTOM CASE) =================
  private getDynamicSuspectResponse(
    intent: IntentType,
    suspect: Suspect,
    caseData: CaseData,
    stress: number,
    _rawQuery: string
  ): InterrogationReply {
    const isCulprit = suspect.motive?.toLowerCase().includes('kill') || stress > 80;
    const role = suspect.role;

    if (intent === 'ACCUSATION_KILL') {
      if (stress > 70) {
        return {
          text: `(Breathing heavily, eyes darting) You think you can pin this on me?! You don't know what happened in that room! You're making a massive mistake!`,
          stressChange: 20,
          isLie: true,
          mood: 'CRACKING',
        };
      }
      return {
        text: `Accusing me of murder?! I am the ${role}! I had zero reason to harm anyone. You need to check your facts before making wild claims!`,
        stressChange: 12,
        isLie: isCulprit,
        mood: 'DEFENSIVE',
      };
    }

    if (intent === 'ALIBI_WHEREABOUTS') {
      return {
        text: `${suspect.alibi} I've said it already. Why aren't your investigators verifying the camera feeds instead of badgering me?`,
        stressChange: 8,
        isLie: isCulprit,
        mood: 'DEFENSIVE',
      };
    }

    if (intent === 'MOTIVE_WHY' || intent === 'MONEY_DEBT_WILL') {
      return {
        text: `${suspect.motive ? `Look, it's true: ${suspect.motive}. But that doesn't make me a killer! People have disagreements every day without resorting to murder!` : 'I had no financial or personal grudge against anyone here.'}`,
        stressChange: 14,
        isLie: isCulprit,
        mood: 'HOSTILE',
      };
    }

    if (intent === 'CALLING_OUT_LIE') {
      return {
        text: `I'm not lying to you! If my story sounds fragmented, it's because I'm terrified and exhausted in this interrogation room!`,
        stressChange: 15,
        isLie: isCulprit,
        mood: 'NERVOUS',
      };
    }

    // Dynamic contextual fallback with anti-repetition
    const dynamicFallbacks = [
      `You're asking questions in circles, Detective. Focus on what actually happened at ${caseData.timeOfCrime}.`,
      `I've answered honestly. If you have real physical evidence tying me to ${caseData.location}, produce it.`,
      `Think what you want. The forensic truth will exonerate me and reveal the real perpetrator.`,
      `I understand you have a job to do, but harassing an innocent ${role} won't close this case.`,
      `Look closely at the timeline. There were other people in ${caseData.location} who had much more to hide than I do.`,
    ];

    return {
      text: this.pickNonRepeating(`gen-${suspect.id}`, dynamicFallbacks),
      stressChange: 6,
      isLie: isCulprit,
      mood: 'DEFENSIVE',
    };
  }
}

export const dialogueManager = new SuspectDialogueManager();
