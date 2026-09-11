import React, { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback, useReducer, createContext, useContext } from "react";
import {
  Eye, Lock, Trophy, Star, Zap, Play, RotateCcw, ChevronLeft, ChevronDown, Check, X,
  Home, Map, Target, TrendingUp, Compass, Cpu, Package, Search, Navigation, Award,
  Lightbulb, Volume2, VolumeX, Settings, User, ArrowRight, ArrowUp, ArrowLeft, ArrowDown,
  Bot, Info, Plus, Minus, Flag, BookOpen, Layers, Wrench, RefreshCw, Repeat, Sparkles
} from "lucide-react";

/* ============================================================================
   AXIOM — گیم‌پلی اول، ریاضی بعد
   ----------------------------------------------------------------------------
   ساختار این فایل عیناً معادل ساختار پوشه‌های خواسته‌شده است:
     §1 lib/styles      §2 lib/utils       §3 lib/analytics    §4 lib/storage
     §5 data/*          §6 hooks + state   §7 components/ui    §8 components/nova
     §9 components/math-lens               §10 components/games
     §11 worlds/ + pages/                  §12 app shell/router
   هر بخش با یک بنر مشخص شده تا split کردن به فایل‌های Next.js مکانیکی باشد.
============================================================================ */

/* ========================= §1 — DESIGN SYSTEM ============================ */

const CSS = `
@import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');

.ax, .ax *, .ax *::before, .ax *::after { box-sizing: border-box; }
.ax {
  --bg:#070B1A; --bg2:#0B1230;
  --text:#E9EDFA; --muted:#95A1C3; --dim:#66739A;
  --stroke:rgba(255,255,255,.10); --stroke2:rgba(255,255,255,.18);
  --glass:rgba(255,255,255,.045); --glass2:rgba(255,255,255,.075);
  --p:#8B7BFF; --c:#FFA24B; --d:#2FD6A6; --v:#4FA8FF;
  --gold:#FFD166; --bad:#FF7070; --ok:#2FD6A6;
  --r:22px; --r-sm:14px;
  --mono:"SFMono-Regular",Menlo,Consolas,"Liberation Mono",monospace;
  font-family:'Vazirmatn',Vazir,Tahoma,sans-serif;
  direction:rtl; color:var(--text); min-height:100vh; line-height:1.75;
  -webkit-font-smoothing:antialiased;
  background:
    radial-gradient(1200px 700px at 85% -15%, rgba(139,123,255,.20), transparent 62%),
    radial-gradient(900px 520px at 8% 4%, rgba(79,168,255,.13), transparent 58%),
    radial-gradient(900px 700px at 45% 115%, rgba(47,214,166,.09), transparent 62%),
    var(--bg);
}
.ax button, .ax input, .ax select { font-family:inherit; color:inherit; }
.ax :focus-visible { outline:2px solid var(--gold); outline-offset:3px; border-radius:10px; }
.ltr { direction:ltr; unicode-bidi:isolate; display:inline-block; }
.mono { font-family:var(--mono); direction:ltr; unicode-bidi:isolate; display:inline-block; letter-spacing:.02em; }

/* ---- layout ---- */
.wrap { max-width:1180px; margin:0 auto; padding:0 20px 120px; }
.stack { display:flex; flex-direction:column; }
.row { display:flex; align-items:center; gap:12px; }
.row.wrap-r { flex-wrap:wrap; }
.spread { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; }
.grid { display:grid; gap:18px; }
.g2 { grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); }
.g3 { grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); }
.g4 { grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); }
.grow { flex:1 1 auto; min-width:0; }

/* ---- surfaces ---- */
.card {
  background:linear-gradient(180deg, rgba(255,255,255,.058), rgba(255,255,255,.022));
  border:1px solid var(--stroke); border-radius:var(--r);
  box-shadow:0 20px 46px rgba(2,6,23,.5), inset 0 1px 0 rgba(255,255,255,.06);
  backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px);
  padding:22px;
}
.card.tight { padding:16px; }
.card.flat { box-shadow:none; background:var(--glass); }
.panel { background:rgba(7,11,26,.55); border:1px solid var(--stroke); border-radius:var(--r-sm); padding:14px 16px; }
.hr { height:1px; background:var(--stroke); border:0; margin:18px 0; }

/* ---- type ---- */
.h1 { font-size:clamp(30px,5.2vw,54px); font-weight:800; line-height:1.25; letter-spacing:-.01em; margin:0; }
.h2 { font-size:clamp(21px,2.6vw,28px); font-weight:700; line-height:1.4; margin:0; }
.h3 { font-size:17px; font-weight:700; margin:0; }
.lead { font-size:clamp(15px,1.7vw,18px); color:var(--muted); margin:0; max-width:62ch; }
.muted { color:var(--muted); }
.dim { color:var(--dim); }
.small { font-size:13px; }
.xs { font-size:11.5px; }
.num { font-family:var(--mono); direction:ltr; unicode-bidi:isolate; display:inline-block; font-weight:700; font-variant-numeric:tabular-nums; }

/* ---- buttons ---- */
.btn {
  display:inline-flex; align-items:center; justify-content:center; gap:9px;
  border:1px solid var(--stroke2); background:var(--glass2); color:var(--text);
  padding:11px 18px; border-radius:14px; font-size:14.5px; font-weight:600; cursor:pointer;
  transition:transform .14s ease, background .18s ease, border-color .18s ease, box-shadow .18s ease;
}
.btn:hover:not(:disabled) { background:rgba(255,255,255,.12); border-color:rgba(255,255,255,.3); }
.btn:active:not(:disabled) { transform:translateY(1px) scale(.99); }
.btn:disabled { opacity:.38; cursor:not-allowed; }
.btn-primary { background:linear-gradient(135deg,#8B7BFF,#5B7CFF); border-color:transparent; color:#fff; box-shadow:0 12px 30px rgba(103,106,255,.35); }
.btn-primary:hover:not(:disabled) { background:linear-gradient(135deg,#9A8CFF,#6C8BFF); box-shadow:0 16px 38px rgba(103,106,255,.45); }
.btn-gold { background:linear-gradient(135deg,#FFD166,#FFA24B); border-color:transparent; color:#2A1A00; box-shadow:0 12px 30px rgba(255,180,80,.3); }
.btn-ghost { background:transparent; border-color:var(--stroke); }
.btn-lg { padding:15px 28px; font-size:16.5px; border-radius:16px; }
.btn-sm { padding:8px 13px; font-size:13px; border-radius:11px; }
.btn-icon { padding:10px; border-radius:12px; }

/* ---- pills / chips ---- */
.pill { display:inline-flex; align-items:center; gap:7px; padding:5px 12px; border-radius:999px; font-size:12.5px; font-weight:600;
  background:var(--glass); border:1px solid var(--stroke); }
.chip { display:inline-flex; align-items:center; gap:8px; padding:8px 13px; border-radius:12px; background:var(--glass2);
  border:1px solid var(--stroke); font-size:13.5px; }

/* ---- progress ---- */
.bar { height:8px; border-radius:99px; background:rgba(255,255,255,.09); overflow:hidden; }
.bar > i { display:block; height:100%; border-radius:99px; background:linear-gradient(90deg,#8B7BFF,#4FA8FF);
  transition:width .7s cubic-bezier(.22,1,.36,1); }
.bar.gold > i { background:linear-gradient(90deg,#FFD166,#FFA24B); }

/* ---- header ---- */
.hdr { position:sticky; top:0; z-index:40; backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px);
  background:linear-gradient(180deg, rgba(7,11,26,.92), rgba(7,11,26,.68)); border-bottom:1px solid var(--stroke); }
.hdr-in { max-width:1180px; margin:0 auto; padding:11px 20px; display:flex; align-items:center; gap:14px; }
.brand { display:flex; align-items:center; gap:10px; cursor:pointer; background:none; border:0; padding:0; }
.brand b { font-size:20px; letter-spacing:.22em; font-weight:800; font-family:var(--mono); }
.xprail { min-width:190px; flex:0 1 260px; }

/* ---- world tiles ---- */
.tile { position:relative; overflow:hidden; text-align:right; cursor:pointer; border:1px solid var(--stroke);
  border-radius:var(--r); padding:20px; background:linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.02));
  transition:transform .2s cubic-bezier(.22,1,.36,1), border-color .2s, box-shadow .2s; display:block; width:100%; }
.tile:hover:not(.locked) { transform:translateY(-4px); border-color:var(--tint); box-shadow:0 26px 60px rgba(2,6,23,.55); }
.tile:active:not(.locked) { transform:translateY(-1px); }
.tile.locked { cursor:not-allowed; opacity:.55; }
.tile .glowdot { position:absolute; inset-inline-start:-60px; top:-70px; width:190px; height:190px; border-radius:50%;
  background:var(--tint); filter:blur(58px); opacity:.34; pointer-events:none; }
.tile .ico { width:46px; height:46px; border-radius:14px; display:grid; place-items:center;
  background:color-mix(in srgb, var(--tint) 22%, transparent); border:1px solid color-mix(in srgb, var(--tint) 45%, transparent); color:var(--tint); }

/* ---- machine / game visuals ---- */
.stage { border:1px solid var(--stroke); border-radius:var(--r); padding:20px; background:
  radial-gradient(700px 260px at 50% 0%, rgba(255,255,255,.055), transparent 70%), rgba(7,11,26,.42); }
.readout { font-family:var(--mono); direction:ltr; font-weight:800; font-variant-numeric:tabular-nums;
  background:rgba(0,0,0,.34); border:1px solid var(--stroke); border-radius:14px; display:grid; place-items:center; }
.gear { transform-origin:center; }
.spin { animation:spin 1.1s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
.pop { animation:pop .42s cubic-bezier(.2,1.5,.4,1) both; }
@keyframes pop { 0%{transform:scale(.5);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
.rise { animation:rise .42s cubic-bezier(.22,1,.36,1) both; }
@keyframes rise { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
.glowpulse { animation:glowpulse 1.4s ease-in-out 2; }
@keyframes glowpulse { 0%,100%{box-shadow:0 0 0 0 rgba(47,214,166,0)} 50%{box-shadow:0 0 0 12px rgba(47,214,166,.16)} }
.shake { animation:shake .34s ease; }
@keyframes shake { 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
.float { animation:float 5s ease-in-out infinite; }
@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }

/* ---- bubbles (data detective) ---- */
.bub { position:relative; width:54px; height:54px; border-radius:50%; border:1px solid var(--stroke2); cursor:grab;
  display:grid; place-items:center; font-family:var(--mono); font-weight:800; font-size:15px; touch-action:none;
  background:linear-gradient(180deg, rgba(47,214,166,.30), rgba(47,214,166,.10)); color:#DFFFF4; user-select:none;
  transition:transform .18s, box-shadow .18s, background .18s; }
.bub:hover { transform:translateY(-3px); }
.bub.sus { background:linear-gradient(180deg, rgba(255,112,112,.34), rgba(255,112,112,.12)); color:#FFE3E3; }
.bub.dragging { cursor:grabbing; z-index:9; box-shadow:0 18px 40px rgba(0,0,0,.55); transform:scale(1.08); }
.dropzone { border:2px dashed var(--stroke2); border-radius:var(--r-sm); min-height:92px; display:grid; place-items:center;
  transition:background .2s, border-color .2s; }
.dropzone.hot { border-color:var(--bad); background:rgba(255,112,112,.09); }

/* ---- nova ---- */
.nova { position:fixed; inset-inline-start:18px; bottom:18px; z-index:50; max-width:min(340px,calc(100vw - 36px)); }
.nova-b { display:flex; gap:11px; align-items:flex-start; padding:13px 15px; border-radius:18px;
  background:linear-gradient(180deg, rgba(20,27,56,.97), rgba(12,17,40,.97)); border:1px solid var(--stroke2);
  box-shadow:0 22px 50px rgba(0,0,0,.55); animation:novain .34s cubic-bezier(.22,1,.36,1) both; }
@keyframes novain { from{opacity:0;transform:translateY(14px) scale(.96)} to{opacity:1;transform:none} }
.nova-av { width:34px; height:34px; border-radius:11px; flex:0 0 auto; display:grid; place-items:center;
  background:linear-gradient(135deg,#8B7BFF,#4FA8FF); color:#fff; }

/* ---- toasts ---- */
.toasts { position:fixed; top:70px; inset-inline-end:18px; z-index:60; display:flex; flex-direction:column; gap:10px; pointer-events:none; }
.toast { display:flex; align-items:center; gap:10px; padding:11px 15px; border-radius:14px; font-weight:700; font-size:14px;
  border:1px solid var(--stroke2); background:linear-gradient(180deg, rgba(20,27,56,.98), rgba(12,17,40,.98));
  box-shadow:0 18px 44px rgba(0,0,0,.5); animation:toastin .4s cubic-bezier(.2,1.4,.4,1) both; }
@keyframes toastin { from{opacity:0;transform:translateX(-24px) scale(.92)} to{opacity:1;transform:none} }

/* ---- modal ---- */
.ovl { position:fixed; inset:0; z-index:70; background:rgba(4,7,18,.72); backdrop-filter:blur(8px);
  display:grid; place-items:center; padding:18px; animation:fade .2s both; }
@keyframes fade { from{opacity:0} to{opacity:1} }
.modal { width:min(640px,100%); max-height:86vh; overflow:auto; border-radius:26px; padding:26px;
  background:linear-gradient(180deg,#141B38,#0B1026); border:1px solid var(--stroke2);
  box-shadow:0 40px 90px rgba(0,0,0,.65); animation:modalin .34s cubic-bezier(.22,1,.36,1) both; }
@keyframes modalin { from{opacity:0;transform:translateY(22px) scale(.97)} to{opacity:1;transform:none} }

/* ---- math lens layers ---- */
.layer { border:1px solid var(--stroke); border-radius:16px; padding:16px; background:var(--glass); }
.layer + .layer { margin-top:12px; }
.layer .tag { font-size:11.5px; color:var(--dim); font-family:var(--mono); direction:ltr; }
.formula { font-family:var(--mono); direction:ltr; font-size:19px; font-weight:700; padding:15px 18px; border-radius:14px;
  background:rgba(0,0,0,.38); border:1px solid var(--stroke2); text-align:center; color:var(--gold); }

/* ---- skill tree ---- */
.node { display:flex; align-items:center; gap:12px; padding:12px 14px; border-radius:16px; border:1px solid var(--stroke); background:var(--glass); }
.node.mastered { border-color:rgba(255,209,102,.5); background:rgba(255,209,102,.08); }
.node.learning { border-color:rgba(139,123,255,.45); background:rgba(139,123,255,.07); }
.node.locked { opacity:.45; }
.spine { width:2px; height:16px; margin-inline-start:26px; background:var(--stroke2); }

/* ---- misc ---- */
.route-card { cursor:pointer; text-align:right; width:100%; border-radius:var(--r); padding:18px; border:1px solid var(--stroke);
  background:linear-gradient(180deg, rgba(255,255,255,.055), rgba(255,255,255,.02)); transition:transform .18s, border-color .18s; }
.route-card:hover:not(:disabled) { transform:translateY(-3px); border-color:var(--tint); }
.route-card.sel { border-color:var(--tint); box-shadow:0 0 0 1px var(--tint) inset; }
.route-card:disabled { cursor:not-allowed; }
.simbar { height:200px; display:flex; flex-direction:column-reverse; border-radius:12px 12px 0 0; overflow:hidden; background:rgba(255,255,255,.05); }
.simbar > i { display:block; transition:height .35s ease; }
.badge-t { width:64px; height:64px; border-radius:20px; display:grid; place-items:center;
  background:linear-gradient(160deg, rgba(255,209,102,.28), rgba(255,162,75,.12)); border:1px solid rgba(255,209,102,.45); color:var(--gold); }
.badge-t.off { background:rgba(255,255,255,.04); border-color:var(--stroke); color:var(--dim); }
input[type=range].sl { -webkit-appearance:none; appearance:none; width:100%; height:6px; border-radius:99px; background:rgba(255,255,255,.14); outline:none; }
input[type=range].sl::-webkit-slider-thumb { -webkit-appearance:none; width:24px; height:24px; border-radius:50%; cursor:grab;
  background:linear-gradient(135deg,#8B7BFF,#4FA8FF); border:2px solid #0B1026; box-shadow:0 4px 14px rgba(0,0,0,.5); }
input[type=range].sl::-moz-range-thumb { width:22px; height:22px; border-radius:50%; border:2px solid #0B1026;
  background:linear-gradient(135deg,#8B7BFF,#4FA8FF); cursor:grab; }
.dots { position:fixed; inset:0; pointer-events:none; z-index:0; overflow:hidden; }
.dots i { position:absolute; width:3px; height:3px; border-radius:50%; background:rgba(255,255,255,.5); animation:drift linear infinite; }
@keyframes drift { from{transform:translateY(20px);opacity:0} 12%{opacity:.6} 88%{opacity:.6} to{transform:translateY(-110vh);opacity:0} }
.conf { position:fixed; inset:0; pointer-events:none; z-index:65; overflow:hidden; }
.conf i { position:absolute; width:9px; height:14px; border-radius:2px; animation:fall linear forwards; }
@keyframes fall { from{transform:translateY(-12vh) rotate(0)} to{transform:translateY(110vh) rotate(680deg)} }
.steps { display:flex; gap:6px; align-items:center; }
.steps i { height:4px; width:26px; border-radius:99px; background:rgba(255,255,255,.14); }
.steps i.on { background:var(--tint,#8B7BFF); }
.kbd { font-family:var(--mono); font-size:11px; padding:2px 6px; border-radius:6px; border:1px solid var(--stroke2); background:rgba(0,0,0,.3); }

@media (max-width:620px) {
  .wrap { padding:0 14px 110px; }
  .card { padding:17px; }
  .xprail { display:none; }
  .nova { inset-inline-start:10px; bottom:10px; }
}
@media (prefers-reduced-motion: reduce) {
  .ax *, .ax *::before, .ax *::after { animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; }
  .dots, .conf { display:none; }
}
`;

/* ============================ §2 — UTILS ================================= */

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const fmt = (n, d = 0) => Number(n).toFixed(d);
const sum = (a) => a.reduce((x, y) => x + y, 0);
const mean = (a) => (a.length ? sum(a) / a.length : 0);
/* محور خودکار: دامنه و تیک‌های «گرد» را از خود داده می‌سازد تا هیچ نقطه‌ای — حتی دادهٔ پرت — بیرون از کادر نیفتد */
const niceScale = (values, target = 6) => {
  const vs = values.filter((v) => Number.isFinite(v));
  if (!vs.length) return { lo: 0, hi: 1, step: 1, ticks: [0, 1] };
  const min = Math.min(...vs), max = Math.max(...vs);
  const lo0 = min >= 0 && min <= max * 0.5 ? 0 : min - (max - min || 1) * 0.15;
  const raw = Math.max((max - lo0) / target, 1e-6);
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  const step = (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * mag;
  const lo = Math.floor(lo0 / step) * step;
  let hi = Math.ceil(max / step) * step;
  if ((hi - max) / (hi - lo || 1) < 0.04) hi += step;      // نگذار آخرین نقطه بچسبد به لبه
  const ticks = [];
  for (let t = lo; t <= hi + 1e-9; t += step) ticks.push(Math.round(t * 1000) / 1000);
  return { lo, hi, step, ticks };
};

const median = (a) => {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y), m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

function useAnimatedNumber(target, dur = 620) {
  const [v, setV] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    const from = cur.current, to = target, t0 = performance.now();
    let raf;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      cur.current = from + (to - from) * e;
      setV(cur.current);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return v;
}

/** صدا کاملاً اختیاری است و پیش‌فرض خاموش — WebAudio، بدون فایل خارجی. */
const Sfx = {
  ctx: null,
  on: false,
  play(kind) {
    if (!this.on) return;
    try {
      this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const map = { ok: [660, 990], up: [520, 780, 1040], bad: [220, 170], tick: [880] };
      (map[kind] || [700]).forEach((f, i) => {
        const o = this.ctx.createOscillator(), g = this.ctx.createGain();
        o.type = "sine"; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, this.ctx.currentTime + i * 0.08);
        g.gain.exponentialRampToValueAtTime(0.07, this.ctx.currentTime + i * 0.08 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + i * 0.08 + 0.22);
        o.connect(g); g.connect(this.ctx.destination);
        o.start(this.ctx.currentTime + i * 0.08); o.stop(this.ctx.currentTime + i * 0.08 + 0.24);
      });
    } catch (e) { /* صدا اختیاری است؛ خطا نباید بازی را متوقف کند */ }
  },
};

