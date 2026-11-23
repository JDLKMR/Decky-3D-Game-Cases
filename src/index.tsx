import { callable, definePlugin, routerHook } from "@decky/api";
import {
  ButtonItem, DialogButton, Focusable, Navigation, PanelSection, PanelSectionRow, Router, SliderField, staticClasses,
  Tabs, TextField, ToggleField,
} from "@decky/ui";
import { Fragment, useEffect, useState } from "react";
import {
  CART_PRESET_IDS, COLOR_PRESETS, OV_KEYS, THICK_MAX, thicknessName, WEAR_SORTED, THICK_MIN, DISC_PRESET_IDS, HslColor, ItemOv, Look, CheckLine, CustomColor, DEFAULTS, Engine, InsertArt, Provider,
  SHAPE_IDS, SHAPE_LABELS, Settings, ShapeId, StyleId, WEAR_LABELS, TEMPLATES, TemplateIn, autoWindowColor, whiteWindowColor, buildMedia, caseColorOf, cssToHsl, loadSettings, withLessMotion,
  ART_Y_MAX, ART_Y_MIN, LOGO_POS_IDS, LOGO_POS_LABELS, loadTemplates, lookForIds, mediaColorOf, mediaGeom, normId, paletteFor, registerTemplates, saveSettings, styleLabel, templateIds, wearCss,
} from "./engine";
import { LaunchGate } from "./launch";

const PAGE = "/sanso-3d-cases";

// The plugin's icon: an isometric cube drawn at a true isometric proportion (about 0.8 as wide as high), so it is
// narrower than the old Font Awesome cube, which was as wide as it was tall and looked stretched.
function CubeIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinejoin="round" strokeLinecap="round">
      <path d="M12 1.6 20.6 6.6 20.6 17.4 12 22.4 3.4 17.4 3.4 6.6 Z" />
      <path d="M3.4 6.6 12 11.6 20.6 6.6" />
      <path d="M12 11.6 12 22.4" />
    </svg>
  );
}

// ---------- Steam data (undocumented, every access is guarded) ----------

function steamDocuments(): Document[] {
  const out: Document[] = [];
  const add = (w: any) => {
    try { if (w && w.document && w.document.body && out.indexOf(w.document) < 0) out.push(w.document); } catch (e) { /* ignore */ }
  };
  add(window);
  const R: any = Router;
  try { add(R && R.WindowStore && R.WindowStore.GamepadUIMainWindowInstance && R.WindowStore.GamepadUIMainWindowInstance.BrowserWindow); } catch (e) { /* ignore */ }
  try {
    const list = R && R.WindowStore && R.WindowStore.SteamUIWindows;
    if (list && typeof list.forEach === "function") list.forEach((x: any) => add(x && (x.BrowserWindow || x)));
  } catch (e) { /* ignore */ }
  return out;
}

interface AppEntry { key: string; id: number; name: string; shortcut: boolean }
let appIdx: { t: number; byKey: Map<string, AppEntry>; byName: Map<string, string | null> } | null = null;

const TOOL_NAMES = /proton|steam linux runtime|steamworks common|steamvr|redistributable/i;

// Every game Steam knows, keyed by the unsigned app id. Non-Steam shortcuts have negative / 64-bit ids; they are
// all folded into the same key here, so a cover and a game list entry always agree on who the game is.
function buildIndex(force?: boolean) {
  const now = Date.now();
  if (appIdx && !force && now - appIdx.t < 8000) return appIdx;
  const byKey = new Map<string, AppEntry>();
  const add = (a: any) => {
    try {
      if (!a || a.appid === undefined || !a.display_name) return;
      const key = normId(a.appid);
      if (!key || byKey.has(key)) return;
      byKey.set(key, { key, id: Number(a.appid), name: String(a.display_name), shortcut: a.app_type === 1073741824 });
    } catch (e) { /* ignore */ }
  };
  try {
    const cs: any = (window as any).collectionStore;
    const lists: any[] = [];
    if (cs) {
      lists.push(cs.allGamesCollection, cs.allAppsCollection, cs.localGamesCollection, cs.deckDesktopApps);
      try { if (cs.appTypeCollectionMap && cs.appTypeCollectionMap.get) { lists.push(cs.appTypeCollectionMap.get("type-games")); lists.push(cs.appTypeCollectionMap.get("type-other")); } } catch (e) { /* ignore */ }
      for (const c of (cs.userCollections || [])) lists.push(c);
    }
    for (const c of lists) {
      try {
        const apps = c && (c.allApps || (c.apps && typeof c.apps.values === "function" ? Array.from(c.apps.values()) : null));
        if (apps) for (const a of Array.from(apps) as any[]) add(a);
      } catch (e) { /* ignore */ }
    }
    try {
      const m: any = (window as any).appStore && (window as any).appStore.m_mapApps;
      if (m && typeof m.forEach === "function") m.forEach((a: any) => add(a));
    } catch (e) { /* ignore */ }
  } catch (e) { /* ignore */ }
  const byName = new Map<string, string | null>();
  byKey.forEach((e) => {
    const n = e.name.toLowerCase();
    byName.set(n, byName.has(n) ? null : e.key);
  });
  appIdx = { t: now, byKey, byName };
  return appIdx;
}

function appName(key: string): string {
  const e = buildIndex().byKey.get(key);
  if (e) return e.name;
  try {
    const st = (window as any).appStore;
    const o = st.GetAppOverviewByAppID(Number(key)) || st.GetAppOverviewByAppID(Number(key) | 0);
    return (o && o.display_name) || "";
  } catch (e2) { return ""; }
}

interface CollInfo { id: string; name: string; apps: string[] }
let collCache: { t: number; list: CollInfo[]; byApp: Map<string, string[]>; names: Map<string, string> } | null = null;

function collections(force?: boolean) {
  const now = Date.now();
  if (collCache && !force && now - collCache.t < 8000) return collCache;
  const list: CollInfo[] = [];
  try {
    const cs: any = (window as any).collectionStore;
    const uc: any[] = (cs && cs.userCollections) || [];
    for (const c of uc) {
      let apps: any[] = [];
      try {
        if (c.allApps) apps = Array.from(c.allApps);
        else if (c.apps && typeof c.apps.values === "function") apps = Array.from(c.apps.values());
      } catch (e) { apps = []; }
      list.push({
        id: String(c.id), name: String(c.displayName || c.name || c.id),
        apps: apps.map((a: any) => normId(a && (a.appid !== undefined ? a.appid : a))).filter((x: string) => !!x),
      });
    }
  } catch (e) { /* ignore */ }
  const byApp = new Map<string, string[]>();
  const names = new Map<string, string>();
  for (const c of list) {
    names.set(c.id, c.name);
    for (const a of c.apps) {
      const arr = byApp.get(a);
      if (arr) arr.push(c.id); else byApp.set(a, [c.id]);
    }
  }
  collCache = { t: now, list, byApp, names };
  return collCache;
}

const provider: Provider = {
  getDocs: steamDocuments,
  // the route Steam's own router has for its main window (the window's address may not follow it)
  pagePath: (doc: Document) => {
    try {
      const R: any = Router, w = R && R.WindowStore && R.WindowStore.GamepadUIMainWindowInstance;
      if (w && typeof w.LocationPathName === "string" && w.BrowserWindow && w.BrowserWindow.document === doc) return w.LocationPathName;
    } catch (e) { /* unknown */ }
    return "";
  },
  appName,
  collectionsOf: (key) => collections().byApp.get(key) || [],
  collectionName: (id) => collections().names.get(id) || "",
  resolveId: (cands) => {
    let ix = buildIndex();
    for (let pass = 0; pass < 2; pass++) {
      for (const c of cands) {
        const k = normId(c);
        if (k && ix.byKey.has(k)) return k;
      }
      // a game added a moment ago (new shortcut) may not be in the list yet: refresh once, at most every 3 s
      if (pass === 0 && Date.now() - ix.t > 3000) ix = buildIndex(true); else break;
    }
    return null;
  },
  byName: (name) => buildIndex().byName.get(name.trim().toLowerCase()) || null,
  playInfo: (key) => {
    try {
      const st = (window as any).appStore;
      const e = buildIndex().byKey.get(key);
      const o = st.GetAppOverviewByAppID(e ? e.id : Number(key)) || st.GetAppOverviewByAppID(Number(key) | 0);
      if (!o) return null;
      return { minutes: Number(o.minutes_playtime_forever) || 0, last: Number(o.rt_last_time_played) || 0 };
    } catch (e) { return null; }
  },
  // the same art sources Steam's own cover uses: your custom art first, then the cached and store covers
  artUrls: (key) => {
    const out: string[] = [];
    try {
      const st = (window as any).appStore;
      const e = buildIndex().byKey.get(key);
      const o = st.GetAppOverviewByAppID(e ? e.id : Number(key)) || st.GetAppOverviewByAppID(Number(key) | 0);
      if (!o) return out;
      const add = (v: any) => { (Array.isArray(v) ? v : [v]).forEach((u: any) => { if (typeof u === "string" && u && out.indexOf(u) < 0) out.push(u); }); };
      try { add(st.GetCustomVerticalCapsuleURLs(o)); } catch (x) { /* ignore */ }
      try { add(st.GetCachedVerticalCapsuleURL(o)); } catch (x) { /* ignore */ }
      try { if (!(o.BIsModOrShortcut && o.BIsModOrShortcut())) add(st.GetVerticalCapsuleURLForApp(o)); } catch (x) { /* ignore */ }
    } catch (x) { /* ignore */ }
    return out;
  },
};

interface GameInfo { id: string; name: string; shortcut: boolean; installed: boolean }
// the games installed on this device (the "local games" of Steam's own collections); null when Steam does not give that list
function installedKeys(): Set<string> | null {
  try {
    const c: any = (window as any).collectionStore && (window as any).collectionStore.localGamesCollection;
    const apps = c && (c.allApps || (c.apps && typeof c.apps.values === "function" ? Array.from(c.apps.values()) : null));
    if (!apps) return null;
    const set = new Set<string>();
    for (const a of Array.from(apps) as any[]) { const k = a && a.appid !== undefined ? normId(a.appid) : ""; if (k) set.add(k); }
    return set.size ? set : null;
  } catch (e) { return null; }
}
function allGames(): GameInfo[] {
  const out: GameInfo[] = [];
  const inst = installedKeys();
  buildIndex().byKey.forEach((e) => { if (!TOOL_NAMES.test(e.name)) out.push({ id: e.key, name: e.name, shortcut: e.shortcut, installed: !inst || e.shortcut || inst.has(e.key) }); });
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}

const VERSION = "1.12.0";
const lifeStats = { api: false, events: 0, last: 0, actions: 0 };

// ---------- optional background part (reports, fallback injection, safe-mode file) ----------
// Every call has a timeout: if the Python part is not running, a callable never answers. The 3D effect never waits for it.

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("no answer")), ms);
    p.then((v) => { clearTimeout(t); resolve(v); }, (e) => { clearTimeout(t); reject(e); });
  });
}
async function be<T>(fn: () => Promise<T>, ms?: number): Promise<T | null> {
  try { return await withTimeout(fn(), ms || 4000); } catch (e) { return null; }
}
const cPing = callable<[], any>("ping");
const cGetSafe = callable<[], boolean>("get_safe_mode");
const cSetSafe = callable<[boolean], boolean>("set_safe_mode");
const cSaveReport = callable<[string], any>("save_report");
const cFbStart = callable<[string, string], any>("fallback_start");
const cFbCall = callable<[string, string], any>("fallback_call");
const cFbStop = callable<[], any>("fallback_stop");
const cListTpl = callable<[], any>("list_templates");
const cGetTpl = callable<[string], any>("get_template");

// ---------- shared state ----------

let engine: Engine | null = null;
let current: Settings = loadSettings();
const listeners = new Set<() => void>();
const fb = { active: false, targets: 0, error: "" };
let lastReport = "";
let autoSaved = false;
let timers: any[] = [];
let dataTimer: any = null;
let pushTimer: any = null;
let errBase = 0;
const BOOT_KEY = "sanso-3d-boot";
const REASON_KEY = "sanso-3d-safe-reason";

function notify() { listeners.forEach((f) => f()); }

