import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
const C = {
  bg: "#000000",
  // Static fallbacks (used in canvas where CSS vars are unavailable).
  green: "#00ff41",
  greenDim: "#00b82d",
  cyan: "#00d4ff",
  red: "#b8060ce1",
  redDim: "#9c0303f2",
  amber: "#ffc800",
  panel: "rgba(0, 20, 0, 0.85)",
  panelDim: "rgba(0, 12, 0, 0.7)",
  border: "rgba(0, 255, 65, 0.45)",
  borderRed: "#ba060c",
  borderAmber: "rgba(255, 200, 0, 0.55)",
  borderDim: "rgba(80, 80, 80, 0.5)"
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

/* === Theme tokens \u2014 flipped to red when <html> has .danger === */
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
  /* Brighter, more legible red \u2014 was #ff0019 which crushed to pure crimson */
  --accent: #ff2a3d;
  --accent-dim: #b40014;
  --accent-rgb: 255, 42, 61;
  /* Orange-amber "secondary" so cyan-on-red stays a contrast pair */
  --secondary: #ffb000;
  --secondary-rgb: 255, 176, 0;
  --warn: #ffe066;
  --warn-rgb: 255, 224, 102;
  --err: #ffffff;
  /* Warmer panel base + a hint of glow so cards separate from pure black */
  --panel-tint: 72, 4, 10;
  --bg: #0a0002;
  /* Used by the danger-only keyframes */
  --blood: #ff0019;
  --blood-rgb: 255, 0, 25;
  --blood-deep: #6b0008;
  --smoke: 255, 80, 90;
}
:root.danger body {
  background:
    radial-gradient(ellipse at top,    rgba(180, 0, 30, 0.35), transparent 55%),
    radial-gradient(ellipse at bottom, rgba(120, 0, 20, 0.45), transparent 60%),
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

/* Floating scroll-to-top pill \u2014 only visible on mobile after scroll. */
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
  min-height: 100vh; overflow-x: hidden;
}

body { cursor: crosshair; }

