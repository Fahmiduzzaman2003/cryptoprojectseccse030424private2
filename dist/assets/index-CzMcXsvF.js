import{r as f,a as st,R as ee}from"./vendor-wGySg1uH.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const l of i.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function o(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(a){if(a.ep)return;a.ep=!0;const i=o(a);fetch(a.href,i)}})();var Fe={exports:{}},de={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var it=f,ct=Symbol.for("react.element"),lt=Symbol.for("react.fragment"),pt=Object.prototype.hasOwnProperty,dt=it.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,ht={key:!0,ref:!0,__self:!0,__source:!0};function Ue(r,t,o){var n,a={},i=null,l=null;o!==void 0&&(i=""+o),t.key!==void 0&&(i=""+t.key),t.ref!==void 0&&(l=t.ref);for(n in t)pt.call(t,n)&&!ht.hasOwnProperty(n)&&(a[n]=t[n]);if(r&&r.defaultProps)for(n in t=r.defaultProps,t)a[n]===void 0&&(a[n]=t[n]);return{$$typeof:ct,type:r,key:i,ref:l,props:a,_owner:dt.current}}de.Fragment=lt;de.jsx=Ue;de.jsxs=Ue;Fe.exports=de;var e=Fe.exports,_e,Ae=st;_e=Ae.createRoot,Ae.hydrateRoot;const Z={red:"#b8060ce1",amber:"#ffc800"},xt=`
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
`,ne={caesar:{text:"compatible",image:"base64warn",binary:"base64warn"},vigenere:{text:"compatible",image:"base64warn",binary:"base64warn"},hill:{text:"compatible",image:"error",binary:"error"},playfair:{text:"compatible",image:"error",binary:"error"},sha256:{text:"compatible",image:"compatible",binary:"compatible"},feistel64:{text:"compatible",image:"compatible",binary:"compatible"},xor:{text:"compatible",image:"compatible",binary:"compatible"},rsa:{text:"compatible",image:"compatible",binary:"compatible"},banglashift:{text:"compatible",image:"error",binary:"error"}},Ne=[{id:"caesar",name:"CAESAR",desc:"Classic shift cipher (~50 BC).",fact:"Used by Julius Caesar to communicate with his generals."},{id:"vigenere",name:"VIGENERE",desc:"Polyalphabetic keyword cipher.",fact:'"Le chiffre indéchiffrable" — unbroken for 300 years.'},{id:"hill",name:"HILL",desc:"Linear-algebra matrix cipher.",fact:"Invented by Lester S. Hill in 1929."},{id:"playfair",name:"PLAYFAIR",desc:"Digraph 5x5 Polybius substitution.",fact:"Used by British forces in WWI and WWII."},{id:"sha256",name:"SHA-256",desc:"One-way hashing for file fingerprints.",fact:"Produces a 256-bit digest; the same input always maps to the same hash."},{id:"feistel64",name:"FEISTEL-64",desc:"Simple 64-bit block cipher with block view.",fact:"A tiny Feistel network is the easiest way to visualize block cipher rounds."},{id:"xor",name:"XOR",desc:"Fast stream-style byte transformer.",fact:"Repeating-key XOR is reversible and works on any byte stream."},{id:"rsa",name:"RSA",desc:"Public-key BigInt asymmetric crypto.",fact:"Rivest, Shamir, Adleman (1977). Powers HTTPS today."},{id:"banglashift",name:"BANGLASHIFT",desc:"Custom multilingual permutation cipher.",fact:"Maps Latin alphabet onto a permuted Bangla script."}],oe={caesar:"Caesar Cipher",vigenere:"Vigenere Cipher",hill:"Hill Cipher",playfair:"Playfair Cipher",sha256:"SHA-256 Hash",feistel64:"Feistel-64 Block Cipher",xor:"XOR Cipher",rsa:"RSA",banglashift:"BanglaShift"},Ce=["অ","আ","ই","ঈ","উ","ঊ","ঋ","এ","ঐ","ও","ঔ","ক","খ","গ","ঘ","ঙ","চ","ছ","জ","ঝ","ঞ","ট","ঠ","ড","ঢ","ণ"];function M({name:r,className:t="",size:o=20}){const n=`cv-svg ${t}`,a={width:o,height:o,viewBox:"0 0 24 24",className:n,strokeLinecap:"round",strokeLinejoin:"round"};switch(r){case"lock-closed":return e.jsxs("svg",{...a,children:[e.jsx("rect",{x:"4",y:"11",width:"16",height:"10"}),e.jsx("path",{d:"M7 11V8a5 5 0 0 1 10 0v3"}),e.jsx("circle",{cx:"12",cy:"16",r:"1.5",fill:"currentColor",stroke:"none"})]});case"lock-open":return e.jsxs("svg",{...a,children:[e.jsx("rect",{x:"4",y:"11",width:"16",height:"10"}),e.jsx("path",{d:"M7 11V8a5 5 0 0 1 9.5-2"}),e.jsx("circle",{cx:"12",cy:"16",r:"1.5",fill:"currentColor",stroke:"none"})]});case"key":return e.jsxs("svg",{...a,children:[e.jsx("circle",{cx:"8",cy:"14",r:"4"}),e.jsx("path",{d:"M11 14h10"}),e.jsx("path",{d:"M17 14v3"}),e.jsx("path",{d:"M21 14v3"})]});case"shield":return e.jsxs("svg",{...a,children:[e.jsx("path",{d:"M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"}),e.jsx("path",{d:"m9 12 2 2 4-4"})]});case"shield-x":return e.jsxs("svg",{...a,children:[e.jsx("path",{d:"M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5z"}),e.jsx("path",{d:"m9 9 6 6M15 9l-6 6"})]});case"vault":return e.jsxs("svg",{...a,children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"16",rx:"1"}),e.jsx("circle",{cx:"12",cy:"12",r:"5"}),e.jsx("circle",{cx:"12",cy:"12",r:"1.5",fill:"currentColor",stroke:"none"}),e.jsxs("g",{className:"dial",children:[e.jsx("line",{x1:"12",y1:"7",x2:"12",y2:"9"}),e.jsx("line",{x1:"12",y1:"15",x2:"12",y2:"17"}),e.jsx("line",{x1:"7",y1:"12",x2:"9",y2:"12"}),e.jsx("line",{x1:"15",y1:"12",x2:"17",y2:"12"})]})]});case"vault-open":return e.jsxs("svg",{...a,children:[e.jsx("rect",{x:"3",y:"4",width:"11",height:"16",rx:"1"}),e.jsx("path",{d:"M14 4l6 3v10l-6 3"}),e.jsx("circle",{cx:"8",cy:"12",r:"3"}),e.jsx("circle",{cx:"8",cy:"12",r:"1",fill:"currentColor",stroke:"none"})]});case"gears":return e.jsxs("svg",{...a,children:[e.jsx("circle",{cx:"12",cy:"12",r:"3"}),e.jsx("path",{d:"M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"})]});case"binary":return e.jsxs("svg",{...a,children:[e.jsx("text",{x:"3",y:"11",fontSize:"10",fontFamily:"monospace",fill:"currentColor",stroke:"none",children:"10"}),e.jsx("text",{x:"3",y:"21",fontSize:"10",fontFamily:"monospace",fill:"currentColor",stroke:"none",children:"01"}),e.jsx("text",{x:"14",y:"11",fontSize:"10",fontFamily:"monospace",fill:"currentColor",stroke:"none",children:"01"}),e.jsx("text",{x:"14",y:"21",fontSize:"10",fontFamily:"monospace",fill:"currentColor",stroke:"none",children:"10"})]});case"matrix":return e.jsxs("svg",{...a,children:[e.jsx("path",{d:"M5 3v18M19 3v18M5 3h2M5 21h2M19 3h-2M19 21h-2"}),e.jsx("circle",{cx:"10",cy:"8",r:"0.8",fill:"currentColor",stroke:"none"}),e.jsx("circle",{cx:"14",cy:"8",r:"0.8",fill:"currentColor",stroke:"none"}),e.jsx("circle",{cx:"10",cy:"12",r:"0.8",fill:"currentColor",stroke:"none"}),e.jsx("circle",{cx:"14",cy:"12",r:"0.8",fill:"currentColor",stroke:"none"}),e.jsx("circle",{cx:"10",cy:"16",r:"0.8",fill:"currentColor",stroke:"none"}),e.jsx("circle",{cx:"14",cy:"16",r:"0.8",fill:"currentColor",stroke:"none"})]});case"grid5":return e.jsxs("svg",{...a,children:[e.jsx("rect",{x:"4",y:"4",width:"16",height:"16"}),e.jsx("path",{d:"M4 8h16M4 12h16M4 16h16M8 4v16M12 4v16M16 4v16"})]});case"sword":return e.jsxs("svg",{...a,children:[e.jsx("path",{d:"M14 4h6v6L9 21l-5-5z"}),e.jsx("path",{d:"M5 13l6 6"})]});case"keypair":return e.jsxs("svg",{...a,children:[e.jsx("circle",{cx:"7",cy:"8",r:"3"}),e.jsx("path",{d:"M10 8h7l1 2-1 2h-7"}),e.jsx("circle",{cx:"7",cy:"17",r:"3"}),e.jsx("path",{d:"M10 17h6l1 2-1 2h-6"})]});case"globe":return e.jsxs("svg",{...a,children:[e.jsx("circle",{cx:"12",cy:"12",r:"9"}),e.jsx("path",{d:"M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"})]});case"file-text":return e.jsxs("svg",{...a,children:[e.jsx("path",{d:"M14 3H6v18h12V7z"}),e.jsx("path",{d:"M14 3v4h4M8 12h8M8 16h6"})]});case"file-image":return e.jsxs("svg",{...a,children:[e.jsx("path",{d:"M14 3H6v18h12V7z"}),e.jsx("path",{d:"M14 3v4h4"}),e.jsx("circle",{cx:"10",cy:"13",r:"1.2"}),e.jsx("path",{d:"m8 19 3-3 4 3"})]});case"file-bin":return e.jsxs("svg",{...a,children:[e.jsx("path",{d:"M14 3H6v18h12V7z"}),e.jsx("path",{d:"M14 3v4h4"}),e.jsx("text",{x:"8",y:"17",fontSize:"6",fontFamily:"monospace",fill:"currentColor",stroke:"none",children:"10"})]});case"skull":return e.jsxs("svg",{...a,children:[e.jsx("path",{d:"M5 11a7 7 0 1 1 14 0v4l-2 2v3h-3v-2h-4v2H7v-3l-2-2z"}),e.jsx("circle",{cx:"9",cy:"12",r:"1.4",fill:"currentColor",stroke:"none"}),e.jsx("circle",{cx:"15",cy:"12",r:"1.4",fill:"currentColor",stroke:"none"}),e.jsx("path",{d:"M11 16h2"})]});case"play":return e.jsx("svg",{...a,children:e.jsx("path",{d:"M6 4l14 8-14 8z",fill:"currentColor",stroke:"none"})});case"download":return e.jsxs("svg",{...a,children:[e.jsx("path",{d:"M12 3v12"}),e.jsx("path",{d:"m7 10 5 5 5-5"}),e.jsx("path",{d:"M4 19h16"})]});case"whatsapp":return e.jsxs("svg",{...a,viewBox:"0 0 32 32",children:[e.jsx("path",{d:"M16 3a13 13 0 0 0-11 19.7L3 29l6.5-1.7A13 13 0 1 0 16 3z"}),e.jsx("path",{d:"M11 11c0-.6.4-1 1-1h1.2c.4 0 .8.3.9.7l.7 2.3c.1.4 0 .8-.3 1l-1 .9a9 9 0 0 0 4.5 4.5l1-1c.2-.3.6-.4 1-.3l2.3.7c.4.1.7.5.7.9V20c0 .6-.4 1-1 1-5 0-11-6-11-11z"})]});case"paste":return e.jsxs("svg",{...a,children:[e.jsx("rect",{x:"6",y:"5",width:"12",height:"16",rx:"1"}),e.jsx("path",{d:"M9 5V3h6v2"}),e.jsx("path",{d:"M9 11h6M9 15h4"})]});case"send":return e.jsx("svg",{...a,children:e.jsx("path",{d:"m3 12 18-9-7 18-3-7z"})});default:return null}}const gt={caesar:"sword",vigenere:"binary",hill:"matrix",playfair:"grid5",sha256:"binary",feistel64:"vault",xor:"gears",rsa:"keypair",banglashift:"globe"};function vt(r){const t=(r.type||"").toLowerCase(),o=r.name.toLowerCase();return t.startsWith("image/")||/\.(png|jpe?g|gif|bmp|webp|svg)$/.test(o)?"image":t.startsWith("text/")||t==="application/json"||t==="application/xml"||/\.(txt|csv|json|xml|md|log|ini|conf|html|css|js|jsx|ts|tsx|py)$/.test(o)?"text":"binary"}function Ke(r){return r==="image"?"file-image":r==="text"?"file-text":"file-bin"}function pe(r){return r<1024?r+" B":r<1024*1024?(r/1024).toFixed(1)+" KB":r<1024*1024*1024?(r/1024/1024).toFixed(2)+" MB":(r/1024/1024/1024).toFixed(2)+" GB"}function ze(r){return new Promise((t,o)=>{const n=new FileReader;n.onload=()=>t(n.result),n.onerror=()=>o(n.error),n.readAsText(r,"utf-8")})}function mt(r){return new Promise((t,o)=>{const n=new FileReader;n.onload=()=>t(n.result),n.onerror=()=>o(n.error),n.readAsArrayBuffer(r)})}function bt(r){const t=new Uint8Array(r);let o="";const n=32768;for(let a=0;a<t.length;a+=n)o+=String.fromCharCode.apply(null,t.subarray(a,a+n));return btoa(o)}function Ee(r){const t=atob(r),o=new Uint8Array(t.length);for(let n=0;n<t.length;n++)o[n]=t.charCodeAt(n);return o.buffer}function ut(r,t){const o=URL.createObjectURL(r),n=document.createElement("a");n.href=o,n.download=t,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(o),1500)}function ke(r,t=64){const o=new Uint8Array(r).subarray(0,t),n=[];for(let a=0;a<o.length;a+=16){const i=o.subarray(a,a+16),l=Array.from(i).map(s=>s.toString(16).padStart(2,"0")).join(" ").padEnd(48," "),c=Array.from(i).map(s=>s>=32&&s<127?String.fromCharCode(s):".").join("");n.push(`${a.toString(16).padStart(8,"0")}  ${l}  ${c}`)}return n.join(`
`)||"(empty)"}function Te(r){const t=r.lastIndexOf(".");return t>=0?r.slice(t):""}function se(r){return Array.from(r,t=>t.toString(16).padStart(2,"0")).join("")}async function ft(r){if(!(crypto!=null&&crypto.subtle))throw new Error("SHA-256 is unavailable in this browser context.");const t=await crypto.subtle.digest("SHA-256",r);return se(new Uint8Array(t))}function He(r){const t=String(r||"").trim();if(!t)throw new Error("Block cipher key cannot be empty.");return t}function yt(r){let t=2166136261;for(const o of r)t^=o.charCodeAt(0),t=Math.imul(t,16777619)>>>0;return t>>>0}function wt(r){let t=yt(r);const o=[];for(let n=0;n<4;n++)t^=t<<13,t^=t>>>17,t^=t<<5,o.push(t>>>0);return o}function Re(r,t){return(r<<t|r>>>32-t)>>>0}function kt(r,t){const o=(r^t)>>>0;return(Re(o,7)^Re(o+t>>>0,11)^Math.imul(r+2654435769,3))>>>0}function Ie(r,t){return(r[t]<<24|r[t+1]<<16|r[t+2]<<8|r[t+3])>>>0}function Me(r,t,o){r[t]=o>>>24&255,r[t+1]=o>>>16&255,r[t+2]=o>>>8&255,r[t+3]=o&255}function jt(r,t,o,n,a){const i=He(t),l=wt(i),c=o==="encrypt"?l:l.slice().reverse();if(o==="decrypt"&&r.length%8!==0)throw new Error("Feistel-64 ciphertext length must be a multiple of 8 bytes.");const s=o==="encrypt"?8-(r.length%8||8):0,d=new Uint8Array(r.length+s);d.set(r),s&&d.fill(s,r.length);const p=new Uint8Array(d.length),u=d.length/8,h=[];for(let y=0;y<u;y++){const k=y*8;let C=Ie(d,k),z=Ie(d,k+4);const $=[`[${String(y).padStart(2,"0")}] ${se(d.subarray(k,k+8)).toUpperCase()}`];y===0&&a&&(a.push(["in","—",C.toString(16).padStart(8,"0").toUpperCase(),z.toString(16).padStart(8,"0").toUpperCase()]),a.padLength=s,a.blocks=u,a.rounds=c.length);for(let L=0;L<c.length;L++){const Q=z,K=(C^kt(z,c[L]))>>>0;C=Q,z=K;const A=C.toString(16).padStart(8,"0").toUpperCase(),W=z.toString(16).padStart(8,"0").toUpperCase();$.push(`  R${L+1}: L=${A} R=${W}`),y===0&&a&&a.push(["R"+(L+1),c[L].toString(16).padStart(8,"0").toUpperCase(),A,W])}Me(p,k,z),Me(p,k+4,C),y<4&&($.push(`  OUT: ${se(p.subarray(k,k+8)).toUpperCase()}`),h.push($.join(`
`)))}const b=o==="decrypt"?p.subarray(0,p.length-p[p.length-1]):p;return n&&n(h.join(`

