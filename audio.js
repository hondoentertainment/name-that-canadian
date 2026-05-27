class GameAudio {
  constructor() {
    this.ctx = null;
    this.suspenseNode = null;
    this.suspenseOsc = null;
    this.suspenseFilter = null;
    this.lfo = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (muted) {
      this.stopSuspense();
    }
  }

  playTick() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  playWarning() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now); // A5
    
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.16);
  }

  playCorrect() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
    notes.forEach((freq, index) => {
      const noteTime = now + index * 0.08;
      
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq, noteTime);
      
      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.12, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);
      
      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(noteTime);
      osc2.start(noteTime);
      osc.stop(noteTime + 0.45);
      osc2.stop(noteTime + 0.45);
    });
  }

  playIncorrect() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(120, now);
    osc1.frequency.linearRampToValueAtTime(80, now + 0.6);
    
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(121, now);
    osc2.frequency.linearRampToValueAtTime(80.5, now + 0.6);
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.6);
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
    
    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.7);
    osc2.stop(now + 0.7);
  }

  playReveal() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    
    const count = 12;
    for (let i = 0; i < count; i++) {
      const noteTime = now + i * 0.05;
      const freq = 800 + Math.random() * 1500;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);
      
      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.06, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.3);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(noteTime);
      osc.stop(noteTime + 0.35);
    }
  }

  playFanfare() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    
    const notes = [
      { f: 261.63, d: 0.15 },
      { f: 392.00, d: 0.15 },
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.3 },
      { f: 523.25, d: 0.15 },
      { f: 783.99, d: 0.6 }
    ];
    
    let timeOffset = 0;
    notes.forEach((note) => {
      const noteTime = now + timeOffset;
      const duration = note.d;
      
      const osc = this.ctx.createOscillator();
      const oscDetuned = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.f, noteTime);
      
      oscDetuned.type = 'sawtooth';
      oscDetuned.frequency.setValueAtTime(note.f * 1.008, noteTime);
      
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, noteTime);
      filter.Q.setValueAtTime(3, noteTime);
      
      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(0.08, noteTime + 0.02);
      gain.gain.linearRampToValueAtTime(0.06, noteTime + duration - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);
      
      osc.connect(filter);
      oscDetuned.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(noteTime);
      oscDetuned.start(noteTime);
      osc.stop(noteTime + duration + 0.05);
      oscDetuned.stop(noteTime + duration + 0.05);
      
      timeOffset += duration - 0.02;
    });
  }

  startSuspense() {
    if (this.muted) return;
    this.init();
    if (this.suspenseOsc) return;
    
    const now = this.ctx.currentTime;
    
    this.suspenseOsc = this.ctx.createOscillator();
    this.suspenseFilter = this.ctx.createBiquadFilter();
    this.suspenseNode = this.ctx.createGain();
    
    this.suspenseOsc.type = 'triangle';
    this.suspenseOsc.frequency.setValueAtTime(90, now);
    
    this.lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    this.lfo.frequency.value = 0.5;
    lfoGain.gain.value = 1.5;
    
    this.lfo.connect(lfoGain);
    lfoGain.connect(this.suspenseOsc.frequency);
    this.lfo.start(now);
    
    this.suspenseFilter.type = 'lowpass';
    this.suspenseFilter.frequency.setValueAtTime(200, now);
    
    this.suspenseNode.gain.setValueAtTime(0, now);
    this.suspenseNode.gain.linearRampToValueAtTime(0.25, now + 1.5);
    
    this.suspenseOsc.connect(this.suspenseFilter);
    this.suspenseFilter.connect(this.suspenseNode);
    this.suspenseNode.connect(this.ctx.destination);
    
    this.suspenseOsc.start(now);
  }

  stopSuspense() {
    if (!this.suspenseOsc) return;
    
    const now = this.ctx.currentTime;
    const osc = this.suspenseOsc;
    const gainNode = this.suspenseNode;
    const lfo = this.lfo;
    
    if (gainNode) {
      gainNode.gain.cancelScheduledValues(now);
      gainNode.gain.setValueAtTime(gainNode.gain.value, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    }
    
    setTimeout(() => {
      try {
        osc.stop();
        lfo.stop();
      } catch (e) {}
    }, 600);
    
    this.suspenseOsc = null;
    this.suspenseFilter = null;
    this.suspenseNode = null;
    this.lfo = null;
  }
}

const audio = new GameAudio();
window.gameAudio = audio; // Export to window for global access