// "Less motion" on battery: Steam's battery state (and the browser's, as a backup) says whether the charger is in
let onBattery = false;
let batteryHandle: any = null;
function forEngine(s: Settings): Settings { return withLessMotion(s, onBattery); }
function setOnBattery(v: boolean): void {
  if (v === onBattery) return;
  onBattery = v;
  if (current.lessMotion !== "battery") return;
  if (engine) engine.update(forEngine(current));
  if (fb.active) schedulePush();
  notify();
}
function watchBattery(): void {
  try {
    const sc: any = (window as any).SteamClient;
    const reg = sc && sc.System && sc.System.RegisterForBatteryStateChanges;
    if (reg) {
      // eACState: 1 = not plugged in, 2 = charging, 3 = plugged in (slow charger); no battery = always plugged in
      batteryHandle = reg.call(sc.System, (st: any) => {
        try { if (st && typeof st.eACState === "number") setOnBattery(!!st.bHasBattery && st.eACState === 1); } catch (e) { /* ignore */ }
      });
      return;
    }
  } catch (e) { /* not available */ }
  try {
    const nav: any = navigator;
    if (nav && typeof nav.getBattery === "function") {
      nav.getBattery().then((b: any) => {
        const upd = () => setOnBattery(!b.charging);
        upd(); b.addEventListener("chargingchange", upd);
      }).catch(() => { /* ignore */ });
    }
  } catch (e) { /* ignore */ }
}

function commit(next: Settings) {
  current = next;
  saveSettings(next);
  if (engine) engine.update(forEngine(next));
  if (fb.active) schedulePush();
  notify();
}

function usingFallback(): boolean {
  return fb.active && !(engine && engine.libraryReachable());
}

function buildData() {
  const ix = buildIndex(true);
  const apps: any[] = [];
  ix.byKey.forEach((e) => {
    if (apps.length >= 5000) return;
    const p = provider.playInfo(e.key);
    apps.push({ k: e.key, n: e.name, sc: e.shortcut ? 1 : 0, m: p ? p.minutes : 0, l: p ? p.last : 0 });
  });
  const colls = collections(true).list.map((c) => ({ id: c.id, n: c.name, a: c.apps }));
  return { apps, colls };
}

async function fallbackCall(name: string, arg: string): Promise<any> {
  return be(() => cFbCall(name, arg), 9000);
}

function schedulePush() {
  clearTimeout(pushTimer);
  pushTimer = setTimeout(() => { void fallbackCall("update", JSON.stringify(forEngine(current))); }, 400);
}

async function startFallback(): Promise<void> {
  if (fb.active || current.safeMode || current.fallback === "off") return;
  const r = await be(() => cFbStart(JSON.stringify(forEngine(current)), JSON.stringify(buildData())), 30000);
  if (r && r.ok) {
    fb.active = true; fb.targets = r.targets; fb.error = "";
    if (tpl.raw.length) void fallbackCall("setTemplates", JSON.stringify(tpl.raw));
    clearInterval(dataTimer);
    dataTimer = setInterval(() => { void fallbackCall("setData", JSON.stringify(buildData())); }, 60000);
  } else {
    fb.error = r ? (r.error || "no library window found") : "the background part is not answering";
    if (!autoSaved) { autoSaved = true; void saveReport("Fallback injection failed: " + fb.error); }
  }
  notify();
}

async function stopFallback(): Promise<void> {
  clearInterval(dataTimer); clearTimeout(pushTimer);
  const was = fb.active;
  fb.active = false; fb.targets = 0;
  if (was) await be(() => cFbStop(), 6000);
  notify();
}

// ---------- template pictures (frames) from ~/homebrew/settings/3d-game-cases/templates ----------
const tpl = { folder: "", found: 0, loaded: 0, loading: false, raw: [] as TemplateIn[], error: "" };

async function loadTemplatesNow(): Promise<void> {
  if (tpl.loading || current.safeMode) return;
  tpl.loading = true; tpl.error = ""; notify();
  try {
    const l = await be(() => cListTpl(), 6000);
    if (!l) { tpl.error = "the background part is not answering"; return; }
    tpl.folder = l.folder || ""; tpl.found = (l.names || []).length;
    const raw: TemplateIn[] = [];
    for (const name of (l.names || []) as string[]) {
      const t = await be(() => cGetTpl(name), 10000);
      if (t && t.url) raw.push({ name: t.name, url: t.url, win: t.win });
    }
    const list = await loadTemplates(document, raw);
    tpl.raw = raw; tpl.loaded = list.length;
    if (engine) engine.setTemplates(list); else registerTemplates(list);
    if (fb.active) void fallbackCall("setTemplates", JSON.stringify(raw));
  } catch (e) {
    tpl.error = String((e as any) && (e as any).message ? (e as any).message : e);
  } finally {
    tpl.loading = false; notify();
  }
}

function startEngine() {
  if (engine || current.safeMode || current.fallback === "always") return;
  engine = new Engine(forEngine(current), provider, { selfDoc: document });
  // a sealed game's wrap was torn off on its first launch: its own "Sealed" wear is done
  engine.onTear = (key: string) => {
    const o = current.gameOv[key];
    if (!o || o.wear !== "sealed") return;
    const gameOv = { ...current.gameOv }; const n: ItemOv = { ...o }; delete n.wear;
    if (Object.keys(n).length) gameOv[key] = n; else delete gameOv[key];
    commit({ ...current, gameOv });
  };
  engine.start();
  if (runningGames.size) engine.setSleeping(true);
  errBase = 0;
}
function stopEngine() {
  if (engine) { engine.stop(); engine = null; }
}

function scheduleFallbackChecks() {
  const maybe = () => {
    if (current.safeMode || current.fallback === "off" || fb.active) return;
    if (current.fallback === "always" || (engine && !engine.libraryReachable())) void startFallback();
  };
  timers.push(setTimeout(maybe, current.fallback === "always" ? 800 : 8000));
  timers.push(setTimeout(maybe, 25000));
}

function enterSafe(reason: string) {
  try { window.localStorage.setItem(REASON_KEY, reason); } catch (e) { /* ignore */ }
  stopEngine();
  void stopFallback();
  void be(() => cSetSafe(true));
  commit({ ...current, safeMode: true });
}
function leaveSafe() {
  try { window.localStorage.removeItem(REASON_KEY); window.localStorage.setItem(BOOT_KEY, JSON.stringify({ running: false, n: 0, t: Date.now() })); } catch (e) { /* ignore */ }
  void be(() => cSetSafe(false));
  commit({ ...current, safeMode: false });
  startEngine();
  scheduleFallbackChecks();
}

// If the plugin keeps failing to survive its first seconds (for example the library breaks and Steam restarts),
// it switches itself off after three tries in a row.
function bootGuard(): boolean {
  try {
    const raw = window.localStorage.getItem(BOOT_KEY);
    const prev = raw ? JSON.parse(raw) : null;
    const n = prev && prev.running ? (prev.n || 0) + 1 : 0;
    window.localStorage.setItem(BOOT_KEY, JSON.stringify({ running: true, n, t: Date.now() }));
    timers.push(setTimeout(() => { try { window.localStorage.setItem(BOOT_KEY, JSON.stringify({ running: false, n: 0, t: Date.now() })); } catch (e) { /* ignore */ } }, 25000));
    return n >= 3;
  } catch (e) { return false; }
}

// ---------- game launch / exit notifications (experimental animation + wear refresh) ----------

let lifeHandle: any = null;
let actionHandle: any = null;
let taskHandle: any = null;
const gate = new LaunchGate(); // one animation per launch, however often Steam reports it
// games running right now: while any runs, the plugin sleeps (no page watching, timers or animations)
const runningGames = new Set<string>();
function updateSleep(): void { if (engine) engine.setSleeping(runningGames.size > 0); }
let pending: { key: string; timer: any } | null = null;
const AFTER_LOGO_MS = 1700; // Steam's logo zooms in and settles in about this time
function firePending(): void {
  if (!pending) return;
  const k = pending.key; clearTimeout(pending.timer); pending = null;
  void playInsertAny(k);
}
function schedulePending(key: string): void {
  if (pending) clearTimeout(pending.timer);
  pending = { key, timer: setTimeout(firePending, AFTER_LOGO_MS) };
}

// whether it plays is decided per game by the engine (the global switch, or the game's own or its collection's); "preview" plays it anyway
async function playInsertAny(key: string | null, eject = false, preview = false): Promise<boolean> {
  // the game page may hold no covers at all, so do not require tagged covers here
  if (engine && (engine.libraryReachable() || !fb.active)) return engine.playInsert(key, { eject, force: preview });
  if (fb.active) { const r = await fallbackCall(preview ? (eject ? "previewEject" : "previewInsert") : (eject ? "playEject" : "playInsert"), JSON.stringify(key)); return !!(r && r.ok && (r.values || []).some((v: any) => v === true)); }
  return false;
}
// quitting a game: Steam's library comes back a moment later, so wait until a Steam window is visible again
let ejectTimer: any = null;
function scheduleEject(key: string): void {
  clearTimeout(ejectTimer);
  const started = Date.now();
  const tryNow = async () => {
    ejectTimer = null;
    if (current.safeMode) return;
    if (await playInsertAny(key, true)) return;
    if (Date.now() - started < 8000) ejectTimer = setTimeout(() => { void tryNow(); }, 400);
  };
  ejectTimer = setTimeout(() => { void tryNow(); }, 700);
}
async function refreshAny(): Promise<void> {
  if (engine && engine.libraryReachable()) engine.refreshWear();
  else if (fb.active) await fallbackCall("setData", JSON.stringify(buildData()));
}

function hookLifetime(): void {
  try {
    const sc: any = (window as any).SteamClient;
    const reg = sc && sc.GameSessions && sc.GameSessions.RegisterForAppLifetimeNotifications;
    if (!reg) return;
    lifeStats.api = true;
    lifeHandle = reg.call(sc.GameSessions, (n: any) => {
      try {
        if (!n) return;
        lifeStats.events++; lifeStats.last = Date.now();
        if (current.safeMode) return;
        const key = normId(n.unAppID !== undefined ? n.unAppID : n.appid);
        // the Play-button hook usually got here first; this is the backup for launches it did not see
        if (n.bRunning) {
          if (key) runningGames.add(key);
          if (key && gate.onRunning(key, Date.now())) void playInsertAny(key);
          // after the insert animation has had its time (it draws in its own overlay, unaffected by sleeping)
          setTimeout(updateSleep, 3500);
        }
        else {
          if (key) { runningGames.delete(key); updateSleep(); gate.onExit(key); scheduleEject(key); }
          void refreshAny();
        }
      } catch (e) { /* never let a notification break Steam */ }
    });
  } catch (e) { /* not available */ }
  // Play pressed anywhere (library, game page, Home): Steam starts a "LaunchApp" game action right away,
  // seconds before the game process exists, so the animation can play while Steam is still loading.
  try {
    const sc: any = (window as any).SteamClient;
    const reg = sc && sc.Apps && sc.Apps.RegisterForGameActionStart;
    if (reg) {
      actionHandle = reg.call(sc.Apps, (actionId: any, gameId: any, action: any) => {
        try {
          lifeStats.actions++;
          if (current.safeMode) return;
          if (typeof action === "string" && action.indexOf("Launch") < 0) return; // installs, uninstalls...
          const key = normId(gameId);
          if (!key) return;
          if (!gate.onAction(key, actionId, Date.now())) return; // this launch already had its animation
          if (lookForIds(current, key, provider.collectionsOf(key)).when === "after") schedulePending(key);
          else void playInsertAny(key);
        } catch (e) { /* never let a notification break Steam */ }
      });
    }
    // "after the logo": Steam shows the game logo first; the animation follows once the logo has had its moment,
    // and at the latest when Steam starts waiting for the game window (the little Steam loading animation comes next).
    const regTask = sc && sc.Apps && sc.Apps.RegisterForGameActionTaskChange;
    if (regTask) {
      taskHandle = regTask.call(sc.Apps, (_id: any, gameId: any, _action: any, task: any) => {
        try {
          if (!pending) return;
          const key = normId(gameId);
          if (key && key === pending.key && (task === "WaitingGameWindow" || task === "Completed")) firePending();
        } catch (e) { /* ignore */ }
      });
    }
  } catch (e) { /* not available */ }
}
function unhookLifetime(): void {
  try { if (lifeHandle && typeof lifeHandle.unregister === "function") lifeHandle.unregister(); } catch (e) { /* ignore */ }
  try { if (actionHandle && typeof actionHandle.unregister === "function") actionHandle.unregister(); } catch (e) { /* ignore */ }
  try { if (taskHandle && typeof taskHandle.unregister === "function") taskHandle.unregister(); } catch (e) { /* ignore */ }
  if (pending) { clearTimeout(pending.timer); pending = null; }
  clearTimeout(ejectTimer); ejectTimer = null;
  try { if (batteryHandle && typeof batteryHandle.unregister === "function") batteryHandle.unregister(); } catch (e) { /* ignore */ }
  batteryHandle = null;
  lifeHandle = null; actionHandle = null; taskHandle = null;
}

