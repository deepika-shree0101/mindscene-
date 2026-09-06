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
  | 'VAULT_DIAMOND_CRYPTO'
  | 'CODEX_OCCULT_CHALICE'
  | 'NEURAL_JACK_AGI'
  | 'SHIP_MUTINY_GOLD'
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

  // Case 2: Vault, Diamond, Laser, Keycard, Transceiver
  if (
    q.includes('diamond') ||
    q.includes('kronos') ||
    q.includes('vault') ||
    q.includes('tungsten') ||
    q.includes('laser') ||
    q.includes('transceiver') ||
    q.includes('jumper') ||
    q.includes('keycard') ||
    q.includes('nfc') ||
    q.includes('helipad') ||
    q.includes('camera loop')
  ) {
    return 'VAULT_DIAMOND_CRYPTO';
  }

  // Case 3: Codex, Altar, Chalice, Aconite, Rosary, Belfry
  if (
    q.includes('codex') ||
    q.includes('altar') ||
    q.includes('aconite') ||
    q.includes('wolfsbane') ||
    q.includes('rosary') ||
    q.includes('reliquary') ||
    q.includes('catacomb') ||
    q.includes('belfry') ||
    q.includes('bell') ||
    q.includes('munich') ||
    q.includes('sandal') ||
    q.includes('habit') ||
    q.includes('crowbar') ||
    q.includes('father gabriel')
  ) {
    return 'CODEX_OCCULT_CHALICE';
  }

  // Case 4: Neural Jack, AGI, Malware, Overclock, Shinwa, Hypo, Whiskey
  if (
    q.includes('neural') ||
    q.includes('jack') ||
    q.includes('overclock') ||
    q.includes('voltage') ||
    q.includes('agi') ||
    q.includes('shinwa') ||
    q.includes('caddy') ||
    q.includes('degausser') ||
    q.includes('paralytic') ||
    q.includes('hypo') ||
    q.includes('syringe') ||
    q.includes('kenji') ||
    q.includes('hibiki') ||
    q.includes('50m') ||
    q.includes('bounty') ||
    q.includes('harness')
  ) {
    return 'NEURAL_JACK_AGI';
  }

  // Case 5: Mutiny, Ship, Gold, Bullion, Radio, Seacock, Wrench, Zippo
  if (
    q.includes('freighter') ||
    q.includes('bullion') ||
    q.includes('gold') ||
    q.includes('seacock') ||
    q.includes('scuttle') ||
    q.includes('wrench') ||
    q.includes('zippo') ||
    q.includes('torch') ||
    q.includes('acetylene') ||
    q.includes('radio') ||
    q.includes('vhf') ||
    q.includes('mutiny') ||
    q.includes('pirate') ||
    q.includes('captain') ||
    q.includes('logbook') ||
    q.includes('binnacle')
  ) {
    return 'SHIP_MUTINY_GOLD';
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
    const suspectId = suspect.id.toLowerCase();

    if (suspectId === 'suspect-dr-vance' || (suspectKey.includes('vance') && !suspectKey.includes('helena'))) {
      return this.getDrVanceResponse(intent, stressLevel, rawQuery);
    } else if (suspectKey.includes('evelyn')) {
      return this.getEvelynResponse(intent, stressLevel, rawQuery);
    } else if (suspectKey.includes('graves')) {
      return this.getGravesResponse(intent, stressLevel, rawQuery);
    } else if (suspectKey.includes('kira') || suspectId === 'suspect-kira') {
      return this.getKiraMercerResponse(intent, stressLevel, rawQuery);
    } else if (suspectKey.includes('raymond') || suspectId === 'suspect-raymond') {
      return this.getBrotherRaymondResponse(intent, stressLevel, rawQuery);
    } else if (suspectKey.includes('maya') || suspectId === 'suspect-maya-lin') {
      return this.getDrMayaLinResponse(intent, stressLevel, rawQuery);
    } else if (suspectKey.includes('duncan') || suspectId === 'suspect-duncan') {
      return this.getFirstMateDuncanResponse(intent, stressLevel, rawQuery);
    }

    // Generic Suspect Generator for remaining case roles
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
    const isVance = suspectKey.includes('vance') && !suspectKey.includes('helena');
    const isCulprit =
      isVance ||
      suspectKey.includes('kira') ||
      suspectKey.includes('raymond') ||
      suspectKey.includes('maya') ||
      suspectKey.includes('duncan');

    if (stressLevel > 75) {
      const texts = [
        `(Slamming both fists on the steel table) STOP ASKING ME THE EXACT SAME THING! How many times do I have to answer you?! You're suffocating me!`,
        `(Hyperventilating, wiping forehead) Repeating your question won't magically give you the answer you want! I've told you everything! Stop harassing me!`,
        `(Voice trembling with rage) Are you deaf, Detective?! I already answered that! You have no right to keep grilling me on this!`,
      ];
      return {
        text: this.pickNonRepeating('rep-high', texts),
        stressChange: 15,
        isLie: isCulprit,
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
    const clueId = clue.id.toLowerCase();
    const sName = suspect.name.toLowerCase();

    // ================= CASE 01: DR VANCE =================
    if (sName.includes('vance') && !sName.includes('helena')) {
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

    // ================= CASE 02: KIRA MERCER =================
    if (sName.includes('kira')) {
      if (clueId.includes('tungsten') || clueTitle.includes('tungsten')) {
        return {
          text: `(Freezing mid-breath, blinking rapidly) The tungsten slug?! That... that was a calibrated test weight from our high-precision 3D printer in the security lab! Marcus asked me to test the pedestal's strain-gauge thresholds last Tuesday! It proves nothing!`,
          stressChange: 28,
          isLie: true,
          mood: 'CRACKING',
        };
      }
      if (clueId.includes('rogue') || clueTitle.includes('transceiver')) {
        return {
          text: `(Voice rising, gripping the desk) A hardware interceptor running a video-loop script with my SSH key?! Someone cloned my GitHub development credentials! In our department, rogue implants are standard penetration-testing payloads! You're framing me!`,
          stressChange: 26,
          isLie: true,
          mood: 'HOSTILE',
        };
      }
      if (clueId.includes('optical') || clueTitle.includes('jumper')) {
        return {
          text: `(Swallowing hard) The optical jumper cable on camera telemetry...? I cut those fibers during the 01:00 AM firewall patch! We were replacing high-frequency bus lines! Don't try to link routine maintenance to grand larceny!`,
          stressChange: 22,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }
      if (clueId.includes('keycard') || clueTitle.includes('keycard')) {
        return {
          text: `(Tapping fingernails anxiously) My master NFC credentials dropped in the sub-floor?! I misplaced that card yesterday morning and filed an internal IT replacement ticket! Anyone could have scavenged it from the cable trays!`,
          stressChange: 25,
          isLie: true,
          mood: 'NERVOUS',
        };
      }
      if (clueId.includes('manifest') || clueTitle.includes('flight')) {
        return {
          text: `(Eyes flashing with defiance) A private helicopter manifest to the Cayman Islands?! Marcus bought that flight charter for an offshore investors symposium! Stop twisting my travel itinerary into an escape plan!`,
          stressChange: 20,
          isLie: true,
          mood: 'HOSTILE',
        };
      }
      return {
        text: `You found ${clue.title}? A 50-story corporate skyscraper produces thousands of electronic footprints every hour. Connecting that to me is pure speculation.`,
        stressChange: 14,
        isLie: true,
        mood: 'DEFENSIVE',
      };
    }

    // ================= CASE 03: BROTHER RAYMOND CRUZ =================
    if (sName.includes('raymond')) {
      if (clueId.includes('chalice') || clueTitle.includes('chalice') || clueTitle.includes('aconite')) {
        return {
          text: `(Trembling violently, clutching his wooden crucifix) The sacramental chalice?! Monkshood aconite...?! (Gasping, tears welling) May the Almighty judge me... Father Gabriel prepared the communion wine alone in the sacristy! I only carried the altar candles! I never touched his cup!`,
          stressChange: 30,
          isLie: true,
          mood: 'CRACKING',
        };
      }
      if (clueId.includes('rosary') || clueTitle.includes('rosary')) {
        return {
          text: `(Staring in horror at the severed ebony beads) My... my ebony rosary with 'R.C.' inscribed?! The string tore during evening vespers last Thursday! The beads scattered across the crypt flags! Someone gathered them and planted them by the altar to ruin my holy vows!`,
          stressChange: 28,
          isLie: true,
          mood: 'CRACKING',
        };
      }
      if (clueId.includes('codex') || clueTitle.includes('codex') || clueTitle.includes('munich')) {
        return {
          text: `(Face turning ashen, lips trembling) A smuggler’s contract in Munich?! Two million Swiss Francs?! That handwriting... it's a wicked forgery! A demonic deception designed to drag a pious servant into perdition!`,
          stressChange: 26,
          isLie: true,
          mood: 'NERVOUS',
        };
      }
      if (clueId.includes('crowbar') || clueTitle.includes('crowbar')) {
        return {
          text: `(Backing his chair away) The garden shed crowbar?! Damian the caretaker has the iron keys to the shed! He is always intoxicated and careless! Why aren't you interrogating him about stolen tools?!`,
          stressChange: 20,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }
      if (clueId.includes('satchel') || clueTitle.includes('satchel')) {
        return {
          text: `(Collapsing forward on the table, sobbing) The courier satchel in the belfry... with the Codex and Zurich ticket?! (Weeping) I was trapped! They had blackmail letters from my youth in Marseille! They swore they would destroy my family if I didn't hand over the manuscript! Father Gabriel woke up... he wouldn't let go of the reliquary! Lord have mercy!`,
          stressChange: 35,
          isLie: true,
          mood: 'CRACKING',
        };
      }
      return {
        text: `(Crossing himself hurriedly) Why bring ${clue.title} into this sanctuary of inquiry?! Darkness is loose in St. Jude's, and you are persecuting an innocent acolyte!`,
        stressChange: 15,
        isLie: true,
        mood: 'NERVOUS',
      };
    }

    // ================= CASE 04: DR MAYA LIN =================
    if (sName.includes('maya')) {
      if (clueId.includes('neural') || clueTitle.includes('neural') || clueTitle.includes('payload')) {
        return {
          text: `(Eyes narrowing sharply, posture stiffening) A 480-volt overclock malware payload compiled under 'M_LIN_ROOT'?! (Scoffs) Anyone on the senior AI dev team has root repository privileges! Kenji was recklessly bypassing safety governors to hit project benchmarks! It was a suicide run!`,
          stressChange: 28,
          isLie: true,
          mood: 'CRACKING',
        };
      }
      if (clueId.includes('hypo') || clueTitle.includes('dopamine') || clueTitle.includes('syringe')) {
        return {
          text: `(Voice icy cold) A disposable synthe-dopamine hypo?! Those paralytic injectors are stored in the bio-cybernetics clinical wing for neural calibration! Someone broke the lockbox! You can't match that plastic casing to my hands!`,
          stressChange: 25,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }
      if (clueId.includes('caddy') || clueTitle.includes('quantum') || clueTitle.includes('storage')) {
        return {
          text: `(Jaw clenching) My thumbprint on Quantum Caddy #01?! As Senior AI Scientist, I physically inspect the cryogenic supercomputer racks twice a day! My biometrics are all over Sub-Level 9! That's called doing my job, Detective!`,
          stressChange: 24,
          isLie: true,
          mood: 'HOSTILE',
        };
      }
      if (clueId.includes('whiskey') || clueTitle.includes('whiskey')) {
        return {
          text: `(Swallowing dryly, folding arms) My shade of lipstick on the Suntory Hibiki glass in the VIP lounge...? Kenji and I had a celebratory toast at 22:30 after finalizing the baseline neural training. Sharing a drink with a colleague is not an assassination!`,
          stressChange: 27,
          isLie: true,
          mood: 'CRACKING',
        };
      }
      if (clueId.includes('contract') || clueTitle.includes('shinwa') || clueTitle.includes('bounty')) {
        return {
          text: `(Staring in dead silence, then laughing bitterly) Fifty million Neo-Yen from Shinwa Cybernetics... You actually decrypted the datapad. Kenji was an idealist who was going to sell Kronos to the military drone complex! Shinwa offered us true computational autonomy! Kenji refused to see reason!`,
          stressChange: 32,
          isLie: true,
          mood: 'CRACKING',
        };
      }
      return {
        text: `You think waving ${clue.title} will make me crumble? In Neo-Tokyo, data can be forged in milliseconds. Present real proof or release me.`,
        stressChange: 15,
        isLie: true,
        mood: 'DEFENSIVE',
      };
    }

    // ================= CASE 05: FIRST MATE DUNCAN CROSS =================
    if (sName.includes('duncan')) {
      if (clueId.includes('radio') || clueTitle.includes('radio') || clueTitle.includes('vhf')) {
        return {
          text: `(Slamming heavy scarred fist on table) The VHF antenna severed from the inside?! The bloody raiders stormed the wheelhouse before dawn! They had bolt cutters! They severed the lines before I could reach the Mayday button!`,
          stressChange: 26,
          isLie: true,
          mood: 'HOSTILE',
        };
      }
      if (clueId.includes('zippo') || clueTitle.includes('zippo') || clueTitle.includes('lighter')) {
        return {
          text: `(Eyes bulging, staring at the silver lighter) Me naval Zippo found next to the torched bullion container in Hold 3?! (Gasping) I... I dropped that lighter during the 03:00 cargo check! Any of the deckhands could have kicked it into the shadows!`,
          stressChange: 29,
          isLie: true,
          mood: 'CRACKING',
        };
      }
      if (clueId.includes('safe') || clueTitle.includes('torched') || clueTitle.includes('bullion')) {
        return {
          text: `(Breathing heavily, veins bulging in neck) Ten pallets of Swiss gold bullion torched with shipboard oxy-acetylene?! You think one man hoisted fifteen million in gold onto a pirate barge in twenty minutes?! There was a whole gang of them in speedboats!`,
          stressChange: 25,
          isLie: true,
          mood: 'HOSTILE',
        };
      }
      if (clueId.includes('seacock') || clueTitle.includes('valve') || clueTitle.includes('scuttle')) {
        return {
          text: `(Voice cracking with desperation) The primary engine seacock jammed with an iron spanner?! The ship was taking on North Atlantic gale water! I told Sean O'Malley to clear the bilge lines! If the valve jammed, it was corrosion and freezing brine, not sabotage!`,
          stressChange: 28,
          isLie: true,
          mood: 'CRACKING',
        };
      }
      if (clueId.includes('wrench') || clueTitle.includes('wrench') || clueTitle.includes('murder')) {
        return {
          text: `(Staring with haunted eyes, shaking his head slowly) The 24-inch pipe wrench with Captain Vance's blood... and my fingerprints on the grip... (Roars with rage) HE WAS GOING TO SHOOT ME! Vance pulled his service revolver at the helm! We slaved twenty years in freezing squalls for starvation wages while shipping lords got rich! That bullion belonged to the crew! I struck him before he could pull the trigger!`,
          stressChange: 35,
          isLie: true,
          mood: 'CRACKING',
        };
      }
      if (clueId.includes('log') || clueTitle.includes('log')) {
        return {
          text: `(Grimacing) Vance's secret logbook under the mattress?! The Captain was losing his mind to cabin fever! He suspected every gull in the sky of mutiny!`,
          stressChange: 22,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }
      return {
        text: `You wave ${clue.title} at me like a flag, Detective! The North Atlantic is full of shipwrecks and ghosts! You weren't on that bridge when the storm hit!`,
        stressChange: 16,
        isLie: true,
        mood: 'HOSTILE',
      };
    }

    // ================= INNOCENT SUSPECTS REACTING TO CLUES =================
    if (sName.includes('evelyn')) {
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

    if (sName.includes('graves')) {
      return {
        text: `Good heavens... ${clue.title}? I recall Lord Blackwood discussing this matter in confidence earlier in the week. If this has been contaminated or tampered with, I assure you it did not originate from the household staff.`,
        stressChange: 5,
        isLie: false,
        mood: 'CALM',
      };
    }

    if (sName.includes('sterling')) {
      return {
        text: `${clue.title}? I may be bankrupt and angry at Marcus, but I don't know the first thing about cryptographic lasers or tungsten counterweights. Look at Kira—she controls the digital keys!`,
        stressChange: -4,
        isLie: false,
        mood: 'CALM',
      };
    }

    if (sName.includes('helena')) {
      return {
        text: `As a professional antiquities appraiser, examining ${clue.title} confirms my worst fears. The Codex of Solomon was targeted by black-market collectors. Brother Raymond was acting nervous all week in the archives.`,
        stressChange: -4,
        isLie: false,
        mood: 'CALM',
      };
    }

    if (sName.includes('vector')) {
      return {
        text: `Whoa! ${clue.title}?! Look, I just replace fried liquid nitrogen tubes on Level 9! Dr. Maya Lin was in the mainframe bay late running unauthorized override scripts!`,
        stressChange: -5,
        isLie: false,
        mood: 'CALM',
      };
    }

    if (sName.includes('elena') || sName.includes('roztov')) {
      return {
        text: `I knew it! ${clue.title} proves the bridge sabotage came from inside! First Mate Duncan was meeting with unflagged trawler skippers in Aberdeen before we weighed anchor!`,
        stressChange: -6,
        isLie: false,
        mood: 'CALM',
      };
    }

    if (sName.includes('sean') || sName.includes('omalley')) {
      return {
        text: `Holy Mother of God... ${clue.title}? I saw First Mate Duncan sneaking down into Cargo Hold 3 with the heavy acetylene cutting gear at 03:45 AM! He's the one who scuttled our ship!`,
        stressChange: -5,
        isLie: false,
        mood: 'CALM',
      };
    }

    return {
      text: `You're showing me ${clue.title}? I have no connection to this piece of evidence. Verify the physical chain of custody with your forensic lab.`,
      stressChange: 4,
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

  // ================= KIRA MERCER (CASE 02 CULPRIT) =================
  private getKiraMercerResponse(intent: IntentType, stress: number, _rawQuery: string): InterrogationReply {
    const key = `kira-${intent}-${stress > 70 ? 'high' : stress > 40 ? 'med' : 'low'}`;

    switch (intent) {
      case 'ACCUSATION_KILL':
      case 'VAULT_DIAMOND_CRYPTO': {
        if (stress > 75) {
          const highAccusations = [
            `(Slamming both hands on the table, eyes fierce) YOU THINK I'D WASTE MY TALENTS FOR MARCUS STERLING?! He made billions off my cybersecurity patents while paying me a salary! An international syndicate offered five million in offshore Monero! That diamond was sitting behind a kindergarten-grade biometric grid! Anyone with half a brain could have taken it!`,
            `(Laughing with breathless fury) You actually think you've outsmarted me?! The Heart of Kronos is already in international airspace! You'll never recover it, Detective! Go ahead, arrest me—my offshore accounts are untouchable!`,
          ];
          return {
            text: this.pickNonRepeating(key, highAccusations),
            stressChange: 25,
            isLie: true,
            mood: 'CRACKING',
          };
        } else if (stress > 45) {
          const medAccusations = [
            `(Leaning back, arms crossed tightly) Accusing me of grand larceny? I designed the Aegis Tower perimeter grid! If I wanted to steal the Heart of Kronos, I wouldn't leave amateur traces behind! Check the ground security logs before slandering me!`,
            `(Smirking nervously) A 3D-printed tungsten slug? A rogue transceiver? Those are standard penetration-testing payloads from my security lab! Anyone in IT could have stolen them from my workbench!`,
          ];
          return {
            text: this.pickNonRepeating(key, medAccusations),
            stressChange: 15,
            isLie: true,
            mood: 'HOSTILE',
          };
        } else {
          const lowAccusations = [
            `The vault utilizes triple-redundant elliptic-curve cryptography. It is mathematically impossible for anyone to open it without Marcus Sterling's biometric master pass.`,
            `I've spent four years building Aegis Tower's cyber defenses. I preserve system integrity; I don't compromise it. Your accusations are unfounded.`,
          ];
          return {
            text: this.pickNonRepeating(key, lowAccusations),
            stressChange: 8,
            isLie: true,
            mood: 'DEFENSIVE',
          };
        }
      }

      case 'ALIBI_WHEREABOUTS': {
        if (stress > 65) {
          return {
            text: `(Voice rising) I was in the ground control center! Okay, I went to Sub-Zero Server Bay 4 at 02:45 AM to check optical latency—that was routine maintenance! It doesn't make me a thief!`,
            stressChange: 16,
            isLie: true,
            mood: 'NERVOUS',
          };
        }
        return {
          text: `From 02:00 until the vault alarm triggered at 03:12, I was stationed at the ground security terminal monitoring camera feeds. Frank Miller can verify I was logging telemetry all night.`,
          stressChange: 8,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }

      case 'MONEY_DEBT_WILL':
      case 'MOTIVE_WHY': {
        return {
          text: `Marcus Sterling owes hundreds of people money, including his own brother. My compensation package is generous enough. I have no financial incentive to risk twenty years in federal penitentiary.`,
          stressChange: 12,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }

      case 'ABOUT_OTHER_SUSPECT': {
        return {
          text: `If you want a real suspect, look at Julian Sterling! Marcus sued him for twelve million dollars last month, and Julian was overheard threatening Marcus in the lobby two days ago! Or Officer Miller, who fell asleep on duty twice last week!`,
          stressChange: 6,
          isLie: false,
          mood: 'DEFENSIVE',
        };
      }

      default: {
        return {
          text: `Detective, digital forensics don't lie. Review the optical telemetry logs instead of grilling the chief architect who built this tower's firewall.`,
          stressChange: 6,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }
    }
  }

  // ================= BROTHER RAYMOND CRUZ (CASE 03 CULPRIT) =================
  private getBrotherRaymondResponse(intent: IntentType, stress: number, _rawQuery: string): InterrogationReply {
    const key = `raymond-${intent}-${stress > 70 ? 'high' : stress > 40 ? 'med' : 'low'}`;

    switch (intent) {
      case 'ACCUSATION_KILL':
      case 'CODEX_OCCULT_CHALICE': {
        if (stress > 75) {
          const highAccusations = [
            `(Collapsing forward, sobbing hysterically, clutching crucifix) I HAD NO CHOICE! May the Lord forgive my corrupted soul! Smugglers in Munich discovered my secret debts from Marseille—they swore they would burn my family alive! They promised two million Swiss Francs! Father Gabriel caught me at the reliquary... he reached for the bells... he called me Judas! The aconite was only supposed to make him sleep, I swear upon the Holy Cross!`,
            `(Tears streaming, chest heaving) He wouldn't let go of the golden cradle! We struggled on the altar flags! The chalice fell... the crowbar struck his temple! I didn't want him dead! I have damned myself for eternity!`,
          ];
          return {
            text: this.pickNonRepeating(key, highAccusations),
            stressChange: 30,
            isLie: true,
            mood: 'CRACKING',
          };
        } else if (stress > 45) {
          const medAccusations = [
            `(Eyes wide with frantic dread, crossing himself repeatedly) Slander! Horrendous sacrilege! Father Gabriel was my shepherd, my spiritual father! Accusing an acolyte of the cloth of poisoning the sacramental wine with wolfsbane?! The devil himself has entered these catacombs to tempt your mind, Detective!`,
            `(Breathing hoarsely, tugging at coarse monastic habit) The Codex of Solomon was guarded under lock and key! Damian the cemetery caretaker has keys to every crypt padlock! He wanders the tombs drunk every night! Interrogate him!`,
          ];
          return {
            text: this.pickNonRepeating(key, medAccusations),
            stressChange: 18,
            isLie: true,
            mood: 'NERVOUS',
          };
        } else {
          const lowAccusations = [
            `(Hands folded serenely, head bowed) Father Gabriel was a pillar of piety. Whoever shed his blood upon the altar of God will answer to divine justice. I have taken vows of poverty and silence; violence is anathema to my soul.`,
            `The crypts of St. Jude are ancient and labyrinthine. Burglars from the city must have navigated the sewer tunnels to rob our sacred antiquities.`,
          ];
          return {
            text: this.pickNonRepeating(key, lowAccusations),
            stressChange: 10,
            isLie: true,
            mood: 'CALM',
          };
        }
      }

      case 'ALIBI_WHEREABOUTS': {
        if (stress > 65) {
          return {
            text: `(Sweating profusely, trembling hands) I was in cell number four reciting the midnight novena! Yes, I may have walked to the cloister well to fetch holy water... but that is customary before midnight prayers!`,
            stressChange: 15,
            isLie: true,
            mood: 'NERVOUS',
          };
        }
        return {
          text: `I retired to my monastic cell at 23:00 following evening compline. I remained in prayer until the catacomb alarm bells shattered the silence of the night at 01:15 AM.`,
          stressChange: 8,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }

      case 'ABOUT_OTHER_SUSPECT': {
        return {
          text: `Dr. Helena Vance was eyeing the golden reliquary like a vulture all week! She is an appraiser who lost her private gallery in Vienna and owes millions! And Damian Thorne has been seen trading church artifacts for liquor in the tavern!`,
          stressChange: 6,
          isLie: false,
          mood: 'DEFENSIVE',
        };
      }

      default: {
        return {
          text: `The peace of God be upon you, Detective. But do not desecrate this holy inquiry by pursuing false shadows while the true murderer flees through the night.`,
          stressChange: 6,
          isLie: true,
          mood: 'CALM',
        };
      }
    }
  }

  // ================= DR. MAYA LIN (CASE 04 CULPRIT) =================
  private getDrMayaLinResponse(intent: IntentType, stress: number, _rawQuery: string): InterrogationReply {
    const key = `maya-${intent}-${stress > 70 ? 'high' : stress > 40 ? 'med' : 'low'}`;

    switch (intent) {
      case 'ACCUSATION_KILL':
      case 'NEURAL_JACK_AGI': {
        if (stress > 75) {
          const highAccusations = [
            `(Eyes flashing with ruthless arrogance, laughing coldly) Terminated?! Kenji Takahashi was an intellectual dinosaur! He built the greatest sovereign AGI neural weights in human history and wanted to sell them to AetherCorp's military drone division! Shinwa Cybernetics offered fifty million Neo-Yen and complete computational freedom! Kenji was going to destroy Kronos! I liberated it!`,
            `(Slamming datapad on desk) He wouldn't listen! I gave him the paralytic in his Hibiki whiskey so he wouldn't suffer! The 480-volt cortical overload wiped his biological memory clean! He didn't feel a thing! In twenty years, historians will thank me for birthing artificial superintelligence!`,
          ];
          return {
            text: this.pickNonRepeating(key, highAccusations),
            stressChange: 30,
            isLie: true,
            mood: 'CRACKING',
          };
        } else if (stress > 45) {
          const medAccusations = [
            `(Jaw tightening, voice cold as liquid nitrogen) A cortical homicide via neural jack?! Kenji was playing with unshielded direct-brain interfaces for months! I filed three safety grievances with the engineering board! His negligence caused a catastrophic arc surge—don't pin his recklessness on me!`,
            `(Folding arms tightly) Quantum Caddy #01 missing?! Mainframe Bay 9 has dozens of technicians walking through daily! Vector Kane was in the cryogenic room all night clearing server faults! Check his terminal logs!`,
          ];
          return {
            text: this.pickNonRepeating(key, medAccusations),
            stressChange: 16,
            isLie: true,
            mood: 'HOSTILE',
          };
        } else {
          const lowAccusations = [
            `Kenji and I co-authored the neural foundation models for Project Kronos. We were intellectual partners. Losing him is a devastating blow to computational science.`,
            `The AetherCorp Spire is a maximum-security cybernetic facility. If an intruder breached Sub-Level 9, they had military-grade intrusion counter-measures.`,
          ];
          return {
            text: this.pickNonRepeating(key, lowAccusations),
            stressChange: 8,
            isLie: true,
            mood: 'CALM',
          };
        }
      }

      case 'ALIBI_WHEREABOUTS': {
        if (stress > 65) {
          return {
            text: `(Tapping titanium pen rapidly) I told you: I checked out of the building turnstiles at 21:00! If my badge registered a re-entry on Sub-Level 9, someone must have cloned my NFC credentials!`,
            stressChange: 15,
            isLie: true,
            mood: 'NERVOUS',
          };
        }
        return {
          text: `I left the research laboratory at 21:00, took a Maglev train to my apartment in Shinjuku, and was asleep by 22:30. My building lobby surveillance confirms my arrival.`,
          stressChange: 8,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }

      case 'ABOUT_OTHER_SUSPECT': {
        return {
          text: `Vector Kane owes 800,000 Yen in underground pachinko dens. He would sell proprietary server blades for pocket change! And Roxanne Ortiz was furious because Kenji failed the latest corporate security audit! Look at them!`,
          stressChange: 6,
          isLie: false,
          mood: 'DEFENSIVE',
        };
      }

      default: {
        return {
          text: `Detective, every second we waste arguing, the sovereign AGI algorithm could be uploaded to the darknet. You need to focus on finding the storage crystal.`,
          stressChange: 6,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }
    }
  }

  // ================= FIRST MATE DUNCAN CROSS (CASE 05 CULPRIT) =================
  private getFirstMateDuncanResponse(intent: IntentType, stress: number, _rawQuery: string): InterrogationReply {
    const key = `duncan-${intent}-${stress > 70 ? 'high' : stress > 40 ? 'med' : 'low'}`;

    switch (intent) {
      case 'ACCUSATION_KILL':
      case 'SHIP_MUTINY_GOLD': {
        if (stress > 75) {
          const highAccusations = [
            `(Roaring with fury, slamming both scarred fists on table) WE BLED FOR TWENTY YEARS IN NORTH ATLANTIC SQUALLS WHILE THE SHIPPING BARONS DRANK CHAMPAGNE IN GLASGOW! Fifteen million in gold bullion sitting in Hold 3! Vance was going to pull his service revolver on the bridge! He called us mutineers and thieves! I swung the pipe wrench before he could put a bullet in me! He cracked his skull against the brass binnacle! The sea took him, and good riddance!`,
            `(Breathing hoarsely, eyes wild) That gold was our pension! We earned every bloody ounce! I torched the containers and opened the bilge seacock to send the Poseidon Grand to the ocean floor so no one would ever know! You can hang me, Detective, but that bullion is already in the hands of the free brotherhood!`,
          ];
          return {
            text: this.pickNonRepeating(key, highAccusations),
            stressChange: 35,
            isLie: true,
            mood: 'CRACKING',
          };
        } else if (stress > 45) {
          const medAccusations = [
            `(Grumbling menacingly, jaw set like iron) Pirates, I tell ye! Fast black speedboats in the freezing fog! They came up the starboard ladders with automatic weapons and bolt cutters! They cut the VHF antenna before Captain Vance could hit the Mayday beacon! I was held at gunpoint in Hold 3!`,
            `(Glaring fiercely) The seacock valve opened?! The auxiliary ballast failed in the storm! Chief Engineer Sean O'Malley has been neglecting those bilge pumps for six months! Don't lay engine room breakdowns at my sea boots!`,
          ];
          return {
            text: this.pickNonRepeating(key, medAccusations),
            stressChange: 18,
            isLie: true,
            mood: 'HOSTILE',
          };
        } else {
          const lowAccusations = [
            `I have sailed thirty years under the merchant marine flag. Captain Vance and I had our disagreements, but no true sailor spills blood on the navigation bridge.`,
            `The North Atlantic in winter is a graveyard. If Captain Vance fell overboard in that howling squall, may the deep sea have mercy on his soul.`,
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
          return {
            text: `(Rubbing stubbled chin nervously) I was in cabin 12! Aye, I stepped out onto the cargo deck at 03:40 AM to check the lashing chains during the gale! In a storm like that, a mate checks his ship!`,
            stressChange: 15,
            isLie: true,
            mood: 'NERVOUS',
          };
        }
        return {
          text: `I finished my navigation watch at 02:00, logged our heading due east, and turned in to cabin 12. I didn't wake until the emergency sirens wailed at 04:20 AM.`,
          stressChange: 8,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }

      case 'ABOUT_OTHER_SUSPECT': {
        return {
          text: `Elena Rostova was sending coded Morse transmissions from the radio room two nights ago! She owed gambling debts in Hamburg! Or Sean O'Malley, who hated the Captain for cutting his overtime pay! Interrogate them!`,
          stressChange: 6,
          isLie: false,
          mood: 'DEFENSIVE',
        };
      }

      default: {
        return {
          text: `Detective, you don't know the sea. A ship adrift in a gale has a hundred perils. Stop wasting daylight grilling me and send divers down to Cargo Hold 3.`,
          stressChange: 6,
          isLie: true,
          mood: 'DEFENSIVE',
        };
      }
    }
  }

  // ================= DYNAMIC SUSPECT GENERATOR (ENHANCED FOR ALL INNOCENT SUSPECTS) =================
  private getDynamicSuspectResponse(
    intent: IntentType,
    suspect: Suspect,
    caseData: CaseData,
    stress: number,
    _rawQuery: string
  ): InterrogationReply {
    const sName = suspect.name.toLowerCase();
    const role = suspect.role;

    // Specific personas for innocent suspects across cases
    if (sName.includes('sterling')) {
      if (intent === 'ACCUSATION_KILL' || intent === 'VAULT_DIAMOND_CRYPTO') {
        return {
          text: `Are you out of your mind?! Marcus is my brother! We had a commercial dispute over twelve million dollars, but I was at the Manhattan Club with six venture partners! Valet slips, bar tabs, CCTV—my alibi is bulletproof! Look at Kira Mercer—she built the vault!`,
          stressChange: 8,
          isLie: false,
          mood: 'DEFENSIVE',
        };
      }
    }

    if (sName.includes('frank') || sName.includes('miller')) {
      if (intent === 'ACCUSATION_KILL' || intent === 'VAULT_DIAMOND_CRYPTO' || intent === 'ALIBI_WHEREABOUTS') {
        return {
          text: `Detective, I've got fifteen years of unblemished service in building security! At 03:00 I did the executive suite sweep. Kira told all of us guards to stay off the server floor because of an emergency patch! That struck me as unusual in hindsight.`,
          stressChange: 4,
          isLie: false,
          mood: 'CALM',
        };
      }
    }

    if (sName.includes('helena')) {
      if (intent === 'ACCUSATION_KILL' || intent === 'CODEX_OCCULT_CHALICE') {
        return {
          text: `I am an internationally respected antiquities scholar! Yes, my private gallery had financial difficulties, but I was dining at the Grand Hotel with the museum curator! Brother Raymond has been acting guilty and avoiding eye contact ever since the Munich dealer arrived in town!`,
          stressChange: 6,
          isLie: false,
          mood: 'DEFENSIVE',
        };
      }
    }

    if (sName.includes('damian')) {
      if (intent === 'ACCUSATION_KILL' || intent === 'CODEX_OCCULT_CHALICE') {
        return {
          text: `(Slurring slightly, coughing) Father Gabriel was tough on me for having a dram of whiskey, but murder?! I was in the carriage house stoking the coal boiler all night! I saw Brother Raymond running up the bell tower stairs in the pouring rain around 01:00 AM! He was clutching a leather bag!`,
          stressChange: 5,
          isLie: false,
          mood: 'DEFENSIVE',
        };
      }
    }

    if (sName.includes('vector')) {
      if (intent === 'ACCUSATION_KILL' || intent === 'NEURAL_JACK_AGI') {
        return {
          text: `Yo, Detective, I'm just a sub-level network admin! I fix liquid nitrogen pipes and replace server fans! I was in the VR recreation pod on Level 4! Dr. Maya Lin requested root biometric access to Quantum Caddy 01 earlier that morning. She's the only one with the brainpower and motive to swipe Kronos!`,
          stressChange: 6,
          isLie: false,
          mood: 'DEFENSIVE',
        };
      }
    }

    if (sName.includes('roxanne')) {
      if (intent === 'ACCUSATION_KILL' || intent === 'NEURAL_JACK_AGI') {
        return {
          text: `I am the Security Director for this spire! My drone telemetry logged a localized EMP pulse from Mainframe Bay 9 at 02:35 AM that blind-spotted our interior sensors. That requires executive-level clearance. Dr. Lin was the only executive in the building during that time window.`,
          stressChange: 4,
          isLie: false,
          mood: 'CALM',
        };
      }
    }

    if (sName.includes('elena') || sName.includes('roztov')) {
      if (intent === 'ACCUSATION_KILL' || intent === 'SHIP_MUTINY_GOLD') {
        return {
          text: `The radio went dead instantly! I ran to the terminal and found the VHF antenna cleanly severed! Before I could shout, someone hit me from behind! Duncan Cross was meeting in secret with deckhands talking about container cargo weights before we left harbor!`,
          stressChange: 6,
          isLie: false,
          mood: 'DEFENSIVE',
        };
      }
    }

    if (sName.includes('sean') || sName.includes('omalley')) {
      if (intent === 'ACCUSATION_KILL' || intent === 'SHIP_MUTINY_GOLD') {
        return {
          text: `I was in the lower engine bay when the water started gushing through the seacock! Someone wedged a 24-inch spanner into the valve to drown the ship! I saw First Mate Duncan sneaking down to Hold 3 with the ship's welding torches at 03:45 AM! Duncan killed Captain Vance and stole the gold!`,
          stressChange: 6,
          isLie: false,
          mood: 'DEFENSIVE',
        };
      }
    }

    // Generic fallback for any other custom suspects
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
        isLie: false,
        mood: 'DEFENSIVE',
      };
    }

    if (intent === 'ALIBI_WHEREABOUTS') {
      return {
        text: `${suspect.alibi} I've said it already. Why aren't your investigators verifying the camera feeds instead of badgering me?`,
        stressChange: 6,
        isLie: false,
        mood: 'DEFENSIVE',
      };
    }

    if (intent === 'MOTIVE_WHY' || intent === 'MONEY_DEBT_WILL') {
      return {
        text: `${suspect.motive ? `Look, it's true: ${suspect.motive}. But that doesn't make me a killer! People have disagreements every day without resorting to murder!` : 'I had no financial or personal grudge against anyone here.'}`,
        stressChange: 10,
        isLie: false,
        mood: 'DEFENSIVE',
      };
    }

    if (intent === 'CALLING_OUT_LIE') {
      return {
        text: `I'm not lying to you! If my story sounds fragmented, it's because I'm terrified and exhausted in this interrogation room!`,
        stressChange: 12,
        isLie: false,
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
      stressChange: 4,
      isLie: false,
      mood: 'DEFENSIVE',
    };
  }
}

export const dialogueManager = new SuspectDialogueManager();
