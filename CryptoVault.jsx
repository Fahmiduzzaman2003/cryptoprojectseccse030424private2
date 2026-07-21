import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/* =====================================================================
 * CryptoVault — single-file cryptographic file processor
 * Dark hacker aesthetic, 100% client-side. All ciphers implemented from
 * scratch, BigInt-based RSA, custom BanglaShift multilingual cipher.
 * =================================================================== */

/* ---------- THEME ----------
 * CSS variables drive the live theme so flipping to DECRYPT swaps every
 * accent surface to red in one class toggle on <html>.
 */
const C = {
  bg: '#000000',
  // Static fallbacks (used in canvas where CSS vars are unavailable).
  green: '#00ff41',
  greenDim: '#00b82d',
  cyan: '#00d4ff',
  red: '#b8060ce1',
  redDim: '#9c0303f2',
  amber: '#ffc800',
  panel: 'rgba(0, 20, 0, 0.85)',
  panelDim: 'rgba(0, 12, 0, 0.7)',
  border: 'rgba(0, 255, 65, 0.45)',
  borderRed: '#ba060c',
  borderAmber: 'rgba(255, 200, 0, 0.55)',
  borderDim: 'rgba(80, 80, 80, 0.5)',
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&display=swap');

/* Respect user motion preferences for performance */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* === Theme tokens — flipped to red when <html> has .danger === */
:root {
  --accent: #00ff41;
  --accent-dim: #00b82d;
  --accent-rgb: 0, 255, 65;
  --secondary: #00d4ff;
  --secondary-rgb: 0, 212, 255;
  --warn: #ffc800;
  --warn-rgb: 255, 200, 0;
  --err: #ff003c;
  --panel-tint: 0, 20, 0;
  --bg: #000;
}
:root.danger {
  /* Brighter, more legible red — was #ff0019 which crushed to pure crimson */
  --accent: #ff2a3d;
  /* Was #b40014, which sat at 2.95:1 on black — below AA and effectively
   * invisible in the trace tables. This matches the green theme's dim tone
   * (7.6:1 vs 7.9:1) so secondary text reads at the same strength. */
  --accent-dim: #ff6b78;
  --accent-rgb: 255, 42, 61;
  /* Orange-amber "secondary" so cyan-on-red stays a contrast pair */
  --secondary: #ffb000;
  --secondary-rgb: 255, 176, 0;
  --warn: #ffe066;
  --warn-rgb: 255, 224, 102;
  --err: #ffffff;
  /* Panels must stay near-black for text to separate from them. The old
   * 72,4,10 was a mid red that flooded every surface and dropped body text
   * to 4.4:1; this keeps the warm cast but reads as a dark panel (5.3:1). */
  --panel-tint: 30, 2, 8;
  --bg: #0a0002;
  /* Used by the danger-only keyframes */
  --blood: #ff0019;
  --blood-rgb: 255, 0, 25;
  --blood-deep: #6b0008;
  --smoke: 255, 80, 90;
}
/* Ambient red glow, pulled back from 0.35/0.45 — at full strength it lit
 * the whole page and left panels with nothing to sit against. */
:root.danger body {
  background:
    radial-gradient(ellipse at top,    rgba(180, 0, 30, 0.20), transparent 55%),
    radial-gradient(ellipse at bottom, rgba(120, 0, 20, 0.24), transparent 60%),
    #0a0002;
}

/* Smooth theme transition when toggling encrypt/decrypt. */
html, body, .cv-step, .cv-card, .cv-btn, .cv-input, .cv-textarea,
.cv-mode-btn, .cv-exec, .cv-dl, .cv-statusbar, .cv-output, .cv-wa-btn,
.cv-step-num, .cv-srctab, .cv-tagline {
  transition: background-color 0.35s ease, border-color 0.35s ease,
              color 0.35s ease, box-shadow 0.35s ease, text-shadow 0.35s ease;
}

* { box-sizing: border-box; }

/* Smooth in-page nav and predictable button focus rings (a11y). */
html { scroll-behavior: smooth; }
button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible {
  outline: 2px solid var(--secondary);
  outline-offset: 2px;
}

/* Floating scroll-to-top pill — only visible on mobile after scroll. */
.cv-scrolltop {
  position: fixed; right: 16px; bottom: max(20px, env(safe-area-inset-bottom, 16px));
  width: 48px; height: 48px; border-radius: 50%;
  background: var(--accent); color: #000; border: 0; cursor: pointer;
  display: none; align-items: center; justify-content: center;
  z-index: 50; box-shadow: 0 4px 20px rgba(var(--accent-rgb), 0.55);
  transition: transform .15s ease, opacity .2s ease;
}
.cv-scrolltop:hover { transform: translateY(-2px); }
.cv-scrolltop.visible { display: inline-flex; }
@media (min-width: 900px) { .cv-scrolltop { display: none !important; } }

html, body, #root {
  margin: 0; padding: 0; background: var(--bg); color: var(--accent);
  font-family: 'Share Tech Mono', monospace;
  min-height: 100vh;
  /* dvh tracks the collapsing URL bar on mobile Safari/Chrome; the vh line
   * above stays as the fallback for browsers without dvh. */
  min-height: 100dvh;
  overflow-x: hidden;
  /* Stop iOS from silently re-scaling text in landscape. */
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

body { cursor: crosshair; }

/* Touch devices have no hover, but browsers still latch :hover after a tap —
 * which left cards lifted and buttons inverted until you tapped elsewhere.
 * Gate every hover-only affordance behind an actual pointer. */
@media (hover: none) {
  /* Each rule restores that element's own resting state explicitly, rather
   * than using inherit, which would pull the parent's background instead. */
  .cv-card:hover { transform: none; }
  .cv-card.compatible:hover { box-shadow: none; }
  .cv-card.compatible:hover::after { left: -100%; }
  .cv-card.selected:hover {
    box-shadow: 0 0 32px var(--secondary), inset 0 0 18px rgba(var(--secondary-rgb), 0.25);
  }

  .cv-btn:hover { background: transparent; color: var(--accent); box-shadow: none; }
  .cv-btn.cyan:hover { background: transparent; color: var(--secondary); box-shadow: none; }
  .cv-dl:hover { background: rgba(var(--accent-rgb), 0.18); color: var(--accent); }
  .cv-exec:hover { background: rgba(var(--accent-rgb), 0.1); color: var(--accent); }
  .cv-srctab:hover { background: #000; color: rgba(var(--accent-rgb), 0.5); }
  .cv-srctab.active:hover { background: var(--accent); color: #000; }
  .cv-mode-btn:hover { color: rgba(var(--accent-rgb), 0.55); border-color: rgba(var(--accent-rgb), 0.4); }
  .cv-mode-btn.encrypt.active:hover { color: var(--accent); border-color: var(--accent); }
  .cv-mode-btn.decrypt:hover { color: rgba(255, 0, 0, 0.66); border-color: rgba(255, 0, 0, 0.66); box-shadow: none; }
  .cv-mode-btn.decrypt.active:hover { border-color: rgb(255, 0, 0, 0.66); }
  .cv-wa-btn:hover { background: rgba(37, 211, 102, 0.15); color: #25d366; text-shadow: 0 0 8px #25d366; }
  .cv-wa-btn:hover .cv-svg { stroke: #25d366; filter: drop-shadow(0 0 8px #25d366); }
  .cv-scrolltop:hover { transform: none; }

  /* Give touch users press feedback instead. */
  .cv-card:active { transform: scale(0.985); }
  .cv-btn:active, .cv-dl:active, .cv-exec:active,
  .cv-mode-btn:active, .cv-wa-btn:active { transform: translateY(1px); }
}

::selection { background: var(--accent); color: #000; }

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: #000; }
::-webkit-scrollbar-thumb { background: var(--accent-dim); border-radius: 0; }
::-webkit-scrollbar-thumb:hover { background: var(--accent); }

:root.danger ::-webkit-scrollbar-thumb { background: var(--accent-dim); box-shadow: inset 0 0 6px rgba(255,42,61,0.5); }
:root.danger ::-webkit-scrollbar-thumb:hover { background: var(--accent); }

.cv-root {
  position: relative; min-height: 100vh;
  /* Fluid gutters: 14px on a phone → 48px on desktop, no breakpoint jumps. */
  padding: clamp(14px, 3vw, 24px) clamp(14px, 4vw, 48px) clamp(40px, 6vw, 64px);
  max-width: 1320px; margin: 0 auto;
  width: 100%;
}

.cv-canvas {
  position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: 0.55;
  will-change: transform;
}

/* Aggressive CRT scanlines + flicker overlay across the whole screen. */
@keyframes flicker {
  0%, 100% { opacity: 0.18; }
  50%      { opacity: 0.26; }
  52%      { opacity: 0.10; }
  54%      { opacity: 0.28; }
}
.cv-scanlines {
  position: fixed; inset: 0; z-index: 2; pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    rgba(var(--accent-rgb), 0.07) 0px,
    rgba(var(--accent-rgb), 0.07) 1px,
    transparent 2px,
    transparent 4px
  );
  mix-blend-mode: screen;
  animation: flicker 4.5s infinite;
}
.cv-vignette {
  position: fixed; inset: 0; z-index: 1; pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.85) 100%);
}

.cv-content { position: relative; z-index: 3; }

/* ----- Header / glitch (more frequent + harder) ----- */
@keyframes glitch {
  0%, 70%, 100% { text-shadow: 0 0 6px var(--accent), 0 0 22px var(--accent), 0 0 42px rgba(var(--accent-rgb),0.6); transform: translate(0,0) skewX(0); }
  72% { text-shadow: -4px 0 var(--err), 4px 0 var(--secondary), 0 0 18px var(--accent); transform: translate(-2px, 1px) skewX(-2deg); }
  74% { text-shadow: 5px 0 var(--err), -5px 0 var(--secondary); transform: translate(3px, -1px) skewX(3deg); clip-path: inset(8% 0 35% 0); }
  76% { text-shadow: -2px 0 var(--err), 2px 0 var(--secondary); transform: translate(-1px, 2px); clip-path: inset(40% 0 20% 0); }
  78% { transform: translate(1px,-2px); clip-path: inset(0 0 0 0); }
  88% { text-shadow: 0 0 12px var(--err), 0 0 28px var(--err); transform: translate(-3px, 0) skewX(-4deg); }
  90% { text-shadow: 0 0 10px var(--accent), 0 0 30px var(--accent); transform: translate(2px, 1px) skewX(2deg); }
}
.cv-title {
  font-family: 'VT323', 'Share Tech Mono', monospace;
  /* Scales 30px → 92px across the whole range; never overflows a 320px phone. */
  font-size: clamp(30px, 11vw, 92px);
  font-weight: 400; letter-spacing: clamp(1px, 0.4vw, 4px);
  margin: 0; line-height: 0.95; color: var(--accent);
  animation: glitch 3s infinite;
  text-transform: uppercase;
  overflow-wrap: anywhere;
}
.cv-tagline {
  color: var(--secondary); font-size: clamp(11px, 2.2vw, 14px); margin: 0 0 8px;
  letter-spacing: clamp(1px, 0.7vw, 4px); text-transform: uppercase;
  line-height: 1.4;
  font-weight: 600;
  text-shadow: 0 0 6px rgba(var(--secondary-rgb), 0.4);
}

.cv-tagline-stack {
  position: relative;
  min-height: calc(1.4em * 2 + 4px);
  margin-bottom: 10px;
  overflow: hidden;
}
.cv-tagline-alt {
  position: absolute;
  inset: 0;
  animation: taglineSwap 4.8s ease-in-out infinite;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.cv-tagline-alt.alt {
  animation-delay: 2.4s;
}
@keyframes taglineSwap {
  0%, 38% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
  46%, 92% {
    opacity: 0;
    transform: translateY(-8px);
    filter: blur(1px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

/* Header status bar — DECRYPT mode lights up MODE_ACTIVE in red. */
.cv-statusbar {
  display: flex; gap: 18px; align-items: center; padding: 8px 14px;
  background: rgba(var(--panel-tint), 0.6);
  border: 1px solid rgba(var(--accent-rgb), 0.5);
  border-left: 4px solid var(--accent);
  margin: 8px 0 14px; font-size: 12px; letter-spacing: 2px;
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 100%, 0 100%);
}
.cv-stat-key { color: var(--secondary); }
.cv-stat-val { color: var(--accent); font-weight: 700; }
.cv-stat-dot {
  display: inline-block; width: 10px; height: 10px; background: var(--accent);
  box-shadow: 0 0 10px var(--accent), 0 0 18px var(--accent);
  animation: pulseDot 1.2s infinite;
}
@keyframes pulseDot { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

/* Danger-tuned title — more diffuse, less eye-strain than pure red */
:root.danger .cv-title {
  text-shadow:
    0 0 8px var(--accent),
    0 0 22px var(--accent),
    0 0 48px rgba(var(--accent-rgb), 0.7),
    0 0 4px rgba(255, 255, 255, 0.35);
}
:root.danger .cv-statusbar {
  background:
    linear-gradient(90deg, rgba(var(--accent-rgb), 0.18), rgba(var(--panel-tint), 0.7) 60%);
  border-color: rgba(var(--accent-rgb), 0.65);
  box-shadow: inset 0 0 22px rgba(var(--accent-rgb), 0.15);
}
:root.danger .cv-stat-val {
  text-shadow: 0 0 8px rgba(var(--accent-rgb), 0.9);
}
:root.danger .cv-stat-dot {
  box-shadow:
    0 0 10px var(--accent), 0 0 22px var(--accent),
    0 0 4px #fff;
  animation-duration: 0.9s;
}

@keyframes streamScroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.cv-stream {
  height: 22px; overflow: hidden;
  border-top: 1px solid rgba(var(--accent-rgb), 0.45);
  border-bottom: 1px solid rgba(var(--accent-rgb), 0.45);
  margin-bottom: 28px;
  background: rgba(var(--accent-rgb), 0.05);
}
.cv-stream-inner {
  white-space: nowrap; color: var(--accent-dim); font-size: 13px; line-height: 22px;
  animation: streamScroll 35s linear infinite;
}

/* ----- Panels / steps — sharper, notched corners ----- */
.cv-step {
  background: rgba(var(--panel-tint), 0.85);
  border: 1px solid rgba(var(--accent-rgb), 0.45);
  box-shadow:
    0 0 22px rgba(var(--accent-rgb), 0.22),
    inset 0 0 22px rgba(var(--accent-rgb), 0.06);
  padding: 22px 26px; margin-bottom: 22px; position: relative;
  clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
}
.cv-step::before, .cv-step::after {
  content: ''; position: absolute; width: 16px; height: 16px;
  border: 2px solid var(--accent); pointer-events: none;
}
.cv-step::before { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
.cv-step::after  { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }

/* Danger step panels — the glow lives on the border and outer shadow, not
 * in the fill. A near-opaque dark base gives text something to sit on and
 * makes each panel read as a distinct card again. */
:root.danger .cv-step {
  background:
    linear-gradient(180deg, rgba(var(--accent-rgb), 0.05), rgba(var(--panel-tint), 0.96));
  border-color: rgba(var(--accent-rgb), 0.7);
  box-shadow:
    0 0 26px rgba(var(--accent-rgb), 0.22),
    inset 0 0 26px rgba(var(--accent-rgb), 0.05);
}
:root.danger .cv-step::before, :root.danger .cv-step::after {
  border-color: #fff;
  filter: drop-shadow(0 0 6px var(--accent));
}

.cv-step-head {
  display: flex; align-items: center; gap: 14px; margin-bottom: 16px;
  border-bottom: 1px dashed rgba(var(--accent-rgb), 0.45); padding-bottom: 12px;
}
.cv-step-num {
  display: inline-block; min-width: 38px; padding: 4px 10px;
  background: var(--accent); color: #000; font-weight: 900;
  font-size: 16px; letter-spacing: 1px;
  clip-path: polygon(0 0, 100% 0, 92% 100%, 0 100%);
  box-shadow: 0 0 12px var(--accent);
}
.cv-step-title {
  font-size: 22px; color: var(--accent); letter-spacing: 4px;
  text-transform: uppercase; font-weight: 700;
  text-shadow: 0 0 10px rgba(var(--accent-rgb), 0.6);
}
.cv-step-sub { color: var(--secondary); font-size: 12px; opacity: 0.85; margin-left: auto; letter-spacing: 1px; }

:root.danger .cv-step-num {
  color: #fff;
  text-shadow: 0 0 4px rgba(0,0,0,0.6);
  box-shadow: 0 0 16px var(--accent), inset 0 0 6px rgba(255,255,255,0.25);
}
:root.danger .cv-step-title {
  text-shadow: 0 0 14px rgba(var(--accent-rgb), 0.85);
}

/* ----- Drop zone ----- */
@keyframes spinDash { to { background-position: 32px 0, -32px 0, 0 32px, 0 -32px; } }
.cv-drop {
  padding: 48px 24px; text-align: center;
  background: rgba(var(--accent-rgb), 0.05); cursor: pointer; transition: all 0.2s;
  position: relative;
  background-image:
    linear-gradient(90deg, transparent 50%, var(--accent) 50%),
    linear-gradient(90deg, transparent 50%, var(--accent) 50%),
    linear-gradient(0deg, transparent 50%, var(--accent) 50%),
    linear-gradient(0deg, transparent 50%, var(--accent) 50%);
  background-size: 18px 2px, 18px 2px, 2px 18px, 2px 18px;
  background-position: 0 0, 0 100%, 0 0, 100% 0;
  background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
}

/* In danger: thicker red march-borders + hotter inner glow */
:root.danger .cv-drop {
  background-color: rgba(var(--accent-rgb), 0.08);
  box-shadow: inset 0 0 36px rgba(var(--accent-rgb), 0.18);
}
:root.danger .cv-drop:hover {
  background-color: rgba(var(--accent-rgb), 0.20);
  box-shadow: 0 0 36px var(--accent), inset 0 0 36px rgba(var(--accent-rgb), 0.32);
}
.cv-drop:hover {
  background-color: rgba(var(--accent-rgb), 0.15);
  animation: spinDash 1.4s linear infinite;
  box-shadow: 0 0 32px var(--accent), inset 0 0 28px rgba(var(--accent-rgb), 0.25);
  transform: scale(1.005);
}
.cv-drop.drag {
  background-color: rgba(var(--accent-rgb), 0.25);
  animation: spinDash 0.6s linear infinite;
}
.cv-drop-h {
  font-size: 28px; color: var(--accent); margin-bottom: 8px;
  letter-spacing: 4px; font-weight: 700; text-shadow: 0 0 12px var(--accent);
}
.cv-drop-s { color: var(--secondary); font-size: 12px; letter-spacing: 2px; }

.cv-fileinfo {
  display: grid; grid-template-columns: auto 1fr auto; gap: 16px; align-items: center;
  background: rgba(var(--accent-rgb), 0.1);
  border: 1px solid rgba(var(--accent-rgb), 0.6);
  border-left: 4px solid var(--accent);
  padding: 14px 18px;
  box-shadow: inset 0 0 14px rgba(var(--accent-rgb), 0.1);
}
.cv-icon {
  width: 50px; height: 50px; border: 2px solid var(--accent);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; color: var(--accent); background: #000;
  letter-spacing: 1px; font-weight: 700;
  box-shadow: 0 0 12px var(--accent);
}
.cv-fname { color: var(--accent); font-size: 16px; word-break: break-all; font-weight: 700; }
.cv-fmeta { color: var(--secondary); font-size: 12px; opacity: 0.9; margin-top: 2px; }
.cv-clear-btn {
  background: transparent; border: 1px solid var(--err); color: var(--err);
  padding: 8px 16px; cursor: pointer; font-family: inherit;
  letter-spacing: 2px; transition: all 0.15s;
}
.cv-clear-btn:hover { background: var(--err); color: #000; box-shadow: 0 0 14px var(--err); }

.cv-hex {
  margin-top: 14px; background: #000;
  border: 1px solid rgba(var(--accent-rgb), 0.45);
  padding: 10px; max-height: 140px; overflow: auto;
  color: var(--accent); font-size: 11px; line-height: 1.5; white-space: pre;
}
.cv-hex-h { color: var(--secondary); font-size: 11px; margin-bottom: 4px; letter-spacing: 1px; }

/* ----- Algorithm cards — sharper + corner brackets ----- */
/* Intrinsically responsive: cards reflow 3 → 2 → 1 column on their own as
 * space runs out, so the breakpoints below only fine-tune spacing. */
.cv-grid {
  display: grid;
  /* 300px floor keeps the original 3-across desktop layout (4 would fit at
   * a smaller floor), then degrades to 2 on tablets and 1 on phones. */
  grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr));
  gap: clamp(10px, 1.6vw, 16px);
}
.cv-card {
  background: rgba(var(--panel-tint), 0.7);
  border: 1px solid rgba(var(--accent-rgb), 0.5);
  padding: 16px 18px; cursor: pointer; transition: all 0.18s;
  position: relative; overflow: hidden;
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
}
.cv-card:hover { transform: translateY(-3px); }
.cv-card.compatible:hover {
  box-shadow: 0 0 28px var(--accent), inset 0 0 22px rgba(var(--accent-rgb), 0.22);
}
.cv-card.compatible::after {
  content: ''; position: absolute; top: 0; left: -100%;
  width: 60%; height: 100%; transition: left 0.5s;
  background: linear-gradient(90deg, transparent, rgba(var(--accent-rgb), 0.28), transparent);
}
.cv-card.compatible:hover::after { left: 120%; }
.cv-card.selected {
  border-color: var(--secondary);
  box-shadow:
    0 0 32px var(--secondary),
    inset 0 0 18px rgba(var(--secondary-rgb), 0.25);
  background: rgba(var(--secondary-rgb), 0.12);
}

/* Danger: red-tinted selected card with white border for accessibility */
:root.danger .cv-card.selected {
  border-color: #fff;
  box-shadow:
    0 0 36px var(--accent),
    inset 0 0 22px rgba(var(--accent-rgb), 0.30);
  background: linear-gradient(180deg, rgba(var(--accent-rgb), 0.20), rgba(var(--accent-rgb), 0.06));
}
.cv-card.locked {
  opacity: 0.32; pointer-events: none; border-color: rgba(80,80,80,0.5);
}
.cv-card.incompatible {
  opacity: 0.5; cursor: not-allowed; border-color: rgba(255,0,60,0.55);
}
.cv-card.base64warn {
  border-color: rgba(var(--warn-rgb), 0.6);
  box-shadow: 0 0 16px rgba(var(--warn-rgb), 0.3), inset 0 0 12px rgba(var(--warn-rgb), 0.1);
}
.cv-card-name {
  font-size: 18px; color: var(--accent); margin-bottom: 4px;
  letter-spacing: 3px; font-weight: 700;
  text-shadow: 0 0 8px rgba(var(--accent-rgb), 0.6);
}
.cv-card-desc { font-size: 11px; color: var(--secondary); opacity: 0.85; min-height: 32px; }
.cv-badge {
  display: inline-block; padding: 3px 10px; font-size: 10px; margin-top: 10px;
  border: 1px solid currentColor; letter-spacing: 2px; font-weight: 700;
}
.cv-badge.compatible { color: var(--accent); background: rgba(var(--accent-rgb), 0.1); }
.cv-badge.incompatible { color: var(--err); background: rgba(255,0,60,0.1); }
.cv-badge.base64warn { color: var(--warn); background: rgba(var(--warn-rgb), 0.1); }
.cv-badge.locked { color: #666; background: rgba(50,50,50,0.4); }

.cv-card-overlay {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 6px; background: rgba(0,0,0,0.7);
  font-size: 11px; color: #888; letter-spacing: 2px;
}

.cv-tooltip {
  position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
  background: #000; border: 1px solid currentColor; padding: 6px 10px;
  font-size: 11px; white-space: nowrap; margin-bottom: 6px;
  opacity: 0; pointer-events: none; transition: opacity 0.15s; z-index: 5;
}
.cv-card:hover .cv-tooltip { opacity: 1; }
/* Never renders on touch (no hover), and its nowrap width would exceed a
 * phone viewport if it did — so drop it there entirely. */
@media (hover: none) { .cv-tooltip { display: none; } }

/* ----- Key input panel ----- */
.cv-key-empty {
  text-align: left; padding: 24px;
  border: 1px dashed rgba(var(--accent-rgb), 0.45);
  background: rgba(var(--accent-rgb), 0.04);
}
@keyframes blink { 50% { opacity: 0; } }
.cv-cursor::after {
  content: '_'; color: var(--accent); animation: blink 1s step-end infinite;
}

.cv-input {
  background: #000; border: 1px solid rgba(var(--accent-rgb), 0.55);
  color: var(--accent);
  padding: 12px 14px; font-family: inherit; font-size: 14px; width: 100%;
  outline: none; transition: all 0.15s; letter-spacing: 1px;
}
.cv-input:focus {
  border-color: var(--secondary);
  box-shadow: 0 0 14px var(--secondary), inset 0 0 8px rgba(var(--secondary-rgb), 0.15);
}
.cv-label {
  display: block; font-size: 12px; color: var(--secondary);
  margin-bottom: 6px; letter-spacing: 2px; text-transform: uppercase;
}
.cv-row { display: grid; gap: 14px; }

.cv-matrix-grid { display: grid; gap: 6px; max-width: 280px; }
.cv-matrix-grid input {
  width: 100%; text-align: center; padding: 10px;
  background: #000; border: 1px solid rgba(var(--accent-rgb), 0.55);
  color: var(--accent); font-family: inherit; font-size: 16px;
}

.cv-btn {
  background: transparent; border: 1px solid var(--accent); color: var(--accent);
  padding: 11px 20px; font-family: inherit; font-size: 13px; cursor: pointer;
  letter-spacing: 2px; transition: all 0.15s; font-weight: 700;
  clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%);
}
.cv-btn:hover {
  background: var(--accent); color: #000;
  box-shadow: 0 0 18px var(--accent);
}
.cv-btn.cyan { border-color: var(--secondary); color: var(--secondary); }
.cv-btn.cyan:hover {
  background: var(--secondary); color: #000;
  box-shadow: 0 0 18px var(--secondary);
}

.cv-keyout {
  background: #000; border: 1px solid var(--secondary); padding: 12px;
  margin-top: 12px; font-size: 11px; color: var(--secondary); word-break: break-all;
  box-shadow: 0 0 12px rgba(var(--secondary-rgb), 0.25);
}

.cv-mapping {
  margin-top: 12px; max-height: 200px; overflow: auto;
  border: 1px solid rgba(var(--accent-rgb), 0.45);
}
.cv-mapping table { width: 100%; border-collapse: collapse; font-size: 12px; }
.cv-mapping th, .cv-mapping td {
  padding: 4px 8px; border-bottom: 1px solid rgba(var(--accent-rgb), 0.18);
  text-align: left;
}
.cv-mapping th {
  background: rgba(var(--accent-rgb), 0.12); color: var(--secondary);
  position: sticky; top: 0; letter-spacing: 1px;
}
.cv-mapping td:nth-child(2) { color: var(--warn); font-size: 16px; }

/* ----- Mode toggle — DECRYPT screams red even in green theme ----- */
.cv-mode-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.cv-mode-btn {
  padding: clamp(16px, 2.8vw, 28px); background: #000;
  border: 2px solid rgba(var(--accent-rgb), 0.4);
  color: rgba(var(--accent-rgb), 0.55); font-family: inherit;
  font-size: clamp(16px, 3.2vw, 26px);
  cursor: pointer; letter-spacing: clamp(2px, 0.8vw, 6px);
  transition: all 0.18s; font-weight: 700;
  position: relative; overflow: hidden;
  min-height: 56px;
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
}
.cv-mode-btn:hover { color: var(--accent); border-color: var(--accent); }

/* ENCRYPT active = accent (green or red depending on theme) */
.cv-mode-btn.encrypt.active {
  color: var(--accent); border-color: var(--accent);
  background: rgba(var(--accent-rgb), 0.18);
  box-shadow: 0 0 32px var(--accent), inset 0 0 24px rgba(var(--accent-rgb), 0.4);
  text-shadow: 0 0 14px var(--accent);
}
/* DECRYPT button is always red-tinted as a signal of intent. The label was
 * rgba(255,0,0,.66) — 2.66:1 on black, and in the active state it was the
 * exact same value as its own background (1.00:1, i.e. invisible). Kept red,
 * but at a luminance that actually reads. */
.cv-mode-btn.decrypt { color: #ff4d4d; border-color: rgba(255, 0, 0, 0.8); }
.cv-mode-btn.decrypt:hover {
  color: #ff6b6b; border-color: #ff2a2a;
  box-shadow: 0 0 18px rgba(255, 0, 0, 0.66);
}
.cv-mode-btn.decrypt.active {
  /* White on the red fill: 7.9:1, and the dark shadow keeps the glyph edges
   * crisp against the glow. */
  color: #fff;
  border-color: #ff2a2a;
  background: rgba(255, 0, 0, 0.66);
  box-shadow: 0 0 36px rgba(255, 0, 0, 0.66), inset 0 0 26px rgba(255, 0, 0, 0.5);
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.65), 0 0 22px rgba(255, 60, 60, 0.8);
  animation: alarm 1.4s infinite;
}
@keyframes alarm {
  0%, 100% { box-shadow: 0 0 36px #ff003c, inset 0 0 26px rgba(255,0,60,0.45); }
  50%      { box-shadow: 0 0 60px #ff003c, inset 0 0 36px rgba(255,0,60,0.7);  }
}

/* ----- Execute button — bigger pulse, harder edges ----- */
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 22px var(--accent), inset 0 0 14px rgba(var(--accent-rgb), 0.25); }
  50%      { box-shadow: 0 0 48px var(--accent), inset 0 0 28px rgba(var(--accent-rgb), 0.55); }
}
.cv-exec {
  width: 100%; padding: clamp(16px, 3.2vw, 28px); background: rgba(var(--accent-rgb), 0.1);
  border: 2px solid var(--accent); color: var(--accent); font-family: inherit;
  font-size: clamp(16px, 3.4vw, 28px); letter-spacing: clamp(2px, 1vw, 8px);
  cursor: pointer; transition: all 0.18s;
  animation: pulse 1.8s infinite; font-weight: 700;
  text-shadow: 0 0 14px var(--accent);
  min-height: 60px;
  clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
}
.cv-exec:hover { background: var(--accent); color: #000; }
.cv-exec:disabled {
  opacity: 0.45; cursor: not-allowed; animation: none;
  color: var(--accent-dim); border-color: var(--accent-dim);
  text-shadow: none;
}

/* Danger-tuned execute button — softer alarm, still readable */
:root.danger .cv-exec {
  background: linear-gradient(180deg, rgba(var(--accent-rgb), 0.18), rgba(var(--accent-rgb), 0.05));
  border-width: 2px;
  animation-duration: 1.4s;
  text-shadow: 0 0 10px var(--accent), 0 0 22px rgba(var(--accent-rgb), 0.7);
}
:root.danger .cv-exec:hover {
  background: var(--accent);
  color: #fff;
  text-shadow: 0 0 4px rgba(0,0,0,0.6);
}
.cv-hint { margin-top: 10px; text-align: center; color: var(--secondary); font-size: 13px; letter-spacing: 2px; }

/* Inline keyboard-shortcut chip */
.cv-kbd {
  display: inline-block;
  padding: 2px 6px;
  margin: 0 4px;
  font-size: 11px;
  border: 1px solid rgba(var(--accent-rgb), 0.6);
  border-radius: 3px;
  color: var(--accent);
  background: rgba(var(--accent-rgb), 0.08);
  letter-spacing: 1px;
  font-family: inherit;
}

/* Sticky indeterminate progress bar during encryption */
@keyframes progressSlide {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
.cv-progress {
  position: relative;
  height: 3px;
  margin-top: 10px;
  background: rgba(var(--accent-rgb), 0.12);
  overflow: hidden;
}
.cv-progress::after {
  content: '';
  position: absolute;
  top: 0; left: 0;
  height: 100%; width: 25%;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  animation: progressSlide 1.2s linear infinite;
  box-shadow: 0 0 12px var(--accent);
}

/* ----- Terminal log ----- */
.cv-term {
  background: #000; border: 1px solid rgba(var(--accent-rgb), 0.45);
  padding: 16px;
  font-size: 12px; line-height: 1.7; max-height: 280px; overflow: auto;
  margin-top: 18px;
  box-shadow: inset 0 0 24px rgba(var(--accent-rgb), 0.06);
}
.cv-term-line { white-space: pre-wrap; word-break: break-all; }
.cv-l-ok { color: var(--accent); }
.cv-l-info { color: var(--secondary); }
.cv-l-warn { color: var(--warn); }
.cv-l-err { color: rgb(255,0, 0, 0.66); font-weight: 700; }
.cv-l-step { color: var(--accent); opacity: 0.85; }

:root.danger .cv-term {
  background: linear-gradient(180deg, #0a0002, #000);
  border-color: rgba(var(--accent-rgb), 0.55);
  box-shadow: inset 0 0 28px rgba(var(--accent-rgb), 0.10);
}
:root.danger .cv-l-err { color: #fff; text-shadow: 0 0 8px var(--accent); }
:root.danger .cv-l-warn { color: var(--warn); }

/* ----- Output -----
 * The payoff panel. It reads as a distinct surface from the step cards:
 * lifted off the page background, a solid accent rail down the left edge,
 * and its own internal rhythm (header → meta chips → payload → actions).
 */
@keyframes outputReveal {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.cv-output {
  margin-top: 26px;
  /* Lighter toward the top so the header sits on the brightest band. */
  background:
    linear-gradient(180deg,
      rgba(var(--secondary-rgb), 0.14) 0%,
      rgba(var(--secondary-rgb), 0.05) 42%,
      rgba(0, 0, 0, 0.55) 100%),
    #000;
  border: 1px solid rgba(var(--secondary-rgb), 0.75);
  border-left: 4px solid var(--secondary);
  padding: clamp(16px, 3vw, 24px);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.85),
    0 10px 42px rgba(var(--secondary-rgb), 0.26),
    inset 0 1px 0 rgba(var(--secondary-rgb), 0.35);
  animation: outputReveal 0.32s ease-out both;
  /* No clip-path here: it was shaving the left rail and clipping long
   * filenames on narrow screens. */
}

/* Header row — icon + title on the left, live status pill on the right. */
.cv-output-h {
  display: flex; align-items: center; flex-wrap: wrap; gap: 10px;
  color: var(--secondary);
  font-size: clamp(14px, 2.6vw, 18px);
  letter-spacing: clamp(1.5px, 0.5vw, 3px);
  font-weight: 700;
  margin: 0 0 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(var(--secondary-rgb), 0.28);
  text-shadow: 0 0 12px rgba(var(--secondary-rgb), 0.5);
  overflow-wrap: anywhere;
}
.cv-output-h-text { flex: 1 1 auto; min-width: 0; }
.cv-output-badge {
  flex: 0 0 auto;
  display: inline-flex; align-items: center; gap: 7px;
  padding: 5px 11px;
  font-size: 11px; font-weight: 700; letter-spacing: 2px;
  color: #000; background: var(--secondary);
  box-shadow: 0 0 16px rgba(var(--secondary-rgb), 0.6);
  text-shadow: none;
  white-space: nowrap;
}
.cv-output-badge::before {
  content: ''; width: 7px; height: 7px; border-radius: 50%;
  background: #000; animation: pulseDot 1.2s infinite;
}

/* Meta as discrete chips — scannable, and each value stays glued to its
 * label instead of running together in one dot-joined string. */
.cv-output-meta {
  display: flex; flex-wrap: wrap; gap: 8px;
  margin-bottom: 14px;
}
.cv-meta-chip {
  display: inline-flex; align-items: baseline; gap: 7px;
  padding: 6px 11px;
  background: rgba(var(--accent-rgb), 0.09);
  border: 1px solid rgba(var(--accent-rgb), 0.32);
  font-size: 12px; letter-spacing: 0.5px;
  max-width: 100%; min-width: 0;
}
.cv-meta-chip .k {
  color: var(--secondary); opacity: 0.85;
  font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
  flex: 0 0 auto;
}
.cv-meta-chip .v {
  color: var(--accent); font-weight: 700;
  overflow-wrap: anywhere; min-width: 0;
}

/* ----- RSA key derivation (key panel) ----- */
.cv-derive {
  margin-top: 4px;
  border-left: 2px solid rgba(var(--secondary-rgb), 0.5);
  padding-left: 12px;
}
.cv-derive-h {
  color: var(--secondary); opacity: 0.85;
  font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase;
  margin: 10px 0 4px;
}
.cv-derive-h:first-child { margin-top: 0; }
.cv-derive-row {
  display: flex; gap: 10px; align-items: baseline;
  padding: 3px 0;
  font-size: 11px;
}
.cv-derive-row .k {
  flex: 0 0 42px; color: var(--secondary); font-weight: 700;
}
.cv-derive-row .v {
  color: var(--accent); overflow-wrap: anywhere; min-width: 0;
}
/* The calculated private key is the point of the whole panel — mark it. */
.cv-derive-row.hi {
  background: rgba(var(--warn-rgb), 0.10);
  border: 1px solid rgba(var(--warn-rgb), 0.35);
  padding: 6px 8px; margin: 2px 0;
}
.cv-derive-row.hi .k, .cv-derive-row.hi .v { color: var(--warn); }
.cv-derive-note {
  margin-top: 8px; font-size: 10px; color: var(--secondary); opacity: 0.75;
  letter-spacing: 0.5px;
}

/* ----- RSA per-character walkthrough (output panel) ----- */
.cv-trace { margin-top: 4px; }
.cv-trace-formula {
  display: flex; flex-wrap: wrap; align-items: baseline; gap: 4px 14px;
  background: rgba(var(--secondary-rgb), 0.08);
  border: 1px solid rgba(var(--secondary-rgb), 0.3);
  padding: 10px 12px; margin-bottom: 8px;
  color: var(--secondary); font-size: 14px; font-weight: 700; letter-spacing: 1px;
}
.cv-trace-formula sup { font-size: 0.7em; }
.cv-trace-keys {
  color: var(--accent); font-weight: 400; font-size: 11px; letter-spacing: 0.5px;
  overflow-wrap: anywhere; min-width: 0;
}
/* Visual aids that sit above the table: Playfair's 5×5 square and Hill's
 * key matrix. Both wrap onto their own line when space runs out. */
.cv-trace-aids {
  display: flex; flex-wrap: wrap; gap: 12px; align-items: flex-start;
  margin-bottom: 8px;
}
.cv-square {
  display: inline-flex; flex-direction: column; gap: 2px;
  padding: 8px; background: #000;
  border: 1px solid rgba(var(--accent-rgb), 0.35);
}
.cv-square-row { display: flex; gap: 2px; }
.cv-square-cell {
  width: 26px; height: 26px;
  display: inline-flex; align-items: center; justify-content: center;
  background: rgba(var(--accent-rgb), 0.10);
  color: var(--accent); font-size: 13px; font-weight: 700;
}
.cv-matrixviz {
  display: inline-flex; align-items: stretch; gap: 4px;
  padding: 8px 10px; background: #000;
  border: 1px solid rgba(var(--accent-rgb), 0.35);
  color: var(--secondary);
}
.cv-matrixviz-label {
  align-self: center; margin-right: 4px;
  color: var(--secondary); font-size: 12px; font-weight: 700;
}
.cv-matrixviz-brk {
  color: var(--secondary); font-size: 26px; line-height: 1;
  display: flex; align-items: center;
}
.cv-matrixviz-body { display: inline-flex; flex-direction: column; gap: 2px; }
.cv-matrixviz-row { display: flex; gap: 8px; }
.cv-matrixviz-cell {
  min-width: 26px; text-align: right;
  color: var(--accent); font-size: 12px; font-weight: 700;
}

/* The table is wide by nature — it scrolls inside its own box so the page
 * never does. */
.cv-trace-scroll {
  overflow-x: auto; overflow-y: auto;
  max-height: min(44vh, 340px);
  -webkit-overflow-scrolling: touch;
  border: 1px solid rgba(var(--accent-rgb), 0.35);
  background: #000;
}
.cv-trace-table {
  border-collapse: collapse; font-size: 11px; width: 100%;
}
.cv-trace-table th {
  position: sticky; top: 0; z-index: 1;
  background: rgba(var(--accent-rgb), 0.16);
  color: var(--secondary);
  text-align: left; padding: 7px 10px; white-space: nowrap;
  letter-spacing: 1px; font-weight: 700;
  border-bottom: 1px solid rgba(var(--accent-rgb), 0.4);
}
.cv-trace-table th .sub {
  display: block; font-size: 9px; opacity: 0.7; font-weight: 400; letter-spacing: 0.5px;
}
.cv-trace-table td {
  padding: 6px 10px; vertical-align: top;
  border-bottom: 1px solid rgba(var(--accent-rgb), 0.14);
  white-space: nowrap;
}
.cv-trace-table tr:last-child td { border-bottom: 0; }
/* Slack-absorbing column: takes all remaining width so the data columns
 * size to their content. */
.cv-trace-table th.fill, .cv-trace-table td.fill { width: 100%; padding: 0; }
.cv-trace-table td.ch {
  color: var(--warn); font-size: 15px; font-weight: 700; text-align: center;
}
.cv-trace-table td.num { color: var(--accent); font-weight: 700; }
/* Cipher integers are long; let that one column wrap instead of forcing a
 * very wide scroll. */
.cv-trace-table td.num.big {
  white-space: normal; overflow-wrap: anywhere;
  min-width: 150px; max-width: 260px;
}
.cv-trace-table td.bin { color: var(--accent-dim); font-size: 10px; }
.cv-trace-table td.glyph {
  color: var(--secondary); font-size: 13px; letter-spacing: 1px;
}
.cv-trace-note {
  margin-top: 8px; font-size: 10px; line-height: 1.5;
  color: var(--secondary); opacity: 0.75; letter-spacing: 0.5px;
}

/* Label above the payload block. */
.cv-payload-label {
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
  font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
  color: var(--secondary); opacity: 0.9;
  margin: 14px 0 6px;
}
.cv-payload-label .hint { opacity: 0.6; font-size: 10px; letter-spacing: 1px; }

/* Danger output — red accent instead of cyan, but secondary header stays
 * amber. The opaque #000 base matters: without it the tint composited
 * straight onto the already-red page and the panel washed out. */
:root.danger .cv-output {
  background:
    linear-gradient(180deg,
      rgba(var(--accent-rgb), 0.13) 0%,
      rgba(var(--accent-rgb), 0.05) 42%,
      rgba(0, 0, 0, 0.6) 100%),
    #000;
  border-color: var(--accent);
  border-left-color: var(--accent);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.85),
    0 10px 42px rgba(var(--accent-rgb), 0.3),
    inset 0 1px 0 rgba(var(--accent-rgb), 0.35);
}
:root.danger .cv-output-h {
  color: var(--secondary);
  text-shadow: 0 0 10px rgba(var(--secondary-rgb), 0.6);
}
:root.danger .cv-output-meta {
  color: var(--accent);
  text-shadow: 0 0 6px rgba(var(--accent-rgb), 0.5);
}
.cv-preview {
  background: #000;
  border: 1px solid rgba(var(--accent-rgb), 0.45);
  border-radius: 2px;
  padding: 14px;
  /* Taller and viewport-aware: a phone shows a useful chunk without the
   * block swallowing the screen, and it never exceeds half the viewport. */
  max-height: min(46vh, 320px);
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  color: var(--accent);
  font-size: 13px;
  line-height: 1.65;
  letter-spacing: 0.4px;
  white-space: pre-wrap;
  /* break-all mangled ordinary words; anywhere only breaks when it must. */
  overflow-wrap: anywhere;
  word-break: normal;
  box-shadow: inset 0 0 24px rgba(var(--accent-rgb), 0.07);
  text-shadow: 0 0 8px rgba(var(--accent-rgb), 0.3);
}
.cv-blockviz {
  background: rgba(var(--accent-rgb), 0.06);
  border: 1px solid rgba(var(--accent-rgb), 0.3);
  border-radius: 2px;
  padding: 12px;
  color: var(--secondary);
  font-size: 11px;
  line-height: 1.6;
  /* Fixed-column ASCII art can't reflow, so it scrolls inside its own box
   * rather than widening the page. */
  overflow-x: auto;
  overflow-y: auto;
  max-height: min(34vh, 260px);
  -webkit-overflow-scrolling: touch;
  white-space: pre;
}
/* Actions wrap on their own instead of relying on a breakpoint: the copy
 * button drops under the download button as soon as it stops fitting. */
.cv-dl-row {
  display: flex; flex-wrap: wrap; gap: 12px;
  margin-top: 18px; padding-top: 16px;
  border-top: 1px solid rgba(var(--secondary-rgb), 0.2);
}
.cv-dl {
  flex: 1 1 240px;
  display: inline-flex; align-items: center; justify-content: center;
  padding: clamp(14px, 2.4vw, 20px);
  min-height: 56px;
  background: rgba(var(--accent-rgb), 0.18);
  border: 2px solid var(--accent);
  color: var(--accent); font-family: inherit;
  font-size: clamp(15px, 2.4vw, 20px); cursor: pointer;
  letter-spacing: clamp(1.5px, 0.6vw, 4px); transition: all 0.15s; font-weight: 700;
  text-shadow: 0 0 12px var(--accent);
  box-shadow: 0 0 22px rgba(var(--accent-rgb), 0.45), inset 0 0 14px rgba(var(--accent-rgb), 0.2);
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
}
.cv-dl:hover { background: var(--accent); color: #000; }
.cv-dl:active { transform: translateY(1px); }
/* Copy sits beside download on wide screens, full-width once it wraps.
 * The default .cv-btn parallelogram clips its own left/right borders away,
 * which at full width reads as two floating lines — so this one gets the
 * same notched-corner outline as the download button next to it. */
.cv-dl-row .cv-btn {
  flex: 1 1 150px; min-height: 56px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: clamp(13px, 1.8vw, 15px);
  background: rgba(var(--secondary-rgb), 0.10);
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
}

/* ----- Footer / hex stream ----- */
@keyframes scrollHex {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.cv-footer {
  margin-top: 56px;
  border-top: 1px solid rgba(var(--accent-rgb), 0.45);
  padding-top: 18px; text-align: center;
}
.cv-foot-line {
  color: var(--secondary); font-size: 14px; margin-bottom: 10px;
  letter-spacing: 4px; text-transform: uppercase;
}
.cv-hex-stream { height: 18px; overflow: hidden; opacity: 0.5; }
.cv-hex-stream-inner {
  white-space: nowrap; font-size: 11px; color: var(--accent);
  animation: scrollHex 50s linear infinite;
}

/* ----- Misc utility classes ----- */
.cv-text-accent { color: var(--accent); }
.cv-text-second { color: var(--secondary); }
.cv-text-warn { color: var(--warn); }
.cv-text-err { color: var(--err); }

/* ----- Input source tabs (FILE / TEXT) ----- */
.cv-srctabs { display: flex; gap: 0; margin-bottom: 14px; border: 1px solid rgba(var(--accent-rgb), 0.45); }
.cv-srctab {
  flex: 1; padding: 12px 16px; background: #000; border: 0;
  color: rgba(var(--accent-rgb), 0.5); font-family: inherit; font-size: 14px;
  letter-spacing: 3px; cursor: pointer; transition: all 0.15s; font-weight: 700;
  border-right: 1px solid rgba(var(--accent-rgb), 0.45);
  display: inline-flex; align-items: center; justify-content: center; gap: 10px;
}
.cv-srctab:last-child { border-right: 0; }
.cv-srctab:hover { color: var(--accent); background: rgba(var(--accent-rgb), 0.08); }
.cv-srctab.active {
  color: #000; background: var(--accent);
  box-shadow: inset 0 0 18px rgba(0,0,0,0.3);
  text-shadow: 0 0 8px rgba(0,0,0,0.4);
}
.cv-srctab.active .cv-svg { stroke: #000; filter: none; }

/* ----- Plaintext textarea ----- */
.cv-textarea {
  width: 100%; min-height: 160px; resize: vertical;
  background: #000; border: 1px solid rgba(var(--accent-rgb), 0.55);
  color: var(--accent); font-family: 'Share Tech Mono', monospace; font-size: 14px;
  padding: 14px; outline: none; line-height: 1.5; letter-spacing: 0.5px;
  transition: all 0.15s;
}
.cv-textarea:focus {
  border-color: var(--secondary);
  box-shadow: 0 0 18px var(--secondary), inset 0 0 12px rgba(var(--secondary-rgb), 0.1);
}
.cv-textarea::placeholder { color: var(--accent-dim); opacity: 0.7; }

.cv-text-meta {
  display: flex; gap: 18px; margin-top: 6px; color: var(--secondary);
  font-size: 11px; letter-spacing: 1px;
}
.cv-text-meta .v { color: var(--accent); }

/* ----- WhatsApp bridge ----- */
/* Phone field / note / button wrap independently instead of being crushed
 * into three fixed tracks on narrow screens. */
.cv-wa-row {
  display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
  margin-top: 14px; padding-top: 14px;
  border-top: 1px dashed rgba(var(--accent-rgb), 0.4);
}
.cv-wa-row .cv-input { flex: 1 1 200px; min-width: 0; }
.cv-wa-row > span { flex: 1 1 220px; min-width: 0; }
.cv-wa-row .cv-wa-btn { flex: 0 1 auto; }
.cv-wa-btn {
  padding: 14px 22px; background: rgba(37, 211, 102, 0.15);
  border: 2px solid #25d366; color: #25d366; font-family: inherit;
  font-size: 14px; cursor: pointer; letter-spacing: 2px; font-weight: 700;
  transition: all 0.15s; display: inline-flex; align-items: center; gap: 12px;
  text-shadow: 0 0 8px #25d366;
  box-shadow: 0 0 18px rgba(37, 211, 102, 0.4), inset 0 0 12px rgba(37, 211, 102, 0.1);
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  white-space: nowrap;
}
.cv-wa-btn:hover { background: #25d366; color: #000; text-shadow: none; }
.cv-wa-btn:hover .cv-svg { stroke: #000; filter: none; }
.cv-wa-btn .cv-svg { stroke: #25d366; filter: drop-shadow(0 0 8px #25d366); width: 22px; height: 22px; }
:root.danger .cv-wa-btn {
  background: rgba(37, 211, 102, 0.10);
  box-shadow: 0 0 18px rgba(37, 211, 102, 0.35);
}

/* =============================================================
 * BLOOD MODE — only visible when <html> has .danger
 * Adds a blood-curtain at the top of the page that drips down.
 * ============================================================ */
.cv-blood {
  position: fixed; inset: 0 0 auto 0; height: 100vh;
  z-index: 2; pointer-events: none; opacity: 0;
  transition: opacity 0.6s ease;
  background:
    /* Top edge — a crimson haze hugging the very top of the viewport */
    linear-gradient(180deg,
      rgba(var(--blood-rgb), 0.55) 0%,
      rgba(var(--blood-rgb), 0.22) 8%,
      rgba(var(--blood-rgb), 0.08) 22%,
      transparent 38%),
    /* Three soft crimson pools near the corners + center */
    radial-gradient(ellipse 38% 28% at 12% -6%,  rgba(var(--blood-rgb), 0.65), transparent 70%),
    radial-gradient(ellipse 38% 28% at 88% -6%,  rgba(var(--blood-rgb), 0.65), transparent 70%),
    radial-gradient(ellipse 28% 22% at 50% -4%,  rgba(180, 0, 18, 0.55), transparent 70%);
  mix-blend-mode: screen;
}
:root.danger .cv-blood { opacity: 1; }
/* Vignette starts further out so it darkens the edges without creeping
 * over the content column. */
:root.danger .cv-vignette {
  background: radial-gradient(ellipse at center, transparent 45%, rgba(70, 0, 0, 0.96) 100%);
}
/* Scanlines sit on top of everything, so at 0.32 they were veiling the
 * text. Closer to the green theme's weight now. */
:root.danger .cv-scanlines { opacity: 0.18; }

/* Animated blood drips streaming from the top edge in danger mode */
@keyframes drip {
  0%   { transform: translateY(-100%) scaleY(0.4); opacity: 0; }
  10%  { opacity: 0.95; }
  60%  { transform: translateY(60vh) scaleY(1); opacity: 0.85; }
  100% { transform: translateY(120vh) scaleY(1.4); opacity: 0; }
}
@keyframes dripGlow {
  0%, 100% { filter: drop-shadow(0 0 8px var(--blood)) drop-shadow(0 0 18px rgba(var(--blood-rgb), 0.55)); }
  50%      { filter: drop-shadow(0 0 14px var(--blood)) drop-shadow(0 0 30px rgba(var(--blood-rgb), 0.8)); }
}
.cv-drip {
  position: fixed; top: 0; width: 3px; height: 80px; z-index: 2;
  background: linear-gradient(to bottom,
    transparent 0%,
    var(--blood) 35%,
    var(--blood-deep) 100%);
  border-radius: 0 0 50% 50%;
  box-shadow:
    0 0 14px var(--blood),
    0 0 28px rgba(var(--blood-rgb), 0.7);
  pointer-events: none; opacity: 0;
  animation: dripGlow 2.4s ease-in-out infinite;
}
:root.danger .cv-drip { opacity: 1; animation: drip 5s linear infinite, dripGlow 2.4s ease-in-out infinite; }

/* Alternating fat drips for extra visual rhythm on wider viewports */
.cv-drip.thick {
  width: 5px; height: 110px;
  background: linear-gradient(to bottom,
    transparent 0%, var(--blood) 30%, var(--blood-deep) 100%);
}

@media (max-width: 768px) {
  /* Kill the drip keyframes on mobile but keep a soft static glow if visible */
  .cv-drip { animation: none !important; opacity: 0.6; }
  .cv-blood { opacity: 0.7; }
}

/* =============================================================
 * SVG ICONOGRAPHY
 * ============================================================ */
.cv-svg {
  display: inline-block; vertical-align: middle;
  stroke: var(--accent); fill: none; stroke-width: 2;
  filter: drop-shadow(0 0 6px var(--accent));
}
.cv-svg.dim { stroke: var(--accent-dim); filter: none; opacity: 0.55; }
.cv-svg.second { stroke: var(--secondary); filter: drop-shadow(0 0 6px var(--secondary)); }
.cv-svg.solid { fill: var(--accent); }

/* Step header lock badge */
.cv-step-lock {
  display: inline-flex; align-items: center; justify-content: center;
  width: 32px; height: 32px;
  border: 1px solid rgba(var(--accent-rgb), 0.6);
  background: #000; margin-right: 4px;
}
.cv-step-lock .cv-svg { width: 18px; height: 18px; }

/* Algorithm card icon row */
.cv-card-ico {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 8px;
}
.cv-card-ico .cv-svg { width: 32px; height: 32px; }
.cv-card-ico .cv-card-num { color: var(--secondary); font-size: 11px; letter-spacing: 2px; }

/* Big animated padlock inside the execute button */
.cv-exec-row { display: flex; align-items: center; justify-content: center; gap: 18px; }
.cv-exec-lock {
  width: 38px; height: 38px;
  stroke: currentColor; fill: none; stroke-width: 2.5;
  filter: drop-shadow(0 0 10px currentColor);
}
@keyframes shackle {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-4px); }
}
.cv-exec-lock .shackle { transform-origin: center; animation: shackle 1.8s ease-in-out infinite; }

/* Vault door icon used in the drop zone empty state */
.cv-vault-ico {
  width: 70px; height: 70px; margin-bottom: 14px;
  stroke: var(--accent); fill: none; stroke-width: 2;
  filter: drop-shadow(0 0 14px var(--accent));
}
@keyframes vaultSpin { to { transform: rotate(360deg); } }
.cv-vault-ico .dial { transform-origin: 32px 32px; animation: vaultSpin 6s linear infinite; }

/* Output panel — open vault */
.cv-output-ico {
  width: 28px; height: 28px; vertical-align: middle; margin-right: 8px;
  stroke: var(--secondary); fill: none; stroke-width: 2;
  filter: drop-shadow(0 0 10px var(--secondary));
}

/* File-loaded info icon */
.cv-fileinfo .cv-svg { width: 26px; height: 26px; }

/* Status bar shield icon */
.cv-statusbar .cv-svg { width: 14px; height: 14px; margin-right: 6px; vertical-align: -2px; }

/* Shake the whole layout when the danger theme engages */
@keyframes dangerShake {
  0%, 100% { transform: translate(0, 0); }
  25%      { transform: translate(-2px, 1px); }
  50%      { transform: translate(2px, -1px); }
  75%      { transform: translate(-1px, 2px); }
}
:root.danger .cv-content { animation: dangerShake 0.18s 4; }

/* =============================================================
 * MOBILE RESPONSIVE DESIGN
 * ============================================================ */

/* Defaults — applied to all interactive controls. Kills the
 * 300ms tap delay on mobile browsers and prevents double-zoom. */
button, .cv-btn, .cv-card, .cv-mode-btn, .cv-exec, .cv-dl, .cv-wa-btn,
.cv-srctab, .cv-clear-btn, input, textarea, select {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Respect safe areas on notched / home-indicator phones.
 * Note: these add to the fluid gutter rather than replacing it — an earlier
 * version hard-coded 48px here, which silently cancelled every mobile
 * padding rule below it. */
:root { --cv-safe-t: env(safe-area-inset-top, 0px); --cv-safe-b: env(safe-area-inset-bottom, 0px); }
.cv-root {
  padding-left: max(clamp(14px, 4vw, 48px), env(safe-area-inset-left, 0px));
  padding-right: max(clamp(14px, 4vw, 48px), env(safe-area-inset-right, 0px));
}

/* iOS Safari zooms the page in whenever a focused field is under 16px.
 * That zoom never resets, which is what makes a form feel "broken" on a
 * phone — so every real input is 16px at touch sizes. */
@media (max-width: 900px) {
  .cv-input, .cv-textarea, .cv-matrix-grid input, select.cv-input {
    font-size: 16px;
  }
  /* 44px is the smallest reliably tappable target; the fields measured 37px. */
  .cv-input, .cv-matrix-grid input, select.cv-input {
    min-height: 46px;
    padding: 12px 14px;
  }
}

/* Nothing may push the page sideways. */
img, svg, canvas, video, table, pre { max-width: 100%; }
.cv-preview, .cv-blockviz, .cv-term, .cv-keyout, .cv-hex { overscroll-behavior-x: contain; }

/* Tablets (max-width: 768px) */
@media (max-width: 768px) {
  .cv-root {
    padding: 16px 20px max(48px, env(safe-area-inset-bottom, 24px));
    max-width: 100%;
  }

  .cv-title {
    font-size: 52px;
    letter-spacing: 2px;
  }

  .cv-mode-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .cv-mode-btn {
    padding: 20px;
    font-size: 20px;
    letter-spacing: 4px;
  }

  .cv-exec {
    padding: 20px;
    font-size: 20px;
    letter-spacing: 4px;
  }

  .cv-step-title {
    font-size: 18px;
  }

  .cv-statusbar {
    flex-wrap: wrap;
    gap: 8px 14px;
    font-size: 11px;
  }

  .cv-statusbar > span { white-space: nowrap; }

  .cv-matrix-grid {
    max-width: 100%;
  }

  .cv-wa-row { gap: 8px; }
  .cv-wa-row .cv-input,
  .cv-wa-row > span,
  .cv-wa-row .cv-wa-btn { flex: 1 1 100%; }
  .cv-wa-row .cv-wa-btn { justify-content: center; min-height: 52px; }

  .cv-dl-row { gap: 10px; }

  /* Canvas + scanlines eat ~20-30% of mobile GPU budget — soften them */
  .cv-canvas { opacity: 0.35; }
  .cv-scanlines { opacity: 0.25; }
}

/* Small phones (max-width: 640px) */
@media (max-width: 640px) {
  .cv-title { font-size: 44px; letter-spacing: 1.5px; }
  .cv-tagline-stack { min-height: calc(1.4em * 3); }
  /* Stop the heavy blur tag swap on tiny screens; show both stacked */
  .cv-tagline-alt { animation: none !important; opacity: 1; position: static; white-space: normal; }
  .cv-tagline-alt.alt { display: none; }
  .cv-card { min-height: 0; }
}

/* Mobile (max-width: 480px) */
@media (max-width: 480px) {
  .cv-root {
    padding: 12px 14px max(32px, env(safe-area-inset-bottom, 16px));
  }

  .cv-title {
    font-size: clamp(28px, 9vw, 40px);
    letter-spacing: 1px;
    line-height: 1;
  }

  /* Tagline: stack vertically, plenty of room, full opacity. */
  .cv-tagline-stack { min-height: auto; margin-bottom: 6px; overflow: visible; }
  .cv-tagline-alt {
    position: static;
    display: block;
    margin-top: 2px;
    animation: none !important;
    opacity: 1 !important;
    filter: none !important;
    transform: none !important;
    white-space: normal;
    line-height: 1.45;
  }
  .cv-tagline { color: var(--secondary); }

  .cv-step {
    padding: 14px 16px;
    margin-bottom: 14px;
    /* Tame the clip-path so the notched corners don't overflow tiny viewports */
    clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  }

  .cv-step-head {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
  }

  .cv-step-sub {
    margin-left: 0;
    flex-basis: 100%;
    font-size: 10px;
  }

  .cv-card {
    padding: 12px 14px;
    min-height: 64px;
  }

  .cv-card-name {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .cv-card-desc {
    font-size: 10px;
    min-height: auto;
  }

  .cv-mode-btn {
    padding: 16px 12px;
    font-size: 16px;
    letter-spacing: 2px;
    min-height: 56px;
  }

  .cv-exec {
    padding: 18px 12px;
    font-size: 16px;
    letter-spacing: 2px;
    min-height: 64px;
  }

  .cv-drop {
    padding: 32px 16px;
  }

  .cv-drop-h {
    font-size: 20px;
    letter-spacing: 2px;
  }

  .cv-drop-s {
    font-size: 10px;
  }

  /* font-size stays at 16px (set in the touch block above) — dropping below
   * that is what makes iOS zoom the page in on focus. */
  .cv-input {
    padding: 11px 12px;
  }

  .cv-textarea {
    min-height: 140px;
    padding: 12px;
  }

  .cv-btn {
    padding: 10px 16px;
    font-size: 12px;
    letter-spacing: 1px;
    min-height: 44px;
  }

  /* "[ TEXT / WHATSAPP ]" wrapped to two lines and left the tab row lopsided.
   * Tighter tracking keeps both labels on one line. */
  .cv-srctab {
    font-size: 12px;
    letter-spacing: 1px;
    padding: 12px 8px;
    gap: 6px;
    min-height: 48px;
  }
  .cv-srctab .cv-svg { width: 16px; height: 16px; flex: 0 0 auto; }

  .cv-fileinfo {
    grid-template-columns: auto 1fr;
    gap: 10px;
  }

  .cv-fileinfo .cv-clear-btn {
    grid-column: 1 / -1;
    width: 100%;
    justify-content: center;
    padding: 10px;
  }

  .cv-icon {
    width: 40px;
    height: 40px;
    font-size: 12px;
  }

  .cv-fname {
    font-size: 14px;
  }

  .cv-fmeta {
    font-size: 11px;
  }

  .cv-step-title {
    font-size: 16px;
    letter-spacing: 2px;
  }

  .cv-step-num {
    min-width: 32px;
    padding: 3px 8px;
    font-size: 14px;
  }

  .cv-statusbar {
    gap: 8px;
    padding: 8px 10px;
    font-size: 10px;
    flex-wrap: wrap;
  }
  .cv-statusbar > span { white-space: nowrap; }
  .cv-statusbar > span:last-child { flex-basis: 100%; }

  .cv-matrix-grid {
    max-width: 100%;
    grid-template-columns: repeat(2, 1fr);
  }

  .cv-matrix-grid input {
    padding: 8px;
    min-height: 46px;
  }

  .cv-wa-row { gap: 8px; }
  .cv-wa-row .cv-input,
  .cv-wa-row > span,
  .cv-wa-row .cv-wa-btn { flex: 1 1 100%; }
  .cv-wa-row .cv-wa-btn { justify-content: center; min-height: 52px; }

  .cv-wa-btn {
    padding: 12px 16px;
    font-size: 12px;
    letter-spacing: 1px;
    min-height: 48px;
  }

  /* Both actions go full-width and stack — no half-width tap targets. */
  .cv-dl-row { gap: 10px; }
  .cv-dl, .cv-dl-row .cv-btn { flex: 1 1 100%; }

  .cv-term {
    font-size: 11px;
    max-height: 200px;
  }

  .cv-footer {
    margin-top: 32px;
    padding-top: 12px;
  }

  .cv-foot-line {
    font-size: 12px;
  }

  /* Output stays legible on a phone — sizing is handled by clamp() on the
   * base rules, so only the phone-specific structure is adjusted here. */
  .cv-output { border-left-width: 3px; }
  .cv-output-meta { gap: 6px; }
  .cv-meta-chip { flex: 1 1 100%; padding: 7px 10px; }
  .cv-preview { max-height: 40vh; font-size: 12.5px; }
  .cv-payload-label .hint { display: none; }

  /* RSA only: drop m(binary) and c(hex bytes) so the table stays readable
   * on a phone. The cipher integer and its character mapping — the parts
   * being taught — are kept. Scoped to RSA because column 3 means something
   * different in every other trace (it's the key byte in XOR). */
  .cv-trace-table.algo-rsa th:nth-child(3), .cv-trace-table.algo-rsa td:nth-child(3),
  .cv-trace-table.algo-rsa th:nth-child(5), .cv-trace-table.algo-rsa td:nth-child(5) { display: none; }
  .cv-trace-table td.num.big { min-width: 110px; max-width: 150px; }
  .cv-trace-table th, .cv-trace-table td { padding: 6px 7px; }
  .cv-trace-formula { font-size: 13px; }
  .cv-square-cell { width: 22px; height: 22px; font-size: 12px; }

  /* Stop every expensive paint on phones — drops ~40% GPU work */
  .cv-scanlines { opacity: 0.12; animation: none; }
  .cv-canvas { opacity: 0.22; }
  .cv-drop,
  .cv-card.compatible { animation: none; }
  .cv-drop:hover { animation: none; }
  .cv-hex-stream { display: none; }
  .cv-stream { display: none; }
}

/* Microscopic phones (≤ 380px) — landscape foldables, iPhone SE 1st gen */
@media (max-width: 380px) {
  .cv-root { padding: 10px 12px max(28px, env(safe-area-inset-bottom, 12px)); }
  .cv-title { font-size: 26px; }
  .cv-step { padding: 12px 14px; }
  .cv-statusbar { font-size: 9px; padding: 6px 8px; }
  .cv-mode-btn { font-size: 14px; padding: 14px 10px; letter-spacing: 1.5px; }
  .cv-exec { font-size: 14px; padding: 16px 10px; letter-spacing: 1.5px; }
  .cv-hex { font-size: 10px; max-height: 100px; }
  .cv-fname { font-size: 13px; }
  .cv-icon { width: 36px; height: 36px; }
}
`;

/* ============== CONSTANTS ============== */

const ALGORITHM_VALIDATION = {
  caesar:      { text: 'compatible', image: 'base64warn', binary: 'base64warn' },
  vigenere:    { text: 'compatible', image: 'base64warn', binary: 'base64warn' },
  hill:        { text: 'compatible', image: 'error',      binary: 'error'      },
  playfair:    { text: 'compatible', image: 'error',      binary: 'error'      },
  sha256:      { text: 'compatible', image: 'compatible', binary: 'compatible' },
  feistel64:   { text: 'compatible', image: 'compatible', binary: 'compatible' },
  xor:         { text: 'compatible', image: 'compatible', binary: 'compatible' },
  rsa:         { text: 'compatible', image: 'compatible', binary: 'compatible' },
  banglashift: { text: 'compatible', image: 'error',      binary: 'error'      },
};

const ALGORITHMS = [
  { id: 'caesar',      name: 'CAESAR',       desc: 'Classic shift cipher (~50 BC).',          fact: 'Used by Julius Caesar to communicate with his generals.' },
  { id: 'vigenere',    name: 'VIGENERE',     desc: 'Polyalphabetic keyword cipher.',          fact: '"Le chiffre indéchiffrable" — unbroken for 300 years.' },
  { id: 'hill',        name: 'HILL',         desc: 'Linear-algebra matrix cipher.',           fact: 'Invented by Lester S. Hill in 1929.' },
  { id: 'playfair',    name: 'PLAYFAIR',     desc: 'Digraph 5x5 Polybius substitution.',      fact: 'Used by British forces in WWI and WWII.' },
  { id: 'sha256',      name: 'SHA-256',      desc: 'One-way hashing for file fingerprints.',   fact: 'Produces a 256-bit digest; the same input always maps to the same hash.' },
  { id: 'feistel64',   name: 'FEISTEL-64',   desc: 'Simple 64-bit block cipher with block view.', fact: 'A tiny Feistel network is the easiest way to visualize block cipher rounds.' },
  { id: 'xor',         name: 'XOR',          desc: 'Fast stream-style byte transformer.',      fact: 'Repeating-key XOR is reversible and works on any byte stream.' },
  { id: 'rsa',         name: 'RSA',          desc: 'Public-key BigInt asymmetric crypto.',    fact: 'Rivest, Shamir, Adleman (1977). Powers HTTPS today.' },
  { id: 'banglashift',  name: 'BANGLASHIFT', desc: 'Custom multilingual permutation cipher.', fact: 'Maps Latin alphabet onto a permuted Bangla script.' },
];

const ALG_LABEL = {
  caesar: 'Caesar Cipher',
  vigenere: 'Vigenere Cipher',
  hill: 'Hill Cipher',
  playfair: 'Playfair Cipher',
  sha256: 'SHA-256 Hash',
  feistel64: 'Feistel-64 Block Cipher',
  xor: 'XOR Cipher',
  rsa: 'RSA',
  banglashift: 'BanglaShift',
};

const BANGLA = ['অ','আ','ই','ঈ','উ','ঊ','ঋ','এ','ঐ','ও','ঔ','ক','খ','গ','ঘ','ঙ','চ','ছ','জ','ঝ','ঞ','ট','ঠ','ড','ঢ','ণ'];

/* ============== SVG ICONOGRAPHY ============== */

function Icon({ name, className = '', size = 20 }) {
  const cls = `cv-svg ${className}`;
  const common = { width: size, height: size, viewBox: '0 0 24 24', className: cls, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'lock-closed': return (
      <svg {...common}>
        <rect x="4" y="11" width="16" height="10" />
        <path d="M7 11V8a5 5 0 0 1 10 0v3" />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    );
    case 'lock-open': return (
      <svg {...common}>
        <rect x="4" y="11" width="16" height="10" />
        <path d="M7 11V8a5 5 0 0 1 9.5-2" />
        <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    );
    case 'key': return (
      <svg {...common}>
        <circle cx="8" cy="14" r="4" />
        <path d="M11 14h10" />
        <path d="M17 14v3" />
        <path d="M21 14v3" />
      </svg>
    );
    case 'shield': return (
      <svg {...common}>
        <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
    case 'shield-x': return (
      <svg {...common}>
        <path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z" />
        <path d="m9 9 6 6M15 9l-6 6" />
      </svg>
    );
    case 'vault': return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="16" rx="1" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
        <g className="dial">
          <line x1="12" y1="7" x2="12" y2="9" />
          <line x1="12" y1="15" x2="12" y2="17" />
          <line x1="7" y1="12" x2="9" y2="12" />
          <line x1="15" y1="12" x2="17" y2="12" />
        </g>
      </svg>
    );
    case 'vault-open': return (
      <svg {...common}>
        <rect x="3" y="4" width="11" height="16" rx="1" />
        <path d="M14 4l6 3v10l-6 3" />
        <circle cx="8" cy="12" r="3" />
        <circle cx="8" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
    case 'gears': return (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
      </svg>
    );
    case 'binary': return (
      <svg {...common}>
        <text x="3" y="11" fontSize="10" fontFamily="monospace" fill="currentColor" stroke="none">10</text>
        <text x="3" y="21" fontSize="10" fontFamily="monospace" fill="currentColor" stroke="none">01</text>
        <text x="14" y="11" fontSize="10" fontFamily="monospace" fill="currentColor" stroke="none">01</text>
        <text x="14" y="21" fontSize="10" fontFamily="monospace" fill="currentColor" stroke="none">10</text>
      </svg>
    );
    case 'matrix': return (
      <svg {...common}>
        <path d="M5 3v18M19 3v18M5 3h2M5 21h2M19 3h-2M19 21h-2" />
        <circle cx="10" cy="8" r="0.8" fill="currentColor" stroke="none" />
        <circle cx="14" cy="8" r="0.8" fill="currentColor" stroke="none" />
        <circle cx="10" cy="12" r="0.8" fill="currentColor" stroke="none" />
        <circle cx="14" cy="12" r="0.8" fill="currentColor" stroke="none" />
        <circle cx="10" cy="16" r="0.8" fill="currentColor" stroke="none" />
        <circle cx="14" cy="16" r="0.8" fill="currentColor" stroke="none" />
      </svg>
    );
    case 'grid5': return (
      <svg {...common}>
        <rect x="4" y="4" width="16" height="16" />
        <path d="M4 8h16M4 12h16M4 16h16M8 4v16M12 4v16M16 4v16" />
      </svg>
    );
    case 'sword': return (
      <svg {...common}>
        <path d="M14 4h6v6L9 21l-5-5z" />
        <path d="M5 13l6 6" />
      </svg>
    );
    case 'keypair': return (
      <svg {...common}>
        <circle cx="7" cy="8" r="3" />
        <path d="M10 8h7l1 2-1 2h-7" />
        <circle cx="7" cy="17" r="3" />
        <path d="M10 17h6l1 2-1 2h-6" />
      </svg>
    );
    case 'globe': return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
    );
    case 'file-text': return (
      <svg {...common}>
        <path d="M14 3H6v18h12V7z" />
        <path d="M14 3v4h4M8 12h8M8 16h6" />
      </svg>
    );
    case 'file-image': return (
      <svg {...common}>
        <path d="M14 3H6v18h12V7z" />
        <path d="M14 3v4h4" />
        <circle cx="10" cy="13" r="1.2" />
        <path d="m8 19 3-3 4 3" />
      </svg>
    );
    case 'file-bin': return (
      <svg {...common}>
        <path d="M14 3H6v18h12V7z" />
        <path d="M14 3v4h4" />
        <text x="8" y="17" fontSize="6" fontFamily="monospace" fill="currentColor" stroke="none">10</text>
      </svg>
    );
    case 'skull': return (
      <svg {...common}>
        <path d="M5 11a7 7 0 1 1 14 0v4l-2 2v3h-3v-2h-4v2H7v-3l-2-2z" />
        <circle cx="9" cy="12" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="15" cy="12" r="1.4" fill="currentColor" stroke="none" />
        <path d="M11 16h2" />
      </svg>
    );
    case 'play': return (
      <svg {...common}>
        <path d="M6 4l14 8-14 8z" fill="currentColor" stroke="none" />
      </svg>
    );
    case 'download': return (
      <svg {...common}>
        <path d="M12 3v12" />
        <path d="m7 10 5 5 5-5" />
        <path d="M4 19h16" />
      </svg>
    );
    case 'whatsapp': return (
      <svg {...common} viewBox="0 0 32 32">
        <path d="M16 3a13 13 0 0 0-11 19.7L3 29l6.5-1.7A13 13 0 1 0 16 3z" />
        <path d="M11 11c0-.6.4-1 1-1h1.2c.4 0 .8.3.9.7l.7 2.3c.1.4 0 .8-.3 1l-1 .9a9 9 0 0 0 4.5 4.5l1-1c.2-.3.6-.4 1-.3l2.3.7c.4.1.7.5.7.9V20c0 .6-.4 1-1 1-5 0-11-6-11-11z" />
      </svg>
    );
    case 'paste': return (
      <svg {...common}>
        <rect x="6" y="5" width="12" height="16" rx="1" />
        <path d="M9 5V3h6v2" />
        <path d="M9 11h6M9 15h4" />
      </svg>
    );
    case 'send': return (
      <svg {...common}>
        <path d="m3 12 18-9-7 18-3-7z" />
      </svg>
    );
    default: return null;
  }
}

const ALGO_ICON = {
  caesar:      'sword',
  vigenere:    'binary',
  hill:        'matrix',
  playfair:    'grid5',
  sha256:      'binary',
  feistel64:   'vault',
  xor:         'gears',
  rsa:         'keypair',
  banglashift: 'globe',
};

/* ============== UTILITIES ============== */

function getFileCategory(file) {
  const t = (file.type || '').toLowerCase();
  const name = file.name.toLowerCase();
  if (t.startsWith('image/') || /\.(png|jpe?g|gif|bmp|webp|svg)$/.test(name)) return 'image';
  if (t.startsWith('text/') || t === 'application/json' || t === 'application/xml'
      || /\.(txt|csv|json|xml|md|log|ini|conf|html|css|js|jsx|ts|tsx|py)$/.test(name)) return 'text';
  return 'binary';
}

function fileIcon(cat) {
  return cat === 'image' ? 'IMG' : cat === 'text' ? 'TXT' : 'BIN';
}
function fileIconName(cat) {
  return cat === 'image' ? 'file-image' : cat === 'text' ? 'file-text' : 'file-bin';
}

function formatBytes(n) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  if (n < 1024 * 1024 * 1024) return (n / 1024 / 1024).toFixed(2) + ' MB';
  return (n / 1024 / 1024 / 1024).toFixed(2) + ' GB';
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsText(file, 'utf-8');
  });
}

function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsArrayBuffer(file);
  });
}

function arrayBufferToBase64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  }
  return btoa(bin);
}

function base64ToArrayBuffer(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function getHexDump(buffer, limit = 64) {
  const bytes = new Uint8Array(buffer).subarray(0, limit);
  const lines = [];
  for (let i = 0; i < bytes.length; i += 16) {
    const slice = bytes.subarray(i, i + 16);
    const hex = Array.from(slice).map(b => b.toString(16).padStart(2, '0')).join(' ').padEnd(48, ' ');
    const ascii = Array.from(slice).map(b => (b >= 32 && b < 127) ? String.fromCharCode(b) : '.').join('');
    lines.push(`${i.toString(16).padStart(8, '0')}  ${hex}  ${ascii}`);
  }
  return lines.join('\n') || '(empty)';
}

function getOriginalExt(name) {
  const i = name.lastIndexOf('.');
  return i >= 0 ? name.slice(i) : '';
}

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(bytes) {
  if (!crypto?.subtle) throw new Error('SHA-256 is unavailable in this browser context.');
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return bytesToHex(new Uint8Array(digest));
}

function normalizeBlockKey(keyText) {
  const key = String(keyText || '').trim();
  if (!key) throw new Error('Block cipher key cannot be empty.');
  return key;
}

function makeKeySeed(keyText) {
  let seed = 0x811c9dc5;
  for (const ch of keyText) {
    seed ^= ch.charCodeAt(0);
    seed = Math.imul(seed, 0x01000193) >>> 0;
  }
  return seed >>> 0;
}

function makeRoundKeys(keyText) {
  let seed = makeKeySeed(keyText);
  const roundKeys = [];
  for (let i = 0; i < 4; i++) {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    roundKeys.push(seed >>> 0);
  }
  return roundKeys;
}

function rotl32(value, bits) {
  return ((value << bits) | (value >>> (32 - bits))) >>> 0;
}

function blockRound(r, k) {
  const mixed = (r ^ k) >>> 0;
  return (rotl32(mixed, 7) ^ rotl32((mixed + k) >>> 0, 11) ^ Math.imul(r + 0x9e3779b9, 3)) >>> 0;
}

function readUint32(bytes, offset) {
  return ((bytes[offset] << 24) | (bytes[offset + 1] << 16) | (bytes[offset + 2] << 8) | bytes[offset + 3]) >>> 0;
}

function writeUint32(bytes, offset, value) {
  bytes[offset] = (value >>> 24) & 0xff;
  bytes[offset + 1] = (value >>> 16) & 0xff;
  bytes[offset + 2] = (value >>> 8) & 0xff;
  bytes[offset + 3] = value & 0xff;
}

function feistel64Transform(bytes, keyText, mode, onVisual, rowTrace) {
  const key = normalizeBlockKey(keyText);
  const roundKeys = makeRoundKeys(key);
  const rounds = mode === 'encrypt' ? roundKeys : roundKeys.slice().reverse();
  if (mode === 'decrypt' && bytes.length % 8 !== 0) {
    throw new Error('Feistel-64 ciphertext length must be a multiple of 8 bytes.');
  }
  const padLength = mode === 'encrypt' ? (8 - (bytes.length % 8 || 8)) : 0;
  const padded = new Uint8Array(bytes.length + padLength);
  padded.set(bytes);
  if (padLength) padded.fill(padLength, bytes.length);

  const out = new Uint8Array(padded.length);
  const blockCount = padded.length / 8;
  const visual = [];

  for (let blockIndex = 0; blockIndex < blockCount; blockIndex++) {
    const base = blockIndex * 8;
    let left = readUint32(padded, base);
    let right = readUint32(padded, base + 4);
    const trace = [`[${String(blockIndex).padStart(2, '0')}] ${bytesToHex(padded.subarray(base, base + 8)).toUpperCase()}`];
    if (blockIndex === 0 && rowTrace) {
      rowTrace.push([
        'in',
        '—',
        left.toString(16).padStart(8, '0').toUpperCase(),
        right.toString(16).padStart(8, '0').toUpperCase(),
      ]);
      rowTrace.padLength = padLength;
      rowTrace.blocks = blockCount;
      // The leading "in" row is the starting state, not a round.
      rowTrace.rounds = rounds.length;
    }

    for (let roundIndex = 0; roundIndex < rounds.length; roundIndex++) {
      const nextLeft = right;
      const nextRight = (left ^ blockRound(right, rounds[roundIndex])) >>> 0;
      left = nextLeft;
      right = nextRight;
      const hexL = left.toString(16).padStart(8, '0').toUpperCase();
      const hexR = right.toString(16).padStart(8, '0').toUpperCase();
      trace.push(`  R${roundIndex + 1}: L=${hexL} R=${hexR}`);
      // Round-by-round table for the first block only — that's enough to
      // show the Feistel structure without dumping the whole file.
      if (blockIndex === 0 && rowTrace) {
        rowTrace.push([
          'R' + (roundIndex + 1),
          rounds[roundIndex].toString(16).padStart(8, '0').toUpperCase(),
          hexL, hexR,
        ]);
      }
    }

    writeUint32(out, base, right);
    writeUint32(out, base + 4, left);
    if (blockIndex < 4) {
      trace.push(`  OUT: ${bytesToHex(out.subarray(base, base + 8)).toUpperCase()}`);
      visual.push(trace.join('\n'));
    }
  }

  const result = mode === 'decrypt' ? out.subarray(0, out.length - out[out.length - 1]) : out;
  if (onVisual) onVisual(visual.join('\n\n'));
  return result;
}

function xorBytes(bytes, keyText, trace) {
  const key = normalizeBlockKey(keyText);
  const keyBytes = new TextEncoder().encode(key);
  const bin = (b) => b.toString(2).padStart(8, '0');
  const hex = (b) => b.toString(16).padStart(2, '0').toUpperCase();
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    const kb = keyBytes[i % keyBytes.length];
    out[i] = bytes[i] ^ kb;
    if (traceable(trace)) {
      trace.push([
        String(i),
        `${hex(bytes[i])}  ${bin(bytes[i])}`,
        `${hex(kb)}  ${bin(kb)}`,
        `${hex(out[i])}  ${bin(out[i])}`,
      ]);
    }
  }
  if (trace) trace.key = key;
  return out;
}

/* ============== MODULAR ARITHMETIC (for Hill) ============== */

function mod(n, m) { return ((n % m) + m) % m; }

function modInverseInt(a, m) {
  a = mod(a, m);
  for (let x = 1; x < m; x++) if ((a * x) % m === 1) return x;
  return null;
}

function matrixDet(M) {
  const n = M.length;
  if (n === 2) return M[0][0] * M[1][1] - M[0][1] * M[1][0];
  if (n === 3) {
    return (
      M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1])
    - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0])
    + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0])
    );
  }
  return 0;
}

function matrixCofactor(M) {
  const n = M.length;
  const C = Array.from({ length: n }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const minor = M
        .filter((_, ri) => ri !== r)
        .map(row => row.filter((_, ci) => ci !== c));
      const sub = (minor.length === 2)
        ? minor[0][0] * minor[1][1] - minor[0][1] * minor[1][0]
        : minor[0][0]; // 1x1
      C[r][c] = ((r + c) % 2 === 0 ? 1 : -1) * sub;
    }
  }
  return C;
}

function matrixInverseMod26(M) {
  const det = mod(matrixDet(M), 26);
  const detInv = modInverseInt(det, 26);
  if (detInv == null) return null;
  const n = M.length;
  if (n === 2) {
    const adj = [
      [ mod(M[1][1], 26), mod(-M[0][1], 26) ],
      [ mod(-M[1][0], 26), mod(M[0][0], 26) ],
    ];
    return adj.map(r => r.map(v => mod(v * detInv, 26)));
  }
  // 3x3: adjugate = transpose(cofactor)
  const cof = matrixCofactor(M);
  const adj = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => cof[c][r]));
  return adj.map(r => r.map(v => mod(v * detInv, 26)));
}

/* ============== CIPHERS ============== */

/* Each cipher takes an optional `trace` array. When present, rows are pushed
 * from inside the real loop (capped at TRACE_ROWS) so the walkthrough shown
 * in the UI is the actual computation, not a re-derivation of it. Passing
 * nothing leaves behaviour untouched. */
const TRACE_ROWS = 12;
const traceable = (trace) => trace && trace.length < TRACE_ROWS;

// Totals for the "first N of M" counter. These mirror what each cipher
// actually iterates over, so the denominator matches the rows shown.
const countLetters = (text) => (text.match(/[A-Za-z]/g) || []).length;
function countDigraphs(text) {
  const cleaned = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  let n = 0, i = 0;
  while (i < cleaned.length) {
    if (!cleaned[i + 1] || cleaned[i] === cleaned[i + 1]) i += 1; else i += 2;
    n++;
  }
  return n;
}

function caesarCipher(text, key, mode, trace) {
  const k = mode === 'encrypt' ? key : -key;
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    const base = (c >= 65 && c <= 90) ? 65 : (c >= 97 && c <= 122) ? 97 : 0;
    if (base) {
      const p = c - base;
      const ci = mod(p + k, 26);
      const outCh = String.fromCharCode(ci + base);
      out += outCh;
      if (traceable(trace)) {
        trace.push([text[i], String(p), (k < 0 ? '−' : '+') + Math.abs(k), String(ci), outCh]);
      }
    } else {
      out += text[i];
    }
  }
  return out;
}

function vigenereCipher(text, key, mode, trace) {
  const k = (key || '').toLowerCase().replace(/[^a-z]/g, '');
  if (!k) throw new Error('Vigenere key must contain at least one letter.');
  let out = '', ki = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    let isAlpha = false, base = 0;
    if (c >= 65 && c <= 90)       { isAlpha = true; base = 65; }
    else if (c >= 97 && c <= 122) { isAlpha = true; base = 97; }
    if (isAlpha) {
      const keyCh = k[ki % k.length];
      const shift = k.charCodeAt(ki % k.length) - 97;
      const s = mode === 'encrypt' ? shift : -shift;
      const p = c - base;
      const ci = mod(p + s, 26);
      const outCh = String.fromCharCode(ci + base);
      out += outCh;
      if (traceable(trace)) {
        trace.push([text[i], String(p), keyCh.toUpperCase(), (s < 0 ? '−' : '+') + Math.abs(s), String(ci), outCh]);
      }
      ki++;
    } else {
      out += text[i];
    }
  }
  return out;
}

function hillCipher(text, M, mode, trace) {
  const n = M.length;
  let key = M;
  if (mode === 'decrypt') {
    key = matrixInverseMod26(M);
    if (!key) throw new Error('Matrix is not invertible mod 26 — cannot decrypt.');
  } else {
    if (mod(matrixDet(M), 26) === 0 || modInverseInt(mod(matrixDet(M), 26), 26) == null) {
      throw new Error('Matrix is not invertible mod 26. Decryption would be impossible.');
    }
  }

  // Strip non-alpha, uppercase, pad with X
  const filtered = text.toUpperCase().replace(/[^A-Z]/g, '');
  const padded = filtered + 'X'.repeat((n - (filtered.length % n)) % n);
  let out = '';
  for (let i = 0; i < padded.length; i += n) {
    const block = [];
    for (let j = 0; j < n; j++) block.push(padded.charCodeAt(i + j) - 65);
    const sums = [], outIdx = [];
    for (let r = 0; r < n; r++) {
      let sum = 0;
      for (let c = 0; c < n; c++) sum += key[r][c] * block[c];
      sums.push(sum);
      outIdx.push(mod(sum, 26));
      out += String.fromCharCode(mod(sum, 26) + 65);
    }
    if (traceable(trace)) {
      trace.push([
        padded.slice(i, i + n),
        '[' + block.join(' ') + ']',
        '[' + sums.join(' ') + ']',
        '[' + outIdx.join(' ') + ']',
        outIdx.map(v => String.fromCharCode(v + 65)).join(''),
      ]);
    }
  }
  // The effective matrix differs from the input on decrypt (it's the
  // inverse), so hand it back for display.
  if (trace) trace.matrix = key;
  return out;
}

function playfairBuildSquare(key) {
  const cleaned = (key || '').toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  const seen = new Set();
  let s = '';
  for (const ch of cleaned + 'ABCDEFGHIKLMNOPQRSTUVWXYZ') {
    if (!seen.has(ch)) { seen.add(ch); s += ch; }
  }
  const grid = [];
  for (let r = 0; r < 5; r++) grid.push(s.slice(r * 5, r * 5 + 5).split(''));
  return grid;
}

function playfairFind(grid, ch) {
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++)
    if (grid[r][c] === ch) return [r, c];
  return null;
}

function playfairCipher(text, key, mode, trace) {
  const grid = playfairBuildSquare(key);
  const cleaned = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  // Build digraphs with X filler
  const pairs = [];
  let i = 0;
  while (i < cleaned.length) {
    const a = cleaned[i];
    let b = cleaned[i + 1];
    if (!b) { pairs.push([a, 'X']); i += 1; }
    else if (a === b) { pairs.push([a, 'X']); i += 1; }
    else { pairs.push([a, b]); i += 2; }
  }
  const dir = mode === 'encrypt' ? 1 : -1;
  let out = '';
  for (const [a, b] of pairs) {
    const [r1, c1] = playfairFind(grid, a);
    const [r2, c2] = playfairFind(grid, b);
    let oa, ob, rule;
    if (r1 === r2) {
      rule = 'same row → shift ' + (dir > 0 ? 'right' : 'left');
      oa = grid[r1][mod(c1 + dir, 5)];
      ob = grid[r2][mod(c2 + dir, 5)];
    } else if (c1 === c2) {
      rule = 'same column → shift ' + (dir > 0 ? 'down' : 'up');
      oa = grid[mod(r1 + dir, 5)][c1];
      ob = grid[mod(r2 + dir, 5)][c2];
    } else {
      rule = 'rectangle → swap columns';
      oa = grid[r1][c2];
      ob = grid[r2][c1];
    }
    out += oa + ob;
    if (traceable(trace)) {
      trace.push([a + b, `(${r1},${c1}) (${r2},${c2})`, rule, oa + ob]);
    }
  }
  if (trace) trace.grid = grid;
  return out;
}

/* ============== RSA (BigInt) ============== */

function bigRand(bits) {
  const bytes = Math.ceil(bits / 8);
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  // ensure top bit set so size is correct, ensure odd
  arr[0] |= 0x80;
  arr[bytes - 1] |= 1;
  let n = 0n;
  for (const b of arr) n = (n << 8n) | BigInt(b);
  return n;
}

function modPow(base, exp, m) {
  if (m === 1n) return 0n;
  let result = 1n;
  base = base % m;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % m;
    exp >>= 1n;
    base = (base * base) % m;
  }
  return result;
}

function millerRabin(n, k = 8) {
  if (n < 2n) return false;
  if (n === 2n || n === 3n) return true;
  if (n % 2n === 0n) return false;
  let d = n - 1n, r = 0n;
  while (d % 2n === 0n) { d /= 2n; r++; }
  const witnesses = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
  outer: for (let i = 0; i < Math.min(k, witnesses.length); i++) {
    const a = witnesses[i];
    if (a >= n) continue;
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    for (let j = 0n; j < r - 1n; j++) {
      x = (x * x) % n;
      if (x === n - 1n) continue outer;
    }
    return false;
  }
  return true;
}

function genPrime(bits) {
  while (true) {
    let n = bigRand(bits);
    if (n % 2n === 0n) n += 1n;
    for (let i = 0; i < 200; i++) {
      if (millerRabin(n)) return n;
      n += 2n;
    }
  }
}

function egcd(a, b) {
  if (b === 0n) return [a, 1n, 0n];
  const [g, x1, y1] = egcd(b, a % b);
  return [g, y1, x1 - (a / b) * y1];
}

function modInverseBig(a, m) {
  const [g, x] = egcd(((a % m) + m) % m, m);
  if (g !== 1n) throw new Error('No modular inverse');
  return ((x % m) + m) % m;
}

function generateRSAKeyPair() {
  const bits = 64; // ~64-bit primes for performance
  const p = genPrime(bits);
  let q = genPrime(bits);
  while (q === p) q = genPrime(bits);
  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  const e = 65537n;
  if (phi % e === 0n) return generateRSAKeyPair();
  const d = modInverseBig(e, phi);
  // phi is returned alongside the keys so the UI can show the full
  // derivation (p, q → n, φ(n) → d) the way it's taught, not just the
  // finished key pair.
  return {
    e: e.toString(), n: n.toString(), d: d.toString(),
    p: p.toString(), q: q.toString(), phi: phi.toString(),
  };
}

/* ---------- RSA over text: the per-character (textbook) form ----------
 * File mode packs many bytes into one big integer per block, which is the
 * right thing for throughput but shows nothing you can follow by hand.
 * For string input we encrypt one Unicode code point at a time —
 *   c = m^e mod n,  m = c^d mod n
 * which is exactly the form taught in class, and yields a ciphertext of
 * plain decimal numbers that survives a copy/paste or a WhatsApp message
 * (raw ciphertext bytes do not).
 */

// Ciphertext integer → the characters its bytes stand for. Non-printable
// bytes render as a middle dot so the column stays aligned.
function rsaBytesOfCipher(c) {
  const bytes = [];
  let cc = c;
  while (cc > 0n) { bytes.unshift(Number(cc & 0xffn)); cc >>= 8n; }
  if (!bytes.length) bytes.push(0);
  return bytes;
}
/* Byte → the character it stands for, under Latin-1 (the standard
 * byte-to-character mapping). Cipher bytes are uniformly random, so only
 * about a third land in printable ASCII — rendering the rest as dots hid
 * most of the mapping, so control bytes use the Unicode "control picture"
 * glyphs (␀ ␁ … ␠ ␡) and high bytes use their Latin-1 characters. Every
 * byte therefore gets exactly one visible glyph. */
function rsaByteGlyph(b) {
  if (b <= 32) return String.fromCharCode(0x2400 + b); // ␀ … ␠ (incl. space)
  if (b <= 126) return String.fromCharCode(b);         // printable ASCII
  if (b === 127) return '␡';
  if (b <= 159) return '□';                            // C1 controls: no glyph exists
  if (b === 160) return '␣';                           // NBSP would render invisibly
  return String.fromCharCode(b);                       // ¡ … ÿ
}
function rsaBytesToGlyphs(bytes) {
  return bytes.map(rsaByteGlyph).join('');
}
function rsaBytesToHex(bytes) {
  return bytes.map(b => b.toString(16).padStart(2, '0').toUpperCase()).join(' ');
}
function rsaBytesToBin(bytes) {
  return bytes.map(b => b.toString(2).padStart(8, '0')).join(' ');
}

function rsaEncryptText(text, e, n) {
  const chars = Array.from(text);           // Array.from splits by code point
  const nums = [];
  const trace = [];
  for (const ch of chars) {
    const m = BigInt(ch.codePointAt(0));
    if (m >= n) {
      throw new Error(
        `Character "${ch}" (code ${m}) is not smaller than the modulus n. ` +
        `RSA can only encrypt values below n — generate a larger key pair.`
      );
    }
    const c = modPow(m, e, n);
    nums.push(c);
    if (trace.length < TRACE_ROWS) {
      const bytes = rsaBytesOfCipher(c);
      trace.push({
        ch, m: m.toString(), mBin: m.toString(2).padStart(8, '0'),
        c: c.toString(), hex: rsaBytesToHex(bytes),
        bin: rsaBytesToBin(bytes), glyphs: rsaBytesToGlyphs(bytes),
      });
    }
  }
  return { cipherText: nums.join(' '), count: chars.length, trace };
}

function rsaDecryptText(cipherText, d, n) {
  const tokens = cipherText.trim().split(/\s+/).filter(Boolean);
  if (!tokens.length) throw new Error('No RSA ciphertext numbers found.');
  const bad = tokens.find(t => !/^\d+$/.test(t));
  if (bad) {
    throw new Error(
      `"${bad.slice(0, 24)}" is not a ciphertext number. Text-mode RSA expects ` +
      `space-separated decimal values, as produced by encrypting in TEXT mode.`
    );
  }
  let out = '';
  const trace = [];
  for (const t of tokens) {
    const c = BigInt(t);
    const m = modPow(c, d, n);
    const code = Number(m);
    if (!Number.isSafeInteger(code) || code > 0x10ffff) {
      throw new Error('Decryption produced a value outside the Unicode range — wrong key (d or n).');
    }
    const ch = String.fromCodePoint(code);
    out += ch;
    if (trace.length < TRACE_ROWS) {
      const bytes = rsaBytesOfCipher(c);
      trace.push({
        ch, m: m.toString(), mBin: m.toString(2).padStart(8, '0'),
        c: c.toString(), hex: rsaBytesToHex(bytes),
        bin: rsaBytesToBin(bytes), glyphs: rsaBytesToGlyphs(bytes),
      });
    }
  }
  return { plainText: out, count: tokens.length, trace };
}

// Bytes per encryption block. We pack `inBytes` data + 1 byte length tag
// into m, so m fits in (inBytes+1)*8 bits and must stay < n (`bits` bits).
function rsaBlockSizes(n) {
  let bits = 0; let nn = n;
  while (nn > 0n) { bits++; nn >>= 1n; }
  // Need (inBytes+1)*8 <= bits-1  →  inBytes <= floor((bits-1)/8) - 1
  const inBytes = Math.max(1, Math.floor((bits - 1) / 8) - 1);
  const outBytes = Math.ceil(bits / 8) + 1;                        // output chunk size (fixed-width)
  return { inBytes, outBytes };
}

async function rsaEncryptBytes(bytes, e, n, onProgress) {
  const { inBytes, outBytes } = rsaBlockSizes(n);
  const numBlocks = Math.ceil(bytes.length / inBytes);
  const out = new Uint8Array(numBlocks * outBytes);
  for (let i = 0; i < numBlocks; i++) {
    const start = i * inBytes;
    const slice = bytes.subarray(start, Math.min(start + inBytes, bytes.length));
    let m = 0n;
    for (const b of slice) m = (m << 8n) | BigInt(b);
    // encode actual byte length in top byte of input as a length tag is unsafe — use prefix length byte instead
    // Instead embed length in block by prepending byte count (we'll simply pad on encrypt with leading 1-byte length)
    // But simpler: prepend 0x01 marker so leading zeros in last block don't get lost. We'll use a dedicated padding byte.
    m = (m << 8n) | BigInt(slice.length); // length tag (bytes 1..inBytes)
    const c = modPow(m, e, n);
    // write c as outBytes big-endian
    let cc = c;
    for (let k = outBytes - 1; k >= 0; k--) {
      out[i * outBytes + k] = Number(cc & 0xffn);
      cc >>= 8n;
    }
    if (onProgress && (i % 64 === 0 || i === numBlocks - 1)) {
      onProgress((i + 1) / numBlocks);
      await new Promise(r => setTimeout(r, 0));
    }
  }
  return out;
}

async function rsaDecryptBytes(bytes, d, n, onProgress) {
  const { outBytes } = rsaBlockSizes(n);
  if (bytes.length % outBytes !== 0) throw new Error('RSA ciphertext length mismatch — wrong key or corrupted file.');
  const numBlocks = bytes.length / outBytes;
  const result = [];
  for (let i = 0; i < numBlocks; i++) {
    let c = 0n;
    for (let k = 0; k < outBytes; k++) c = (c << 8n) | BigInt(bytes[i * outBytes + k]);
    const m = modPow(c, d, n);
    // last byte = length tag
    const lenTag = Number(m & 0xffn);
    let mm = m >> 8n;
    const arr = new Array(lenTag);
    for (let k = lenTag - 1; k >= 0; k--) {
      arr[k] = Number(mm & 0xffn);
      mm >>= 8n;
    }
    for (const b of arr) result.push(b);
    if (onProgress && (i % 64 === 0 || i === numBlocks - 1)) {
      onProgress((i + 1) / numBlocks);
      await new Promise(r => setTimeout(r, 0));
    }
  }
  return new Uint8Array(result);
}

/* ============== BANGLA SHIFT ============== */

function banglaPermutedArray(permKey) {
  const k = (permKey || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const shift = mod(k, 26);
  return BANGLA.slice(shift).concat(BANGLA.slice(0, shift));
}

function banglaShift(text, langKey, permKey, mode, trace) {
  if (!permKey) throw new Error('BanglaShift permutation key cannot be empty.');
  const arr = banglaPermutedArray(permKey);
  if (trace) {
    trace.sum = [...permKey].reduce((a, c) => a + c.charCodeAt(0), 0);
    trace.shift = mod(trace.sum, 26);
    // Counts characters this mode actually maps — Latin a–z when
    // encrypting, Bangla glyphs when decrypting — so the "first N of M"
    // denominator matches the rows rather than the other alphabet.
    trace.count = 0;
  }
  if (mode === 'encrypt') {
    let out = '';
    for (const ch of text) {
      const lower = ch.toLowerCase();
      const code = lower.charCodeAt(0);
      if (code >= 97 && code <= 122) {
        const idx = code - 97;
        out += arr[idx];
        if (trace) trace.count++;
        if (traceable(trace)) trace.push([ch, String(idx), lower, arr[idx]]);
      } else out += ch;
    }
    return out;
  } else {
    const reverse = new Map();
    for (let i = 0; i < 26; i++) reverse.set(arr[i], String.fromCharCode(97 + i));
    let out = '';
    // iterate by code-points to handle Bangla unicode correctly
    for (const ch of text) {
      const hit = reverse.has(ch);
      out += hit ? reverse.get(ch) : ch;
      if (hit && trace) {
        trace.count++;
        if (traceable(trace)) {
          const latin = reverse.get(ch);
          trace.push([ch, String(latin.charCodeAt(0) - 97), ch, latin]);
        }
      }
    }
    return out;
  }
}

/* ============== UI: MATRIX RAIN ============== */

function MatrixRain({ banglaActive, danger }) {
  const ref = useRef(null);
  const animRef = useRef(0);
  const dropsRef = useRef([]);
  const lastTickRef = useRef(0);
  const visibleRef = useRef(false);
  const banglaRef = useRef(banglaActive);
  const dangerRef = useRef(danger);
  banglaRef.current = banglaActive;
  dangerRef.current = danger;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, cols = 0, cellSize = 14;
    // Detect low-power devices & small viewports to throttle the rain.
    const isMobile = window.innerWidth < 768;
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const targetFPS = (isMobile || isCoarse) ? 24 : 60;
    const frameInterval = 1000 / targetFPS;

    const charset = '01ABCDEF0123456789!@#$%&*+=<>'.split('');
    const banglaSet = BANGLA;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75);
      w = canvas.width = Math.floor(window.innerWidth * dpr);
      h = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Larger cells on phones = fewer columns = cheaper paint.
      cellSize = isMobile ? 18 : 14;
      cols = Math.ceil(window.innerWidth / cellSize);
      dropsRef.current = Array(cols).fill(0).map(() => Math.random() * window.innerHeight / cellSize);
    };
    resize();
    window.addEventListener('resize', resize);

    // Pause the canvas when it's offscreen (e.g. another tab).
    const io = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0 }
    );
    io.observe(canvas);

    const draw = (ts) => {
      if (!visibleRef.current) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      const elapsed = ts - lastTickRef.current;
      if (elapsed < frameInterval) {
        animRef.current = requestAnimationFrame(draw);
        return;
      }
      lastTickRef.current = ts - (elapsed % frameInterval);
      const W = window.innerWidth;
      const H = window.innerHeight;
      ctx.fillStyle = dangerRef.current ? 'rgba(8, 0, 0, 0.10)' : 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = cellSize + 'px "Share Tech Mono", monospace';
      const drops = dropsRef.current;
      const baseColor = dangerRef.current ? '#ff003c' : '#00ff41';
      const headColor = dangerRef.current ? '#ffaaaa' : '#aaffaa';
      // Skip every other column on mobile to halve fillText calls.
      const stride = isMobile ? 2 : 1;
      for (let i = 0; i < drops.length; i += stride) {
        const useBangla = banglaRef.current && Math.random() < 0.3;
        const set = useBangla ? banglaSet : charset;
        const ch = set[Math.floor(Math.random() * set.length)];
        const x = i * cellSize;
        const y = drops[i] * cellSize;
        const isHead = Math.random() < 0.04;
        ctx.fillStyle = useBangla ? '#ffc800' : (isHead ? headColor : baseColor);
        ctx.fillText(ch, x, y);
        if (y > H && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      io.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="cv-canvas" aria-hidden="true" />;
}

/* ============== UI: FILE DROP ============== */

function FileDropZone({ file, onFile, onClear, fileCategory, hexDump }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);

  if (file) {
    return (
      <>
        <div className="cv-fileinfo">
          <div className="cv-icon">
            <Icon name={fileIconName(fileCategory)} size={26} />
          </div>
          <div>
            <div className="cv-fname">{file.name}</div>
            <div className="cv-fmeta">
              {file.type || 'unknown/binary'} · {formatBytes(file.size)} · category: {fileCategory.toUpperCase()}
            </div>
          </div>
          <button className="cv-clear-btn" onClick={onClear}>[ X ] CLEAR</button>
        </div>
        <div className="cv-hex-h">// First 64 bytes — hex dump</div>
        <div className="cv-hex">{hexDump}</div>
      </>
    );
  }

  return (
    <div
      className={'cv-drop' + (drag ? ' drag' : '')}
      onClick={() => inputRef.current && inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault(); setDrag(false);
        if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
      }}
    >
      <input
        ref={inputRef} type="file" style={{ display: 'none' }}
        onChange={(e) => e.target.files[0] && onFile(e.target.files[0])}
      />
      <svg className="cv-vault-ico" viewBox="0 0 64 64" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="8" width="52" height="48" rx="2" />
        <circle cx="32" cy="32" r="16" />
        <circle cx="32" cy="32" r="3" fill="currentColor" stroke="none" />
        <g className="dial">
          <line x1="32" y1="18" x2="32" y2="22" />
          <line x1="32" y1="42" x2="32" y2="46" />
          <line x1="18" y1="32" x2="22" y2="32" />
          <line x1="42" y1="32" x2="46" y2="32" />
          <line x1="22" y1="22" x2="25" y2="25" />
          <line x1="39" y1="39" x2="42" y2="42" />
          <line x1="22" y1="42" x2="25" y2="39" />
          <line x1="39" y1="25" x2="42" y2="22" />
        </g>
        <line x1="6" y1="14" x2="58" y2="14" />
        <line x1="6" y1="50" x2="58" y2="50" />
      </svg>
      <div className="cv-drop-h">{'>'} DROP FILE HERE_</div>
      <div className="cv-drop-s">// or click to browse · supported: text, image, binary</div>
    </div>
  );
}

/* ============== UI: ALGORITHM CARD ============== */

const AlgorithmCard = React.memo(function AlgorithmCard({ algo, state, selected, onSelect }) {
  const cls = `cv-card ${state} ${selected ? 'selected' : ''}`;
  let badgeText, tooltip;
  if (state === 'compatible') { badgeText = 'COMPATIBLE'; tooltip = `[INFO] ${algo.fact}`; }
  else if (state === 'incompatible') {
    badgeText = 'INCOMPATIBLE';
    tooltip = `[ERROR] ${ALG_LABEL[algo.id]} requires text input. This file type is not supported.`;
  }
  else if (state === 'base64warn') {
    badgeText = 'BASE64 MODE';
    tooltip = `[WARN] File will be Base64-encoded before encryption. Output is a .txt file.`;
  } else { badgeText = 'LOCKED'; }

  const clickable = state !== 'incompatible' && state !== 'locked';
  return (
    <div
      className={cls}
      onClick={clickable ? () => onSelect(algo.id) : undefined}
      role="button"
      tabIndex={clickable ? 0 : -1}
      aria-pressed={selected}
      aria-disabled={!clickable}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault(); onSelect(algo.id);
        }
      }}
    >
      <div className="cv-card-ico">
        <Icon name={ALGO_ICON[algo.id] || 'gears'} size={32}
          className={state === 'incompatible' ? 'dim' : ''} />
        <span className="cv-card-num">CIPHER_0{ALGORITHMS.findIndex(a => a.id === algo.id) + 1}</span>
      </div>
      <div className="cv-card-name">{algo.name}</div>
      <div className="cv-card-desc">{algo.desc}</div>
      <span className={`cv-badge ${state}`}>{badgeText}</span>
      {state === 'locked' && (
        <div className="cv-card-overlay">
          <Icon name="lock-closed" size={32} className="dim" />
          <div>UPLOAD FILE FIRST</div>
        </div>
      )}
      {state !== 'locked' && tooltip && (
        <div className="cv-tooltip" style={{ color:
          state === 'incompatible' ? C.red : state === 'base64warn' ? C.amber : 'var(--secondary)'
        }}>{tooltip}</div>
      )}
    </div>
  );
});

/* ============== UI: KEY INPUT PANEL ============== */

function KeyInputPanel({ algo, keyState, setKey }) {
  if (!algo) {
    return (
      <div className="cv-key-empty">
        <div style={{ color: 'var(--accent)', fontSize: 16 }}>{'>'} KEY_INPUT</div>
        <div style={{ color: 'var(--secondary)', marginTop: 8 }}>// Waiting for algorithm selection...</div>
        <div style={{ color: 'var(--accent-dim)', marginTop: 4 }} className="cv-cursor">// Select an algorithm to configure key inputs</div>
      </div>
    );
  }

  if (algo === 'sha256') {
    return (
      <div className="cv-key-empty">
        <div style={{ color: 'var(--accent)', fontSize: 16 }}>{'>'} HASH_READY</div>
        <div style={{ color: 'var(--secondary)', marginTop: 8 }}>// SHA-256 needs no key. It fingerprints the current input as-is.</div>
        <div style={{ color: 'var(--accent-dim)', marginTop: 4 }} className="cv-cursor">// Select EXECUTE to generate a digest</div>
      </div>
    );
  }

  if (algo === 'feistel64') {
    const v = keyState.blockKey ?? 'vault-key';
    return (
      <div>
        <label className="cv-label">// BLOCK KEY [passphrase]</label>
        <input
          type="text" className="cv-input"
          value={v}
          onChange={(e) => setKey({ ...keyState, blockKey: e.target.value })}
          placeholder="e.g. vault-key"
        />
        <div style={{ color: 'var(--secondary)', fontSize: 12, marginTop: 8 }}>
          // 64-bit blocks, 4 Feistel rounds, reversible on encrypt/decrypt
        </div>
      </div>
    );
  }

  if (algo === 'xor') {
    const v = keyState.xorKey ?? 'key';
    return (
      <div>
        <label className="cv-label">// XOR KEY [passphrase]</label>
        <input
          type="text" className="cv-input"
          value={v}
          onChange={(e) => setKey({ ...keyState, xorKey: e.target.value })}
          placeholder="e.g. key"
        />
        <div style={{ color: 'var(--secondary)', fontSize: 12, marginTop: 8 }}>
          // Repeating-key XOR works on text, images, and binary streams
        </div>
      </div>
    );
  }

  if (algo === 'caesar') {
    const v = keyState.caesarShift ?? '';
    return (
      <div>
        <label className="cv-label">// SHIFT VALUE [0-25]</label>
        <input
          type="number" min="0" max="25" className="cv-input"
          value={v}
          onChange={(e) => setKey({ ...keyState, caesarShift: e.target.value })}
          placeholder="e.g. 3"
        />
        {v !== '' && (parseInt(v, 10) > 25 || parseInt(v, 10) < 0) &&
          <div style={{ color: C.amber, fontSize: 12, marginTop: 6 }}>[WARN] Shift will be reduced mod 26.</div>}
      </div>
    );
  }

  if (algo === 'vigenere') {
    const v = keyState.vigenereKey ?? '';
    return (
      <div>
        <label className="cv-label">// KEYWORD [alphabetic]</label>
        <input
          type="text" className="cv-input"
          value={v}
          onChange={(e) => setKey({ ...keyState, vigenereKey: e.target.value.replace(/[^a-zA-Z]/g, '') })}
          placeholder="e.g. LEMON"
        />
        {v && v.length < 3 && <div style={{ color: C.amber, fontSize: 12, marginTop: 6 }}>[WARN] Short keys are weak. Use 3+ letters.</div>}
      </div>
    );
  }

  if (algo === 'playfair') {
    const v = keyState.playfairKey ?? '';
    return (
      <div>
        <label className="cv-label">// KEYWORD [alphabetic — builds 5x5 grid]</label>
        <input
          type="text" className="cv-input"
          value={v}
          onChange={(e) => setKey({ ...keyState, playfairKey: e.target.value.replace(/[^a-zA-Z]/g, '') })}
          placeholder="e.g. PLAYFAIR EXAMPLE"
        />
        {v && v.length < 3 && <div style={{ color: C.amber, fontSize: 12, marginTop: 6 }}>[WARN] Short keys are weak. Use 3+ letters.</div>}
      </div>
    );
  }

  if (algo === 'hill') {
    const dim = keyState.hillDim ?? 2;
    const matrix = keyState.hillMatrix ?? [[1,0],[0,1]];
    const setMatrix = (m) => setKey({ ...keyState, hillMatrix: m });
    const setDim = (d) => {
      const m = Array.from({ length: d }, (_, r) => Array.from({ length: d }, (_, c) => r === c ? 1 : 0));
      setKey({ ...keyState, hillDim: d, hillMatrix: m });
    };
    let detVal = null, invertible = false;
    try { detVal = mod(matrixDet(matrix), 26); invertible = modInverseInt(detVal, 26) != null; } catch {}
    return (
      <div>
        <label className="cv-label">// MATRIX DIMENSION</label>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button className={'cv-btn ' + (dim === 2 ? '' : 'cyan')} onClick={() => setDim(2)} style={dim === 2 ? { background: 'var(--accent)', color: '#000' } : {}}>2 x 2</button>
          <button className={'cv-btn ' + (dim === 3 ? '' : 'cyan')} onClick={() => setDim(3)} style={dim === 3 ? { background: 'var(--accent)', color: '#000' } : {}}>3 x 3</button>
        </div>
        <label className="cv-label">// KEY MATRIX (mod 26)</label>
        <div className="cv-matrix-grid" style={{ gridTemplateColumns: `repeat(${dim}, 1fr)` }}>
          {matrix.flat().map((val, idx) => {
            const r = Math.floor(idx / dim), c = idx % dim;
            return (
              <input
                key={idx} type="number"
                value={val}
                onChange={(e) => {
                  const next = matrix.map(row => row.slice());
                  next[r][c] = parseInt(e.target.value, 10) || 0;
                  setMatrix(next);
                }}
              />
            );
          })}
        </div>
        <div style={{ marginTop: 10, fontSize: 12, color: invertible ? 'var(--accent)' : C.red }}>
          det mod 26 = {detVal} — {invertible ? '[OK] Invertible' : '[ERROR] Not invertible mod 26'}
        </div>
      </div>
    );
  }

  if (algo === 'rsa') {
    const generate = () => {
      try {
        const kp = generateRSAKeyPair();
        setKey({ ...keyState, rsaE: kp.e, rsaN: kp.n, rsaD: kp.d, rsaGenerated: kp });
      } catch (err) { alert('Key gen failed: ' + err.message); }
    };
    return (
      <div className="cv-row">
        <div>
          <label className="cv-label">// PUBLIC EXPONENT (e) — for encrypt; or PRIVATE (d) for decrypt</label>
          <input className="cv-input" placeholder="e.g. 65537"
            value={keyState.rsaE ?? ''}
            onChange={(e) => setKey({ ...keyState, rsaE: e.target.value.replace(/[^0-9]/g, '') })}
          />
        </div>
        <div>
          <label className="cv-label">// MODULUS (n)</label>
          <input className="cv-input" placeholder="e.g. 12345..."
            value={keyState.rsaN ?? ''}
            onChange={(e) => setKey({ ...keyState, rsaN: e.target.value.replace(/[^0-9]/g, '') })}
          />
        </div>
        <div>
          <label className="cv-label">// PRIVATE EXPONENT (d) — only needed for decrypt</label>
          <input className="cv-input" placeholder="(decrypt only)"
            value={keyState.rsaD ?? ''}
            onChange={(e) => setKey({ ...keyState, rsaD: e.target.value.replace(/[^0-9]/g, '') })}
          />
        </div>
        <button className="cv-btn cyan" onClick={generate} style={{ padding: '14px', fontSize: 14 }}>
          [ + ] GENERATE KEY PAIR
        </button>
        {keyState.rsaGenerated && (
          <div className="cv-keyout">
            <div style={{ color: 'var(--accent)', marginBottom: 8 }}>[OK] Key pair generated</div>

            {/* The derivation, in the order it's worked through by hand. */}
            <div className="cv-derive">
              <div className="cv-derive-h">// STEP 1 — pick two primes</div>
              <div className="cv-derive-row"><span className="k">p</span><span className="v">{keyState.rsaGenerated.p}</span></div>
              <div className="cv-derive-row"><span className="k">q</span><span className="v">{keyState.rsaGenerated.q}</span></div>

              <div className="cv-derive-h">// STEP 2 — modulus n = p × q</div>
              <div className="cv-derive-row"><span className="k">n</span><span className="v">{keyState.rsaGenerated.n}</span></div>

              <div className="cv-derive-h">// STEP 3 — totient φ(n) = (p−1)(q−1)</div>
              <div className="cv-derive-row"><span className="k">φ(n)</span><span className="v">{keyState.rsaGenerated.phi}</span></div>

              <div className="cv-derive-h">// STEP 4 — public exponent e, coprime to φ(n)</div>
              <div className="cv-derive-row"><span className="k">e</span><span className="v">{keyState.rsaGenerated.e}</span></div>

              <div className="cv-derive-h">// STEP 5 — private key, calculated: d = e⁻¹ mod φ(n)</div>
              <div className="cv-derive-row hi"><span className="k">d</span><span className="v">{keyState.rsaGenerated.d}</span></div>
              <div className="cv-derive-note">
                verify: (e × d) mod φ(n) = 1 — so m<sup>ed</sup> ≡ m (mod n)
              </div>
            </div>

            <div style={{ color: C.amber, marginTop: 8 }}>
              // PUBLIC KEY = (e, n) · PRIVATE KEY = (d, n) — save d to decrypt later.
            </div>
          </div>
        )}
      </div>
    );
  }

  if (algo === 'banglashift') {
    const v = keyState.banglaPerm ?? '';
    const arr = banglaPermutedArray(v);
    return (
      <div className="cv-row">
        <div>
          <label className="cv-label">// TARGET SCRIPT</label>
          <select className="cv-input" value="bn" disabled>
            <option value="bn">Bangla (বাংলা)</option>
          </select>
        </div>
        <div>
          <label className="cv-label">// PERMUTATION KEY</label>
          <input className="cv-input" placeholder="any text"
            value={v}
            onChange={(e) => setKey({ ...keyState, banglaPerm: e.target.value })}
          />
        </div>
        <div>
          <div className="cv-label">// LIVE MAPPING PREVIEW</div>
          <div className="cv-mapping">
            <table>
              <thead><tr><th>EN</th><th>BN</th></tr></thead>
              <tbody>
                {arr.map((bn, i) => (
                  <tr key={i}>
                    <td>{String.fromCharCode(97 + i)}</td>
                    <td>{bn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ============== UI: MODE TOGGLE ============== */

function ModeToggle({ mode, setMode }) {
  return (
    <div className="cv-mode-row">
      <button
        className={'cv-mode-btn encrypt' + (mode === 'encrypt' ? ' active' : '')}
        onClick={() => setMode('encrypt')}
      >
        [ ENCRYPT ]
      </button>
      <button
        className={'cv-mode-btn decrypt' + (mode === 'decrypt' ? ' active' : '')}
        onClick={() => setMode('decrypt')}
      >
        [ DECRYPT ]
      </button>
    </div>
  );
}

/* ============== UI: TERMINAL LOG ============== */

const TerminalLog = React.memo(function TerminalLog({ lines }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [lines]);
  if (!lines.length) return null;
  return (
    <div className="cv-term" ref={ref} role="log" aria-live="polite" aria-label="Cipher execution log">
      {lines.map((l, i) => <div key={i} className={`cv-term-line cv-l-${l.kind}`}>{l.text}</div>)}
    </div>
  );
});

/* ============== UI: STEP-BY-STEP TRACE ==============
 * One renderer for every algorithm. The rows are collected inside each
 * cipher's real loop, so what's shown here is the actual computation.
 *
 * trace = {
 *   algo, mode, formula, keys,   // heading + the maths line
 *   columns: [{ label, sub, cls }],
 *   rows: [[cell, ...]],
 *   total, unit,                 // "first 12 of 40 characters"
 *   square, matrix,              // optional visual aids
 *   notes: [string],
 * }
 */
const CELL_CLASS = ['ch', 'num', 'bin', 'num', 'bin', 'glyph'];

/* RSA keeps its own column set — it's the widest of the traces. */
const RSA_COLUMNS = [
  { label: 'char', cls: 'ch' },
  { label: 'm', sub: 'code', cls: 'num' },
  { label: 'm', sub: 'binary', cls: 'bin' },
  { label: 'c', sub: 'cipher int', cls: 'num big' },
  { label: 'c', sub: 'hex bytes', cls: 'bin' },
  { label: 'c', sub: 'as chars', cls: 'glyph' },
];
const rsaRowCells = (r) => [r.ch, r.m, r.mBin, r.c, r.hex, r.glyphs];

const TraceGrid = React.memo(function TraceGrid({ square }) {
  return (
    <div className="cv-square">
      {square.map((row, r) => (
        <div className="cv-square-row" key={r}>
          {row.map((ch, c) => <span className="cv-square-cell" key={c}>{ch}</span>)}
        </div>
      ))}
    </div>
  );
});

const TraceMatrix = React.memo(function TraceMatrix({ matrix, label }) {
  return (
    <div className="cv-matrixviz">
      <span className="cv-matrixviz-label">{label}</span>
      <span className="cv-matrixviz-brk">[</span>
      <span className="cv-matrixviz-body">
        {matrix.map((row, r) => (
          <span className="cv-matrixviz-row" key={r}>
            {row.map((v, c) => <span className="cv-matrixviz-cell" key={c}>{v}</span>)}
          </span>
        ))}
      </span>
      <span className="cv-matrixviz-brk">]</span>
    </div>
  );
});

const StepTrace = React.memo(function StepTrace({ trace }) {
  const shown = trace.rows.length;
  const unit = trace.unit || 'step';
  return (
    <div className="cv-trace">
      <div className="cv-payload-label">
        <span>{'//'} {trace.algo}_walkthrough — {trace.mode === 'encrypt' ? 'encryption' : 'decryption'}</span>
        <span className="hint">
          {shown < trace.total
            ? `first ${shown} of ${trace.total} ${unit}s`
            : `${trace.total} ${unit}${trace.total === 1 ? '' : 's'}`}
        </span>
      </div>

      {trace.formula && (
        <div className="cv-trace-formula">
          {trace.formula}
          {trace.keys && <span className="cv-trace-keys">{trace.keys}</span>}
        </div>
      )}

      {(trace.square || trace.matrix) && (
        <div className="cv-trace-aids">
          {trace.square && <TraceGrid square={trace.square} />}
          {trace.matrix && <TraceMatrix matrix={trace.matrix} label={trace.matrixLabel || 'K'} />}
        </div>
      )}

      {!!trace.rows.length && (
        <div className="cv-trace-scroll" tabIndex={0}>
          {/* The algo modifier lets a trace opt into layout tweaks (e.g. RSA
              drops its two derived-notation columns on phones). */}
          <table className={'cv-trace-table algo-' + trace.algo}>
            <thead>
              <tr>
                {trace.columns.map((c, i) => (
                  <th key={i}>{c.label}{c.sub && <span className="sub">({c.sub})</span>}</th>
                ))}
                {/* Absorbs leftover width so the real columns stay packed at
                    content width instead of being spread across the table. */}
                <th className="fill" aria-hidden="true" />
              </tr>
            </thead>
            <tbody>
              {trace.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className={trace.columns[j]?.cls ?? CELL_CLASS[j] ?? ''}>
                      {cell === ' ' ? '␣' : cell}
                    </td>
                  ))}
                  <td className="fill" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!!(trace.notes || []).length && (
        <div className="cv-trace-note">
          {trace.notes.map((n, i) => <div key={i}>{'// '}{n}</div>)}
        </div>
      )}
    </div>
  );
});

/* ============== UI: OUTPUT PANEL ============== */

const OutputPanel = React.memo(function OutputPanel({ output, onDownload, onCopy, copied, onWhatsApp, waPhone, setWaPhone, showWA }) {
  if (!output) return null;
  return (
    <div className="cv-output" id="cv-output-anchor" role="region" aria-label="Cipher output">
      <div className="cv-output-h">
        <Icon name="vault-open" size={26} className="second" />
        <span className="cv-output-h-text">{'>'} VAULT_OPEN</span>
        <span className="cv-output-badge">READY</span>
      </div>

      <div className="cv-output-meta">
        <span className="cv-meta-chip">
          <span className="k">file</span>
          <span className="v">{output.filename}</span>
        </span>
        <span className="cv-meta-chip">
          <span className="k">size</span>
          <span className="v">{formatBytes(output.size)}</span>
        </span>
        <span className="cv-meta-chip">
          <span className="k">type</span>
          <span className="v">{output.contentKind}</span>
        </span>
      </div>

      {output.preview && (
        <>
          <div className="cv-payload-label">
            <span>{'//'} payload_preview</span>
            <span className="hint">scroll for more</span>
          </div>
          <div className="cv-preview" tabIndex={0}>{output.preview}</div>
        </>
      )}
      {output.stepTrace && <StepTrace trace={output.stepTrace} />}

      {output.blockVisual && (
        <>
          <div className="cv-payload-label"><span>{'//'} block_structure</span></div>
          <div className="cv-blockviz" tabIndex={0}>{output.blockVisual}</div>
        </>
      )}
      <div className="cv-dl-row">
        <button className="cv-dl" onClick={onDownload}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <Icon name="download" size={22} />
            {'>'} DOWNLOAD FILE_
          </span>
        </button>
        {output.preview && (
          <button className="cv-btn cyan" onClick={onCopy}>{copied ? '[OK] COPIED' : '[ ] COPY TEXT'}</button>
        )}
      </div>

      {showWA && output.preview && (
        <div className="cv-wa-row">
          <input
            className="cv-input"
            placeholder="phone (optional, e.g. 8801234567890)"
            value={waPhone}
            onChange={(e) => setWaPhone(e.target.value.replace(/[^0-9]/g, ''))}
          />
          <span style={{ alignSelf: 'center', color: 'var(--secondary)', fontSize: 11, letterSpacing: 1 }}>
            // opens WhatsApp with the cipher pre-filled — you still tap send
          </span>
          <button className="cv-wa-btn" onClick={onWhatsApp}>
            <Icon name="whatsapp" size={22} />
            SEND TO WHATSAPP
          </button>
        </div>
      )}
    </div>
  );
});

/* ============== APP ============== */

export default function App() {
  const [file, setFile] = useState(null);
  const [fileCategory, setFileCategory] = useState(null);
  const [fileBuffer, setFileBuffer] = useState(null);
  const [hexDump, setHexDump] = useState('');
  const [algo, setAlgo] = useState(null);
  const [keyState, setKeyState] = useState({});
  const [mode, setMode] = useState(null);
  const [logs, setLogs] = useState([]);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inputMode, setInputMode] = useState('file'); // 'file' | 'text'
  const [plainText, setPlainText] = useState('');
  const [waPhone, setWaPhone] = useState(''); // optional recipient phone
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Inject CSS
  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch {} };
  }, []);

  const banglaActive = algo === 'banglashift';
  const danger = mode === 'decrypt';

  // Theme flip — toggling .danger on <html> swaps every accent surface.
  useEffect(() => {
    document.documentElement.classList.toggle('danger', danger);
    return () => document.documentElement.classList.remove('danger');
  }, [danger]);

  // Sync plaintext input → synthetic File so the existing pipeline works as-is.
  // Runs whenever the user types in TEXT mode, or switches modes.
  useEffect(() => {
    if (inputMode !== 'text') return;
    if (plainText) {
      const f = new File([plainText], 'message.txt', { type: 'text/plain' });
      const buf = new TextEncoder().encode(plainText).buffer;
      setFile(f);
      setFileCategory('text');
      setFileBuffer(buf);
      // Hex dump + byte counter are derived; skip the cost when text is unchanged.
      setHexDump(getHexDump(buf, 64));
    } else {
      setFile(null); setFileCategory(null); setFileBuffer(null); setHexDump('');
    }
    setOutput(null);
    // Debounce: wait 120ms after the user stops typing before recomputing the
    // expensive hex dump. The file/buffer are set immediately so execution
    // can proceed the moment the user clicks EXECUTE.
    const t = setTimeout(() => {
      if (inputMode === 'text' && plainText) {
        const buf = new TextEncoder().encode(plainText).buffer;
        setHexDump(getHexDump(buf, 64));
      }
    }, 120);
    return () => clearTimeout(t);
  }, [inputMode, plainText]);

  // Switching source tabs clears stale state from the other source.
  const switchInputMode = (m) => {
    if (m === inputMode) return;
    setInputMode(m);
    setFile(null); setFileBuffer(null); setHexDump(''); setFileCategory(null);
    setOutput(null); setLogs([]);
    if (m === 'file') setPlainText('');
  };

  const handleFile = useCallback(async (f) => {
    setFile(f);
    const cat = getFileCategory(f);
    setFileCategory(cat);
    setOutput(null);
    setLogs([]);
    try {
      const buf = await readFileAsArrayBuffer(f);
      setFileBuffer(buf);
      setHexDump(getHexDump(buf, 64));
    } catch (e) {
      setHexDump('// failed to read file: ' + e.message);
    }
    // If currently selected algo is now incompatible, clear it
    if (algo && ALGORITHM_VALIDATION[algo][cat] === 'error') setAlgo(null);
  }, [algo]);

  const clearFile = () => {
    setFile(null); setFileBuffer(null); setHexDump(''); setFileCategory(null);
    setOutput(null); setLogs([]);
  };

  const algoState = useCallback((aid) => {
    if (!file) return 'locked';
    return ALGORITHM_VALIDATION[aid][fileCategory] === 'error' ? 'incompatible'
         : ALGORITHM_VALIDATION[aid][fileCategory] === 'base64warn' ? 'base64warn'
         : 'compatible';
  }, [file, fileCategory]);

  const selectAlgo = (aid) => {
    setAlgo(aid);
    setOutput(null);
    setLogs([]);
    // Reset key state for fresh algo
    if (aid === 'caesar') setKeyState({ caesarShift: '3' });
    else if (aid === 'vigenere') setKeyState({ vigenereKey: '' });
    else if (aid === 'playfair') setKeyState({ playfairKey: '' });
    else if (aid === 'hill') setKeyState({ hillDim: 2, hillMatrix: [[3,3],[2,5]] });
    else if (aid === 'sha256') { setKeyState({}); setMode('encrypt'); }
    else if (aid === 'feistel64') setKeyState({ blockKey: 'vault-key' });
    else if (aid === 'xor') setKeyState({ xorKey: 'key' });
    else if (aid === 'rsa') setKeyState({ rsaE: '', rsaN: '', rsaD: '' });
    else if (aid === 'banglashift') setKeyState({ banglaPerm: '' });
  };

  // Determine if key is "filled enough" for execute
  const keyReady = useMemo(() => {
    if (!algo) return false;
    if (algo === 'caesar') return keyState.caesarShift !== '' && keyState.caesarShift != null;
    if (algo === 'vigenere') return !!(keyState.vigenereKey && keyState.vigenereKey.length);
    if (algo === 'playfair') return !!(keyState.playfairKey && keyState.playfairKey.length);
    if (algo === 'sha256') return true;
    if (algo === 'feistel64') return !!(keyState.blockKey && keyState.blockKey.trim().length);
    if (algo === 'xor') return !!(keyState.xorKey && keyState.xorKey.trim().length);
    if (algo === 'hill') {
      const m = keyState.hillMatrix;
      if (!m) return false;
      try { return modInverseInt(mod(matrixDet(m), 26), 26) != null; } catch { return false; }
    }
    if (algo === 'rsa') {
      if (!keyState.rsaN) return false;
      if (mode === 'decrypt') return !!(keyState.rsaD && keyState.rsaD.length);
      return !!(keyState.rsaE && keyState.rsaE.length); // encrypt
    }
    if (algo === 'banglashift') return !!(keyState.banglaPerm && keyState.banglaPerm.length);
    return false;
  }, [algo, keyState, mode]);

  const hint = !file ? '// need: file'
    : !algo ? '// need: algorithm'
    : !keyReady ? '// need: key'
    : !mode ? '// need: mode'
    : '// READY TO EXECUTE';
  const canExecute = !!(file && algo && keyReady && mode && !running);

  const log = (kind, text) => setLogs(prev => [...prev, { kind, text }]);

  const execute = useCallback(async () => {
    if (!canExecute) return;
    setRunning(true);
    setOutput(null);
    setLogs([]);
    setCopied(false);

    try {
      log('step', '[*] Validating inputs...');
      log('ok',   `[OK] File loaded: ${file.name} (${formatBytes(file.size)})`);

      const validation = ALGORITHM_VALIDATION[algo][fileCategory];
      const useBase64 = validation === 'base64warn';
      const algoLabel = ALG_LABEL[algo] + (useBase64 ? ' (Base64 mode)' : '');
      log('ok', `[OK] Algorithm: ${algoLabel}`);
      log('ok', `[OK] Mode: ${mode.toUpperCase()}`);

      if (validation === 'error') {
        log('err', `[ERROR] ${ALG_LABEL[algo]} does not support ${fileCategory} files.`);
        const compat = ALGORITHMS.filter(a => ALGORITHM_VALIDATION[a.id][fileCategory] !== 'error').map(a => a.name).join(', ');
        log('info', `[INFO] Compatible algorithms for this file: ${compat}`);
        log('err', '[ABORT] Execution halted.');
        setRunning(false);
        return;
      }

      // Extra warnings
      if (algo === 'rsa' && file.size > 5 * 1024 * 1024) {
        log('warn', '[WARN] RSA on >5MB files is slow. Continuing...');
      }

      let outputBlob, outputName, contentKind, preview = null;
      let blockVisual = null;
      let stepTrace = null;

      // === Branch by algorithm ===
      if (algo === 'sha256') {
        if (mode !== 'encrypt') log('warn', '[WARN] SHA-256 is one-way; generating a digest regardless of mode.');
        log('step', '[*] Reading file bytes...');
        const bytes = new Uint8Array(fileBuffer);
        log('step', '[*] Computing SHA-256 digest...');
        const digestHex = await sha256Hex(bytes);
        const baseName = file.name.replace(/^encrypted_/, '').replace(/^decrypted_/, '').replace(/\.[^.]+$/, '') || 'input';
        outputBlob = new Blob([digestHex + '\n'], { type: 'text/plain;charset=utf-8' });
        outputName = `sha256_${baseName}.txt`;
        contentKind = 'text (SHA-256 digest)';
        preview = digestHex;
        // SHA-256 has no per-character step to show; the meaningful structure
        // is the padded message and the eight 32-bit words of the digest.
        {
          const bitLen = bytes.length * 8;
          const padded = Math.ceil((bytes.length + 9) / 64) * 64;
          stepTrace = {
            algo: 'sha256', mode: 'encrypt', unit: 'word',
            formula: <>H = SHA-256(message)</>,
            keys: `${bytes.length} byte${bytes.length === 1 ? '' : 's'} in → 32 bytes out`,
            columns: [
              { label: 'word', cls: 'ch' },
              { label: 'hex', cls: 'num' },
              { label: 'binary', cls: 'bin' },
            ],
            rows: Array.from({ length: 8 }, (_, i) => {
              const wordHex = digestHex.slice(i * 8, i * 8 + 8).toUpperCase();
              return [
                'H' + i,
                wordHex,
                parseInt(wordHex, 16).toString(2).padStart(32, '0'),
              ];
            }),
            total: 8,
            notes: [
              `message padded from ${bytes.length} to ${padded} bytes (a 1 bit, zeros, then the ${bitLen}-bit length) and processed in ${padded / 64} block${padded / 64 === 1 ? '' : 's'} of 64 bytes`,
              'the digest is the eight 32-bit state words H0…H7 concatenated — this is one-way, so there is nothing to reverse',
            ],
          };
        }
      } else if (algo === 'feistel64') {
        log('step', '[*] Reading file bytes...');
        const bytes = new Uint8Array(fileBuffer);
        log('step', mode === 'encrypt' ? '[*] Encrypting 64-bit blocks...' : '[*] Decrypting 64-bit blocks...');
        const roundTrace = [];
        const cipherBytes = feistel64Transform(bytes, keyState.blockKey, mode, (trace) => { blockVisual = trace; }, roundTrace);
        stepTrace = {
          algo: 'feistel-64', mode, unit: 'round',
          formula: <>L′ = R,  R′ = L ⊕ F(R, k<sub>i</sub>)</>,
          keys: `block 1 of ${roundTrace.blocks}${roundTrace.padLength ? ` · ${roundTrace.padLength} pad byte(s) added` : ''}`,
          columns: [
            { label: 'round', cls: 'ch' },
            { label: 'k', sub: 'round key', cls: 'bin' },
            { label: 'L', cls: 'num' },
            { label: 'R', cls: 'num' },
          ],
          rows: roundTrace, total: roundTrace.rounds,
          notes: [
            'each round swaps the halves and XORs one through a function of the other',
            'the halves are swapped once more on output, which is what lets the same structure decrypt by running the round keys in reverse',
          ],
        };
        outputBlob = new Blob([cipherBytes], { type: 'application/octet-stream' });
        const baseName = file.name.replace(/^encrypted_/, '').replace(/^decrypted_/, '').replace(/\.[^.]+$/, '');
        outputName = `${mode === 'encrypt' ? 'encrypted' : 'decrypted'}_${baseName}.bin`;
        contentKind = 'binary (Feistel-64)';
        preview = bytesToHex(cipherBytes.subarray(0, Math.min(64, cipherBytes.length))).toUpperCase().replace(/(.{2})/g, '$1 ').trim();
      } else if (algo === 'xor') {
        log('step', '[*] Reading file bytes...');
        const bytes = new Uint8Array(fileBuffer);
        log('step', mode === 'encrypt' ? '[*] Applying XOR stream...' : '[*] Reversing XOR stream...');
        const xorTrace = [];
        const cipherBytes = xorBytes(bytes, keyState.xorKey, xorTrace);
        stepTrace = {
          algo: 'xor', mode, unit: 'byte',
          formula: <>c = p ⊕ k<sub>i mod len</sub></>,
          keys: `key "${xorTrace.key}" (${new TextEncoder().encode(xorTrace.key).length} bytes, repeating)`,
          columns: [
            { label: 'i', cls: 'ch' },
            { label: 'p', sub: 'hex / binary', cls: 'bin' },
            { label: 'k', sub: 'hex / binary', cls: 'bin' },
            { label: 'c', sub: 'hex / binary', cls: 'bin' },
          ],
          rows: xorTrace, total: bytes.length,
          notes: [
            'XOR is its own inverse — running the same key over the ciphertext gives the plaintext back, so encrypt and decrypt are the identical operation',
            'each output bit is 1 only where the plaintext and key bits differ',
          ],
        };
        outputBlob = new Blob([cipherBytes], { type: 'application/octet-stream' });
        const baseName = file.name.replace(/^encrypted_/, '').replace(/^decrypted_/, '').replace(/\.[^.]+$/, '');
        outputName = `${mode === 'encrypt' ? 'encrypted' : 'decrypted'}_${baseName}.bin`;
        contentKind = 'binary (XOR stream)';
        preview = bytesToHex(cipherBytes.subarray(0, Math.min(64, cipherBytes.length))).toUpperCase().replace(/(.{2})/g, '$1 ').trim();
      } else if (algo === 'rsa' && inputMode === 'text') {
        /* Text input gets the per-character textbook treatment: one
         * modular exponentiation per code point, a readable numeric
         * ciphertext, and a step table showing the arithmetic. */
        const n = BigInt(keyState.rsaN);
        if (n <= 0n) throw new Error('RSA key values must be positive.');
        const baseName = 'message';

        if (mode === 'encrypt') {
          const e = BigInt(keyState.rsaE);
          if (e <= 0n) throw new Error('RSA key values must be positive.');
          log('step', '[*] Reading string as Unicode code points...');
          log('info', `[INFO] Public key (e, n) = (${e}, ${n})`);
          log('step', '[*] Encrypting per character: c = m^e mod n');
          // One modular exponentiation per character, run synchronously.
          // Fine for a message; worth flagging before it stalls the tab.
          if (plainText.length > 2000) {
            log('warn', `[WARN] ${plainText.length} characters — per-character RSA may take a moment.`);
          }

          const res = rsaEncryptText(plainText, e, n);
          log('ok', `[OK] ${res.count} character(s) encrypted into ${res.count} cipher block(s).`);

          outputBlob = new Blob([res.cipherText], { type: 'text/plain;charset=utf-8' });
          outputName = `encrypted_${baseName}.txt`;
          contentKind = 'text (RSA — space-separated c values)';
          preview = res.cipherText;
          stepTrace = {
            algo: 'rsa', mode: 'encrypt', unit: 'character',
            formula: <>c = m<sup>e</sup> mod n</>,
            keys: `with (e, n) = (${e}, ${n})`,
            columns: RSA_COLUMNS,
            rows: res.trace.map(rsaRowCells),
            total: res.count,
            notes: [
              'each character is raised to e and reduced mod n — the cipher integer is far larger than the character it came from, which is why its bytes map to unrelated-looking characters',
              'c (as chars) reads the cipher bytes as Latin-1; control bytes show as ␀-style pictures, so every byte has one glyph',
            ],
          };
        } else {
          const d = BigInt(keyState.rsaD);
          if (d <= 0n) throw new Error('RSA key values must be positive.');
          log('step', '[*] Parsing ciphertext numbers...');
          log('info', `[INFO] Private key (d, n) = (${d}, ${n})`);
          log('step', '[*] Decrypting per block: m = c^d mod n');

          const res = rsaDecryptText(plainText, d, n);
          log('ok', `[OK] ${res.count} cipher block(s) recovered to plaintext.`);

          outputBlob = new Blob([res.plainText], { type: 'text/plain;charset=utf-8' });
          outputName = `decrypted_${baseName}.txt`;
          contentKind = 'text (RSA plaintext)';
          preview = res.plainText;
          stepTrace = {
            algo: 'rsa', mode: 'decrypt', unit: 'block',
            formula: <>m = c<sup>d</sup> mod n</>,
            keys: `with (d, n) = (${d}, ${n})`,
            columns: RSA_COLUMNS,
            rows: res.trace.map(rsaRowCells),
            total: res.count,
            notes: ['each cipher integer is raised to d and reduced mod n, recovering the original code point'],
          };
        }
      } else if (algo === 'rsa') {
        if (mode === 'encrypt') {
          const e = BigInt(keyState.rsaE);
          const n = BigInt(keyState.rsaN);
          if (e <= 0n || n <= 0n) throw new Error('RSA key values must be positive.');
          log('step', '[*] Reading file as bytes...');
          const bytes = new Uint8Array(fileBuffer);
          log('step', '[*] Encrypting via modular exponentiation...');
          let lastPct = -1;
          const cipher = await rsaEncryptBytes(bytes, e, n, (p) => {
            const pct = Math.floor(p * 100);
            if (pct !== lastPct && pct % 10 === 0) {
              lastPct = pct;
              const bar = '█'.repeat(Math.floor(p * 10)) + '░'.repeat(10 - Math.floor(p * 10));
              setLogs(prev => {
                const next = [...prev];
                if (next.length && next[next.length - 1].text.startsWith('[*] Applying cipher...')) {
                  next[next.length - 1] = { kind: 'step', text: `[*] Applying cipher... ${bar} ${pct}%` };
                } else {
                  next.push({ kind: 'step', text: `[*] Applying cipher... ${bar} ${pct}%` });
                }
                return next;
              });
            }
          });
          // Build header so we can recover modulus on decrypt: but user provides key, so just save bytes
          outputBlob = new Blob([cipher], { type: 'application/octet-stream' });
          outputName = `encrypted_${file.name}.bin`;
          contentKind = 'binary (RSA ciphertext)';
        } else { // decrypt
          const d = BigInt(keyState.rsaD);
          const n = BigInt(keyState.rsaN);
          if (d <= 0n || n <= 0n) throw new Error('RSA key values must be positive.');
          log('step', '[*] Reading ciphertext bytes...');
          const bytes = new Uint8Array(fileBuffer);
          log('step', '[*] Decrypting...');
          let lastPct = -1;
          const plain = await rsaDecryptBytes(bytes, d, n, (p) => {
            const pct = Math.floor(p * 100);
            if (pct !== lastPct && pct % 10 === 0) {
              lastPct = pct;
              const bar = '█'.repeat(Math.floor(p * 10)) + '░'.repeat(10 - Math.floor(p * 10));
              setLogs(prev => {
                const next = [...prev];
                if (next.length && next[next.length - 1].text.startsWith('[*] Applying cipher...')) {
                  next[next.length - 1] = { kind: 'step', text: `[*] Applying cipher... ${bar} ${pct}%` };
                } else {
                  next.push({ kind: 'step', text: `[*] Applying cipher... ${bar} ${pct}%` });
                }
                return next;
              });
            }
          });
          outputBlob = new Blob([plain], { type: 'application/octet-stream' });
          // strip prefix if it begins with encrypted_
          let baseName = file.name.replace(/^encrypted_/, '').replace(/\.bin$/, '');
          outputName = `decrypted_${baseName}`;
          contentKind = 'binary (RSA plaintext)';
          // Try preview as text if printable
          try {
            const sample = Array.from(plain.subarray(0, 200));
            const printable = sample.every(b => b >= 9 && b < 127);
            if (printable) preview = new TextDecoder('utf-8', { fatal: false }).decode(plain.subarray(0, 200));
          } catch {}
        }
      } else if (useBase64) {
        // Base64 mode: caesar/vigenere on binary or image files
        log('step', '[*] Encoding file to Base64...');
        let inputText;
        if (mode === 'encrypt') {
          inputText = arrayBufferToBase64(fileBuffer);
        } else {
          // decrypt: read file as text (it should be ciphered base64 string)
          inputText = await readFileAsText(file);
        }
        log('step', '[*] Applying cipher...');
        let cipherText;
        if (algo === 'caesar') {
          const k = parseInt(keyState.caesarShift, 10);
          if (Number.isNaN(k)) throw new Error('Invalid Caesar shift.');
          // Caesar only shifts letters — base64 preserves alpha + digits + /+=
          cipherText = caesarCipher(inputText, k, mode);
        } else if (algo === 'vigenere') {
          cipherText = vigenereCipher(inputText, keyState.vigenereKey, mode);
        }

        if (mode === 'encrypt') {
          outputBlob = new Blob([cipherText], { type: 'text/plain' });
          outputName = `encrypted_${file.name}.txt`;
          contentKind = 'text (Base64-ciphered)';
          preview = cipherText.slice(0, 200);
        } else {
          // After decrypting, convert Base64 → bytes → restore original
          let buf;
          try { buf = base64ToArrayBuffer(cipherText); }
          catch (e) { throw new Error('Base64 decode failed — wrong key or not a Base64 cipher file.'); }
          let baseName = file.name.replace(/^encrypted_/, '').replace(/\.txt$/, '');
          outputName = `decrypted_${baseName}`;
          // Guess MIME from extension
          const ext = getOriginalExt(baseName).toLowerCase();
          const mimeMap = { '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.gif':'image/gif', '.bmp':'image/bmp', '.webp':'image/webp', '.pdf':'application/pdf' };
          outputBlob = new Blob([buf], { type: mimeMap[ext] || 'application/octet-stream' });
          contentKind = 'binary (decoded)';
        }
      } else {
        // Pure text mode: read file as UTF-8 string
        log('step', '[*] Reading file as UTF-8...');
        const inputText = await readFileAsText(file);
        log('step', '[*] Applying cipher...');
        let cipherText;
        // `tr` is filled in from inside each cipher's own loop.
        const tr = [];
        if (algo === 'caesar') {
          const k = parseInt(keyState.caesarShift, 10);
          if (Number.isNaN(k)) throw new Error('Invalid Caesar shift.');
          cipherText = caesarCipher(inputText, k, mode, tr);
          const eff = mode === 'encrypt' ? k : -k;
          stepTrace = {
            algo: 'caesar', mode, unit: 'letter',
            formula: <>c = (p {eff < 0 ? '−' : '+'} {Math.abs(eff)}) mod 26</>,
            keys: `shift k = ${k}${mode === 'decrypt' ? ' (applied in reverse)' : ''}`,
            columns: [
              { label: 'char', cls: 'ch' },
              { label: 'p', sub: 'index', cls: 'num' },
              { label: 'shift', cls: 'bin' },
              { label: 'c', sub: 'index', cls: 'num' },
              { label: 'out', cls: 'ch' },
            ],
            rows: tr, total: countLetters(inputText),
            notes: [
              'A→0, B→1 … Z→25; the shift wraps around with mod 26',
              'non-letters pass through untouched and are not counted as steps',
            ],
          };
        } else if (algo === 'vigenere') {
          cipherText = vigenereCipher(inputText, keyState.vigenereKey, mode, tr);
          const kNorm = (keyState.vigenereKey || '').toLowerCase().replace(/[^a-z]/g, '');
          stepTrace = {
            algo: 'vigenere', mode, unit: 'letter',
            formula: <>c = (p {mode === 'encrypt' ? '+' : '−'} k<sub>i</sub>) mod 26</>,
            keys: `key = "${kNorm.toUpperCase()}" (repeats every ${kNorm.length} letter${kNorm.length === 1 ? '' : 's'})`,
            columns: [
              { label: 'char', cls: 'ch' },
              { label: 'p', sub: 'index', cls: 'num' },
              { label: 'key', cls: 'ch' },
              { label: 'shift', cls: 'bin' },
              { label: 'c', sub: 'index', cls: 'num' },
              { label: 'out', cls: 'ch' },
            ],
            rows: tr, total: countLetters(inputText),
            notes: [
              'the key cycles over the letters only — each letter gets its own shift, which is what defeats frequency analysis',
            ],
          };
        } else if (algo === 'hill') {
          cipherText = hillCipher(inputText, keyState.hillMatrix, mode, tr);
          const dim = (keyState.hillMatrix || [[1]]).length;
          stepTrace = {
            algo: 'hill', mode, unit: 'block',
            formula: <>C = K · P mod 26</>,
            keys: `${dim}×${dim} matrix, blocks of ${dim} letters`,
            matrix: tr.matrix,
            matrixLabel: mode === 'encrypt' ? 'K' : 'K⁻¹ (mod 26)',
            columns: [
              { label: 'block', cls: 'ch' },
              { label: 'P', sub: 'indices', cls: 'num' },
              { label: 'K · P', cls: 'bin' },
              { label: 'mod 26', cls: 'num' },
              { label: 'out', cls: 'ch' },
            ],
            rows: tr,
            total: Math.ceil(inputText.toUpperCase().replace(/[^A-Z]/g, '').length / dim),
            notes: [
              'text is uppercased, stripped to A–Z, then padded with X to fill the last block',
              mode === 'encrypt'
                ? 'decryption multiplies by the inverse of K mod 26 — which is why K must be invertible'
                : 'the matrix shown is the inverse of your key matrix, computed mod 26',
            ],
          };
        } else if (algo === 'playfair') {
          cipherText = playfairCipher(inputText, keyState.playfairKey, mode, tr);
          stepTrace = {
            algo: 'playfair', mode, unit: 'digraph',
            formula: <>pair → 5×5 square rule</>,
            keys: `key square built from "${keyState.playfairKey || ''}"`,
            square: tr.grid,
            columns: [
              { label: 'pair', cls: 'ch' },
              { label: 'coords', sub: 'r,c', cls: 'bin' },
              { label: 'rule', cls: 'bin' },
              { label: 'out', cls: 'ch' },
            ],
            rows: tr, total: tr.length >= TRACE_ROWS ? countDigraphs(inputText) : tr.length,
            notes: [
              'J is folded into I, so the 25 remaining letters fill the square',
              'same row → each letter moves one step sideways; same column → one step down; otherwise → swap columns of the rectangle',
            ],
          };
        } else if (algo === 'banglashift') {
          cipherText = banglaShift(inputText, 'bn', keyState.banglaPerm, mode, tr);
          stepTrace = {
            algo: 'banglashift', mode, unit: 'letter',
            formula: <>a…z → Bangla alphabet rotated by (Σ key codes) mod 26</>,
            keys: `Σ = ${tr.sum}, shift = ${tr.shift}`,
            columns: [
              { label: 'in', cls: 'ch' },
              { label: 'index', cls: 'num' },
              { label: 'latin', cls: 'ch' },
              { label: 'out', cls: 'ch' },
            ],
            rows: tr, total: tr.count,
            notes: [
              'the key is summed to a single rotation amount, then the Bangla alphabet is rotated by it',
              'the mapping is a straight substitution — same input letter always gives the same output',
            ],
          };
        }

        // Auto-detect base64 round-trip: file like "encrypted_photo.png.txt" being decrypted
        // with Caesar/Vigenere — reverse cipher gave us a base64 string; decode back to binary.
        const isBase64Roundtrip =
          mode === 'decrypt' &&
          (algo === 'caesar' || algo === 'vigenere') &&
          /^encrypted_.+\..+\.txt$/i.test(file.name);

        if (isBase64Roundtrip) {
          log('step', '[*] Detected base64 envelope — decoding back to binary...');
          let buf;
          try { buf = base64ToArrayBuffer(cipherText.trim()); }
          catch { throw new Error('Base64 decode failed — wrong key or not a base64-mode file.'); }
          const stripped = file.name.replace(/^encrypted_/, '').replace(/\.txt$/i, '');
          outputName = `decrypted_${stripped}`;
          const ext = getOriginalExt(stripped).toLowerCase();
          const mimeMap = { '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.gif':'image/gif', '.bmp':'image/bmp', '.webp':'image/webp', '.pdf':'application/pdf' };
          outputBlob = new Blob([buf], { type: mimeMap[ext] || 'application/octet-stream' });
          contentKind = 'binary (base64-decoded)';
        } else {
          const baseName = file.name.replace(/^encrypted_/, '').replace(/^decrypted_/, '');
          outputName = (mode === 'encrypt' ? 'encrypted_' : 'decrypted_') + baseName;
          outputBlob = new Blob([cipherText], { type: 'text/plain;charset=utf-8' });
          contentKind = 'text';
          preview = cipherText.slice(0, 200);
        }
      }

      log('ok', '[OK] Done. Output ready.');

      // beep
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 880;
        osc.connect(gain); gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
        osc.start(); osc.stop(ctx.currentTime + 0.2);
      } catch {}

      setOutput({
        blob: outputBlob,
        filename: outputName,
        size: outputBlob.size,
        contentKind,
        preview,
        blockVisual,
        stepTrace,
      });
    } catch (err) {
      log('err', '[ERROR] ' + err.message);
      log('err', '[ABORT] Execution halted.');
    } finally {
      setRunning(false);
    }
  }, [canExecute, algo, mode, file, fileBuffer, fileCategory, keyState, inputMode, plainText]);

  // Keyboard shortcut: Ctrl+Enter
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); execute(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [execute]);

  // Show the floating scroll-to-top pill once the user is past the hero.
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // When output lands, smooth-scroll the result panel into view (mobile-friendly).
  useEffect(() => {
    if (!output) return;
    const t = setTimeout(() => {
      const el = document.getElementById('cv-output-anchor');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
    return () => clearTimeout(t);
  }, [output]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const onDownload = () => { if (output) downloadBlob(output.blob, output.filename); };
  const onCopy = () => {
    if (output && output.preview) {
      // Copy full text content if it's text
      output.blob.text().then(t => {
        navigator.clipboard.writeText(t);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };
  // WhatsApp deep link — opens WA with the cipher prefilled. User taps send.
  // wa.me works on mobile; web.whatsapp.com is preferred on desktop. We let
  // the wa.me redirect handle both, since it routes to the right surface.
  const onWhatsApp = () => {
    if (!output) return;
    output.blob.text().then(t => {
      const text = encodeURIComponent(t);
      const url = waPhone
        ? `https://wa.me/${waPhone}?text=${text}`
        : `https://wa.me/?text=${text}`;
      window.open(url, '_blank', 'noopener');
    });
  };

  // Header binary stream content
  const streamText = useMemo(() => {
    let s = '';
    for (let i = 0; i < 240; i++) s += (Math.random() > 0.5 ? '1' : '0');
    return (s + '  ').repeat(2);
  }, [file, algo, mode]);

  // Footer hex stream
  const hexStream = useMemo(() => {
    const chars = '0123456789ABCDEF';
    let s = '';
    for (let i = 0; i < 600; i++) {
      s += chars[Math.floor(Math.random() * 16)];
      if (i % 2 === 1) s += ' ';
    }
    return (s + '  ').repeat(2);
  }, []);

  return (
    <>
      <MatrixRain banglaActive={banglaActive} danger={danger} />
      <div className="cv-vignette" />
      <div className="cv-scanlines" />
      <div className="cv-blood" />
      {/* Blood drips, only visible in danger mode — alternate thin + thick for rhythm */}
      {[5, 14, 26, 38, 50, 62, 74, 86, 95].map((left, i) => (
        <span key={i}
          className={'cv-drip' + (i % 3 === 0 ? ' thick' : '')}
          style={{
            left: `${left}%`,
            animationDelay: `${i * 0.7}s`,
            animationDuration: `${4 + (i % 3)}s`,
          }} />
      ))}

      {/* Floating scroll-to-top pill — only visible on mobile after scroll */}
      <button
        type="button"
        className={'cv-scrolltop' + (showScrollTop ? ' visible' : '')}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        title="Scroll to top"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 14 6-6 6 6" />
        </svg>
      </button>
      <div className="cv-root">
        <div className="cv-content">

          {/* Header */}
          <header style={{ marginBottom: 12 }}>
            <h1 className="cv-title">{'>'} CryptoVault_</h1>
            <div className="cv-tagline-stack" aria-label="CryptoVault slogan">
              <div className="cv-tagline cv-tagline-alt">// Encrypt · Decrypt · Dominate</div>
              <div className="cv-tagline cv-tagline-alt alt">// Utterly Shatters The Black Hat Hackers</div>
            </div>
            <div className="cv-statusbar">
              <span>
                <span className="cv-stat-dot" /> &nbsp;
                <Icon name={danger ? 'shield-x' : 'shield'} size={14} className={danger ? '' : 'second'} />
                <span className="cv-stat-key">SYS:</span> <span className="cv-stat-val">{danger ? 'DECRYPT_MODE' : 'ENCRYPT_MODE'}</span>
              </span>
              <span>
                <Icon name={file ? fileIconName(fileCategory) : 'file-bin'} size={14} className="second" />
                <span className="cv-stat-key">FILE:</span> <span className="cv-stat-val">{file ? file.name : 'NULL'}</span>
              </span>
              <span>
                <Icon name="key" size={14} className="second" />
                <span className="cv-stat-key">ALGO:</span> <span className="cv-stat-val">{algo ? ALG_LABEL[algo].toUpperCase() : 'NULL'}</span>
              </span>
              <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6,
                             color: danger ? 'var(--accent)' : 'var(--accent)',
                             textShadow: danger ? '0 0 10px rgba(255,42,61,0.7)' : 'none' }}>
                {danger && <Icon name="skull" size={16} />}
                {danger ? '// !! BLOOD VAULT !!' : '// SECURE LINK'}
              </span>
            </div>
          </header>
          <div className="cv-stream">
            <div className="cv-stream-inner">{streamText}</div>
          </div>

          {/* Step 1 — Source (file OR plaintext) */}
          <section className="cv-step">
            <div className="cv-step-head">
              <span className="cv-step-lock"><Icon name={file ? 'lock-open' : 'lock-closed'} size={18} /></span>
              <span className="cv-step-num">01</span>
              <span className="cv-step-title">INPUT SOURCE</span>
              <span className="cv-step-sub">
                {file ? `// loaded · ${formatBytes(file.size)}` : '// awaiting input'}
              </span>
            </div>

            <div className="cv-srctabs" role="tablist">
              <button
                className={'cv-srctab' + (inputMode === 'file' ? ' active' : '')}
                onClick={() => switchInputMode('file')}
              >
                <Icon name="file-bin" size={18} /> [ FILE ]
              </button>
              <button
                className={'cv-srctab' + (inputMode === 'text' ? ' active' : '')}
                onClick={() => switchInputMode('text')}
              >
                <Icon name="paste" size={18} /> [ TEXT / WHATSAPP ]
              </button>
            </div>

            {inputMode === 'file' ? (
              <FileDropZone
                file={file}
                onFile={handleFile}
                onClear={clearFile}
                fileCategory={fileCategory}
                hexDump={hexDump}
              />
            ) : (
              <>
                <label className="cv-label">// PASTE OR TYPE PLAINTEXT</label>
                <textarea
                  className="cv-textarea"
                  value={plainText}
                  onChange={(e) => setPlainText(e.target.value)}
                  placeholder="Type a message, or paste a cipher you received on WhatsApp to decrypt..."
                  spellCheck={false}
                />
                <div className="cv-text-meta">
                  <span>chars: <span className="v">{plainText.length}</span></span>
                  <span>bytes: <span className="v">{new TextEncoder().encode(plainText).length}</span></span>
                  <span>category: <span className="v">TEXT</span></span>
                </div>
                {plainText && (
                  <>
                    <div className="cv-hex-h" style={{ marginTop: 12 }}>// First 64 bytes — hex dump</div>
                    <div className="cv-hex">{hexDump}</div>
                  </>
                )}
              </>
            )}
          </section>

          {/* Step 2 — Algorithm */}
          <section className="cv-step">
            <div className="cv-step-head">
              <span className="cv-step-lock"><Icon name={algo ? 'lock-open' : 'lock-closed'} size={18} /></span>
              <span className="cv-step-num">02</span>
              <span className="cv-step-title">SELECT ALGORITHM</span>
              <span className="cv-step-sub">
                {file ? `// filtered for ${fileCategory}` : '// Upload a file first to see compatible algorithms'}
              </span>
            </div>
            <div className="cv-grid">
              {ALGORITHMS.map(a => (
                <AlgorithmCard
                  key={a.id}
                  algo={a}
                  state={algoState(a.id)}
                  selected={algo === a.id}
                  onSelect={selectAlgo}
                />
              ))}
            </div>
          </section>

          {/* Step 3 — Key */}
          <section className="cv-step">
            <div className="cv-step-head">
              <span className="cv-step-lock"><Icon name={keyReady ? 'key' : 'lock-closed'} size={18} /></span>
              <span className="cv-step-num">03</span>
              <span className="cv-step-title">ENTER KEY</span>
              <span className="cv-step-sub">{algo ? `// ${ALG_LABEL[algo]}` : ''}</span>
            </div>
            <KeyInputPanel algo={algo} keyState={keyState} setKey={setKeyState} />
          </section>

          {/* Step 4 — Mode */}
          <section className="cv-step">
            <div className="cv-step-head">
              <span className="cv-step-lock"><Icon name={mode ? (danger ? 'shield-x' : 'shield') : 'lock-closed'} size={18} /></span>
              <span className="cv-step-num">04</span>
              <span className="cv-step-title">CHOOSE MODE</span>
              <span className="cv-step-sub">{mode ? `// mode: ${mode}` : '// select direction'}</span>
            </div>
            <ModeToggle mode={mode} setMode={setMode} />
          </section>

          {/* Step 5 — Execute */}
          <section className="cv-step">
            <div className="cv-step-head">
              <span className="cv-step-lock"><Icon name={canExecute ? 'play' : 'lock-closed'} size={18} /></span>
              <span className="cv-step-num">05</span>
              <span className="cv-step-title">EXECUTE</span>
              <span className="cv-step-sub">// Ctrl+Enter to run</span>
            </div>
            <button className="cv-exec" disabled={!canExecute} onClick={execute}>
              <span className="cv-exec-row">
                <svg className="cv-exec-lock" viewBox="0 0 24 24"
                     strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="11" width="16" height="10" />
                  <path className="shackle" d={danger ? 'M7 11V8a5 5 0 0 1 9.5-2' : 'M7 11V8a5 5 0 0 1 10 0v3'} />
                  <circle cx="12" cy="16" r="1.6" fill="currentColor" stroke="none" />
                </svg>
                <span>{running ? '> RUNNING...' : (danger ? '> UNLOCK_VAULT_' : '> SEAL_VAULT_')}</span>
              </span>
            </button>
            {running && <div className="cv-progress" role="progressbar" aria-label="Encrypting…" />}
            <div className="cv-hint">
              {/* The chips must be JSX children, not an expression: inside
                  {...} the `+` is JS concatenation and rendered as
                  "[object Object][object Object]". */}
              {hint}{canExecute && <> <span className="cv-kbd">Ctrl</span> + <span className="cv-kbd">Enter</span></>}
            </div>

            <TerminalLog lines={logs} />
            <OutputPanel
              output={output}
              onDownload={onDownload}
              onCopy={onCopy}
              copied={copied}
              onWhatsApp={onWhatsApp}
              waPhone={waPhone}
              setWaPhone={setWaPhone}
              showWA={inputMode === 'text'}
            />
          </section>

          {/* Footer */}
          <footer className="cv-footer">
            <div className="cv-foot-line">// Built with entropy. Powered by chaos.</div>
            <div className="cv-hex-stream">
              <div className="cv-hex-stream-inner">{hexStream}</div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

