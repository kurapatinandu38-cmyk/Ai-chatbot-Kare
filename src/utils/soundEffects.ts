/**
 * Web Audio API Synthetic Sound Effects
 * Provides low-latency, zero-asset, tactile sound effects (clicks, whooshes, and pop tones)
 * to enhance the tactile feel of 3D cards and interactive components.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      void audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

/**
 * Subtle, crisp mechanical tactile click (exponential pitch sweep with lowpass filter).
 * Duration: ~35ms. Perfect for card clicks and button taps.
 */
export function playTactileClick(volume = 0.08): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, now);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  } catch {
    // Graceful fallback if audio is disabled
  }
}

/**
 * Subtle, airy spatial whoosh sound for 3D card tilt/hover and dimensional sweeps.
 * Duration: ~110ms. Soft and tactile.
 */
export function playWhoosh(volume = 0.05): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.05);
    osc.frequency.exponentialRampToValueAtTime(210, now + 0.11);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(420, now);
    filter.Q.setValueAtTime(2.2, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  } catch {
    // Graceful fallback
  }
}

/**
 * Combined dimensional 3D card interaction sound (subtle airy whoosh + micro-click).
 */
export function play3DCardInteract(): void {
  playWhoosh(0.045);
  setTimeout(() => {
    playTactileClick(0.07);
  }, 30);
}

/**
 * Satisfying tactile button pop with harmonic sparkle.
 */
export function playButtonPop(volume = 0.09): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.05);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch {
    // Graceful fallback
  }
}
