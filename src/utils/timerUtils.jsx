export class GameTimer {
  constructor(duration, onTick, onComplete) {
    this.duration = duration;
    this.remaining = duration;
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.interval = null;
    this.isRunning = false;
    this.isCritical = false;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.interval = setInterval(() => {
      this.remaining--;
      this.isCritical = this.remaining <= 10;
      if (this.onTick) this.onTick({ remaining: this.remaining, isCritical: this.isCritical });
      if (this.remaining <= 0) { this.stop(); if (this.onComplete) this.onComplete(); }
    }, 1000);
  }

  stop() { if (this.interval) { clearInterval(this.interval); this.interval = null; } this.isRunning = false; }
  reset(n) { this.stop(); this.duration = n || this.duration; this.remaining = this.duration; this.isCritical = false; }
  addTime(s) { this.remaining += s; if (this.isCritical && this.remaining > 10) this.isCritical = false; }
  getRemaining() { return this.remaining; }
  getProgress() { return this.duration ? (this.duration - this.remaining) / this.duration : 0; }
  getFormattedTime() { const m = Math.floor(this.remaining / 60); const s = this.remaining % 60; return `${m}:${s.toString().padStart(2, '0')}`; }
}

export function getTimerColor(remaining, isCritical) {
  if (isCritical || remaining <= 10) return '#ff3860';
  if (remaining <= 20) return '#ff9800';
  return '#667eea';
}