`)),b}function Nt(r,t,o){const n=He(t),a=new TextEncoder().encode(n),i=s=>s.toString(2).padStart(8,"0"),l=s=>s.toString(16).padStart(2,"0").toUpperCase(),c=new Uint8Array(r.length);for(let s=0;s<r.length;s++){const d=a[s%a.length];c[s]=r[s]^d,J(o)&&o.push([String(s),`${l(r[s])}  ${i(r[s])}`,`${l(d)}  ${i(d)}`,`${l(c[s])}  ${i(c[s])}`])}return o&&(o.key=n),c}function E(r,t){return(r%t+t)%t}function he(r,t){r=E(r,t);for(let o=1;o<t;o++)if(r*o%t===1)return o;return null}function ie(r){const t=r.length;return t===2?r[0][0]*r[1][1]-r[0][1]*r[1][0]:t===3?r[0][0]*(r[1][1]*r[2][2]-r[1][2]*r[2][1])-r[0][1]*(r[1][0]*r[2][2]-r[1][2]*r[2][0])+r[0][2]*(r[1][0]*r[2][1]-r[1][1]*r[2][0]):0}function Ct(r){const t=r.length,o=Array.from({length:t},()=>Array(t).fill(0));for(let n=0;n<t;n++)for(let a=0;a<t;a++){const i=r.filter((c,s)=>s!==n).map(c=>c.filter((s,d)=>d!==a)),l=i.length===2?i[0][0]*i[1][1]-i[0][1]*i[1][0]:i[0][0];o[n][a]=((n+a)%2===0?1:-1)*l}return o}function St(r){const t=E(ie(r),26),o=he(t,26);if(o==null)return null;const n=r.length;if(n===2)return[[E(r[1][1],26),E(-r[0][1],26)],[E(-r[1][0],26),E(r[0][0],26)]].map(c=>c.map(s=>E(s*o,26)));const a=Ct(r);return Array.from({length:n},(l,c)=>Array.from({length:n},(s,d)=>a[d][c])).map(l=>l.map(c=>E(c*o,26)))}const xe=12,J=r=>r&&r.length<xe,Be=r=>(r.match(/[A-Za-z]/g)||[]).length;function At(r){const t=r.toUpperCase().replace(/J/g,"I").replace(/[^A-Z]/g,"");let o=0,n=0;for(;n<t.length;)!t[n+1]||t[n]===t[n+1]?n+=1:n+=2,o++;return o}function $e(r,t,o,n){const a=o==="encrypt"?t:-t;let i="";for(let l=0;l<r.length;l++){const c=r.charCodeAt(l),s=c>=65&&c<=90?65:c>=97&&c<=122?97:0;if(s){const d=c-s,p=E(d+a,26),u=String.fromCharCode(p+s);i+=u,J(n)&&n.push([r[l],String(d),(a<0?"−":"+")+Math.abs(a),String(p),u])}else i+=r[l]}return i}function Le(r,t,o,n){const a=(t||"").toLowerCase().replace(/[^a-z]/g,"");if(!a)throw new Error("Vigenere key must contain at least one letter.");let i="",l=0;for(let c=0;c<r.length;c++){const s=r.charCodeAt(c);let d=!1,p=0;if(s>=65&&s<=90?(d=!0,p=65):s>=97&&s<=122&&(d=!0,p=97),d){const u=a[l%a.length],h=a.charCodeAt(l%a.length)-97,b=o==="encrypt"?h:-h,y=s-p,k=E(y+b,26),C=String.fromCharCode(k+p);i+=C,J(n)&&n.push([r[c],String(y),u.toUpperCase(),(b<0?"−":"+")+Math.abs(b),String(k),C]),l++}else i+=r[c]}return i}function zt(r,t,o,n){const a=t.length;let i=t;if(o==="decrypt"){if(i=St(t),!i)throw new Error("Matrix is not invertible mod 26 — cannot decrypt.")}else if(E(ie(t),26)===0||he(E(ie(t),26),26)==null)throw new Error("Matrix is not invertible mod 26. Decryption would be impossible.");const l=r.toUpperCase().replace(/[^A-Z]/g,""),c=l+"X".repeat((a-l.length%a)%a);let s="";for(let d=0;d<c.length;d+=a){const p=[];for(let b=0;b<a;b++)p.push(c.charCodeAt(d+b)-65);const u=[],h=[];for(let b=0;b<a;b++){let y=0;for(let k=0;k<a;k++)y+=i[b][k]*p[k];u.push(y),h.push(E(y,26)),s+=String.fromCharCode(E(y,26)+65)}J(n)&&n.push([c.slice(d,d+a),"["+p.join(" ")+"]","["+u.join(" ")+"]","["+h.join(" ")+"]",h.map(b=>String.fromCharCode(b+65)).join("")])}return n&&(n.matrix=i),s}function Et(r){const t=(r||"").toUpperCase().replace(/J/g,"I").replace(/[^A-Z]/g,""),o=new Set;let n="";for(const i of t+"ABCDEFGHIKLMNOPQRSTUVWXYZ")o.has(i)||(o.add(i),n+=i);const a=[];for(let i=0;i<5;i++)a.push(n.slice(i*5,i*5+5).split(""));return a}function Oe(r,t){for(let o=0;o<5;o++)for(let n=0;n<5;n++)if(r[o][n]===t)return[o,n];return null}function Tt(r,t,o,n){const a=Et(t),i=r.toUpperCase().replace(/J/g,"I").replace(/[^A-Z]/g,""),l=[];let c=0;for(;c<i.length;){const p=i[c];let u=i[c+1];u?p===u?(l.push([p,"X"]),c+=1):(l.push([p,u]),c+=2):(l.push([p,"X"]),c+=1)}const s=o==="encrypt"?1:-1;let d="";for(const[p,u]of l){const[h,b]=Oe(a,p),[y,k]=Oe(a,u);let C,z,$;h===y?($="same row → shift "+(s>0?"right":"left"),C=a[h][E(b+s,5)],z=a[y][E(k+s,5)]):b===k?($="same column → shift "+(s>0?"down":"up"),C=a[E(h+s,5)][b],z=a[E(y+s,5)][k]):($="rectangle → swap columns",C=a[h][k],z=a[y][b]),d+=C+z,J(n)&&n.push([p+u,`(${h},${b}) (${y},${k})`,$,C+z])}return n&&(n.grid=a),d}function Rt(r){const t=Math.ceil(r/8),o=new Uint8Array(t);crypto.getRandomValues(o),o[0]|=128,o[t-1]|=1;let n=0n;for(const a of o)n=n<<8n|BigInt(a);return n}function ce(r,t,o){if(o===1n)return 0n;let n=1n;for(r=r%o;t>0n;)t&1n&&(n=n*r%o),t>>=1n,r=r*r%o;return n}function It(r,t=8){if(r<2n)return!1;if(r===2n||r===3n)return!0;if(r%2n===0n)return!1;let o=r-1n,n=0n;for(;o%2n===0n;)o/=2n,n++;const a=[2n,3n,5n,7n,11n,13n,17n,19n,23n,29n,31n,37n];e:for(let i=0;i<Math.min(t,a.length);i++){const l=a[i];if(l>=r)continue;let c=ce(l,o,r);if(!(c===1n||c===r-1n)){for(let s=0n;s<n-1n;s++)if(c=c*c%r,c===r-1n)continue e;return!1}}return!0}function je(r){for(;;){let t=Rt(r);t%2n===0n&&(t+=1n);for(let o=0;o<200;o++){if(It(t))return t;t+=2n}}}function Ye(r,t){if(t===0n)return[r,1n,0n];const[o,n,a]=Ye(t,r%t);return[o,a,n-r/t*a]}function Mt(r,t){const[o,n]=Ye((r%t+t)%t,t);if(o!==1n)throw new Error("No modular inverse");return(n%t+t)%t}function Ve(){const t=je(64);let o=je(64);for(;o===t;)o=je(64);const n=t*o,a=(t-1n)*(o-1n),i=65537n;if(a%i===0n)return Ve();const l=Mt(i,a);return{e:i.toString(),n:n.toString(),d:l.toString(),p:t.toString(),q:o.toString(),phi:a.toString()}}function Xe(r){const t=[];let o=r;for(;o>0n;)t.unshift(Number(o&0xffn)),o>>=8n;return t.length||t.push(0),t}function Bt(r){return r<=32?String.fromCharCode(9216+r):r<=126?String.fromCharCode(r):r===127?"␡":r<=159?"□":r===160?"␣":String.fromCharCode(r)}function We(r){return r.map(Bt).join("")}function Ge(r){return r.map(t=>t.toString(16).padStart(2,"0").toUpperCase()).join(" ")}function qe(r){return r.map(t=>t.toString(2).padStart(8,"0")).join(" ")}function $t(r,t,o){const n=Array.from(r),a=[],i=[];for(const l of n){const c=BigInt(l.codePointAt(0));if(c>=o)throw new Error(`Character "${l}" (code ${c}) is not smaller than the modulus n. RSA can only encrypt values below n — generate a larger key pair.`);const s=ce(c,t,o);if(a.push(s),i.length<xe){const d=Xe(s);i.push({ch:l,m:c.toString(),mBin:c.toString(2).padStart(8,"0"),c:s.toString(),hex:Ge(d),bin:qe(d),glyphs:We(d)})}}return{cipherText:a.join(" "),count:n.length,trace:i}}function Lt(r,t,o){const n=r.trim().split(/\s+/).filter(Boolean);if(!n.length)throw new Error("No RSA ciphertext numbers found.");const a=n.find(c=>!/^\d+$/.test(c));if(a)throw new Error(`"${a.slice(0,24)}" is not a ciphertext number. Text-mode RSA expects space-separated decimal values, as produced by encrypting in TEXT mode.`);let i="";const l=[];for(const c of n){const s=BigInt(c),d=ce(s,t,o),p=Number(d);if(!Number.isSafeInteger(p)||p>1114111)throw new Error("Decryption produced a value outside the Unicode range — wrong key (d or n).");const u=String.fromCodePoint(p);if(i+=u,l.length<xe){const h=Xe(s);l.push({ch:u,m:d.toString(),mBin:d.toString(2).padStart(8,"0"),c:s.toString(),hex:Ge(h),bin:qe(h),glyphs:We(h)})}}return{plainText:i,count:n.length,trace:l}}function Ze(r){let t=0,o=r;for(;o>0n;)t++,o>>=1n;const n=Math.max(1,Math.floor((t-1)/8)-1),a=Math.ceil(t/8)+1;return{inBytes:n,outBytes:a}}async function Ot(r,t,o,n){const{inBytes:a,outBytes:i}=Ze(o),l=Math.ceil(r.length/a),c=new Uint8Array(l*i);for(let s=0;s<l;s++){const d=s*a,p=r.subarray(d,Math.min(d+a,r.length));let u=0n;for(const y of p)u=u<<8n|BigInt(y);u=u<<8n|BigInt(p.length);let b=ce(u,t,o);for(let y=i-1;y>=0;y--)c[s*i+y]=Number(b&0xffn),b>>=8n;n&&(s%64===0||s===l-1)&&(n((s+1)/l),await new Promise(y=>setTimeout(y,0)))}return c}async function Pt(r,t,o,n){const{outBytes:a}=Ze(o);if(r.length%a!==0)throw new Error("RSA ciphertext length mismatch — wrong key or corrupted file.");const i=r.length/a,l=[];for(let c=0;c<i;c++){let s=0n;for(let b=0;b<a;b++)s=s<<8n|BigInt(r[c*a+b]);const d=ce(s,t,o),p=Number(d&0xffn);let u=d>>8n;const h=new Array(p);for(let b=p-1;b>=0;b--)h[b]=Number(u&0xffn),u>>=8n;for(const b of h)l.push(b);n&&(c%64===0||c===i-1)&&(n((c+1)/i),await new Promise(b=>setTimeout(b,0)))}return new Uint8Array(l)}function Je(r){const t=(r||"").split("").reduce((n,a)=>n+a.charCodeAt(0),0),o=E(t,26);return Ce.slice(o).concat(Ce.slice(0,o))}function Dt(r,t,o,n,a){if(!o)throw new Error("BanglaShift permutation key cannot be empty.");const i=Je(o);if(a&&(a.sum=[...o].reduce((l,c)=>l+c.charCodeAt(0),0),a.shift=E(a.sum,26),a.count=0),n==="encrypt"){let l="";for(const c of r){const s=c.toLowerCase(),d=s.charCodeAt(0);if(d>=97&&d<=122){const p=d-97;l+=i[p],a&&a.count++,J(a)&&a.push([c,String(p),s,i[p]])}else l+=c}return l}else{const l=new Map;for(let s=0;s<26;s++)l.set(i[s],String.fromCharCode(97+s));let c="";for(const s of r){const d=l.has(s);if(c+=d?l.get(s):s,d&&a&&(a.count++,J(a))){const p=l.get(s);a.push([s,String(p.charCodeAt(0)-97),s,p])}}return c}}function Ft({banglaActive:r,danger:t}){const o=f.useRef(null),n=f.useRef(0),a=f.useRef([]),i=f.useRef(0),l=f.useRef(!1),c=f.useRef(r),s=f.useRef(t);return c.current=r,s.current=t,f.useEffect(()=>{const d=o.current;if(!d)return;const p=d.getContext("2d");let u=0,h=14;const b=window.innerWidth<768,y=window.matchMedia("(pointer: coarse)").matches,C=1e3/(b||y?24:60),z="01ABCDEF0123456789!@#$%&*+=<>".split(""),$=Ce,L=()=>{const A=Math.min(window.devicePixelRatio||1,b?1.25:1.75);d.width=Math.floor(window.innerWidth*A),d.height=Math.floor(window.innerHeight*A),d.style.width=window.innerWidth+"px",d.style.height=window.innerHeight+"px",p.setTransform(A,0,0,A,0,0),h=b?18:14,u=Math.ceil(window.innerWidth/h),a.current=Array(u).fill(0).map(()=>Math.random()*window.innerHeight/h)};L(),window.addEventListener("resize",L);const Q=new IntersectionObserver(([A])=>{l.current=A.isIntersecting},{threshold:0});Q.observe(d);const K=A=>{if(!l.current){n.current=requestAnimationFrame(K);return}const W=A-i.current;if(W<C){n.current=requestAnimationFrame(K);return}i.current=A-W%C;const T=window.innerWidth,te=window.innerHeight;p.fillStyle=s.current?"rgba(8, 0, 0, 0.10)":"rgba(0, 0, 0, 0.08)",p.fillRect(0,0,T,te),p.font=h+'px "Share Tech Mono", monospace';const V=a.current,ge=s.current?"#ff003c":"#00ff41",ve=s.current?"#ffaaaa":"#aaffaa",me=b?2:1;for(let X=0;X<V.length;X+=me){const B=c.current&&Math.random()<.3,re=B?$:z,be=re[Math.floor(Math.random()*re.length)],ue=X*h,le=V[X]*h,fe=Math.random()<.04;p.fillStyle=B?"#ffc800":fe?ve:ge,p.fillText(be,ue,le),le>te&&Math.random()>.975&&(V[X]=0),V[X]+=1}n.current=requestAnimationFrame(K)};return n.current=requestAnimationFrame(K),()=>{cancelAnimationFrame(n.current),window.removeEventListener("resize",L),Q.disconnect()}},[]),e.jsx("canvas",{ref:o,className:"cv-canvas","aria-hidden":"true"})}function Ut({file:r,onFile:t,onClear:o,fileCategory:n,hexDump:a}){const[i,l]=f.useState(!1),c=f.useRef(null);return r?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"cv-fileinfo",children:[e.jsx("div",{className:"cv-icon",children:e.jsx(M,{name:Ke(n),size:26})}),e.jsxs("div",{children:[e.jsx("div",{className:"cv-fname",children:r.name}),e.jsxs("div",{className:"cv-fmeta",children:[r.type||"unknown/binary"," · ",pe(r.size)," · category: ",n.toUpperCase()]})]}),e.jsx("button",{className:"cv-clear-btn",onClick:o,children:"[ X ] CLEAR"})]}),e.jsx("div",{className:"cv-hex-h",children:"// First 64 bytes — hex dump"}),e.jsx("div",{className:"cv-hex",children:a})]}):e.jsxs("div",{className:"cv-drop"+(i?" drag":""),onClick:()=>c.current&&c.current.click(),onDragOver:s=>{s.preventDefault(),l(!0)},onDragLeave:()=>l(!1),onDrop:s=>{s.preventDefault(),l(!1),s.dataTransfer.files[0]&&t(s.dataTransfer.files[0])},children:[e.jsx("input",{ref:c,type:"file",style:{display:"none"},onChange:s=>s.target.files[0]&&t(s.target.files[0])}),e.jsxs("svg",{className:"cv-vault-ico",viewBox:"0 0 64 64",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"6",y:"8",width:"52",height:"48",rx:"2"}),e.jsx("circle",{cx:"32",cy:"32",r:"16"}),e.jsx("circle",{cx:"32",cy:"32",r:"3",fill:"currentColor",stroke:"none"}),e.jsxs("g",{className:"dial",children:[e.jsx("line",{x1:"32",y1:"18",x2:"32",y2:"22"}),e.jsx("line",{x1:"32",y1:"42",x2:"32",y2:"46"}),e.jsx("line",{x1:"18",y1:"32",x2:"22",y2:"32"}),e.jsx("line",{x1:"42",y1:"32",x2:"46",y2:"32"}),e.jsx("line",{x1:"22",y1:"22",x2:"25",y2:"25"}),e.jsx("line",{x1:"39",y1:"39",x2:"42",y2:"42"}),e.jsx("line",{x1:"22",y1:"42",x2:"25",y2:"39"}),e.jsx("line",{x1:"39",y1:"25",x2:"42",y2:"22"})]}),e.jsx("line",{x1:"6",y1:"14",x2:"58",y2:"14"}),e.jsx("line",{x1:"6",y1:"50",x2:"58",y2:"50"})]}),e.jsxs("div",{className:"cv-drop-h",children:[">"," DROP FILE HERE_"]}),e.jsx("div",{className:"cv-drop-s",children:"// or click to browse · supported: text, image, binary"})]})}const _t=ee.memo(function({algo:t,state:o,selected:n,onSelect:a}){const i=`cv-card ${o} ${n?"selected":""}`;let l,c;o==="compatible"?(l="COMPATIBLE",c=`[INFO] ${t.fact}`):o==="incompatible"?(l="INCOMPATIBLE",c=`[ERROR] ${oe[t.id]} requires text input. This file type is not supported.`):o==="base64warn"?(l="BASE64 MODE",c="[WARN] File will be Base64-encoded before encryption. Output is a .txt file."):l="LOCKED";const s=o!=="incompatible"&&o!=="locked";return e.jsxs("div",{className:i,onClick:s?()=>a(t.id):void 0,role:"button",tabIndex:s?0:-1,"aria-pressed":n,"aria-disabled":!s,onKeyDown:d=>{s&&(d.key==="Enter"||d.key===" ")&&(d.preventDefault(),a(t.id))},children:[e.jsxs("div",{className:"cv-card-ico",children:[e.jsx(M,{name:gt[t.id]||"gears",size:32,className:o==="incompatible"?"dim":""}),e.jsxs("span",{className:"cv-card-num",children:["CIPHER_0",Ne.findIndex(d=>d.id===t.id)+1]})]}),e.jsx("div",{className:"cv-card-name",children:t.name}),e.jsx("div",{className:"cv-card-desc",children:t.desc}),e.jsx("span",{className:`cv-badge ${o}`,children:l}),o==="locked"&&e.jsxs("div",{className:"cv-card-overlay",children:[e.jsx(M,{name:"lock-closed",size:32,className:"dim"}),e.jsx("div",{children:"UPLOAD FILE FIRST"})]}),o!=="locked"&&c&&e.jsx("div",{className:"cv-tooltip",style:{color:o==="incompatible"?Z.red:o==="base64warn"?Z.amber:"var(--secondary)"},children:c})]})});function Kt({algo:r,keyState:t,setKey:o}){if(!r)return e.jsxs("div",{className:"cv-key-empty",children:[e.jsxs("div",{style:{color:"var(--accent)",fontSize:16},children:[">"," KEY_INPUT"]}),e.jsx("div",{style:{color:"var(--secondary)",marginTop:8},children:"// Waiting for algorithm selection..."}),e.jsx("div",{style:{color:"var(--accent-dim)",marginTop:4},className:"cv-cursor",children:"// Select an algorithm to configure key inputs"})]});if(r==="sha256")return e.jsxs("div",{className:"cv-key-empty",children:[e.jsxs("div",{style:{color:"var(--accent)",fontSize:16},children:[">"," HASH_READY"]}),e.jsx("div",{style:{color:"var(--secondary)",marginTop:8},children:"// SHA-256 needs no key. It fingerprints the current input as-is."}),e.jsx("div",{style:{color:"var(--accent-dim)",marginTop:4},className:"cv-cursor",children:"// Select EXECUTE to generate a digest"})]});if(r==="feistel64"){const n=t.blockKey??"vault-key";return e.jsxs("div",{children:[e.jsx("label",{className:"cv-label",children:"// BLOCK KEY [passphrase]"}),e.jsx("input",{type:"text",className:"cv-input",value:n,onChange:a=>o({...t,blockKey:a.target.value}),placeholder:"e.g. vault-key"}),e.jsx("div",{style:{color:"var(--secondary)",fontSize:12,marginTop:8},children:"// 64-bit blocks, 4 Feistel rounds, reversible on encrypt/decrypt"})]})}if(r==="xor"){const n=t.xorKey??"key";return e.jsxs("div",{children:[e.jsx("label",{className:"cv-label",children:"// XOR KEY [passphrase]"}),e.jsx("input",{type:"text",className:"cv-input",value:n,onChange:a=>o({...t,xorKey:a.target.value}),placeholder:"e.g. key"}),e.jsx("div",{style:{color:"var(--secondary)",fontSize:12,marginTop:8},children:"// Repeating-key XOR works on text, images, and binary streams"})]})}if(r==="caesar"){const n=t.caesarShift??"";return e.jsxs("div",{children:[e.jsx("label",{className:"cv-label",children:"// SHIFT VALUE [0-25]"}),e.jsx("input",{type:"number",min:"0",max:"25",className:"cv-input",value:n,onChange:a=>o({...t,caesarShift:a.target.value}),placeholder:"e.g. 3"}),n!==""&&(parseInt(n,10)>25||parseInt(n,10)<0)&&e.jsx("div",{style:{color:Z.amber,fontSize:12,marginTop:6},children:"[WARN] Shift will be reduced mod 26."})]})}if(r==="vigenere"){const n=t.vigenereKey??"";return e.jsxs("div",{children:[e.jsx("label",{className:"cv-label",children:"// KEYWORD [alphabetic]"}),e.jsx("input",{type:"text",className:"cv-input",value:n,onChange:a=>o({...t,vigenereKey:a.target.value.replace(/[^a-zA-Z]/g,"")}),placeholder:"e.g. LEMON"}),n&&n.length<3&&e.jsx("div",{style:{color:Z.amber,fontSize:12,marginTop:6},children:"[WARN] Short keys are weak. Use 3+ letters."})]})}if(r==="playfair"){const n=t.playfairKey??"";return e.jsxs("div",{children:[e.jsx("label",{className:"cv-label",children:"// KEYWORD [alphabetic — builds 5x5 grid]"}),e.jsx("input",{type:"text",className:"cv-input",value:n,onChange:a=>o({...t,playfairKey:a.target.value.replace(/[^a-zA-Z]/g,"")}),placeholder:"e.g. PLAYFAIR EXAMPLE"}),n&&n.length<3&&e.jsx("div",{style:{color:Z.amber,fontSize:12,marginTop:6},children:"[WARN] Short keys are weak. Use 3+ letters."})]})}if(r==="hill"){const n=t.hillDim??2,a=t.hillMatrix??[[1,0],[0,1]],i=d=>o({...t,hillMatrix:d}),l=d=>{const p=Array.from({length:d},(u,h)=>Array.from({length:d},(b,y)=>h===y?1:0));o({...t,hillDim:d,hillMatrix:p})};let c=null,s=!1;try{c=E(ie(a),26),s=he(c,26)!=null}catch{}return e.jsxs("div",{children:[e.jsx("label",{className:"cv-label",children:"// MATRIX DIMENSION"}),e.jsxs("div",{style:{display:"flex",gap:8,marginBottom:12},children:[e.jsx("button",{className:"cv-btn "+(n===2?"":"cyan"),onClick:()=>l(2),style:n===2?{background:"var(--accent)",color:"#000"}:{},children:"2 x 2"}),e.jsx("button",{className:"cv-btn "+(n===3?"":"cyan"),onClick:()=>l(3),style:n===3?{background:"var(--accent)",color:"#000"}:{},children:"3 x 3"})]}),e.jsx("label",{className:"cv-label",children:"// KEY MATRIX (mod 26)"}),e.jsx("div",{className:"cv-matrix-grid",style:{gridTemplateColumns:`repeat(${n}, 1fr)`},children:a.flat().map((d,p)=>{const u=Math.floor(p/n),h=p%n;return e.jsx("input",{type:"number",value:d,onChange:b=>{const y=a.map(k=>k.slice());y[u][h]=parseInt(b.target.value,10)||0,i(y)}},p)})}),e.jsxs("div",{style:{marginTop:10,fontSize:12,color:s?"var(--accent)":Z.red},children:["det mod 26 = ",c," — ",s?"[OK] Invertible":"[ERROR] Not invertible mod 26"]})]})}if(r==="rsa"){const n=()=>{try{const a=Ve();o({...t,rsaE:a.e,rsaN:a.n,rsaD:a.d,rsaGenerated:a})}catch(a){alert("Key gen failed: "+a.message)}};return e.jsxs("div",{className:"cv-row",children:[e.jsxs("div",{children:[e.jsx("label",{className:"cv-label",children:"// PUBLIC EXPONENT (e) — for encrypt; or PRIVATE (d) for decrypt"}),e.jsx("input",{className:"cv-input",placeholder:"e.g. 65537",value:t.rsaE??"",onChange:a=>o({...t,rsaE:a.target.value.replace(/[^0-9]/g,"")})})]}),e.jsxs("div",{children:[e.jsx("label",{className:"cv-label",children:"// MODULUS (n)"}),e.jsx("input",{className:"cv-input",placeholder:"e.g. 12345...",value:t.rsaN??"",onChange:a=>o({...t,rsaN:a.target.value.replace(/[^0-9]/g,"")})})]}),e.jsxs("div",{children:[e.jsx("label",{className:"cv-label",children:"// PRIVATE EXPONENT (d) — only needed for decrypt"}),e.jsx("input",{className:"cv-input",placeholder:"(decrypt only)",value:t.rsaD??"",onChange:a=>o({...t,rsaD:a.target.value.replace(/[^0-9]/g,"")})})]}),e.jsx("button",{className:"cv-btn cyan",onClick:n,style:{padding:"14px",fontSize:14},children:"[ + ] GENERATE KEY PAIR"}),t.rsaGenerated&&e.jsxs("div",{className:"cv-keyout",children:[e.jsx("div",{style:{color:"var(--accent)",marginBottom:8},children:"[OK] Key pair generated"}),e.jsxs("div",{className:"cv-derive",children:[e.jsx("div",{className:"cv-derive-h",children:"// STEP 1 — pick two primes"}),e.jsxs("div",{className:"cv-derive-row",children:[e.jsx("span",{className:"k",children:"p"}),e.jsx("span",{className:"v",children:t.rsaGenerated.p})]}),e.jsxs("div",{className:"cv-derive-row",children:[e.jsx("span",{className:"k",children:"q"}),e.jsx("span",{className:"v",children:t.rsaGenerated.q})]}),e.jsx("div",{className:"cv-derive-h",children:"// STEP 2 — modulus n = p × q"}),e.jsxs("div",{className:"cv-derive-row",children:[e.jsx("span",{className:"k",children:"n"}),e.jsx("span",{className:"v",children:t.rsaGenerated.n})]}),e.jsx("div",{className:"cv-derive-h",children:"// STEP 3 — totient φ(n) = (p−1)(q−1)"}),e.jsxs("div",{className:"cv-derive-row",children:[e.jsx("span",{className:"k",children:"φ(n)"}),e.jsx("span",{className:"v",children:t.rsaGenerated.phi})]}),e.jsx("div",{className:"cv-derive-h",children:"// STEP 4 — public exponent e, coprime to φ(n)"}),e.jsxs("div",{className:"cv-derive-row",children:[e.jsx("span",{className:"k",children:"e"}),e.jsx("span",{className:"v",children:t.rsaGenerated.e})]}),e.jsx("div",{className:"cv-derive-h",children:"// STEP 5 — private key, calculated: d = e⁻¹ mod φ(n)"}),e.jsxs("div",{className:"cv-derive-row hi",children:[e.jsx("span",{className:"k",children:"d"}),e.jsx("span",{className:"v",children:t.rsaGenerated.d})]}),e.jsxs("div",{className:"cv-derive-note",children:["verify: (e × d) mod φ(n) = 1 — so m",e.jsx("sup",{children:"ed"})," ≡ m (mod n)"]})]}),e.jsx("div",{style:{color:Z.amber,marginTop:8},children:"// PUBLIC KEY = (e, n) · PRIVATE KEY = (d, n) — save d to decrypt later."})]})]})}if(r==="banglashift"){const n=t.banglaPerm??"",a=Je(n);return e.jsxs("div",{className:"cv-row",children:[e.jsxs("div",{children:[e.jsx("label",{className:"cv-label",children:"// TARGET SCRIPT"}),e.jsx("select",{className:"cv-input",value:"bn",disabled:!0,children:e.jsx("option",{value:"bn",children:"Bangla (বাংলা)"})})]}),e.jsxs("div",{children:[e.jsx("label",{className:"cv-label",children:"// PERMUTATION KEY"}),e.jsx("input",{className:"cv-input",placeholder:"any text",value:n,onChange:i=>o({...t,banglaPerm:i.target.value})})]}),e.jsxs("div",{children:[e.jsx("div",{className:"cv-label",children:"// LIVE MAPPING PREVIEW"}),e.jsx("div",{className:"cv-mapping",children:e.jsxs("table",{children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{children:"EN"}),e.jsx("th",{children:"BN"})]})}),e.jsx("tbody",{children:a.map((i,l)=>e.jsxs("tr",{children:[e.jsx("td",{children:String.fromCharCode(97+l)}),e.jsx("td",{children:i})]},l))})]})})]})]})}return null}function Ht({mode:r,setMode:t}){return e.jsxs("div",{className:"cv-mode-row",children:[e.jsx("button",{className:"cv-mode-btn encrypt"+(r==="encrypt"?" active":""),onClick:()=>t("encrypt"),children:"[ ENCRYPT ]"}),e.jsx("button",{className:"cv-mode-btn decrypt"+(r==="decrypt"?" active":""),onClick:()=>t("decrypt"),children:"[ DECRYPT ]"})]})}const Yt=ee.memo(function({lines:t}){const o=f.useRef(null);return f.useEffect(()=>{o.current&&(o.current.scrollTop=o.current.scrollHeight)},[t]),t.length?e.jsx("div",{className:"cv-term",ref:o,role:"log","aria-live":"polite","aria-label":"Cipher execution log",children:t.map((n,a)=>e.jsx("div",{className:`cv-term-line cv-l-${n.kind}`,children:n.text},a))}):null}),Vt=["ch","num","bin","num","bin","glyph"],Pe=[{label:"char",cls:"ch"},{label:"m",sub:"code",cls:"num"},{label:"m",sub:"binary",cls:"bin"},{label:"c",sub:"cipher int",cls:"num big"},{label:"c",sub:"hex bytes",cls:"bin"},{label:"c",sub:"as chars",cls:"glyph"}],De=r=>[r.ch,r.m,r.mBin,r.c,r.hex,r.glyphs],Xt=ee.memo(function({square:t}){return e.jsx("div",{className:"cv-square",children:t.map((o,n)=>e.jsx("div",{className:"cv-square-row",children:o.map((a,i)=>e.jsx("span",{className:"cv-square-cell",children:a},i))},n))})}),Wt=ee.memo(function({matrix:t,label:o}){return e.jsxs("div",{className:"cv-matrixviz",children:[e.jsx("span",{className:"cv-matrixviz-label",children:o}),e.jsx("span",{className:"cv-matrixviz-brk",children:"["}),e.jsx("span",{className:"cv-matrixviz-body",children:t.map((n,a)=>e.jsx("span",{className:"cv-matrixviz-row",children:n.map((i,l)=>e.jsx("span",{className:"cv-matrixviz-cell",children:i},l))},a))}),e.jsx("span",{className:"cv-matrixviz-brk",children:"]"})]})}),Gt=ee.memo(function({trace:t}){const o=t.rows.length,n=t.unit||"step";return e.jsxs("div",{className:"cv-trace",children:[e.jsxs("div",{className:"cv-payload-label",children:[e.jsxs("span",{children:["//"," ",t.algo,"_walkthrough — ",t.mode==="encrypt"?"encryption":"decryption"]}),e.jsx("span",{className:"hint",children:o<t.total?`first ${o} of ${t.total} ${n}s`:`${t.total} ${n}${t.total===1?"":"s"}`})]}),t.formula&&e.jsxs("div",{className:"cv-trace-formula",children:[t.formula,t.keys&&e.jsx("span",{className:"cv-trace-keys",children:t.keys})]}),(t.square||t.matrix)&&e.jsxs("div",{className:"cv-trace-aids",children:[t.square&&e.jsx(Xt,{square:t.square}),t.matrix&&e.jsx(Wt,{matrix:t.matrix,label:t.matrixLabel||"K"})]}),!!t.rows.length&&e.jsx("div",{className:"cv-trace-scroll",tabIndex:0,children:e.jsxs("table",{className:"cv-trace-table algo-"+t.algo,children:[e.jsx("thead",{children:e.jsxs("tr",{children:[t.columns.map((a,i)=>e.jsxs("th",{children:[a.label,a.sub&&e.jsxs("span",{className:"sub",children:["(",a.sub,")"]})]},i)),e.jsx("th",{className:"fill","aria-hidden":"true"})]})}),e.jsx("tbody",{children:t.rows.map((a,i)=>e.jsxs("tr",{children:[a.map((l,c)=>{var s;return e.jsx("td",{className:((s=t.columns[c])==null?void 0:s.cls)??Vt[c]??"",children:l===" "?"␣":l},c)}),e.jsx("td",{className:"fill"})]},i))})]})}),!!(t.notes||[]).length&&e.jsx("div",{className:"cv-trace-note",children:t.notes.map((a,i)=>e.jsxs("div",{children:["// ",a]},i))})]})}),qt=ee.memo(function({output:t,onDownload:o,onCopy:n,copied:a,onWhatsApp:i,waPhone:l,setWaPhone:c,showWA:s}){return t?e.jsxs("div",{className:"cv-output",id:"cv-output-anchor",role:"region","aria-label":"Cipher output",children:[e.jsxs("div",{className:"cv-output-h",children:[e.jsx(M,{name:"vault-open",size:26,className:"second"}),e.jsxs("span",{className:"cv-output-h-text",children:[">"," VAULT_OPEN"]}),e.jsx("span",{className:"cv-output-badge",children:"READY"})]}),e.jsxs("div",{className:"cv-output-meta",children:[e.jsxs("span",{className:"cv-meta-chip",children:[e.jsx("span",{className:"k",children:"file"}),e.jsx("span",{className:"v",children:t.filename})]}),e.jsxs("span",{className:"cv-meta-chip",children:[e.jsx("span",{className:"k",children:"size"}),e.jsx("span",{className:"v",children:pe(t.size)})]}),e.jsxs("span",{className:"cv-meta-chip",children:[e.jsx("span",{className:"k",children:"type"}),e.jsx("span",{className:"v",children:t.contentKind})]})]}),t.preview&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"cv-payload-label",children:[e.jsxs("span",{children:["//"," payload_preview"]}),e.jsx("span",{className:"hint",children:"scroll for more"})]}),e.jsx("div",{className:"cv-preview",tabIndex:0,children:t.preview})]}),t.stepTrace&&e.jsx(Gt,{trace:t.stepTrace}),t.blockVisual&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"cv-payload-label",children:e.jsxs("span",{children:["//"," block_structure"]})}),e.jsx("div",{className:"cv-blockviz",tabIndex:0,children:t.blockVisual})]}),e.jsxs("div",{className:"cv-dl-row",children:[e.jsx("button",{className:"cv-dl",onClick:o,children:e.jsxs("span",{style:{display:"inline-flex",alignItems:"center",gap:12},children:[e.jsx(M,{name:"download",size:22}),">"," DOWNLOAD FILE_"]})}),t.preview&&e.jsx("button",{className:"cv-btn cyan",onClick:n,children:a?"[OK] COPIED":"[ ] COPY TEXT"})]}),s&&t.preview&&e.jsxs("div",{className:"cv-wa-row",children:[e.jsx("input",{className:"cv-input",placeholder:"phone (optional, e.g. 8801234567890)",value:l,onChange:d=>c(d.target.value.replace(/[^0-9]/g,""))}),e.jsx("span",{style:{alignSelf:"center",color:"var(--secondary)",fontSize:11,letterSpacing:1},children:"// opens WhatsApp with the cipher pre-filled — you still tap send"}),e.jsxs("button",{className:"cv-wa-btn",onClick:i,children:[e.jsx(M,{name:"whatsapp",size:22}),"SEND TO WHATSAPP"]})]})]}):null});function Zt(){const[r,t]=f.useState(null),[o,n]=f.useState(null),[a,i]=f.useState(null),[l,c]=f.useState(""),[s,d]=f.useState(null),[p,u]=f.useState({}),[h,b]=f.useState(null),[y,k]=f.useState([]),[C,z]=f.useState(null),[$,L]=f.useState(!1),[Q,K]=f.useState(!1),[A,W]=f.useState("file"),[T,te]=f.useState(""),[V,ge]=f.useState(""),[ve,me]=f.useState(!1);f.useEffect(()=>{const x=document.createElement("style");return x.textContent=xt,document.head.appendChild(x),()=>{try{document.head.removeChild(x)}catch{}}},[]);const X=s==="banglashift",B=h==="decrypt";f.useEffect(()=>(document.documentElement.classList.toggle("danger",B),()=>document.documentElement.classList.remove("danger")),[B]),f.useEffect(()=>{if(A!=="text")return;if(T){const j=new File([T],"message.txt",{type:"text/plain"}),R=new TextEncoder().encode(T).buffer;t(j),n("text"),i(R),c(ke(R,64))}else t(null),n(null),i(null),c("");z(null);const x=setTimeout(()=>{if(A==="text"&&T){const j=new TextEncoder().encode(T).buffer;c(ke(j,64))}},120);return()=>clearTimeout(x)},[A,T]);const re=x=>{x!==A&&(W(x),t(null),i(null),c(""),n(null),z(null),k([]),x==="file"&&te(""))},be=f.useCallback(async x=>{t(x);const j=vt(x);n(j),z(null),k([]);try{const R=await mt(x);i(R),c(ke(R,64))}catch(R){c("// failed to read file: "+R.message)}s&&ne[s][j]==="error"&&d(null)},[s]),ue=()=>{t(null),i(null),c(""),n(null),z(null),k([])},le=f.useCallback(x=>r?ne[x][o]==="error"?"incompatible":ne[x][o]==="base64warn"?"base64warn":"compatible":"locked",[r,o]),fe=x=>{d(x),z(null),k([]),x==="caesar"?u({caesarShift:"3"}):x==="vigenere"?u({vigenereKey:""}):x==="playfair"?u({playfairKey:""}):x==="hill"?u({hillDim:2,hillMatrix:[[3,3],[2,5]]}):x==="sha256"?(u({}),b("encrypt")):x==="feistel64"?u({blockKey:"vault-key"}):x==="xor"?u({xorKey:"key"}):x==="rsa"?u({rsaE:"",rsaN:"",rsaD:""}):x==="banglashift"&&u({banglaPerm:""})},ye=f.useMemo(()=>{if(!s)return!1;if(s==="caesar")return p.caesarShift!==""&&p.caesarShift!=null;if(s==="vigenere")return!!(p.vigenereKey&&p.vigenereKey.length);if(s==="playfair")return!!(p.playfairKey&&p.playfairKey.length);if(s==="sha256")return!0;if(s==="feistel64")return!!(p.blockKey&&p.blockKey.trim().length);if(s==="xor")return!!(p.xorKey&&p.xorKey.trim().length);if(s==="hill"){const x=p.hillMatrix;if(!x)return!1;try{return he(E(ie(x),26),26)!=null}catch{return!1}}return s==="rsa"?p.rsaN?h==="decrypt"?!!(p.rsaD&&p.rsaD.length):!!(p.rsaE&&p.rsaE.length):!1:s==="banglashift"?!!(p.banglaPerm&&p.banglaPerm.length):!1},[s,p,h]),Qe=r?s?ye?h?"// READY TO EXECUTE":"// need: mode":"// need: key":"// need: algorithm":"// need: file",ae=!!(r&&s&&ye&&h&&!$),w=(x,j)=>k(R=>[...R,{kind:x,text:j}]),we=f.useCallback(async()=>{if(ae){L(!0),z(null),k([]),K(!1);try{w("step","[*] Validating inputs..."),w("ok",`[OK] File loaded: ${r.name} (${pe(r.size)})`);const x=ne[s][o],j=x==="base64warn",R=oe[s]+(j?" (Base64 mode)":"");if(w("ok",`[OK] Algorithm: ${R}`),w("ok",`[OK] Mode: ${h.toUpperCase()}`),x==="error"){w("err",`[ERROR] ${oe[s]} does not support ${o} files.`);const v=Ne.filter(m=>ne[m.id][o]!=="error").map(m=>m.name).join(", ");w("info",`[INFO] Compatible algorithms for this file: ${v}`),w("err","[ABORT] Execution halted."),L(!1);return}s==="rsa"&&r.size>5*1024*1024&&w("warn","[WARN] RSA on >5MB files is slow. Continuing...");let P,F,U,H=null,Se=null,_=null;if(s==="sha256"){h!=="encrypt"&&w("warn","[WARN] SHA-256 is one-way; generating a digest regardless of mode."),w("step","[*] Reading file bytes...");const v=new Uint8Array(a);w("step","[*] Computing SHA-256 digest...");const m=await ft(v),g=r.name.replace(/^encrypted_/,"").replace(/^decrypted_/,"").replace(/\.[^.]+$/,"")||"input";P=new Blob([m+`
`],{type:"text/plain;charset=utf-8"}),F=`sha256_${g}.txt`,U="text (SHA-256 digest)",H=m;{const S=v.length*8,N=Math.ceil((v.length+9)/64)*64;_={algo:"sha256",mode:"encrypt",unit:"word",formula:e.jsx(e.Fragment,{children:"H = SHA-256(message)"}),keys:`${v.length} byte${v.length===1?"":"s"} in → 32 bytes out`,columns:[{label:"word",cls:"ch"},{label:"hex",cls:"num"},{label:"binary",cls:"bin"}],rows:Array.from({length:8},(D,I)=>{const O=m.slice(I*8,I*8+8).toUpperCase();return["H"+I,O,parseInt(O,16).toString(2).padStart(32,"0")]}),total:8,notes:[`message padded from ${v.length} to ${N} bytes (a 1 bit, zeros, then the ${S}-bit length) and processed in ${N/64} block${N/64===1?"":"s"} of 64 bytes`,"the digest is the eight 32-bit state words H0…H7 concatenated — this is one-way, so there is nothing to reverse"]}}}else if(s==="feistel64"){w("step","[*] Reading file bytes...");const v=new Uint8Array(a);w("step",h==="encrypt"?"[*] Encrypting 64-bit blocks...":"[*] Decrypting 64-bit blocks...");const m=[],g=jt(v,p.blockKey,h,N=>{Se=N},m);_={algo:"feistel-64",mode:h,unit:"round",formula:e.jsxs(e.Fragment,{children:["L′ = R,  R′ = L ⊕ F(R, k",e.jsx("sub",{children:"i"}),")"]}),keys:`block 1 of ${m.blocks}${m.padLength?` · ${m.padLength} pad byte(s) added`:""}`,columns:[{label:"round",cls:"ch"},{label:"k",sub:"round key",cls:"bin"},{label:"L",cls:"num"},{label:"R",cls:"num"}],rows:m,total:m.rounds,notes:["each round swaps the halves and XORs one through a function of the other","the halves are swapped once more on output, which is what lets the same structure decrypt by running the round keys in reverse"]},P=new Blob([g],{type:"application/octet-stream"});const S=r.name.replace(/^encrypted_/,"").replace(/^decrypted_/,"").replace(/\.[^.]+$/,"");F=`${h==="encrypt"?"encrypted":"decrypted"}_${S}.bin`,U="binary (Feistel-64)",H=se(g.subarray(0,Math.min(64,g.length))).toUpperCase().replace(/(.{2})/g,"$1 ").trim()}else if(s==="xor"){w("step","[*] Reading file bytes...");const v=new Uint8Array(a);w("step",h==="encrypt"?"[*] Applying XOR stream...":"[*] Reversing XOR stream...");const m=[],g=Nt(v,p.xorKey,m);_={algo:"xor",mode:h,unit:"byte",formula:e.jsxs(e.Fragment,{children:["c = p ⊕ k",e.jsx("sub",{children:"i mod len"})]}),keys:`key "${m.key}" (${new TextEncoder().encode(m.key).length} bytes, repeating)`,columns:[{label:"i",cls:"ch"},{label:"p",sub:"hex / binary",cls:"bin"},{label:"k",sub:"hex / binary",cls:"bin"},{label:"c",sub:"hex / binary",cls:"bin"}],rows:m,total:v.length,notes:["XOR is its own inverse — running the same key over the ciphertext gives the plaintext back, so encrypt and decrypt are the identical operation","each output bit is 1 only where the plaintext and key bits differ"]},P=new Blob([g],{type:"application/octet-stream"});const S=r.name.replace(/^encrypted_/,"").replace(/^decrypted_/,"").replace(/\.[^.]+$/,"");F=`${h==="encrypt"?"encrypted":"decrypted"}_${S}.bin`,U="binary (XOR stream)",H=se(g.subarray(0,Math.min(64,g.length))).toUpperCase().replace(/(.{2})/g,"$1 ").trim()}else if(s==="rsa"&&A==="text"){const v=BigInt(p.rsaN);if(v<=0n)throw new Error("RSA key values must be positive.");const m="message";if(h==="encrypt"){const g=BigInt(p.rsaE);if(g<=0n)throw new Error("RSA key values must be positive.");w("step","[*] Reading string as Unicode code points..."),w("info",`[INFO] Public key (e, n) = (${g}, ${v})`),w("step","[*] Encrypting per character: c = m^e mod n"),T.length>2e3&&w("warn",`[WARN] ${T.length} characters — per-character RSA may take a moment.`);const S=$t(T,g,v);w("ok",`[OK] ${S.count} character(s) encrypted into ${S.count} cipher block(s).`),P=new Blob([S.cipherText],{type:"text/plain;charset=utf-8"}),F=`encrypted_${m}.txt`,U="text (RSA — space-separated c values)",H=S.cipherText,_={algo:"rsa",mode:"encrypt",unit:"character",formula:e.jsxs(e.Fragment,{children:["c = m",e.jsx("sup",{children:"e"})," mod n"]}),keys:`with (e, n) = (${g}, ${v})`,columns:Pe,rows:S.trace.map(De),total:S.count,notes:["each character is raised to e and reduced mod n — the cipher integer is far larger than the character it came from, which is why its bytes map to unrelated-looking characters","c (as chars) reads the cipher bytes as Latin-1; control bytes show as ␀-style pictures, so every byte has one glyph"]}}else{const g=BigInt(p.rsaD);if(g<=0n)throw new Error("RSA key values must be positive.");w("step","[*] Parsing ciphertext numbers..."),w("info",`[INFO] Private key (d, n) = (${g}, ${v})`),w("step","[*] Decrypting per block: m = c^d mod n");const S=Lt(T,g,v);w("ok",`[OK] ${S.count} cipher block(s) recovered to plaintext.`),P=new Blob([S.plainText],{type:"text/plain;charset=utf-8"}),F=`decrypted_${m}.txt`,U="text (RSA plaintext)",H=S.plainText,_={algo:"rsa",mode:"decrypt",unit:"block",formula:e.jsxs(e.Fragment,{children:["m = c",e.jsx("sup",{children:"d"})," mod n"]}),keys:`with (d, n) = (${g}, ${v})`,columns:Pe,rows:S.trace.map(De),total:S.count,notes:["each cipher integer is raised to d and reduced mod n, recovering the original code point"]}}}else if(s==="rsa")if(h==="encrypt"){const v=BigInt(p.rsaE),m=BigInt(p.rsaN);if(v<=0n||m<=0n)throw new Error("RSA key values must be positive.");w("step","[*] Reading file as bytes...");const g=new Uint8Array(a);w("step","[*] Encrypting via modular exponentiation...");let S=-1;const N=await Ot(g,v,m,D=>{const I=Math.floor(D*100);if(I!==S&&I%10===0){S=I;const O="█".repeat(Math.floor(D*10))+"░".repeat(10-Math.floor(D*10));k(G=>{const Y=[...G];return Y.length&&Y[Y.length-1].text.startsWith("[*] Applying cipher...")?Y[Y.length-1]={kind:"step",text:`[*] Applying cipher... ${O} ${I}%`}:Y.push({kind:"step",text:`[*] Applying cipher... ${O} ${I}%`}),Y})}});P=new Blob([N],{type:"application/octet-stream"}),F=`encrypted_${r.name}.bin`,U="binary (RSA ciphertext)"}else{const v=BigInt(p.rsaD),m=BigInt(p.rsaN);if(v<=0n||m<=0n)throw new Error("RSA key values must be positive.");w("step","[*] Reading ciphertext bytes...");const g=new Uint8Array(a);w("step","[*] Decrypting...");let S=-1;const N=await Pt(g,v,m,I=>{const O=Math.floor(I*100);if(O!==S&&O%10===0){S=O;const G="█".repeat(Math.floor(I*10))+"░".repeat(10-Math.floor(I*10));k(Y=>{const q=[...Y];return q.length&&q[q.length-1].text.startsWith("[*] Applying cipher...")?q[q.length-1]={kind:"step",text:`[*] Applying cipher... ${G} ${O}%`}:q.push({kind:"step",text:`[*] Applying cipher... ${G} ${O}%`}),q})}});P=new Blob([N],{type:"application/octet-stream"}),F=`decrypted_${r.name.replace(/^encrypted_/,"").replace(/\.bin$/,"")}`,U="binary (RSA plaintext)";try{Array.from(N.subarray(0,200)).every(G=>G>=9&&G<127)&&(H=new TextDecoder("utf-8",{fatal:!1}).decode(N.subarray(0,200)))}catch{}}else if(j){w("step","[*] Encoding file to Base64...");let v;h==="encrypt"?v=bt(a):v=await ze(r),w("step","[*] Applying cipher...");let m;if(s==="caesar"){const g=parseInt(p.caesarShift,10);if(Number.isNaN(g))throw new Error("Invalid Caesar shift.");m=$e(v,g,h)}else s==="vigenere"&&(m=Le(v,p.vigenereKey,h));if(h==="encrypt")P=new Blob([m],{type:"text/plain"}),F=`encrypted_${r.name}.txt`,U="text (Base64-ciphered)",H=m.slice(0,200);else{let g;try{g=Ee(m)}catch{throw new Error("Base64 decode failed — wrong key or not a Base64 cipher file.")}let S=r.name.replace(/^encrypted_/,"").replace(/\.txt$/,"");F=`decrypted_${S}`;const N=Te(S).toLowerCase(),D={".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".gif":"image/gif",".bmp":"image/bmp",".webp":"image/webp",".pdf":"application/pdf"};P=new Blob([g],{type:D[N]||"application/octet-stream"}),U="binary (decoded)"}}else{w("step","[*] Reading file as UTF-8...");const v=await ze(r);w("step","[*] Applying cipher...");let m;const g=[];if(s==="caesar"){const N=parseInt(p.caesarShift,10);if(Number.isNaN(N))throw new Error("Invalid Caesar shift.");m=$e(v,N,h,g);const D=h==="encrypt"?N:-N;_={algo:"caesar",mode:h,unit:"letter",formula:e.jsxs(e.Fragment,{children:["c = (p ",D<0?"−":"+"," ",Math.abs(D),") mod 26"]}),keys:`shift k = ${N}${h==="decrypt"?" (applied in reverse)":""}`,columns:[{label:"char",cls:"ch"},{label:"p",sub:"index",cls:"num"},{label:"shift",cls:"bin"},{label:"c",sub:"index",cls:"num"},{label:"out",cls:"ch"}],rows:g,total:Be(v),notes:["A→0, B→1 … Z→25; the shift wraps around with mod 26","non-letters pass through untouched and are not counted as steps"]}}else if(s==="vigenere"){m=Le(v,p.vigenereKey,h,g);const N=(p.vigenereKey||"").toLowerCase().replace(/[^a-z]/g,"");_={algo:"vigenere",mode:h,unit:"letter",formula:e.jsxs(e.Fragment,{children:["c = (p ",h==="encrypt"?"+":"−"," k",e.jsx("sub",{children:"i"}),") mod 26"]}),keys:`key = "${N.toUpperCase()}" (repeats every ${N.length} letter${N.length===1?"":"s"})`,columns:[{label:"char",cls:"ch"},{label:"p",sub:"index",cls:"num"},{label:"key",cls:"ch"},{label:"shift",cls:"bin"},{label:"c",sub:"index",cls:"num"},{label:"out",cls:"ch"}],rows:g,total:Be(v),notes:["the key cycles over the letters only — each letter gets its own shift, which is what defeats frequency analysis"]}}else if(s==="hill"){m=zt(v,p.hillMatrix,h,g);const N=(p.hillMatrix||[[1]]).length;_={algo:"hill",mode:h,unit:"block",formula:e.jsx(e.Fragment,{children:"C = K · P mod 26"}),keys:`${N}×${N} matrix, blocks of ${N} letters`,matrix:g.matrix,matrixLabel:h==="encrypt"?"K":"K⁻¹ (mod 26)",columns:[{label:"block",cls:"ch"},{label:"P",sub:"indices",cls:"num"},{label:"K · P",cls:"bin"},{label:"mod 26",cls:"num"},{label:"out",cls:"ch"}],rows:g,total:Math.ceil(v.toUpperCase().replace(/[^A-Z]/g,"").length/N),notes:["text is uppercased, stripped to A–Z, then padded with X to fill the last block",h==="encrypt"?"decryption multiplies by the inverse of K mod 26 — which is why K must be invertible":"the matrix shown is the inverse of your key matrix, computed mod 26"]}}else s==="playfair"?(m=Tt(v,p.playfairKey,h,g),_={algo:"playfair",mode:h,unit:"digraph",formula:e.jsx(e.Fragment,{children:"pair → 5×5 square rule"}),keys:`key square built from "${p.playfairKey||""}"`,square:g.grid,columns:[{label:"pair",cls:"ch"},{label:"coords",sub:"r,c",cls:"bin"},{label:"rule",cls:"bin"},{label:"out",cls:"ch"}],rows:g,total:g.length>=xe?At(v):g.length,notes:["J is folded into I, so the 25 remaining letters fill the square","same row → each letter moves one step sideways; same column → one step down; otherwise → swap columns of the rectangle"]}):s==="banglashift"&&(m=Dt(v,"bn",p.banglaPerm,h,g),_={algo:"banglashift",mode:h,unit:"letter",formula:e.jsx(e.Fragment,{children:"a…z → Bangla alphabet rotated by (Σ key codes) mod 26"}),keys:`Σ = ${g.sum}, shift = ${g.shift}`,columns:[{label:"in",cls:"ch"},{label:"index",cls:"num"},{label:"latin",cls:"ch"},{label:"out",cls:"ch"}],rows:g,total:g.count,notes:["the key is summed to a single rotation amount, then the Bangla alphabet is rotated by it","the mapping is a straight substitution — same input letter always gives the same output"]});if(h==="decrypt"&&(s==="caesar"||s==="vigenere")&&/^encrypted_.+\..+\.txt$/i.test(r.name)){w("step","[*] Detected base64 envelope — decoding back to binary...");let N;try{N=Ee(m.trim())}catch{throw new Error("Base64 decode failed — wrong key or not a base64-mode file.")}const D=r.name.replace(/^encrypted_/,"").replace(/\.txt$/i,"");F=`decrypted_${D}`;const I=Te(D).toLowerCase(),O={".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".gif":"image/gif",".bmp":"image/bmp",".webp":"image/webp",".pdf":"application/pdf"};P=new Blob([N],{type:O[I]||"application/octet-stream"}),U="binary (base64-decoded)"}else{const N=r.name.replace(/^encrypted_/,"").replace(/^decrypted_/,"");F=(h==="encrypt"?"encrypted_":"decrypted_")+N,P=new Blob([m],{type:"text/plain;charset=utf-8"}),U="text",H=m.slice(0,200)}}w("ok","[OK] Done. Output ready.");try{const v=new(window.AudioContext||window.webkitAudioContext),m=v.createOscillator(),g=v.createGain();m.frequency.value=880,m.connect(g),g.connect(v.destination),g.gain.setValueAtTime(.06,v.currentTime),g.gain.exponentialRampToValueAtTime(1e-4,v.currentTime+.2),m.start(),m.stop(v.currentTime+.2)}catch{}z({blob:P,filename:F,size:P.size,contentKind:U,preview:H,blockVisual:Se,stepTrace:_})}catch(x){w("err","[ERROR] "+x.message),w("err","[ABORT] Execution halted.")}finally{L(!1)}}},[ae,s,h,r,a,o,p,A,T]);f.useEffect(()=>{const x=j=>{(j.ctrlKey||j.metaKey)&&j.key==="Enter"&&(j.preventDefault(),we())};return window.addEventListener("keydown",x),()=>window.removeEventListener("keydown",x)},[we]),f.useEffect(()=>{const x=()=>me(window.scrollY>600);return window.addEventListener("scroll",x,{passive:!0}),()=>window.removeEventListener("scroll",x)},[]),f.useEffect(()=>{if(!C)return;const x=setTimeout(()=>{const j=document.getElementById("cv-output-anchor");j&&j.scrollIntoView({behavior:"smooth",block:"start"})},60);return()=>clearTimeout(x)},[C]);const et=()=>window.scrollTo({top:0,behavior:"smooth"}),tt=()=>{C&&ut(C.blob,C.filename)},rt=()=>{C&&C.preview&&C.blob.text().then(x=>{navigator.clipboard.writeText(x),K(!0),setTimeout(()=>K(!1),2e3)})},at=()=>{C&&C.blob.text().then(x=>{const j=encodeURIComponent(x),R=V?`https://wa.me/${V}?text=${j}`:`https://wa.me/?text=${j}`;window.open(R,"_blank","noopener")})},nt=f.useMemo(()=>{let x="";for(let j=0;j<240;j++)x+=Math.random()>.5?"1":"0";return(x+"  ").repeat(2)},[r,s,h]),ot=f.useMemo(()=>{const x="0123456789ABCDEF";let j="";for(let R=0;R<600;R++)j+=x[Math.floor(Math.random()*16)],R%2===1&&(j+=" ");return(j+"  ").repeat(2)},[]);return e.jsxs(e.Fragment,{children:[e.jsx(Ft,{banglaActive:X,danger:B}),e.jsx("div",{className:"cv-vignette"}),e.jsx("div",{className:"cv-scanlines"}),e.jsx("div",{className:"cv-blood"}),[5,14,26,38,50,62,74,86,95].map((x,j)=>e.jsx("span",{className:"cv-drip"+(j%3===0?" thick":""),style:{left:`${x}%`,animationDelay:`${j*.7}s`,animationDuration:`${4+j%3}s`}},j)),e.jsx("button",{type:"button",className:"cv-scrolltop"+(ve?" visible":""),onClick:et,"aria-label":"Scroll to top",title:"Scroll to top",children:e.jsx("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true",children:e.jsx("path",{d:"m6 14 6-6 6 6"})})}),e.jsx("div",{className:"cv-root",children:e.jsxs("div",{className:"cv-content",children:[e.jsxs("header",{style:{marginBottom:12},children:[e.jsxs("h1",{className:"cv-title",children:[">"," CryptoVault_"]}),e.jsxs("div",{className:"cv-tagline-stack","aria-label":"CryptoVault slogan",children:[e.jsx("div",{className:"cv-tagline cv-tagline-alt",children:"// Encrypt · Decrypt · Dominate"}),e.jsx("div",{className:"cv-tagline cv-tagline-alt alt",children:"// Utterly Shatters The Black Hat Hackers"})]}),e.jsxs("div",{className:"cv-statusbar",children:[e.jsxs("span",{children:[e.jsx("span",{className:"cv-stat-dot"}),"  ",e.jsx(M,{name:B?"shield-x":"shield",size:14,className:B?"":"second"}),e.jsx("span",{className:"cv-stat-key",children:"SYS:"})," ",e.jsx("span",{className:"cv-stat-val",children:B?"DECRYPT_MODE":"ENCRYPT_MODE"})]}),e.jsxs("span",{children:[e.jsx(M,{name:r?Ke(o):"file-bin",size:14,className:"second"}),e.jsx("span",{className:"cv-stat-key",children:"FILE:"})," ",e.jsx("span",{className:"cv-stat-val",children:r?r.name:"NULL"})]}),e.jsxs("span",{children:[e.jsx(M,{name:"key",size:14,className:"second"}),e.jsx("span",{className:"cv-stat-key",children:"ALGO:"})," ",e.jsx("span",{className:"cv-stat-val",children:s?oe[s].toUpperCase():"NULL"})]}),e.jsxs("span",{style:{marginLeft:"auto",display:"inline-flex",alignItems:"center",gap:6,color:"var(--accent)",textShadow:B?"0 0 10px rgba(255,42,61,0.7)":"none"},children:[B&&e.jsx(M,{name:"skull",size:16}),B?"// !! BLOOD VAULT !!":"// SECURE LINK"]})]})]}),e.jsx("div",{className:"cv-stream",children:e.jsx("div",{className:"cv-stream-inner",children:nt})}),e.jsxs("section",{className:"cv-step",children:[e.jsxs("div",{className:"cv-step-head",children:[e.jsx("span",{className:"cv-step-lock",children:e.jsx(M,{name:r?"lock-open":"lock-closed",size:18})}),e.jsx("span",{className:"cv-step-num",children:"01"}),e.jsx("span",{className:"cv-step-title",children:"INPUT SOURCE"}),e.jsx("span",{className:"cv-step-sub",children:r?`// loaded · ${pe(r.size)}`:"// awaiting input"})]}),e.jsxs("div",{className:"cv-srctabs",role:"tablist",children:[e.jsxs("button",{className:"cv-srctab"+(A==="file"?" active":""),onClick:()=>re("file"),children:[e.jsx(M,{name:"file-bin",size:18})," [ FILE ]"]}),e.jsxs("button",{className:"cv-srctab"+(A==="text"?" active":""),onClick:()=>re("text"),children:[e.jsx(M,{name:"paste",size:18})," [ TEXT / WHATSAPP ]"]})]}),A==="file"?e.jsx(Ut,{file:r,onFile:be,onClear:ue,fileCategory:o,hexDump:l}):e.jsxs(e.Fragment,{children:[e.jsx("label",{className:"cv-label",children:"// PASTE OR TYPE PLAINTEXT"}),e.jsx("textarea",{className:"cv-textarea",value:T,onChange:x=>te(x.target.value),placeholder:"Type a message, or paste a cipher you received on WhatsApp to decrypt...",spellCheck:!1}),e.jsxs("div",{className:"cv-text-meta",children:[e.jsxs("span",{children:["chars: ",e.jsx("span",{className:"v",children:T.length})]}),e.jsxs("span",{children:["bytes: ",e.jsx("span",{className:"v",children:new TextEncoder().encode(T).length})]}),e.jsxs("span",{children:["category: ",e.jsx("span",{className:"v",children:"TEXT"})]})]}),T&&e.jsxs(e.Fragment,{children:[e.jsx("div",{className:"cv-hex-h",style:{marginTop:12},children:"// First 64 bytes — hex dump"}),e.jsx("div",{className:"cv-hex",children:l})]})]})]}),e.jsxs("section",{className:"cv-step",children:[e.jsxs("div",{className:"cv-step-head",children:[e.jsx("span",{className:"cv-step-lock",children:e.jsx(M,{name:s?"lock-open":"lock-closed",size:18})}),e.jsx("span",{className:"cv-step-num",children:"02"}),e.jsx("span",{className:"cv-step-title",children:"SELECT ALGORITHM"}),e.jsx("span",{className:"cv-step-sub",children:r?`// filtered for ${o}`:"// Upload a file first to see compatible algorithms"})]}),e.jsx("div",{className:"cv-grid",children:Ne.map(x=>e.jsx(_t,{algo:x,state:le(x.id),selected:s===x.id,onSelect:fe},x.id))})]}),e.jsxs("section",{className:"cv-step",children:[e.jsxs("div",{className:"cv-step-head",children:[e.jsx("span",{className:"cv-step-lock",children:e.jsx(M,{name:ye?"key":"lock-closed",size:18})}),e.jsx("span",{className:"cv-step-num",children:"03"}),e.jsx("span",{className:"cv-step-title",children:"ENTER KEY"}),e.jsx("span",{className:"cv-step-sub",children:s?`// ${oe[s]}`:""})]}),e.jsx(Kt,{algo:s,keyState:p,setKey:u})]}),e.jsxs("section",{className:"cv-step",children:[e.jsxs("div",{className:"cv-step-head",children:[e.jsx("span",{className:"cv-step-lock",children:e.jsx(M,{name:h?B?"shield-x":"shield":"lock-closed",size:18})}),e.jsx("span",{className:"cv-step-num",children:"04"}),e.jsx("span",{className:"cv-step-title",children:"CHOOSE MODE"}),e.jsx("span",{className:"cv-step-sub",children:h?`// mode: ${h}`:"// select direction"})]}),e.jsx(Ht,{mode:h,setMode:b})]}),e.jsxs("section",{className:"cv-step",children:[e.jsxs("div",{className:"cv-step-head",children:[e.jsx("span",{className:"cv-step-lock",children:e.jsx(M,{name:ae?"play":"lock-closed",size:18})}),e.jsx("span",{className:"cv-step-num",children:"05"}),e.jsx("span",{className:"cv-step-title",children:"EXECUTE"}),e.jsx("span",{className:"cv-step-sub",children:"// Ctrl+Enter to run"})]}),e.jsx("button",{className:"cv-exec",disabled:!ae,onClick:we,children:e.jsxs("span",{className:"cv-exec-row",children:[e.jsxs("svg",{className:"cv-exec-lock",viewBox:"0 0 24 24",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"4",y:"11",width:"16",height:"10"}),e.jsx("path",{className:"shackle",d:B?"M7 11V8a5 5 0 0 1 9.5-2":"M7 11V8a5 5 0 0 1 10 0v3"}),e.jsx("circle",{cx:"12",cy:"16",r:"1.6",fill:"currentColor",stroke:"none"})]}),e.jsx("span",{children:$?"> RUNNING...":B?"> UNLOCK_VAULT_":"> SEAL_VAULT_"})]})}),$&&e.jsx("div",{className:"cv-progress",role:"progressbar","aria-label":"Encrypting…"}),e.jsxs("div",{className:"cv-hint",children:[Qe,ae&&e.jsxs(e.Fragment,{children:[" ",e.jsx("span",{className:"cv-kbd",children:"Ctrl"})," + ",e.jsx("span",{className:"cv-kbd",children:"Enter"})]})]}),e.jsx(Yt,{lines:y}),e.jsx(qt,{output:C,onDownload:tt,onCopy:rt,copied:Q,onWhatsApp:at,waPhone:V,setWaPhone:ge,showWA:A==="text"})]}),e.jsxs("footer",{className:"cv-footer",children:[e.jsx("div",{className:"cv-foot-line",children:"// Built with entropy. Powered by chaos."}),e.jsx("div",{className:"cv-hex-stream",children:e.jsx("div",{className:"cv-hex-stream-inner",children:ot})})]})]})})]})}_e(document.getElementById("root")).render(e.jsx(Zt,{}));