/* ========================== §3 — ANALYTICS =============================== */
/** Event abstraction — الان console، بعداً PostHog/Amplitude با تعویض sink. */
const Analytics = (() => {
  const queue = [];
  const sinks = [
    (e) => { if (typeof console !== "undefined") console.log("%c[AXIOM]", "color:#8B7BFF;font-weight:700", e.name, e.props); },
    // (e) => posthog.capture(e.name, e.props),
  ];
  return {
    track(name, props = {}) {
      const e = { name, props, ts: Date.now() };
      queue.push(e);
      sinks.forEach((s) => { try { s(e); } catch (_) {} });
      if (typeof window !== "undefined") window.__AXIOM_EVENTS__ = queue;
    },
    all: () => queue,
  };
})();
const track = (n, p) => Analytics.track(n, p);

/* =========================== §4 — STORAGE ================================ */
/**
 * درایور نسخه وب: localStorage.
 * Progress کاربر بعد از refresh و بازگشت به سایت در همان مرورگر حفظ می‌شود.
 * بعداً می‌توان همین interface را بدون تغییر بقیهٔ اپ با Supabase جایگزین کرد.
 */
const KEY = "axiom:v1:state";
const Store = {
  async get(key) {
    try {
      if (typeof window === "undefined") return null;
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },
  async set(key, value) {
    try {
      if (typeof window === "undefined") return false;
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  },
  async clear(key) {
    try {
      if (typeof window !== "undefined") window.localStorage.removeItem(key);
    } catch (e) {}
  },
};

/* ============================ §5 — DATA ================================== */

const LEVELS = [
  { level: 1, name: "Explorer", fa: "کاشف", min: 0 },
  { level: 2, name: "Pattern Hunter", fa: "شکارچی الگو", min: 150 },
  { level: 3, name: "Data Detective", fa: "کارآگاه داده", min: 350 },
  { level: 4, name: "Math Architect", fa: "معمار ریاضی", min: 600 },
];
const levelOf = (xp) => [...LEVELS].reverse().find((l) => xp >= l.min) || LEVELS[0];
const nextLevel = (xp) => LEVELS.find((l) => xp < l.min) || null;

const CONCEPTS = [
  { id: "pattern",  fa: "الگو",        en: "Pattern",        world: "patterns",    parent: null,        desc: "قانونی که پشت یک دنبالهٔ تکرارشونده پنهان است." },
  { id: "function", fa: "تابع",        en: "Function",       world: "patterns",    parent: "pattern",   desc: "ماشینی که هر ورودی را طبق یک قانون ثابت به یک خروجی تبدیل می‌کند." },
  { id: "prob",     fa: "احتمال",      en: "Probability",    world: "probability", parent: null,        desc: "شانس رخ دادن یک نتیجه، بین ۰ تا ۱." },
  { id: "ev",       fa: "امید ریاضی",  en: "Expected Value", world: "probability", parent: "prob",      desc: "میانگین نتیجه‌ای که در بلندمدت انتظارش را داریم." },
  { id: "mean",     fa: "میانگین",     en: "Mean",           world: "statistics",  parent: null,        desc: "حاصل جمع داده‌ها تقسیم بر تعدادشان." },
  { id: "median",   fa: "میانه",       en: "Median",         world: "statistics",  parent: "mean",      desc: "عدد وسط داده‌ها وقتی مرتب شوند." },
  { id: "outlier",  fa: "دادهٔ پرت",   en: "Outlier",        world: "statistics",  parent: "median",    desc: "دادهٔ غیرعادی که می‌تواند تصویر کل را عوض کند." },
  { id: "vector",   fa: "بردار",       en: "Vector",         world: "vectors",     parent: null,        desc: "چیزی که هم اندازه دارد هم جهت." },
  { id: "mag",      fa: "اندازه",      en: "Magnitude",      world: "vectors",     parent: "vector",    desc: "طول بردار؛ یعنی در مجموع چقدر جابه‌جا شده‌ایم." },
];
const conceptById = (id) => CONCEPTS.find((c) => c.id === id);

const WORLDS = [
  { id: "patterns",    route: "/world/patterns",    name: "Pattern Valley", fa: "درهٔ الگو",         tagline: "کارخانه‌ای که با یک قانون پنهان کار می‌کند", icon: Cpu,        tint: "var(--p)", order: 1, missionId: "m_pattern", concepts: ["pattern", "function"] },
  { id: "probability", route: "/world/probability", name: "Chance Harbor",  fa: "بندر شانس",         tagline: "یک محموله، سه مسیر، یک تصمیم",              icon: Package,    tint: "var(--c)", order: 2, missionId: "m_risk",    concepts: ["prob", "ev"] },
  { id: "statistics",  route: "/world/statistics",  name: "Data City",      fa: "شهر داده",          tagline: "یک ادعای مشکوک و ده مشتری",                 icon: Search,     tint: "var(--d)", order: 3, missionId: "m_data",    concepts: ["mean", "median", "outlier"] },
  { id: "vectors",     route: "/world/vectors",     name: "Vector Lab",     fa: "آزمایشگاه بردار",   tagline: "ربات، شبکه، و جهت درست",                    icon: Navigation, tint: "var(--v)", order: 4, missionId: "m_vector",  concepts: ["vector", "mag"] },
];
const worldById = (id) => WORLDS.find((w) => w.id === id);

const MISSIONS = {
  m_pattern: {
    id: "m_pattern", worldId: "patterns", name: "ماشین الگو", en: "Pattern Machine",
    brief: "ماشین M-01 عدد می‌گیرد و عدد دیگری پس می‌دهد. قانونش را کشف کن.",
    conceptIds: ["pattern", "function"], xp: 100, badge: "pattern_finder",
    hints: [
      "خروجی‌ها را کنار هم بگذار. وقتی ورودی یکی زیاد می‌شود، خروجی چقدر زیاد می‌شود؟",
      "هر بار ورودی ۱ واحد بیشتر شود، خروجی ۲ واحد بیشتر می‌شود. پس جایی ضرب در ۲ وجود دارد. حالا ببین چقدر اضافه می‌شود.",
    ],
    demo: "بگذار خودم یک چیزی نشانت بدهم: ورودی ۰ را امتحان می‌کنم.",
  },
  m_risk: {
    id: "m_risk", worldId: "probability", name: "تحویل پرخطر", en: "Risky Delivery",
    brief: "یک کریستال باید به مقصد برسد. سه مسیر داری و هرکدام شانس و پاداش متفاوتی دارند.",
    conceptIds: ["prob", "ev"], xp: 100, badge: "risk_taker",
    hints: [
      "فقط به درصد موفقیت نگاه نکن. پاداش هر مسیر هم فرق می‌کند.",
      "برای هر مسیر حساب کن: از هر ۱۰ تحویل چندتا موفق می‌شود و هر موفقیت چقدر می‌ارزد.",
    ],
    demo: "بگذار ۱۰۰ بار هر سه مسیر را اجرا کنم و میانگین سکه‌ها را کنار هم بگذارم.",
  },
  m_data: {
    id: "m_data", worldId: "statistics", name: "کارآگاه داده", en: "Data Detective",
    brief: "فروشگاه می‌گوید مشتری‌ها به‌طور متوسط ۵ دقیقه منتظر می‌مانند. دادهٔ ده مشتری را بررسی کن.",
    conceptIds: ["mean", "median", "outlier"], xp: 100, badge: "data_detective",
    hints: [
      "به فاصلهٔ عددها روی خط نگاه کن. کدام از بقیه خیلی دور افتاده؟",
      "یک عدد خیلی بزرگ، مجموع را بالا می‌برد و چون بر ۱۰ تقسیم می‌شود، میانگین را می‌کشد بالا.",
    ],
    demo: "من عدد مشکوک را کنار می‌گذارم تا ببینی میانگین چه می‌کند.",
  },
  m_vector: {
    id: "m_vector", worldId: "vectors", name: "ناوبر بردار", en: "Vector Navigator",
    brief: "ربات باید به کریستال برسد. مسیر را با فلش‌ها بساز.",
    conceptIds: ["vector", "mag"], xp: 100, badge: "vector_pilot",
    hints: [
      "بشمار: از ربات تا کریستال چند خانه به راست و چند خانه به بالا فاصله است؟",
      "۳ خانه راست و ۲ خانه بالا لازم داری. ترتیب فلش‌ها مهم نیست، تعدادشان مهم است.",
    ],
    demo: "خودم مسیر را می‌سازم؛ نگاه کن چند فلش در هر جهت لازم است.",
  },
};
const missionList = Object.values(MISSIONS);

const LENSES = {
  m_pattern: {
    tint: "var(--p)", concept: "function",
    l1: "ماشین هیچ‌وقت تصادفی رفتار نکرد. هر عددی دادی، همان کار ثابت رویش انجام شد: دو برابر شد و یکی به آن اضافه شد. برای همین توانستی خروجی عددی را که هرگز امتحان نکرده بودی، درست حدس بزنی.",
    l2name: "تابع (Function)",
    l2: "به هر قانون ثابتی که هر ورودی را به دقیقاً یک خروجی وصل می‌کند، تابع می‌گویند. عددی که وارد می‌کنی متغیر (Variable) است و قانون، همان چیزی است که کشف کردی.",
    formula: "f(x) = 2x + 1",
    fnote: "x همان ورودی توست و f(x) خروجی ماشین.",
  },
  m_risk: {
    tint: "var(--c)", concept: "ev",
    l1: "یک تحویل چیزی را ثابت نمی‌کند؛ ممکن است در مسیر ۳۰٪ برنده شوی و در مسیر ۹۰٪ ببازی. اما وقتی ۱۰۰ بار اجرا کردی، عددها آرام گرفتند و هر مسیر به یک میانگین مشخص نزدیک شد.",
    l2name: "امید ریاضی (Expected Value)",
    l2: "برای مقایسهٔ تصمیم‌ها، شانس موفقیت را در ارزش آن نتیجه ضرب می‌کنیم. این عدد می‌گوید در بلندمدت به‌طور متوسط چه چیزی گیرت می‌آید — نه اینکه دفعهٔ بعد چه می‌شود.",
    formula: "EV = P(success) × Reward",
    fnote: "A: 0.9×30 = 27  |  B: 0.6×60 = 36  |  C: 0.3×120 = 36",
  },
  m_data: {
    tint: "var(--d)", concept: "outlier",
    l1: "نُه مشتری بین ۳ تا ۷ دقیقه منتظر ماندند و یک نفر ۲۵ دقیقه. همان یک نفر کافی بود تا میانگین از ۵ به ۷ بپرد؛ ولی عدد وسط داده‌ها اصلاً تکان نخورد.",
    l2name: "میانگین، میانه و دادهٔ پرت",
    l2: "میانگین همهٔ عددها را با هم جمع می‌کند، پس یک عدد خیلی بزرگ آن را جابه‌جا می‌کند. میانه فقط به ترتیب داده‌ها نگاه می‌کند و در برابر دادهٔ پرت مقاوم است. ادعای فروشگاه با میانه درست بود و با میانگین نه.",
    formula: "Mean = Σx / n     Median = middle value",
    fnote: "با دادهٔ پرت: Mean = 7.0 و Median = 5   |   بدون آن: Mean = 5.0 و Median = 5",
  },
  m_vector: {
    tint: "var(--v)", concept: "vector",
    l1: "ترتیب فلش‌ها را که عوض کردی، ربات باز هم همان‌جا رسید. چیزی که سرنوشت ربات را تعیین کرد، فقط دو عدد بود: چند خانه به راست و چند خانه به بالا.",
    l2name: "بردار (Vector)",
    l2: "بردار یعنی جابه‌جایی با جهت. دو مؤلفه دارد: حرکت افقی و حرکت عمودی. طول پاره‌خطی که از مبدأ تا مقصد کشیده می‌شود، اندازهٔ (Magnitude) بردار است.",
    formula: "v = (3, 2)      |v| = √(x² + y²)",
    fnote: "برای بردار (4, 3) اندازه دقیقاً ۵ می‌شود.",
  },
};

const BADGES = [
  { id: "pattern_finder", fa: "کاشف الگو",   en: "Pattern Finder", icon: Cpu,        how: "ماشین الگو را حل کن" },
  { id: "risk_taker",     fa: "ریسک‌پذیر",   en: "Risk Taker",     icon: Package,    how: "تحویل پرخطر را حل کن" },
  { id: "data_detective", fa: "کارآگاه داده", en: "Data Detective", icon: Search,     how: "دادهٔ پرت را پیدا کن" },
  { id: "vector_pilot",   fa: "خلبان بردار", en: "Vector Pilot",   icon: Navigation, how: "ربات را به کریستال برسان" },
  { id: "world_solver",   fa: "نجات‌دهندهٔ شهر", en: "World Solver", icon: Trophy,   how: "شهر خراب را تعمیر کن" },
];

const AVATARS = [
  { id: "orb",  fa: "اُرب",  g: "linear-gradient(135deg,#8B7BFF,#4FA8FF)" },
  { id: "lumi", fa: "لومی",  g: "linear-gradient(135deg,#2FD6A6,#4FA8FF)" },
  { id: "vex",  fa: "وکس",   g: "linear-gradient(135deg,#FFA24B,#FF7070)" },
  { id: "axo",  fa: "اکسو",  g: "linear-gradient(135deg,#FFD166,#2FD6A6)" },
];
const INTERESTS = [
  { id: "game", fa: "بازی" }, { id: "business", fa: "کسب‌وکار" }, { id: "data", fa: "داده" },
  { id: "ai", fa: "هوش مصنوعی" }, { id: "science", fa: "علم" },
];
const CONFIDENCE = [
  { id: "none", fa: "اصلاً" }, { id: "little", fa: "کمی" }, { id: "good", fa: "خوب" }, { id: "great", fa: "خیلی خوب" },
];

const COMING_SOON = [
  { fa: "قلمرو حسابان", en: "Calculus Realm" },
  { fa: "شهر ماتریس", en: "Matrix City" },
  { fa: "آزمایشگاه بهینه‌سازی", en: "Optimization Lab" },
  { fa: "میدان یادگیری ماشین", en: "Machine Learning Arena" },
  { fa: "هستهٔ AI", en: "AI Core" },
];

/* ---- NOVA: موتور پیام، فعلاً scripted. بعداً provider را با LLM عوض کنید. ---- */
const NOVA_SCRIPT = {
  welcome: "سلام. من نُوا هستم. جواب‌ها را بهت نمی‌گویم — فقط کنارت هستم تا خودت پیدایشان کنی.",
  pm_intro: "قبل از هر چیز یک عدد بده به ماشین و ببین چه پس می‌دهد.",
  pm_more: "یکی دو عدد دیگر هم امتحان کن. با یک آزمایش نمی‌شود قانون را فهمید.",
  pm_predict: "حالا قبل از فشار دادن دکمه، حدس بزن. حدس زدن بخشی از کشف است.",
  pm_wrong: "نزدیک بود. به فاصلهٔ بین خروجی‌ها نگاه کن.",
  pm_right: "دقیقاً. تو قانون را از روی رفتار ماشین بیرون کشیدی.",
  rd_intro: "قبل از انتخاب، یک حدس بزن: کدام مسیر در بلندمدت بیشتر می‌ارزد؟",
  rd_single: "یک بار نتیجه گرفتن همیشه حقیقت را نشان نمی‌دهد. دوباره امتحانش کنیم؟",
  rd_batch: "حالا تعداد را ببر بالا. عددها وقتی زیاد شوند، آرام می‌گیرند.",
  rd_compare: "به میانگین سکه در هر تحویل نگاه کن، نه به درصد موفقیت.",
  dd_intro: "ده مشتری داریم. یکی از این عددها با بقیه جور نیست.",
  dd_suspect: "به عدد ۲۵ دقت کردی؟",
  dd_predict: "قبل از کنار گذاشتنش حدس بزن میانگین کجا می‌رود.",
  dd_after: "میانگین جابه‌جا شد، اما میانه سر جایش ماند. چرا؟",
  vn_intro: "فاصلهٔ ربات تا کریستال را بشمار؛ بعد فلش بگذار.",
  vn_predict: "قبل از اجرا، خانه‌ای را که فکر می‌کنی ربات آنجا می‌ایستد انتخاب کن.",
  vn_wall: "به دیوار خورد. مسیر را کوتاه‌تر کن.",
  vn_right: "رسید. حالا ترتیب فلش‌ها را عوض کن و ببین باز هم همان‌جا می‌رسد یا نه.",
  vn_slider: "فکر می‌کنی اگر جهت را عوض کنی چه می‌شود؟ با دو عدد، ربات را ببر روی کریستال.",
  final_intro: "شهر خاموش است. چیزی یاد نمی‌گیری که بلد نباشی — فقط از همان‌ها استفاده کن.",
  lens_ready: "حالا می‌توانی «ذره‌بین ریاضی» را باز کنی.",
};
const NovaProviders = {
  scripted: { id: "scripted", async getMessage({ key, fallback }) { return NOVA_SCRIPT[key] ?? fallback ?? null; } },
  // llm: { id:'llm', async getMessage(ctx){ const r = await fetch('/api/nova',{method:'POST',body:JSON.stringify(ctx)}); return (await r.json()).text; } },
};
let novaProvider = NovaProviders.scripted;

/* ====================== §6 — STATE / HOOKS =============================== */

const initialState = {
  hydrated: false,
  route: "/",
  onboarded: false,
  profile: { id: null, name: "کاشف", avatar: "orb", mathConfidence: null, interest: null },
  xp: 0,
  progress: {},           // missionId -> {completed, attempts, hintsUsed, score, pct, perfect}
  concepts: {},           // conceptId -> mastery 0..100
  badges: [],
  lenses: [],             // missionIds با lens باز شده
  finalDone: false,
  settings: { sound: false },
};

function reducer(state, a) {
  switch (a.type) {
    case "HYDRATE": return { ...state, ...a.payload, hydrated: true };
    case "NAV": return { ...state, route: a.route };
    case "PROFILE": return { ...state, profile: { ...state.profile, ...a.patch } };
    case "ONBOARDED": return { ...state, onboarded: true, profile: { ...state.profile, id: state.profile.id || "guest_" + Date.now() } };
    case "MISSION_PROGRESS": {
      const p = state.progress[a.missionId] || { completed: false, attempts: 0, hintsUsed: 0, score: 0, pct: 0 };
      return { ...state, progress: { ...state.progress, [a.missionId]: { ...p, pct: Math.max(p.pct, a.pct) } } };
    }
    case "ATTEMPT": {
      const p = state.progress[a.missionId] || { completed: false, attempts: 0, hintsUsed: 0, score: 0, pct: 0 };
      return { ...state, progress: { ...state.progress, [a.missionId]: { ...p, attempts: p.attempts + 1 } } };
    }
    case "HINT": {
      const p = state.progress[a.missionId] || { completed: false, attempts: 0, hintsUsed: 0, score: 0, pct: 0 };
      return { ...state, progress: { ...state.progress, [a.missionId]: { ...p, hintsUsed: Math.max(p.hintsUsed, a.level) } } };
    }
    case "LENS": return state.lenses.includes(a.missionId) ? state : { ...state, lenses: [...state.lenses, a.missionId] };
    case "COMPLETE_MISSION": {
      const p = state.progress[a.missionId] || { completed: false, attempts: 0, hintsUsed: 0, score: 0, pct: 0 };
      const m = MISSIONS[a.missionId];
      const cm = { ...state.concepts };
      const gained = p.hintsUsed === 0 ? 80 : 50;
      m.conceptIds.forEach((c) => { cm[c] = Math.max(cm[c] || 0, gained); });
      return {
        ...state,
        xp: state.xp + a.xp,
        badges: state.badges.includes(m.badge) ? state.badges : [...state.badges, m.badge],
        concepts: cm,
        progress: { ...state.progress, [a.missionId]: { ...p, completed: true, pct: 100, score: a.xp, perfect: !!a.perfect } },
      };
    }
    case "COMPLETE_FINAL": {
      const cm = { ...state.concepts };
      CONCEPTS.forEach((c) => { cm[c.id] = 100; });
      return {
        ...state, finalDone: true, xp: state.xp + a.xp, concepts: cm,
        badges: state.badges.includes("world_solver") ? state.badges : [...state.badges, "world_solver"],
      };
    }
    case "SOUND": { Sfx.on = a.on; return { ...state, settings: { ...state.settings, sound: a.on } }; }
    case "RESET": return { ...initialState, hydrated: true, route: "/" };
    default: return state;
  }
}

const Ctx = createContext(null);
const useGame = () => useContext(Ctx);

/* وضعیت باز/قفل بودن دنیاها — قانون: به‌ترتیب */
function worldStatus(state, worldId) {
  const w = worldById(worldId);
  if (w.order === 1) return "open";
  const prev = WORLDS.find((x) => x.order === w.order - 1);
  return state.progress[prev.missionId]?.completed ? "open" : "locked";
}
const allWorldsDone = (s) => WORLDS.every((w) => s.progress[w.missionId]?.completed);

/* ========================= §7 — UI PRIMITIVES ============================ */

function Btn({ as = "button", variant = "", size = "", icon: Icon, children, ...rest }) {
  const C = as;
  return (
    <C className={`btn ${variant} ${size}`} {...rest}>
      {Icon && <Icon size={17} strokeWidth={2.2} />}
      {children}
    </C>
  );
}

function ProgressBar({ value, gold }) {
  return <div className={`bar ${gold ? "gold" : ""}`}><i style={{ width: `${clamp(value, 0, 100)}%` }} /></div>;
}

function Modal({ onClose, children, label }) {
  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="ovl" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={label}>{children}</div>
    </div>
  );
}

function Particles() {
  const dots = useMemo(
    () => Array.from({ length: 16 }, (_, i) => ({
      left: `${(i * 6.4 + 4) % 100}%`, dur: `${16 + (i % 7) * 4}s`, delay: `${-i * 2.1}s`, op: 0.25 + (i % 4) * 0.12,
    })), []);
  return (
    <div className="dots" aria-hidden="true">
      {dots.map((d, i) => (
        <i key={i} style={{ left: d.left, bottom: "-10px", animationDuration: d.dur, animationDelay: d.delay, opacity: d.op }} />
      ))}
    </div>
  );
}

function Confetti({ n = 34 }) {
  const bits = useMemo(
    () => Array.from({ length: n }, (_, i) => ({
      left: `${(i * 97) % 100}%`, delay: `${(i % 10) * 0.14}s`, dur: `${2.4 + (i % 5) * 0.45}s`,
      bg: ["#FFD166", "#8B7BFF", "#2FD6A6", "#4FA8FF", "#FFA24B"][i % 5],
    })), [n]);
  return <div className="conf" aria-hidden="true">{bits.map((b, i) => (
    <i key={i} style={{ left: b.left, background: b.bg, animationDelay: b.delay, animationDuration: b.dur }} />
  ))}</div>;
}

function Toasts({ items }) {
  return (
    <div className="toasts" aria-live="polite">
      {items.map((t) => (
        <div className="toast" key={t.id} style={{ borderColor: t.tint || "var(--stroke2)" }}>
          {t.icon ? <t.icon size={18} color={t.tint || "var(--gold)"} /> : <Zap size={18} color="var(--gold)" />}
          <span>{t.text}</span>
        </div>
      ))}
    </div>
  );
}

/** عنوان بخش — بدون eyebrow و بدون all-caps */
function Section({ title, note, children, action }) {
  return (
    <section style={{ marginTop: 34 }}>
      <div className="spread" style={{ marginBottom: 14 }}>
        <div>
          <h2 className="h2">{title}</h2>
          {note && <p className="muted small" style={{ margin: "4px 0 0" }}>{note}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/* =========================== §8 — NOVA =================================== */

function NovaDock({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div className="nova">
      <div className="nova-b" key={msg.id}>
        <div className="nova-av float"><Bot size={19} /></div>
        <div className="grow">
          <div className="xs dim" style={{ marginBottom: 2 }}>نُوا</div>
          <div style={{ fontSize: 14, lineHeight: 1.7 }}>{msg.text}</div>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="بستن پیام نُوا" style={{ padding: 6 }}>
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

/* ========================= §9 — MATH LENS ================================ */

function MathLensModal({ missionId, onClose }) {
  const L = LENSES[missionId];
  const [openFormula, setOpenFormula] = useState(false);
  const m = MISSIONS[missionId];
  useEffect(() => { track("math_lens_opened", { missionId, concept: L.concept }); }, [missionId, L.concept]);
  return (
    <Modal onClose={onClose} label="ذره‌بین ریاضی">
      <div className="spread" style={{ marginBottom: 16 }}>
        <div className="row">
          <div className="tile-ico" style={{
            width: 42, height: 42, borderRadius: 13, display: "grid", placeItems: "center",
            background: `color-mix(in srgb, ${L.tint} 22%, transparent)`, border: `1px solid color-mix(in srgb, ${L.tint} 45%, transparent)`, color: L.tint,
          }}><Eye size={20} /></div>
          <div>
            <div className="h3">ذره‌بین ریاضی</div>
            <div className="xs dim">{m.name}</div>
          </div>
        </div>
        <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="بستن"><X size={16} /></button>
      </div>

      <div className="layer">
        <div className="tag">Layer 1 — What happened?</div>
        <div className="h3" style={{ margin: "6px 0 8px" }}>چه اتفاقی افتاد؟</div>
        <p className="muted" style={{ margin: 0, fontSize: 14.5 }}>{L.l1}</p>
      </div>

      <div className="layer">
        <div className="tag">Layer 2 — The Math</div>
        <div className="h3" style={{ margin: "6px 0 8px", color: L.tint }}>{L.l2name}</div>
        <p className="muted" style={{ margin: 0, fontSize: 14.5 }}>{L.l2}</p>
      </div>

      <div className="layer">
        <div className="tag">Layer 3 — Formula</div>
        <div className="spread" style={{ marginTop: 6 }}>
          <div className="h3">فرمول رسمی</div>
          <Btn size="btn-sm" variant="btn-ghost" icon={openFormula ? ChevronDown : Plus}
            onClick={() => { const nv = !openFormula; setOpenFormula(nv); if (nv) track("formula_viewed", { missionId }); }}>
            {openFormula ? "بستن" : "نمایش فرمول"}
          </Btn>
        </div>
        {!openFormula && <p className="dim small" style={{ margin: "8px 0 0" }}>دیدن فرمول اختیاری است. مفهوم را بدون آن هم فهمیده‌ای.</p>}
        {openFormula && (
          <div className="rise" style={{ marginTop: 12 }}>
            <div className="formula">{L.formula}</div>
            <p className="dim small mono" style={{ margin: "10px 0 0", textAlign: "center", width: "100%" }}>{L.fnote}</p>
          </div>
        )}
      </div>

      <div className="row" style={{ marginTop: 18, justifyContent: "flex-end" }}>
        <Btn variant="btn-primary" onClick={onClose} icon={Check}>فهمیدم</Btn>
      </div>
    </Modal>
  );
}

/* ======================= §10 — GAME COMPONENTS =========================== */

/* ---- 10.0 قطعات مشترک بین بازی‌ها و چالش نهایی ---- */

function HintPanel({ level, mission, onDemo }) {
  if (!level) return null;
  const text = level >= 3 ? mission.demo : mission.hints[level - 1];
  return (
    <div className="panel rise" style={{ borderColor: "rgba(255,209,102,.4)", background: "rgba(255,209,102,.07)" }}>
      <div className="row" style={{ alignItems: "flex-start" }}>
        <Lightbulb size={17} color="var(--gold)" style={{ flex: "0 0 auto", marginTop: 3 }} />
        <div className="grow">
          <div className="xs dim">{level >= 3 ? "نُوا نشانت می‌دهد" : `راهنمای ${level}`}</div>
          <div style={{ fontSize: 14 }}>{text}</div>
        </div>
        {level >= 3 && onDemo && <Btn size="btn-sm" variant="btn-ghost" icon={Play} onClick={onDemo}>نشانم بده</Btn>}
      </div>
    </div>
  );
}

function useAdaptiveHint(missionId, attempts) {
  const { dispatch } = useGame();
  const level = attempts >= 4 ? 3 : attempts >= 3 ? 2 : attempts >= 2 ? 1 : 0;
  useEffect(() => {
    if (level > 0) { dispatch({ type: "HINT", missionId, level }); track("hint_used", { missionId, level }); }
  }, [level, missionId, dispatch]);
  return level;
}

function Steps({ total, at, tint }) {
  return (
    <div className="steps" style={{ "--tint": tint }} aria-label={`مرحله ${at} از ${total}`}>
      {Array.from({ length: total }, (_, i) => <i key={i} className={i < at ? "on" : ""} />)}
    </div>
  );
}

/* ماشین — ورودی سمت راست، خروجی سمت چپ (جهت خواندن فارسی) */
function MachineCore({ label, input, output, running, tint = "var(--p)" }) {
  return (
    <div className="row" style={{ justifyContent: "center", gap: 0, flexWrap: "wrap" }}>
      <div className="stack" style={{ alignItems: "center", gap: 8 }}>
        <div className="xs dim">ورودی</div>
        <div className="readout" style={{ width: 84, height: 84, fontSize: 30, color: tint }}>{input}</div>
      </div>
      <div style={{ width: 46, height: 3, background: `linear-gradient(90deg, transparent, ${tint})`, opacity: running ? 1 : 0.35, transition: "opacity .3s" }} />
      <div style={{
        width: 156, height: 132, borderRadius: 24, display: "grid", placeItems: "center", position: "relative",
        background: `linear-gradient(180deg, color-mix(in srgb, ${tint} 18%, transparent), rgba(255,255,255,.03))`,
        border: `1px solid color-mix(in srgb, ${tint} 40%, transparent)`,
        boxShadow: running ? `0 0 42px color-mix(in srgb, ${tint} 35%, transparent)` : "none", transition: "box-shadow .35s",
      }}>
        <div className="row" style={{ gap: 4 }}>
          <Settings size={34} color={tint} className={running ? "spin" : ""} strokeWidth={1.7} />
          <Settings size={22} color={tint} className={running ? "spin" : ""} strokeWidth={1.7} style={{ opacity: .65, animationDirection: "reverse" }} />
        </div>
        <div className="mono xs dim" style={{ position: "absolute", bottom: 10 }}>{label}</div>
      </div>
      <div style={{ width: 46, height: 3, background: `linear-gradient(90deg, ${tint}, transparent)`, opacity: output !== null && !running ? 1 : 0.35, transition: "opacity .3s" }} />
      <div className="stack" style={{ alignItems: "center", gap: 8 }}>
        <div className="xs dim">خروجی</div>
        <div className={`readout ${output !== null && !running ? "pop" : ""}`} key={output} style={{ width: 84, height: 84, fontSize: 30, color: "var(--gold)" }}>
          {running ? "…" : output === null ? "?" : output}
        </div>
      </div>
    </div>
  );
}

function NumberDial({ value, setValue, min = 0, max = 20, disabled }) {
  return (
    <div className="row" style={{ gap: 10 }}>
      <button className="btn btn-icon" onClick={() => setValue(clamp(value - 1, min, max))} disabled={disabled || value <= min} aria-label="کم کردن"><Minus size={16} /></button>
      <input className="sl grow" type="range" min={min} max={max} step={1} value={value} disabled={disabled}
        onChange={(e) => setValue(Number(e.target.value))} aria-label="انتخاب عدد ورودی" />
      <button className="btn btn-icon" onClick={() => setValue(clamp(value + 1, min, max))} disabled={disabled || value >= max} aria-label="زیاد کردن"><Plus size={16} /></button>
    </div>
  );
}

/* حباب‌های داده با درگ واقعی + کلیک + کیبورد */
function DataBubbles({
  values, removed, onToggle, inspected, onInspect,
  showZone = true, marked = null, meanV = null, medianV = null, showStats = false,
  caption = "دقیقهٔ انتظار — هر دایره یک مشتری",
  labelOf = (v, i) => `مشتری شمارهٔ ${i + 1}، ${v} دقیقه انتظار`,
}) {
  const plotRef = useRef(null);
  const zoneRef = useRef(null);
  const dragRef = useRef(null);
  const [drag, setDrag] = useState(null);
  const [hot, setHot] = useState(false);

  const down = (e, i) => {
    if (removed.includes(i)) return;
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    dragRef.current = { i, sx: e.clientX, sy: e.clientY, dx: 0, dy: 0, moved: false };
    setDrag(dragRef.current);
    onInspect && onInspect(i);
  };
  const move = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.sx, dy = e.clientY - d.sy;
    dragRef.current = { ...d, dx, dy, moved: Math.hypot(dx, dy) > 7 };
    setDrag(dragRef.current);
    const r = zoneRef.current?.getBoundingClientRect();
    setHot(!!r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom);
  };
  const up = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const r = zoneRef.current?.getBoundingClientRect();
    const inside = !!r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!d.moved || inside) onToggle(d.i);
    dragRef.current = null; setDrag(null); setHot(false);
  };

  /* عرض واقعی نمودار را اندازه می‌گیریم تا چیدمان با هر داده و هر اندازهٔ صفحه درست بماند */
  const [W, setW] = useState(560);
  useLayoutEffect(() => {
    const el = plotRef.current;
    if (!el) return;
    const read = () => setW(Math.max(220, el.clientWidth || 560));
    read();
    if (typeof ResizeObserver !== "undefined") { const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect(); }
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  const key = values.join(",");
  const { lo, hi, ticks } = useMemo(() => niceScale(values), [key]);
  const R = Math.round(clamp(W / 13, 24, 44));            // قطر دایره، متناسب با فضای موجود
  const track = Math.max(40, W - R);                       // نیم‌قطر در هر طرف رزرو می‌شود تا لبه‌ها بریده نشوند
  const X = (v) => R / 2 + ((v - lo) / (hi - lo || 1)) * track;

  /* چیدن نقاط روی هم بر اساس برخورد واقعی در پیکسل (نه فقط تکراری بودن مقدار) */
  const { placed, rows } = useMemo(() => {
    const lastX = [];
    const lv = {};
    values.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v).forEach(({ v, i }) => {
      const x = X(v);
      let L = 0;
      while (lastX[L] != null && x - lastX[L] < R + 2) L++;
      lastX[L] = x; lv[i] = L;
    });
    return { placed: values.map((v, i) => ({ v, i, level: lv[i] })), rows: Math.max(1, lastX.length) };
  }, [key, W, lo, hi]);

  const AXIS = 30, GAP = 12, VSTEP = R + 6;
  const plotH = AXIS + GAP + rows * VSTEP + 16;

  return (
    <div>
      <div ref={plotRef} dir="ltr" style={{ position: "relative", height: plotH, marginTop: 6 }}>
        {showStats && meanV != null && (
          <div style={{ position: "absolute", left: X(meanV), top: 0, bottom: AXIS + 4, width: 2, background: "var(--gold)", opacity: .85, transition: "left .6s cubic-bezier(.22,1,.36,1)" }}>
            <span className="xs mono" style={{ position: "absolute", top: -4, left: 6, color: "var(--gold)", whiteSpace: "nowrap" }}>mean {fmt(meanV, 1)}</span>
          </div>
        )}
        {showStats && medianV != null && (
          <div style={{ position: "absolute", left: X(medianV), top: 18, bottom: AXIS + 4, width: 2, background: "var(--v)", opacity: .8, transition: "left .6s cubic-bezier(.22,1,.36,1)" }}>
            <span className="xs mono" style={{ position: "absolute", top: 14, left: 6, color: "var(--v)", whiteSpace: "nowrap" }}>median {fmt(medianV, 1)}</span>
          </div>
        )}
        {placed.map(({ v, i, level }) => removed.includes(i) ? null : (
          <button key={i} className={`bub ${marked === i ? "sus" : ""} ${drag?.i === i ? "dragging" : ""}`}
            style={{
              position: "absolute", left: X(v) - R / 2, bottom: AXIS + GAP + level * VSTEP, width: R, height: R,
              fontSize: R >= 40 ? 14 : R >= 32 ? 13 : 11,
              transform: drag?.i === i ? `translate(${drag.dx}px, ${drag.dy}px) scale(1.08)` : undefined,
              boxShadow: inspected?.includes(i) ? "0 0 0 2px rgba(255,255,255,.4)" : undefined,
            }}
            onPointerDown={(e) => down(e, i)} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { dragRef.current = null; setDrag(null); setHot(false); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onInspect && onInspect(i); onToggle(i); } }}
            aria-label={labelOf(v, i)}>
            {v}
          </button>
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: AXIS, height: 1, background: "var(--stroke2)" }} />
        {ticks.map((t) => (
          <div key={t} style={{ position: "absolute", left: X(t), bottom: 8, transform: "translateX(-50%)" }}>
            <div style={{ width: 1, height: 6, background: "var(--stroke2)", margin: "0 auto 3px" }} />
            <span className="xs dim mono">{t}</span>
          </div>
        ))}
      </div>
      <div className="spread xs dim"><span>{caption}</span><span className="mono">n = {values.length - removed.length}</span></div>
      <div ref={zoneRef} className={`dropzone ${hot ? "hot" : ""}`} style={{ marginTop: 12, display: showZone ? "grid" : "none" }}>
        {removed.length === 0
          ? <div className="stack" style={{ alignItems: "center", gap: 4 }}>
              <div className="small muted">دادهٔ مشکوک را بکش و اینجا رها کن</div>
              <div className="xs dim">یا رویش کلیک کن</div>
            </div>
          : <div className="row" style={{ gap: 10, padding: 10, flexWrap: "wrap", justifyContent: "center" }}>
              {removed.map((i) => (
                <button key={i} className="bub sus" onClick={() => onToggle(i)} aria-label={`برگرداندن ${values[i]} به گروه`}>{values[i]}</button>
              ))}
              <span className="small muted" style={{ alignSelf: "center" }}>برای برگرداندن کلیک کن</span>
            </div>}
      </div>
    </div>
  );
}

/* شبکهٔ بردار — SVG، پشتیبانی از مبدأ گوشه یا وسط */
function VectorGrid({ cols = 7, rows = 6, origin = { x: 0, y: 0 }, robot, target, trail = [], predicted, onCell, showArrow, tint = "var(--v)" }) {
  const C = 100;
  const px = (x) => (x + origin.x) * C + C / 2;
  const py = (y) => (rows - 1 - (y + origin.y)) * C + C / 2;
  const cells = [];
  for (let gx = 0; gx < cols; gx++) for (let gy = 0; gy < rows; gy++) cells.push([gx - origin.x, gy - origin.y]);

  return (
    <svg viewBox={`0 0 ${cols * C} ${rows * C}`} style={{ width: "100%", maxHeight: 420, display: "block" }} role="img"
      aria-label={`شبکهٔ ${cols} در ${rows}. ربات در ${robot.x} و ${robot.y}، هدف در ${target.x} و ${target.y}`}>
      <defs>
        <linearGradient id="axg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4FA8FF" stopOpacity=".9" /><stop offset="100%" stopColor="#8B7BFF" stopOpacity=".9" />
        </linearGradient>
      </defs>
      {cells.map(([gx, gy]) => (
        <rect key={`${gx},${gy}`} x={px(gx) - C / 2 + 3} y={py(gy) - C / 2 + 3} width={C - 6} height={C - 6} rx="12"
          fill={predicted && predicted.x === gx && predicted.y === gy ? "rgba(255,209,102,.16)" : "rgba(255,255,255,.035)"}
          stroke={predicted && predicted.x === gx && predicted.y === gy ? "rgba(255,209,102,.7)" : "rgba(255,255,255,.07)"}
          style={{ cursor: onCell ? "pointer" : "default" }} onClick={() => onCell && onCell({ x: gx, y: gy })} />
      ))}
      {(origin.x > 0 || origin.y > 0) && (
        <g stroke="rgba(255,255,255,.22)" strokeWidth="2">
          <line x1={px(0) - C / 2} y1={py(0) + C / 2} x2={cols * C} y2={py(0) + C / 2} />
          <line x1={px(0) - C / 2} y1="0" x2={px(0) - C / 2} y2={rows * C} />
        </g>
      )}
      {trail.length > 1 && (
        <polyline points={trail.map((p) => `${px(p.x)},${py(p.y)}`).join(" ")} fill="none" stroke={tint} strokeWidth="6"
          strokeLinecap="round" strokeLinejoin="round" opacity=".45" strokeDasharray="1 14" />
      )}
      {showArrow && (
        <line x1={px(0)} y1={py(0)} x2={px(robot.x)} y2={py(robot.y)} stroke="url(#axg)" strokeWidth="8" strokeLinecap="round" opacity=".9" />
      )}
      <g transform={`translate(${px(target.x)},${py(target.y)})`}>
        <polygon points="0,-26 21,0 0,26 -21,0" fill="rgba(255,209,102,.25)" stroke="var(--gold)" strokeWidth="4" className="float" />
      </g>
      <g transform={`translate(${px(robot.x)},${py(robot.y)})`} style={{ transition: "transform .32s cubic-bezier(.3,1.2,.5,1)" }}>
        <rect x="-26" y="-26" width="52" height="52" rx="15" fill="rgba(79,168,255,.3)" stroke={tint} strokeWidth="4" />
        <circle cx="-9" cy="-4" r="5" fill="#fff" /><circle cx="9" cy="-4" r="5" fill="#fff" />
        <rect x="-11" y="10" width="22" height="4" rx="2" fill="rgba(255,255,255,.6)" />
      </g>
    </svg>
  );
}

/* کارت مسیر و شبیه‌ساز تحویل */
const ROUTES = [
  { id: "A", fa: "مسیر امن", p: 0.9, reward: 30, tint: "var(--d)" },
  { id: "B", fa: "مسیر میانه", p: 0.6, reward: 60, tint: "var(--c)" },
  { id: "C", fa: "مسیر پرخطر", p: 0.3, reward: 120, tint: "var(--bad)" },
];

function RouteCard({ r, selected, onPick, disabled, stat }) {
  const avg = stat && stat.n ? (stat.win * r.reward) / stat.n : null;
  return (
    <button className={`route-card ${selected ? "sel" : ""}`} style={{ "--tint": r.tint }} onClick={onPick} disabled={disabled}
      aria-pressed={selected} aria-label={`${r.fa}، شانس موفقیت ${r.p * 100} درصد، پاداش ${r.reward} سکه`}>
      <div className="spread" style={{ marginBottom: 10 }}>
        <div className="row" style={{ gap: 8 }}>
          <span className="pill mono" style={{ background: `color-mix(in srgb, ${r.tint} 20%, transparent)`, borderColor: r.tint, color: r.tint }}>{r.id}</span>
          <b style={{ fontSize: 15 }}>{r.fa}</b>
        </div>
        {selected && <Check size={17} color={r.tint} />}
      </div>
      <div className="stack" style={{ gap: 9 }}>
        <div className="spread small"><span className="muted">شانس رسیدن</span><span className="num" style={{ color: r.tint }}>{r.p * 100}%</span></div>
        <ProgressBar value={r.p * 100} />
        <div className="spread small"><span className="muted">پاداش هر تحویل موفق</span><span className="num" style={{ color: "var(--gold)" }}>{r.reward} ⬤</span></div>
      </div>
      {stat && stat.n > 0 && (
        <div className="panel" style={{ marginTop: 12, padding: "9px 11px" }}>
          <div className="spread xs"><span className="dim">از {stat.n} تحویل</span><span className="mono">{stat.win} موفق</span></div>
          <div className="spread" style={{ marginTop: 6 }}>
            <span className="small muted">میانگین سکه در هر تحویل</span>
            <span className="num" style={{ fontSize: 18, color: r.tint }}>{fmt(avg, 1)}</span>
          </div>
        </div>
      )}
    </button>
  );
}

function SimColumn({ r, stat, maxAvg }) {
  const avg = stat.n ? (stat.win * r.reward) / stat.n : 0;
  const animated = useAnimatedNumber(avg, 500);
  return (
    <div className="stack" style={{ gap: 8, alignItems: "center" }}>
      <div className="simbar" style={{ width: "100%" }}>
        <i style={{ height: `${(avg / maxAvg) * 100}%`, background: `linear-gradient(180deg, color-mix(in srgb, ${r.tint} 85%, transparent), color-mix(in srgb, ${r.tint} 35%, transparent))` }} />
      </div>
      <div className="num" style={{ fontSize: 20, color: r.tint }}>{fmt(animated, 1)}</div>
      <div className="xs dim">میانگین سکه — مسیر <span className="mono">{r.id}</span></div>
      <div className="xs mono dim">{stat.win}/{stat.n}</div>
    </div>
  );
}

function SimColumns({ stats }) {
  const maxAvg = Math.max(1, ...ROUTES.map((r) => (stats[r.id].n ? (stats[r.id].win * r.reward) / stats[r.id].n : 0)));
  return (
    <div className="grid g3" style={{ gap: 14 }}>
      {ROUTES.map((r) => <SimColumn key={r.id} r={r} stat={stats[r.id]} maxAvg={maxAvg} />)}
    </div>
  );
}

function DiscoveryCard({ tint, title, lead, children, onLens, onContinue, continueLabel = "ادامه", lensDone }) {
  return (
    <div className="card rise glowpulse" style={{ borderColor: `color-mix(in srgb, ${tint} 45%, transparent)` }}>
      <div className="row" style={{ gap: 10, marginBottom: 10 }}>
        <Sparkles size={20} color={tint} />
        <h3 className="h2" style={{ fontSize: 21 }}>{title}</h3>
      </div>
      {lead && <p className="muted" style={{ margin: "0 0 14px", fontSize: 15 }}>{lead}</p>}
      {children}
      <div className="row wrap-r" style={{ marginTop: 18, gap: 10 }}>
        <Btn variant={lensDone ? "btn-ghost" : "btn-gold"} icon={Eye} onClick={onLens}>
          {lensDone ? "دوباره ببین" : "ذره‌بین ریاضی"}
        </Btn>
        <Btn variant="btn-primary" icon={ArrowLeft} onClick={onContinue}>{continueLabel}</Btn>
      </div>
    </div>
  );
}

/* ---- 10.1 Pattern Machine ---- */
function PatternMachine({ onComplete, onLens }) {
  const missionId = "m_pattern", M = MISSIONS[missionId], TINT = "var(--p)";
  const { state, dispatch, say } = useGame();
  const p = state.progress[missionId] || {};
  const hint = useAdaptiveHint(missionId, p.attempts || 0);
  const [input, setInput] = useState(2);
  const [output, setOutput] = useState(null);
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState([]);
  const [runs, setRuns] = useState(0);
  const [phase, setPhase] = useState("experiment");
  const [guess, setGuess] = useState("");
  const [bad, setBad] = useState(false);
  const rule = (x) => x * 2 + 1;
  const TARGET = 10, ANSWER = rule(TARGET);

  useEffect(() => { track("mission_started", { missionId }); say("pm_intro"); }, []);
  useEffect(() => { if (runs === 2) say("pm_more"); if (runs === 3) say("pm_predict"); }, [runs]);

  const run = (val) => {
    if (running) return;
    setRunning(true); setOutput(null); setInput(val);
    track("simulation_run", { missionId, input: val });
    setTimeout(() => {
      setOutput(rule(val)); setRunning(false); Sfx.play("tick");
      setLog((L) => [...L.filter((x) => x.i !== val), { i: val, o: rule(val) }].sort((a, b) => a.i - b.i).slice(-7));
      setRuns((r) => r + 1);
      dispatch({ type: "MISSION_PROGRESS", missionId, pct: Math.min(60, 20 + runs * 12) });
    }, 640);
  };
  const demo = () => { run(0); };

  const submit = () => {
    const g = Number(guess);
    if (!guess.trim() || Number.isNaN(g)) return;
    track("prediction_made", { missionId, guess: g, correct: g === ANSWER });
    if (g === ANSWER) {
      Sfx.play("ok"); say("pm_right");
      setPhase("discovery");
      dispatch({ type: "MISSION_PROGRESS", missionId, pct: 100 });
      setInput(TARGET); setOutput(ANSWER);
    } else {
      Sfx.play("bad"); dispatch({ type: "ATTEMPT", missionId }); say("pm_wrong");
      setBad(true); setTimeout(() => setBad(false), 400);
    }
  };

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="stage">
        <div className="spread" style={{ marginBottom: 18 }}>
          <div className="pill mono" style={{ color: TINT, borderColor: TINT }}>M-01</div>
          <Steps total={3} at={phase === "experiment" ? 1 : phase === "predict" ? 2 : 3} tint={TINT} />
        </div>
        <div className={bad ? "shake" : ""}><MachineCore label="M-01" input={input} output={output} running={running} tint={TINT} /></div>

        {phase === "experiment" && (
          <div style={{ maxWidth: 470, margin: "26px auto 0" }}>
            <div className="spread small muted" style={{ marginBottom: 8 }}>
              <span>عددی را انتخاب کن و بفرست داخل ماشین</span><span className="num" style={{ color: TINT }}>{input}</span>
            </div>
            <NumberDial value={input} setValue={setInput} disabled={running} />
            <div className="row" style={{ justifyContent: "center", marginTop: 16, gap: 10 }}>
              <Btn variant="btn-primary" size="btn-lg" icon={Play} onClick={() => run(input)} disabled={running}>بفرست داخل ماشین</Btn>
              {runs >= 3 && <Btn variant="btn-gold" icon={Target} onClick={() => { setPhase("predict"); say("pm_predict"); }}>حالا حدس می‌زنم</Btn>}
            </div>
            {runs < 3 && <p className="xs dim" style={{ textAlign: "center", marginTop: 12 }}>بعد از {3 - runs} آزمایش دیگر می‌توانی حدس بزنی</p>}
          </div>
        )}

        {phase === "predict" && (
          <div className="panel rise" style={{ maxWidth: 470, margin: "26px auto 0", borderColor: "rgba(255,209,102,.4)" }}>
            <div className="h3" style={{ marginBottom: 4 }}>اگر عدد <span className="num" style={{ color: "var(--gold)" }}>10</span> را وارد کنیم، چه چیزی بیرون می‌آید؟</div>
            <p className="xs dim" style={{ margin: "0 0 12px" }}>لازم نیست مطمئن باشی. حدس بزن.</p>
            <div className="row">
              <input className="panel grow mono" inputMode="numeric" value={guess} onChange={(e) => setGuess(e.target.value.replace(/[^\d-]/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="؟" aria-label="حدس خروجی"
                style={{ fontSize: 22, textAlign: "center", padding: "10px 14px", border: "1px solid var(--stroke2)" }} />
              <Btn variant="btn-primary" onClick={submit} disabled={!guess.trim()}>ثبت حدس</Btn>
            </div>
            {(p.attempts || 0) > 0 && (
              <div className="row" style={{ marginTop: 12, justifyContent: "space-between" }}>
                <span className="small" style={{ color: "var(--bad)" }}>این عدد نبود. باز هم آزمایش کن.</span>
                <Btn size="btn-sm" variant="btn-ghost" icon={RotateCcw} onClick={() => setPhase("experiment")}>برگرد به آزمایش</Btn>
              </div>
            )}
          </div>
        )}

        {log.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div className="xs dim" style={{ marginBottom: 8 }}>دفترچهٔ آزمایش‌ها</div>
            <div className="row wrap-r" style={{ gap: 8 }}>
              {log.map((l) => (
                <span key={l.i} className="chip mono" style={{ borderColor: phase === "discovery" ? TINT : "var(--stroke)" }}>
                  {l.i} <ArrowLeft size={13} style={{ opacity: .5 }} /> {l.o}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <HintPanel level={hint} mission={M} onDemo={demo} />

      {phase === "discovery" && (
        <DiscoveryCard tint={TINT} title="قانون ماشین را پیدا کردی"
          lead="عددی را حدس زدی که هرگز امتحانش نکرده بودی و درست بود. یعنی دیگر به ماشین نیاز نداری — قانونش را داری."
          lensDone={state.lenses.includes(missionId)} onLens={() => onLens(missionId)}
          onContinue={() => onComplete({ perfect: (p.attempts || 0) === 0, experimented: runs >= 5 })}>
          <div className="panel" style={{ textAlign: "center", padding: "18px" }}>
            <div className="mono" style={{ fontSize: 22, fontWeight: 800, color: TINT }}>Output = Input × 2 + 1</div>
            <p className="muted small" style={{ margin: "12px 0 0" }}>
              هرچه وارد کنی، دو برابر می‌شود و یکی به آن اضافه می‌شود. همیشه، بدون استثنا.
            </p>
          </div>
        </DiscoveryCard>
      )}
    </div>
  );
}

/* ---- 10.2 Risky Delivery ---- */
function RiskyDelivery({ onComplete, onLens }) {
  const missionId = "m_risk", M = MISSIONS[missionId], TINT = "var(--c)";
  const { state, dispatch, say } = useGame();
  const p = state.progress[missionId] || {};
  const hint = useAdaptiveHint(missionId, p.attempts || 0);
  const [phase, setPhase] = useState("guess");
  const [firstGuess, setFirstGuess] = useState(null);
  const [pick, setPick] = useState(null);
  const [pos, setPos] = useState(0);
  const [moving, setMoving] = useState(false);
  const [flying, setFlying] = useState(false);
  const [last, setLast] = useState(null);
  const [singles, setSingles] = useState(0);
  const [stats, setStats] = useState({ A: { n: 0, win: 0 }, B: { n: 0, win: 0 }, C: { n: 0, win: 0 } });
  const [batchDone, setBatchDone] = useState({ 10: false, 100: false });
  const [busy, setBusy] = useState(false);
  const [finalPick, setFinalPick] = useState(null);

  useEffect(() => { track("mission_started", { missionId }); say("rd_intro"); }, []);

  const deliver = () => {
    if (!pick || flying) return;
    const r = ROUTES.find((x) => x.id === pick);
    setFlying(true); setLast(null); setMoving(false); setPos(0);
    track("simulation_run", { missionId, route: pick, n: 1 });
    requestAnimationFrame(() => requestAnimationFrame(() => { setMoving(true); setPos(100); }));
    setTimeout(() => {
      const win = Math.random() < r.p;
      setLast({ win, coins: win ? r.reward : 0, route: r.id });
      setStats((s) => ({ ...s, [r.id]: { n: s[r.id].n + 1, win: s[r.id].win + (win ? 1 : 0) } }));
      setSingles((n) => n + 1); setFlying(false); setMoving(false); Sfx.play(win ? "ok" : "bad");
      dispatch({ type: "MISSION_PROGRESS", missionId, pct: 45 });
      if (singles === 0) say("rd_single"); if (singles === 1) say("rd_batch");
    }, 1250);
  };

  const runBatch = (n) => {
    if (busy) return;
    setBusy(true);
    track("simulation_run", { missionId, n, allRoutes: true });
    const chunks = 20, per = n / chunks;
    let done = 0;
    const iv = setInterval(() => {
      setStats((s) => {
        const ns = { ...s };
        ROUTES.forEach((r) => {
          let w = 0;
          for (let i = 0; i < per; i++) if (Math.random() < r.p) w++;
          ns[r.id] = { n: ns[r.id].n + per, win: ns[r.id].win + w };
        });
        return ns;
      });
      if (++done >= chunks) {
        clearInterval(iv); setBusy(false);
        setBatchDone((b) => ({ ...b, [n]: true }));
        dispatch({ type: "MISSION_PROGRESS", missionId, pct: n === 100 ? 80 : 60 });
        if (n === 100) { say("rd_compare"); setPhase("final"); }
      }
    }, 42);
  };

  const lockFinal = () => {
    const ok = finalPick === "B" || finalPick === "C";
    track("prediction_made", { missionId, finalPick, correct: ok });
    if (ok) { Sfx.play("ok"); setPhase("discovery"); dispatch({ type: "MISSION_PROGRESS", missionId, pct: 100 }); }
    else { Sfx.play("bad"); dispatch({ type: "ATTEMPT", missionId }); }
  };

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="stage">
        <div className="spread" style={{ marginBottom: 16 }}>
          <div className="row" style={{ gap: 8 }}><Package size={18} color={TINT} /><b>کریستال آمادهٔ ارسال است</b></div>
          <Steps total={4} at={phase === "guess" ? 1 : phase === "run" ? 2 : phase === "final" ? 3 : 4} tint={TINT} />
        </div>

        {/* مسیر پرواز */}
        <div dir="ltr" style={{ position: "relative", height: 64, margin: "6px 0 20px", borderRadius: 16, background: "rgba(0,0,0,.28)", border: "1px solid var(--stroke)", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: "50% 16px auto", height: 2, background: "repeating-linear-gradient(90deg, rgba(255,255,255,.25) 0 10px, transparent 10px 20px)" }} />
          <div style={{ position: "absolute", left: 8, top: 16, width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,.07)", display: "grid", placeItems: "center" }}><Home size={15} /></div>
          <div style={{ position: "absolute", right: 8, top: 16, width: 32, height: 32, borderRadius: 10, background: "rgba(255,209,102,.16)", display: "grid", placeItems: "center" }}><Flag size={15} color="var(--gold)" /></div>
          <div style={{ position: "absolute", top: 18, left: `calc(${8 + pos * 0.8}% )`, transition: moving ? "left 1.2s cubic-bezier(.4,0,.5,1)" : "none" }}>
            <div className={last && !last.win ? "shake" : ""} style={{
              width: 28, height: 28, borderRadius: 9, display: "grid", placeItems: "center",
              background: last ? (last.win ? "rgba(47,214,166,.3)" : "rgba(255,112,112,.3)") : "rgba(139,123,255,.3)",
              border: `1px solid ${last ? (last.win ? "var(--ok)" : "var(--bad)") : "var(--p)"}`,
            }}>{last ? (last.win ? <Check size={15} color="var(--ok)" /> : <X size={15} color="var(--bad)" />) : <Sparkles size={14} />}</div>
          </div>
        </div>

        <div className="grid g3">
          {ROUTES.map((r) => (
            <RouteCard key={r.id} r={r} stat={stats[r.id]} selected={(phase === "guess" ? firstGuess : phase === "final" || phase === "discovery" ? finalPick : pick) === r.id}
              disabled={flying || busy || phase === "discovery"}
              onPick={() => {
                if (phase === "guess") setFirstGuess(r.id);
                else if (phase === "final") setFinalPick(r.id);
                else setPick(r.id);
              }} />
          ))}
        </div>

        {phase === "guess" && (
          <div className="panel rise" style={{ marginTop: 16 }}>
            <div className="spread">
              <div>
                <div className="h3">قبل از شروع: کدام مسیر در بلندمدت بیشتر می‌ارزد؟</div>
                <p className="xs dim" style={{ margin: "4px 0 0" }}>هنوز هیچ‌چیز را ثابت نکن. فقط حدس بزن.</p>
              </div>
              <Btn variant="btn-primary" disabled={!firstGuess} icon={Check}
                onClick={() => { track("prediction_made", { missionId, stage: "first", guess: firstGuess }); setPhase("run"); setPick(firstGuess); say("rd_single"); dispatch({ type: "MISSION_PROGRESS", missionId, pct: 25 }); }}>
                حدسم را ثبت کن
              </Btn>
            </div>
          </div>
        )}

        {phase === "run" && (
          <div className="stack" style={{ gap: 12, marginTop: 16 }}>
            {last && (
              <div className="panel rise" style={{ borderColor: last.win ? "rgba(47,214,166,.45)" : "rgba(255,112,112,.45)" }}>
                <div className="spread">
                  <b style={{ color: last.win ? "var(--ok)" : "var(--bad)" }}>
                    {last.win ? "کریستال سالم رسید" : "محموله از دست رفت"}
                  </b>
                  <span className="num" style={{ color: "var(--gold)", fontSize: 18 }}>+{last.coins} ⬤</span>
                </div>
              </div>
            )}
            <div className="row wrap-r" style={{ gap: 10 }}>
              <Btn variant="btn-primary" icon={Play} onClick={deliver} disabled={!pick || flying}>ارسال کن</Btn>
              {singles >= 1 && <Btn variant="btn-ghost" icon={Repeat} onClick={() => runBatch(10)} disabled={busy}>۱۰ بار روی هر سه مسیر</Btn>}
              {batchDone[10] && <Btn variant="btn-gold" icon={TrendingUp} onClick={() => runBatch(100)} disabled={busy}>۱۰۰ بار روی هر سه مسیر</Btn>}
            </div>
            {singles >= 1 && singles < 2 && <p className="xs dim" style={{ margin: 0 }}>یک بار کافی نیست. چند بار دیگر بفرست یا دسته‌ای اجرا کن.</p>}
          </div>
        )}

        {(batchDone[10] || batchDone[100]) && (
          <div style={{ marginTop: 22 }}>
            <div className="spread" style={{ marginBottom: 10 }}>
              <div className="h3">نتیجهٔ بلندمدت</div>
              <span className="xs dim">میانگین سکه در هر تحویل — نه درصد موفقیت</span>
            </div>
            <SimColumns stats={stats} />
          </div>
        )}

        {phase === "final" && (
          <div className="panel rise" style={{ marginTop: 16, borderColor: "rgba(255,209,102,.4)" }}>
            <div className="spread">
              <div>
                <div className="h3">حالا با چشم باز: کدام مسیر بیشترین ارزش بلندمدت را دارد؟</div>
                <p className="xs dim" style={{ margin: "4px 0 0" }}>
                  حدس اولت مسیر <span className="mono">{firstGuess}</span> بود. یکی از کارت‌ها را انتخاب کن.
                </p>
              </div>
              <Btn variant="btn-gold" disabled={!finalPick} onClick={lockFinal} icon={Check}>انتخاب نهایی</Btn>
            </div>
            {(p.attempts || 0) > 0 && <p className="small" style={{ color: "var(--bad)", margin: "10px 0 0" }}>به میانگین سکه‌ها نگاه کن، نه به شانس موفقیت.</p>}
          </div>
        )}
      </div>

      <HintPanel level={hint} mission={M} onDemo={() => runBatch(100)} />

      {phase === "discovery" && (
        <DiscoveryCard tint={TINT} title="مسیر امن، بهترین مسیر نبود"
          lead="مسیر A بیشترین شانس موفقیت را داشت ولی کمترین ارزش را تولید کرد. دلیلش این است که فقط شانس مهم نیست؛ اندازهٔ پاداش هم مهم است."
          lensDone={state.lenses.includes(missionId)} onLens={() => onLens(missionId)}
          onContinue={() => onComplete({ perfect: (p.attempts || 0) === 0 && (firstGuess === "B" || firstGuess === "C"), experimented: batchDone[100] && singles >= 2 })}>
          <div className="grid g3">
            {ROUTES.map((r) => (
              <div key={r.id} className="panel" style={{ borderColor: r.p * r.reward === 36 ? "rgba(255,209,102,.5)" : "var(--stroke)" }}>
                <div className="xs dim mono">{r.id}</div>
                <div className="mono" style={{ fontSize: 15, marginTop: 4 }}>{r.p} × {r.reward}</div>
                <div className="num" style={{ fontSize: 26, color: r.p * r.reward === 36 ? "var(--gold)" : "var(--muted)" }}>{fmt(r.p * r.reward, 0)}</div>
              </div>
            ))}
          </div>
          <div className="panel" style={{ marginTop: 12 }}>
            <div className="row" style={{ alignItems: "flex-start", gap: 9 }}>
              <Info size={16} color={TINT} style={{ marginTop: 3, flex: "0 0 auto" }} />
              <p className="small muted" style={{ margin: 0 }}>
                مسیر B و C ارزش بلندمدت یکسانی دارند (هر دو ۳۶)، ولی راه رسیدنشان فرق می‌کند: B اغلب کمی می‌برد، C به‌ندرت زیاد می‌برد.
                به این تفاوت «پراکندگی» یا ریسک می‌گویند — همان چیزی که در شهر داده بیشتر می‌بینی.
              </p>
            </div>
          </div>
        </DiscoveryCard>
      )}
    </div>
  );
}

/* ---- 10.3 Data Detective ---- */
function StatReadout({ label, value, tint, sub, dim }) {
  const a = useAnimatedNumber(value);
  return (
    <div className="panel" style={{ borderColor: dim ? "var(--stroke)" : `color-mix(in srgb, ${tint} 45%, transparent)`, opacity: dim ? .55 : 1 }}>
      <div className="xs dim">{label}</div>
      <div className="num" style={{ fontSize: 30, color: tint, lineHeight: 1.3 }}>{fmt(a, 1)}</div>
      {sub && <div className="xs dim">{sub}</div>}
    </div>
  );
}

function DataDetective({ onComplete, onLens }) {
  const missionId = "m_data", M = MISSIONS[missionId], TINT = "var(--d)";
  const { state, dispatch, say } = useGame();
  const p = state.progress[missionId] || {};
  const hint = useAdaptiveHint(missionId, p.attempts || 0);
  const VALUES = [3, 4, 4, 5, 5, 5, 6, 6, 7, 25];
  const OUT_IDX = 9;
  const [phase, setPhase] = useState("explore");
  const [inspected, setInspected] = useState([]);
  const [marked, setMarked] = useState(null);
  const [removed, setRemoved] = useState([]);
  const [guessMean, setGuessMean] = useState(6.5);
  const [guessed, setGuessed] = useState(null);

  const live = VALUES.filter((_, i) => !removed.includes(i));
  const mn = mean(live), md = median(live);

  useEffect(() => { track("mission_started", { missionId }); say("dd_intro"); }, []);

  const onInspect = (i) => setInspected((s) => (s.includes(i) ? s : [...s, i]));

  const toggle = (i) => {
    if (phase === "suspect") {
      track("prediction_made", { missionId, stage: "outlier", pick: VALUES[i], correct: i === OUT_IDX });
      if (i === OUT_IDX) {
        setMarked(i); Sfx.play("ok"); say("dd_predict"); setPhase("predict");
        dispatch({ type: "MISSION_PROGRESS", missionId, pct: 50 });
      } else {
        Sfx.play("bad"); dispatch({ type: "ATTEMPT", missionId });
      }
      return;
    }
    if (phase === "remove" || phase === "discovery") {
      setRemoved((r) => (r.includes(i) ? r.filter((x) => x !== i) : [...r, i]));
      Sfx.play("tick");
      if (!removed.includes(i) && i === OUT_IDX) {
        say("dd_after"); dispatch({ type: "MISSION_PROGRESS", missionId, pct: 100 });
        setTimeout(() => setPhase("discovery"), 900);
      }
    }
  };

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="panel" style={{ borderColor: "rgba(255,255,255,.16)" }}>
        <div className="row" style={{ alignItems: "flex-start", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 11, background: "rgba(255,255,255,.07)", display: "grid", placeItems: "center", flex: "0 0 auto" }}>
            <Home size={16} />
          </div>
          <div>
            <div className="xs dim">ادعای فروشگاه</div>
            <div style={{ fontSize: 15.5 }}>«مشتریان ما به‌طور متوسط فقط ۵ دقیقه منتظر می‌مانند.»</div>
          </div>
        </div>
      </div>

      <div className="stage">
        <div className="spread" style={{ marginBottom: 4 }}>
          <div className="row" style={{ gap: 8 }}><Search size={18} color={TINT} /><b>پروندهٔ ده مشتری</b></div>
          <Steps total={4} at={phase === "explore" ? 1 : phase === "suspect" ? 2 : phase === "predict" ? 3 : 4} tint={TINT} />
        </div>

        <DataBubbles values={VALUES} removed={removed} onToggle={toggle} inspected={inspected} onInspect={onInspect}
          showZone={phase === "remove" || phase === "discovery"} marked={marked}
          meanV={mn} medianV={md} showStats={phase === "remove" || phase === "discovery"} />

        <div className="grid g3" style={{ marginTop: 16 }}>
          <StatReadout label="میانگین (Mean)" value={mn} tint="var(--gold)" dim={phase === "explore" || phase === "suspect" ? false : false}
            sub={removed.length ? "بدون دادهٔ کنارگذاشته‌شده" : "با همهٔ ۱۰ داده"} />
          <StatReadout label="میانه (Median)" value={md} tint="var(--v)" sub="عدد وسط داده‌های مرتب‌شده" />
          <div className="panel">
            <div className="xs dim">ادعای فروشگاه</div>
            <div className="num" style={{ fontSize: 30, lineHeight: 1.3 }}>5.0</div>
            <div className="xs" style={{ color: Math.abs(mn - 5) < 0.05 ? "var(--ok)" : "var(--bad)" }}>
              {Math.abs(mn - 5) < 0.05 ? "با میانگین فعلی جور است" : "با میانگین فعلی جور نیست"}
            </div>
          </div>
        </div>

        {phase === "explore" && (
          <div className="panel rise" style={{ marginTop: 16 }}>
            <div className="spread">
              <div>
                <div className="h3">اول داده‌ها را نگاه کن</div>
                <p className="xs dim" style={{ margin: "4px 0 0" }}>روی چند دایره بزن تا بررسی‌شان کنی. ({inspected.length} از ۳)</p>
              </div>
              <Btn variant="btn-primary" disabled={inspected.length < 3} icon={Search}
                onClick={() => { setPhase("suspect"); say("dd_suspect"); dispatch({ type: "MISSION_PROGRESS", missionId, pct: 30 }); }}>
                یکی از اینها مشکوک است
              </Btn>
            </div>
          </div>
        )}

        {phase === "suspect" && (
          <div className="panel rise" style={{ marginTop: 16, borderColor: "rgba(255,209,102,.4)" }}>
            <div className="h3">به نظرت کدام عدد طبیعی نیست؟</div>
            <p className="xs dim" style={{ margin: "4px 0 0" }}>روی دایرهٔ مشکوک کلیک کن.</p>
            {(p.attempts || 0) > 0 && <p className="small" style={{ color: "var(--bad)", margin: "8px 0 0" }}>این یکی کنار بقیه جا می‌شود. دنبال عددی بگرد که از همه دور افتاده.</p>}
          </div>
        )}

        {phase === "predict" && (
          <div className="panel rise" style={{ marginTop: 16, borderColor: "rgba(255,209,102,.4)" }}>
            <div className="h3">قبل از کنار گذاشتنش حدس بزن</div>
            <p className="xs dim" style={{ margin: "4px 0 10px" }}>اگر عدد ۲۵ را از پرونده خارج کنیم، میانگین روی چه عددی می‌نشیند؟</p>
            <div className="row" style={{ gap: 14 }}>
              <span className="num" style={{ fontSize: 24, color: "var(--gold)", minWidth: 56 }}>{fmt(guessMean, 1)}</span>
              <input className="sl grow" type="range" min="3" max="8" step="0.1" value={guessMean}
                onChange={(e) => setGuessMean(Number(e.target.value))} aria-label="حدس میانگین جدید" disabled={guessed !== null} />
            </div>
            {guessed === null
              ? <div className="row" style={{ marginTop: 12, justifyContent: "flex-end" }}>
                  <Btn variant="btn-primary" icon={Check}
                    onClick={() => { setGuessed(guessMean); track("prediction_made", { missionId, stage: "mean", guess: guessMean }); setPhase("remove"); say("dd_after"); dispatch({ type: "MISSION_PROGRESS", missionId, pct: 70 }); }}>
                    ثبت حدس
                  </Btn>
                </div>
              : null}
          </div>
        )}

        {(phase === "remove" || phase === "discovery") && (
          <div className="panel rise" style={{ marginTop: 16 }}>
            <div className="spread">
              <div>
                <div className="h3">{removed.includes(OUT_IDX) ? "عدد ۲۵ کنار گذاشته شد" : "حالا عدد ۲۵ را بکش بیرون"}</div>
                <p className="xs dim" style={{ margin: "4px 0 0" }}>
                  {guessed !== null && <>حدس تو <span className="num">{fmt(guessed, 1)}</span> بود — {Math.abs(guessed - 5) <= 0.5 ? "خیلی نزدیک زدی." : "کمی دورتر بود."} </>}
                  خط طلایی میانگین است و خط آبی میانه. ببین کدام‌شان تکان می‌خورد.
                </p>
              </div>
              {removed.includes(OUT_IDX) && <Btn size="btn-sm" variant="btn-ghost" icon={RotateCcw} onClick={() => toggle(OUT_IDX)}>برگردانش</Btn>}
            </div>
          </div>
        )}
      </div>

      <HintPanel level={hint} mission={M} onDemo={() => { setMarked(OUT_IDX); setPhase("predict"); }} />

      {phase === "discovery" && (
        <DiscoveryCard tint={TINT} title="یک نفر، کل تصویر را عوض کرده بود"
          lead="نُه مشتری بین ۳ تا ۷ دقیقه منتظر ماندند. یک نفر ۲۵ دقیقه. همان یک نفر میانگین را از ۵ به ۷ برد، ولی میانه اصلاً تکان نخورد."
          lensDone={state.lenses.includes(missionId)} onLens={() => onLens(missionId)}
          onContinue={() => onComplete({ perfect: (p.attempts || 0) === 0, experimented: removed.length > 0 && guessed !== null })}>
          <div className="grid g2">
            <div className="panel"><div className="xs dim">با دادهٔ پرت</div><div className="mono" style={{ fontSize: 16, marginTop: 6 }}>Mean 7.0 · Median 5</div>
              <div className="xs" style={{ color: "var(--bad)", marginTop: 4 }}>ادعای فروشگاه با میانگین درست نیست</div></div>
            <div className="panel"><div className="xs dim">بدون دادهٔ پرت</div><div className="mono" style={{ fontSize: 16, marginTop: 6 }}>Mean 5.0 · Median 5</div>
              <div className="xs" style={{ color: "var(--ok)", marginTop: 4 }}>حالا هر دو عدد یک چیز می‌گویند</div></div>
          </div>
        </DiscoveryCard>
      )}
    </div>
  );
}

/* ---- 10.4 Vector Navigator ---- */
const DIRS = {
  right: { dx: 1, dy: 0, icon: ArrowRight, fa: "راست" },
  up: { dx: 0, dy: 1, icon: ArrowUp, fa: "بالا" },
  left: { dx: -1, dy: 0, icon: ArrowLeft, fa: "چپ" },
  down: { dx: 0, dy: -1, icon: ArrowDown, fa: "پایین" },
};

function VectorNavigator({ onComplete, onLens }) {
  const missionId = "m_vector", M = MISSIONS[missionId], TINT = "var(--v)";
  const { state, dispatch, say } = useGame();
  const p = state.progress[missionId] || {};
  const hint = useAdaptiveHint(missionId, p.attempts || 0);
  const COLS = 7, ROWS = 6, START = { x: 0, y: 0 }, GOAL = { x: 3, y: 2 };
  const [seq, setSeq] = useState([]);
  const [robot, setRobot] = useState(START);
  const [trail, setTrail] = useState([START]);
  const [phase, setPhase] = useState("build");
  const [predicted, setPredicted] = useState(null);
  const [runs, setRuns] = useState(0);
  const [running, setRunning] = useState(false);
  const [msg, setMsg] = useState(null);
  const [vx, setVx] = useState(0), [vy, setVy] = useState(0);
  const stripRef = useRef(null);
  const [pd, setPd] = useState(null);
  const SGOAL = { x: 4, y: 3 };

  useEffect(() => { track("mission_started", { missionId }); say("vn_intro"); }, []);

  const add = (dir) => { if (seq.length < 12 && !running) setSeq((s) => [...s, dir]); };
  const remove = (i) => !running && setSeq((s) => s.filter((_, k) => k !== i));

  const pdRef = useRef(null);
  const down = (e, dir) => {
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    pdRef.current = { dir, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, moved: false };
    setPd(pdRef.current);
  };
  const move = (e) => {
    const d = pdRef.current;
    if (!d) return;
    pdRef.current = { ...d, x: e.clientX, y: e.clientY, moved: Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 7 };
    setPd(pdRef.current);
  };
  const up = (e) => {
    const d = pdRef.current;
    if (!d) return;
    const r = stripRef.current?.getBoundingClientRect();
    const over = !!r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top - 12 && e.clientY <= r.bottom + 12;
    if (!d.moved || over) add(d.dir);
    pdRef.current = null; setPd(null);
  };

  const runProgram = () => {
    if (running || !seq.length) return;
    setRunning(true); setMsg(null); setTrail([START]);
    track("simulation_run", { missionId, seq: seq.join(","), run: runs + 1 });
    let pos = { ...START }, i = 0, wall = false;
    setRobot(pos);
    const step = () => {
      if (i >= seq.length) return finish(pos, wall);
      const d = DIRS[seq[i]];
      const nx = pos.x + d.dx, ny = pos.y + d.dy;
      if (nx < 0 || ny < 0 || nx > COLS - 1 || ny > ROWS - 1) { wall = true; return finish(pos, true); }
      pos = { x: nx, y: ny }; i++;
      setRobot(pos); setTrail((t) => [...t, pos]); Sfx.play("tick");
      setTimeout(step, 340);
    };
    const finish = (final, hitWall) => {
      setRunning(false); setRuns((n) => n + 1);
      const won = final.x === GOAL.x && final.y === GOAL.y;
      if (hitWall) { setMsg({ k: "wall", t: "ربات به لبهٔ شبکه خورد و ایستاد." }); say("vn_wall"); dispatch({ type: "ATTEMPT", missionId }); Sfx.play("bad"); }
      else if (won) {
        Sfx.play("ok"); say("vn_right"); setMsg({ k: "win", t: "کریستال گرفته شد." });
        dispatch({ type: "MISSION_PROGRESS", missionId, pct: 70 });
        setTimeout(() => setPhase("discovery1"), 600);
      } else { setMsg({ k: "miss", t: `ربات در خانهٔ (${final.x}, ${final.y}) ایستاد، نه روی کریستال.` }); dispatch({ type: "ATTEMPT", missionId }); Sfx.play("bad"); }
    };
    setTimeout(step, 250);
  };

  const sliderWin = vx === SGOAL.x && vy === SGOAL.y;
  useEffect(() => {
    if (phase === "slider" && sliderWin) {
      Sfx.play("up"); dispatch({ type: "MISSION_PROGRESS", missionId, pct: 100 });
      const t = setTimeout(() => setPhase("discovery2"), 700);
      return () => clearTimeout(t);
    }
  }, [sliderWin, phase]);

  const inSlider = phase === "slider" || phase === "discovery2";

  return (
    <div className="stack" style={{ gap: 18 }}>
      <div className="stage">
        <div className="spread" style={{ marginBottom: 12 }}>
          <div className="row" style={{ gap: 8 }}><Navigation size={18} color={TINT} /><b>{inSlider ? "کنترل مستقیم با دو عدد" : "برنامهٔ حرکت ربات"}</b></div>
          <Steps total={4} at={phase === "build" ? 1 : phase === "predict" ? 2 : phase === "discovery1" ? 3 : 4} tint={TINT} />
        </div>

        <VectorGrid cols={COLS} rows={ROWS}
          robot={inSlider ? { x: vx, y: vy } : robot}
          target={inSlider ? SGOAL : GOAL}
          trail={inSlider ? [] : trail}
          predicted={phase === "predict" ? predicted : null}
          onCell={phase === "predict" ? (c) => { setPredicted(c); track("prediction_made", { missionId, cell: `${c.x},${c.y}` }); } : null}
          showArrow={inSlider} tint={TINT} />

        {!inSlider && (
          <>
            <div className="row wrap-r" style={{ justifyContent: "center", gap: 10, marginTop: 14 }}>
              {Object.entries(DIRS).map(([k, d]) => (
                <button key={k} className="btn" style={{ width: 58, height: 52, touchAction: "none" }} disabled={running}
                  onPointerDown={(e) => down(e, k)} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { pdRef.current = null; setPd(null); }}
                  aria-label={`افزودن فلش ${d.fa}`}>
                  <d.icon size={21} />
                </button>
              ))}
            </div>
            <p className="xs dim" style={{ textAlign: "center", margin: "8px 0 0" }}>فلش‌ها را بکش داخل نوار، یا رویشان کلیک کن</p>

            <div ref={stripRef} className="dropzone" style={{ marginTop: 12, minHeight: 74, borderColor: pd?.moved ? "var(--v)" : "var(--stroke2)" }}>
              {seq.length === 0
                ? <span className="small dim">نوار برنامه خالی است — اولین فلش را اضافه کن</span>
                : <div className="row wrap-r" style={{ gap: 8, padding: 10, justifyContent: "center" }}>
                    {seq.map((k, i) => {
                      const I = DIRS[k].icon;
                      return (
                        <button key={i} className="chip" onClick={() => remove(i)} disabled={running}
                          style={{ borderColor: "var(--v)", background: "rgba(79,168,255,.13)" }} aria-label={`حذف فلش ${DIRS[k].fa}`}>
                          <I size={16} />
                        </button>
                      );
                    })}
                  </div>}
            </div>

            <div className="row wrap-r" style={{ justifyContent: "center", gap: 10, marginTop: 14 }}>
              {phase === "build" && (
                <Btn variant="btn-gold" icon={Target} disabled={!seq.length}
                  onClick={() => { setPhase("predict"); say("vn_predict"); dispatch({ type: "MISSION_PROGRESS", missionId, pct: 35 }); }}>
                  آماده‌ام — حدس می‌زنم کجا می‌ایستد
                </Btn>
              )}
              {phase === "predict" && (
                <>
                  <span className="small muted">{predicted ? `حدس تو: خانهٔ (${predicted.x}, ${predicted.y})` : "روی خانه‌ای که فکر می‌کنی ربات آنجا می‌ایستد کلیک کن"}</span>
                  <Btn variant="btn-primary" icon={Play} disabled={!predicted || running} onClick={runProgram}>اجرا کن</Btn>
                </>
              )}
              {(phase === "predict" || phase === "discovery1") && seq.length > 0 &&
                <Btn variant="btn-ghost" size="btn-sm" icon={RotateCcw} disabled={running} onClick={() => { setSeq([]); setRobot(START); setTrail([START]); setMsg(null); setPhase("build"); }}>پاک کن</Btn>}
            </div>

            {msg && (
              <div className="panel rise" style={{ marginTop: 12, borderColor: msg.k === "win" ? "rgba(47,214,166,.45)" : "rgba(255,112,112,.4)" }}>
                <div className="spread">
                  <b style={{ color: msg.k === "win" ? "var(--ok)" : "var(--bad)" }}>{msg.t}</b>
                  {predicted && <span className="xs dim">حدس تو: <span className="mono">({predicted.x}, {predicted.y})</span></span>}
                </div>
              </div>
            )}
          </>
        )}

        {inSlider && (
          <div className="stack" style={{ gap: 14, marginTop: 16 }}>
            <div className="grid g2">
              <div className="panel">
                <div className="spread"><span className="small muted">حرکت افقی (x)</span><span className="num" style={{ color: TINT, fontSize: 20 }}>{vx}</span></div>
                <input className="sl" type="range" min="0" max={COLS - 1} step="1" value={vx} onChange={(e) => setVx(Number(e.target.value))} aria-label="مؤلفهٔ افقی بردار" />
              </div>
              <div className="panel">
                <div className="spread"><span className="small muted">حرکت عمودی (y)</span><span className="num" style={{ color: TINT, fontSize: 20 }}>{vy}</span></div>
                <input className="sl" type="range" min="0" max={ROWS - 1} step="1" value={vy} onChange={(e) => setVy(Number(e.target.value))} aria-label="مؤلفهٔ عمودی بردار" />
              </div>
            </div>
            <div className="row wrap-r" style={{ justifyContent: "center", gap: 12 }}>
              <span className="chip mono" style={{ fontSize: 16, borderColor: TINT }}>v = ({vx}, {vy})</span>
              <span className="chip mono" style={{ fontSize: 16 }}>|v| = {fmt(Math.hypot(vx, vy), 2)}</span>
              {sliderWin && <span className="pill" style={{ color: "var(--ok)", borderColor: "var(--ok)" }}><Check size={14} /> روی کریستال</span>}
            </div>
            {!sliderWin && <p className="xs dim" style={{ textAlign: "center", margin: 0 }}>بدون هیچ فلشی، فقط با دو عدد ربات را روی کریستال ببر</p>}
          </div>
        )}
      </div>

      <HintPanel level={hint} mission={M} onDemo={() => setSeq(["right", "right", "right", "up", "up"])} />

      {phase === "discovery1" && (
        <DiscoveryCard tint={TINT} title="ترتیب مهم نبود، تعداد مهم بود"
          lead="هر مسیری که ساختی، اگر سه حرکت به راست و دو حرکت به بالا داشت، ربات دقیقاً همان‌جا رسید."
          lensDone={state.lenses.includes(missionId)} onLens={() => onLens(missionId)}
          continueLabel="حالا بدون فلش امتحان کن" onContinue={() => { setPhase("slider"); say("vn_slider"); }}>
          <div className="row wrap-r" style={{ gap: 10, justifyContent: "center" }}>
            <span className="chip mono">Right 3</span><span className="chip mono">Up 2</span>
            <span className="chip mono" style={{ fontSize: 17, borderColor: TINT, color: TINT }}>Vector = (3, 2)</span>
          </div>
        </DiscoveryCard>
      )}

      {phase === "discovery2" && (
        <DiscoveryCard tint={TINT} title="دو عدد، یک جابه‌جایی"
          lead="بردار فقط دو چیز را مشخص می‌کند: چقدر حرکت کنیم و به چه جهتی. طول پاره‌خط از مبدأ تا ربات، اندازهٔ بردار است."
          lensDone={state.lenses.includes(missionId)} onLens={() => onLens(missionId)}
          onContinue={() => onComplete({ perfect: (p.attempts || 0) === 0 && predicted?.x === GOAL.x && predicted?.y === GOAL.y, experimented: runs >= 2 })}>
          <div className="row wrap-r" style={{ gap: 10, justifyContent: "center" }}>
            <span className="chip mono" style={{ fontSize: 17, borderColor: TINT, color: TINT }}>v = (4, 3)</span>
            <span className="chip mono" style={{ fontSize: 17 }}>|v| = 5</span>
          </div>
        </DiscoveryCard>
      )}

      {pd?.moved && (
        <div style={{ position: "fixed", left: pd.x - 22, top: pd.y - 22, zIndex: 80, pointerEvents: "none" }}>
          <div className="btn" style={{ width: 44, height: 44, opacity: .9 }}>{React.createElement(DIRS[pd.dir].icon, { size: 19 })}</div>
        </div>
      )}
    </div>
  );
}

/* ===================== §11 — WORLDS & PAGES ============================== */

function MissionCompletePanel({ missionId, breakdown, total, badge, levelUp, unlocked, onLens, onNext, nextLabel }) {
  const { state } = useGame();
  const a = useAnimatedNumber(total, 900);
  const M = MISSIONS[missionId];
  return (
    <div className="card rise" style={{ borderColor: "rgba(255,209,102,.45)", textAlign: "center" }}>
      <Confetti n={26} />
      <div className="badge-t" style={{ margin: "0 auto 14px" }}><Trophy size={28} /></div>
      <h2 className="h2">{M.name} تمام شد</h2>
      <div className="num" style={{ fontSize: 46, color: "var(--gold)", margin: "6px 0 2px" }}>+{Math.round(a)}</div>
      <div className="xs dim mono" style={{ marginBottom: 18 }}>XP</div>

      <div className="stack" style={{ gap: 8, maxWidth: 340, margin: "0 auto" }}>
        {breakdown.map((b) => (
          <div key={b.label} className="spread small" style={{ padding: "8px 12px", borderRadius: 12, background: "var(--glass)" }}>
            <span className="muted">{b.label}</span><span className="num" style={{ color: "var(--gold)" }}>+{b.v}</span>
          </div>
        ))}
      </div>

      {(badge || levelUp || unlocked) && (
        <div className="row wrap-r" style={{ justifyContent: "center", gap: 10, marginTop: 18 }}>
          {badge && <span className="pill pop" style={{ borderColor: "var(--gold)", color: "var(--gold)" }}><Award size={14} /> نشان {badge.fa}</span>}
          {levelUp && <span className="pill pop" style={{ borderColor: "var(--p)", color: "var(--p)" }}><Star size={14} /> سطح {levelUp.level} — {levelUp.fa}</span>}
          {unlocked && <span className="pill pop" style={{ borderColor: "var(--v)", color: "var(--v)" }}><Compass size={14} /> {unlocked.fa} باز شد</span>}
        </div>
      )}

      <div className="row wrap-r" style={{ justifyContent: "center", gap: 10, marginTop: 22 }}>
        <Btn variant={state.lenses.includes(missionId) ? "btn-ghost" : "btn-gold"} icon={Eye} onClick={onLens}>ذره‌بین ریاضی</Btn>
        <Btn variant="btn-primary" size="btn-lg" icon={ArrowLeft} onClick={onNext}>{nextLabel}</Btn>
      </div>
    </div>
  );
}

const GAME_BY_WORLD = { patterns: PatternMachine, probability: RiskyDelivery, statistics: DataDetective, vectors: VectorNavigator };

function WorldPage({ worldId }) {
  const { state, dispatch, nav, openLens, pushToast, say } = useGame();
  const w = worldById(worldId);
  const M = MISSIONS[w.missionId];
  const Game = GAME_BY_WORLD[worldId];
  const status = worldStatus(state, worldId);
  const already = state.progress[w.missionId]?.completed;
  const [result, setResult] = useState(null);
  const [replayKey, setReplayKey] = useState(0);
  const [replay, setReplay] = useState(false);

  const complete = ({ perfect, experimented }) => {
    const hintsUsed = state.progress[w.missionId]?.hintsUsed || 0;
    const isPerfect = !!perfect && hintsUsed === 0;
    const breakdown = [{ label: "پایان مأموریت", v: M.xp }];
    let total = M.xp;
    if (isPerfect) { breakdown.push({ label: "کشف بی‌نقص", v: 50 }); total += 50; }
    if (experimented) { breakdown.push({ label: "پاداش آزمایشگری", v: 20 }); total += 20; }
    const award = already ? 0 : total;

    const before = levelOf(state.xp).level;
    if (!already) dispatch({ type: "COMPLETE_MISSION", missionId: w.missionId, xp: award, perfect: isPerfect });
    const after = levelOf(state.xp + award);
    const next = WORLDS.find((x) => x.order === w.order + 1);

    track("mission_completed", { missionId: w.missionId, xp: award, perfect: isPerfect, hintsUsed, replay: !!already });
    track("world_completed", { worldId });
    Sfx.play("up");
    if (!already) {
      pushToast({ text: `+${award} XP`, icon: Zap, tint: "var(--gold)" });
      const b = BADGES.find((x) => x.id === M.badge);
      if (b && !state.badges.includes(b.id)) setTimeout(() => pushToast({ text: `نشان ${b.fa}`, icon: Award, tint: "var(--gold)" }), 500);
      if (after.level > before) setTimeout(() => pushToast({ text: `سطح ${after.level} — ${after.fa}`, icon: Star, tint: "var(--p)" }), 1000);
      if (next) setTimeout(() => pushToast({ text: `${next.fa} باز شد`, icon: Compass, tint: next.tint }), 1500);
    }
    setResult({
      breakdown: already ? [{ label: "تمرین دوباره", v: 0 }] : breakdown,
      total: award,
      badge: already ? null : BADGES.find((x) => x.id === M.badge),
      levelUp: !already && after.level > before ? after : null,
      unlocked: already ? null : next,
      next,
    });
  };

  if (status === "locked") {
    return (
      <div className="wrap">
        <div className="card" style={{ textAlign: "center", marginTop: 40 }}>
          <Lock size={30} style={{ opacity: .6 }} />
          <h2 className="h2" style={{ marginTop: 12 }}>{w.fa} هنوز باز نشده</h2>
          <p className="lead" style={{ margin: "8px auto 18px" }}>
            برای باز شدن این منطقه، اول مأموریت {WORLDS.find((x) => x.order === w.order - 1).fa} را تمام کن.
          </p>
          <Btn variant="btn-primary" icon={Map} onClick={() => nav("/home")}>برگرد به نقشه</Btn>
        </div>
      </div>
    );
  }

  const allDone = allWorldsDone(state);
  const nextRoute = result?.next ? result.next.route : allDone ? "/challenge" : "/home";
  const nextLabel = result?.next ? `برو به ${result.next.fa}` : allDone ? "چالش نهایی باز شد" : "برگرد به نقشه";

  return (
    <div className="wrap">
      <div className="spread" style={{ padding: "22px 0 16px" }}>
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => nav("/home")}><ChevronLeft size={15} style={{ transform: "scaleX(-1)" }} /> نقشه</button>
          <h1 className="h2" style={{ marginTop: 10 }}>{M.name}</h1>
          <p className="lead small" style={{ marginTop: 4 }}>{M.brief}</p>
        </div>
        <div className="pill" style={{ borderColor: w.tint, color: w.tint }}><w.icon size={14} /> {w.fa}</div>
      </div>

      {already && !result && !replay ? (
        <div className="card" style={{ textAlign: "center" }}>
          <Check size={28} color="var(--ok)" />
          <h2 className="h2" style={{ marginTop: 10 }}>این مأموریت را قبلاً تمام کرده‌ای</h2>
          <p className="lead" style={{ margin: "8px auto 18px" }}>می‌توانی دوباره بازی کنی (بدون XP جدید) یا سراغ مرحلهٔ بعد بروی.</p>
          <div className="row wrap-r" style={{ justifyContent: "center", gap: 10 }}>
            <Btn variant="btn-ghost" icon={RotateCcw} onClick={() => { setReplay(true); setReplayKey((k) => k + 1); }}>دوباره بازی کن</Btn>
            <Btn variant="btn-ghost" icon={Eye} onClick={() => openLens(w.missionId)}>ذره‌بین ریاضی</Btn>
            <Btn variant="btn-primary" icon={ArrowLeft} onClick={() => nav(allDone ? "/challenge" : "/home")}>{allDone ? "چالش نهایی" : "نقشه"}</Btn>
          </div>
        </div>
      ) : result ? (
        <MissionCompletePanel missionId={w.missionId} breakdown={result.breakdown} total={result.total} badge={result.badge}
          levelUp={result.levelUp} unlocked={result.unlocked} onLens={() => openLens(w.missionId)}
          onNext={() => nav(nextRoute)} nextLabel={nextLabel} />
      ) : (
        <Game key={replayKey} onComplete={complete} onLens={(id) => { dispatch({ type: "LENS", missionId: id }); openLens(id); }} />
      )}
    </div>
  );
}

/* ---- Landing ---- */
function Landing() {
  const { state, nav, dispatch } = useGame();
  const [v, setV] = useState(3);
  const [o, setO] = useState(null);
  const [busy, setBusy] = useState(false);
  const demo = (n) => {
    if (busy) return;
    setV(n); setBusy(true); setO(null);
    setTimeout(() => { setO(n * 2 + 1); setBusy(false); }, 560);
  };
  return (
    <div className="wrap" style={{ paddingTop: 26 }}>
      <div className="row" style={{ gap: 10, marginBottom: 30 }}>
        <div style={{ width: 34, height: 34, borderRadius: 11, background: "linear-gradient(135deg,#8B7BFF,#4FA8FF)", display: "grid", placeItems: "center" }}><Sparkles size={17} /></div>
        <b className="mono" style={{ letterSpacing: ".22em", fontSize: 19 }}>AXIOM</b>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "minmax(280px,1fr) minmax(280px,.85fr)", alignItems: "center", gap: 40 }}>
        <div>
          <h1 className="h1">ریاضی رو حفظ نکن.<br />کشفش کن.</h1>
          <p className="lead" style={{ marginTop: 16 }}>
            بازی کن، آزمایش کن و ببین ریاضیات واقعاً چطور کار می‌کند. هیچ پیش‌نیازی لازم نیست و هیچ فرمولی زودتر از موقعش نشانت داده نمی‌شود.
          </p>
          <div className="row wrap-r" style={{ gap: 12, marginTop: 26 }}>
            <Btn variant="btn-primary" size="btn-lg" icon={Play}
              onClick={() => { track("game_started", { returning: state.onboarded }); nav(state.onboarded ? "/home" : "/onboarding"); }}>
              {state.onboarded ? "ادامهٔ بازی" : "شروع بازی"}
            </Btn>
            {state.onboarded && <Btn variant="btn-ghost" icon={Map} onClick={() => nav("/home")}>نقشهٔ دنیا</Btn>}
          </div>
          <div className="row wrap-r" style={{ gap: 18, marginTop: 30 }}>
            {["بدون ثبت‌نام", "۲۰ تا ۳۰ دقیقه", "۴ دنیا و یک چالش نهایی"].map((t) => (
              <span key={t} className="small dim row" style={{ gap: 6 }}><Check size={14} color="var(--ok)" /> {t}</span>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div className="xs dim" style={{ marginBottom: 14 }}>یک ماشین، یک قانون پنهان. عددی را امتحان کن.</div>
          <MachineCore label="DEMO" input={v} output={o} running={busy} tint="var(--p)" />
          <div className="row wrap-r" style={{ justifyContent: "center", gap: 8, marginTop: 18 }}>
            {[1, 2, 3, 4, 7].map((n) => (
              <button key={n} className="btn btn-sm mono" onClick={() => demo(n)} disabled={busy} style={{ minWidth: 44 }}>{n}</button>
            ))}
          </div>
          <p className="xs dim" style={{ textAlign: "center", margin: "16px 0 0" }}>
            قانونش را حدس زدی؟ داخل بازی، همین کشف ۱۰۰ امتیاز دارد.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---- Onboarding ---- */
function Onboarding() {
  const { state, dispatch, nav, say } = useGame();
  const [step, setStep] = useState(0);
  const [conf, setConf] = useState(null);
  const [interest, setInterest] = useState(null);
  const [avatar, setAvatar] = useState("orb");
  const [name, setName] = useState("");

  const finish = () => {
    dispatch({ type: "PROFILE", patch: { mathConfidence: conf, interest, avatar, name: name.trim() || "کاشف" } });
    dispatch({ type: "ONBOARDED" });
    track("game_started", { conf, interest, avatar });
    say("welcome");
    nav("/world/patterns");
  };

  const Q = ({ title, note, options, value, onPick }) => (
    <div className="rise">
      <h2 className="h2">{title}</h2>
      {note && <p className="lead small" style={{ marginTop: 6 }}>{note}</p>}
      <div className="row wrap-r" style={{ gap: 10, marginTop: 20 }}>
        {options.map((o) => (
          <button key={o.id} className={`btn ${value === o.id ? "btn-primary" : ""}`} onClick={() => onPick(o.id)}>{o.fa}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="wrap" style={{ maxWidth: 640, paddingTop: 60 }}>
      <div className="row" style={{ gap: 7, marginBottom: 26 }}>
        {[0, 1, 2].map((i) => <i key={i} style={{ height: 4, width: 44, borderRadius: 99, background: i <= step ? "var(--p)" : "rgba(255,255,255,.14)" }} />)}
      </div>

      {step === 0 && <Q title="چقدر با ریاضی راحتی؟" note="هر جوابی بدهی بازی همان است. فقط می‌خواهیم بدانیم از کجا شروع می‌کنی." options={CONFIDENCE} value={conf} onPick={setConf} />}
      {step === 1 && <Q title="بیشتر به چی علاقه داری؟" note="مثال‌های داخل بازی را به دنیای خودت نزدیک‌تر می‌کنیم." options={INTERESTS} value={interest} onPick={setInterest} />}
      {step === 2 && (
        <div className="rise">
          <h2 className="h2">یک همراه انتخاب کن</h2>
          <p className="lead small" style={{ marginTop: 6 }}>اسمت را هم بنویس تا نُوا بداند با کی حرف می‌زند.</p>
          <div className="row wrap-r" style={{ gap: 14, marginTop: 20 }}>
            {AVATARS.map((a) => (
              <button key={a.id} onClick={() => setAvatar(a.id)} aria-label={a.fa} aria-pressed={avatar === a.id}
                style={{
                  width: 74, height: 74, borderRadius: 22, background: a.g, cursor: "pointer",
                  border: avatar === a.id ? "3px solid var(--gold)" : "3px solid transparent",
                  boxShadow: avatar === a.id ? "0 0 30px rgba(255,209,102,.3)" : "none", transition: "transform .18s",
                }} />
            ))}
          </div>
          <input className="panel" value={name} onChange={(e) => setName(e.target.value)} placeholder="اسمت چیست؟" maxLength={18}
            style={{ marginTop: 20, width: "100%", fontSize: 15, border: "1px solid var(--stroke2)" }} aria-label="نام شما" />
        </div>
      )}

      <div className="row" style={{ justifyContent: "space-between", marginTop: 34 }}>
        <Btn variant="btn-ghost" onClick={() => (step === 0 ? nav("/") : setStep(step - 1))}>برگرد</Btn>
        {step < 2
          ? <Btn variant="btn-primary" icon={ArrowLeft} disabled={(step === 0 && !conf) || (step === 1 && !interest)} onClick={() => setStep(step + 1)}>بعدی</Btn>
          : <Btn variant="btn-primary" size="btn-lg" icon={Play} onClick={finish}>برو به درهٔ الگو</Btn>}
      </div>
      <p className="xs dim" style={{ marginTop: 20 }}>ثبت‌نام لازم نیست. پیشرفتت روی همین دستگاه ذخیره می‌شود.</p>
    </div>
  );
}

/* ---- Dashboard + World Map ---- */
function WorldTile({ w, status, pct, onClick }) {
  const Icon = w.icon;
  return (
    <button className={`tile ${status === "locked" ? "locked" : ""}`} style={{ "--tint": w.tint }} onClick={onClick}
      disabled={status === "locked"} aria-label={`${w.fa} — ${status === "locked" ? "قفل" : `${pct} درصد`}`}>
      <span className="glowdot" />
      <div className="spread" style={{ position: "relative", marginBottom: 14 }}>
        <div className="ico"><Icon size={22} /></div>
        {status === "locked"
          ? <span className="pill"><Lock size={12} /> قفل</span>
          : pct === 100
            ? <span className="pill" style={{ color: "var(--ok)", borderColor: "rgba(47,214,166,.5)" }}><Check size={12} /> کامل</span>
            : <span className="pill" style={{ color: w.tint, borderColor: w.tint }}>{pct > 0 ? "در جریان" : "آماده"}</span>}
      </div>
      <div style={{ position: "relative" }}>
        <div className="h3" style={{ fontSize: 18 }}>{w.fa}</div>
        <div className="xs dim mono" style={{ marginTop: 2 }}>{w.name}</div>
        <p className="small muted" style={{ margin: "10px 0 14px", minHeight: 38 }}>{w.tagline}</p>
        <ProgressBar value={pct} gold={pct === 100} />
        <div className="spread xs dim" style={{ marginTop: 7 }}>
          <span>{MISSIONS[w.missionId].name}</span><span className="num">{pct}%</span>
        </div>
      </div>
    </button>
  );
}

function Dashboard() {
  const { state, nav } = useGame();
  const lvl = levelOf(state.xp), nxt = nextLevel(state.xp);
  const pctNext = nxt ? ((state.xp - lvl.min) / (nxt.min - lvl.min)) * 100 : 100;
  const allDone = allWorldsDone(state);
  const nextWorld = WORLDS.find((w) => !state.progress[w.missionId]?.completed && worldStatus(state, w.id) === "open");
  const learned = CONCEPTS.filter((c) => (state.concepts[c.id] || 0) > 0);
  const mastery = Math.round(mean(CONCEPTS.map((c) => state.concepts[c.id] || 0)));
  const cta = state.finalDone
    ? { title: "همه‌چیز تمام شد", sub: "می‌توانی هر مأموریتی را دوباره بازی کنی یا دانشت را مرور کنی.", label: "صفحهٔ دانش من", route: "/knowledge", tint: "var(--gold)", icon: BookOpen }
    : allDone
      ? { title: "شهر خراب منتظر توست", sub: "چهار مهارتت را در یک چالش ترکیب کن.", label: "شروع چالش نهایی", route: "/challenge", tint: "var(--gold)", icon: Wrench }
      : { title: nextWorld.fa, sub: MISSIONS[nextWorld.missionId].brief, label: (state.progress[nextWorld.missionId]?.pct || 0) > 0 ? "ادامهٔ مأموریت" : "شروع مأموریت", route: nextWorld.route, tint: nextWorld.tint, icon: nextWorld.icon };

  return (
    <div className="wrap" style={{ paddingTop: 26 }}>
      <div className="spread">
        <div>
          <h1 className="h2">سلام {state.profile.name}</h1>
          <p className="muted small" style={{ margin: "4px 0 0" }}>
            سطح {lvl.level} — {lvl.fa}{nxt ? <> · تا سطح بعد <span className="num">{nxt.min - state.xp}</span> XP</> : " · بالاترین سطح"}
          </p>
        </div>
        <div className="row" style={{ gap: 10 }}>
          <span className="pill" style={{ color: "var(--gold)", borderColor: "rgba(255,209,102,.4)" }}><Zap size={13} /> <span className="num">{state.xp}</span> XP</span>
          <span className="pill"><Award size={13} /> <span className="num">{state.badges.length}</span>/{BADGES.length}</span>
        </div>
      </div>
      <div style={{ marginTop: 12 }}><ProgressBar value={pctNext} /></div>

      {/* بزرگ‌ترین CTA صفحه */}
      <button className="tile" style={{ "--tint": cta.tint, marginTop: 24, padding: 26 }} onClick={() => nav(cta.route)}>
        <span className="glowdot" style={{ width: 260, height: 260, opacity: .3 }} />
        <div className="spread" style={{ position: "relative", gap: 20 }}>
          <div>
            <div className="xs dim">{state.finalDone ? "کارت تمام است" : "ادامه بده"}</div>
            <div className="h2" style={{ marginTop: 4 }}>{cta.title}</div>
            <p className="lead small" style={{ marginTop: 8, maxWidth: "46ch" }}>{cta.sub}</p>
          </div>
          <div className="stack" style={{ alignItems: "center", gap: 12 }}>
            <div className="ico" style={{ width: 60, height: 60, borderRadius: 18 }}><cta.icon size={28} /></div>
            <span className="btn btn-primary">{cta.label}</span>
          </div>
        </div>
      </button>

      <Section title="نقشهٔ دنیا" note="مناطق به‌ترتیب باز می‌شوند">
        <div className="grid g2">
          {WORLDS.map((w) => (
            <WorldTile key={w.id} w={w} status={worldStatus(state, w.id)}
              pct={state.progress[w.missionId]?.completed ? 100 : state.progress[w.missionId]?.pct || 0}
              onClick={() => nav(w.route)} />
          ))}
        </div>
      </Section>

      <div className="grid g2" style={{ marginTop: 34, alignItems: "start" }}>
        <div className="card">
          <div className="spread" style={{ marginBottom: 12 }}>
            <h3 className="h3">تازه یاد گرفته‌ای</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => nav("/knowledge")}>دانش من</button>
          </div>
          {learned.length === 0
            ? <p className="small dim" style={{ margin: 0 }}>هنوز چیزی اینجا نیست. اولین مأموریت را شروع کن تا مفاهیم اینجا ظاهر شوند.</p>
            : <div className="row wrap-r" style={{ gap: 8 }}>
                {learned.slice(-5).map((c) => (
                  <span key={c.id} className="chip">
                    {c.fa} <span className="xs dim mono">{c.en}</span>
                    <span className="num xs" style={{ color: (state.concepts[c.id] || 0) === 100 ? "var(--gold)" : "var(--p)" }}>{state.concepts[c.id]}%</span>
                  </span>
                ))}
              </div>}
          <div className="hr" />
          <div className="spread small"><span className="muted">پیشرفت کلی دانش</span><span className="num">{mastery}%</span></div>
          <div style={{ marginTop: 8 }}><ProgressBar value={mastery} gold /></div>
        </div>

        <div className="card">
          <div className="spread" style={{ marginBottom: 14 }}>
            <h3 className="h3">نشان‌ها</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => nav("/profile")}>پروفایل</button>
          </div>
          <div className="row wrap-r" style={{ gap: 12 }}>
            {BADGES.map((b) => {
              const on = state.badges.includes(b.id);
              return (
                <div key={b.id} className="stack" style={{ alignItems: "center", gap: 6, width: 76 }} title={b.how}>
                  <div className={`badge-t ${on ? "" : "off"}`}><b.icon size={24} /></div>
                  <span className="xs" style={{ color: on ? "var(--text)" : "var(--dim)", textAlign: "center" }}>{b.fa}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Knowledge ---- */
function Knowledge() {
  const { state, nav } = useGame();
  const stateOf = (id) => { const m = state.concepts[id] || 0; return m >= 100 ? "mastered" : m > 0 ? "learning" : "locked"; };
  const LABEL = { mastered: "تسلط کامل", learning: "در حال یادگیری", locked: "هنوز باز نشده" };
  return (
    <div className="wrap" style={{ paddingTop: 26 }}>
      <h1 className="h2">دانش من</h1>
      <p className="lead small" style={{ marginTop: 6 }}>هر مفهومی که در بازی با آن کار کرده‌ای اینجا ثبت می‌شود. تسلط با انجام مأموریت بدون راهنما و بعد با چالش نهایی کامل می‌شود.</p>
      <div className="row wrap-r" style={{ gap: 14, marginTop: 16 }}>
        {["locked", "learning", "mastered"].map((k) => (
          <span key={k} className="small dim row" style={{ gap: 7 }}>
            <i style={{ width: 10, height: 10, borderRadius: 3, background: k === "mastered" ? "var(--gold)" : k === "learning" ? "var(--p)" : "rgba(255,255,255,.2)" }} />
            {LABEL[k]}
          </span>
        ))}
      </div>

      <div className="grid g2" style={{ marginTop: 26 }}>
        {WORLDS.map((w) => {
          const roots = CONCEPTS.filter((c) => c.world === w.id && !c.parent);
          const chain = (c, depth) => {
            const kids = CONCEPTS.filter((k) => k.parent === c.id);
            const st = stateOf(c.id);
            return (
              <div key={c.id}>
                {depth > 0 && <div className="spine" />}
                <div className={`node ${st}`} style={{ marginInlineStart: depth * 18 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 10, display: "grid", placeItems: "center", background: "rgba(255,255,255,.06)", flex: "0 0 auto" }}>
                    {st === "mastered" ? <Star size={15} color="var(--gold)" /> : st === "learning" ? <Layers size={15} color="var(--p)" /> : <Lock size={14} color="var(--dim)" />}
                  </div>
                  <div className="grow">
                    <div className="row" style={{ gap: 7 }}>
                      <b style={{ fontSize: 14.5 }}>{c.fa}</b><span className="xs dim mono">{c.en}</span>
                    </div>
                    <p className="xs dim" style={{ margin: "2px 0 6px" }}>{c.desc}</p>
                    <ProgressBar value={state.concepts[c.id] || 0} gold={st === "mastered"} />
                  </div>
                  <span className="num xs" style={{ color: st === "mastered" ? "var(--gold)" : st === "learning" ? "var(--p)" : "var(--dim)" }}>{state.concepts[c.id] || 0}%</span>
                </div>
                {kids.map((k) => chain(k, depth + 1))}
              </div>
            );
          };
          return (
            <div key={w.id} className="card">
              <div className="row" style={{ gap: 10, marginBottom: 14 }}>
                <div className="ico" style={{ "--tint": w.tint, width: 36, height: 36, borderRadius: 12, display: "grid", placeItems: "center", background: `color-mix(in srgb, ${w.tint} 20%, transparent)`, border: `1px solid color-mix(in srgb, ${w.tint} 42%, transparent)`, color: w.tint }}>
                  <w.icon size={17} />
                </div>
                <div><div className="h3">{w.fa}</div><div className="xs dim mono">{w.name}</div></div>
              </div>
              <div className="stack" style={{ gap: 10 }}>{roots.map((c) => chain(c, 0))}</div>
            </div>
          );
        })}
      </div>
      <div className="row" style={{ marginTop: 26 }}><Btn variant="btn-ghost" icon={Map} onClick={() => nav("/home")}>برگرد به نقشه</Btn></div>
    </div>
  );
}

/* ---- Profile ---- */
function Profile() {
  const { state, dispatch, nav, pushToast } = useGame();
  const lvl = levelOf(state.xp);
  const av = AVATARS.find((a) => a.id === state.profile.avatar) || AVATARS[0];
  const [confirm, setConfirm] = useState(false);
  const doneCount = missionList.filter((m) => state.progress[m.id]?.completed).length;
  const hints = sum(missionList.map((m) => state.progress[m.id]?.hintsUsed || 0));
  const tries = sum(missionList.map((m) => state.progress[m.id]?.attempts || 0));

  return (
    <div className="wrap" style={{ paddingTop: 26 }}>
      <div className="card">
        <div className="row wrap-r" style={{ gap: 18 }}>
          <div style={{ width: 78, height: 78, borderRadius: 24, background: av.g, flex: "0 0 auto" }} />
          <div className="grow">
            <h1 className="h2">{state.profile.name}</h1>
            <div className="row wrap-r" style={{ gap: 8, marginTop: 8 }}>
              <span className="pill" style={{ color: "var(--p)", borderColor: "rgba(139,123,255,.5)" }}><Star size={13} /> سطح {lvl.level} — {lvl.fa}</span>
              <span className="pill" style={{ color: "var(--gold)", borderColor: "rgba(255,209,102,.4)" }}><Zap size={13} /> <span className="num">{state.xp}</span> XP</span>
              {state.profile.interest && <span className="pill">علاقه: {INTERESTS.find((i) => i.id === state.profile.interest)?.fa}</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="grid g4" style={{ marginTop: 18 }}>
        {[
          { l: "مأموریت‌های تمام‌شده", v: `${doneCount}/${missionList.length}` },
          { l: "نشان‌ها", v: `${state.badges.length}/${BADGES.length}` },
          { l: "راهنماهای استفاده‌شده", v: hints },
          { l: "تلاش‌های ناموفق", v: tries },
        ].map((s) => (
          <div key={s.l} className="card tight"><div className="xs dim">{s.l}</div><div className="num" style={{ fontSize: 26 }}>{s.v}</div></div>
        ))}
      </div>

      <Section title="نشان‌ها">
        <div className="grid g4">
          {BADGES.map((b) => {
            const on = state.badges.includes(b.id);
            return (
              <div key={b.id} className="card tight" style={{ opacity: on ? 1 : .6, textAlign: "center" }}>
                <div className={`badge-t ${on ? "pop" : "off"}`} style={{ margin: "0 auto 10px" }}><b.icon size={26} /></div>
                <div className="h3" style={{ fontSize: 14 }}>{b.fa}</div>
                <div className="xs dim mono">{b.en}</div>
                <div className="xs dim" style={{ marginTop: 6 }}>{on ? "به‌دست آمد" : b.how}</div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="تنظیمات">
        <div className="card">
          <div className="spread">
            <div><div className="h3">صدای بازی</div><p className="xs dim" style={{ margin: "3px 0 0" }}>افکت‌های کوتاه هنگام آزمایش و کشف</p></div>
            <Btn variant={state.settings.sound ? "btn-primary" : "btn-ghost"} icon={state.settings.sound ? Volume2 : VolumeX}
              onClick={() => dispatch({ type: "SOUND", on: !state.settings.sound })}>
              {state.settings.sound ? "روشن" : "خاموش"}
            </Btn>
          </div>
          <div className="hr" />
          <div className="spread">
            <div>
              <div className="h3">شروع دوباره از صفر</div>
              <p className="xs dim" style={{ margin: "3px 0 0" }}>همهٔ XP، نشان‌ها و پیشرفت پاک می‌شود. این کار برگشت‌پذیر نیست.</p>
            </div>
            {confirm
              ? <div className="row" style={{ gap: 8 }}>
                  <Btn size="btn-sm" variant="btn-ghost" onClick={() => setConfirm(false)}>پشیمان شدم</Btn>
                  <Btn size="btn-sm" style={{ borderColor: "var(--bad)", color: "var(--bad)" }}
                    onClick={async () => { await Store.clear(KEY); dispatch({ type: "RESET" }); pushToast({ text: "پیشرفت پاک شد", icon: RefreshCw }); nav("/"); }}>
                    پاک کن
                  </Btn>
                </div>
              : <Btn variant="btn-ghost" icon={RefreshCw} onClick={() => setConfirm(true)}>پاک کردن پیشرفت</Btn>}
          </div>
          <div className="hr" />
          <p className="xs dim" style={{ margin: 0 }}>
            حالت مهمان فعال است و پیشرفتت روی همین دستگاه ذخیره می‌شود. لایهٔ ذخیره‌سازی جدا نوشته شده تا بعداً بشود آن را به حساب کاربری وصل کرد.
          </p>
        </div>
      </Section>
    </div>
  );
}

/* ---- Final Challenge: The Broken City ---- */
function Task({ n, total, title, brief, tint, children }) {
  return (
    <div className="stage rise">
      <div className="spread" style={{ marginBottom: 12 }}>
        <div>
          <div className="xs dim mono">SYSTEM {n}/{total}</div>
          <div className="h3" style={{ fontSize: 18, marginTop: 2 }}>{title}</div>
        </div>
        <Steps total={total} at={n} tint={tint} />
      </div>
      <p className="small muted" style={{ margin: "0 0 16px" }}>{brief}</p>
      {children}
    </div>
  );
}

function TaskReactor({ onSolved }) {
  const rule = (x) => x * 3 - 2;
  const [v, setV] = useState(2), [o, setO] = useState(null), [busy, setBusy] = useState(false);
  const [runs, setRuns] = useState(0), [g, setG] = useState(""), [tries, setTries] = useState(0), [shown, setShown] = useState(false);
  const run = () => { if (busy) return; setBusy(true); setO(null); setTimeout(() => { setO(rule(v)); setBusy(false); setRuns((r) => r + 1); Sfx.play("tick"); }, 520); };
  const check = () => {
    const ok = Number(g) === rule(6);
    track("prediction_made", { stage: "final_reactor", guess: g, correct: ok });
    if (ok) { Sfx.play("ok"); onSolved(tries === 0); }
    else { Sfx.play("bad"); setTries((t) => t + 1); if (tries >= 2) setShown(true); }
  };
  return (
    <Task n={1} total={4} title="راکتور مرکزی" tint="var(--p)"
      brief="راکتور فقط با عدد درست روشن می‌شود. این ماشین قانون تازه‌ای دارد — چند عدد امتحان کن و بعد بگو با ورودی ۶ چه می‌دهد.">
      <MachineCore label="RCT-9" input={v} output={o} running={busy} tint="var(--p)" />
      <div style={{ maxWidth: 430, margin: "22px auto 0" }}>
        <NumberDial value={v} setValue={setV} min={0} max={12} disabled={busy} />
        <div className="row" style={{ justifyContent: "center", marginTop: 14 }}>
          <Btn variant="btn-ghost" icon={Play} onClick={run} disabled={busy}>آزمایش کن</Btn>
        </div>
        {runs >= 2 && (
          <div className="panel rise" style={{ marginTop: 16, borderColor: "rgba(255,209,102,.4)" }}>
            <div className="h3" style={{ fontSize: 15 }}>با ورودی <span className="num" style={{ color: "var(--gold)" }}>6</span> خروجی چه می‌شود؟</div>
            <div className="row" style={{ marginTop: 10 }}>
              <input className="panel grow mono" inputMode="numeric" value={g} onChange={(e) => setG(e.target.value.replace(/[^\d-]/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && check()} placeholder="؟" aria-label="حدس خروجی راکتور"
                style={{ fontSize: 20, textAlign: "center", border: "1px solid var(--stroke2)" }} />
              <Btn variant="btn-primary" onClick={check} disabled={!g.trim()}>تأیید</Btn>
            </div>
            {tries > 0 && !shown && <p className="small" style={{ color: "var(--bad)", margin: "8px 0 0" }}>نشد. ببین از هر عدد به عدد بعدی چقدر اضافه می‌شود.</p>}
            {shown && <p className="small" style={{ color: "var(--gold)", margin: "8px 0 0" }}>راهنما: قانون این ماشین <span className="mono">×3 − 2</span> است.</p>}
          </div>
        )}
        {runs < 2 && <p className="xs dim" style={{ textAlign: "center", marginTop: 12 }}>حداقل دو آزمایش لازم است</p>}
      </div>
    </Task>
  );
}

const PROUTES = [
  { id: "A", fa: "خط پشتیبان", p: 0.8, reward: 40, tint: "var(--d)" },
  { id: "B", fa: "خط اصلی", p: 0.5, reward: 90, tint: "var(--c)" },
  { id: "C", fa: "خط آزمایشی", p: 0.2, reward: 200, tint: "var(--bad)" },
];
function TaskGrid({ onSolved }) {
  const [pick, setPick] = useState(null), [tries, setTries] = useState(0), [shown, setShown] = useState(false);
  const [stats, setStats] = useState({ A: { n: 0, win: 0 }, B: { n: 0, win: 0 }, C: { n: 0, win: 0 } });
  const [busy, setBusy] = useState(false);
  const sim = () => {
    if (busy) return;
    setBusy(true); track("simulation_run", { stage: "final_grid", n: 200 });
    let c = 0;
    const iv = setInterval(() => {
      setStats((s) => {
        const ns = { ...s };
        PROUTES.forEach((r) => { let w = 0; for (let i = 0; i < 10; i++) if (Math.random() < r.p) w++; ns[r.id] = { n: ns[r.id].n + 10, win: ns[r.id].win + w }; });
        return ns;
      });
      if (++c >= 20) { clearInterval(iv); setBusy(false); }
    }, 40);
  };
  const check = () => {
    const ok = pick === "B";
    track("prediction_made", { stage: "final_grid", pick, correct: ok });
    if (ok) { Sfx.play("ok"); onSolved(tries === 0); }
    else { Sfx.play("bad"); setTries((t) => t + 1); if (tries >= 2) setShown(true); }
  };
  const maxAvg = Math.max(1, ...PROUTES.map((r) => (stats[r.id].n ? (stats[r.id].win * r.reward) / stats[r.id].n : 0)));
  return (
    <Task n={2} total={4} title="شبکهٔ برق" tint="var(--c)"
      brief="سه خط انتقال داریم و فقط یکی را می‌توانیم راه بیندازیم. کدام‌یک در بلندمدت بیشترین انرژی را به شهر می‌رساند؟">
      <div className="grid g3">
        {PROUTES.map((r) => <RouteCard key={r.id} r={r} stat={stats[r.id]} selected={pick === r.id} onPick={() => setPick(r.id)} disabled={busy} />)}
      </div>
      {stats.A.n > 0 && <div style={{ marginTop: 18 }}><div className="grid g3">{PROUTES.map((r) => <SimColumn key={r.id} r={r} stat={stats[r.id]} maxAvg={maxAvg} />)}</div></div>}
      <div className="row wrap-r" style={{ justifyContent: "center", gap: 10, marginTop: 18 }}>
        <Btn variant="btn-ghost" icon={Repeat} onClick={sim} disabled={busy}>۲۰۰ بار شبیه‌سازی کن</Btn>
        <Btn variant="btn-primary" icon={Check} onClick={check} disabled={!pick}>همین خط را راه بینداز</Btn>
      </div>
      {tries > 0 && !shown && <p className="small" style={{ color: "var(--bad)", textAlign: "center", marginTop: 10 }}>شانس را در پاداش ضرب کن، نه اینکه فقط به یکی‌شان نگاه کنی.</p>}
      {shown && <p className="small mono" style={{ color: "var(--gold)", textAlign: "center", marginTop: 10 }}>A: 0.8×40=32 · B: 0.5×90=45 · C: 0.2×200=40</p>}
    </Task>
  );
}

function TaskSensors({ onSolved }) {
  const VALUES = [16, 20, 25, 29, 34, 38, 43, 47, 96], OUT = 8;
  const [marked, setMarked] = useState(null), [tries, setTries] = useState(0);
  const pick = (i) => {
    track("prediction_made", { stage: "final_sensors", value: VALUES[i], correct: i === OUT });
    if (i === OUT) { setMarked(i); Sfx.play("ok"); setTimeout(() => onSolved(tries === 0), 600); }
    else { Sfx.play("bad"); setTries((t) => t + 1); }
  };
  return (
    <Task n={3} total={4} title="حسگرهای شهر" tint="var(--d)"
      brief="نُه حسگر شهر، زمان پاسخ‌شان را گزارش کرده‌اند. یکی خراب است و عدد بی‌معنی می‌فرستد. پیدایش کن — و ببین خط طلایی میانگین چقدر به سمتش کشیده شده، در حالی که خط آبی میانه سر جایش مانده.">
      <DataBubbles values={VALUES} removed={[]} onToggle={pick} inspected={[]} onInspect={() => {}} showZone={false} marked={marked}
        meanV={mean(VALUES)} medianV={median(VALUES)} showStats={true}
        caption="زمان پاسخ (ثانیه) — هر دایره یک حسگر"
        labelOf={(v, i) => `حسگر شمارهٔ ${i + 1}، زمان پاسخ ${v} ثانیه`} />
      {tries > 0 && !marked && <p className="small" style={{ color: "var(--bad)", textAlign: "center", marginTop: 10 }}>این یکی کنار بقیه جا می‌شود. دنبال عددی بگرد که از همه دور افتاده.</p>}
      {marked !== null && <p className="small" style={{ color: "var(--ok)", textAlign: "center", marginTop: 10 }}>حسگر خراب پیدا شد — همین یک عدد، میانگین کل شهر را جابه‌جا کرده بود.</p>}
    </Task>
  );
}

function TaskDrone({ onSolved }) {
  const TARGET = { x: -2, y: 3 };
  const [vx, setVx] = useState(0), [vy, setVy] = useState(0), [locked, setLocked] = useState(false);
  const win = vx === TARGET.x && vy === TARGET.y;
  useEffect(() => {
    if (win && !locked) { setLocked(true); Sfx.play("up"); const t = setTimeout(() => onSolved(true), 800); return () => clearTimeout(t); }
  }, [win]);
  return (
    <Task n={4} total={4} title="پهپاد تعمیرات" tint="var(--v)"
      brief="پهپاد از مرکز شهر پرواز می‌کند. با دو عدد ببرش روی آنتن. این بار جهت‌ها می‌توانند منفی هم باشند.">
      <VectorGrid cols={7} rows={6} origin={{ x: 3, y: 2 }} robot={{ x: vx, y: vy }} target={TARGET} showArrow tint="var(--v)" />
      <div className="grid g2" style={{ marginTop: 14 }}>
        <div className="panel">
          <div className="spread"><span className="small muted">افقی (x)</span><span className="num" style={{ color: "var(--v)", fontSize: 20 }}>{vx}</span></div>
          <input className="sl" type="range" min="-3" max="3" step="1" value={vx} onChange={(e) => setVx(Number(e.target.value))} aria-label="مؤلفهٔ افقی" />
        </div>
        <div className="panel">
          <div className="spread"><span className="small muted">عمودی (y)</span><span className="num" style={{ color: "var(--v)", fontSize: 20 }}>{vy}</span></div>
          <input className="sl" type="range" min="-2" max="3" step="1" value={vy} onChange={(e) => setVy(Number(e.target.value))} aria-label="مؤلفهٔ عمودی" />
        </div>
      </div>
      <div className="row wrap-r" style={{ justifyContent: "center", gap: 12, marginTop: 14 }}>
        <span className="chip mono" style={{ fontSize: 16, borderColor: "var(--v)" }}>v = ({vx}, {vy})</span>
        <span className="chip mono" style={{ fontSize: 16 }}>|v| = {fmt(Math.hypot(vx, vy), 2)}</span>
        {win && <span className="pill" style={{ color: "var(--ok)", borderColor: "var(--ok)" }}><Check size={14} /> روی آنتن</span>}
      </div>
    </Task>
  );
}

function FinalChallenge() {
  const { state, dispatch, nav, pushToast, say } = useGame();
  const ready = allWorldsDone(state);
  const [step, setStep] = useState(0);
  const [clean, setClean] = useState(0);
  const [celebrate, setCelebrate] = useState(state.finalDone);

  useEffect(() => { if (ready && !state.finalDone) { track("mission_started", { missionId: "final" }); say("final_intro"); } }, []);

  const solved = (perfect) => {
    if (perfect) setClean((c) => c + 1);
    Sfx.play("ok");
    if (step < 3) { pushToast({ text: `سیستم ${step + 1} وصل شد`, icon: Check, tint: "var(--ok)" }); setStep(step + 1); }
    else finish();
  };

  const finish = () => {
    const xp = 300;
    dispatch({ type: "COMPLETE_FINAL", xp });
    track("final_challenge_completed", { xp, cleanSolves: clean });
    pushToast({ text: `+${xp} XP`, icon: Zap, tint: "var(--gold)" });
    setTimeout(() => pushToast({ text: "نشان نجات‌دهندهٔ شهر", icon: Trophy, tint: "var(--gold)" }), 550);
    setCelebrate(true);
  };

  if (!ready) {
    return (
      <div className="wrap"><div className="card" style={{ textAlign: "center", marginTop: 40 }}>
        <Lock size={30} style={{ opacity: .6 }} />
        <h2 className="h2" style={{ marginTop: 12 }}>چالش نهایی هنوز قفل است</h2>
        <p className="lead" style={{ margin: "8px auto 18px" }}>اول هر چهار منطقه را تمام کن. بعد شهر خراب باز می‌شود.</p>
        <Btn variant="btn-primary" icon={Map} onClick={() => nav("/home")}>برگرد به نقشه</Btn>
      </div></div>
    );
  }
  if (celebrate) return <Celebration />;

  const TASKS = [TaskReactor, TaskGrid, TaskSensors, TaskDrone];
  const Cur = TASKS[step];
  return (
    <div className="wrap" style={{ paddingTop: 26 }}>
      <div className="spread" style={{ marginBottom: 18 }}>
        <div>
          <button className="btn btn-ghost btn-sm" onClick={() => nav("/home")}><ChevronLeft size={15} style={{ transform: "scaleX(-1)" }} /> نقشه</button>
          <h1 className="h2" style={{ marginTop: 10 }}>شهر خراب</h1>
          <p className="lead small" style={{ marginTop: 4 }}>سیستم مرکزی از کار افتاده. چیز تازه‌ای یاد نمی‌گیری — فقط از همان چهار چیزی که بلدی استفاده کن.</p>
        </div>
        <span className="pill" style={{ color: "var(--gold)", borderColor: "rgba(255,209,102,.4)" }}><Wrench size={13} /> {step}/4 سیستم وصل شد</span>
      </div>
      <Cur key={step} onSolved={solved} />
    </div>
  );
}

/* ---- Celebration ---- */
function Celebration() {
  const { state, nav } = useGame();
  const [soon, setSoon] = useState(false);
  const learned = CONCEPTS;
  return (
    <div className="wrap" style={{ paddingTop: 40, textAlign: "center" }}>
      <Confetti n={44} />
      <div className="badge-t" style={{ margin: "0 auto 18px", width: 82, height: 82, borderRadius: 26 }}><Trophy size={38} /></div>
      <div className="mono" style={{ fontSize: "clamp(38px,9vw,74px)", fontWeight: 800, letterSpacing: ".2em", lineHeight: 1.1 }}>AXIOM</div>
      <div className="mono" style={{ fontSize: 16, letterSpacing: ".3em", color: "var(--gold)", marginTop: 8 }}>LEVEL 1 COMPLETE</div>
      <p className="lead" style={{ margin: "22px auto 0", textAlign: "center" }}>
        تو بدون خواندن یک فصل کتاب، با تابع، احتمال، داده و بردار کار کردی.
      </p>

      <div className="card" style={{ marginTop: 30, textAlign: "right" }}>
        <h3 className="h3" style={{ marginBottom: 14 }}>چیزهایی که کشف کردی</h3>
        <div className="row wrap-r" style={{ gap: 9 }}>
          {learned.map((c) => (
            <span key={c.id} className="chip" style={{ borderColor: "rgba(255,209,102,.4)" }}>
              <Star size={13} color="var(--gold)" /> {c.fa} <span className="xs dim mono">{c.en}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="row wrap-r" style={{ justifyContent: "center", gap: 12, marginTop: 26 }}>
        <Btn variant="btn-gold" size="btn-lg" icon={BookOpen} onClick={() => nav("/knowledge")}>دانش من</Btn>
        <Btn variant="btn-ghost" icon={RotateCcw} onClick={() => nav("/home")}>بازی دوباره</Btn>
        <Btn variant="btn-ghost" icon={Compass} onClick={() => setSoon((s) => !s)}>دنیاهای بعدی</Btn>
      </div>

      {soon && (
        <div className="grid g3 rise" style={{ marginTop: 26 }}>
          {COMING_SOON.map((w) => (
            <div key={w.en} className="card tight" style={{ opacity: .62 }}>
              <Lock size={16} style={{ opacity: .6 }} />
              <div className="h3" style={{ fontSize: 15, marginTop: 8 }}>{w.fa}</div>
              <div className="xs dim mono">{w.en}</div>
              <div className="xs dim" style={{ marginTop: 6 }}>به‌زودی</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ====================== §12 — APP SHELL & ROUTER ========================= */

function LensPicker({ onPick, onClose }) {
  const { state } = useGame();
  return (
    <Modal onClose={onClose} label="انتخاب ذره‌بین">
      <div className="spread" style={{ marginBottom: 16 }}>
        <div><div className="h3">ذره‌بین ریاضی</div><div className="xs dim">مفهومی که می‌خواهی دوباره ببینی را انتخاب کن</div></div>
        <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="بستن"><X size={16} /></button>
      </div>
      <div className="stack" style={{ gap: 10 }}>
        {state.lenses.map((id) => {
          const L = LENSES[id], M = MISSIONS[id];
          return (
            <button key={id} className="node learning" style={{ cursor: "pointer", textAlign: "right" }} onClick={() => onPick(id)}>
              <Eye size={17} color={L.tint} />
              <div className="grow"><b style={{ fontSize: 14.5 }}>{L.l2name}</b><div className="xs dim">{M.name}</div></div>
              <ChevronLeft size={16} />
            </button>
          );
        })}
      </div>
    </Modal>
  );
}

function Header() {
  const { state, nav, openLens } = useGame();
  const lvl = levelOf(state.xp), nxt = nextLevel(state.xp);
  const pct = nxt ? ((state.xp - lvl.min) / (nxt.min - lvl.min)) * 100 : 100;
  const hasLens = state.lenses.length > 0;
  const NavBtn = ({ route, icon: I, label }) => (
    <button className="btn btn-ghost btn-icon" onClick={() => nav(route)} aria-label={label} title={label}
      style={{ borderColor: state.route === route ? "var(--stroke2)" : "transparent", background: state.route === route ? "var(--glass2)" : "transparent" }}>
      <I size={17} />
    </button>
  );
  return (
    <header className="hdr">
      <div className="hdr-in">
        <button className="brand" onClick={() => nav("/home")} aria-label="خانهٔ AXIOM">
          <div style={{ width: 30, height: 30, borderRadius: 10, background: "linear-gradient(135deg,#8B7BFF,#4FA8FF)", display: "grid", placeItems: "center" }}><Sparkles size={15} /></div>
          <b>AXIOM</b>
        </button>

        <div className="xprail grow">
          <div className="spread xs" style={{ marginBottom: 4 }}>
            <span className="dim">سطح {lvl.level} · {lvl.fa}</span>
            <span className="num" style={{ color: "var(--gold)" }}>{state.xp} XP</span>
          </div>
          <ProgressBar value={pct} />
        </div>

        <div className="row" style={{ gap: 6, marginInlineStart: "auto" }}>
          <button className="btn" disabled={!hasLens} onClick={() => openLens()} title={hasLens ? "ذره‌بین ریاضی" : "بعد از اولین کشف فعال می‌شود"}
            style={{ borderColor: hasLens ? "rgba(255,209,102,.5)" : "var(--stroke)", color: hasLens ? "var(--gold)" : undefined, padding: "9px 13px" }}>
            <Eye size={16} /><span className="small" style={{ marginInlineStart: 6 }}>ذره‌بین</span>
          </button>
          <NavBtn route="/home" icon={Map} label="نقشهٔ دنیا" />
          <NavBtn route="/knowledge" icon={BookOpen} label="دانش من" />
          <NavBtn route="/profile" icon={User} label="پروفایل" />
        </div>
      </div>
    </header>
  );
}

function Loading() {
  return (
    <div className="wrap" style={{ paddingTop: 90, textAlign: "center" }}>
      <div className="float" style={{ width: 52, height: 52, borderRadius: 17, background: "linear-gradient(135deg,#8B7BFF,#4FA8FF)", display: "grid", placeItems: "center", margin: "0 auto 18px" }}>
        <Sparkles size={24} />
      </div>
      <div className="h3">در حال باز کردن دنیا…</div>
      <p className="small dim" style={{ marginTop: 6 }}>پیشرفت ذخیره‌شده‌ات را برمی‌داریم</p>
    </div>
  );
}

function NotFound() {
  const { nav } = useGame();
  return (
    <div className="wrap"><div className="card" style={{ textAlign: "center", marginTop: 50 }}>
      <Compass size={30} style={{ opacity: .6 }} />
      <h2 className="h2" style={{ marginTop: 12 }}>این مسیر روی نقشه نیست</h2>
      <p className="lead" style={{ margin: "8px auto 18px" }}>صفحه‌ای که دنبالش بودی وجود ندارد. برگرد به نقشه و از آنجا ادامه بده.</p>
      <Btn variant="btn-primary" icon={Map} onClick={() => nav("/home")}>نقشهٔ دنیا</Btn>
    </div></div>
  );
}

export default function AxiomApp() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [toasts, setToasts] = useState([]);
  const [nova, setNova] = useState(null);
  const [lens, setLens] = useState(null);
  const novaId = useRef(0);

  /* hydrate */
  useEffect(() => {
    let alive = true;
    (async () => {
      const saved = await Store.get(KEY);
      if (!alive) return;
      if (saved) { Sfx.on = !!saved.settings?.sound; dispatch({ type: "HYDRATE", payload: saved }); }
      else dispatch({ type: "HYDRATE", payload: {} });
    })();
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "fa");
    return () => { alive = false; };
  }, []);

  /* persist (debounced) */
  useEffect(() => {
    if (!state.hydrated) return;
    const t = setTimeout(() => {
      const { hydrated, ...rest } = state;
      Store.set(KEY, rest);
    }, 250);
    return () => clearTimeout(t);
  }, [state]);

  const pushToast = useCallback((t) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((s) => [...s, { ...t, id }]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 3400);
  }, []);

  const say = useCallback(async (key, fallback) => {
    const text = await novaProvider.getMessage({ key, fallback, provider: novaProvider.id });
    if (text) setNova({ text, id: ++novaId.current });
  }, []);

  const nav = useCallback((route) => {
    dispatch({ type: "NAV", route });
    track("page_view", { route });
    if (typeof window !== "undefined") window.scrollTo(0, 0);
  }, []);

  const openLens = useCallback((missionId) => {
    if (missionId) { dispatch({ type: "LENS", missionId }); setLens(missionId); return; }
    setLens((cur) => cur || (state.lenses.length === 1 ? state.lenses[0] : "picker"));
  }, [state.lenses]);

  const api = useMemo(() => ({ state, dispatch, nav, say, pushToast, openLens }), [state, nav, say, pushToast, openLens]);

  const R = state.route;
  const chrome = state.hydrated && R !== "/" && R !== "/onboarding";
  let page;
  if (!state.hydrated) page = <Loading />;
  else if (R === "/") page = <Landing />;
  else if (R === "/onboarding") page = <Onboarding />;
  else if (R === "/home") page = <Dashboard />;
  else if (R === "/world/patterns") page = <WorldPage worldId="patterns" />;
  else if (R === "/world/probability") page = <WorldPage worldId="probability" />;
  else if (R === "/world/statistics") page = <WorldPage worldId="statistics" />;
  else if (R === "/world/vectors") page = <WorldPage worldId="vectors" />;
  else if (R === "/challenge") page = <FinalChallenge />;
  else if (R === "/knowledge") page = <Knowledge />;
  else if (R === "/profile") page = <Profile />;
  else page = <NotFound />;

  return (
    <Ctx.Provider value={api}>
      <div className="ax" dir="rtl" lang="fa">
        <style>{CSS}</style>
        <Particles />
        {chrome && <Header />}
        <main style={{ position: "relative", zIndex: 1 }} key={R}>{page}</main>
        {chrome && <NovaDock msg={nova} onClose={() => setNova(null)} />}
        <Toasts items={toasts} />
        {lens && lens !== "picker" && <MathLensModal missionId={lens} onClose={() => setLens(null)} />}
        {lens === "picker" && <LensPicker onClose={() => setLens(null)} onPick={(id) => setLens(id)} />}
      </div>
    </Ctx.Provider>
  );
}