// ---------- self-check and saved reports ----------

const TAG: Record<string, string> = { ok: "OK", fail: "FAIL", warn: "WARN", skip: "--" };

async function runSelfCheck(): Promise<{ lines: string[]; failed: boolean }> {
  const out: string[] = [];
  let failed = false;
  const add = (st: string, label: string, detail: string) => {
    out.push(`[${TAG[st]}] ${label}${detail ? " - " + detail : ""}`);
    if (st === "fail") failed = true;
  };
  if (current.safeMode) { add("warn", "Safe mode", "the plugin is switched off on purpose"); return { lines: out, failed: false }; }
  const pong = await be(() => cPing(), 2500);
  add(pong ? "ok" : "warn", "Background part", pong ? "answering (reports and fallback available)" : "not answering; the 3D effect still works, reports and fallback do not");
  let store = false;
  try { window.localStorage.setItem("sanso-3d-test", "1"); store = window.localStorage.getItem("sanso-3d-test") === "1"; window.localStorage.removeItem("sanso-3d-test"); } catch (e) { store = false; }
  add(store ? "ok" : "fail", "Settings storage", store ? "works" : "cannot save settings");
  const ix = buildIndex(true);
  let sc = 0; ix.byKey.forEach((e) => { if (e.shortcut) sc++; });
  add(ix.byKey.size > 0 ? "ok" : "fail", "Game list read", `${ix.byKey.size} games, ${sc} non-Steam`);
  const cl = collections(true).list;
  add(cl.length > 0 ? "ok" : "warn", "Collections read", `${cl.length} collections`);
  let lines: CheckLine[] = [];
  if (usingFallback()) {
    add("ok", "Library reached through", `fallback injection (${fb.targets} window)`);
    const r = await fallbackCall("selfCheck", "");
    lines = r && r.ok && r.values && r.values[0] ? r.values[0] : [];
    if (!lines.length) add("fail", "Fallback answers", "no reply from the injected part");
  } else if (engine) {
    lines = engine.selfCheck();
  } else if (current.fallback === "always") {
    add("warn", "Fallback", fb.active ? "active" : `not running${fb.error ? " (" + fb.error + ")" : ""}`);
  }
  lines.forEach((l) => add(l.status, l.label, l.detail));
  if (current.fallback !== "off" && !fb.active && fb.error) add("warn", "Fallback injection", `could not start: ${fb.error}`);
  add(lifeStats.api ? "ok" : "fail", "Launch notifications", lifeStats.api ? "Steam's launch notification is available" : "not available; the insert animation and automatic wear refresh cannot work");
  add(lifeStats.events > 0 ? "ok" : "skip", "Launch notification received", lifeStats.events > 0 ? `${lifeStats.events} event(s) since the plugin started` : "none yet; start a game to test it");
  add(lifeStats.actions > 0 ? "ok" : "skip", "Play button seen", lifeStats.actions > 0 ? `${lifeStats.actions} launch action(s) since the plugin started` : "none yet; press Play on a game to test the insert animation");
  return { lines: out, failed };
}

async function saveReport(reason: string): Promise<string | null> {
  try {
    const chk = await runSelfCheck();
    let snap = "";
    if (usingFallback()) {
      const r = await fallbackCall("snapshot", "");
      snap = r && r.ok && r.values && r.values[0] ? String(r.values[0]) : "(no snapshot from the fallback)";
    } else if (engine) snap = engine.snapshot();
    const text = [
      `3D Game Cases report`, `reason: ${reason}`, `plugin version: ${VERSION}`, "",
      "SELF-CHECK", ...chk.lines, "", "SETTINGS", JSON.stringify(current), "", "WHAT THE PLUGIN SEES", snap,
    ].join("\n");
    const r = await be(() => cSaveReport(text), 8000);
    if (r && r.ok) { lastReport = r.path; notify(); return r.path; }
  } catch (e) { /* ignore */ }
  return null;
}

// slow, cheap watchdog: too many internal errors -> safe mode; many unmatched covers -> save a report once
function guardTick() {
  if (!engine || current.safeMode) return;
  if (engine.errors - errBase > 20) { enterSafe("The plugin hit too many internal errors and switched itself off."); return; }
  if (!autoSaved) {
    const t = engine.coverTotals();
    if (t.covers >= 8 && t.unmatched / t.covers > 0.25) { autoSaved = true; void saveReport("Many covers could not be matched to games"); }
  }
}

const CSS = `
/* Groups of buttons are built by NavGrid: a column of rows, each row a Focusable that flows left/right, so the d-pad moves sideways inside a row and up/down between rows. */
.c3d-seg, .c3d-seg3, .c3d-tabs3, .c3d-grid { display: flex !important; flex-direction: column; width: 100%; box-sizing: border-box; }
.c3d-seg, .c3d-seg3 { gap: 6px !important; }
.c3d-tabs3, .c3d-grid { gap: 8px !important; }
.c3d-nr { display: grid !important; grid-template-columns: repeat(var(--c3d-cols, 3), minmax(0, 1fr)); gap: 6px; width: 100%; box-sizing: border-box; }
.c3d-tabs3 .c3d-nr, .c3d-grid .c3d-nr { gap: 8px; }
.c3d-seg .c3d-nr > * { margin: 0 !important; min-width: 0 !important; width: 100% !important; height: 36px !important;
  min-height: 36px !important; padding: 0 4px !important; font-size: 12.5px !important; line-height: 1 !important;
  display: flex !important; align-items: center !important; justify-content: center !important; box-sizing: border-box !important; }
.c3d-seg .on { background: #1a9fff !important; color: #fff !important; font-weight: bold; }
.c3d-note { font-size: 12px; line-height: 1.4; opacity: .8; padding: 6px 0; white-space: pre-wrap; }
/* The page stops above Steam's footer (the button hints), so the last row can be scrolled all the way into view with the d-pad;
   scroll-padding keeps a focused row clear of both edges. */
.c3d-page { margin-top: 40px; height: calc(100% - 40px - 84px); overflow-y: auto; padding: 0 28px 48px 28px; box-sizing: border-box; scroll-padding: 56px 0 72px 0; }
.c3d-label { font-size: 14px; padding: 6px 0 2px 0; }
.c3d-sep { margin: 14px 0 6px 0; padding-top: 8px; border-top: 1px solid rgba(255,255,255,.22); font-size: 14px; opacity: .9; }
/* a divider line of our own, with room above it (the default wear buttons) and below it */
.c3d-rule { height: 0; margin: 16px 0 4px 0; border-top: 1px solid rgba(255,255,255,.22); }
/* the line above the wear choices: as much room under it as there is above the line below them */
.c3d-rule-roomy { margin-bottom: 16px; }
/* the block that tells the settings below it are overrides: set apart from the preset lists above and from the first override below */
.c3d-overrides { margin: 30px 0 14px 0; padding: 14px 0 12px 0; border-top: 2px solid rgba(255,255,255,.28); border-bottom: 2px solid rgba(255,255,255,.28); }
.c3d-overrides h2 { margin-top: 0 !important; }
.c3d-overrides .c3d-hint { margin-bottom: 0; }
.c3d-page h2 { margin: 10px 0 6px 0; font-size: 20px; }
/* with Steam's own tabs (left and right bumpers switch tabs): the tab bar, then the scrolling content */
.c3d-tabswrap { margin-top: 40px; height: calc(100% - 40px - 84px); box-sizing: border-box; }
.c3d-tabbody { padding: 12px 28px 48px 28px; box-sizing: border-box; scroll-padding: 56px 0 72px 0; }
.c3d-tabbody h2 { margin: 10px 0 6px 0; font-size: 20px; }
/* the still preview of the case and of the disc or cartridge: it stays in view while you scroll the settings below it */
.c3d-preview { position: sticky; top: 0; z-index: 5; display: flex; align-items: center; gap: 10px; margin: 6px 0 10px 0; padding: 6px 12px; border-radius: 8px;
  background: rgba(14,20,27,.96); box-shadow: 0 2px 10px rgba(0,0,0,.45); white-space: pre-wrap; }
.c3d-tabs { display: grid !important; grid-template-columns: 1fr 1fr; gap: 8px !important; margin: 8px 0 12px 0; }
.c3d-tabs > * { margin: 0 !important; height: 40px !important; min-height: 40px !important; }
.c3d-tabs .on { background: #1a9fff !important; color: #fff !important; font-weight: bold; }
.c3d-row { position: relative !important; display: flex !important; align-items: center; gap: 12px; width: 100% !important; height: 46px !important;
  min-height: 46px !important; margin: 0 0 6px 0 !important; padding: 0 12px !important; box-sizing: border-box !important; text-align: left; justify-content: flex-start !important; }
/* The title sits in the exact middle of the row, whatever the status on the right says; the swatch stays on the left and the status on the right. */
.c3d-row .nm { position: absolute; left: 50%; top: 0; transform: translateX(-50%); height: 46px; line-height: 46px; max-width: 34%; box-sizing: border-box;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: center; font-size: 15px; }
.c3d-row .st { margin-left: auto; max-width: 32%; font-size: 13px; line-height: 1.2; opacity: .9; text-align: right; white-space: normal; overflow: hidden;
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.c3d-sw { width: 14px; height: 26px; border-radius: 2px; flex: none; box-shadow: inset 0 0 0 1px rgba(255,255,255,.3); }
.c3d-tabs3 { margin: 8px 0 12px 0; }
.c3d-tabs3 .c3d-nr > * { margin: 0 !important; height: 40px !important; min-height: 40px !important; }
.c3d-tabs3 .on { background: #1a9fff !important; color: #fff !important; font-weight: bold; }
.c3d-grid { margin-bottom: 14px; }
.c3d-grid .c3d-nr > * { margin: 0 !important; height: 46px !important; min-height: 46px !important; display: flex !important; align-items: center !important;
  justify-content: flex-start !important; gap: 10px; padding: 0 10px !important; font-size: 13px !important; box-sizing: border-box !important; min-width: 0 !important; }
.c3d-grid .on { outline: 2px solid #1a9fff; }
.c3d-card { border: 1px solid rgba(255,255,255,.15); border-radius: 6px; padding: 8px 12px; margin-bottom: 12px; }
.c3d-seg3 .c3d-nr > * { margin: 0 !important; min-width: 0 !important; width: 100% !important; height: 36px !important; min-height: 36px !important; padding: 0 4px !important; font-size: 12px !important; line-height: 1.1 !important; display: flex !important; align-items: center !important; justify-content: center !important; box-sizing: border-box !important; }
.c3d-seg3 .on { background: #1a9fff !important; color: #fff !important; font-weight: bold; }
.c3d-chk { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,.6); border-radius: 3px; flex: none; box-sizing: border-box; }
.c3d-chk.on { background: #1a9fff; border-color: #1a9fff; }
.c3d-hint { font-size: 13px; opacity: .75; margin: 4px 0 10px 0; line-height: 1.4; }
`;

const GRID_COLS: Record<string, number> = { "c3d-seg": 4, "c3d-seg3": 3, "c3d-tabs3": 3, "c3d-grid": 3 };
function flatKids(x: any, out: any[]): any[] {
  if (Array.isArray(x)) x.forEach((y) => flatKids(y, out));
  else if (x !== null && x !== undefined && x !== false && x !== true) out.push(x);
  return out;
}

