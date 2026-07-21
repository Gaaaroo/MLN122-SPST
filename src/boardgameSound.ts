/**
 * Âm thanh bàn cờ bằng Web Audio API — không cần file mp3.
 * Trình duyệt chỉ cho phát sau lần tương tác đầu (bấm nút).
 */

let sharedCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!sharedCtx) sharedCtx = new AC();
  if (sharedCtx.state === "suspended") void sharedCtx.resume();
  return sharedCtx;
}

function noiseBurst(
  ctx: AudioContext,
  when: number,
  duration: number,
  gainPeak: number,
  hpHz: number,
): void {
  const frames = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  }

  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = hpHz;
  filter.Q.value = 0.8;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(gainPeak, when + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start(when);
  src.stop(when + duration + 0.02);
}

function blip(
  ctx: AudioContext,
  when: number,
  freqStart: number,
  freqEnd: number,
  duration: number,
  peak: number,
  type: OscillatorType = "sine",
): void {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freqStart, when);
  osc.frequency.exponentialRampToValueAtTime(freqEnd, when + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(peak, when + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(when);
  osc.stop(when + duration + 0.02);
}

/** Rung lắc lúc xúc xắc đang quay. */
export function playDiceRattle(): void {
  const ctx = getCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime;
  for (let i = 0; i < 7; i++) {
    noiseBurst(ctx, t0 + i * 0.07, 0.055, 0.18 - i * 0.012, 900 + i * 120);
  }
}

/** Tiếng “cạch” khi xúc xắc dừng. */
export function playDiceLand(): void {
  const ctx = getCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime;
  blip(ctx, t0, 180, 70, 0.18, 0.22, "triangle");
  noiseBurst(ctx, t0, 0.08, 0.14, 1400);
}

/** Bấm nút / chọn lựa chọn. */
export function playUiClick(): void {
  const ctx = getCtx();
  if (!ctx) return;
  blip(ctx, ctx.currentTime, 920, 520, 0.055, 0.07, "sine");
}

/** Token nhảy sang ô kế tiếp. */
export function playMoveStep(): void {
  const ctx = getCtx();
  if (!ctx) return;
  const t0 = ctx.currentTime;
  blip(ctx, t0, 520, 340, 0.07, 0.09, "triangle");
  noiseBurst(ctx, t0, 0.04, 0.06, 1800);
}
