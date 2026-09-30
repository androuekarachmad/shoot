/**
 * Audio Engine for "A Little Story About Us"
 * Built with Web Audio API for offline, romantic, cinematic visual novel background music
 * and interactive sound effects.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.5;
    this.masterGain = null;
    this.bgmGain = null;
    this.sfxGain = null;
    this.sequenceTimer = null;
    this.activeNodes = [];
    this.step = 0;
    this.hasUserInteracted = false;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    this.ctx = new AudioContext();

    // Master gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);

    // BGM Gain
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
    this.bgmGain.connect(this.masterGain);

    // SFX Gain
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);

    // Connect to output
    this.masterGain.connect(this.ctx.destination);
  }

  unlockAudio() {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.hasUserInteracted = true;
  }

  // Romantic chord progression (Fmaj7 - C/E - Dm9 - Bbmaj7 - Gm7 - C7sus4 - Fadd9)
  getChordNotes(stepIndex) {
    const chords = [
      // Fmaj9: F2, A3, C4, E4, G4
      { bass: 87.31, notes: [220.00, 261.63, 329.63, 392.00, 523.25] },
      // C/E: E2, G3, C4, E4, G4
      { bass: 82.41, notes: [196.00, 261.63, 329.63, 392.00, 493.88] },
      // Dm9: D2, F3, A3, C4, E4
      { bass: 73.42, notes: [174.61, 220.00, 261.63, 329.63, 440.00] },
      // Bbmaj7: Bb1, F3, A3, D4, F4
      { bass: 58.27, notes: [174.61, 220.00, 293.66, 349.23, 440.00] },
      // Gm7: G2, Bb3, D4, F4, A4
      { bass: 98.00, notes: [233.08, 293.66, 349.23, 440.00, 523.25] },
      // Csus4 -> C: C2, G3, C4, F4 -> E4
      { bass: 65.41, notes: [196.00, 261.63, 349.23, 392.00, 523.25] },
      // Fadd9: F2, A3, C4, G4, C5
      { bass: 87.31, notes: [220.00, 261.63, 392.00, 523.25, 659.25] },
      // Am7: A2, C4, E4, G4, B4
      { bass: 110.00, notes: [261.63, 329.63, 392.00, 493.88, 587.33] }
    ];
    return chords[stepIndex % chords.length];
  }

  // Play a soft acoustic piano-like note with dual harmonic oscillators & warm lowpass
  playPianoNote(freq, time, duration = 3.0, velocity = 0.2) {
    if (!this.ctx || this.isMuted) return;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const noteGain = this.ctx.createGain();

    // Waveforms for warm, felted piano tone
    osc1.type = 'triangle';
    osc2.type = 'sine';

    osc1.frequency.setValueAtTime(freq, time);
    // Subtle detune for rich celestial chorus
    osc2.frequency.setValueAtTime(freq * 1.002, time);

    // Filter softens brightness over time
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.frequency.exponentialRampToValueAtTime(350, time + duration * 0.8);
    filter.Q.setValueAtTime(1.2, time);

    // Natural piano amplitude envelope: fast attack, smooth decay
    noteGain.gain.setValueAtTime(0.0001, time);
    noteGain.gain.linearRampToValueAtTime(velocity, time + 0.04);
    noteGain.gain.exponentialRampToValueAtTime(velocity * 0.45, time + 0.5);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(this.bgmGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + duration);
    osc2.stop(time + duration);
  }

  // Gentle atmospheric pad for emotional warmth
  playPadNote(freq, time, duration = 4.5, velocity = 0.08) {
    if (!this.ctx || this.isMuted) return;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.linearRampToValueAtTime(velocity, time + 1.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  // Schedule next musical bar
  scheduleBar() {
    if (!this.isPlaying || !this.ctx) return;

    const chord = this.getChordNotes(this.step);
    const now = this.ctx.currentTime;
    const barDuration = 4.0; // seconds per chord

    // Bass root note
    this.playPianoNote(chord.bass, now, 3.8, 0.28);
    this.playPadNote(chord.bass * 2, now, 4.2, 0.07);

    // Arpeggiated melody notes for delicate anime VN emotion
    const noteIndices = [0, 1, 2, 3, 2, 4, 3, 1];
    const subStepTime = barDuration / noteIndices.length;

    noteIndices.forEach((noteIdx, i) => {
      const noteFreq = chord.notes[noteIdx % chord.notes.length];
      const noteTime = now + (i * subStepTime);
      const vel = (i === 0 || i === 4) ? 0.16 : 0.11;
      this.playPianoNote(noteFreq, noteTime, 2.2, vel);
    });

    this.step++;

    // Loop timer
    this.sequenceTimer = setTimeout(() => {
      this.scheduleBar();
    }, (barDuration - 0.2) * 1000);
  }

  startBGM() {
    this.unlockAudio();
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.step = 0;

    // Smooth fade in
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.bgmGain.gain.linearRampToValueAtTime(0.65, this.ctx.currentTime + 2.0);
    }

    this.scheduleBar();
  }

  stopBGM() {
    this.isPlaying = false;
    if (this.sequenceTimer) {
      clearTimeout(this.sequenceTimer);
      this.sequenceTimer = null;
    }
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
    }
  }

  toggleBGM() {
    this.unlockAudio();
    if (this.isPlaying) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(
        muted ? 0 : this.volume,
        this.ctx.currentTime + 0.2
      );
    }
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.1);
    }
  }

  // --- Sound Effects ---

  // Soft tactile click for UI buttons
  playClick() {
    if (!this.ctx || this.isMuted) return;
    this.unlockAudio();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(620, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(280, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  // Warm chime for page advancement
  playPageTurn() {
    if (!this.ctx || this.isMuted) return;
    this.unlockAudio();

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);

      gain.gain.setValueAtTime(0.08, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.35);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.36);
    });
  }

  // Stardust celebration sparkle when user accepts confession
  playConfessionSparkle() {
    if (!this.ctx || this.isMuted) return;
    this.unlockAudio();

    const now = this.ctx.currentTime;
    // Ascending arpeggio of celestial bells
    const frequencies = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];

    frequencies.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.15, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.8);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.85);
    });
  }

  // Gentle peaceful tone when user declines
  playCalmTone() {
    if (!this.ctx || this.isMuted) return;
    this.unlockAudio();

    const now = this.ctx.currentTime;
    const chord = [349.23, 440.00, 523.25]; // F4, A4, C5

    chord.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 1.25);
    });
  }
}

export const audio = new AudioEngine();