// A group of buttons the controller can move through in every direction. Steam's d-pad only moves along the direction
// its container "flows" (down, by default), so a plain grid of buttons made "right" do nothing. Each row here is its own
// Focusable that flows left and right; the rows follow each other, so up and down move between rows.
function NavGrid(props: { cls: "c3d-seg" | "c3d-seg3" | "c3d-tabs3" | "c3d-grid"; cols?: number; style?: any; children?: any }) {
  const cols = props.cols || GRID_COLS[props.cls];
  const items = flatKids(props.children, []);
  const rows: any[][] = [];
  for (let i = 0; i < items.length; i += cols) rows.push(items.slice(i, i + cols));
  return (
    <div className={props.cls} style={props.style}>
      {rows.map((row, r) => (
        <Focusable key={r} className="c3d-nr" noFocusRing={true} flow-children="row" style={{ "--c3d-cols": cols } as any}>
          {row.map((it, i) => <Fragment key={it && typeof it === "object" && it.key !== null && it.key !== undefined ? it.key : i}>{it}</Fragment>)}
        </Focusable>
      ))}
    </div>
  );
}

function Swatch(props: { s: Settings; id: StyleId }) {
  const p = paletteFor(props.s, props.id);
  const t = TEMPLATES[props.id];
  if (t) return <div className="c3d-sw" style={{ background: `url(${JSON.stringify(t.url)}) center / cover no-repeat, ${p.b}`, border: "1px solid rgba(255,255,255,.25)" }} />;
  return <div className="c3d-sw" style={{ background: `linear-gradient(90deg, ${p.a}, ${p.b})`, border: "1px solid rgba(255,255,255,.25)" }} />;
}

function useSettings(): Settings {
  const [, setN] = useState(0);
  useEffect(() => {
    const f = () => setN((n: number) => n + 1);
    listeners.add(f);
    return () => { listeners.delete(f); };
  }, []);
  return current;
}

type Target = { kind: "game" | "coll" | "default" | "bulk"; id: string; name: string; ids?: string[] };

const hslCss = (c: HslColor) => `hsl(${c.h}, ${c.s}%, ${c.l}%)`;

// presets and sliders for one color (the disc or cartridge, the band, the frame); no value = automatic.
// With no color set, the sliders start on the color that is in use now (props.fallback), so a small change starts from what you see.
function ColorSection(props: { title: string; hint?: string; value: HslColor | undefined; autoLabel?: string; noAuto?: boolean; fallback: HslColor; extra?: { label: string; on: boolean; onClick: () => void }; onChange: (c: HslColor | null) => void }) {
  const v = props.value;
  const base = v || props.fallback;
  return (
    <div>
      <h2>{props.title}</h2>
      {props.hint && <div className="c3d-hint">{props.hint}</div>}
      <NavGrid cls="c3d-grid">
        {!props.noAuto && <DialogButton className={!v && !(props.extra && props.extra.on) ? "on" : ""} onClick={() => props.onChange(null)}>{props.autoLabel || "Automatic"}</DialogButton>}
        {props.extra && <DialogButton className={props.extra.on ? "on" : ""} onClick={props.extra.onClick}>{props.extra.label}</DialogButton>}
        {COLOR_PRESETS.map((p) => (
          <DialogButton key={p.name} className={v && v.h === p.c.h && v.s === p.c.s && v.l === p.c.l ? "on" : ""} onClick={() => props.onChange(p.c)}>
            <span style={{ display: "inline-block", width: 14, height: 14, borderRadius: 3, marginRight: 6, background: hslCss(p.c), border: "1px solid rgba(255,255,255,.4)" }} />
            <span className="nm">{p.name}</span>
          </DialogButton>
        ))}
      </NavGrid>
      <div className="c3d-card">
        <div style={{ height: 14, borderRadius: 4, background: hslCss(base), border: "1px solid rgba(255,255,255,.3)", marginBottom: 6, opacity: v ? 1 : 0.55 }} />
        <SliderField label="Hue" value={base.h} min={0} max={360} step={1} showValue onChange={(x: number) => props.onChange({ ...base, h: x })} />
        <SliderField label="Saturation" value={base.s} min={0} max={100} step={1} showValue onChange={(x: number) => props.onChange({ ...base, s: x })} />
        <SliderField label="Lightness" value={base.l} min={4} max={94} step={1} showValue onChange={(x: number) => props.onChange({ ...base, l: x })} />
      </div>
    </div>
  );
}

// ---------- still previews (the case, and the disc or cartridge), so they can be looked at without moving ----------

const PREVIEW_ART = "linear-gradient(160deg,#f08a3c,#7a2fd0)";
// a stand-in cover and logo for the previews of the print (the real ones are the game's own)
const svgUrl = (svg: string) => "data:image/svg+xml;utf8," + encodeURIComponent(svg);
const PREVIEW_COVER_URL = svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f08a3c"/><stop offset="1" stop-color="#7a2fd0"/></linearGradient></defs><rect width="200" height="300" fill="url(#g)"/></svg>');
const PREVIEW_LOGO_URL = svgUrl('<svg xmlns="http://www.w3.org/2000/svg" width="240" height="90" viewBox="0 0 240 90"><text x="120" y="62" font-family="Arial Black,Arial,sans-serif" font-size="46" font-weight="900" fill="#ffffff" stroke="#000000" stroke-opacity=".55" stroke-width="3" paint-order="stroke" text-anchor="middle">LOGO</text></svg>');
// what is printed on the disc or cartridge; Logo first
const PRINT_OPTIONS: [InsertArt, string][] = [["logo", "Logo"], ["cover", "Cover (Fill)"], ["fit", "Cover (Fit)"], ["none", "None"]];
const PRINT_LABELS: Record<string, string> = { logo: "Logo", cover: "Cover (Fill)", fit: "Cover (Fit)", none: "None" };