::selection { background: var(--accent); color: #000; }

::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: #000; }
::-webkit-scrollbar-thumb { background: var(--accent-dim); border-radius: 0; }
::-webkit-scrollbar-thumb:hover { background: var(--accent); }

:root.danger ::-webkit-scrollbar-thumb { background: var(--accent-dim); box-shadow: inset 0 0 6px rgba(255,42,61,0.5); }
:root.danger ::-webkit-scrollbar-thumb:hover { background: var(--accent); }

.cv-root {
  position: relative; min-height: 100vh; padding: 24px 48px 64px;
  max-width: 1320px; margin: 0 auto;
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
  font-size: 92px; font-weight: 400; letter-spacing: 4px;
  margin: 0; line-height: 0.95; color: var(--accent);
  animation: glitch 3s infinite;
  text-transform: uppercase;
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

/* Header status bar \u2014 DECRYPT mode lights up MODE_ACTIVE in red. */
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

/* Danger-tuned title \u2014 more diffuse, less eye-strain than pure red */
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

/* ----- Panels / steps \u2014 sharper, notched corners ----- */
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

/* Danger step panels \u2014 slightly brighter, stronger glow, deeper panel base */
:root.danger .cv-step {
  background:
    linear-gradient(180deg, rgba(var(--accent-rgb), 0.10), rgba(var(--panel-tint), 0.92));
  border-color: rgba(var(--accent-rgb), 0.55);
  box-shadow:
    0 0 28px rgba(var(--accent-rgb), 0.30),
    inset 0 0 28px rgba(var(--accent-rgb), 0.10);
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

/* ----- Algorithm cards \u2014 sharper + corner brackets ----- */
.cv-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;
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

/* ----- Mode toggle \u2014 DECRYPT screams red even in green theme ----- */
.cv-mode-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
.cv-mode-btn {
  padding: 28px; background: #000;
  border: 2px solid rgba(var(--accent-rgb), 0.4);
  color: rgba(var(--accent-rgb), 0.55); font-family: inherit; font-size: 26px;
  cursor: pointer; letter-spacing: 6px; transition: all 0.18s; font-weight: 700;
  position: relative; overflow: hidden;
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
/* DECRYPT button itself is always red-tinted as a signal of intent */
.cv-mode-btn.decrypt { color: rgba(255, 0, 0, 0.66); border-color: rgba(255,0,0,0.66); }
.cv-mode-btn.decrypt:hover { color: rgb(255, 0,0, 0.66); border-color: rgb(255, 0,0, 0.66); box-shadow: 0 0 18px rgba(255,0,0,0.66); }
.cv-mode-btn.decrypt.active {
  color: rgb(255, 0,0, 0.66); border-color: rgb(255, 0,0, 0.66);
  background: rgba(255, 0, 0, 0.66);
  box-shadow: 0 0 36px rgb(255, 0,0, 0.66), inset 0 0 26px rgba(255,0,0,0.66);
  text-shadow: 0 0 14px rgb(255,0, 0, 0.66);
  animation: alarm 1.4s infinite;
}
@keyframes alarm {
  0%, 100% { box-shadow: 0 0 36px #ff003c, inset 0 0 26px rgba(255,0,60,0.45); }
  50%      { box-shadow: 0 0 60px #ff003c, inset 0 0 36px rgba(255,0,60,0.7);  }
}

/* ----- Execute button \u2014 bigger pulse, harder edges ----- */
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 22px var(--accent), inset 0 0 14px rgba(var(--accent-rgb), 0.25); }
  50%      { box-shadow: 0 0 48px var(--accent), inset 0 0 28px rgba(var(--accent-rgb), 0.55); }
}
.cv-exec {
  width: 100%; padding: 28px; background: rgba(var(--accent-rgb), 0.1);
  border: 2px solid var(--accent); color: var(--accent); font-family: inherit;
  font-size: 28px; letter-spacing: 8px; cursor: pointer; transition: all 0.18s;
  animation: pulse 1.8s infinite; font-weight: 700;
  text-shadow: 0 0 14px var(--accent);
  clip-path: polygon(0 0, calc(100% - 18px) 0, 100% 18px, 100% 100%, 18px 100%, 0 calc(100% - 18px));
}
.cv-exec:hover { background: var(--accent); color: #000; }
.cv-exec:disabled {
  opacity: 0.45; cursor: not-allowed; animation: none;
  color: var(--accent-dim); border-color: var(--accent-dim);
  text-shadow: none;
}

/* Danger-tuned execute button \u2014 softer alarm, still readable */
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

/* ----- Output ----- */
.cv-output {
  margin-top: 18px; background: rgba(var(--secondary-rgb), 0.08);
  border: 1px solid var(--secondary);
  padding: 18px;
  box-shadow: 0 0 22px rgba(var(--secondary-rgb), 0.3);
  clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
}
.cv-output-h { color: var(--secondary); font-size: 16px; margin-bottom: 8px; letter-spacing: 3px; font-weight: 700; }
.cv-output-meta { color: var(--accent); font-size: 12px; margin-bottom: 10px; }

/* Danger output \u2014 red accent instead of cyan, but secondary header stays amber */
:root.danger .cv-output {
  background: linear-gradient(180deg, rgba(var(--accent-rgb), 0.12), rgba(var(--secondary-rgb), 0.06));
  border-color: var(--accent);
  box-shadow: 0 0 32px rgba(var(--accent-rgb), 0.4), inset 0 0 22px rgba(var(--accent-rgb), 0.12);
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
  background: #000; border: 1px solid rgba(var(--accent-rgb), 0.45); padding: 10px;
  max-height: 160px; overflow: auto; color: var(--accent); font-size: 12px;
  white-space: pre-wrap; word-break: break-all;
}
.cv-blockviz {
  margin-top: 10px;
  background: rgba(var(--accent-rgb), 0.06);
  border: 1px solid rgba(var(--accent-rgb), 0.3);
  padding: 10px;
  color: var(--secondary);
  font-size: 11px;
  line-height: 1.6;
  overflow: auto;
  white-space: pre;
}
.cv-dl-row { display: grid; grid-template-columns: 1fr auto; gap: 12px; margin-top: 14px; }
.cv-dl {
  padding: 20px; background: rgba(var(--accent-rgb), 0.18);
  border: 2px solid var(--accent);
  color: var(--accent); font-family: inherit; font-size: 20px; cursor: pointer;
  letter-spacing: 4px; transition: all 0.15s; font-weight: 700;
  text-shadow: 0 0 12px var(--accent);
  box-shadow: 0 0 22px var(--accent), inset 0 0 14px rgba(var(--accent-rgb), 0.2);
  clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
}
.cv-dl:hover { background: var(--accent); color: #000; }

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
.cv-wa-row {
  display: grid; grid-template-columns: 200px 1fr auto; gap: 10px;
  margin-top: 12px; padding-top: 12px;
  border-top: 1px dashed rgba(var(--accent-rgb), 0.4);
}
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

.cv-wa-info {
  margin-top: 14px; padding: 12px 14px; font-size: 11px; color: var(--secondary);
  background: rgba(var(--accent-rgb), 0.04);
  border-left: 3px solid var(--secondary); line-height: 1.7; letter-spacing: 0.5px;
}
.cv-wa-info b { color: var(--accent); letter-spacing: 1px; }

/* =============================================================
 * BLOOD MODE \u2014 only visible when <html> has .danger
 * Adds a blood-curtain at the top of the page that drips down.
 * ============================================================ */
.cv-blood {
  position: fixed; inset: 0 0 auto 0; height: 100vh;
  z-index: 2; pointer-events: none; opacity: 0;
  transition: opacity 0.6s ease;
  background:
    /* Top edge \u2014 a crimson haze hugging the very top of the viewport */
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
:root.danger .cv-vignette {
  background: radial-gradient(ellipse at center, transparent 30%, rgba(70, 0, 0, 0.96) 100%);
}
:root.danger .cv-scanlines { opacity: 0.32; }

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

/* Output panel \u2014 open vault */
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

/* Defaults \u2014 applied to all interactive controls. Kills the
 * 300ms tap delay on mobile browsers and prevents double-zoom. */
button, .cv-btn, .cv-card, .cv-mode-btn, .cv-exec, .cv-dl, .cv-wa-btn,
.cv-srctab, .cv-clear-btn, input, textarea, select {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

/* Respect safe areas on notched / home-indicator phones. */
:root { --cv-safe-t: env(safe-area-inset-top, 0px); --cv-safe-b: env(safe-area-inset-bottom, 0px); }
.cv-root { padding-left: max(48px, env(safe-area-inset-left, 0px)); padding-right: max(48px, env(safe-area-inset-right, 0px)); }

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

  .cv-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
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

  .cv-wa-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .cv-dl-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  /* Canvas + scanlines eat ~20-30% of mobile GPU budget \u2014 soften them */
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
  .cv-grid { grid-template-columns: repeat(2, 1fr); }
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

  .cv-grid {
    grid-template-columns: 1fr;
    gap: 10px;
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

  .cv-input {
    font-size: 14px;
    padding: 10px 12px;
  }

  .cv-textarea {
    min-height: 120px;
    font-size: 14px;
    padding: 10px;
  }

  .cv-btn {
    padding: 10px 16px;
    font-size: 12px;
    letter-spacing: 1px;
    min-height: 44px;
  }

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
    font-size: 14px;
    min-height: 44px;
  }

  .cv-wa-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .cv-wa-btn {
    padding: 12px 16px;
    font-size: 12px;
    letter-spacing: 1px;
    min-height: 48px;
  }

  .cv-dl-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .cv-dl {
    padding: 16px 12px;
    font-size: 16px;
    letter-spacing: 2px;
    min-height: 56px;
  }

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

  .cv-output {
    padding: 14px;
  }

  .cv-output-h {
    font-size: 14px;
  }

  .cv-preview {
    max-height: 120px;
    font-size: 11px;
  }

  /* Stop every expensive paint on phones \u2014 drops ~40% GPU work */
  .cv-scanlines { opacity: 0.12; animation: none; }
  .cv-canvas { opacity: 0.22; }
  .cv-drop,
  .cv-card.compatible { animation: none; }
  .cv-drop:hover { animation: none; }
  .cv-hex-stream { display: none; }
  .cv-stream { display: none; }
}

/* Microscopic phones (\u2264 380px) \u2014 landscape foldables, iPhone SE 1st gen */
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
const ALGORITHM_VALIDATION = {
  caesar: { text: "compatible", image: "base64warn", binary: "base64warn" },
  vigenere: { text: "compatible", image: "base64warn", binary: "base64warn" },
  hill: { text: "compatible", image: "error", binary: "error" },
  playfair: { text: "compatible", image: "error", binary: "error" },
  sha256: { text: "compatible", image: "compatible", binary: "compatible" },
  feistel64: { text: "compatible", image: "compatible", binary: "compatible" },
  xor: { text: "compatible", image: "compatible", binary: "compatible" },
  rsa: { text: "compatible", image: "compatible", binary: "compatible" },
  banglashift: { text: "compatible", image: "error", binary: "error" }
};
const ALGORITHMS = [
  { id: "caesar", name: "CAESAR", desc: "Classic shift cipher (~50 BC).", fact: "Used by Julius Caesar to communicate with his generals." },
  { id: "vigenere", name: "VIGENERE", desc: "Polyalphabetic keyword cipher.", fact: '"Le chiffre ind\xE9chiffrable" \u2014 unbroken for 300 years.' },
  { id: "hill", name: "HILL", desc: "Linear-algebra matrix cipher.", fact: "Invented by Lester S. Hill in 1929." },
  { id: "playfair", name: "PLAYFAIR", desc: "Digraph 5x5 Polybius substitution.", fact: "Used by British forces in WWI and WWII." },
  { id: "sha256", name: "SHA-256", desc: "One-way hashing for file fingerprints.", fact: "Produces a 256-bit digest; the same input always maps to the same hash." },
  { id: "feistel64", name: "FEISTEL-64", desc: "Simple 64-bit block cipher with block view.", fact: "A tiny Feistel network is the easiest way to visualize block cipher rounds." },
  { id: "xor", name: "XOR", desc: "Fast stream-style byte transformer.", fact: "Repeating-key XOR is reversible and works on any byte stream." },
  { id: "rsa", name: "RSA", desc: "Public-key BigInt asymmetric crypto.", fact: "Rivest, Shamir, Adleman (1977). Powers HTTPS today." },
  { id: "banglashift", name: "BANGLASHIFT", desc: "Custom multilingual permutation cipher.", fact: "Maps Latin alphabet onto a permuted Bangla script." }
];
const ALG_LABEL = {
  caesar: "Caesar Cipher",
  vigenere: "Vigenere Cipher",
  hill: "Hill Cipher",
  playfair: "Playfair Cipher",
  sha256: "SHA-256 Hash",
  feistel64: "Feistel-64 Block Cipher",
  xor: "XOR Cipher",
  rsa: "RSA",
  banglashift: "BanglaShift"
};
const BANGLA = ["\u0985", "\u0986", "\u0987", "\u0988", "\u0989", "\u098A", "\u098B", "\u098F", "\u0990", "\u0993", "\u0994", "\u0995", "\u0996", "\u0997", "\u0998", "\u0999", "\u099A", "\u099B", "\u099C", "\u099D", "\u099E", "\u099F", "\u09A0", "\u09A1", "\u09A2", "\u09A3"];
function Icon({ name, className = "", size = 20 }) {
  const cls = `cv-svg ${className}`;
  const common = { width: size, height: size, viewBox: "0 0 24 24", className: cls, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "lock-closed":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("rect", { x: "4", y: "11", width: "16", height: "10" }), /* @__PURE__ */ React.createElement("path", { d: "M7 11V8a5 5 0 0 1 10 0v3" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "16", r: "1.5", fill: "currentColor", stroke: "none" }));
    case "lock-open":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("rect", { x: "4", y: "11", width: "16", height: "10" }), /* @__PURE__ */ React.createElement("path", { d: "M7 11V8a5 5 0 0 1 9.5-2" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "16", r: "1.5", fill: "currentColor", stroke: "none" }));
    case "key":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("circle", { cx: "8", cy: "14", r: "4" }), /* @__PURE__ */ React.createElement("path", { d: "M11 14h10" }), /* @__PURE__ */ React.createElement("path", { d: "M17 14v3" }), /* @__PURE__ */ React.createElement("path", { d: "M21 14v3" }));
    case "shield":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z" }), /* @__PURE__ */ React.createElement("path", { d: "m9 12 2 2 4-4" }));
    case "shield-x":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z" }), /* @__PURE__ */ React.createElement("path", { d: "m9 9 6 6M15 9l-6 6" }));
    case "vault":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "4", width: "18", height: "16", rx: "1" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "5" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "1.5", fill: "currentColor", stroke: "none" }), /* @__PURE__ */ React.createElement("g", { className: "dial" }, /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "7", x2: "12", y2: "9" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "15", x2: "12", y2: "17" }), /* @__PURE__ */ React.createElement("line", { x1: "7", y1: "12", x2: "9", y2: "12" }), /* @__PURE__ */ React.createElement("line", { x1: "15", y1: "12", x2: "17", y2: "12" })));
    case "vault-open":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("rect", { x: "3", y: "4", width: "11", height: "16", rx: "1" }), /* @__PURE__ */ React.createElement("path", { d: "M14 4l6 3v10l-6 3" }), /* @__PURE__ */ React.createElement("circle", { cx: "8", cy: "12", r: "3" }), /* @__PURE__ */ React.createElement("circle", { cx: "8", cy: "12", r: "1", fill: "currentColor", stroke: "none" }));
    case "gears":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "3" }), /* @__PURE__ */ React.createElement("path", { d: "M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" }));
    case "binary":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("text", { x: "3", y: "11", fontSize: "10", fontFamily: "monospace", fill: "currentColor", stroke: "none" }, "10"), /* @__PURE__ */ React.createElement("text", { x: "3", y: "21", fontSize: "10", fontFamily: "monospace", fill: "currentColor", stroke: "none" }, "01"), /* @__PURE__ */ React.createElement("text", { x: "14", y: "11", fontSize: "10", fontFamily: "monospace", fill: "currentColor", stroke: "none" }, "01"), /* @__PURE__ */ React.createElement("text", { x: "14", y: "21", fontSize: "10", fontFamily: "monospace", fill: "currentColor", stroke: "none" }, "10"));
    case "matrix":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M5 3v18M19 3v18M5 3h2M5 21h2M19 3h-2M19 21h-2" }), /* @__PURE__ */ React.createElement("circle", { cx: "10", cy: "8", r: "0.8", fill: "currentColor", stroke: "none" }), /* @__PURE__ */ React.createElement("circle", { cx: "14", cy: "8", r: "0.8", fill: "currentColor", stroke: "none" }), /* @__PURE__ */ React.createElement("circle", { cx: "10", cy: "12", r: "0.8", fill: "currentColor", stroke: "none" }), /* @__PURE__ */ React.createElement("circle", { cx: "14", cy: "12", r: "0.8", fill: "currentColor", stroke: "none" }), /* @__PURE__ */ React.createElement("circle", { cx: "10", cy: "16", r: "0.8", fill: "currentColor", stroke: "none" }), /* @__PURE__ */ React.createElement("circle", { cx: "14", cy: "16", r: "0.8", fill: "currentColor", stroke: "none" }));
    case "grid5":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("rect", { x: "4", y: "4", width: "16", height: "16" }), /* @__PURE__ */ React.createElement("path", { d: "M4 8h16M4 12h16M4 16h16M8 4v16M12 4v16M16 4v16" }));
    case "sword":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M14 4h6v6L9 21l-5-5z" }), /* @__PURE__ */ React.createElement("path", { d: "M5 13l6 6" }));
    case "keypair":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("circle", { cx: "7", cy: "8", r: "3" }), /* @__PURE__ */ React.createElement("path", { d: "M10 8h7l1 2-1 2h-7" }), /* @__PURE__ */ React.createElement("circle", { cx: "7", cy: "17", r: "3" }), /* @__PURE__ */ React.createElement("path", { d: "M10 17h6l1 2-1 2h-6" }));
    case "globe":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "12", r: "9" }), /* @__PURE__ */ React.createElement("path", { d: "M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" }));
    case "file-text":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M14 3H6v18h12V7z" }), /* @__PURE__ */ React.createElement("path", { d: "M14 3v4h4M8 12h8M8 16h6" }));
    case "file-image":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M14 3H6v18h12V7z" }), /* @__PURE__ */ React.createElement("path", { d: "M14 3v4h4" }), /* @__PURE__ */ React.createElement("circle", { cx: "10", cy: "13", r: "1.2" }), /* @__PURE__ */ React.createElement("path", { d: "m8 19 3-3 4 3" }));
    case "file-bin":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M14 3H6v18h12V7z" }), /* @__PURE__ */ React.createElement("path", { d: "M14 3v4h4" }), /* @__PURE__ */ React.createElement("text", { x: "8", y: "17", fontSize: "6", fontFamily: "monospace", fill: "currentColor", stroke: "none" }, "10"));
    case "skull":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M5 11a7 7 0 1 1 14 0v4l-2 2v3h-3v-2h-4v2H7v-3l-2-2z" }), /* @__PURE__ */ React.createElement("circle", { cx: "9", cy: "12", r: "1.4", fill: "currentColor", stroke: "none" }), /* @__PURE__ */ React.createElement("circle", { cx: "15", cy: "12", r: "1.4", fill: "currentColor", stroke: "none" }), /* @__PURE__ */ React.createElement("path", { d: "M11 16h2" }));
    case "play":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M6 4l14 8-14 8z", fill: "currentColor", stroke: "none" }));
    case "download":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "M12 3v12" }), /* @__PURE__ */ React.createElement("path", { d: "m7 10 5 5 5-5" }), /* @__PURE__ */ React.createElement("path", { d: "M4 19h16" }));
    case "whatsapp":
      return /* @__PURE__ */ React.createElement("svg", { ...common, viewBox: "0 0 32 32" }, /* @__PURE__ */ React.createElement("path", { d: "M16 3a13 13 0 0 0-11 19.7L3 29l6.5-1.7A13 13 0 1 0 16 3z" }), /* @__PURE__ */ React.createElement("path", { d: "M11 11c0-.6.4-1 1-1h1.2c.4 0 .8.3.9.7l.7 2.3c.1.4 0 .8-.3 1l-1 .9a9 9 0 0 0 4.5 4.5l1-1c.2-.3.6-.4 1-.3l2.3.7c.4.1.7.5.7.9V20c0 .6-.4 1-1 1-5 0-11-6-11-11z" }));
    case "paste":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("rect", { x: "6", y: "5", width: "12", height: "16", rx: "1" }), /* @__PURE__ */ React.createElement("path", { d: "M9 5V3h6v2" }), /* @__PURE__ */ React.createElement("path", { d: "M9 11h6M9 15h4" }));
    case "send":
      return /* @__PURE__ */ React.createElement("svg", { ...common }, /* @__PURE__ */ React.createElement("path", { d: "m3 12 18-9-7 18-3-7z" }));
    default:
      return null;
  }
}
const ALGO_ICON = {
  caesar: "sword",
  vigenere: "binary",
  hill: "matrix",
  playfair: "grid5",
  sha256: "binary",
  feistel64: "vault",
  xor: "gears",
  rsa: "keypair",
  banglashift: "globe"
};
function getFileCategory(file) {
  const t = (file.type || "").toLowerCase();
  const name = file.name.toLowerCase();
  if (t.startsWith("image/") || /\.(png|jpe?g|gif|bmp|webp|svg)$/.test(name)) return "image";
  if (t.startsWith("text/") || t === "application/json" || t === "application/xml" || /\.(txt|csv|json|xml|md|log|ini|conf|html|css|js|jsx|ts|tsx|py)$/.test(name)) return "text";
  return "binary";
}
function fileIcon(cat) {
  return cat === "image" ? "IMG" : cat === "text" ? "TXT" : "BIN";
}
function fileIconName(cat) {
  return cat === "image" ? "file-image" : cat === "text" ? "file-text" : "file-bin";
}
function formatBytes(n) {
  if (n < 1024) return n + " B";
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KB";
  if (n < 1024 * 1024 * 1024) return (n / 1024 / 1024).toFixed(2) + " MB";
  return (n / 1024 / 1024 / 1024).toFixed(2) + " GB";
}
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsText(file, "utf-8");
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
  let bin = "";
  const chunk = 32768;
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
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
function getHexDump(buffer, limit = 64) {
  const bytes = new Uint8Array(buffer).subarray(0, limit);
  const lines = [];
  for (let i = 0; i < bytes.length; i += 16) {
    const slice = bytes.subarray(i, i + 16);
    const hex = Array.from(slice).map((b) => b.toString(16).padStart(2, "0")).join(" ").padEnd(48, " ");
    const ascii = Array.from(slice).map((b) => b >= 32 && b < 127 ? String.fromCharCode(b) : ".").join("");
    lines.push(`${i.toString(16).padStart(8, "0")}  ${hex}  ${ascii}`);
  }
  return lines.join("\n") || "(empty)";
}
function getOriginalExt(name) {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i) : "";
}
function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
async function sha256Hex(bytes) {
  if (!crypto?.subtle) throw new Error("SHA-256 is unavailable in this browser context.");
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return bytesToHex(new Uint8Array(digest));
}
function normalizeBlockKey(keyText) {
  const key = String(keyText || "").trim();
  if (!key) throw new Error("Block cipher key cannot be empty.");
  return key;
}
function makeKeySeed(keyText) {
  let seed = 2166136261;
  for (const ch of keyText) {
    seed ^= ch.charCodeAt(0);
    seed = Math.imul(seed, 16777619) >>> 0;
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
  return (value << bits | value >>> 32 - bits) >>> 0;
}
function blockRound(r, k) {
  const mixed = (r ^ k) >>> 0;
  return (rotl32(mixed, 7) ^ rotl32(mixed + k >>> 0, 11) ^ Math.imul(r + 2654435769, 3)) >>> 0;
}
function readUint32(bytes, offset) {
  return (bytes[offset] << 24 | bytes[offset + 1] << 16 | bytes[offset + 2] << 8 | bytes[offset + 3]) >>> 0;
}
function writeUint32(bytes, offset, value) {
  bytes[offset] = value >>> 24 & 255;
  bytes[offset + 1] = value >>> 16 & 255;
  bytes[offset + 2] = value >>> 8 & 255;
  bytes[offset + 3] = value & 255;
}
function feistel64Transform(bytes, keyText, mode, onVisual) {
  const key = normalizeBlockKey(keyText);
  const roundKeys = makeRoundKeys(key);
  const rounds = mode === "encrypt" ? roundKeys : roundKeys.slice().reverse();
  if (mode === "decrypt" && bytes.length % 8 !== 0) {
    throw new Error("Feistel-64 ciphertext length must be a multiple of 8 bytes.");
  }
  const padLength = mode === "encrypt" ? 8 - (bytes.length % 8 || 8) : 0;
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
    const trace = [`[${String(blockIndex).padStart(2, "0")}] ${bytesToHex(padded.subarray(base, base + 8)).toUpperCase()}`];
    for (let roundIndex = 0; roundIndex < rounds.length; roundIndex++) {
      const nextLeft = right;
      const nextRight = (left ^ blockRound(right, rounds[roundIndex])) >>> 0;
      left = nextLeft;
      right = nextRight;
      trace.push(`  R${roundIndex + 1}: L=${left.toString(16).padStart(8, "0").toUpperCase()} R=${right.toString(16).padStart(8, "0").toUpperCase()}`);
    }
    writeUint32(out, base, right);
    writeUint32(out, base + 4, left);
    if (blockIndex < 4) {
      trace.push(`  OUT: ${bytesToHex(out.subarray(base, base + 8)).toUpperCase()}`);
      visual.push(trace.join("\n"));
    }
  }
  const result = mode === "decrypt" ? out.subarray(0, out.length - out[out.length - 1]) : out;
  if (onVisual) onVisual(visual.join("\n\n"));
  return result;
}
function xorBytes(bytes, keyText) {
  const key = normalizeBlockKey(keyText);
  const keyBytes = new TextEncoder().encode(key);
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    out[i] = bytes[i] ^ keyBytes[i % keyBytes.length];
  }
  return out;
}
function mod(n, m) {
  return (n % m + m) % m;
}
function modInverseInt(a, m) {
  a = mod(a, m);
  for (let x = 1; x < m; x++) if (a * x % m === 1) return x;
  return null;
}
function matrixDet(M) {
  const n = M.length;
  if (n === 2) return M[0][0] * M[1][1] - M[0][1] * M[1][0];
  if (n === 3) {
    return M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
  }
  return 0;
}
function matrixCofactor(M) {
  const n = M.length;
  const C2 = Array.from({ length: n }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const minor = M.filter((_, ri) => ri !== r).map((row) => row.filter((_, ci) => ci !== c));
      const sub = minor.length === 2 ? minor[0][0] * minor[1][1] - minor[0][1] * minor[1][0] : minor[0][0];
      C2[r][c] = ((r + c) % 2 === 0 ? 1 : -1) * sub;
    }
  }
  return C2;
}
function matrixInverseMod26(M) {
  const det = mod(matrixDet(M), 26);
  const detInv = modInverseInt(det, 26);
  if (detInv == null) return null;
  const n = M.length;
  if (n === 2) {
    const adj2 = [
      [mod(M[1][1], 26), mod(-M[0][1], 26)],
      [mod(-M[1][0], 26), mod(M[0][0], 26)]
    ];
    return adj2.map((r) => r.map((v) => mod(v * detInv, 26)));
  }
  const cof = matrixCofactor(M);
  const adj = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_2, c) => cof[c][r]));
  return adj.map((r) => r.map((v) => mod(v * detInv, 26)));
}
function caesarCipher(text, key, mode) {
  const k = mode === "encrypt" ? key : -key;
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c >= 65 && c <= 90) out += String.fromCharCode(mod(c - 65 + k, 26) + 65);
    else if (c >= 97 && c <= 122) out += String.fromCharCode(mod(c - 97 + k, 26) + 97);
    else out += text[i];
  }
  return out;
}
function vigenereCipher(text, key, mode) {
  const k = (key || "").toLowerCase().replace(/[^a-z]/g, "");
  if (!k) throw new Error("Vigenere key must contain at least one letter.");
  let out = "", ki = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    let isAlpha = false, base = 0;
    if (c >= 65 && c <= 90) {
      isAlpha = true;
      base = 65;
    } else if (c >= 97 && c <= 122) {
      isAlpha = true;
      base = 97;
    }
    if (isAlpha) {
      const shift = k.charCodeAt(ki % k.length) - 97;
      const s = mode === "encrypt" ? shift : -shift;
      out += String.fromCharCode(mod(c - base + s, 26) + base);
      ki++;
    } else {
      out += text[i];
    }
  }
  return out;
}
function hillCipher(text, M, mode) {
  const n = M.length;
  let key = M;
  if (mode === "decrypt") {
    key = matrixInverseMod26(M);
    if (!key) throw new Error("Matrix is not invertible mod 26 \u2014 cannot decrypt.");
  } else {
    if (mod(matrixDet(M), 26) === 0 || modInverseInt(mod(matrixDet(M), 26), 26) == null) {
      throw new Error("Matrix is not invertible mod 26. Decryption would be impossible.");
    }
  }
  const filtered = text.toUpperCase().replace(/[^A-Z]/g, "");
  const padded = filtered + "X".repeat((n - filtered.length % n) % n);
  let out = "";
  for (let i = 0; i < padded.length; i += n) {
    const block = [];
    for (let j = 0; j < n; j++) block.push(padded.charCodeAt(i + j) - 65);
    for (let r = 0; r < n; r++) {
      let sum = 0;
      for (let c = 0; c < n; c++) sum += key[r][c] * block[c];
      out += String.fromCharCode(mod(sum, 26) + 65);
    }
  }
  return out;
}
function playfairBuildSquare(key) {
  const cleaned = (key || "").toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  const seen = /* @__PURE__ */ new Set();
  let s = "";
  for (const ch of cleaned + "ABCDEFGHIKLMNOPQRSTUVWXYZ") {
    if (!seen.has(ch)) {
      seen.add(ch);
      s += ch;
    }
  }
  const grid = [];
  for (let r = 0; r < 5; r++) grid.push(s.slice(r * 5, r * 5 + 5).split(""));
  return grid;
}
function playfairFind(grid, ch) {
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++)
    if (grid[r][c] === ch) return [r, c];
  return null;
}
function playfairCipher(text, key, mode) {
  const grid = playfairBuildSquare(key);
  const cleaned = text.toUpperCase().replace(/J/g, "I").replace(/[^A-Z]/g, "");
  const pairs = [];
  let i = 0;
  while (i < cleaned.length) {
    const a = cleaned[i];
    let b = cleaned[i + 1];
    if (!b) {
      pairs.push([a, "X"]);
      i += 1;
    } else if (a === b) {
      pairs.push([a, "X"]);
      i += 1;
    } else {
      pairs.push([a, b]);
      i += 2;
    }
  }
  const dir = mode === "encrypt" ? 1 : -1;
  let out = "";
  for (const [a, b] of pairs) {
    const [r1, c1] = playfairFind(grid, a);
    const [r2, c2] = playfairFind(grid, b);
    let oa, ob;
    if (r1 === r2) {
      oa = grid[r1][mod(c1 + dir, 5)];
      ob = grid[r2][mod(c2 + dir, 5)];
    } else if (c1 === c2) {
      oa = grid[mod(r1 + dir, 5)][c1];
      ob = grid[mod(r2 + dir, 5)][c2];
    } else {
      oa = grid[r1][c2];
      ob = grid[r2][c1];
    }
    out += oa + ob;
  }
  return out;
}
+/* ============== RSA (BigInt) ============== */
function bigRand2(bits) {
  const bytes = Math.ceil(bits / 8);
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  arr[0] |= 128;
  arr[bytes - 1] |= 1;
  let n = 0n;
  for (const b of arr) n = n << 8n | BigInt(b);
  return n;
};
function modPow(base, exp, m) {
  if (m === 1n) return 0n;
  let result = 1n;
  base = base % m;
  while (exp > 0n) {
    if (exp & 1n) result = result * base % m;
    exp >>= 1n;
    base = base * base % m;
  }
  return result;
}
function millerRabin(n, k = 8) {
  if (n < 2n) return false;
  if (n === 2n || n === 3n) return true;
  if (n % 2n === 0n) return false;
  let d = n - 1n, r = 0n;
  while (d % 2n === 0n) {
    d /= 2n;
    r++;
  }
  const witnesses = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
  outer: for (let i = 0; i < Math.min(k, witnesses.length); i++) {
    const a = witnesses[i];
    if (a >= n) continue;
    let x = modPow(a, d, n);
    if (x === 1n || x === n - 1n) continue;
    for (let j = 0n; j < r - 1n; j++) {
      x = x * x % n;
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
  return [g, y1, x1 - a / b * y1];
}
function modInverseBig(a, m) {
  const [g, x] = egcd((a % m + m) % m, m);
  if (g !== 1n) throw new Error("No modular inverse");
  return (x % m + m) % m;
}
function generateRSAKeyPair() {
  const bits = 64;
  const p = genPrime(bits);
  let q = genPrime(bits);
  while (q === p) q = genPrime(bits);
  const n = p * q;
  const phi = (p - 1n) * (q - 1n);
  const e = 65537n;
  if (phi % e === 0n) return generateRSAKeyPair();
  const d = modInverseBig(e, phi);
  return { e: e.toString(), n: n.toString(), d: d.toString(), p: p.toString(), q: q.toString() };
}
function rsaBlockSizes(n) {
  let bits = 0;
  let nn = n;
  while (nn > 0n) {
    bits++;
    nn >>= 1n;
  }
  const inBytes = Math.max(1, Math.floor((bits - 1) / 8) - 1);
  const outBytes = Math.ceil(bits / 8) + 1;
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
    for (const b of slice) m = m << 8n | BigInt(b);
    m = m << 8n | BigInt(slice.length);
    const c = modPow(m, e, n);
    let cc = c;
    for (let k = outBytes - 1; k >= 0; k--) {
      out[i * outBytes + k] = Number(cc & 0xffn);
      cc >>= 8n;
    }
    if (onProgress && (i % 64 === 0 || i === numBlocks - 1)) {
      onProgress((i + 1) / numBlocks);
      await new Promise((r) => setTimeout(r, 0));
    }
  }
  return out;
}
async function rsaDecryptBytes(bytes, d, n, onProgress) {
  const { outBytes } = rsaBlockSizes(n);
  if (bytes.length % outBytes !== 0) throw new Error("RSA ciphertext length mismatch \u2014 wrong key or corrupted file.");
  const numBlocks = bytes.length / outBytes;
  const result = [];
  for (let i = 0; i < numBlocks; i++) {
    let c = 0n;
    for (let k = 0; k < outBytes; k++) c = c << 8n | BigInt(bytes[i * outBytes + k]);
    const m = modPow(c, d, n);
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
      await new Promise((r) => setTimeout(r, 0));
    }
  }
  return new Uint8Array(result);
}
function banglaPermutedArray(permKey) {
  const k = (permKey || "").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const shift = mod(k, 26);
  return BANGLA.slice(shift).concat(BANGLA.slice(0, shift));
}
function banglaShift(text, langKey, permKey, mode) {
  if (!permKey) throw new Error("BanglaShift permutation key cannot be empty.");
  const arr = banglaPermutedArray(permKey);
  if (mode === "encrypt") {
    let out = "";
    for (const ch of text) {
      const lower = ch.toLowerCase();
      const code = lower.charCodeAt(0);
      if (code >= 97 && code <= 122) out += arr[code - 97];
      else out += ch;
    }
    return out;
  } else {
    const reverse = /* @__PURE__ */ new Map();
    for (let i = 0; i < 26; i++) reverse.set(arr[i], String.fromCharCode(97 + i));
    let out = "";
    for (const ch of text) {
      out += reverse.has(ch) ? reverse.get(ch) : ch;
    }
    return out;
  }
}
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
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, cols = 0, cellSize = 14;
    const isMobile = window.innerWidth < 768;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    const targetFPS = isMobile || isCoarse ? 24 : 60;
    const frameInterval = 1e3 / targetFPS;
    const charset = "01ABCDEF0123456789!@#$%&*+=<>".split("");
    const banglaSet = BANGLA;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.25 : 1.75);
      w = canvas.width = Math.floor(window.innerWidth * dpr);
      h = canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cellSize = isMobile ? 18 : 14;
      cols = Math.ceil(window.innerWidth / cellSize);
      dropsRef.current = Array(cols).fill(0).map(() => Math.random() * window.innerHeight / cellSize);
    };
    resize();
    window.addEventListener("resize", resize);
    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
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
      lastTickRef.current = ts - elapsed % frameInterval;
      const W = window.innerWidth;
      const H = window.innerHeight;
      ctx.fillStyle = dangerRef.current ? "rgba(8, 0, 0, 0.10)" : "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, W, H);
      ctx.font = cellSize + 'px "Share Tech Mono", monospace';
      const drops = dropsRef.current;
      const baseColor = dangerRef.current ? "#ff003c" : "#00ff41";
      const headColor = dangerRef.current ? "#ffaaaa" : "#aaffaa";
      const stride = isMobile ? 2 : 1;
      for (let i = 0; i < drops.length; i += stride) {
        const useBangla = banglaRef.current && Math.random() < 0.3;
        const set = useBangla ? banglaSet : charset;
        const ch = set[Math.floor(Math.random() * set.length)];
        const x = i * cellSize;
        const y = drops[i] * cellSize;
        const isHead = Math.random() < 0.04;
        ctx.fillStyle = useBangla ? "#ffc800" : isHead ? headColor : baseColor;
        ctx.fillText(ch, x, y);
        if (y > H && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      io.disconnect();
    };
  }, []);
  return /* @__PURE__ */ React.createElement("canvas", { ref, className: "cv-canvas", "aria-hidden": "true" });
}
function FileDropZone({ file, onFile, onClear, fileCategory, hexDump }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);
  if (file) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "cv-fileinfo" }, /* @__PURE__ */ React.createElement("div", { className: "cv-icon" }, /* @__PURE__ */ React.createElement(Icon, { name: fileIconName(fileCategory), size: 26 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "cv-fname" }, file.name), /* @__PURE__ */ React.createElement("div", { className: "cv-fmeta" }, file.type || "unknown/binary", " \xB7 ", formatBytes(file.size), " \xB7 category: ", fileCategory.toUpperCase())), /* @__PURE__ */ React.createElement("button", { className: "cv-clear-btn", onClick: onClear }, "[ X ] CLEAR")), /* @__PURE__ */ React.createElement("div", { className: "cv-hex-h" }, "// First 64 bytes \u2014 hex dump"), /* @__PURE__ */ React.createElement("div", { className: "cv-hex" }, hexDump));
  }
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "cv-drop" + (drag ? " drag" : ""),
      onClick: () => inputRef.current && inputRef.current.click(),
      onDragOver: (e) => {
        e.preventDefault();
        setDrag(true);
      },
      onDragLeave: () => setDrag(false),
      onDrop: (e) => {
        e.preventDefault();
        setDrag(false);
        if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
      }
    },
    /* @__PURE__ */ React.createElement(
      "input",
      {
        ref: inputRef,
        type: "file",
        style: { display: "none" },
        onChange: (e) => e.target.files[0] && onFile(e.target.files[0])
      }
    ),
    /* @__PURE__ */ React.createElement("svg", { className: "cv-vault-ico", viewBox: "0 0 64 64", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("rect", { x: "6", y: "8", width: "52", height: "48", rx: "2" }), /* @__PURE__ */ React.createElement("circle", { cx: "32", cy: "32", r: "16" }), /* @__PURE__ */ React.createElement("circle", { cx: "32", cy: "32", r: "3", fill: "currentColor", stroke: "none" }), /* @__PURE__ */ React.createElement("g", { className: "dial" }, /* @__PURE__ */ React.createElement("line", { x1: "32", y1: "18", x2: "32", y2: "22" }), /* @__PURE__ */ React.createElement("line", { x1: "32", y1: "42", x2: "32", y2: "46" }), /* @__PURE__ */ React.createElement("line", { x1: "18", y1: "32", x2: "22", y2: "32" }), /* @__PURE__ */ React.createElement("line", { x1: "42", y1: "32", x2: "46", y2: "32" }), /* @__PURE__ */ React.createElement("line", { x1: "22", y1: "22", x2: "25", y2: "25" }), /* @__PURE__ */ React.createElement("line", { x1: "39", y1: "39", x2: "42", y2: "42" }), /* @__PURE__ */ React.createElement("line", { x1: "22", y1: "42", x2: "25", y2: "39" }), /* @__PURE__ */ React.createElement("line", { x1: "39", y1: "25", x2: "42", y2: "22" })), /* @__PURE__ */ React.createElement("line", { x1: "6", y1: "14", x2: "58", y2: "14" }), /* @__PURE__ */ React.createElement("line", { x1: "6", y1: "50", x2: "58", y2: "50" })),
    /* @__PURE__ */ React.createElement("div", { className: "cv-drop-h" }, ">", " DROP FILE HERE_"),
    /* @__PURE__ */ React.createElement("div", { className: "cv-drop-s" }, "// or click to browse \xB7 supported: text, image, binary")
  );
}
const AlgorithmCard = React.memo(function AlgorithmCard2({ algo, state, selected, onSelect }) {
  const cls = `cv-card ${state} ${selected ? "selected" : ""}`;
  let badgeText, tooltip;
  if (state === "compatible") {
    badgeText = "COMPATIBLE";
    tooltip = `[INFO] ${algo.fact}`;
  } else if (state === "incompatible") {
    badgeText = "INCOMPATIBLE";
    tooltip = `[ERROR] ${ALG_LABEL[algo.id]} requires text input. This file type is not supported.`;
  } else if (state === "base64warn") {
    badgeText = "BASE64 MODE";
    tooltip = `[WARN] File will be Base64-encoded before encryption. Output is a .txt file.`;
  } else {
    badgeText = "LOCKED";
  }
  const clickable = state !== "incompatible" && state !== "locked";
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      className: cls,
      onClick: clickable ? () => onSelect(algo.id) : void 0,
      role: "button",
      tabIndex: clickable ? 0 : -1,
      "aria-pressed": selected,
      "aria-disabled": !clickable,
      onKeyDown: (e) => {
        if (clickable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect(algo.id);
        }
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "cv-card-ico" }, /* @__PURE__ */ React.createElement(
      Icon,
      {
        name: ALGO_ICON[algo.id] || "gears",
        size: 32,
        className: state === "incompatible" ? "dim" : ""
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "cv-card-num" }, "CIPHER_0", ALGORITHMS.findIndex((a) => a.id === algo.id) + 1)),
    /* @__PURE__ */ React.createElement("div", { className: "cv-card-name" }, algo.name),
    /* @__PURE__ */ React.createElement("div", { className: "cv-card-desc" }, algo.desc),
    /* @__PURE__ */ React.createElement("span", { className: `cv-badge ${state}` }, badgeText),
    state === "locked" && /* @__PURE__ */ React.createElement("div", { className: "cv-card-overlay" }, /* @__PURE__ */ React.createElement(Icon, { name: "lock-closed", size: 32, className: "dim" }), /* @__PURE__ */ React.createElement("div", null, "UPLOAD FILE FIRST")),
    state !== "locked" && tooltip && /* @__PURE__ */ React.createElement("div", { className: "cv-tooltip", style: {
      color: state === "incompatible" ? C.red : state === "base64warn" ? C.amber : "var(--secondary)"
    } }, tooltip)
  );
});
function KeyInputPanel({ algo, keyState, setKey }) {
  if (!algo) {
    return /* @__PURE__ */ React.createElement("div", { className: "cv-key-empty" }, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--accent)", fontSize: 16 } }, ">", " KEY_INPUT"), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--secondary)", marginTop: 8 } }, "// Waiting for algorithm selection..."), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--accent-dim)", marginTop: 4 }, className: "cv-cursor" }, "// Select an algorithm to configure key inputs"));
  }
  if (algo === "sha256") {
    return /* @__PURE__ */ React.createElement("div", { className: "cv-key-empty" }, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--accent)", fontSize: 16 } }, ">", " HASH_READY"), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--secondary)", marginTop: 8 } }, "// SHA-256 needs no key. It fingerprints the current input as-is."), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--accent-dim)", marginTop: 4 }, className: "cv-cursor" }, "// Select EXECUTE to generate a digest"));
  }
  if (algo === "feistel64") {
    const v = keyState.blockKey ?? "vault-key";
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "cv-label" }, "// BLOCK KEY [passphrase]"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        className: "cv-input",
        value: v,
        onChange: (e) => setKey({ ...keyState, blockKey: e.target.value }),
        placeholder: "e.g. vault-key"
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--secondary)", fontSize: 12, marginTop: 8 } }, "// 64-bit blocks, 4 Feistel rounds, reversible on encrypt/decrypt"));
  }
  if (algo === "xor") {
    const v = keyState.xorKey ?? "key";
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "cv-label" }, "// XOR KEY [passphrase]"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        className: "cv-input",
        value: v,
        onChange: (e) => setKey({ ...keyState, xorKey: e.target.value }),
        placeholder: "e.g. key"
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { color: "var(--secondary)", fontSize: 12, marginTop: 8 } }, "// Repeating-key XOR works on text, images, and binary streams"));
  }
  if (algo === "caesar") {
    const v = keyState.caesarShift ?? "";
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "cv-label" }, "// SHIFT VALUE [0-25]"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "number",
        min: "0",
        max: "25",
        className: "cv-input",
        value: v,
        onChange: (e) => setKey({ ...keyState, caesarShift: e.target.value }),
        placeholder: "e.g. 3"
      }
    ), v !== "" && (parseInt(v, 10) > 25 || parseInt(v, 10) < 0) && /* @__PURE__ */ React.createElement("div", { style: { color: C.amber, fontSize: 12, marginTop: 6 } }, "[WARN] Shift will be reduced mod 26."));
  }
  if (algo === "vigenere") {
    const v = keyState.vigenereKey ?? "";
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "cv-label" }, "// KEYWORD [alphabetic]"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        className: "cv-input",
        value: v,
        onChange: (e) => setKey({ ...keyState, vigenereKey: e.target.value.replace(/[^a-zA-Z]/g, "") }),
        placeholder: "e.g. LEMON"
      }
    ), v && v.length < 3 && /* @__PURE__ */ React.createElement("div", { style: { color: C.amber, fontSize: 12, marginTop: 6 } }, "[WARN] Short keys are weak. Use 3+ letters."));
  }
  if (algo === "playfair") {
    const v = keyState.playfairKey ?? "";
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "cv-label" }, "// KEYWORD [alphabetic \u2014 builds 5x5 grid]"), /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        className: "cv-input",
        value: v,
        onChange: (e) => setKey({ ...keyState, playfairKey: e.target.value.replace(/[^a-zA-Z]/g, "") }),
        placeholder: "e.g. PLAYFAIR EXAMPLE"
      }
    ), v && v.length < 3 && /* @__PURE__ */ React.createElement("div", { style: { color: C.amber, fontSize: 12, marginTop: 6 } }, "[WARN] Short keys are weak. Use 3+ letters."));
  }
  if (algo === "hill") {
    const dim = keyState.hillDim ?? 2;
    const matrix = keyState.hillMatrix ?? [[1, 0], [0, 1]];
    const setMatrix = (m) => setKey({ ...keyState, hillMatrix: m });
    const setDim = (d) => {
      const m = Array.from({ length: d }, (_, r) => Array.from({ length: d }, (_2, c) => r === c ? 1 : 0));
      setKey({ ...keyState, hillDim: d, hillMatrix: m });
    };
    let detVal = null, invertible = false;
    try {
      detVal = mod(matrixDet(matrix), 26);
      invertible = modInverseInt(detVal, 26) != null;
    } catch {
    }
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "cv-label" }, "// MATRIX DIMENSION"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("button", { className: "cv-btn " + (dim === 2 ? "" : "cyan"), onClick: () => setDim(2), style: dim === 2 ? { background: "var(--accent)", color: "#000" } : {} }, "2 x 2"), /* @__PURE__ */ React.createElement("button", { className: "cv-btn " + (dim === 3 ? "" : "cyan"), onClick: () => setDim(3), style: dim === 3 ? { background: "var(--accent)", color: "#000" } : {} }, "3 x 3")), /* @__PURE__ */ React.createElement("label", { className: "cv-label" }, "// KEY MATRIX (mod 26)"), /* @__PURE__ */ React.createElement("div", { className: "cv-matrix-grid", style: { gridTemplateColumns: `repeat(${dim}, 1fr)` } }, matrix.flat().map((val, idx) => {
      const r = Math.floor(idx / dim), c = idx % dim;
      return /* @__PURE__ */ React.createElement(
        "input",
        {
          key: idx,
          type: "number",
          value: val,
          onChange: (e) => {
            const next = matrix.map((row) => row.slice());
            next[r][c] = parseInt(e.target.value, 10) || 0;
            setMatrix(next);
          }
        }
      );
    })), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 10, fontSize: 12, color: invertible ? "var(--accent)" : C.red } }, "det mod 26 = ", detVal, " \u2014 ", invertible ? "[OK] Invertible" : "[ERROR] Not invertible mod 26"));
  }
  if (algo === "rsa") {
    const generate = () => {
      try {
        const kp = generateRSAKeyPair();
        setKey({ ...keyState, rsaE: kp.e, rsaN: kp.n, rsaD: kp.d, rsaGenerated: kp });
      } catch (err) {
        alert("Key gen failed: " + err.message);
      }
    };
    return /* @__PURE__ */ React.createElement("div", { className: "cv-row" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "cv-label" }, "// PUBLIC EXPONENT (e) \u2014 for encrypt; or PRIVATE (d) for decrypt"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "cv-input",
        placeholder: "e.g. 65537",
        value: keyState.rsaE ?? "",
        onChange: (e) => setKey({ ...keyState, rsaE: e.target.value.replace(/[^0-9]/g, "") })
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "cv-label" }, "// MODULUS (n)"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "cv-input",
        placeholder: "e.g. 12345...",
        value: keyState.rsaN ?? "",
        onChange: (e) => setKey({ ...keyState, rsaN: e.target.value.replace(/[^0-9]/g, "") })
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "cv-label" }, "// PRIVATE EXPONENT (d) \u2014 only needed for decrypt"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "cv-input",
        placeholder: "(decrypt only)",
        value: keyState.rsaD ?? "",
        onChange: (e) => setKey({ ...keyState, rsaD: e.target.value.replace(/[^0-9]/g, "") })
      }
    )), /* @__PURE__ */ React.createElement("button", { className: "cv-btn cyan", onClick: generate, style: { padding: "14px", fontSize: 14 } }, "[ + ] GENERATE KEY PAIR"), keyState.rsaGenerated && /* @__PURE__ */ React.createElement("div", { className: "cv-keyout" }, /* @__PURE__ */ React.createElement("div", { style: { color: "var(--accent)" } }, "[OK] Key pair generated"), /* @__PURE__ */ React.createElement("div", null, "PUBLIC  e = ", keyState.rsaGenerated.e), /* @__PURE__ */ React.createElement("div", null, "PUBLIC  n = ", keyState.rsaGenerated.n), /* @__PURE__ */ React.createElement("div", null, "PRIVATE d = ", keyState.rsaGenerated.d), /* @__PURE__ */ React.createElement("div", { style: { color: C.amber, marginTop: 6 } }, "// Save the private key to decrypt later.")));
  }
  if (algo === "banglashift") {
    const v = keyState.banglaPerm ?? "";
    const arr = banglaPermutedArray(v);
    return /* @__PURE__ */ React.createElement("div", { className: "cv-row" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "cv-label" }, "// TARGET SCRIPT"), /* @__PURE__ */ React.createElement("select", { className: "cv-input", value: "bn", disabled: true }, /* @__PURE__ */ React.createElement("option", { value: "bn" }, "Bangla (\u09AC\u09BE\u0982\u09B2\u09BE)"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "cv-label" }, "// PERMUTATION KEY"), /* @__PURE__ */ React.createElement(
      "input",
      {
        className: "cv-input",
        placeholder: "any text",
        value: v,
        onChange: (e) => setKey({ ...keyState, banglaPerm: e.target.value })
      }
    )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "cv-label" }, "// LIVE MAPPING PREVIEW"), /* @__PURE__ */ React.createElement("div", { className: "cv-mapping" }, /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "EN"), /* @__PURE__ */ React.createElement("th", null, "BN"))), /* @__PURE__ */ React.createElement("tbody", null, arr.map((bn, i) => /* @__PURE__ */ React.createElement("tr", { key: i }, /* @__PURE__ */ React.createElement("td", null, String.fromCharCode(97 + i)), /* @__PURE__ */ React.createElement("td", null, bn))))))));
  }
  return null;
}
function ModeToggle({ mode, setMode }) {
  return /* @__PURE__ */ React.createElement("div", { className: "cv-mode-row" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "cv-mode-btn encrypt" + (mode === "encrypt" ? " active" : ""),
      onClick: () => setMode("encrypt")
    },
    "[ ENCRYPT ]"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "cv-mode-btn decrypt" + (mode === "decrypt" ? " active" : ""),
      onClick: () => setMode("decrypt")
    },
    "[ DECRYPT ]"
  ));
}
const TerminalLog = React.memo(function TerminalLog2({ lines }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines]);
  if (!lines.length) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "cv-term", ref, role: "log", "aria-live": "polite", "aria-label": "Cipher execution log" }, lines.map((l, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: `cv-term-line cv-l-${l.kind}` }, l.text)));
});
const OutputPanel = React.memo(function OutputPanel2({ output, onDownload, onCopy, copied, onWhatsApp, waPhone, setWaPhone, showWA }) {
  if (!output) return null;
  return /* @__PURE__ */ React.createElement("div", { className: "cv-output", id: "cv-output-anchor", role: "region", "aria-label": "Cipher output" }, /* @__PURE__ */ React.createElement("div", { className: "cv-output-h" }, /* @__PURE__ */ React.createElement(Icon, { name: "vault-open", size: 28, className: "second" }), "\xA0", ">", " VAULT_OPEN \u2014 OUTPUT_READY"), /* @__PURE__ */ React.createElement("div", { className: "cv-output-meta" }, output.filename, " \xB7 ", formatBytes(output.size), " \xB7 ", output.contentKind), output.preview && /* @__PURE__ */ React.createElement("div", { className: "cv-preview" }, output.preview), output.blockVisual && /* @__PURE__ */ React.createElement("div", { className: "cv-blockviz" }, output.blockVisual), /* @__PURE__ */ React.createElement("div", { className: "cv-dl-row" }, /* @__PURE__ */ React.createElement("button", { className: "cv-dl", onClick: onDownload }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement(Icon, { name: "download", size: 22 }), ">", " DOWNLOAD FILE_")), output.preview && /* @__PURE__ */ React.createElement("button", { className: "cv-btn cyan", onClick: onCopy }, copied ? "[OK] COPIED" : "[ ] COPY TEXT")), showWA && output.preview && /* @__PURE__ */ React.createElement("div", { className: "cv-wa-row" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      className: "cv-input",
      placeholder: "phone (optional, e.g. 8801234567890)",
      value: waPhone,
      onChange: (e) => setWaPhone(e.target.value.replace(/[^0-9]/g, ""))
    }
  ), /* @__PURE__ */ React.createElement("span", { style: { alignSelf: "center", color: "var(--secondary)", fontSize: 11, letterSpacing: 1 } }, "// opens WhatsApp with the cipher pre-filled \u2014 you still tap send"), /* @__PURE__ */ React.createElement("button", { className: "cv-wa-btn", onClick: onWhatsApp }, /* @__PURE__ */ React.createElement(Icon, { name: "whatsapp", size: 22 }), "SEND TO WHATSAPP")));
});
export default function App() {
  const [file, setFile] = useState(null);
  const [fileCategory, setFileCategory] = useState(null);
  const [fileBuffer, setFileBuffer] = useState(null);
  const [hexDump, setHexDump] = useState("");
  const [algo, setAlgo] = useState(null);
  const [keyState, setKeyState] = useState({});
  const [mode, setMode] = useState(null);
  const [logs, setLogs] = useState([]);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inputMode, setInputMode] = useState("file");
  const [plainText, setPlainText] = useState("");
  const [waPhone, setWaPhone] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => {
      try {
        document.head.removeChild(s);
      } catch {
      }
    };
  }, []);
  const banglaActive = algo === "banglashift";
  const danger = mode === "decrypt";
  useEffect(() => {
    document.documentElement.classList.toggle("danger", danger);
    return () => document.documentElement.classList.remove("danger");
  }, [danger]);
  useEffect(() => {
    if (inputMode !== "text") return;
    if (plainText) {
      const f = new File([plainText], "message.txt", { type: "text/plain" });
      const buf = new TextEncoder().encode(plainText).buffer;
      setFile(f);
      setFileCategory("text");
      setFileBuffer(buf);
      setHexDump(getHexDump(buf, 64));
    } else {
      setFile(null);
      setFileCategory(null);
      setFileBuffer(null);
      setHexDump("");
    }
    setOutput(null);
    const t = setTimeout(() => {
      if (inputMode === "text" && plainText) {
        const buf = new TextEncoder().encode(plainText).buffer;
        setHexDump(getHexDump(buf, 64));
      }
    }, 120);
    return () => clearTimeout(t);
  }, [inputMode, plainText]);
  const switchInputMode = (m) => {
    if (m === inputMode) return;
    setInputMode(m);
    setFile(null);
    setFileBuffer(null);
    setHexDump("");
    setFileCategory(null);
    setOutput(null);
    setLogs([]);
    if (m === "file") setPlainText("");
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
      setHexDump("// failed to read file: " + e.message);
    }
    if (algo && ALGORITHM_VALIDATION[algo][cat] === "error") setAlgo(null);
  }, [algo]);
  const clearFile = () => {
    setFile(null);
    setFileBuffer(null);
    setHexDump("");
    setFileCategory(null);
    setOutput(null);
    setLogs([]);
  };
  const algoState = useCallback((aid) => {
    if (!file) return "locked";
    return ALGORITHM_VALIDATION[aid][fileCategory] === "error" ? "incompatible" : ALGORITHM_VALIDATION[aid][fileCategory] === "base64warn" ? "base64warn" : "compatible";
  }, [file, fileCategory]);
  const selectAlgo = (aid) => {
    setAlgo(aid);
    setOutput(null);
    setLogs([]);
    if (aid === "caesar") setKeyState({ caesarShift: "3" });
    else if (aid === "vigenere") setKeyState({ vigenereKey: "" });
    else if (aid === "playfair") setKeyState({ playfairKey: "" });
    else if (aid === "hill") setKeyState({ hillDim: 2, hillMatrix: [[3, 3], [2, 5]] });
    else if (aid === "sha256") {
      setKeyState({});
      setMode("encrypt");
    } else if (aid === "feistel64") setKeyState({ blockKey: "vault-key" });
    else if (aid === "xor") setKeyState({ xorKey: "key" });
    else if (aid === "rsa") setKeyState({ rsaE: "", rsaN: "", rsaD: "" });
    else if (aid === "banglashift") setKeyState({ banglaPerm: "" });
  };
  const keyReady = useMemo(() => {
    if (!algo) return false;
    if (algo === "caesar") return keyState.caesarShift !== "" && keyState.caesarShift != null;
    if (algo === "vigenere") return !!(keyState.vigenereKey && keyState.vigenereKey.length);
    if (algo === "playfair") return !!(keyState.playfairKey && keyState.playfairKey.length);
    if (algo === "sha256") return true;
    if (algo === "feistel64") return !!(keyState.blockKey && keyState.blockKey.trim().length);
    if (algo === "xor") return !!(keyState.xorKey && keyState.xorKey.trim().length);
    if (algo === "hill") {
      const m = keyState.hillMatrix;
      if (!m) return false;
      try {
        return modInverseInt(mod(matrixDet(m), 26), 26) != null;
      } catch {
        return false;
      }
    }
    if (algo === "rsa") {
      if (!keyState.rsaN) return false;
      if (mode === "decrypt") return !!(keyState.rsaD && keyState.rsaD.length);
      return !!(keyState.rsaE && keyState.rsaE.length);
    }
    if (algo === "banglashift") return !!(keyState.banglaPerm && keyState.banglaPerm.length);
    return false;
  }, [algo, keyState, mode]);
  const hint = !file ? "// need: file" : !algo ? "// need: algorithm" : !keyReady ? "// need: key" : !mode ? "// need: mode" : "// READY TO EXECUTE";
  const canExecute = !!(file && algo && keyReady && mode && !running);
  const log = (kind, text) => setLogs((prev) => [...prev, { kind, text }]);
  const execute = useCallback(async () => {
    if (!canExecute) return;
    setRunning(true);
    setOutput(null);
    setLogs([]);
    setCopied(false);
    try {
      log("step", "[*] Validating inputs...");
      log("ok", `[OK] File loaded: ${file.name} (${formatBytes(file.size)})`);
      const validation = ALGORITHM_VALIDATION[algo][fileCategory];
      const useBase64 = validation === "base64warn";
      const algoLabel = ALG_LABEL[algo] + (useBase64 ? " (Base64 mode)" : "");
      log("ok", `[OK] Algorithm: ${algoLabel}`);
      log("ok", `[OK] Mode: ${mode.toUpperCase()}`);
      if (validation === "error") {
        log("err", `[ERROR] ${ALG_LABEL[algo]} does not support ${fileCategory} files.`);
        const compat = ALGORITHMS.filter((a) => ALGORITHM_VALIDATION[a.id][fileCategory] !== "error").map((a) => a.name).join(", ");
        log("info", `[INFO] Compatible algorithms for this file: ${compat}`);
        log("err", "[ABORT] Execution halted.");
        setRunning(false);
        return;
      }
      if (algo === "rsa" && file.size > 5 * 1024 * 1024) {
        log("warn", "[WARN] RSA on >5MB files is slow. Continuing...");
      }
      let outputBlob, outputName, contentKind, preview = null;
      let blockVisual = null;
      if (algo === "sha256") {
        if (mode !== "encrypt") log("warn", "[WARN] SHA-256 is one-way; generating a digest regardless of mode.");
        log("step", "[*] Reading file bytes...");
        const bytes = new Uint8Array(fileBuffer);
        log("step", "[*] Computing SHA-256 digest...");
        const digestHex = await sha256Hex(bytes);
        const baseName = file.name.replace(/^encrypted_/, "").replace(/^decrypted_/, "").replace(/\.[^.]+$/, "") || "input";
        outputBlob = new Blob([digestHex + "\n"], { type: "text/plain;charset=utf-8" });
        outputName = `sha256_${baseName}.txt`;
        contentKind = "text (SHA-256 digest)";
        preview = digestHex;
      } else if (algo === "feistel64") {
        log("step", "[*] Reading file bytes...");
        const bytes = new Uint8Array(fileBuffer);
        log("step", mode === "encrypt" ? "[*] Encrypting 64-bit blocks..." : "[*] Decrypting 64-bit blocks...");
        const cipherBytes = feistel64Transform(bytes, keyState.blockKey, mode, (trace) => {
          blockVisual = trace;
        });
        outputBlob = new Blob([cipherBytes], { type: "application/octet-stream" });
        const baseName = file.name.replace(/^encrypted_/, "").replace(/^decrypted_/, "").replace(/\.[^.]+$/, "");
        outputName = `${mode === "encrypt" ? "encrypted" : "decrypted"}_${baseName}.bin`;
        contentKind = "binary (Feistel-64)";
        preview = bytesToHex(cipherBytes.subarray(0, Math.min(64, cipherBytes.length))).toUpperCase().replace(/(.{2})/g, "$1 ").trim();
      } else if (algo === "xor") {
        log("step", "[*] Reading file bytes...");
        const bytes = new Uint8Array(fileBuffer);
        log("step", mode === "encrypt" ? "[*] Applying XOR stream..." : "[*] Reversing XOR stream...");
        const cipherBytes = xorBytes(bytes, keyState.xorKey);
        outputBlob = new Blob([cipherBytes], { type: "application/octet-stream" });
        const baseName = file.name.replace(/^encrypted_/, "").replace(/^decrypted_/, "").replace(/\.[^.]+$/, "");
        outputName = `${mode === "encrypt" ? "encrypted" : "decrypted"}_${baseName}.bin`;
        contentKind = "binary (XOR stream)";
        preview = bytesToHex(cipherBytes.subarray(0, Math.min(64, cipherBytes.length))).toUpperCase().replace(/(.{2})/g, "$1 ").trim();
      } else if (algo === "rsa") {
        if (mode === "encrypt") {
          const e = BigInt(keyState.rsaE);
          const n = BigInt(keyState.rsaN);
          if (e <= 0n || n <= 0n) throw new Error("RSA key values must be positive.");
          log("step", "[*] Reading file as bytes...");
          const bytes = new Uint8Array(fileBuffer);
          log("step", "[*] Encrypting via modular exponentiation...");
          let lastPct = -1;
          const cipher = await rsaEncryptBytes(bytes, e, n, (p) => {
            const pct = Math.floor(p * 100);
            if (pct !== lastPct && pct % 10 === 0) {
              lastPct = pct;
              const bar = "\u2588".repeat(Math.floor(p * 10)) + "\u2591".repeat(10 - Math.floor(p * 10));
              setLogs((prev) => {
                const next = [...prev];
                if (next.length && next[next.length - 1].text.startsWith("[*] Applying cipher...")) {
                  next[next.length - 1] = { kind: "step", text: `[*] Applying cipher... ${bar} ${pct}%` };
                } else {
                  next.push({ kind: "step", text: `[*] Applying cipher... ${bar} ${pct}%` });
                }
                return next;
              });
            }
          });
          outputBlob = new Blob([cipher], { type: "application/octet-stream" });
          outputName = `encrypted_${file.name}.bin`;
          contentKind = "binary (RSA ciphertext)";
        } else {
          const d = BigInt(keyState.rsaD);
          const n = BigInt(keyState.rsaN);
          if (d <= 0n || n <= 0n) throw new Error("RSA key values must be positive.");
          log("step", "[*] Reading ciphertext bytes...");
          const bytes = new Uint8Array(fileBuffer);
          log("step", "[*] Decrypting...");
          let lastPct = -1;
          const plain = await rsaDecryptBytes(bytes, d, n, (p) => {
            const pct = Math.floor(p * 100);
            if (pct !== lastPct && pct % 10 === 0) {
              lastPct = pct;
              const bar = "\u2588".repeat(Math.floor(p * 10)) + "\u2591".repeat(10 - Math.floor(p * 10));
              setLogs((prev) => {
                const next = [...prev];
                if (next.length && next[next.length - 1].text.startsWith("[*] Applying cipher...")) {
                  next[next.length - 1] = { kind: "step", text: `[*] Applying cipher... ${bar} ${pct}%` };
                } else {
                  next.push({ kind: "step", text: `[*] Applying cipher... ${bar} ${pct}%` });
                }
                return next;
              });
            }
          });
          outputBlob = new Blob([plain], { type: "application/octet-stream" });
          let baseName = file.name.replace(/^encrypted_/, "").replace(/\.bin$/, "");
          outputName = `decrypted_${baseName}`;
          contentKind = "binary (RSA plaintext)";
          try {
            const sample = Array.from(plain.subarray(0, 200));
            const printable = sample.every((b) => b >= 9 && b < 127);
            if (printable) preview = new TextDecoder("utf-8", { fatal: false }).decode(plain.subarray(0, 200));
          } catch {
          }
        }
      } else if (useBase64) {
        log("step", "[*] Encoding file to Base64...");
        let inputText;
        if (mode === "encrypt") {
          inputText = arrayBufferToBase64(fileBuffer);
        } else {
          inputText = await readFileAsText(file);
        }
        log("step", "[*] Applying cipher...");
        let cipherText;
        if (algo === "caesar") {
          const k = parseInt(keyState.caesarShift, 10);
          if (Number.isNaN(k)) throw new Error("Invalid Caesar shift.");
          cipherText = caesarCipher(inputText, k, mode);
        } else if (algo === "vigenere") {
          cipherText = vigenereCipher(inputText, keyState.vigenereKey, mode);
        }
        if (mode === "encrypt") {
          outputBlob = new Blob([cipherText], { type: "text/plain" });
          outputName = `encrypted_${file.name}.txt`;
          contentKind = "text (Base64-ciphered)";
          preview = cipherText.slice(0, 200);
        } else {
          let buf;
          try {
            buf = base64ToArrayBuffer(cipherText);
          } catch (e) {
            throw new Error("Base64 decode failed \u2014 wrong key or not a Base64 cipher file.");
          }
          let baseName = file.name.replace(/^encrypted_/, "").replace(/\.txt$/, "");
          outputName = `decrypted_${baseName}`;
          const ext = getOriginalExt(baseName).toLowerCase();
          const mimeMap = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".bmp": "image/bmp", ".webp": "image/webp", ".pdf": "application/pdf" };
          outputBlob = new Blob([buf], { type: mimeMap[ext] || "application/octet-stream" });
          contentKind = "binary (decoded)";
        }
      } else {
        log("step", "[*] Reading file as UTF-8...");
        const inputText = await readFileAsText(file);
        log("step", "[*] Applying cipher...");
        let cipherText;
        if (algo === "caesar") {
          const k = parseInt(keyState.caesarShift, 10);
          if (Number.isNaN(k)) throw new Error("Invalid Caesar shift.");
          cipherText = caesarCipher(inputText, k, mode);
        } else if (algo === "vigenere") {
          cipherText = vigenereCipher(inputText, keyState.vigenereKey, mode);
        } else if (algo === "hill") {
          cipherText = hillCipher(inputText, keyState.hillMatrix, mode);
        } else if (algo === "playfair") {
          cipherText = playfairCipher(inputText, keyState.playfairKey, mode);
        } else if (algo === "banglashift") {
          cipherText = banglaShift(inputText, "bn", keyState.banglaPerm, mode);
        }
        const isBase64Roundtrip = mode === "decrypt" && (algo === "caesar" || algo === "vigenere") && /^encrypted_.+\..+\.txt$/i.test(file.name);
        if (isBase64Roundtrip) {
          log("step", "[*] Detected base64 envelope \u2014 decoding back to binary...");
          let buf;
          try {
            buf = base64ToArrayBuffer(cipherText.trim());
          } catch {
            throw new Error("Base64 decode failed \u2014 wrong key or not a base64-mode file.");
          }
          const stripped = file.name.replace(/^encrypted_/, "").replace(/\.txt$/i, "");
          outputName = `decrypted_${stripped}`;
          const ext = getOriginalExt(stripped).toLowerCase();
          const mimeMap = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".bmp": "image/bmp", ".webp": "image/webp", ".pdf": "application/pdf" };
          outputBlob = new Blob([buf], { type: mimeMap[ext] || "application/octet-stream" });
          contentKind = "binary (base64-decoded)";
        } else {
          const baseName = file.name.replace(/^encrypted_/, "").replace(/^decrypted_/, "");
          outputName = (mode === "encrypt" ? "encrypted_" : "decrypted_") + baseName;
          outputBlob = new Blob([cipherText], { type: "text/plain;charset=utf-8" });
          contentKind = "text";
          preview = cipherText.slice(0, 200);
        }
      }
      log("ok", "[OK] Done. Output ready.");
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 880;
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(1e-4, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } catch {
      }
      setOutput({
        blob: outputBlob,
        filename: outputName,
        size: outputBlob.size,
        contentKind,
        preview,
        blockVisual
      });
    } catch (err) {
      log("err", "[ERROR] " + err.message);
      log("err", "[ABORT] Execution halted.");
    } finally {
      setRunning(false);
    }
  }, [canExecute, algo, mode, file, fileBuffer, fileCategory, keyState]);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        execute();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [execute]);
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!output) return;
    const t = setTimeout(() => {
      const el = document.getElementById("cv-output-anchor");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
    return () => clearTimeout(t);
  }, [output]);
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const onDownload = () => {
    if (output) downloadBlob(output.blob, output.filename);
  };
  const onCopy = () => {
    if (output && output.preview) {
      output.blob.text().then((t) => {
        navigator.clipboard.writeText(t);
        setCopied(true);
        setTimeout(() => setCopied(false), 2e3);
      });
    }
  };
  const onWhatsApp = () => {
    if (!output) return;
    output.blob.text().then((t) => {
      const text = encodeURIComponent(t);
      const url = waPhone ? `https://wa.me/${waPhone}?text=${text}` : `https://wa.me/?text=${text}`;
      window.open(url, "_blank", "noopener");
    });
  };
  const streamText = useMemo(() => {
    let s = "";
    for (let i = 0; i < 240; i++) s += Math.random() > 0.5 ? "1" : "0";
    return (s + "  ").repeat(2);
  }, [file, algo, mode]);
  const hexStream = useMemo(() => {
    const chars = "0123456789ABCDEF";
    let s = "";
    for (let i = 0; i < 600; i++) {
      s += chars[Math.floor(Math.random() * 16)];
      if (i % 2 === 1) s += " ";
    }
    return (s + "  ").repeat(2);
  }, []);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(MatrixRain, { banglaActive, danger }), /* @__PURE__ */ React.createElement("div", { className: "cv-vignette" }), /* @__PURE__ */ React.createElement("div", { className: "cv-scanlines" }), /* @__PURE__ */ React.createElement("div", { className: "cv-blood" }), [5, 14, 26, 38, 50, 62, 74, 86, 95].map((left, i) => /* @__PURE__ */ React.createElement(
    "span",
    {
      key: i,
      className: "cv-drip" + (i % 3 === 0 ? " thick" : ""),
      style: {
        left: `${left}%`,
        animationDelay: `${i * 0.7}s`,
        animationDuration: `${4 + i % 3}s`
      }
    }
  )), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      className: "cv-scrolltop" + (showScrollTop ? " visible" : ""),
      onClick: scrollToTop,
      "aria-label": "Scroll to top",
      title: "Scroll to top"
    },
    /* @__PURE__ */ React.createElement(
      "svg",
      {
        width: "22",
        height: "22",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2.5",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": "true"
      },
      /* @__PURE__ */ React.createElement("path", { d: "m6 14 6-6 6 6" })
    )
  ), /* @__PURE__ */ React.createElement("div", { className: "cv-root" }, /* @__PURE__ */ React.createElement("div", { className: "cv-content" }, /* @__PURE__ */ React.createElement("header", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("h1", { className: "cv-title" }, ">", " CryptoVault_"), /* @__PURE__ */ React.createElement("div", { className: "cv-tagline-stack", "aria-label": "CryptoVault slogan" }, /* @__PURE__ */ React.createElement("div", { className: "cv-tagline cv-tagline-alt" }, "// Encrypt \xB7 Decrypt \xB7 Dominate"), /* @__PURE__ */ React.createElement("div", { className: "cv-tagline cv-tagline-alt alt" }, "// Utterly Shatters The Black Hat Hackers")), /* @__PURE__ */ React.createElement("div", { className: "cv-statusbar" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { className: "cv-stat-dot" }), " \xA0", /* @__PURE__ */ React.createElement(Icon, { name: danger ? "shield-x" : "shield", size: 14, className: danger ? "" : "second" }), /* @__PURE__ */ React.createElement("span", { className: "cv-stat-key" }, "SYS:"), " ", /* @__PURE__ */ React.createElement("span", { className: "cv-stat-val" }, danger ? "DECRYPT_MODE" : "ENCRYPT_MODE")), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(Icon, { name: file ? fileIconName(fileCategory) : "file-bin", size: 14, className: "second" }), /* @__PURE__ */ React.createElement("span", { className: "cv-stat-key" }, "FILE:"), " ", /* @__PURE__ */ React.createElement("span", { className: "cv-stat-val" }, file ? file.name : "NULL")), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement(Icon, { name: "key", size: 14, className: "second" }), /* @__PURE__ */ React.createElement("span", { className: "cv-stat-key" }, "ALGO:"), " ", /* @__PURE__ */ React.createElement("span", { className: "cv-stat-val" }, algo ? ALG_LABEL[algo].toUpperCase() : "NULL")), /* @__PURE__ */ React.createElement("span", { style: {
    marginLeft: "auto",
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    color: danger ? "var(--accent)" : "var(--accent)",
    textShadow: danger ? "0 0 10px rgba(255,42,61,0.7)" : "none"
  } }, danger && /* @__PURE__ */ React.createElement(Icon, { name: "skull", size: 16 }), danger ? "// !! BLOOD VAULT !!" : "// SECURE LINK"))), /* @__PURE__ */ React.createElement("div", { className: "cv-stream" }, /* @__PURE__ */ React.createElement("div", { className: "cv-stream-inner" }, streamText)), /* @__PURE__ */ React.createElement("section", { className: "cv-step" }, /* @__PURE__ */ React.createElement("div", { className: "cv-step-head" }, /* @__PURE__ */ React.createElement("span", { className: "cv-step-lock" }, /* @__PURE__ */ React.createElement(Icon, { name: file ? "lock-open" : "lock-closed", size: 18 })), /* @__PURE__ */ React.createElement("span", { className: "cv-step-num" }, "01"), /* @__PURE__ */ React.createElement("span", { className: "cv-step-title" }, "INPUT SOURCE"), /* @__PURE__ */ React.createElement("span", { className: "cv-step-sub" }, file ? `// loaded \xB7 ${formatBytes(file.size)}` : "// awaiting input")), /* @__PURE__ */ React.createElement("div", { className: "cv-srctabs", role: "tablist" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "cv-srctab" + (inputMode === "file" ? " active" : ""),
      onClick: () => switchInputMode("file")
    },
    /* @__PURE__ */ React.createElement(Icon, { name: "file-bin", size: 18 }),
    " [ FILE ]"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "cv-srctab" + (inputMode === "text" ? " active" : ""),
      onClick: () => switchInputMode("text")
    },
    /* @__PURE__ */ React.createElement(Icon, { name: "paste", size: 18 }),
    " [ TEXT / WHATSAPP ]"
  )), inputMode === "file" ? /* @__PURE__ */ React.createElement(
    FileDropZone,
    {
      file,
      onFile: handleFile,
      onClear: clearFile,
      fileCategory,
      hexDump
    }
  ) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("label", { className: "cv-label" }, "// PASTE OR TYPE PLAINTEXT"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      className: "cv-textarea",
      value: plainText,
      onChange: (e) => setPlainText(e.target.value),
      placeholder: "Type a message, or paste a cipher you received on WhatsApp to decrypt...",
      spellCheck: false
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "cv-text-meta" }, /* @__PURE__ */ React.createElement("span", null, "chars: ", /* @__PURE__ */ React.createElement("span", { className: "v" }, plainText.length)), /* @__PURE__ */ React.createElement("span", null, "bytes: ", /* @__PURE__ */ React.createElement("span", { className: "v" }, new TextEncoder().encode(plainText).length)), /* @__PURE__ */ React.createElement("span", null, "category: ", /* @__PURE__ */ React.createElement("span", { className: "v" }, "TEXT"))), plainText && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "cv-hex-h", style: { marginTop: 12 } }, "// First 64 bytes \u2014 hex dump"), /* @__PURE__ */ React.createElement("div", { className: "cv-hex" }, hexDump)), /* @__PURE__ */ React.createElement("div", { className: "cv-wa-info" }, /* @__PURE__ */ React.createElement("b", null, "// WHATSAPP BRIDGE"), /* @__PURE__ */ React.createElement("br", null), "WhatsApp is end-to-end encrypted, so no website can intercept its messages directly. Workflow: encrypt your text here \u2192 click ", /* @__PURE__ */ React.createElement("b", null, "SEND TO WHATSAPP"), " on the output panel \u2192 it opens WhatsApp Web / the WhatsApp app with the cipher prefilled, you tap send. To ", /* @__PURE__ */ React.createElement("b", null, "decrypt"), " a message you received, copy it from WhatsApp, paste above, switch mode to ", /* @__PURE__ */ React.createElement("b", null, "DECRYPT"), ", run."))), /* @__PURE__ */ React.createElement("section", { className: "cv-step" }, /* @__PURE__ */ React.createElement("div", { className: "cv-step-head" }, /* @__PURE__ */ React.createElement("span", { className: "cv-step-lock" }, /* @__PURE__ */ React.createElement(Icon, { name: algo ? "lock-open" : "lock-closed", size: 18 })), /* @__PURE__ */ React.createElement("span", { className: "cv-step-num" }, "02"), /* @__PURE__ */ React.createElement("span", { className: "cv-step-title" }, "SELECT ALGORITHM"), /* @__PURE__ */ React.createElement("span", { className: "cv-step-sub" }, file ? `// filtered for ${fileCategory}` : "// Upload a file first to see compatible algorithms")), /* @__PURE__ */ React.createElement("div", { className: "cv-grid" }, ALGORITHMS.map((a) => /* @__PURE__ */ React.createElement(
    AlgorithmCard,
    {
      key: a.id,
      algo: a,
      state: algoState(a.id),
      selected: algo === a.id,
      onSelect: selectAlgo
    }
  )))), /* @__PURE__ */ React.createElement("section", { className: "cv-step" }, /* @__PURE__ */ React.createElement("div", { className: "cv-step-head" }, /* @__PURE__ */ React.createElement("span", { className: "cv-step-lock" }, /* @__PURE__ */ React.createElement(Icon, { name: keyReady ? "key" : "lock-closed", size: 18 })), /* @__PURE__ */ React.createElement("span", { className: "cv-step-num" }, "03"), /* @__PURE__ */ React.createElement("span", { className: "cv-step-title" }, "ENTER KEY"), /* @__PURE__ */ React.createElement("span", { className: "cv-step-sub" }, algo ? `// ${ALG_LABEL[algo]}` : "")), /* @__PURE__ */ React.createElement(KeyInputPanel, { algo, keyState, setKey: setKeyState })), /* @__PURE__ */ React.createElement("section", { className: "cv-step" }, /* @__PURE__ */ React.createElement("div", { className: "cv-step-head" }, /* @__PURE__ */ React.createElement("span", { className: "cv-step-lock" }, /* @__PURE__ */ React.createElement(Icon, { name: mode ? danger ? "shield-x" : "shield" : "lock-closed", size: 18 })), /* @__PURE__ */ React.createElement("span", { className: "cv-step-num" }, "04"), /* @__PURE__ */ React.createElement("span", { className: "cv-step-title" }, "CHOOSE MODE"), /* @__PURE__ */ React.createElement("span", { className: "cv-step-sub" }, mode ? `// mode: ${mode}` : "// select direction")), /* @__PURE__ */ React.createElement(ModeToggle, { mode, setMode })), /* @__PURE__ */ React.createElement("section", { className: "cv-step" }, /* @__PURE__ */ React.createElement("div", { className: "cv-step-head" }, /* @__PURE__ */ React.createElement("span", { className: "cv-step-lock" }, /* @__PURE__ */ React.createElement(Icon, { name: canExecute ? "play" : "lock-closed", size: 18 })), /* @__PURE__ */ React.createElement("span", { className: "cv-step-num" }, "05"), /* @__PURE__ */ React.createElement("span", { className: "cv-step-title" }, "EXECUTE"), /* @__PURE__ */ React.createElement("span", { className: "cv-step-sub" }, "// Ctrl+Enter to run")), /* @__PURE__ */ React.createElement("button", { className: "cv-exec", disabled: !canExecute, onClick: execute }, /* @__PURE__ */ React.createElement("span", { className: "cv-exec-row" }, /* @__PURE__ */ React.createElement(
    "svg",
    {
      className: "cv-exec-lock",
      viewBox: "0 0 24 24",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    },
    /* @__PURE__ */ React.createElement("rect", { x: "4", y: "11", width: "16", height: "10" }),
    /* @__PURE__ */ React.createElement("path", { className: "shackle", d: danger ? "M7 11V8a5 5 0 0 1 9.5-2" : "M7 11V8a5 5 0 0 1 10 0v3" }),
    /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "16", r: "1.6", fill: "currentColor", stroke: "none" })
  ), /* @__PURE__ */ React.createElement("span", null, running ? "> RUNNING..." : danger ? "> UNLOCK_VAULT_" : "> SEAL_VAULT_"))), running && /* @__PURE__ */ React.createElement("div", { className: "cv-progress", role: "progressbar", "aria-label": "Encrypting\u2026" }), /* @__PURE__ */ React.createElement("div", { className: "cv-hint" }, hint, " ", canExecute && /* @__PURE__ */ React.createElement("span", { className: "cv-kbd" }, "Ctrl") + /* @__PURE__ */ React.createElement("span", { className: "cv-kbd" }, "Enter")), /* @__PURE__ */ React.createElement(TerminalLog, { lines: logs }), /* @__PURE__ */ React.createElement(
    OutputPanel,
    {
      output,
      onDownload,
      onCopy,
      copied,
      onWhatsApp,
      waPhone,
      setWaPhone,
      showWA: inputMode === "text"
    }
  )), /* @__PURE__ */ React.createElement("footer", { className: "cv-footer" }, /* @__PURE__ */ React.createElement("div", { className: "cv-foot-line" }, "// Built with entropy. Powered by chaos."), /* @__PURE__ */ React.createElement("div", { className: "cv-hex-stream" }, /* @__PURE__ */ React.createElement("div", { className: "cv-hex-stream-inner" }, hexStream))))));
}
