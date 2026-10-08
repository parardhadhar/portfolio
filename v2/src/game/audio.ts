// Original generative ambient score. No remote audio or copyrighted samples.
export class IslandAudio {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private step = 0;
  private enabled = false;
  private note(frequency: number, time: number, duration: number, volume: number, type: OscillatorType = 'sine') {
    const ctx = this.context; if (!ctx || !this.master) return;
    const oscillator = ctx.createOscillator(); const envelope = ctx.createGain();
    oscillator.type = type; oscillator.frequency.value = frequency;
    envelope.gain.setValueAtTime(0, time); envelope.gain.linearRampToValueAtTime(volume, time + .04); envelope.gain.exponentialRampToValueAtTime(.0001, time + duration);
    oscillator.connect(envelope); envelope.connect(this.master); oscillator.start(time); oscillator.stop(time + duration + .05);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
  }
  async toggle() {
    if (!this.context) { this.context = new AudioContext(); this.master = this.context.createGain(); this.master.gain.value = .45; this.master.connect(this.context.destination); }
    this.enabled = !this.enabled;
    if (this.enabled) {
      await this.context.resume();
      const tick = () => {
        if (!this.context || !this.enabled || document.hidden) return;
        const now = this.context.currentTime; const roots = [130.81, 110, 87.31, 98]; const root = roots[Math.floor(this.step / 16) % 4];
        if (this.step % 8 === 0) { [1, 1.5, 2.5].forEach(ratio => this.note(root * ratio, now, 3.6, .055, 'sine')); this.note(root / 2, now, 1.4, .12); }
        const pattern = [2, 0, 3, 2.5, 0, 3, 4, 0, 2.5, 0, 3, 4, 3, 0, 2.5, 0]; const ratio = pattern[this.step % 16];
        if (ratio) this.note(root * ratio * 2, now, .8, .04, 'triangle');
        this.step++;
      }; tick(); this.timer = setInterval(tick, 240);
    } else { if(this.timer) clearInterval(this.timer); this.timer=null; await this.context.suspend(); }
    return this.enabled;
  }
  collect() { if(this.enabled && this.context) { this.note(659.25,this.context.currentTime,.3,.15); this.note(987.77,this.context.currentTime+.1,.5,.1); } }
  dispose() { if(this.timer)clearInterval(this.timer); void this.context?.close(); }
}