// the 3D case, drawn the way the library draws it: front with band and frame, spine, top, bottom, thickness and wear
function BoxPreview(props: { s: Settings; look: Look; art?: string }) {
  const { s, look } = props;
  const artBg = props.art ? `url(${JSON.stringify(props.art)}) center / cover no-repeat` : PREVIEW_ART;
  const pal = look.pal;
  const W = 84, H = 126;
  const d = Math.max(3, Math.min(64, Math.round(W * 0.0075 * s.depth * look.dfac * look.thick)));
  const r = Math.max(1, Math.round(look.shape.radius * 0.6));
  const tpl = TEMPLATES[look.style];
  const frameOn = look.frame && !tpl;
  const abs = (x: any) => ({ position: "absolute" as const, boxSizing: "border-box" as const, ...x });
  return (
    <div style={{ width: W + 48, height: H + 24, perspective: 650, perspectiveOrigin: "50% 40%", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
      <div style={{ position: "relative", width: W, height: H, transformStyle: "preserve-3d", transform: `rotateY(32deg) rotateX(-6deg) translateZ(${-Math.round(d / 2)}px)` }}>
        <div style={abs({ top: 0, bottom: 0, left: 0, width: d, transformOrigin: "left center", transform: "rotateY(90deg)", background: `linear-gradient(90deg, ${pal.a}, ${pal.b})` })} />
        <div style={abs({ top: 0, bottom: 0, right: 0, width: d, transformOrigin: "right center", transform: "rotateY(-90deg)", background: `linear-gradient(270deg, ${pal.b}, ${pal.a})` })} />
        <div style={abs({ top: 0, left: 0, right: 0, height: d, transformOrigin: "center top", transform: "rotateX(-90deg)", background: `linear-gradient(0deg, ${pal.b}, ${pal.a})` })} />
        <div style={abs({ bottom: 0, left: 0, right: 0, height: d, transformOrigin: "center bottom", transform: "rotateX(90deg)", background: `linear-gradient(180deg, ${pal.b}, #000)` })} />
        <div style={abs({ inset: 0, borderRadius: r, overflow: "hidden", transform: "translateZ(1px)", background: tpl ? `url(${JSON.stringify(tpl.url)}) center / cover no-repeat, ${pal.b}` : frameOn ? (pal.frame || pal.band) : "#1b1e24", boxShadow: `inset 0 0 0 1px ${pal.line}` })}>
          {!tpl && <div style={abs({ left: frameOn ? "2.6%" : 0, right: frameOn ? "2.6%" : 0, top: frameOn ? (look.band ? "5.2%" : "2.6%") : 0, bottom: frameOn && !look.band ? "2.6%" : 0, background: artBg })} />}
          {!tpl && look.band && <div style={abs({ left: 0, right: 0, top: 0, height: "5.2%", background: pal.band, borderBottom: "1px solid rgba(0,0,0,.35)" })} />}
          <div style={abs({ inset: 0, background: wearCss(look.wear) })} />
          <div style={abs({ inset: 0, background: "linear-gradient(112deg, rgba(255,255,255,.30), rgba(255,255,255,0) 32%)" })} />
        </div>
      </div>
    </div>
  );
}

// the disc or cartridge that goes into the slot, drawn by the same code as the insert animation
function MediaPreview(props: { s: Settings; look: Look; game?: { art: string; logo: string } }) {
  const { look, game } = props;
  // a game's own art when it has loaded; otherwise a stand-in. A game with no logo gets its whole cover, as in the animation.
  const artUrl = game && game.art ? game.art : PREVIEW_COVER_URL;
  const artCss = game && game.art ? `url(${JSON.stringify(game.art)})` : PREVIEW_ART;
  const logoUrl = game ? game.logo : PREVIEW_LOGO_URL;
  const mode: InsertArt = look.art === "logo" && !logoUrl ? "fit" : look.art;
  const g = mediaGeom(look.shapeId);
  const base = 150;
  const w = Math.round(base * g.wf), h = Math.round(w * g.ratio);
  return (
    <div style={{ width: base * 0.76 + 8, height: Math.max(h, 40) + 8, display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
      <div style={{ position: "relative", width: w, height: h, flex: "none" }}
        ref={(el: any) => {
          if (!el) return;
          try {
            while (el.firstChild) el.removeChild(el.firstChild);
            el.appendChild(buildMedia(el.ownerDocument, { shapeId: look.shapeId, pal: look.pal, media: look.media, window: look.window, artCss, artUrl, logo: logoUrl, artMode: mode, logoPos: look.logoPos, artY: look.artY }).el);
          } catch (e) { /* a preview is never worth an error */ }
        }} />
    </div>
  );
}

// a game's own cover and logo, the way Steam has them (custom art first); "" until found. They are looked up the same way the insert animation does it.
function useGameImages(key: string | null): { art: string; logo: string } {
  const [res, setRes] = useState({ art: "", logo: "", key: "" });
  useEffect(() => {
    if (!key) return;
    let dead = false;
    const pick = (cands: string[], ok: (im: HTMLImageElement) => boolean, done: (u: string) => void) => {
      const found: (boolean | undefined)[] = cands.map(() => undefined);
      let fin = false;
      const settle = (force: boolean) => {
        if (dead || fin) return;
        for (let i = 0; i < cands.length; i++) {
          if (found[i] === undefined && !force) return; // an earlier candidate is still loading: it is preferred
          if (found[i]) { fin = true; done(cands[i]); return; }
        }
        if (force || found.every((f) => f !== undefined)) fin = true;
      };
      cands.forEach((u, i) => {
        const im = new Image();
        im.onload = () => { found[i] = ok(im); settle(false); };
        im.onerror = () => { found[i] = false; settle(false); };
        im.src = u;
      });
      setTimeout(() => settle(true), 2500);
    };
    const art: string[] = [], logo: string[] = [];
    const add = (l: string[], u: any) => { if (typeof u === "string" && u && l.indexOf(u) < 0) l.push(u); };
    try { (provider.artUrls ? provider.artUrls(key) : []).forEach((u) => add(art, u)); } catch (e) { /* ignore */ }
    if (/^\d+$/.test(key)) {
      ["png", "jpg", "webp"].forEach((x) => { add(art, `/customimages/${key}p.${x}`); add(logo, `/customimages/${key}_logo.${x}`); });
      add(art, `/assets/${key}/library_600x900.jpg`); add(art, `/assets/${key}/library_600x900_2x.jpg`);
      add(logo, `/assets/${key}/logo.png`); add(logo, `/assets/${key}/logo_2x.png`);
    }
    pick(art, (im) => im.naturalWidth > 10 && im.naturalHeight > im.naturalWidth, (u) => { if (!dead) setRes((r) => ({ ...r, key, art: u })); });
    pick(logo, (im) => im.naturalWidth > 10 && im.naturalHeight > 5, (u) => { if (!dead) setRes((r) => ({ ...r, key, logo: u })); });
    return () => { dead = true; };
  }, [key]);
  return key && res.key === key ? { art: res.art, logo: res.logo } : { art: "", logo: "" };
}

// every word starts with a capital letter, except "and" (words already in capitals, like NES, stay as they are)
const titleCase = (s: string) => s.replace(/(^|[\s(\/-])([a-z])([a-z]*)/g, (m, pre, c, rest) => (c + rest === "and" ? m : pre + c.toUpperCase() + rest));

function LookPreview(props: { s: Settings; look: Look; note?: string; game?: { art: string; logo: string } }) {
  const { s, look } = props;
  const size = thicknessName(look.dfac) + (Math.abs(look.thick - 1) > 0.004 ? ` (${Math.round(look.thick * 100)}%)` : ""); // a percentage only when adjusted by hand: the change from that size
  return (
    <div className="c3d-preview">
      <BoxPreview s={s} look={look} art={props.game && props.game.art} />
      <MediaPreview s={s} look={look} game={props.game} />
      <div className="c3d-hint" style={{ margin: 0, flex: 1, minWidth: 0 }}>
        <b>{titleCase(styleLabel(s, look.style))}</b>{"\n"}
        {titleCase(`${SHAPE_LABELS[look.shapeId]} case and ${mediaGeom(look.shapeId).card ? "cartridge" : "disc"}`)}{"\n"}
        {titleCase(`Thickness: ${size}`)}{"\n"}
        {titleCase(`${look.band ? "band" : "no band"}, ${look.frame ? "frame" : "no frame"}, ${WEAR_LABELS[look.wear]}`)}{"\n"}
        {titleCase(`print: ${PRINT_LABELS[look.art]}`)}
        {props.note ? "\n" + titleCase(props.note) : ""}
      </div>
    </div>
  );
}

// ---------- one collection's or one game's settings ----------

type OvPatch = { [K in keyof ItemOv]?: ItemOv[K] | null };

function applyPatch(o: ItemOv | undefined, patch: OvPatch): ItemOv | null {
  const n: any = { ...(o || {}) };
  Object.keys(patch).forEach((k) => { const v = (patch as any)[k]; if (v === null || v === undefined) delete n[k]; else n[k] = v; });
  return Object.keys(n).length ? n : null;
}

// the same change for a collection, a game, or all selected games
function patchSettings(s: Settings, target: Target, patch: OvPatch): Settings {
  if (target.kind === "default") return s;
  if (target.kind === "coll") {
    const collOv = { ...s.collOv };
    const r = applyPatch(collOv[target.id], patch);
    if (r) collOv[target.id] = r; else delete collOv[target.id];
    return { ...s, collOv };
  }
  const gameOv = { ...s.gameOv };
  const ids = target.kind === "bulk" ? (target.ids || []) : [target.id];
  ids.forEach((g) => { const r = applyPatch(gameOv[g], patch); if (r) gameOv[g] = r; else delete gameOv[g]; });
  return { ...s, gameOv };
}

function ovOfTarget(s: Settings, t: Target): ItemOv | undefined {
  return t.kind === "coll" ? s.collOv[t.id] : t.kind === "game" ? s.gameOv[t.id] : undefined;
}

function lookOfTarget(s: Settings, t: Target): Look {
  const one = (id: string | null) => lookForIds(s, id, id ? provider.collectionsOf(id) : []);
  if (t.kind === "coll") return lookForIds(s, null, [t.id]);
  if (t.kind === "game") return one(t.id);
  if (t.kind === "bulk") return one((t.ids || [])[0] || null);
  return one(null);
}

// what a collection's, game's or preset's settings say, short, for the lists
function ovBits(o: ItemOv | undefined): string[] {
  if (!o) return [];
  const a: string[] = [];
  if (o.shape) a.push(SHAPE_LABELS[o.shape]);
  if (o.thickMode) a.push(o.thickMode === "varied" ? "varying thickness" : o.thickMode + " case");
  if (o.thick !== undefined) a.push(`${Math.round(o.thick * 100)}% thick`);
  if (o.media) a.push("own disc/cartridge color");
  if (o.off === true) a.push("3D off"); else if (o.off === false) a.push("3D on");
  if (o.band === true) a.push("band"); else if (o.band === false) a.push("no band");
  if (o.caseColor) a.push("own case color");
  if (o.bandColor) a.push("own band color");
  if (o.frame === true) a.push("frame"); else if (o.frame === false) a.push("no frame");
  if (o.frameColor) a.push("own frame color");
  if (o.slot) a.push(o.slot === "handheld" ? "bottom slot" : "side slot");
  if (o.when) a.push(o.when === "before" ? "before game logo" : "after game logo");
  if (o.insert !== undefined) a.push(o.insert ? "insert on" : "insert off");
  if (o.eject !== undefined) a.push(o.eject ? "eject on" : "eject off");
  if (o.art) a.push("print: " + PRINT_LABELS[o.art].toLowerCase());
  if (o.logoPos) a.push("logo " + LOGO_POS_LABELS[o.logoPos].toLowerCase());
  if (o.artY !== undefined) a.push("cover moved");
  if (o.window) a.push("own art window color");
  if (o.wear) a.push(WEAR_LABELS[o.wear]);
  return a;
}

// Automatic, then two choices (true, false), for a setting a game or collection can decide for itself
function TriRow(props: { title: string; hint?: string; value: boolean | undefined; yes: string; no: string; onChange: (v: boolean | null) => void; noYes?: boolean }) {
  const v = props.value;
  return (
    <div>
      <h2>{props.title}</h2>
      {props.hint && <div className="c3d-hint">{props.hint}</div>}
      <NavGrid cls="c3d-grid">
        <DialogButton className={v === undefined ? "on" : ""} onClick={() => props.onChange(null)}>Automatic</DialogButton>
        {!props.noYes && <DialogButton className={v === true ? "on" : ""} onClick={() => props.onChange(true)}>{props.yes}</DialogButton>}
        <DialogButton className={v === false ? "on" : ""} onClick={() => props.onChange(false)}>{props.no}</DialogButton>
      </NavGrid>
    </div>
  );
}

// Automatic, then any number of choices, for a setting a game or collection can decide for itself
function ChoiceRow<V extends string>(props: { title: string; hint?: string; value: V | undefined; options: [V, string][]; onChange: (v: V | null) => void }) {
  return (
    <div>
      <h2>{props.title}</h2>
      {props.hint && <div className="c3d-hint">{props.hint}</div>}
      <NavGrid cls="c3d-grid">
        <DialogButton className={props.value === undefined ? "on" : ""} onClick={() => props.onChange(null)}>Automatic</DialogButton>
        {props.options.map(([v, label]) => <DialogButton key={v} className={props.value === v ? "on" : ""} onClick={() => props.onChange(v)}>{label}</DialogButton>)}
      </NavGrid>
    </div>
  );
}


// how thick the box is. Two separate things: which thickness it starts from (standard, or the preset's own), and a percentage on top of that.
// Nothing selected in either = automatic / no adjustment (exactly one button is highlighted in the first row).
function ThicknessSection(props: { title: string; mode: "thin" | "standard" | "thick" | "varied" | undefined; value: number | undefined; onMode: (m: "thin" | "standard" | "thick" | "varied" | null) => void; onChange: (v: number | null) => void }) {
  const v = props.value;
  return (
    <div>
      <h2>{props.title}</h2>
      <NavGrid cls="c3d-grid">
        <DialogButton className={!props.mode ? "on" : ""} onClick={() => props.onMode(null)}>Automatic</DialogButton>
        <DialogButton className={props.mode === "varied" ? "on" : ""} onClick={() => props.onMode("varied")}>Preset-Variable</DialogButton>
        <DialogButton className={props.mode === "standard" ? "on" : ""} onClick={() => props.onMode("standard")}>Standard</DialogButton>
        <DialogButton className={props.mode === "thin" ? "on" : ""} onClick={() => props.onMode("thin")}>Thin</DialogButton>
        <DialogButton className={props.mode === "thick" ? "on" : ""} onClick={() => props.onMode("thick")}>Thick</DialogButton>
        {v !== undefined && <DialogButton onClick={() => props.onChange(null)}>Remove the adjustment</DialogButton>}
      </NavGrid>
      <div className="c3d-card">
        <SliderField label="Adjust Thickness" value={Math.round((v === undefined ? 1 : v) * 100)} min={Math.round(THICK_MIN * 100)} max={Math.round(THICK_MAX * 100)} step={1} showValue valueSuffix="%"
          onChange={(x: number) => props.onChange(x / 100)} />
      </div>
    </div>
  );
}

function PresetButton(props: { s: Settings; id: StyleId; on: boolean; onClick: () => void }) {
  return (
    <DialogButton className={props.on ? "on" : ""} onClick={props.onClick}>
      <Swatch s={props.s} id={props.id} /><span className="nm">{styleLabel(props.s, props.id)}</span>
    </DialogButton>
  );
}

// headers of one game's, collection's or selection's settings: "Insert Animation for this Game" (every word capitalized, except "for this")
function hdr(base: string, target: Target): string {
  return `${base} for ${target.kind === "coll" ? "this Collection" : target.kind === "bulk" ? "these Games" : "this Game"}`;
}

function Picker(props: { s: Settings; target: Target; onPick: (id: StyleId | null) => void; onPatch: (p: OvPatch) => void; onReset: () => void; onBack: () => void }) {
  const { s, target } = props;
  const isDefault = target.kind === "default";
  const ov: ItemOv = ovOfTarget(s, target) || {};
  const cur = isDefault ? s.color : ov.preset;
  const look = lookOfTarget(s, target);
  const custom = s.customs.map((c) => "custom:" + c.id);
  const tpls = templateIds();
  const patch = props.onPatch;
  const H = (base: string) => hdr(base, target);
  const gameImgs = useGameImages(target.kind === "game" ? target.id : null);
  const bandFb = cssToHsl(look.pal.band) || { h: 0, s: 0, l: 50 };
  const frameFb = cssToHsl(look.pal.frame || look.pal.band) || { h: 0, s: 0, l: 50 };
  return (
    <div>
      <h2>Look for: {target.name}</h2>
      <NavGrid cls="c3d-seg3" cols={isDefault ? 1 : 2}>
        <DialogButton onClick={props.onBack}>Back</DialogButton>
        {!isDefault && <DialogButton onClick={props.onReset}>Reset</DialogButton>}
      </NavGrid>
      <LookPreview s={s} look={look} game={target.kind === "game" ? gameImgs : undefined} note={target.kind === "bulk" ? "(the first selected game)" : undefined} />
      {!isDefault && (<div>
        <h2>Preset</h2>
        <div className="c3d-hint">Choose a console preset below or select Automatic for the default preset ({styleLabel(s, s.color)}).</div>
        <NavGrid cls="c3d-grid">
          <DialogButton className={!cur ? "on" : ""} onClick={() => props.onPick(null)}>Automatic</DialogButton>
        </NavGrid>
      </div>)}
      <h2>Disc Presets</h2>
      <NavGrid cls="c3d-grid">
        {DISC_PRESET_IDS.map((id) => <PresetButton key={id} s={s} id={id} on={cur === id} onClick={() => props.onPick(id)} />)}
      </NavGrid>
      <h2>Cartridge Presets</h2>
      <NavGrid cls="c3d-grid">
        {CART_PRESET_IDS.map((id) => <PresetButton key={id} s={s} id={id} on={cur === id} onClick={() => props.onPick(id)} />)}
      </NavGrid>
      {custom.length > 0 && (<div>
        <h2>Custom Presets</h2>
        <NavGrid cls="c3d-grid">{custom.map((id) => <PresetButton key={id} s={s} id={id} on={cur === id} onClick={() => props.onPick(id)} />)}</NavGrid>
      </div>)}
      {tpls.length > 0 && (<div>
        <h2>Templates</h2>
        <NavGrid cls="c3d-grid">{tpls.map((id) => <PresetButton key={id} s={s} id={id} on={cur === id} onClick={() => props.onPick(id)} />)}</NavGrid>
      </div>)}
      {!isDefault && (<div>
        <div className="c3d-overrides">
          <h2>Overrides</h2>
          <div className="c3d-hint">Everything below overrides their equivalent global settings when something other than Automatic is set.</div>
        </div>
        <TriRow title={H("3D Case")} value={ov.off === undefined ? undefined : !ov.off} yes="On" no="Off" noYes={target.kind === "coll"} onChange={(v) => patch({ off: v === null ? null : !v })} />
        <TriRow title={H("Insert Animation")} value={ov.insert} yes="On" no="Off" onChange={(v) => patch({ insert: v })} />
        <TriRow title={H("Eject Animation")} value={ov.eject} yes="On" no="Off" onChange={(v) => patch({ eject: v })} />
        <ChoiceRow title={H("Slot")} value={ov.slot} options={[["handheld", "Bottom Slot"], ["console", "Side Slot"]]} onChange={(v) => patch({ slot: v })} />
        <ChoiceRow title={H("Game Logo Timing")} value={ov.when} options={[["before", "Before Game Logo"], ["after", "After Game Logo"]]} onChange={(v) => patch({ when: v })} />
        <h2>{H("Case & Disc/Cartridge")}</h2>
        <NavGrid cls="c3d-grid">
          <DialogButton className={!ov.shape ? "on" : ""} onClick={() => patch({ shape: null })}>Automatic</DialogButton>
          {SHAPE_IDS.map((sh) => <DialogButton key={sh} className={ov.shape === sh ? "on" : ""} onClick={() => patch({ shape: sh })}>{SHAPE_LABELS[sh]}</DialogButton>)}
        </NavGrid>
        <ThicknessSection title={H("Case Thickness")} mode={ov.thickMode} value={ov.thick} onMode={(m) => patch({ thickMode: m })} onChange={(v) => patch({ thick: v })} />
        <ColorSection title={H("Case Color")} value={ov.caseColor} fallback={caseColorOf(look)} onChange={(c) => patch({ caseColor: c })} />
        <ColorSection title={H("Disc/Cartridge Color")} value={ov.media} fallback={mediaColorOf(look)} onChange={(c) => patch({ media: c })} />
        <ChoiceRow title={H("Disc/Cartridge Print")} value={ov.art} options={PRINT_OPTIONS} onChange={(v) => patch({ art: v })} />
        {look.art === "logo" && !mediaGeom(look.shapeId).card && (
          <ChoiceRow title={H("Logo Position")} value={ov.logoPos} options={LOGO_POS_IDS.map((id): [typeof id, string] => [id, LOGO_POS_LABELS[id]])} onChange={(v) => patch({ logoPos: v })} />
        )}
        {look.art === "cover" && (
          <div>
            <h2>{H("Cover Art Position")}</h2>
            <NavGrid cls="c3d-grid">
              <DialogButton className={ov.artY === undefined ? "on" : ""} onClick={() => patch({ artY: null })}>Automatic</DialogButton>
            </NavGrid>
            <div className="c3d-card">
              <SliderField label="Adjust Art Vertically" value={ov.artY === undefined ? 0 : ov.artY} min={ART_Y_MIN} max={ART_Y_MAX} step={1} showValue valueSuffix="%"
                onChange={(x: number) => patch({ artY: x })} />
            </div>
          </div>
        )}
        {mediaGeom(look.shapeId).card && (
          <ColorSection title={H("Art Window Color")} value={ov.window} autoLabel="Automatic"
            extra={{ label: "Match Cartridge", on: ov.windowMode === "match" && !ov.window, onClick: () => patch({ windowMode: "match", window: null }) }}
            fallback={look.windowMode === "match" ? mediaColorOf(look) : look.windowMode === "white" ? whiteWindowColor() : autoWindowColor()}
            onChange={(c) => patch({ window: c, windowMode: null })} />
        )}
        <TriRow title={H("Band")} value={ov.band} yes="Band" no="No Band" onChange={(v) => patch({ band: v })} />
        <ColorSection title={H("Band Color")} value={ov.bandColor} fallback={bandFb} onChange={(c) => patch({ bandColor: c })} />
        <TriRow title={H("Frame")} value={ov.frame} yes="Frame" no="No Frame" onChange={(v) => patch({ frame: v })} />
        <ColorSection title={H("Frame Color")} value={ov.frameColor} fallback={frameFb} onChange={(c) => patch({ frameColor: c })} />
        <h2>{H("Wear")}</h2>
        <NavGrid cls="c3d-grid">
          <DialogButton className={!ov.wear ? "on" : ""} onClick={() => patch({ wear: null })}>Automatic</DialogButton>
          {WEAR_SORTED.map((w) => <DialogButton key={w} className={ov.wear === w ? "on" : ""} onClick={() => patch({ wear: w })}>{WEAR_LABELS[w]}</DialogButton>)}
        </NavGrid>
      </div>)}
    </div>
  );
}

// one of your own presets: name, color, band and frame colors, and the case and disc or cartridge it comes with.
// It is a preset of its own, so making one never changes the built-in presets.
function PresetEditor(props: { s: Settings; c: CustomColor; onBack: () => void }) {
  const { s, c } = props;
  const key = "custom:" + c.id;
  const save = (next: CustomColor) => commit({ ...s, customs: s.customs.map((x) => (x.id === c.id ? next : x)) });
  const upd = (patch: Partial<CustomColor>) => save({ ...c, ...patch });
  const setOpt = (which: "band" | "frame" | "media", v: HslColor | null) => {
    const next: CustomColor = { ...c };
    if (v) next[which] = v; else delete next[which];
    save(next);
  };
  const del = () => {
    const gameOv = { ...s.gameOv }, collOv = { ...s.collOv };
    [gameOv, collOv].forEach((m) => Object.keys(m).forEach((k) => {
      if (m[k].preset !== key) return;
      const r = applyPatch(m[k], { preset: null });
      if (r) m[k] = r; else delete m[k];
    }));
    commit({ ...s, customs: s.customs.filter((x) => x.id !== c.id), gameOv, collOv, color: s.color === key ? DEFAULTS.color : s.color });
    props.onBack();
  };
  const look = lookForIds({ ...s, color: key, gameOv: {}, collOv: {} }, null, []);
  return (
    <div>
      <h2>Preset: {c.name}</h2>
      <DialogButton style={{ marginBottom: 10 }} onClick={props.onBack}>Back</DialogButton>
      <LookPreview s={s} look={look} />
      <div className="c3d-card">
        <TextField label="Name" value={c.name} onChange={(e: any) => upd({ name: String(e.target.value).slice(0, 24) })} />
        <ToggleField label="Crystal (see-through)" checked={c.glass} onChange={(v: boolean) => upd({ glass: v })} />
      </div>
      <ColorSection title="Preset color" noAuto={true} value={{ h: c.h, s: c.s, l: c.l }} fallback={{ h: 210, s: 70, l: 45 }}
        hint="The color of the case: its sides and back and, unless you pick a band color below, its band."
        onChange={(v) => { if (v) upd({ h: v.h, s: v.s, l: v.l }); }} />
      <ColorSection title="Band color" hint="The strip along the top of the cover. Same as the preset = the preset color." value={c.band} autoLabel="Same as the preset" fallback={cssToHsl(look.pal.band) || { h: 0, s: 0, l: 92 }} onChange={(v) => setOpt("band", v)} />
      <ColorSection title="Frame color" hint="The color around the art, for example a black frame with a white band. Same as the band = no separate frame color." value={c.frame} autoLabel="Same as the band" fallback={cssToHsl(look.pal.frame || look.pal.band) || { h: 220, s: 10, l: 12 }} onChange={(v) => setOpt("frame", v)} />
      <ColorSection title="Disc/Cartridge color" hint="The color of the disc or the plastic of the cartridge. Automatic keeps the console's own." value={c.media} fallback={mediaColorOf(look)} onChange={(v) => setOpt("media", v)} />
      <h2>Case & Disc/Cartridge</h2>
      <div className="c3d-hint">Automatic follows the shape set for all games. Pick one to give every game that uses this preset that case and that disc or cartridge (which also decides how thick the box is).</div>
      <NavGrid cls="c3d-grid">
        {(["auto", ...SHAPE_IDS] as (ShapeId | "auto")[]).map((sh) => (
          <DialogButton key={sh} className={c.shape === sh ? "on" : ""} onClick={() => upd({ shape: sh })}>{SHAPE_LABELS[sh]}</DialogButton>
        ))}
      </NavGrid>
      <DialogButton onClick={del}>Delete this preset</DialogButton>
    </div>
  );
}

// ---------- full-screen page ----------

const MAX_PRESETS = 24;
type PageTab = "games" | "collections" | "presets";

// where you were on the page, kept while you are inside a game's, collection's or preset's settings, so Back (or B) returns to the same tab, search and row
const nav: { tab: PageTab; q: string; focus: string | null; uninstalled: boolean } = { tab: "games", q: "", focus: null, uninstalled: false };
const keyClass = (k: string) => "c3d-key-" + k.replace(/[^A-Za-z0-9_-]/g, "_");
function restoreFocus(): void {
  const key = nav.focus;
  if (!key) return;
  nav.focus = null;
  const go = (n: number) => {
    const el = document.querySelector("." + keyClass(key)) as HTMLElement | null;
    if (el) { try { el.scrollIntoView({ block: "center" }); (el as any).focus(); } catch (e) { /* ignore */ } }
    else if (n < 8) setTimeout(() => go(n + 1), 80);
  };
  setTimeout(() => go(0), 60);
}
// every override cleared (the preset too), or every override cleared in favor of one preset
const clearOv = (preset: StyleId | null): OvPatch => {
  const all: OvPatch = {};
  OV_KEYS.forEach((k) => { (all as any)[k] = null; });
  all.preset = preset;
  return all;
};

// B (cancel) inside a game's, a collection's or a preset's settings goes back to the tabs, like the Back button, instead of leaving the whole page
function BackOnB(props: { onBack: () => void; children?: any }) {
  const back = (e: any) => { try { e.stopPropagation(); if (e.preventDefault) e.preventDefault(); } catch (err) { /* ignore */ } props.onBack(); };
  return (
    <Focusable className="c3d-page" onCancel={back} onCancelButton={back} onCancelActionDescription="Back">
      <style>{CSS}</style>
      {props.children}
    </Focusable>
  );
}

function CasesPage() {
  const s = useSettings();
  const [tab, setTabState] = useState<PageTab>(nav.tab);
  const setTab = (x: PageTab) => { nav.tab = x; setTabState(x); };
  const [uninst, setUninstState] = useState(nav.uninstalled);
  const setUninst = (x: boolean) => { nav.uninstalled = x; setUninstState(x); };
  const [q, setQState] = useState(nav.q);
  const setQ = (x: string) => { nav.q = x; setQState(x); };
  const [target, setTarget] = useState<Target | null>(null);
  const [presetId, setPresetId] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [sel, setSel] = useState<string[]>([]);
  const games = tab === "games" ? allGames() : [];
  const colls = tab === "collections" ? collections().list : [];
  const needle = q.trim().toLowerCase();
  const matches = games.filter((g) => (uninst || g.installed) && (!needle || g.name.toLowerCase().indexOf(needle) >= 0));
  const shown = matches.slice(0, 60);

  // a game or a collection stays open after a change, so several settings can be made one after the other
  const pick = (id: StyleId | null) => {
    if (!target) return;
    if (target.kind === "default") { commit({ ...s, color: id || DEFAULTS.color }); return; }
    // choosing a preset, Automatic, or the one already set starts over: every other setting of this game or collection goes back to Automatic
    commit(patchSettings(s, target, clearOv(id)));
  };
  const resetAll = () => { if (target && target.kind !== "default") commit(patchSettings(s, target, clearOv(null))); };
  const open = (t: Target, key: string) => { nav.focus = key; setTarget(t); };
  const openPreset = (id: string) => { nav.focus = "preset:" + id; setPresetId(id); };
  useEffect(() => { if (!target && !presetId) restoreFocus(); }, [target, presetId]);
  const patch = (p: OvPatch) => { if (target) commit(patchSettings(s, target, p)); };
  const closeTarget = () => { if (target && target.kind === "bulk") { setSel([]); setSelecting(false); } setTarget(null); };
  const addPreset = () => {
    if (s.customs.length >= MAX_PRESETS) return;
    const id = Math.random().toString(36).slice(2, 8);
    commit({ ...s, customs: [...s.customs, { id, name: "My preset " + (s.customs.length + 1), h: 210, s: 70, l: 45, glass: false, shape: "auto" as const }] });
    setPresetId(id); // open it at once, to name it and choose its colors
  };
  const toggleSel = (id: string) => setSel(sel.indexOf(id) >= 0 ? sel.filter((x) => x !== id) : [...sel, id]);

  const editing = presetId ? s.customs.filter((x) => x.id === presetId)[0] : undefined;
  // a preset's or a game's or collection's settings: shown instead of the tabs (the tabs stay where they are, hidden, so Back returns to them as they were)
  const sub = editing ? (
    <BackOnB onBack={() => setPresetId(null)}>
      <PresetEditor s={s} c={editing} onBack={() => setPresetId(null)} />
    </BackOnB>
  ) : target ? (
    <BackOnB onBack={closeTarget}>
      <Picker s={s} target={target} onPick={pick} onPatch={patch} onReset={resetAll} onBack={closeTarget} />
    </BackOnB>
  ) : null;

  const rowText = (id: string | undefined, o: ItemOv | undefined, none: string) => [id ? styleLabel(s, id) : none, ...ovBits(o)].join(" - ");
  const gamesTab = (
    <div>
      <TextField label="Search games" value={q} onChange={(e: any) => setQ(e.target.value)} />
      <div style={{ height: 8 }} />
      <NavGrid cls="c3d-grid">
        <DialogButton className={selecting ? "on" : ""} onClick={() => { setSelecting(!selecting); setSel([]); }}>Select Multiple</DialogButton>
        <DialogButton className={uninst ? "on" : ""} onClick={() => setUninst(!uninst)}>Show Uninstalled Games</DialogButton>
        {selecting && <DialogButton onClick={() => setSel(matches.map((g) => g.id))}>Select all {matches.length} shown by search</DialogButton>}
        {selecting && sel.length > 0 && (
          <DialogButton className="on" onClick={() => setTarget({ kind: "bulk", id: "", name: `${sel.length} selected games`, ids: sel })}>
            Choose a preset or settings for {sel.length}
          </DialogButton>
        )}
      </NavGrid>
      {games.length === 0 && <div className="c3d-hint">Couldn't read your game list from Steam.</div>}
      {shown.map((g) => {
        const o = s.gameOv[g.id];
        const on = sel.indexOf(g.id) >= 0;
        return (
          <DialogButton key={g.id} className={"c3d-row " + keyClass("game:" + g.id)}
            onClick={() => (selecting ? toggleSel(g.id) : open({ kind: "game", id: g.id, name: g.name }, "game:" + g.id))}>
            {selecting && <div className={"c3d-chk" + (on ? " on" : "")} />}
            <Swatch s={s} id={(o && o.preset) || s.color} />
            <span className="nm">{g.name}{g.shortcut ? " (non-Steam)" : ""}</span>
            <span className="st">{rowText(o && o.preset, o, "Default")}</span>
          </DialogButton>
        );
      })}
      {matches.length > shown.length && <div className="c3d-hint">Showing {shown.length} of {matches.length}. Use search to narrow it down.</div>}
    </div>
  );
  const collectionsTab = (
    <div>
      {colls.length === 0 && <div className="c3d-hint">No collections found. Make some in your Library first.</div>}
      {colls.map((c) => {
        const o = s.collOv[c.id];
        return (
          <DialogButton key={c.id} className={"c3d-row " + keyClass("coll:" + c.id)} onClick={() => open({ kind: "coll", id: c.id, name: c.name }, "coll:" + c.id)}>
            <Swatch s={s} id={(o && o.preset) || s.color} />
            <span className="nm">{c.name} ({c.apps.length})</span>
            <span className="st">{rowText(o && o.preset, o, "Default")}</span>
          </DialogButton>
        );
      })}
    </div>
  );
  const presetsTab = (
    <div>
      <DialogButton className={"c3d-row " + keyClass("default")} onClick={() => open({ kind: "default", id: "", name: "Default (all other games)" }, "default")}>
        <Swatch s={s} id={s.color} /><span className="nm">Default Preset</span><span className="st">{styleLabel(s, s.color)}</span>
      </DialogButton>
      <h2>Custom Presets</h2>
      {s.customs.map((c) => (
        <DialogButton key={c.id} className={"c3d-row " + keyClass("preset:" + c.id)} onClick={() => openPreset(c.id)}>
          <Swatch s={s} id={"custom:" + c.id} /><span className="nm">{c.name}</span>
          <span className="st">{[c.band ? "own band" : "", c.frame ? "own frame" : "", c.media ? "own disc/cartridge color" : "", c.glass ? "crystal" : "", c.shape !== "auto" ? SHAPE_LABELS[c.shape] : ""].filter(Boolean).join(", ")}</span>
        </DialogButton>
      ))}
      {s.customs.length < MAX_PRESETS && <DialogButton onClick={addPreset}>New Preset</DialogButton>}
      <h2>Templates</h2>
      <div className="c3d-hint">
        Want a printed console frame instead of a plain color? Put frame pictures (PNG, WebP or JPG, 2:3, such as the console templates in the SteamGridDB collection "Templates") into the folder below, then press Reload. Each one shows up in the preset lists next to the others; the game's own cover shows through the window of the frame.
        <br />Folder: {tpl.folder || "~/homebrew/settings/3d-game-cases/templates"}
        <br />{tpl.loading ? "Loading..." : tpl.error ? "Problem: " + tpl.error : `${tpl.loaded} loaded${tpl.found > tpl.loaded ? `, ${tpl.found - tpl.loaded} could not be read` : ""}`}
        <br />If a frame's window is not found right, add a file next to it with the same name and .json, for example <code>{`{"window":[0.04,0.11,0.04,0.04]}`}</code> (left, top, right, bottom, as fractions of the frame).
      </div>
      <DialogButton onClick={() => { void loadTemplatesNow(); }}>Reload Templates</DialogButton>
    </div>
  );

  // Steam's own tab component gives the left and right bumpers for free; without it, plain buttons
  if (Tabs) {
    // while a sub page is open the tab contents are empty (nothing to draw for nothing), but the tab bar itself stays mounted
    const body = (c: any) => (sub ? <div /> : <div className="c3d-tabbody"><style>{CSS}</style>{c}</div>);
    const tabs = [
      { id: "games", title: "Games", content: body(gamesTab) },
      { id: "collections", title: "Collections", content: body(collectionsTab) },
      { id: "presets", title: "Presets", content: body(presetsTab) },
    ];
    return (
      <>
        {sub}
        <div className="c3d-tabswrap" style={sub ? { display: "none" } : undefined}><style>{CSS}</style>
          <Tabs tabs={tabs} activeTab={tab} onShowTab={(id: string) => setTab(id as PageTab)} />
        </div>
      </>
    );
  }
  if (sub) return sub;
  return (
    <div className="c3d-page">
      <style>{CSS}</style>
      <h2>3D Game Cases</h2>
      <NavGrid cls="c3d-tabs3">
        <DialogButton className={tab === "games" ? "on" : ""} onClick={() => setTab("games")}>Games</DialogButton>
        <DialogButton className={tab === "collections" ? "on" : ""} onClick={() => setTab("collections")}>Collections</DialogButton>
        <DialogButton className={tab === "presets" ? "on" : ""} onClick={() => setTab("presets")}>Presets</DialogButton>
      </NavGrid>
      {tab === "games" && gamesTab}
      {tab === "collections" && collectionsTab}
      {tab === "presets" && presetsTab}
    </div>
  );
}

// ---------- Quick Access panel ----------

function Content() {
  const s = useSettings();
  const [lines, setLines] = useState<string[]>([]);
  const [info, setInfo] = useState<string[]>([]);
  const [busy, setBusy] = useState("");
  const change = (patch: Partial<Settings>) => commit({ ...s, ...patch });

  const doCheck = async () => {
    setBusy("Checking...");
    const r = await runSelfCheck();
    setLines(r.lines);
    if (!current.checkedOnce) commit({ ...current, checkedOnce: true });
    if (r.failed) {
      const path = await saveReport("Self-check found a problem");
      if (path) setLines([...r.lines, "", "A report was saved: " + path]);
    }
    setBusy("");
  };
  const doReport = async () => {
    setBusy("Saving...");
    const path = await saveReport("Saved by hand");
    setLines(path ? ["Report saved: " + path] : ["Could not save a report. The background part is not answering, so only the on-screen check works."]);
    setBusy("");
  };
  const setFallback = (m: "auto" | "off" | "always") => {
    commit({ ...current, fallback: m });
    if (m === "always") { stopEngine(); void startFallback(); }
    else if (m === "off") { void stopFallback(); startEngine(); }
    else { startEngine(); scheduleFallbackChecks(); }
  };

  if (s.safeMode) {
    let reason = "";
    try { reason = window.localStorage.getItem(REASON_KEY) || ""; } catch (e) { /* ignore */ }
    return (
      <div>
        <style>{CSS}</style>
        <PanelSection title="Safe mode is ON">
          <PanelSectionRow>
            <div className="c3d-note">{"Everything is switched off: no 3D cases, no injected styles, no listeners.\n" + (reason ? reason + "\n" : "") + "This stays off after restarts until you turn it back on."}</div>
          </PanelSectionRow>
          <PanelSectionRow>
            <ButtonItem layout="below" onClick={leaveSafe}>Turn the plugin back on</ButtonItem>
          </PanelSectionRow>
          <PanelSectionRow>
            <div className="c3d-note">{"If the library is broken and you cannot open this panel, run this in Konsole, then restart Steam:\ntouch ~/homebrew/settings/3d-game-cases/SAFE_MODE"}</div>
          </PanelSectionRow>
        </PanelSection>
      </div>
    );
  }

  const fbText = fb.active ? `Fallback injection active (${fb.targets} window).` : fb.error ? `Fallback not running: ${fb.error}.` : s.fallback === "off" ? "Fallback is off." : "Fallback standby (starts only if the library window cannot be reached).";

  return (
    <div>
      <style>{CSS}</style>
      {!s.checkedOnce && (
        <PanelSection title="First time?">
          <PanelSectionRow>
            <div className="c3d-note">Press "Run Self-Check" (under Tools, at the bottom) once. It tests every step and shows a pass or fail line for each. A photo of the result is all that is needed if something does not work.</div>
          </PanelSectionRow>
        </PanelSection>
      )}
      <PanelSection title="3D Game Cases">
        <PanelSectionRow>
          <ToggleField label="Enabled" checked={s.enabled} onChange={(v: boolean) => change({ enabled: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" description={`Default: ${styleLabel(s, s.color)}`} onClick={() => { nav.tab = "games"; nav.q = ""; nav.focus = null; nav.uninstalled = false; Router.CloseSideMenus(); Navigation.Navigate(PAGE); }}>
            Configuration
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
      {s.enabled && (
      <PanelSection title="Global Settings">
        <PanelSectionRow>
          <ToggleField label="Bands" description="Adds a colored strip along the top of the cover." checked={s.band} onChange={(v: boolean) => change({ band: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Frames" description="Shrinks game art slightly and adds a border matching the box's color."
            checked={s.bandFrame} onChange={(v: boolean) => change({ bandFrame: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Wear" description="Adds visible wear to game cases that increases with playtime." bottomSeparator={s.playWear ? "none" : "standard"}
            checked={s.playWear} onChange={(v: boolean) => change({ playWear: v })} />
        </PanelSectionRow>
        {s.playWear && (
          <PanelSectionRow>
            <NavGrid cls="c3d-seg3" cols={2}>
              {(["slow", "normal", "fast"] as const).map((w) => (
                <DialogButton key={w} className={!s.wearOverride && s.wearSpeed === w ? "on" : ""} onClick={() => change({ wearSpeed: w, wearOverride: false })}>
                  {w === "slow" ? "Wear Slowly" : w === "fast" ? "Wear Fast" : "Normal"}
                </DialogButton>
              ))}
              <DialogButton className={s.wearOverride ? "on" : ""} onClick={() => change({ wearOverride: true })}>Override</DialogButton>
            </NavGrid>
          </PanelSectionRow>
        )}
        {s.playWear && s.wearOverride && (
          <PanelSectionRow>
            <div className="c3d-rule c3d-rule-roomy" />
          </PanelSectionRow>
        )}
        {s.playWear && s.wearOverride && (
          <PanelSectionRow>
            <NavGrid cls="c3d-seg">
              {WEAR_SORTED.map((w) => <DialogButton key={w} className={s.wear === w ? "on" : ""} onClick={() => change({ wear: w })}>{WEAR_LABELS[w]}</DialogButton>)}
            </NavGrid>
          </PanelSectionRow>
        )}
        {s.playWear && (
          <PanelSectionRow>
            <div className="c3d-rule" />
          </PanelSectionRow>
        )}
        <PanelSectionRow>
          <ToggleField label="Variable Case Thickness" description="Allows presets to override the default box thickness."
            checked={s.varyThickness} onChange={(v: boolean) => change({ varyThickness: v })} />
        </PanelSectionRow>
      </PanelSection>
      )}
      <PanelSection title="Animations">
        <PanelSectionRow>
          <NavGrid cls="c3d-seg3" cols={2}>
            {([["handheld", "Bottom Slot"], ["console", "Side Slot"]] as ["handheld" | "console", string][]).map(([id, label]) => (
              <DialogButton key={id} className={s.insertTarget === id ? "on" : ""} onClick={() => change({ insertTarget: id })}>{label}</DialogButton>
            ))}
          </NavGrid>
        </PanelSectionRow>
        <PanelSectionRow>
          <NavGrid cls="c3d-seg3" cols={2} style={{ marginTop: 10 }}>
            {(["before", "after"] as const).map((w) => (
              <DialogButton key={w} className={s.insertWhen === w ? "on" : ""} onClick={() => change({ insertWhen: w })}>
                {w === "before" ? "Before Game Logo" : "After Game Logo"}
              </DialogButton>
            ))}
          </NavGrid>
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Sounds" checked={s.insertSound} onChange={(v: boolean) => change({ insertSound: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Enable Insert Animation" checked={s.insertAnim} onChange={(v: boolean) => change({ insertAnim: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <SliderField label="Insert Speed" value={Math.round(s.insertSpeed * 100)} min={50} max={300} step={50} showValue valueSuffix="%"
            onChange={(v: number) => change({ insertSpeed: v / 100 })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={() => { Router.CloseSideMenus(); setTimeout(() => { void playInsertAny(null, false, true); }, 450); }}>
            Preview Insert Animation
          </ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Enable Eject Animation" checked={s.ejectAnim} onChange={(v: boolean) => change({ ejectAnim: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <SliderField label="Eject Speed" value={Math.round(s.ejectSpeed * 100)} min={50} max={300} step={50} showValue valueSuffix="%"
            onChange={(v: number) => change({ ejectSpeed: v / 100 })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={() => { Router.CloseSideMenus(); setTimeout(() => { void playInsertAny(null, true, true); }, 450); }}>
            Preview Eject Animation
          </ButtonItem>
        </PanelSectionRow>
      </PanelSection>
      <PanelSection title="Case & Disc/Cartridge">
        <PanelSectionRow>
          <NavGrid cls="c3d-seg">
            {(["auto", ...SHAPE_IDS] as (ShapeId | "auto")[]).map((sh) => (
              <DialogButton key={sh} className={s.shape === sh ? "on" : ""} onClick={() => change({ shape: sh })}>{SHAPE_LABELS[sh]}</DialogButton>
            ))}
          </NavGrid>
        </PanelSectionRow>
        <PanelSectionRow>
          <div className="c3d-label">Case Thickness</div>
        </PanelSectionRow>
        <PanelSectionRow>
          <NavGrid cls="c3d-seg3">
            {([["thin", "Thin"], ["standard", "Standard"], ["thick", "Thick"]] as ["thin" | "standard" | "thick", string][]).map(([id, label]) => (
              <DialogButton key={id} className={s.thickness === id ? "on" : ""} onClick={() => change({ thickness: id })}>{label}</DialogButton>
            ))}
          </NavGrid>
        </PanelSectionRow>
      </PanelSection>
      <PanelSection title="Disc and Cartridge Print">
        <PanelSectionRow>
          <div className="c3d-label">Game Cover Style</div>
        </PanelSectionRow>
        <PanelSectionRow>
          <NavGrid cls="c3d-seg">
            {PRINT_OPTIONS.map(([id, label]) => (
              <DialogButton key={id} className={s.insertArt === id ? "on" : ""} onClick={() => change({ insertArt: id })}>{label}</DialogButton>
            ))}
          </NavGrid>
        </PanelSectionRow>
        <PanelSectionRow>
          <div className="c3d-label">Cartridge Art Window Color</div>
        </PanelSectionRow>
        <PanelSectionRow>
          <NavGrid cls="c3d-seg3">
            <DialogButton className={s.windowMode === "black" ? "on" : ""} onClick={() => change({ windowMode: "black" })}>Black</DialogButton>
            <DialogButton className={s.windowMode === "white" ? "on" : ""} onClick={() => change({ windowMode: "white" })}>White</DialogButton>
            <DialogButton className={s.windowMode === "match" ? "on" : ""} onClick={() => change({ windowMode: "match" })}>Match Cartridge</DialogButton>
          </NavGrid>
        </PanelSectionRow>
      </PanelSection>
      <PanelSection title="Effects">
        <PanelSectionRow>
          <NavGrid cls="c3d-seg3">
            {(["off", "battery", "always"] as const).map((m) => (
              <DialogButton key={m} className={s.lessMotion === m ? "on" : ""} onClick={() => change({ lessMotion: m })}>
                {m === "off" ? "Full Motion" : m === "battery" ? "Less Battery" : "Less Motion"}
              </DialogButton>
            ))}
          </NavGrid>
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Hover on Focus"
            checked={s.float} onChange={(v: boolean) => change({ float: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Foil Shine on Focus"
            checked={s.shine} onChange={(v: boolean) => change({ shine: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Plastic Sleeve & Rounded Corners"
            checked={s.sleeve} onChange={(v: boolean) => change({ sleeve: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Pick Up on Select"
            checked={s.pickup} onChange={(v: boolean) => change({ pickup: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <SliderField label="Focused Game Tilt" value={s.angle} min={0} max={40} step={1} showValue valueSuffix="°" onChange={(v: number) => change({ angle: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Neighbors Lean Away" bottomSeparator="none"
            checked={s.neighbors} onChange={(v: boolean) => change({ neighbors: v })} />
        </PanelSectionRow>
        {s.neighbors && (
          <PanelSectionRow>
            <SliderField label="Lean Amount" value={s.neighborLean} min={1} max={30} step={1} showValue valueSuffix="°"
              onChange={(v: number) => change({ neighborLean: v })} />
          </PanelSectionRow>
        )}
        {s.neighbors && (
          <PanelSectionRow>
            <NavGrid cls="c3d-seg3" cols={2}>
              <DialogButton className={!s.nbPause ? "on" : ""} onClick={() => change({ nbPause: false })}>Hide Box at Once</DialogButton>
              <DialogButton className={s.nbPause ? "on" : ""} onClick={() => change({ nbPause: true })}>Settle Flat First</DialogButton>
            </NavGrid>
          </PanelSectionRow>
        )}
        <PanelSectionRow>
          <NavGrid cls="c3d-seg3" style={{ marginTop: 10 }}>
            {(["calm", "normal", "snappy"] as const).map((sp) => (
              <DialogButton key={sp} className={s.speed === sp ? "on" : ""} onClick={() => change({ speed: sp })}>
                {sp === "calm" ? "Calm" : sp === "snappy" ? "Snappy" : "Normal"}
              </DialogButton>
            ))}
          </NavGrid>
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Plastic Gloss" checked={s.gloss} onChange={(v: boolean) => change({ gloss: v })} />
        </PanelSectionRow>
        <PanelSectionRow>
          <ToggleField label="Shadow" checked={s.shadow} onChange={(v: boolean) => change({ shadow: v })} />
        </PanelSectionRow>
      </PanelSection>
      <PanelSection title="Tools">
        <PanelSectionRow>
          <ButtonItem layout="below" disabled={!!busy} onClick={doCheck}>{busy || "Run Self-Check"}</ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" disabled={!!busy} description={lastReport ? "Last: " + lastReport : "Saved to the Downloads folder."} onClick={doReport}>Save Report</ButtonItem>
        </PanelSectionRow>
        {lines.length > 0 && <PanelSectionRow><div className="c3d-note">{lines.join("\n")}</div></PanelSectionRow>}
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={async () => {
            if (usingFallback()) { const r = await fallbackCall("report", ""); setInfo(r && r.ok && r.values && r.values[0] ? r.values[0] : ["No answer from the fallback."]); }
            else setInfo(engine ? engine.report() : ["Not running."]);
          }}>View Results</ButtonItem>
        </PanelSectionRow>
        {info.length > 0 && <PanelSectionRow><div className="c3d-note">{info.join("\n")}</div></PanelSectionRow>}
        <PanelSectionRow>
          <NavGrid cls="c3d-seg3">
            {(["auto", "off", "always"] as const).map((m) => (
              <DialogButton key={m} className={s.fallback === m ? "on" : ""} onClick={() => setFallback(m)}>
                {m === "auto" ? "Fallback: Auto" : m === "off" ? "Fallback: Off" : "Fallback: Always"}
              </DialogButton>
            ))}
          </NavGrid>
        </PanelSectionRow>
        <PanelSectionRow><div className="c3d-note">{fbText}</div></PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" description="Removes everything and stays off after restarts." onClick={() => enterSafe("You switched safe mode on.")}>Safe Mode</ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={() => {
            // every global setting goes back to its default, the default preset, default wear and the fallback included; what is kept is not a setting:
            // your custom presets, the settings of each game and collection (Clear Overrides), safe mode and whether the first-run check was done
            commit({ ...DEFAULTS, customs: s.customs, gameOv: s.gameOv, collOv: s.collOv, checkedOnce: s.checkedOnce, safeMode: s.safeMode });
            if (s.fallback !== DEFAULTS.fallback) setFallback(DEFAULTS.fallback);
          }}>Restore Global Defaults</ButtonItem>
        </PanelSectionRow>
        <PanelSectionRow>
          <ButtonItem layout="below" onClick={() => commit({ ...s, gameOv: {}, collOv: {} })}>Clear Overrides</ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    </div>
  );
}

export default definePlugin(() => {
  current = loadSettings();
  const tripped = bootGuard();
  if (tripped && !current.safeMode) enterSafe("The plugin did not survive three starts in a row, so it switched itself off.");
  if (!current.safeMode) { startEngine(); scheduleFallbackChecks(); }
  hookLifetime();
  watchBattery();
  timers.push(setTimeout(() => { void loadTemplatesNow(); }, 1500));
  routerHook.addRoute(PAGE, CasesPage);
  void be(() => cGetSafe(), 5000).then((fileSafe) => {
    if (fileSafe === true && !current.safeMode) enterSafe("The safe-mode file was found (SAFE_MODE).");
    else if (fileSafe === false && current.safeMode) void be(() => cSetSafe(true));
  });
  const guard = setInterval(guardTick, 10000);
  return {
    name: "3D Game Cases",
    titleView: <div className={staticClasses.Title}>3D Game Cases</div>,
    content: <Content />,
    icon: <CubeIcon />,
    onDismount() {
      routerHook.removeRoute(PAGE);
      unhookLifetime();
      clearInterval(guard);
      timers.forEach((x) => clearTimeout(x)); timers = [];
      clearInterval(dataTimer); clearTimeout(pushTimer);
      try { window.localStorage.setItem(BOOT_KEY, JSON.stringify({ running: false, n: 0, t: Date.now() })); } catch (e) { /* ignore */ }
      stopEngine();
      void stopFallback();
      listeners.clear();
    },
  };
});
