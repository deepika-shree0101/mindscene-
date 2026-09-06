class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private droneGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private heartbeatTimer: number | null = null;

  public initContext() {
    if (typeof window === 'undefined') return;
    try {
      if (!this.ctx) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          this.ctx = new AudioContextClass();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn('AudioContext init error', e);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopSuspenseDrone();
      this.stopHeartbeat();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      this.startSuspenseDrone();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Tactical click
  public playKeyClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600 + Math.random() * 200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // Flashlight toggle sound
  public playFlashlightClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.setValueAtTime(300, this.ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Realistic Double-Thump Heartbeat
  public playHeartbeatOnce(intensity: number = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // First thump (lub)
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(65, now);
    osc1.frequency.exponentialRampToValueAtTime(30, now + 0.12);
    gain1.gain.setValueAtTime(0.25 * intensity, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.14);

    // Second thump (dub) - slightly higher & punchier
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(75, now + 0.14);
    osc2.frequency.exponentialRampToValueAtTime(35, now + 0.28);
    gain2.gain.setValueAtTime(0.2 * intensity, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(now + 0.14);
    osc2.stop(now + 0.3);
  }

  public startHeartbeat(bpm: number = 75) {
    this.stopHeartbeat();
    if (this.isMuted) return;
    const intervalMs = (60 / bpm) * 1000;
    this.playHeartbeatOnce();
    this.heartbeatTimer = window.setInterval(() => {
      this.playHeartbeatOnce();
    }, intervalMs);
  }

  public stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // Horror Thunder Strike & Deep Rumble
  public playThunder() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Noise buffer for crackle
    const bufferSize = this.ctx.sampleRate * 2.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.8));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(80, now + 2.0);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
    noise.stop(now + 2.5);
  }

  // Cyber Glitch / Radio Static Burst
  public playGlitch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.setValueAtTime(2400, now + 0.03);
    osc.frequency.setValueAtTime(300, now + 0.06);
    osc.frequency.setValueAtTime(1800, now + 0.09);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Dramatic Horror Clue Discovery Stinger
  public playClueDiscovered() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Dissonant Minor Chord with slow decay
    const notes = [220, 261.63, 311.13, 440]; // A3, C4, Eb4 (Diminished), A4
    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.98, now + 1.2);

      gain.gain.setValueAtTime(0.08, now + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.03);
      osc.stop(now + 1.5);
    });

    this.playHeartbeatOnce(1.4);
  }

  // Access Granted / Positive confirmation
  public playAccessGranted() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const freqs = [440, 554.37, 659.25, 880];
    freqs.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const startTime = this.ctx!.currentTime + index * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.1, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  // Access Denied / Error
  public playAccessDenied() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, this.ctx.currentTime);
    osc.frequency.setValueAtTime(90, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.4);
  }

  // Scanner hum
  public playScannerHum() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(640, this.ctx.currentTime + 0.12);
    osc.frequency.linearRampToValueAtTime(320, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Case Solved / Victory
  public playCaseSolved() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [220, 277.18, 329.63, 440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const t = this.ctx!.currentTime + i * 0.12;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(t);
      osc.stop(t + 0.8);
    });
  }

  // Procedural Low-Frequency Suspense Ambient Drone (Horror Background)
  public startSuspenseDrone() {
    if (this.isMuted || this.droneGain) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.04, now + 2.0); // subtle ambient

      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(55, now); // Low A1

      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(56.5, now); // Slight binaural beat detune

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);

      this.droneOsc1.connect(filter);
      this.droneOsc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.droneOsc1.start();
      this.droneOsc2.start();
    } catch (e) {
      console.warn('Drone start failed', e);
    }
  }

  public stopSuspenseDrone() {
    if (this.droneGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.droneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        setTimeout(() => {
          this.droneOsc1?.stop();
          this.droneOsc2?.stop();
          this.droneOsc1?.disconnect();
          this.droneOsc2?.disconnect();
          this.droneGain?.disconnect();
          this.droneOsc1 = null;
          this.droneOsc2 = null;
          this.droneGain = null;
        }, 600);
      } catch {
        this.droneGain = null;
      }
    }
  }

  // Real Text-to-Speech Engine with Voice Modulation
  public speak(text: string, characterType: 'specter' | 'suspect' | 'narrator' = 'specter') {
    if (this.isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel(); // Stop prior speeches

      // Clean speech from prefixes like "SPECTER:" or "Lord Blackwood:"
      const cleanText = text.replace(/^[A-Za-z\s]+:\s*/, '').replace(/[*_#]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Find available voices
      const voices = window.speechSynthesis.getVoices();
      
      if (characterType === 'specter') {
        // Robotic, cool, clinical
        utterance.pitch = 0.75;
        utterance.rate = 1.05;
        const roboticVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Natural') || v.lang.startsWith('en'));
        if (roboticVoice) utterance.voice = roboticVoice;
      } else if (characterType === 'suspect') {
        // Tense, emotional, lower pitch
        utterance.pitch = 0.85;
        utterance.rate = 0.95;
        const maleVoice = voices.find(v => (v.name.includes('David') || v.name.includes('Male') || v.name.includes('George')) && v.lang.startsWith('en'));
        if (maleVoice) utterance.voice = maleVoice;
      } else {
        // Narrator - ominous
        utterance.pitch = 0.6;
        utterance.rate = 0.9;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis error', e);
    }
  }
}

export const sound = new SoundEngine();
