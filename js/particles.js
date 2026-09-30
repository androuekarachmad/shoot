/**
 * Particle & Ambient Cosmic Dust Canvas System
 * Creates gentle twinkling stars, soft floating golden & blue cosmic motes,
 * and celebratory stardust effects for the visual novel experience.
 */

export class ParticleSystem {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement ? canvasElement.getContext('2d') : null;
    this.particles = [];
    this.celebrationParticles = [];
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.isRunning = false;
    this.animationFrameId = null;
    this.lastTime = 0;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Palette matching the visual novel theme
    this.colors = [
      'rgba(214, 233, 245, ', // Ice White
      'rgba(139, 185, 216, ', // Soft Blue
      'rgba(255, 214, 154, ', // Sunset Gold
      'rgba(102, 137, 168, ', // Muted Blue
    ];

    if (this.canvas) {
      this.init();
    }
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });
    
    // Listen for visibility changes to save battery
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });

    this.createAmbientStars();
    this.start();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width || window.innerWidth;
    this.height = rect.height || window.innerHeight;

    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;

    if (this.ctx) {
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }
  }

  createAmbientStars() {
    this.particles = [];
    // Mobile optimized count (35-50 particles)
    const count = Math.floor(Math.min(45, Math.max(25, (this.width * this.height) / 18000)));

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        // Concentrate more particles in upper 70% where earth & sky are
        y: Math.random() * (this.height * 0.75),
        size: Math.random() * 1.8 + 0.6,
        baseAlpha: Math.random() * 0.5 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.008,
        twinkleOffset: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -Math.random() * 0.15 - 0.03, // Gentle upward celestial drift
        colorPrefix: this.colors[Math.floor(Math.random() * this.colors.length)],
        isGold: Math.random() > 0.65
      });
    }
  }

  // Celebration stardust burst for "Iya, tentu."
  triggerCelebration() {
    if (this.reducedMotion) return;
    this.celebrationParticles = [];
    const count = 70;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.8 + 0.8;
      this.celebrationParticles.push({
        x: this.width * 0.5 + (Math.random() - 0.5) * 80,
        y: this.height * 0.55 + (Math.random() - 0.5) * 60,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2, // upward lift
        size: Math.random() * 3.2 + 1.2,
        alpha: 1.0,
        decay: Math.random() * 0.008 + 0.004,
        colorPrefix: Math.random() > 0.4 ? 'rgba(255, 214, 154, ' : 'rgba(214, 233, 245, ',
        twinkle: Math.random() * Math.PI,
        tail: []
      });
    }
  }

  update(delta) {
    const time = performance.now() * 0.001;

    // Ambient particles
    for (let p of this.particles) {
      if (!this.reducedMotion) {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around seamlessly
        if (p.y < 0) {
          p.y = this.height * 0.75;
          p.x = Math.random() * this.width;
        }
        if (p.x < 0) p.x = this.width;
        if (p.x > this.width) p.x = 0;
      }
    }

    // Celebration particles
    for (let i = this.celebrationParticles.length - 1; i >= 0; i--) {
      const cp = this.celebrationParticles[i];
      cp.x += cp.vx;
      cp.y += cp.vy;
      cp.vy += 0.015; // gentle gravity
      cp.vx *= 0.985;
      cp.alpha -= cp.decay;

      if (cp.alpha <= 0) {
        this.celebrationParticles.splice(i, 1);
      }
    }
  }

  render() {
    if (!this.ctx) return;
    const time = performance.now() * 0.001;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw ambient stars
    for (let p of this.particles) {
      const alpha = p.baseAlpha + Math.sin(time * 2 + p.twinkleOffset) * 0.25;
      const finalAlpha = Math.max(0.1, Math.min(0.9, alpha));

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `${p.colorPrefix}${finalAlpha})`;
      this.ctx.shadowBlur = p.isGold ? 8 : 4;
      this.ctx.shadowColor = p.isGold ? 'rgba(255, 214, 154, 0.6)' : 'rgba(214, 233, 245, 0.4)';
      this.ctx.fill();
    }

    // Draw celebration particles
    for (let cp of this.celebrationParticles) {
      this.ctx.beginPath();
      this.ctx.arc(cp.x, cp.y, cp.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `${cp.colorPrefix}${cp.alpha})`;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = 'rgba(255, 214, 154, 0.9)';
      this.ctx.fill();

      // Sparkle cross star for larger particles
      if (cp.size > 2.2 && cp.alpha > 0.3) {
        this.ctx.beginPath();
        this.ctx.moveTo(cp.x - cp.size * 2, cp.y);
        this.ctx.lineTo(cp.x + cp.size * 2, cp.y);
        this.ctx.moveTo(cp.x, cp.y - cp.size * 2);
        this.ctx.lineTo(cp.x, cp.y + cp.size * 2);
        this.ctx.strokeStyle = `${cp.colorPrefix}${cp.alpha * 0.7})`;
        this.ctx.lineWidth = 0.8;
        this.ctx.stroke();
      }
    }

    // Reset shadow
    this.ctx.shadowBlur = 0;
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    const delta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.update(delta);
    this.render();

    this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
}
