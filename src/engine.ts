// Engine: injects the 3D-case CSS into every Steam UI window and tags portrait covers.
// Pure DOM code (no Decky imports) so it can be tested in a plain browser.

export type StyleId = string; // a built-in preset id (see PRESETS), "custom:<id>" (your own preset) or "tpl:<file>" (a frame picture)

export interface Pal { a: string; b: string; band: string; text: string; line: string; frame?: string /* color around the art with frames on; the band color when not set */ }

// ---------- presets ----------
// A preset is a known console: the colors of its case, a band and a frame color, the case and disc or cartridge it comes with
// (which also decides how thick its box is) and, for some, the color of its disc or cartridge.
// Everything in it can be overridden for a collection or a game (Looks, colors and presets), and the global switches
// (colored bands, colored frames, box thickness) win over what a preset brings along.
export type PresetGroup = "disc" | "cart";
export interface PresetDef { id: string; label: string; group: PresetGroup; shape: ShapeId; pal: Pal; media?: HslColor; noFrame?: boolean /* comes without a frame (Automatic = no frame) */; art?: InsertArt /* what is printed on its disc or cartridge unless a game or collection says otherwise */ }
const DISC_BLACK: HslColor = { h: 220, s: 10, l: 15 };
const DISC_WHITE: HslColor = { h: 0, s: 0, l: 92 };
const LN_LIGHT = "rgba(255,255,255,.25)", LN_DARK = "rgba(0,0,0,.18)";
const PAL_BLACK = { a: "#2c2f36", b: "#07080a", text: "#ffffff", line: "rgba(255,255,255,.22)" };
const PAL_RED = { a: "#ff2a38", b: "#7d000a", text: "#ffffff", line: "rgba(255,255,255,.28)" };
const PAL_GREY = { a: "#c3c7ce", b: "#555961", text: "#101214", line: "rgba(255,255,255,.3)" };
const PAL_WHITE = { a: "#ffffff", b: "#c9ccd3", text: "#1d1f24", line: LN_DARK };
const PAL_PS5 = { a: "#3a8fe8", b: "#0b4396", text: "#ffffff", line: "rgba(255,255,255,.28)" };
const INK = "#0b0c0e", PAPER = "#f2f3f5";
export const PRESETS: PresetDef[] = [
  // ---- discs ----
  { id: "steam", label: "Steam", group: "disc", shape: "keepcase", pal: { a: "#2a475e", b: "#0f1a24", band: "#2a475e", frame: "#2a475e", text: "#ffffff", line: LN_LIGHT } },
  { id: "gcn", label: "GCN", group: "disc", shape: "gc", pal: { ...PAL_BLACK, band: INK, frame: INK }, media: DISC_BLACK },
  { id: "wii", label: "Wii", group: "disc", shape: "keepcase", pal: { ...PAL_WHITE, band: PAPER, frame: PAPER }, media: DISC_WHITE },
  { id: "wiiu", label: "Wii U", group: "disc", shape: "keepcase", pal: { a: "#52d6ff", b: "#0a7ba8", band: "#ffffff", frame: "#00a9e0", text: "#042a3a", line: "rgba(255,255,255,.4)" }, media: DISC_WHITE },
  { id: "ps3", label: "PS1/PS3", group: "disc", shape: "keepcase", pal: { a: "rgba(222,227,236,.55)", b: "rgba(118,124,138,.70)", band: "#0b0b0d", frame: "#b9bec9", text: "#10151c", line: "rgba(255,255,255,.55)" } },
  { id: "ps2", label: "PS2", group: "disc", shape: "keepcase", pal: { ...PAL_BLACK, band: INK, frame: INK } },
  { id: "ps5", label: "PS4/PS5", group: "disc", shape: "keepcase", pal: { ...PAL_PS5, band: "#1560c4", frame: "#1560c4" } },
  { id: "xbox", label: "Xbox", group: "disc", shape: "keepcase", pal: { a: "#2e8b2e", b: "#0a380a", band: "#0b0b0b", frame: "#176b17", text: "#ffffff", line: LN_LIGHT }, media: DISC_BLACK },
  { id: "x360", label: "Xbox 360", group: "disc", shape: "keepcase", pal: { a: "#8ae857", b: "#35a81c", band: "#ffffff", frame: "#62d42e", text: "#0b2a05", line: "rgba(255,255,255,.4)" }, media: DISC_WHITE },
  { id: "xboxone", label: "Xbox One/Series", group: "disc", shape: "keepcase", pal: { a: "#34c24a", b: "#0b4a16", band: "#107c10", frame: "#107c10", text: "#ffffff", line: "rgba(255,255,255,.28)" } },
  // ---- cartridges ----
  { id: "nes", noFrame: true, art: "cover", label: "NES", group: "cart", shape: "nes", pal: { ...PAL_BLACK, band: INK, frame: INK } },
  { id: "snes", noFrame: true, label: "SNES", group: "cart", shape: "snes", pal: { ...PAL_BLACK, band: INK, frame: INK } },
  { id: "n64", noFrame: true, art: "cover", label: "N64", group: "cart", shape: "n64", pal: { ...PAL_RED, band: "#e60012", frame: "#e60012" } },
  { id: "gb", noFrame: true, label: "GB", group: "cart", shape: "gb", pal: { ...PAL_GREY, band: "#8d9199", frame: "#8d9199" } },
  { id: "gbc", noFrame: true, label: "GBC", group: "cart", shape: "gbc", pal: { ...PAL_GREY, band: "#8d9199", frame: "#8d9199" } },
  { id: "gba", noFrame: true, label: "GBA", group: "cart", shape: "gba", pal: { ...PAL_GREY, band: "#8d9199", frame: "#8d9199" } },
  { id: "ds", label: "DS", group: "cart", shape: "ds", pal: { ...PAL_WHITE, band: "#f4f5f7", frame: INK } },
  { id: "3ds", label: "3DS", group: "cart", shape: "3ds", pal: { ...PAL_WHITE, band: PAPER, frame: PAPER } },
  { id: "switch", label: "Switch", group: "cart", shape: "cartridge", pal: { ...PAL_RED, band: "#e60012", frame: "#e60012" } },
];
export const STYLE_IDS: StyleId[] = PRESETS.map((p) => p.id);
export const DISC_PRESET_IDS: StyleId[] = PRESETS.filter((p) => p.group === "disc").map((p) => p.id);
export const CART_PRESET_IDS: StyleId[] = PRESETS.filter((p) => p.group === "cart").map((p) => p.id);
export const STYLE_LABELS: Record<string, string> = {};
export const PALETTE: Record<string, Pal> = {};
PRESETS.forEach((p) => { STYLE_LABELS[p.id] = p.label; PALETTE[p.id] = p.pal; });
export const DEFAULT_PRESET: StyleId = "steam";
export function presetDef(id: string): PresetDef | null { return PRESETS.filter((p) => p.id === id)[0] || null; }

// "cartridge" is the Switch game card (its id is kept so saved settings still work)
export type ShapeId = "keepcase" | "gc" | "cartridge" | "jewel" | "bigbox" | "nes" | "snes" | "n64" | "gb" | "gbc" | "gba" | "ds" | "3ds";
export const SHAPE_IDS: ShapeId[] = ["keepcase", "jewel", "bigbox", "nes", "snes", "n64", "gb", "gbc", "gba", "gc", "ds", "3ds", "cartridge"];
export const SHAPE_LABELS: Record<string, string> = {
  auto: "Auto", keepcase: "Standard", gc: "GCN", cartridge: "Switch", jewel: "Thin", bigbox: "Thick",
  nes: "NES", snes: "SNES", n64: "N64", gb: "GB", gbc: "GBC", gba: "GBA", ds: "DS", "3ds": "3DS",
};
// Thickness is a multiple of the "Box Thickness" slider, which is the thickness of a standard DVD case (so a DVD case is 100%).
// The big box and the old cartridges (NES, SNES, N64, Game Boy, Game Boy Color, GBA) are the thickest cases, 5/3 of a DVD case
// (125% where the slider stands at the old 75% default: standard 75, thick 125, thin 50); the DS and 3DS cases are as thick as a
// regular DVD case (keepcase, GameCube); the Switch card and the jewel case are the thinnest, 2/3 of a DVD case.
const THICKEST = 5 / 3;
const OLD_CART = THICKEST;
const DVD_CASE = 1;
const THINNEST = 2 / 3;
const SHAPES: Record<ShapeId, { depth: number; radius: number; rim: number }> = {
  keepcase: { depth: DVD_CASE, radius: 2, rim: 0 },
  gc: { depth: DVD_CASE, radius: 2, rim: 0 }, // like a keepcase; only the disc (a mini disc) is smaller
  cartridge: { depth: THINNEST, radius: 5, rim: 0 },
  jewel: { depth: THINNEST, radius: 1, rim: 3 },
  bigbox: { depth: THICKEST, radius: 0, rim: 0 },
  n64: { depth: OLD_CART, radius: 4, rim: 0 },
  gba: { depth: OLD_CART, radius: 5, rim: 0 },
  gb: { depth: OLD_CART, radius: 4, rim: 0 },
  gbc: { depth: OLD_CART, radius: 4, rim: 0 },
  ds: { depth: DVD_CASE, radius: 6, rim: 0 },
  nes: { depth: OLD_CART, radius: 3, rim: 0 },
  snes: { depth: OLD_CART, radius: 4, rim: 0 },
  "3ds": { depth: DVD_CASE, radius: 6, rim: 0 },
};
const SLEEVE_R: Record<ShapeId, number> = { keepcase: 7, gc: 7, cartridge: 10, jewel: 2, bigbox: 2, n64: 8, gba: 9, gb: 8, gbc: 8, ds: 10, nes: 6, snes: 8, "3ds": 10 };

/** a color for a game's cartridge in the insert animation: hue 0-360, saturation and lightness 0-100 */
export interface HslColor { h: number; s: number; l: number }
export const COLOR_PRESETS: { name: string; c: HslColor }[] = [
  { name: "Black", c: { h: 220, s: 10, l: 15 } },
  { name: "White", c: { h: 0, s: 0, l: 92 } },
  { name: "Silver", c: { h: 220, s: 8, l: 72 } },
  { name: "Red", c: { h: 2, s: 75, l: 46 } },
  { name: "Blue", c: { h: 215, s: 72, l: 46 } },
  { name: "Green", c: { h: 140, s: 60, l: 36 } },
  { name: "Yellow", c: { h: 50, s: 90, l: 50 } },
  { name: "Gold", c: { h: 43, s: 70, l: 55 } },
  { name: "Orange", c: { h: 28, s: 90, l: 52 } },
  { name: "Cyan", c: { h: 195, s: 60, l: 58 } },
  { name: "Purple", c: { h: 275, s: 55, l: 45 } },
  { name: "Pink", c: { h: 330, s: 70, l: 62 } },
];

export type InsertArt = "cover" | "fit" | "logo" | "none";
/** Where the game's logo sits on a disc (it is printed on the top part by default). */
export type LogoPos = "top" | "left" | "right" | "bottom";
export const LOGO_POS_IDS: LogoPos[] = ["top", "left", "right", "bottom"];
export const LOGO_POS_LABELS: Record<LogoPos, string> = { top: "Top", left: "Left", right: "Right", bottom: "Bottom" };
/** How far the cover can be moved up or down on a disc or cartridge printed with Cover (Fill): % of the room the picture has to move (0 = where it starts: centered). */
export const ART_Y_MIN = -50, ART_Y_MAX = 50;
export const INSERT_ART_IDS: InsertArt[] = ["logo", "cover", "fit", "none"];
export const INSERT_SPEEDS = [0.5, 1, 1.5, 2, 3];

export type WearId = "none" | "sealed" | "light" | "worn" | "battered" | "faded" | "rental";
export const WEAR_IDS: WearId[] = ["none", "sealed", "light", "worn", "battered", "faded", "rental"];
// From the least to the most wear: by the amount played (never opened; under 1 hour; 1 to 10 hours; 10 to 50; over 50; "slow"/"fast" wear change
// the hours), then the two that are not an amount of playtime: sun-faded (played, but not for over a year) and the rental sticker (only set by hand)
export const WEAR_SORTED: WearId[] = ["sealed", "none", "light", "worn", "battered", "faded", "rental"];
export const WEAR_LABELS: Record<string, string> = {
  none: "Mint", sealed: "Sealed", light: "Light Scuffs", worn: "Well-Worn", battered: "Battered", faded: "Sun-Faded", rental: "Rental Sticker",
};
const SCUFF = "repeating-linear-gradient(118deg, rgba(255,255,255,.08) 0 1px, transparent 1px 19px)";
const WEAR_CSS: Record<WearId, string> = {
  none: "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0))",
  sealed: "linear-gradient(115deg, rgba(255,255,255,.26) 0 7%, transparent 7% 30%, rgba(255,255,255,.16) 30% 33%, transparent 33%), radial-gradient(circle at 86% 91%, #ffd44d 0 4.5%, #b98a12 4.5% 6%, transparent 6.2%), repeating-linear-gradient(0deg, rgba(255,255,255,.06) 0 1px, transparent 1px 5px)",
  light: `${SCUFF}, repeating-linear-gradient(62deg, rgba(0,0,0,.07) 0 1px, transparent 1px 27px)`,
  worn: "radial-gradient(circle at 0% 0%, rgba(255,255,255,.38), transparent 14%), radial-gradient(circle at 100% 0%, rgba(255,255,255,.30), transparent 12%), radial-gradient(circle at 100% 100%, rgba(255,255,255,.34), transparent 15%), radial-gradient(circle at 0% 100%, rgba(255,255,255,.30), transparent 12%), repeating-linear-gradient(118deg, rgba(255,255,255,.14) 0 1px, transparent 1px 13px), repeating-linear-gradient(72deg, rgba(0,0,0,.14) 0 1px, transparent 1px 17px), linear-gradient(90deg, rgba(0,0,0,.18), transparent 12%, transparent 88%, rgba(0,0,0,.18))",
  battered: "radial-gradient(circle at 0% 0%, rgba(255,255,255,.55), transparent 24%), radial-gradient(circle at 100% 0%, rgba(255,255,255,.5), transparent 22%), radial-gradient(circle at 100% 100%, rgba(255,255,255,.55), transparent 26%), radial-gradient(circle at 0% 100%, rgba(255,255,255,.5), transparent 22%), linear-gradient(100deg, transparent 49.6%, rgba(255,255,255,.4) 50%, transparent 50.5%), linear-gradient(0deg, rgba(70,45,20,.30), transparent 34%), repeating-linear-gradient(118deg, rgba(255,255,255,.2) 0 1px, transparent 1px 9px), repeating-linear-gradient(72deg, rgba(0,0,0,.2) 0 1px, transparent 1px 12px), repeating-linear-gradient(160deg, rgba(255,255,255,.12) 0 1px, transparent 1px 21px), linear-gradient(90deg, rgba(0,0,0,.34), transparent 18%, transparent 82%, rgba(0,0,0,.34))",
  faded: "linear-gradient(180deg, rgba(255,238,200,.34), rgba(255,238,200,.12) 70%, rgba(255,238,200,.05)), linear-gradient(rgba(190,170,120,.12), rgba(190,170,120,.12))",
  rental: `linear-gradient(90deg, #d33 0 12%, #f3f0e4 12% 100%) 7% 92% / 38% 5.5% no-repeat, ${SCUFF}`,
};

/** One of your own presets: a name, a color, and optionally a band color and a frame color of their own
 *  (no band color = the band matches the color; no frame color = the frame matches the band). */
export interface CustomColor { id: string; name: string; h: number; s: number; l: number; glass: boolean; shape: ShapeId | "auto"; band?: HslColor; frame?: HslColor; media?: HslColor /* color of its disc or cartridge */ }

export function customPalette(c: CustomColor): Pal {
  const f = (h: number, s: number, l: number) => (c.glass ? `hsla(${h},${s}%,${l}%,.6)` : `hsl(${h},${s}%,${l}%)`);
  const pal: Pal = {
    a: f(c.h, c.s, Math.min(92, c.l + 16)),
    b: f(c.h, c.s, Math.max(5, c.l - 26)),
    band: c.band ? `hsl(${c.band.h}, ${c.band.s}%, ${c.band.l}%)` : f(c.h, c.s, c.l),
    text: c.l > 62 ? "#111111" : "#ffffff",
    line: c.l > 62 ? "rgba(0,0,0,.2)" : "rgba(255,255,255,.28)",
  };
  if (c.frame) pal.frame = `hsl(${c.frame.h}, ${c.frame.s}%, ${c.frame.l}%)`;
  return pal;
}


// ---------- templates (frame pictures, e.g. the SteamGridDB console templates) ----------
// A template is a 2:3 picture of a case front (border, logo bar) with a dark, empty window. The game's cover art is shown
// inside the window and the frame is drawn over it. They come from a folder (see main.py) and are registered here.
export interface TemplateInfo { id: string; name: string; url: string; win: { l: number; t: number; r: number; b: number }; pal: Pal }
export interface TemplateIn { name: string; url: string; win?: number[] | null }
export const TEMPLATES: Record<string, TemplateInfo> = {};
export const TPL_PREFIX = "tpl:";
export const TPL_NAME_OK = /^[A-Za-z0-9][A-Za-z0-9._ ()+-]{0,79}$/;
export function tplId(file: string): string { return TPL_PREFIX + file; }
export function tplLabel(id: string): string {
  return id.slice(TPL_PREFIX.length).replace(/\.(png|webp|jpe?g)$/i, "").replace(/[_]+/g, " ").trim() || "Template";
}
export function templateIds(): StyleId[] { return Object.keys(TEMPLATES).sort(); }
const DEFAULT_WIN = { l: 0.03, t: 0.1, r: 0.03, b: 0.03 }; // fractions of the picture that are frame (left, top, right, bottom)

function median(a: number[]): number { const b = a.slice().sort((x, y) => x - y); return b.length ? b[Math.floor(b.length / 2)] : 0; }

/** Finds the empty window of a template and its main color by looking at the pixels (nothing is sent anywhere). */
export function analyzeTemplate(img: HTMLImageElement, win?: number[] | null): { win: TemplateInfo["win"]; pal: Pal } {
  const doc = img.ownerDocument;
  const W = 120, H = 180;
  let data: Uint8ClampedArray | null = null;
  try {
    const c = doc.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d");
    if (g) { g.drawImage(img, 0, 0, W, H); data = g.getImageData(0, 0, W, H).data; }
  } catch (e) { data = null; }
  const px = (x: number, y: number) => { const i = (Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))) * 4; return data ? [data[i], data[i + 1], data[i + 2], data[i + 3]] : [0, 0, 0, 255]; };
  const lum = (x: number, y: number) => { const p = px(x, y); return p[3] < 40 ? -100 : 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2]; };
  let w = { ...DEFAULT_WIN };
  if (win && win.length === 4 && win.every((v) => typeof v === "number" && isFinite(v) && v >= 0 && v < 0.6)) {
    w = { l: win[0], t: win[1], r: win[2], b: win[3] };
  } else if (data) {
    // walk outward from the middle of the picture until the brightness jumps: that is where the frame starts
    const cx = W >> 1, cy = (H * 0.55) | 0;
    const edge = (x0: number, y0: number, dx: number, dy: number, max: number): number => {
      let prev = lum(x0, y0);
      for (let i = 1; i < max; i++) {
        const x = x0 + dx * i, y = y0 + dy * i;
        const cur = lum(x, y);
        if (prev < -50 && cur < -50) continue;                     // see-through window: keep going until something solid
        if ((prev < -50) !== (cur < -50) || Math.abs(cur - prev) > 14) return i;
        prev = cur;
      }
      return max;
    };
    const xs = [0.2, 0.35, 0.65, 0.8].map((f) => (W * f) | 0);
    const ys = [0.4, 0.55, 0.7].map((f) => (H * f) | 0);
    const top = median(xs.map((x) => cy - edge(x, cy, 0, -1, cy)));
    const bottom = median(xs.map((x) => cy + edge(x, cy, 0, 1, H - cy)));
    const left = median(ys.map((y) => cx - edge(cx, y, -1, 0, cx)));
    const right = median(ys.map((y) => cx + edge(cx, y, 1, 0, W - cx)));
    const cand = { l: left / W, t: top / H, r: 1 - right / W, b: 1 - bottom / H };
    const area = (1 - cand.l - cand.r) * (1 - cand.t - cand.b);
    if (area > 0.4 && area < 0.97 && cand.l < 0.2 && cand.r < 0.2 && cand.t < 0.3 && cand.b < 0.2) {
      // a frame always has some border on every side; a value of about zero means no edge was found there
      w = { l: cand.l < 0.008 ? DEFAULT_WIN.l : cand.l, t: cand.t < 0.008 ? DEFAULT_WIN.t : cand.t, r: cand.r < 0.008 ? DEFAULT_WIN.r : cand.r, b: cand.b < 0.008 ? DEFAULT_WIN.b : cand.b };
    }
  }
  // color of the frame: the border strip beside the window
  let r = 0, gg = 0, b = 0, n = 0;
  if (data) for (let y = (H * 0.3) | 0; y < ((H * 0.8) | 0); y += 4) for (const x of [Math.max(0, ((w.l * W) | 0) - 2), Math.min(W - 1, W - ((w.r * W) | 0) + 1)]) { const p = px(x, y); if (p[3] > 100) { r += p[0]; gg += p[1]; b += p[2]; n++; } }
  const base = n ? [r / n, gg / n, b / n] : [60, 66, 78];
  const L = 0.299 * base[0] + 0.587 * base[1] + 0.114 * base[2];
  const mix = (k: number) => `rgb(${base.map((v) => Math.round(Math.max(0, Math.min(255, k >= 0 ? v + (255 - v) * k : v * (1 + k))))).join(",")})`;
  return { win: w, pal: { a: mix(0.18), b: mix(-0.55), band: "rgba(0,0,0,0)", text: L > 140 ? "#111111" : "#ffffff", line: L > 140 ? "rgba(0,0,0,.2)" : "rgba(255,255,255,.28)" } };
}

export function registerTemplates(list: { id: string; name: string; url: string; win: TemplateInfo["win"]; pal: Pal }[]): void {
  Object.keys(TEMPLATES).forEach((k) => delete TEMPLATES[k]);
  list.forEach((t) => { TEMPLATES[t.id] = t; });
}

/** Loads template pictures (data addresses) and works out their windows. */
export function loadTemplates(doc: Document, items: TemplateIn[]): Promise<TemplateInfo[]> {
  const view = doc.defaultView as any;
  const one = (it: TemplateIn) => new Promise<TemplateInfo | null>((resolve) => {
    if (!TPL_NAME_OK.test(it.name) || typeof it.url !== "string" || it.url.indexOf("data:image/") !== 0) { resolve(null); return; }
    const im: HTMLImageElement = new view.Image();
    im.onload = () => {
      try {
        if (im.naturalWidth < 60 || im.naturalHeight < 60) { resolve(null); return; }
        const a = analyzeTemplate(im, it.win);
        resolve({ id: tplId(it.name), name: it.name, url: it.url, win: a.win, pal: a.pal });
      } catch (e) { resolve(null); }
    };
    im.onerror = () => resolve(null);
    im.src = it.url;
  });
  return Promise.all(items.slice(0, 40).map(one)).then((r) => r.filter((x): x is TemplateInfo => !!x));
}

function tplCss(): string {
  const ids = Object.keys(TEMPLATES);
  if (!ids.length) return "";
  const pc = (v: number) => `${(v * 100).toFixed(2)}%`;
  const rules = ids.map((id) => {
    const t = TEMPLATES[id], w = t.win, q = JSON.stringify(id);
    // the hole in the frame is a hair smaller than the window and the art a hair bigger, so no seam shows between them
    const e = 0.004, ax = (v: number) => Math.max(0, v - 0.008);
    const hole = `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${pc(w.l + e)} ${pc(w.t + e)}, ${pc(w.l + e)} ${pc(1 - w.b - e)}, ${pc(1 - w.r - e)} ${pc(1 - w.b - e)}, ${pc(1 - w.r - e)} ${pc(w.t + e)}, ${pc(w.l + e)} ${pc(w.t + e)})`;
    return `[data-sanso-style=${q}] > [data-sanso-tpl] > [data-t="art"] { left: ${pc(ax(w.l))}; top: ${pc(ax(w.t))}; right: ${pc(ax(w.r))}; bottom: ${pc(ax(w.b))}; }
[data-sanso-style=${q}] > [data-sanso-tpl] > [data-t="frame"] { background-image: url(${JSON.stringify(t.url)}); -webkit-clip-path: ${hole}; clip-path: ${hole}; }`;
  }).join("\n");
  return `
/* template frames: the game's art in the window, the frame picture over it */
[data-sanso-tpl] { position: absolute; top: 0; right: 0; bottom: 0; left: 0; pointer-events: none; overflow: hidden; border-radius: var(--c3d-r, 2px); z-index: 1; transition: transform 0s linear .8s; }
[data-sanso-tpl] > div { position: absolute; top: 0; right: 0; bottom: 0; left: 0; background-repeat: no-repeat; background-position: center; }
[data-sanso-tpl] > [data-t="art"] { background-size: cover; background-color: #0b0c0f; }
[data-sanso-tpl] > [data-t="frame"] { background-size: 100% 100%; }
${rules}
`;
}

const hslCss = (c: HslColor) => `hsl(${c.h}, ${c.s}%, ${c.l}%)`;

/** What one collection or one game decides for itself (Looks, colors and presets). Whatever it leaves out follows the next
 *  level: a game follows its collections, a collection follows the global settings. Any of these can differ from the global
 *  setting of the same name, and then it wins over it (and over what the preset brings along). */
export interface ItemOv {
  preset?: StyleId;                  // the preset (a console, one of your own, or a frame picture)
  shape?: ShapeId;                   // the case and the disc or cartridge
  media?: HslColor;                  // color of the disc or cartridge
  off?: boolean;                     // true = no 3D case; false = 3D even if its collection has it off
  band?: boolean;                    // colored band on or off
  frame?: boolean;                   // colored frame on or off
  caseColor?: HslColor;              // color of the box (its sides, back and spine); the frame follows it unless it has a color of its own
  bandColor?: HslColor;
  frameColor?: HslColor;
  thickMode?: "thin" | "standard" | "thick" | "varied"; // a thickness of its own (thin like a jewel case or the Switch, standard like a DVD case, thick like the old cartridges), or the preset's own
  thick?: number;                    // thickness as a multiple of the normal one (1 = normal)
  wear?: WearId;
  art?: InsertArt;                   // what is printed on the disc or cartridge: logo, cover, whole cover or nothing
  logoPos?: LogoPos;                 // discs printed with the logo: which part of the disc the logo is on (top when not set)
  artY?: number;                     // Cover (Fill): the cover moved down (+) or up (-), -50 to 50 (0 = centered, as it started)
  window?: HslColor;                 // cartridges: color of the art window behind the logo (or whole cover, or nothing)
  windowMode?: "match";              // cartridges: the art window has the color of the cartridge (when no window color is set)
  slot?: "handheld" | "console";     // the slot of the insert animation: bottom or side
  when?: "before" | "after";         // the insert animation before or after Steam's game logo
  insert?: boolean;                  // insert animation on or off
  eject?: boolean;                   // eject animation on or off
}
export const OV_KEYS: (keyof ItemOv)[] = ["preset", "shape", "media", "off", "band", "frame", "caseColor", "bandColor", "frameColor", "thickMode", "thick", "wear", "art", "logoPos", "artY", "window", "windowMode", "slot", "when", "insert", "eject"];

export function paletteFor(s: Settings, id: string, ov?: ItemOv | null): Pal {
  const base = basePalette(s, id);
  if (!ov || (!ov.bandColor && !ov.frameColor && !ov.caseColor) || id.indexOf(TPL_PREFIX) === 0) return base;
  let p = base;
  if (ov.caseColor) {
    // a color of its own for the box: lighter at the front edge of the sides, darker at the back; the frame matches it unless it has its own
    const c = ov.caseColor, light = c.l > 62;
    p = {
      ...p, a: `hsl(${c.h}, ${c.s}%, ${Math.min(94, c.l + 9)}%)`, b: `hsl(${c.h}, ${c.s}%, ${Math.max(4, c.l - 17)}%)`,
      text: light ? "#10151c" : "#ffffff", line: light ? "rgba(0,0,0,.18)" : "rgba(255,255,255,.25)", frame: hslCss(c),
    };
  }
  const band = ov.bandColor ? hslCss(ov.bandColor) : p.band;
  return { ...p, band, frame: ov.frameColor ? hslCss(ov.frameColor) : (p.frame || band) };
}

/** The color of a look's box as drawn (the middle of its lighter and darker shade): where the color sliders start. */
export function caseColorOf(look: Look): HslColor {
  const a = cssToHsl(look.pal.a), b = cssToHsl(look.pal.b);
  if (!a) return { h: 220, s: 10, l: 30 };
  return { h: a.h, s: a.s, l: b ? Math.round((a.l + b.l) / 2) : a.l };
}

function basePalette(s: Settings, id: string): Pal {
  if (id.indexOf(TPL_PREFIX) === 0) return TEMPLATES[id] ? TEMPLATES[id].pal : PALETTE[DEFAULT_PRESET];
  if (id.indexOf("custom:") === 0) {
    const c = s.customs.filter((x) => "custom:" + x.id === id)[0];
    return c ? customPalette(c) : PALETTE[DEFAULT_PRESET];
  }
  return PALETTE[id] || PALETTE[DEFAULT_PRESET];
}

export function styleLabel(s: Settings, id: string): string {
  if (id.indexOf(TPL_PREFIX) === 0) return tplLabel(id);
  if (id.indexOf("custom:") === 0) {
    const c = s.customs.filter((x) => "custom:" + x.id === id)[0];
    return c ? c.name : STYLE_LABELS[DEFAULT_PRESET];
  }
  return STYLE_LABELS[id] || id;
}

export interface Settings {
  schema: number;      // version of the saved settings layout (see sanitize)
  enabled: boolean;
  angle: number;       // degrees, 0..40
  depth: number;       // thickness of a standard DVD case in px (fixed at 18; the other cases are a multiple of it)
  thickness: "thin" | "standard" | "thick"; // the default box thickness, for every case (or, with Case Thickness Variation, for the cases whose preset has no thickness of its own)
  color: StyleId;      // default preset: the look of everything that has no preset of its own
  gloss: boolean;
  shadow: boolean;
  band: boolean;       // colored band along the top of the cover
  bandFrame: boolean;  // colored frames: the art is shrunk a little and framed in the preset's frame color instead of being covered at the top
  varyThickness: boolean; // true: each preset has its own box thickness; false: every case is as thick as a DVD case
  spineTitle: boolean; // game name on the spine
  float: boolean;      // slow, tiny drifting motion on the game you are on
  idleTilt: number;    // tilt of covers you are not on, 0..20 (0 = flat, cheapest)
  shape: ShapeId | "auto";               // case and disc or cartridge for all games (auto = what the preset brings); per-collection and per-game ones win over it
  neighborLean: number;                  // how far the games beside the one you are on lean away, degrees 1..30
  nbPause: boolean;                      // a game you just left settles flat first and then leans (false: it goes straight into its lean, its box hidden at once)
  wear: WearId;                          // default wear
  playWear: boolean;                     // wear is on: cases wear as you play (at wearSpeed), or all get the same wear (wearOverride)
  wearOverride: boolean;                 // every case gets the wear chosen in `wear`, whatever the playtime
  wearSpeed: "slow" | "normal" | "fast"; // how quickly playtime wears a case
  insertAnim: boolean;                   // disc / card flies into the slot when a game launches
  insertTarget: "handheld" | "console";   // the slot the disc or cartridge goes into: at the bottom, or at the side
  fallback: "auto" | "off" | "always";   // inject through Steam's debug port when the library window can't be reached
  safeMode: boolean;                     // everything off
  checkedOnce: boolean;                  // the first-run self-check has been run
  shine: boolean;                        // light sweep when a game pops out
  sleeve: boolean;                       // rounded case with a clear plastic sleeve edge
  pickup: boolean;                       // quick lift when you open a game
  neighbors: boolean;                    // the games next to the one you are on lean away
  speed: "calm" | "normal" | "snappy";   // how fast the case turns in and out
  insertSound: boolean;                  // sounds for the insert animation
  insertWhen: "before" | "after";        // play before Steam's game-logo launch screen, or after it
  ejectAnim: boolean;                    // the disc comes back out and the case closes when you quit a game
  insertSpeed: number;                   // speed of the insert animation (1 = as designed, 2 = twice as fast)
  ejectSpeed: number;                    // speed of the eject animation
  insertArt: InsertArt;                  // what is printed on the disc / cartridge in the animation
  windowMode: "black" | "white" | "match"; // a cartridge's art window: black, white, or the color of the cartridge (a color set for a game or collection wins)
  lessMotion: "off" | "battery" | "always"; // no drifting, shine or leaning neighbours (always, or only on battery)
  customs: CustomColor[];                // your own presets
  gameOv: Record<string, ItemOv>;        // per-game overrides (win over everything), key = app id
  collOv: Record<string, ItemOv>;        // per-collection overrides, key = collection id
}

/** The settings the cases are drawn with: "less motion" switches off drifting, shine and leaning neighbours. */
export function withLessMotion(s: Settings, onBattery: boolean): Settings {
  const on = s.lessMotion === "always" || (s.lessMotion === "battery" && onBattery);
  return on ? { ...s, float: false, shine: false, neighbors: false } : s;
}

export const SCHEMA = 5;
export const DEFAULTS: Settings = {
  schema: SCHEMA, enabled: true, angle: 32, depth: 18, thickness: "standard", color: DEFAULT_PRESET, gloss: true, shadow: true, band: true, bandFrame: true, varyThickness: true,
  spineTitle: false, float: true, idleTilt: 0, shape: "auto", neighborLean: 9, nbPause: false, insertSpeed: 1, ejectSpeed: 1, insertArt: "logo",
  wear: "none", playWear: false, wearOverride: false, wearSpeed: "normal", insertAnim: false, insertTarget: "handheld", windowMode: "black", fallback: "auto", safeMode: false, checkedOnce: false,
  shine: true, sleeve: true, pickup: true, neighbors: true, speed: "normal", insertSound: true, insertWhen: "before",
  ejectAnim: false, lessMotion: "off", customs: [], gameOv: {}, collOv: {},
};

const STORE_KEY = "sanso-3d-game-cases";
const STYLE_ID = "sanso-3d-cases-style";

export function loadSettings(): Settings {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) return sanitize(JSON.parse(raw));
  } catch (e) { /* storage may be unavailable */ }
  return sanitize({});
}

export function saveSettings(s: Settings): void {
  try { window.localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) { /* ignore */ }
}

// Saved looks of earlier versions: the ones that are a listed console now carry over to it (the old Black is PS2). Looks that are gone (Gold, Red, Blue, Gray,
// Black frame/white band, PSP, Dreamcast, Sega, PC big box) are dropped: whatever used one goes back to Automatic.
// (To keep an old look, make it a preset of your own under Presets, My presets.)
const ID_ALIAS: Record<string, string> = {
  black: "ps2", ps2: "ps2", white: "wii", wii: "wii", wee: "wii", wee2: "wiiu", wiiu: "wiiu", wiiuwhite: "wiiu",
  ps1: "ps3", ps3: "ps3", ps4: "ps5", ps5: "ps5", xbox: "xbox", xboxblack: "xbox", x360: "x360", x360white: "x360",
  green: "xboxone", xboxone: "xboxone", steam: "steam",
};
function fixId(id: any): any { return typeof id === "string" && Object.prototype.hasOwnProperty.call(ID_ALIAS, id) ? ID_ALIAS[id] : id; }

function validId(id: any, customs: CustomColor[]): boolean {
  if (typeof id !== "string") return false;
  if (STYLE_IDS.indexOf(id) >= 0) return true;
  if (id.indexOf(TPL_PREFIX) === 0) return TPL_NAME_OK.test(id.slice(TPL_PREFIX.length)); // the picture may load later
  return id.indexOf("custom:") === 0 && customs.some((c) => "custom:" + c.id === id);
}

function cleanHsl(c: any): HslColor | null {
  if (!c || typeof c !== "object") return null;
  const n = (v: any, lo: number, hi: number) => (typeof v === "number" && isFinite(v) ? Math.round(Math.min(hi, Math.max(lo, v))) : null);
  const h = n(c.h, 0, 360), sa = n(c.s, 0, 100), l = n(c.l, 4, 94);
  return h !== null && sa !== null && l !== null ? { h, s: sa, l } : null;
}

export const THICK_MIN = 0.25, THICK_MAX = 3;
function cleanThickNum(v: any): number | null {
  return typeof v === "number" && isFinite(v) ? Math.round(Math.min(THICK_MAX, Math.max(THICK_MIN, v)) * 100) / 100 : null;
}

function cleanOv(m: any, customs: CustomColor[]): ItemOv {
  const o: ItemOv = {};
  if (!m || typeof m !== "object") return o;
  const preset = fixId(m.preset);
  if (validId(preset, customs)) o.preset = preset;
  if (SHAPE_IDS.indexOf(m.shape) >= 0) o.shape = m.shape;
  (["off", "band", "frame", "insert", "eject"] as const).forEach((k) => { if (typeof m[k] === "boolean") o[k] = m[k]; });
  (["media", "caseColor", "bandColor", "frameColor", "window"] as const).forEach((k) => { const c = cleanHsl(m[k]); if (c) o[k] = c; });
  if (m.thickMode === "thin" || m.thickMode === "standard" || m.thickMode === "thick" || m.thickMode === "varied") o.thickMode = m.thickMode;
  const th = cleanThickNum(m.thick); if (th !== null) o.thick = th;
  if (WEAR_IDS.indexOf(m.wear) >= 0) o.wear = m.wear;
  if (INSERT_ART_IDS.indexOf(m.art) >= 0) o.art = m.art;
  if (LOGO_POS_IDS.indexOf(m.logoPos) >= 0) o.logoPos = m.logoPos;
  if (typeof m.artY === "number" && isFinite(m.artY)) o.artY = Math.round(Math.min(ART_Y_MAX, Math.max(ART_Y_MIN, m.artY)));
  if (m.windowMode === "match") o.windowMode = "match";
  if (m.slot === "handheld" || m.slot === "console") o.slot = m.slot;
  if (m.when === "before" || m.when === "after") o.when = m.when;
  return o;
}

function cleanOvMap(m: any, customs: CustomColor[]): Record<string, ItemOv> {
  const out: Record<string, ItemOv> = {};
  if (m && typeof m === "object") for (const k of Object.keys(m)) {
    if (k.length > 64) continue;
    const o = cleanOv(m[k], customs);
    if (Object.keys(o).length) out[k] = o;
  }
  return out;
}

// Versions before 1.12 kept every per-game and per-collection setting in a map of its own (games, collections, shapes,
// gameShapes, cartColors, bands, ...). They are read once, into the overrides above; the saved settings no longer have them.
function legacyOv(x: any, customs: CustomColor[]): { game: Record<string, ItemOv>; coll: Record<string, ItemOv> } {
  const game: Record<string, ItemOv> = {}, coll: Record<string, ItemOv> = {};
  const put = (src: any, dst: Record<string, ItemOv>, key: keyof ItemOv, pick: (v: any) => any) => {
    if (!src || typeof src !== "object") return;
    for (const id of Object.keys(src)) {
      const v = pick(src[id]);
      if (v === undefined || v === null) continue;
      const o: any = dst[id] || (dst[id] = {});
      o[key] = v;
    }
  };
  const preset = (v: any) => { const f = fixId(v); return validId(f, customs) ? f : undefined; };
  const shape = (v: any) => (SHAPE_IDS.indexOf(v) >= 0 ? v : undefined);
  const hsl = (v: any) => cleanHsl(v);
  const bool = (v: any) => (typeof v === "boolean" ? v : undefined);
  const wear = (v: any) => (WEAR_IDS.indexOf(v) >= 0 ? v : undefined);
  put(x.games, game, "preset", preset); put(x.collections, coll, "preset", preset);
  put(x.gameShapes, game, "shape", shape); put(x.shapes, coll, "shape", shape);
  put(x.gameCartColors, game, "media", hsl); put(x.cartColors, coll, "media", hsl);
  put(x.gameOffs, game, "off", bool); put(x.offs, coll, "off", (v) => (v === true ? true : undefined));
  put(x.gameBands, game, "band", bool); put(x.bands, coll, "band", bool);
  put(x.gameThick, game, "thick", cleanThickNum); put(x.thick, coll, "thick", cleanThickNum);
  put(x.gameWears, game, "wear", wear); put(x.wears, coll, "wear", wear);
  return { game, coll };
}

export function sanitize(x: any): Settings {
  const n = (v: any, lo: number, hi: number, d: number) =>
    typeof v === "number" && isFinite(v) ? Math.min(hi, Math.max(lo, v)) : d;
  const b = (v: any, d: boolean) => (typeof v === "boolean" ? v : d);
  x = x && typeof x === "object" ? x : {};
  const customs: CustomColor[] = [];
  if (Array.isArray(x.customs)) {
    for (const c of x.customs.slice(0, 12)) {
      if (!c || typeof c.id !== "string" || !/^[a-z0-9]{1,12}$/.test(c.id)) continue;
      const preset: CustomColor = {
        id: c.id, name: typeof c.name === "string" ? c.name.slice(0, 24) : "Custom",
        h: Math.round(n(c.h, 0, 360, 210)), s: Math.round(n(c.s, 0, 100, 70)), l: Math.round(n(c.l, 5, 90, 45)), glass: b(c.glass, false),
        shape: SHAPE_IDS.indexOf(c.shape) >= 0 ? c.shape : "auto",
      };
      const band = cleanHsl(c.band), frame = cleanHsl(c.frame), media = cleanHsl(c.media);
      if (band) preset.band = band;
      if (frame) preset.frame = frame;
      if (media) preset.media = media;
      customs.push(preset);
    }
  }
  // per-game and per-collection overrides: the ones saved by an earlier version first, then the current ones over them
  const old = legacyOv(x, customs);
  const sv = typeof x.schema === "number" ? x.schema : 1; // version of the saved settings
  const merge = (a: Record<string, ItemOv>, bb: Record<string, ItemOv>) => {
    const out: Record<string, ItemOv> = {};
    for (const k of Object.keys(a)) out[k] = { ...cleanOv(a[k], customs) };
    for (const k of Object.keys(bb)) out[k] = { ...(out[k] || {}), ...bb[k] };
    return out;
  };
  const gameOv = merge(old.game, cleanOvMap(x.gameOv, customs));
  const collOv = merge(old.coll, cleanOvMap(x.collOv, customs));
  // the default preset is Steam now; the old default look (Black) is replaced once
  let color = fixId(x.color);
  if (!validId(color, customs)) color = DEFAULTS.color;
  else if (sv < 2 && x.color === "black") color = DEFAULTS.color;
  const step = (v: number) => Math.min(3, Math.max(0.5, Math.round(v * 2) / 2)); // 50%, 100%, 150% ... 300%
  // the logo is the default print now; the old default (Cover) is replaced once
  let art: InsertArt = INSERT_ART_IDS.indexOf(x.insertArt) >= 0 ? x.insertArt : DEFAULTS.insertArt;
  if (sv < 3 && x.insertArt === "cover") art = "logo";
  const oldWear = sv < 5 && x.playWear !== true && WEAR_IDS.indexOf(x.wear) >= 0 && x.wear !== "none";
  const ins = step(n(x.insertSpeed, 0.5, 3, DEFAULTS.insertSpeed));
  return {
    schema: SCHEMA,
    enabled: b(x.enabled, DEFAULTS.enabled),
    angle: n(x.angle, 0, 40, DEFAULTS.angle),
    depth: DEFAULTS.depth, // (there is no slider for it any more: the thickness is Thin, Standard or Thick)
    thickness: x.thickness === "thin" || x.thickness === "thick" ? x.thickness : "standard",
    color,
    gloss: b(x.gloss, DEFAULTS.gloss),
    shadow: b(x.shadow, DEFAULTS.shadow),
    band: b(x.band, DEFAULTS.band),
    bandFrame: b(x.bandFrame, DEFAULTS.bandFrame),
    varyThickness: b(x.varyThickness, DEFAULTS.varyThickness),
    spineTitle: false, // the name on the spine was removed
    float: b(x.float, DEFAULTS.float),
    idleTilt: 0, // covers you are not on stay flat
    shape: SHAPE_IDS.indexOf(x.shape) >= 0 ? x.shape : "auto",
    neighborLean: Math.round(n(x.neighborLean, 1, 30, DEFAULTS.neighborLean)),
    nbPause: b(x.nbPause, DEFAULTS.nbPause),
    insertSpeed: ins,
    ejectSpeed: step(n(x.ejectSpeed, 0.5, 3, ins)), // earlier versions had one speed for both
    insertArt: art,
    wear: WEAR_IDS.indexOf(x.wear) >= 0 ? x.wear : DEFAULTS.wear,
    // earlier versions: a default wear with Wear off meant "every case has this wear"; that is Wear on with Override now
    playWear: oldWear ? true : b(x.playWear, DEFAULTS.playWear),
    wearOverride: oldWear ? true : b(x.wearOverride, DEFAULTS.wearOverride),
    wearSpeed: x.wearSpeed === "slow" || x.wearSpeed === "fast" ? x.wearSpeed : "normal",
    insertAnim: b(x.insertAnim, DEFAULTS.insertAnim),
    insertTarget: x.insertTarget === "console" ? "console" : "handheld", // (earlier versions also had "auto")
    windowMode: x.windowMode === "match" ? "match" : x.windowMode === "white" ? "white" : "black", // (earlier versions called black "dark")
    fallback: x.fallback === "off" || x.fallback === "always" ? x.fallback : "auto",
    safeMode: b(x.safeMode, false),
    checkedOnce: b(x.checkedOnce, false),
    shine: b(x.shine, DEFAULTS.shine),
    sleeve: b(x.sleeve, DEFAULTS.sleeve),
    pickup: b(x.pickup, DEFAULTS.pickup),
    neighbors: b(x.neighbors, DEFAULTS.neighbors),
    speed: x.speed === "calm" || x.speed === "snappy" ? x.speed : "normal",
    insertSound: b(x.insertSound, DEFAULTS.insertSound),
    insertWhen: x.insertWhen === "after" ? "after" : "before",
    ejectAnim: b(x.ejectAnim, DEFAULTS.ejectAnim),
    lessMotion: x.lessMotion === "battery" || x.lessMotion === "always" ? x.lessMotion : "off",
    customs,
    gameOv,
    collOv,
  };
}

// ---------- which look does a game get? ----------

/** What a game's own overrides and its collections' overrides add up to: for every setting, the game's own value if it has
 *  one, else the first of its collections that has one. What is left out follows the global setting (and the preset). */
export function ovFor(s: Settings, appid: string | null, collections: string[] = []): ItemOv {
  const out: any = {};
  const layers: (ItemOv | undefined)[] = [appid ? s.gameOv[appid] : undefined];
  for (const c of collections) layers.push(s.collOv[c]);
  for (const o of layers) {
    if (!o) continue;
    for (const k of OV_KEYS) if (out[k] === undefined && (o as any)[k] !== undefined) out[k] = (o as any)[k];
  }
  return out as ItemOv;
}

/** The case and the disc or cartridge a preset brings along. */
export function presetShape(s: Settings, styleId: string): ShapeId {
  if (styleId.indexOf("custom:") === 0) {
    const c = s.customs.filter((x) => "custom:" + x.id === styleId)[0];
    return c && c.shape !== "auto" ? c.shape : "keepcase";
  }
  const d = presetDef(styleId);
  return d ? d.shape : "keepcase";
}

/** What a preset prints on its disc or cartridge unless a game or collection says otherwise (null = the global setting). */
export function presetArt(styleId: string): InsertArt | null {
  const d = presetDef(styleId);
  return d && d.art ? d.art : null;
}

/** Presets that come without a frame (the old cartridges): with Frame on Automatic they have none. */
export function presetNoFrame(styleId: string): boolean {
  const d = presetDef(styleId);
  return !!(d && d.noFrame);
}

/** The disc or cartridge color a preset brings along (none = the console's own plastic). */
export function presetMedia(s: Settings, styleId: string): HslColor | null {
  if (styleId.indexOf("custom:") === 0) {
    const c = s.customs.filter((x) => "custom:" + x.id === styleId)[0];
    return c && c.media ? c.media : null;
  }
  const d = presetDef(styleId);
  return d && d.media ? d.media : null;
}

// Order: the game's own shape, then its collection's shape, then the shape for all games, then the preset's own.
export function shapeFor(s: Settings, styleId: string, ov: ItemOv): ShapeId {
  if (ov.shape) return ov.shape;
  if (s.shape !== "auto") return s.shape;
  return presetShape(s, styleId);
}

export interface PlayInfo { minutes: number; last: number } // minutes played in total, last played (unix seconds, 0 = never)

// never opened -> sealed; barely played -> mint; then light scuffs, worn, battered; long untouched -> sun-faded
export function playtimeWear(s: Settings, info: PlayInfo | null, nowSec?: number): WearId | null {
  if (!info) return null;
  const k = s.wearSpeed === "slow" ? 2 : s.wearSpeed === "fast" ? 0.5 : 1;
  if (info.minutes <= 0 && !info.last) return "sealed";
  const now = nowSec !== undefined ? nowSec : Date.now() / 1000;
  if (info.last && info.minutes >= 60 && now - info.last > 365 * 86400) return "faded";
  const h = info.minutes / 60;
  if (h < 1 * k) return "none";
  if (h < 10 * k) return "light";
  if (h < 50 * k) return "worn";
  return "battered";
}

export function resolveWear(s: Settings, ov: ItemOv, info?: PlayInfo | null): WearId {
  if (ov.wear) return ov.wear;                                        // a game's or a collection's own wear wins over everything
  if (!s.playWear) return "none";            // Wear is off
  if (s.wearOverride) return s.wear;         // everything has the wear chosen for it
  return playtimeWear(s, info || null) || "none";
}

// Steam ids come in several shapes: small positive numbers, negative 32-bit numbers (non-Steam shortcuts) and
// 64-bit game ids. Everything is turned into one key: the unsigned 32-bit app id as a string.
export function normId(raw: string | number): string {
  try {
    const t = String(raw).trim();
    if (!/^-?\d+$/.test(t)) return "";
    if (t.replace("-", "").length > 10) return String(Number(BigInt(t) >> BigInt(32)) >>> 0);
    return String(Number(t) >>> 0);
  } catch (e) { return ""; }
}

// Every number in a picture address that could be a game id (path segments and file names like 123456789p.png).
export function srcCandidates(src: string): string[] {
  const out: string[] = [];
  if (!src) return out;
  const path = src.split(/[?#]/)[0];
  const re = /\/(-?\d{3,20})(?=[\/]|p?[._]|p?$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(path))) if (out.indexOf(m[1]) < 0) out.push(m[1]);
  return out;
}

// React props of the cover's ancestors often hold the game's overview object.
export function fiberCandidates(el: HTMLElement | null): string[] {
  const out: string[] = [];
  if (!el) return out;
  try {
    const key = Object.keys(el).filter((k) => k.indexOf("__reactFiber$") === 0)[0];
    let f: any = key ? (el as any)[key] : null;
    const add = (v: any) => { if ((typeof v === "number" && isFinite(v) && v !== 0) || (typeof v === "string" && /^-?\d{3,20}$/.test(v))) { const t = String(v); if (out.indexOf(t) < 0) out.push(t); } };
    for (let i = 0; f && i < 16; i++, f = f.return) {
      const p = f.memoizedProps;
      if (!p || typeof p !== "object") continue;
      add(p.appid); add(p.nAppID); add(p.unAppID); add(p.gameid);
      for (const k of Object.keys(p)) {
        const v = p[k];
        if (v && typeof v === "object" && !Array.isArray(v) && (typeof v.appid === "number" || typeof v.appid === "string")) add(v.appid);
      }
    }
  } catch (e) { /* ignore */ }
  return out;
}

// ---------- CSS ----------

export function buildCss(s: Settings): string {
  const d = Math.round(s.depth);
  const T = s.speed === "calm" ? 0.8 : s.speed === "snappy" ? 0.28 : 0.5; // turn in / out time
  const EASE = "cubic-bezier(.22,.8,.26,1)";
  const A = s.angle;
  // the "pop" element is the cover's outer wrapper (Steam's focusable item) so Steam's own outline tilts together with the case
  const STATE = ":is(:hover, .gpfocus, .gpfocuswithin, :focus-within)";
  const HAS = ":has(.gpfocus)";
  // Steam's focusable item (marked data-sanso-focus) can sit above the pop element, e.g. when it also holds a reflection
  const FST = ":is(:hover, :focus, :focus-within, .gpfocus, .gpfocuswithin)";
  const P = "[data-sanso-pop][data-sanso-pop][data-sanso-pop][data-sanso-pop][data-sanso-pop]";
  const ACT = (inner: string, extra: string, st: string, desc: boolean) => `${P}${extra}${st}${inner}` + (desc ? `, .gpfocus ${P}${extra}${inner}, [data-sanso-focus]${FST} ${P}${extra}${inner}` : "");
  const ACTC = (inner: string, st: string, desc: boolean) => `[data-sanso-pop]${st} [data-sanso-case]${inner}, [data-sanso-case][data-sanso-pop]${st}${inner}` + (desc ? `, .gpfocus [data-sanso-case]${inner}, [data-sanso-focus]${FST} [data-sanso-case]${inner}` : "");
  const ANG = `var(--c3d-ang, ${A}deg)`; // per-cover tilt (wide items get less, see paint)
  // the move itself; "transform-style" and the small depth offsets switch back to flat only after the case has turned back
  const TR = `transform ${T}s ${EASE}, rotate ${T}s ${EASE}, translate ${T}s ${EASE}, scale ${T}s ${EASE}, box-shadow ${T}s ${EASE}, transform-origin ${T}s ${EASE}`;
  const XF = (dx: string, dy: string, ang: string) => `perspective(1600px) translate3d(${dx}, ${dy}, 16px) rotateY(${ang})`;
  const gloss = s.gloss
    ? `linear-gradient(112deg, rgba(255,255,255,.36) 0%, rgba(255,255,255,.10) 15%, rgba(255,255,255,0) 32%, rgba(255,255,255,0) 60%, rgba(255,255,255,.12) 72%, rgba(255,255,255,0) 73.5%),
       linear-gradient(180deg, rgba(255,255,255,.14) 0%, rgba(255,255,255,0) 22%),`
    : "";
  // The band is a gradient layer held in --c3d-bandimg, set on each case (see setVars) so a game or a collection can have
  // a band, or none, whatever the global "Color band on top" says; the global setting is the fallback.
  const BAND_ON = `linear-gradient(180deg, var(--c3d-band) 0, var(--c3d-band) 5.2%, rgba(0,0,0,.35) 5.2%, rgba(0,0,0,.35) calc(5.2% + 1px), transparent calc(5.2% + 1px))`;
  const BAND_OFF = `linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0))`;
  const BAND_FILL = `linear-gradient(var(--c3d-band), var(--c3d-band))`; // the band's color, flat (round the top corners)
  const bandLayer = `var(--c3d-bandimg, ${s.band ? BAND_ON : BAND_OFF})`;
  const band = `${bandLayer},`;
  // Colored frame: instead of painting over the top of the picture, the picture is shrunk a little (kept at the bottom)
  // and the frame color shows around it. It is switched on or off for each case (data-sanso-frame), so a collection or a game can differ from the global setting. object-view-box makes the picture's view bigger than the picture itself; the
  // element's background shows in the extra space. 5.485% of the view above the picture = the band's 5.2% of the cover.
  // Template frames keep their own window and are left alone.
  const frame = `
[data-sanso-case="box"][data-sanso-frame]:not([data-sanso-style^="tpl:"]) > img, img[data-sanso-case="img"][data-sanso-frame]:not([data-sanso-style^="tpl:"]) {
  object-view-box: inset(-5.485% -2.743% 0 -2.743%); background-color: var(--c3d-frame, var(--c3d-band)) !important;
}
/* no band: the extra room at the top was only there for the band, so the frame becomes an even border all round and the art grows to fill it */
[data-sanso-case="box"][data-sanso-frame][data-sanso-noband]:not([data-sanso-style^="tpl:"]) > img, img[data-sanso-case="img"][data-sanso-frame][data-sanso-noband]:not([data-sanso-style^="tpl:"]) {
  object-view-box: inset(-2.743% -2.743% -2.743% -2.743%);
}`;
  const idleShadow = s.shadow ? `box-shadow: 4px 6px 9px rgba(0,0,0,.45) !important;` : "";
  const popShadow = s.shadow
    ? `box-shadow: ${Math.round(d * 1.1)}px ${Math.round(d * 1.5)}px 28px rgba(0,0,0,.65), ${Math.round(d * 0.3)}px ${Math.round(d * 0.4)}px 8px rgba(0,0,0,.4) !important;`
    : "";
  const FSH = "inset 0 0 0 1000px var(--c3d-fsh, rgba(0,0,0,0))";
  const imgIdle = s.shadow ? `box-shadow: calc(var(--c3d-d, ${d}px) * -.3) 0 0 0 var(--c3d-b), 4px 6px 9px rgba(0,0,0,.45), ${FSH} !important;` : `box-shadow: calc(var(--c3d-d, ${d}px) * -.3) 0 0 0 var(--c3d-b), ${FSH} !important;`;
  const imgPop = s.shadow
    ? `box-shadow: calc(var(--c3d-d, ${d}px) * -1) 0 0 0 var(--c3d-b), ${Math.round(d * 1.1)}px ${Math.round(d * 1.5)}px 28px rgba(0,0,0,.65), ${FSH} !important;`
    : `box-shadow: calc(var(--c3d-d, ${d}px) * -1) 0 0 0 var(--c3d-b), ${FSH} !important;`;
  const f = Math.min(1, Math.max(0.3, A / 32)); // keep the drift tiny and proportional
  const x = (v: number) => `${(v * f).toFixed(1)}px`;
  const floatKf = s.float
    ? `@keyframes sanso-drift {
  0%, 100% { translate: 0 0 -.4px; rotate: 0 1 0 0deg; }
  25% { translate: ${x(-1.5)} -1.5px -.4px; rotate: 0 1 0 ${(1.5 * f).toFixed(2)}deg; }
  50% { translate: 0 .5px -.4px; rotate: 0 1 0 0deg; }
  75% { translate: ${x(-1)} 1.5px -.4px; rotate: 0 1 0 ${(-1.2 * f).toFixed(2)}deg; }
}`
    : "";
  const shine = s.shine
    ? `
[data-sanso-faces] > [data-f="shine"] {
  top: 0; right: 0; bottom: 0; left: 0; transform: translateZ(2px); border-radius: var(--c3d-r, 2px);
  background: linear-gradient(105deg, transparent 38%, rgba(255,255,255,.6) 50%, transparent 62%) 160% 0 / 260% 100% no-repeat;
}
@keyframes sanso-shine { from { background-position: 160% 0; } to { background-position: -60% 0; } }`
    : `[data-sanso-faces] > [data-f="shine"] { display: none; }`;
  const active = (st: string, desc: boolean) => `
/* 3D only here: the game you are on gets the 3D setup at once; it keeps it until it has turned back (see the delays below) */
${ACT("", ":not(img)", st, desc)}, ${ACT(" [data-sanso-link]", "", st, desc)}, ${ACTC('[data-sanso-case="box"]', st, desc)} { transform-style: preserve-3d !important; }
${ACT("", "", st, desc)} { transition: ${TR}, transform-style 0s linear 0s !important; }
${ACT(" [data-sanso-link]", "", st, desc)}, ${ACTC('[data-sanso-case="box"]:not([data-sanso-pop])', st, desc)} { transition: box-shadow ${T}s ${EASE}, transform-style 0s linear 0s, translate 0s linear 0s !important; }
${ACT(" *", "", st, desc)} { mix-blend-mode: normal !important; }
${ACTC('[data-sanso-case="box"] > img', st, desc)} { translate: 0 0 .6px; transition: filter ${T}s ${EASE}, translate 0s linear 0s; }
${ACTC('[data-sanso-case="box"]:not([data-sanso-pop])', st, desc)} { translate: 0 0 -.4px; }
${ACT(' > :not([data-sanso-case]):not([data-sanso-link]):not([data-sanso-faces]):not([data-sanso-tpl]):not(img)', "", st, desc)} { translate: 0 0 1.4px; transition: translate 0s linear 0s; }
${ACTC('[data-sanso-case="box"]::after', st, desc)} { transform: translateZ(1px); transition: transform 0s linear 0s; }
${ACTC('[data-sanso-case="box"] > [data-sanso-tpl]', st, desc)} { transform: translateZ(.8px); transition: transform 0s linear 0s; }
${ACT("", ":not([data-sanso-own])", st, desc)} { rotate: 0 1 0 ${ANG}; translate: 0 8px 16px; transform-origin: 100% 50% !important; z-index: 12; opacity: 1 !important; }
${ACT("", "[data-sanso-own]", st, desc)} { transform: ${XF("0px", "8px", ANG)}; transform-origin: 100% 50% !important; z-index: 12; opacity: 1 !important; }
${ACT("", "", st, desc)}, ${ACT(" *", "", st, desc)}${desc ? `, [data-sanso-focus]${FST}, [data-sanso-focus]${FST} *` : ""} { -webkit-box-reflect: initial !important; }
${ACTC('[data-sanso-case="box"]:not([data-sanso-pop])', st, desc)} { box-shadow: none !important; }
${ACT("", ":not(img)", st, desc)} { ${popShadow} }
${s.float ? `${ACTC(":not([data-sanso-pop])", st, desc)} { animation: sanso-drift 6s ease-in-out ${(T + 0.05).toFixed(2)}s 2; }` : ""}
${ACTC('[data-sanso-case="box"] > img', st, desc)} { filter: brightness(1); }
${ACTC('[data-sanso-case="box"]', st, desc)}, ${ACT(" [data-sanso-link]", "", st, desc)} { opacity: 1 !important; }
${ACTC('[data-sanso-case="img"]', st, desc)} { ${imgPop} }
${ACTC(" > [data-sanso-faces]", st, desc)} { display: block; transition-delay: 0s; }
${desc ? `/* Steam's outline sits on a bigger item that does not tilt (Home): hide it and draw one on the case instead */
[data-sanso-focus]${FST} { outline-color: transparent !important; }
[data-sanso-focus]${FST} [class*="FocusRing"] { opacity: 0 !important; }
[data-sanso-focus]:is(:focus, :focus-within, .gpfocus, .gpfocuswithin) [data-sanso-case] > [data-sanso-faces] > [data-f="front"] { outline: 3px solid rgba(255,255,255,.9); outline-offset: 3px; border-radius: calc(var(--c3d-r, 2px) + 2px); }` : ""}
${s.shine ? `${ACTC(' > [data-sanso-faces] > [data-f="shine"]', st, desc)} { animation: sanso-shine 1.1s ease-out .15s 1 both; }` : ""}`;
  const PICK = (ang: number, z: number, dy: number) => `perspective(1600px) translate3d(0, ${dy}px, ${z}px) rotateY(${ang === A ? ANG : ang + "deg"})`;
  const pick = s.pickup ? `
@keyframes sanso-pick { 0% { transform: ${PICK(A, 16, 8)}; } 45% { transform: ${PICK(Math.round(A * 0.35), 70, -4)}; } 100% { transform: ${PICK(A, 16, 8)}; } }
@keyframes sanso-pick-i { 0% { rotate: 0 1 0 ${ANG}; translate: 0 8px 16px; } 45% { rotate: 0 1 0 ${Math.round(A * 0.35)}deg; translate: 0 -4px 70px; } 100% { rotate: 0 1 0 ${ANG}; translate: 0 8px 16px; } }
${P}[data-sanso-pick][data-sanso-own] { animation: sanso-pick .42s cubic-bezier(.3,.7,.3,1) both; z-index: 20 !important; }
${P}[data-sanso-pick]:not([data-sanso-own]) { animation: sanso-pick-i .42s cubic-bezier(.3,.7,.3,1) both; z-index: 20 !important; }` : "";
  // Rounded corners all the way round. The front has a corner radius r; a real case's side does not stay straight up to the top
  // but bends along that same corner into the top (and the bottom). So the spine, the right side, the top and the bottom stop r
  // short of each corner, and a corner piece fills the gap: a quarter of a cylinder (axis from front to back), built from two flat
  // strips, each as deep as the case. Corner "t" = top, "b" = bottom, "l" = left (spine side), "r" = right; strip 0 sits next to the
  // side, strip 1 next to the top / bottom. Positions are fractions of r from the corner's arc, see the comments on `corner`.
  const R = "var(--c3d-r, 2px)";
  const KC = Math.cos(Math.PI / 8), CHORD = 2 * Math.sin(Math.PI / 8); // strip middle's distance from the arc's center, strip length (both x r)
  const corner = (name: string, top: boolean, left: boolean, k: 0 | 1) => {
    const th = (k === 0 ? 22.5 : 67.5) * Math.PI / 180;
    const mx = 1 - KC * Math.cos(th), my = 1 - KC * Math.sin(th); // the strip's middle, from the corner's own edges, x r
    const ang = (left === top ? 1 : -1) * (th * 180 / Math.PI);   // mirrored corners turn the other way
    const x = left ? `calc(${R} * ${mx.toFixed(4)})` : `calc(100% - ${R} * ${mx.toFixed(4)})`;
    const y = top ? `calc(${R} * ${(my - CHORD / 2).toFixed(4)})` : `calc(100% - ${R} * ${(my + CHORD / 2).toFixed(4)})`;
    const fill = top ? `var(--c3d-bandfill, ${s.band ? BAND_FILL : BAND_OFF}), ` : ""; // the band's color continues round the top corners
    return `[data-sanso-faces] > [data-f=\"${name}${k}\"] { left: ${x}; top: ${y}; width: var(--c3d-d, ${d}px); ${left ? "min-width: 12px; " : ""}height: calc(${R} * ${CHORD.toFixed(4)}); transform-origin: 0 50%; transform: rotateZ(${ang}deg) rotateY(90deg); background: ${fill}linear-gradient(90deg, var(--c3d-a), var(--c3d-b)); }`;
  };
  const corners = ["tl", "tr", "bl", "br"].map((n) => [corner(n, n[0] === "t", n[1] === "l", 0), corner(n, n[0] === "t", n[1] === "l", 1)].join("\n")).join("\n");
  const LEAN = Math.round(Math.min(30, Math.max(1, s.neighborLean))); // degrees (Settings: "Lean of the neighbours")
  // Same lean, keyed on data-sanso-nb ("l" = the game left of the one you are on, "r" = right of it). The engine sets it by
  // position (see DocWatch.updateNeighbours), so it works however Steam nests the tiles and needs no :has().
  // A game that has just lost focus goes straight from its turned-out pose into its lean: one move, no stop in between.
  // While it swings, its box is still drawn, and a game on the right swings through flat and would show the box's other side,
  // so its box is hidden at once (the cover alone does the turn). With "Settle flat first" (nbPause) it waits, flat, instead.
  const NBA = (v: "l" | "r") => {
    const left = v === "l";
    return `${P}[data-sanso-nb="${v}"][data-sanso-own] { transform: perspective(1600px) translateZ(-6px) rotateY(${left ? LEAN : -LEAN}deg); transform-origin: ${left ? "0% 50%" : "100% 50%"} !important; }
${P}[data-sanso-nb="${v}"]:not([data-sanso-own]) { rotate: 0 1 0 ${left ? LEAN : -LEAN}deg; translate: 0 0 -6px; transform-origin: ${left ? "0% 50%" : "100% 50%"} !important; }`;
  };
  const neighborsByPosition = s.neighbors ? `
/* the games beside the one you are on lean away (marked by position) */
${NBA("l")}
${NBA("r")}${s.nbPause ? "" : `
[data-sanso-nb] [data-sanso-faces] { display: none !important; transition: none !important; }`}` : "";
  return `
${floatKf}
/* Steam's own perspective on a parent magnifies the tilted case (a strong one made it twice its size and blocky): use ours */
[data-sanso-stage="big"], [data-sanso-persp] { perspective: 1600px !important; perspective-origin: 50% 50% !important; }
[data-sanso-stage="small"] { perspective: 1100px !important; perspective-origin: 50% -30% !important; }
[data-sanso-stage="own"] { perspective: none !important; }
/* Resting covers are flat (no 3D, no extra GPU layers): the case look is plain 2D paint. Only the game you are on is
   3D, and it stays 3D until it has turned back (the transform-style and depth offsets switch back after ${T}s). */
[data-sanso-pop] { transform-origin: 100% 50% !important; transition: ${TR}, transform-style 0s linear ${T}s !important; transition-behavior: allow-discrete !important; }
[data-sanso-link], [data-sanso-case="box"]:not([data-sanso-pop]) { transition: box-shadow ${T}s ${EASE}, transform-style 0s linear ${T}s, translate 0s linear ${T}s !important; transition-behavior: allow-discrete !important; }
[data-sanso-pop]:not(img), [data-sanso-link], [data-sanso-case="box"] {
  overflow: visible !important;
  filter: none !important; -webkit-filter: none !important; clip-path: none !important; mask: none !important; -webkit-mask: none !important;
  contain: none !important; mix-blend-mode: normal !important; content-visibility: visible !important; will-change: auto !important; backdrop-filter: none !important;
}
[data-sanso-pop]:not([data-sanso-case="box"])::after, [data-sanso-pop]:not([data-sanso-case="box"])::before { display: none !important; } /* (when the item is the case itself, its own overlays stay) */
[data-sanso-case="box"][data-sanso-pop] { transition: ${TR}, transform-style 0s linear ${T}s !important; transition-behavior: allow-discrete !important; }
[data-sanso-case="box"] > img { filter: brightness(.9); transition: filter ${T}s ${EASE}, translate 0s linear ${T}s; }
/* In 3D (see the active rules) nothing may lie in the same plane as the cover picture: equal depth makes the GPU flicker.
   The picture and Steam's badges are lifted a hair, the case sits a hair behind its Steam item. Flat at rest. */
[data-sanso-pop] > :not([data-sanso-case]):not([data-sanso-link]):not([data-sanso-faces]):not([data-sanso-tpl]):not(img) { transition: translate 0s linear ${T}s; }
[data-sanso-pop][data-sanso-pstatic] { position: relative !important; }
[data-sanso-pop]:not(img) { border-radius: calc(var(--c3d-r, 2px) + 1px) !important; }
[data-sanso-case="box"] { border-radius: var(--c3d-r, 2px); ${idleShadow} }
[data-sanso-case="box"] img { border-radius: var(--c3d-r, 2px); }
[data-sanso-case="box"][data-sanso-static] { position: relative !important; }
img[data-sanso-case="img"] { border-radius: var(--c3d-r, 2px); ${imgIdle} }
${frame}

/* resting cover: one flat overlay, no extra elements */
[data-sanso-case="box"]::after {
  content: ""; position: absolute; top: 0; right: 0; bottom: 0; left: 0; pointer-events: none; z-index: 1;
  border-radius: var(--c3d-r, 2px); transition: transform 0s linear ${T}s;
  background:
    var(--c3d-wear, linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0))),
    ${gloss}
    ${band}
    ${s.sleeve ? `linear-gradient(90deg, transparent 3.2%, rgba(255,255,255,.34) 3.2%, rgba(255,255,255,.34) 3.9%, rgba(0,0,0,.30) 3.9%, rgba(0,0,0,.30) 5%, rgba(255,255,255,.06) 5%, transparent 9%),
    linear-gradient(180deg, rgba(255,255,255,.22), rgba(255,255,255,0) 1.6%, rgba(255,255,255,0) 98.4%, rgba(0,0,0,.25)),` : ""}
    linear-gradient(90deg, rgba(0,0,0,.42) 0, rgba(255,255,255,.22) 1.5%, rgba(0,0,0,.16) 3.2%, rgba(0,0,0,0) 7.5%),
    var(--c3d-framelayers, linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0)));
  box-shadow: inset 0 0 0 1px var(--c3d-line), inset 0 0 0 var(--c3d-rim, 0px) rgba(255,255,255,.5), inset 0 0 0 3px rgba(0,0,0,.18)${s.sleeve ? ", inset 0 0 0 4px rgba(255,255,255,.10), inset 0 0 0 5px rgba(0,0,0,.16)" : ""};
}

/* real 3D box: exists in the page but is not drawn until you hover or focus the game */
[data-sanso-faces] { display: none; transition-property: display; transition-duration: 0s; transition-delay: ${T}s; transition-behavior: allow-discrete; position: absolute; top: 0; right: 0; bottom: 0; left: 0; pointer-events: none; transform-style: preserve-3d; z-index: 3; }
[data-sanso-faces] > div { position: absolute; box-sizing: border-box; }
[data-sanso-faces] > [data-f="front"] { top: 0; right: 0; bottom: 0; left: 0; transform: translateZ(1px); border-radius: var(--c3d-r, 2px); }
[data-sanso-faces] > [data-f="spine"] {
  top: ${R}; bottom: ${R}; left: 0; width: var(--c3d-d, ${d}px); min-width: 12px; transform-origin: left center; transform: rotateY(90deg);
  /* the spine stops r short of the top and bottom; its band is laid out as if the spine were the full height, so it lines up with the front's band */
  background:
    ${bandLayer},
    linear-gradient(90deg, var(--c3d-a), var(--c3d-b));
  background-size: 100% calc(100% + ${R} * 2), 100% 100%; background-position: 0 calc(${R} * -1), 0 0; background-repeat: no-repeat;
  display: flex; align-items: center; justify-content: center; overflow: hidden;
}
[data-sanso-faces] > [data-f="spine"] > span {
  writing-mode: vertical-rl; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  max-height: 86%; margin-top: 8%; font-weight: 800; font-family: sans-serif; line-height: 1; font-size: max(9px, calc(var(--c3d-d, ${d}px) * .8)); color: var(--c3d-text);
  transform: scaleX(-1); letter-spacing: .05em; text-shadow: 0 0 2px rgba(0,0,0,.75), 0 1px 1px rgba(0,0,0,.6);
}
[data-sanso-faces] > [data-f="top"] { top: 0; left: ${R}; right: ${R}; height: var(--c3d-d, ${d}px); transform-origin: center top; transform: rotateX(-90deg); background: linear-gradient(0deg, var(--c3d-b), var(--c3d-a)); }
[data-sanso-faces] > [data-f="bottom"] { bottom: 0; left: ${R}; right: ${R}; height: var(--c3d-d, ${d}px); transform-origin: center bottom; transform: rotateX(90deg); background: linear-gradient(180deg, var(--c3d-b), #000); }
[data-sanso-faces] > [data-f="right"] { top: ${R}; bottom: ${R}; right: 0; width: var(--c3d-d, ${d}px); transform-origin: right center; transform: rotateY(-90deg); background: linear-gradient(270deg, var(--c3d-b), var(--c3d-a)); }
[data-sanso-faces] > [data-f="back"] { top: 0; right: 0; bottom: 0; left: 0; border-radius: ${R}; transform: translateZ(calc(var(--c3d-d, ${d}px) * -1)) rotateY(180deg); backface-visibility: hidden; -webkit-backface-visibility: hidden; background: var(--c3d-b); }
/* the corners of the box: the side bends into the top and bottom along the front's corner */
${corners}
${shine}

/* the game you are on: bigger tilt, lifts toward you, full box appears */
${active(STATE, true)}
${neighborsByPosition}
@supports selector(:has(*)) {
${active(HAS, false)}
}
${pick}
${tplCss()}
/* a game is running: nothing of ours animates */
[data-sanso-sleep] [data-sanso-pop], [data-sanso-sleep] [data-sanso-pop] *, [data-sanso-sleep] [data-sanso-case]::after { animation-play-state: paused !important; }
`;
}

// ---------- tagging ----------

export interface Provider {
  getDocs: () => Document[];
  appName: (key: string) => string;
  collectionsOf: (key: string) => string[];
  collectionName: (id: string) => string;
  /** candidate numbers from a cover -> the game's key (unsigned app id) if the game list knows it */
  resolveId: (candidates: string[]) => string | null;
  /** game name -> key, only when exactly one game has that name */
  byName: (name: string) => string | null;
  /** playtime of a game (null when unknown) */
  playInfo: (key: string) => PlayInfo | null;
  /** the game's portrait cover art addresses, best first (optional) */
  artUrls?: (key: string) => string[];
  /** the route a window shows (/library/app/<id> on a game's page), as Steam's own router has it; "" when unknown */
  pagePath?: (doc: Document) => string;
}

// Cover test with no layout reads: portrait artwork (about 2:3, tolerant of 3:4) that is big enough for a capsule.
export function isPortraitCover(img: HTMLImageElement): boolean {
  const w = img.naturalWidth, h = img.naturalHeight;
  if (!w || !h || w < 100) return false;
  const r = h / w;
  return r >= 1.28 && r <= 1.75;
}

export type IdSource = "src" | "fiber" | "name" | "raw" | "none";

// Several independent ways to find out which game a cover belongs to (works for Steam and non-Steam games).
export function resolveAppId(img: HTMLImageElement, prov: Provider): { key: string | null; how: IdSource } {
  const c1 = srcCandidates(img.currentSrc || img.src || "");
  let k = c1.length ? prov.resolveId(c1) : null;
  if (k) return { key: k, how: "src" };
  const c2 = fiberCandidates(img).concat(fiberCandidates(img.parentElement));
  k = c2.length ? prov.resolveId(c2) : null;
  if (k) return { key: k, how: "fiber" };
  const nm = (img.alt || img.getAttribute("aria-label") || (img.parentElement && img.parentElement.getAttribute("aria-label")) || "").trim();
  if (nm) { k = prov.byName(nm); if (k) return { key: k, how: "name" }; }
  // not in the game list: keep a stable key from the picture address so the cover still gets one consistent look
  const raw = c1[0] || c2[0];
  if (raw) { const n = normId(raw); if (n) return { key: n, how: "raw" }; }
  return { key: null, how: "none" };
}

/** The frame's strips as background layers for the cover's overlay: the strip above the art (as tall as the room the band needs, or an even
 *  border when there is no band), and the sides (and the bottom, with no band). Percentages are those of the shrunk art (see the frame rule). */
export function frameLayers(on: boolean, band: boolean): string {
  const FR = "linear-gradient(var(--c3d-frame), var(--c3d-frame))";
  if (!on) return "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0))";
  return band
    ? `${FR} 0 0 / 100% 5.485% no-repeat, ${FR} 0 0 / 2.743% 100% no-repeat, ${FR} 100% 0 / 2.743% 100% no-repeat`
    : `${FR} 0 0 / 100% 2.743% no-repeat, ${FR} 0 100% / 100% 2.743% no-repeat, ${FR} 0 0 / 2.743% 100% no-repeat, ${FR} 100% 0 / 2.743% 100% no-repeat`;
}

function setVars(el: HTMLElement, p: Pal, id: string, depthPx: number, radius: number, rim: number, wear: WearId, band: boolean, frame: boolean): void {
  el.style.setProperty("--c3d-a", p.a);
  el.style.setProperty("--c3d-b", p.b);
  el.style.setProperty("--c3d-band", p.band);
  el.style.setProperty("--c3d-frame", p.frame || p.band);
  el.style.setProperty("--c3d-text", p.text);
  el.style.setProperty("--c3d-line", p.line);
  el.style.setProperty("--c3d-d", `${depthPx}px`);
  el.style.setProperty("--c3d-r", `${radius}px`);
  el.style.setProperty("--c3d-rim", `${rim}px`);
  el.style.setProperty("--c3d-wear", WEAR_CSS[wear]);
  // the color band: a layer of its own per case (none = a clear layer); "noband" also switches off the band-as-frame
  el.style.setProperty("--c3d-bandimg", band
    ? "linear-gradient(180deg, var(--c3d-band) 0, var(--c3d-band) 5.2%, rgba(0,0,0,.35) 5.2%, rgba(0,0,0,.35) calc(5.2% + 1px), transparent calc(5.2% + 1px))"
    : "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0))");
  el.style.setProperty("--c3d-bandfill", band ? "linear-gradient(var(--c3d-band), var(--c3d-band))" : "linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0))");
  if (band) el.removeAttribute("data-sanso-noband"); else el.setAttribute("data-sanso-noband", "1");
  // the colored frame (the art shrunk a little, framed in the frame color), on or off for this case; it does not depend on the band
  if (frame) el.setAttribute("data-sanso-frame", "1"); else el.removeAttribute("data-sanso-frame");
  // The frame's color is painted twice. The picture's own background shows in the room the shrunk picture leaves, but the browser leaves that
  // background out for some pictures (an opaque image is taken to cover the whole box, which it no longer does), and the frame then
  // seemed missing, depending on the art. So the cover's overlay (which is always drawn) paints the frame strips as well, and a simple
  // cover gets an inset shadow of the same color.
  const frameOn = frame && id.indexOf(TPL_PREFIX) !== 0;
  el.style.setProperty("--c3d-framelayers", frameLayers(frameOn, band));
  el.style.setProperty("--c3d-fsh", frameOn ? "var(--c3d-frame)" : "rgba(0,0,0,0)");
  el.setAttribute("data-sanso-style", id);
  el.setAttribute("data-sanso-wear", wear);
}

const VAR_NAMES = ["--c3d-a", "--c3d-b", "--c3d-band", "--c3d-frame", "--c3d-text", "--c3d-line", "--c3d-d", "--c3d-r", "--c3d-rim", "--c3d-wear", "--c3d-bandimg", "--c3d-bandfill", "--c3d-framelayers", "--c3d-fsh"];

function clearVars(el: HTMLElement): void {
  VAR_NAMES.forEach((v) => el.style.removeProperty(v));
  el.removeAttribute("data-sanso-style");
  el.removeAttribute("data-sanso-wear");
  el.removeAttribute("data-sanso-noband");
  el.removeAttribute("data-sanso-frame");
}

function ensureFaces(doc: Document, box: HTMLElement, title: string): void {
  let faces = box.querySelector(":scope > [data-sanso-faces]") as HTMLElement | null;
  if (!faces) {
    faces = doc.createElement("div");
    faces.setAttribute("data-sanso-faces", "1");
    box.appendChild(faces);
  }
  ["back", "bottom", "top", "right", "spine", "tl0", "tl1", "tr0", "tr1", "bl0", "bl1", "br0", "br1", "front", "shine"].forEach((f) => {
    if (faces!.querySelector(`:scope > [data-f="${f}"]`)) return;
    const c = doc.createElement("div");
    c.setAttribute("data-f", f);
    if (f === "spine") c.appendChild(doc.createElement("span"));
    faces!.appendChild(c);
  });
  const span = faces.querySelector("[data-f=spine] > span") as HTMLElement | null;
  if (span && span.textContent !== title) span.textContent = title;
}

function untag(el: HTMLElement): void {
  if (!el.hasAttribute("data-sanso-case")) return;
  el.removeAttribute("data-sanso-case");
  el.removeAttribute("data-sanso-static");
  el.removeAttribute("data-sanso-app");
  clearVars(el);
  const faces = el.querySelector(":scope > [data-sanso-faces]");
  if (faces) faces.remove();
  const tl = el.querySelector(":scope > [data-sanso-tpl]");
  if (tl) tl.remove();
  let e: HTMLElement | null = el;
  for (let i = 0; e && i < 8; i++, e = e.parentElement) {
    if (e.hasAttribute("data-sanso-pop")) {
      e.removeAttribute("data-sanso-pop"); e.removeAttribute("data-sanso-pstatic"); e.removeAttribute("data-sanso-own");
      const st = e.parentElement;
      if (st) st.removeAttribute("data-sanso-stage");
      let q: HTMLElement | null = st;
      for (let j = 0; q && j < 6; j++, q = q.parentElement) { q.removeAttribute("data-sanso-focus"); q.removeAttribute("data-sanso-cell"); }
      e.removeAttribute("data-sanso-cell"); e.removeAttribute("data-sanso-nb"); e.removeAttribute("data-sanso-pick"); e.style.removeProperty("--c3d-r");
      break;
    }
    e.removeAttribute("data-sanso-link");
  }
}

export function clearAll(doc: Document): void {
  doc.querySelectorAll("[data-sanso-faces],[data-sanso-tpl]").forEach((el) => el.remove());
  doc.querySelectorAll("[data-sanso-case],[data-sanso-pop],[data-sanso-link],[data-sanso-focus],[data-sanso-cell],[data-sanso-nb],[data-sanso-pick],[data-sanso-stage],[data-sanso-persp],[data-sanso-static],[data-sanso-style],[data-sanso-app]").forEach((el) => {
    const h = el as HTMLElement;
    ["data-sanso-case", "data-sanso-stage", "data-sanso-static", "data-sanso-app", "data-sanso-pop", "data-sanso-pstatic", "data-sanso-own", "data-sanso-link", "data-sanso-focus", "data-sanso-cell", "data-sanso-nb", "data-sanso-pick", "data-sanso-persp"].forEach((a) => h.removeAttribute(a));
    clearVars(h);
  });
  const st = doc.getElementById(STYLE_ID);
  if (st) st.remove();
}

function ensureStyle(doc: Document, css: string): void {
  let st = doc.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!st) {
    st = doc.createElement("style");
    st.id = STYLE_ID;
    (doc.head || doc.documentElement).appendChild(st);
  }
  if (st.textContent !== css) st.textContent = css;
}

// the path of the page a window is showing (used to leave the SteamGridDB plugin's own pages alone)
export function screenPath(doc: Document): string {
  try { return (doc.defaultView && doc.defaultView.location && doc.defaultView.location.pathname) || ""; } catch (e) { return ""; }
}
// Pictures that are never turned into cases, whatever the settings: the SteamGridDB plugin's artwork picker shows every
// cover in SteamGridDB's catalog, and those are candidates for a game's cover, not covers of games in your library.
// Recognised by where the picture comes from (steamgriddb.com) or by a SteamGridDB name on the page around it.
const FOREIGN_ART_SRC = /steamgriddb/i;
const FOREIGN_ART_NAME = /steamgriddb|(^|[\s_-])sgdb([\s_-]|$)/i; // ("sgdb" only as a whole word: Steam's scrambled class names must never match by chance)
export function isForeignArt(img: HTMLImageElement, deep: boolean): boolean {
  try {
    if (FOREIGN_ART_SRC.test(img.currentSrc || img.src || "")) return true;
    if (!deep) return false;
    let e: Element | null = img;
    for (let i = 0; e && i < 14; i++, e = e.parentElement) {
      const cls = typeof (e as HTMLElement).className === "string" ? (e as HTMLElement).className : "";
      if ((cls && FOREIGN_ART_NAME.test(cls)) || FOREIGN_ART_NAME.test(e.id || "")) return true;
    }
  } catch (err) { /* ignore */ }
  return false;
}
/** The game whose page a window shows (Steam's game page, /library/app/<id>) as an unsigned app id; "" on any other screen. */
export function gamePageKey(doc: Document, prov?: Provider): string {
  const paths = [screenPath(doc)];
  try { const q = prov && prov.pagePath ? prov.pagePath(doc) : ""; if (q) paths.push(q); } catch (e) { /* the window's own address is enough */ }
  for (const pa of paths) {
    const m = /\/library\/app\/(-?\d+)/.exec(pa);
    if (m) return normId(m[1]) || m[1];
  }
  return "";
}
/** Is the picture showing on screen (not in a page that stays mounted behind the one you are on)? */
function shownOnScreen(img: HTMLImageElement): boolean {
  try { const r = img.getBoundingClientRect(); return r.width > 20 && r.height > 20; } catch (e) { return false; }
}
/** Does the cover stand among other covers (a shelf or a grid of games)? Covers that do are other games' tiles; one that stands alone is a page's own cover. */
function amongCovers(img: HTMLImageElement): boolean {
  let e: HTMLElement | null = img.parentElement;
  for (let i = 0; e && i < 8 && e !== e.ownerDocument.body; i++, e = e.parentElement) {
    const list = e.getElementsByTagName("img");
    let n = 0;
    for (let k = 0; k < list.length && k < 60; k++) if (isPortraitCover(list[k]) && shownOnScreen(list[k])) n++;
    if (n >= 3) return true;
  }
  return false;
}
export function screenAllowed(doc: Document, _s: Settings): boolean {
  // every library screen: the grids, Home and the game page. Only the SteamGridDB plugin's own pages are left alone.
  return !/steamgriddb|\/sgdb(\/|$)/i.test(screenPath(doc));
}

// ---------- engine: event driven, incremental, time-sliced ----------

interface Tracked {
  img: HTMLImageElement; target: HTMLElement; mode: "box" | "img"; appid: string | null; how: IdSource; sig?: string; w?: number; pop?: HTMLElement;
}

// Steam draws extra copies of a cover: a blurred glow behind the focused game, reflections on Home.
// Those copies must stay as Steam draws them, so they are never turned into cases.
const DECOY_CLASS = /Glow|Reflect|Blur|BackgroundImage/i;
export function isDecoy(img: HTMLImageElement, view: Window | null): boolean {
  let e: Element | null = img;
  for (let i = 0; e && i < 5; i++, e = e.parentElement) {
    const cls = typeof (e as HTMLElement).className === "string" ? (e as HTMLElement).className : "";
    if (cls && DECOY_CLASS.test(cls)) return true;
    if (view && i < 4) {
      const cs = view.getComputedStyle(e);
      const bl = cs.filter ? /blur\(([\d.]+)px\)/.exec(cs.filter) : null;
      if (bl && parseFloat(bl[1]) >= 25) return true;
      if (i > 0 && cs.position === "absolute" && parseInt(cs.zIndex, 10) <= -10) return true; // a layer drawn behind the item
      const m = cs.transform && cs.transform !== "none" ? /matrix(3d)?\(([^)]+)\)/.exec(cs.transform) : null;
      if (m) { const n = m[2].split(",").map(parseFloat); if ((m[1] ? n[5] : n[3]) < 0) return true; } // flipped upside down
    }
  }
  return false;
}

// Steam draws a second copy of the same cover inside the same tile (the glow behind it, a reflection). Since Steam started
// scrambling its class names the names no longer tell them apart, and the copy was tilted and un-blurred too: a huge,
// blocky ghost around the focused cover. They are found by structure instead: same picture, same tile.
function coverTwin(img: HTMLImageElement): { twin: HTMLImageElement; common: Element } | null {
  const src = img.currentSrc || img.src;
  if (!src) return null;
  let p: Element | null = img.parentElement;
  for (let i = 0; p && i < 7; i++, p = p.parentElement) {
    const list = p.getElementsByTagName("img");
    if (list.length > 6) return null; // reached a row of games: no twin in this game's own box
    for (let j = 0; j < list.length; j++) {
      const o = list[j];
      if (o !== img && (o.currentSrc || o.src) === src) return { twin: o, common: p };
    }
  }
  return null;
}
const FOCUSABLE = /(^|\s)Focusable(\s|$)/;
// is there a Steam focus target (the thing you actually move onto) between the picture and `anc`?
function inFocusTarget(el: Element, anc: Element): boolean {
  for (let e: Element | null = el.parentElement; e && e !== anc; e = e.parentElement) {
    if (FOCUSABLE.test(typeof (e as HTMLElement).className === "string" ? (e as HTMLElement).className : "") || e.hasAttribute("tabindex")) return true;
  }
  return false;
}
/** True when `img` is the extra copy of a cover (Steam's glow / reflection), not the cover itself. */
export function isTwinDecoy(img: HTMLImageElement): boolean {
  const t = coverTwin(img);
  if (!t) return false;
  // Home (Steam Deck client 2026): the real cover sits inside the focus target (a role=link Focusable); the copy is a
  // sibling box next to it, outside any focus target
  const fa = inFocusTarget(img, t.common), fb = inFocusTarget(t.twin, t.common);
  if (fa !== fb) return !fa;
  // otherwise: the copy that spreads beyond the cover is the glow
  const wa = img.offsetWidth * img.offsetHeight, wb = t.twin.offsetWidth * t.twin.offsetHeight;
  if (wa > wb * 1.15) return true;
  return false; // can't tell them apart: keep both rather than lose the real cover
}

// what would make the browser draw the case flat (no spine / top)
export function flattenReasons(el: HTMLElement): string[] {
  const out: string[] = [];
  try {
    const v = el.ownerDocument.defaultView as Window;
    let e: HTMLElement | null = el;
    let stage: HTMLElement | null = null;
    for (let i = 0; e && i < 8; i++, e = e.parentElement) {
      const cs = v.getComputedStyle(e);
      const nm = e === el ? "case" : "wrapper";
      if (cs.transformStyle !== "preserve-3d") out.push(`${nm} transform-style=${cs.transformStyle}`);
      if (cs.filter && cs.filter !== "none") out.push(`${nm} filter`);
      if (cs.clipPath && cs.clipPath !== "none") out.push(`${nm} clip-path`);
      if (cs.overflow && cs.overflow !== "visible") out.push(`${nm} overflow=${cs.overflow}`);
      if (cs.mixBlendMode && cs.mixBlendMode !== "normal") out.push(`${nm} blend`);
      if (cs.contain && cs.contain !== "none") out.push(`${nm} contain=${cs.contain}`);
      if (e.hasAttribute("data-sanso-pop")) {
        const pa = v.getComputedStyle(e, "::after"), pb = v.getComputedStyle(e, "::before");
        if ((pa.content !== "none" && pa.display !== "none" && pa.mixBlendMode !== "normal") || (pb.content !== "none" && pb.display !== "none" && pb.mixBlendMode !== "normal")) out.push("item overlay blend mode");
        stage = e.parentElement; break;
      }
    }
    if (stage && stage.getAttribute("data-sanso-stage") === "small" && !(v.getComputedStyle(stage).perspective !== "none")) out.push("stage has no perspective");
  } catch (err) { out.push("could not read"); }
  return out;
}

// Other style sheets (themes, other plugins) that also change the cover: names and the properties they set.
const WATCH_PROPS = ["transform", "rotate", "translate", "scale", "perspective", "-webkit-box-reflect", "filter", "mix-blend-mode", "opacity", "transform-style"];
export function themeScan(doc: Document, focusEl: HTMLElement | null): { others: string[]; conflicts: string[] } {
  const others: string[] = [];
  const conflicts: string[] = [];
  const els: Element[] = [];
  if (focusEl) {
    let e: Element | null = focusEl;
    for (let i = 0; e && i < 3; i++, e = e.parentElement) els.push(e);
    const kids = focusEl.querySelectorAll("*");
    for (let i = 0; i < kids.length && i < 40; i++) if (!kids[i].hasAttribute("data-f") && !kids[i].hasAttribute("data-sanso-faces")) els.push(kids[i]);
  }
  const sheets = Array.from(doc.styleSheets);
  sheets.forEach((sh, idx) => {
    const node = sh.ownerNode as HTMLElement | null;
    if (!node || node.id === STYLE_ID) return;
    const href = (sh as CSSStyleSheet).href || "";
    if (href && /\/css\/|steamloopback|steamstatic/.test(href)) return; // Steam's own
    let rules: CSSRuleList | null = null;
    try { rules = (sh as CSSStyleSheet).cssRules; } catch (e) { rules = null; }
    if (!rules || rules.length === 0) return;
    const name = node.id || (node.getAttribute && (node.getAttribute("data-theme") || node.getAttribute("data-name"))) || (href ? href.split("/").slice(-2).join("/") : `style #${idx + 1}`);
    others.push(`${name} (${rules.length} rules)`);
    if (!els.length) return;
    const props = new Set<string>();
    const walk = (list: CSSRuleList, depth: number) => {
      for (let i = 0; i < list.length && i < 4000; i++) {
        const r: any = list[i];
        if (r.cssRules && depth < 3 && !r.selectorText) { walk(r.cssRules, depth + 1); continue; }
        if (!r.selectorText || !r.style) continue;
        const touched = WATCH_PROPS.filter((pr) => r.style.getPropertyValue(pr));
        if (!touched.length) continue;
        let hit = false;
        try { hit = els.some((el) => el.matches(r.selectorText)); } catch (e) { hit = false; }
        if (hit) touched.forEach((pr: string) => props.add(pr));
      }
    };
    walk(rules, 0);
    if (props.size) conflicts.push(`${name}: ${Array.from(props).join(", ")}`);
  });
  return { others, conflicts };
}

export interface CheckLine { status: "ok" | "fail" | "warn" | "skip"; label: string; detail: string }

export interface Stats { batches: number; imagesChecked: number; mutationCalls: number; ms: number }

export const OWNER_ATTR = "data-sanso-owner";
const BATCH = 24;          // images per slice
const DISCOVER_MS = 3000;  // cheap check for new/closed Steam windows and screen changes (no page scan)

export interface Look {
  style: StyleId; pal: Pal; shapeId: ShapeId; shape: { depth: number; radius: number; rim: number };
  depthPx: number; dfac: number; thick: number;     // box thickness: the Case thickness setting x dfac (the shape's own factor, or 1 = DVD case) x thick
  wear: WearId; media: HslColor | null;             // color of the disc or cartridge (null = the console's own plastic)
  art: InsertArt; window: HslColor | null;          // what is printed on it, and the color of a cartridge's art window (null = follow windowMode)
  logoPos: LogoPos; artY: number;                   // where the logo sits on a disc; how far the cover is moved (Cover (Fill))
  windowMode: "black" | "white" | "match"; slot: "handheld" | "console"; when: "before" | "after";
  off: boolean; band: boolean; frame: boolean; insert: boolean; eject: boolean;
}

// How thick a case is relative to a DVD case: its shape's own factor (the retro cartridges are thick, the Switch card is thin),
// or 1 when every case is meant to be as thick as a DVD case (the global "Varying box thickness" switch, or a collection's or a game's own).
/** Thin, Standard or Thick, for a thickness factor. */
export function thicknessName(dfac: number): "Thin" | "Standard" | "Thick" { return dfac < 0.9 ? "Thin" : dfac > 1.1 ? "Thick" : "Standard"; }

export function thicknessFactor(s: Settings, ov: ItemOv, shapeId: ShapeId): number {
  const of = (m: "thin" | "standard" | "thick") => (m === "thin" ? THINNEST : m === "thick" ? THICKEST : DVD_CASE);
  const mode = ov.thickMode || (s.varyThickness ? "varied" : s.thickness);
  if (mode !== "varied") return of(mode);
  // the preset's own thickness; a preset with none of its own (a DVD-case thickness) takes the default box thickness
  const own = SHAPES[shapeId].depth;
  return own === DVD_CASE ? of(s.thickness) : own;
}

// everything that decides how one game's case looks. Settings that a game or a collection decides for itself win over the global
// settings; the global settings (colored bands, colored frames, box thickness, animations) win over what a preset brings along.
export function lookForIds(s: Settings, appid: string | null, colls: string[], info: PlayInfo | null = null): Look {
  const ov = ovFor(s, appid, colls);
  const style = ov.preset || s.color;
  const shapeId = shapeFor(s, style, ov);
  const base = SHAPES[shapeId];
  // with the sleeve, real keepcase corners: rounder plastic, the jewel case stays sharp
  const shape = s.sleeve ? { ...base, radius: SLEEVE_R[shapeId] } : base;
  const dfac = thicknessFactor(s, ov, shapeId);
  const thick = typeof ov.thick === "number" ? ov.thick : 1;
  return {
    style, pal: paletteFor(s, style, ov), shapeId, shape,
    depthPx: Math.max(3, Math.round(s.depth * dfac * thick)), dfac, thick,
    wear: resolveWear(s, ov, info), media: ov.media || presetMedia(s, style),
    art: ov.art || presetArt(style) || s.insertArt, logoPos: ov.logoPos || "top", artY: typeof ov.artY === "number" ? ov.artY : 0, window: ov.window || null, windowMode: ov.windowMode || s.windowMode, slot: ov.slot || s.insertTarget, when: ov.when || s.insertWhen,
    off: ov.off === true,
    band: typeof ov.band === "boolean" ? ov.band : s.band,
    frame: typeof ov.frame === "boolean" ? ov.frame : (presetNoFrame(style) ? false : s.bandFrame), // a preset can come without a frame; frames switched on for a game or collection still win
    insert: typeof ov.insert === "boolean" ? ov.insert : s.insertAnim,
    eject: typeof ov.eject === "boolean" ? ov.eject : s.ejectAnim,
  };
}

export function lookFor(s: Settings, prov: Provider, appid: string | null): Look {
  const colls = appid ? prov.collectionsOf(appid) : [];
  return lookForIds(s, appid, colls, s.playWear && !s.wearOverride && appid ? prov.playInfo(appid) : null);
}

class DocWatch {
  doc: Document;
  obs: MutationObserver;
  queue = new Set<HTMLImageElement>();
  tracked = new Map<HTMLImageElement, Tracked>();
  decoys = new Set<HTMLImageElement>();
  plain = new Set<HTMLImageElement>();   // a game page's own cover (its Game Info tab): shown as Steam draws it, without the case
  offImgs = new Set<HTMLImageElement>(); // covers left alone because 3D is switched off for their game or collection
  timer: any = null;
  lastOk: boolean | null = null;
  lastPage = "";                          // the game page the window showed at the last check ("" = none)
  onLoad: (e: Event) => void;
  onPick: (e: Event) => void;
  onVis: () => void;
  onNb: () => void;
  nbRaf: any = null;
  nbLast: HTMLElement | null = null;           // the case that was focused at the last check
  nbHold = new Map<HTMLElement, number>();     // cases that just lost focus -> time (ms) from which they may lean ("Settle flat first")
  nbTimer: any = null;
  constructor(doc: Document, public eng: Engine) {
    this.doc = doc;
    this.obs = new MutationObserver((recs) => this.onMutations(recs));
    this.onLoad = (e: Event) => {
      const t = e.target as any;
      if (t && t.tagName === "IMG") this.enqueue(t);
    };
    this.onVis = () => { if (!doc.hidden) this.schedule(); };
    this.observe();
    // pick-up: Steam sends "vgp_onok" to the focused game when A is pressed (captured before Steam handles it)
    this.onPick = (e: Event) => {
      try {
        if (!this.eng.settings.pickup || !this.eng.settings.enabled) return;
        const tg = e.target as HTMLElement | null;
        if (!tg || typeof tg.closest !== "function") return;
        let pop = tg.closest("[data-sanso-pop]") as HTMLElement | null;
        if (!pop) { const f = tg.closest("[data-sanso-focus]"); if (f) pop = f.querySelector("[data-sanso-pop]"); }
        if (!pop) return;
        const el = pop;
        el.removeAttribute("data-sanso-pick");
        requestAnimationFrame(() => {
          el.setAttribute("data-sanso-pick", "1");
          setTimeout(() => el.removeAttribute("data-sanso-pick"), 460);
        });
      } catch (err) { /* never block Steam */ }
    };
    // leaning neighbours: re-checked when the focus or the pointer moves (once per frame at most)
    this.onNb = () => {
      if (this.nbRaf !== null) return;
      this.nbRaf = requestAnimationFrame(() => { this.nbRaf = null; this.updateNeighbours(); });
    };
    for (const ev of ["focusin", "focusout", "mouseover", "mouseout"]) doc.addEventListener(ev, this.onNb, true);
    doc.addEventListener("vgp_onok", this.onPick, true);
    doc.addEventListener("click", this.onPick, true);
    doc.addEventListener("load", this.onLoad, true);
    doc.addEventListener("visibilitychange", this.onVis);
  }
  observe(): void {
    if (this.eng.sleeping) return; // a game is running: Steam's pages are not watched
    if (this.doc.body) this.obs.observe(this.doc.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
  }
  onMutations(recs: MutationRecord[]): void {
    this.eng.stats.mutationCalls++;
    for (const r of recs) {
      if (r.type === "attributes") {
        const t = r.target as any;
        if (t.tagName === "IMG") this.enqueue(t);
        continue;
      }
      r.addedNodes.forEach((n: Node) => {
        if (n.nodeType !== 1) return;
        const el = n as Element;
        if (el.tagName === "IMG") this.enqueue(el as HTMLImageElement);
        else if (el.firstElementChild) {
          const list = el.getElementsByTagName("img");
          for (let i = 0; i < list.length; i++) this.enqueue(list[i]);
        }
      });
    }
  }
  enqueue(img: HTMLImageElement): void {
    this.queue.add(img);
    this.schedule();
  }
  scanAll(): void {
    const list = this.doc.getElementsByTagName("img");
    for (let i = 0; i < list.length; i++) this.queue.add(list[i]);
    this.schedule();
  }
  // cheap: looks at the address only; scans the page again only when the screen changes between allowed / not allowed
  checkPath(force?: boolean): void {
    const ok = screenAllowed(this.doc, this.eng.settings);
    // a game's page opened or closed: the covers are looked at again (its own cover is shown plain, the others are cases)
    const page = gamePageKey(this.doc, this.eng.prov), pageMoved = page !== this.lastPage;
    this.lastPage = page;
    if (!force && ok === this.lastOk) { if (pageMoved && ok && this.lastOk !== null) this.scanAll(); return; }
    const first = this.lastOk === null;
    this.lastOk = ok;
    if (ok && !first && this.eng.settings.playWear) this.restyle();
    if (ok) this.scanAll();
    else this.untagAll();
  }
  untagAll(): void {
    this.obs.disconnect();
    try {
      this.tracked.forEach((tr) => untag(tr.target));
      this.tracked.clear();
      this.offImgs.clear();
      this.plain.clear();
      this.queue.clear();
      this.obs.takeRecords();
    } finally { this.observe(); }
  }
  schedule(): void {
    if (this.eng.sleeping) return;
    if (this.timer || this.queue.size === 0 || this.doc.hidden) return;
    this.timer = setTimeout(() => { this.timer = null; this.run(); }, 60);
  }
  run(): void {
    const t0 = performance.now();
    this.obs.disconnect();
    try {
      const batch: HTMLImageElement[] = [];
      for (const img of this.queue) {
        this.queue.delete(img);
        batch.push(img);
        if (batch.length >= BATCH) break;
      }
      this.process(batch);
      this.obs.takeRecords();
    } catch (e) {
      this.eng.noteError(e);
    } finally {
      this.observe();
    }
    this.eng.stats.batches++;
    this.eng.stats.ms += performance.now() - t0;
    if (this.queue.size) this.schedule();
  }
  // phase 1 reads layout once per NEW cover, phase 2 writes (no read/write interleaving)
  process(batch: HTMLImageElement[]): void {
    const s = this.eng.settings;
    const view = this.doc.defaultView;
    const allowed = screenAllowed(this.doc, s);
    const pageKey = gamePageKey(this.doc, this.eng.prov);
    // On a game's own page (the Game Info tab) that game's cover is left exactly as Steam draws it: no case, band, frame or wear.
    // It is the game's own cover, or one that stands alone; covers in a shelf or grid are other games and stay cases.
    const isPageCover = (img: HTMLImageElement): boolean => {
      const pk = resolveAppId(img, this.eng.prov).key;
      return pk === pageKey || !amongCovers(img);
    };
    const fresh: { img: HTMLImageElement; mode: "box" | "img"; makeStatic: boolean; lift: number; big: boolean; popStatic: boolean; own: boolean; w: number; flift: number; clift: number }[] = [];
    const body = this.doc.body;
    for (const img of batch) {
      this.eng.stats.imagesChecked++;
      const old = this.tracked.get(img);
      const foreign = img.isConnected && isForeignArt(img, !old); // e.g. the SteamGridDB artwork picker: left exactly as it is
      if (!s.enabled || !allowed || !img.isConnected || foreign || !isPortraitCover(img) || (!old && (isDecoy(img, view) || isTwinDecoy(img)))) {
        if (!old && !foreign && img.isConnected && isPortraitCover(img)) this.decoys.add(img);
        if (old) { untag(old.target); this.tracked.delete(img); }
        continue;
      }
      if (old && pageKey && shownOnScreen(img) && isPageCover(img)) {
        // it was made a case before the game page was known to be showing: released (a cover in a page behind this one is not on screen, and stays)
        untag(old.target); this.tracked.delete(img); this.plain.add(img);
        continue;
      }
      if (old) {
        // the same <img> may have been reused for another game (virtual lists): re-read its id
        const r = resolveAppId(img, this.eng.prov);
        if (r.key !== old.appid) { old.appid = r.key; old.how = r.how; if (r.key) old.target.setAttribute("data-sanso-app", r.key); this.paint(old); }
        else if (old.mode === "box" && old.target.hasAttribute("data-sanso-style")) this.syncTemplate(old, old.target.getAttribute("data-sanso-style") || "");
        continue;
      }
      if (pageKey && isPageCover(img)) { this.plain.add(img); continue; }
      // the extra copy of this cover in the same tile: never part of the case, and if it was tagged before the real
      // cover showed up, it is released again
      let decoy: HTMLElement | null = null;
      { const t = coverTwin(img);
        if (t && isTwinDecoy(t.twin)) {
          decoy = t.twin;
          const tt = this.tracked.get(t.twin);
          if (tt) { untag(tt.target); this.tracked.delete(t.twin); this.decoys.add(t.twin); }
        } }
      const parent = img.parentElement;
      let mode: "box" | "img" = "img";
      let makeStatic = false;
      if (parent && parent !== this.doc.body && parent.getElementsByTagName("img").length <= 4) {
        const pr = parent.getBoundingClientRect(), ir = img.getBoundingClientRect();
        if (Math.abs(pr.width - ir.width) < 6 && Math.abs(pr.height - ir.height) < 6) {
          mode = "box";
          makeStatic = !!view && view.getComputedStyle(parent).position === "static";
        }
      }
      // the pop element: the cover's focusable outer wrapper (so Steam's focus outline moves with the case)
      const base: HTMLElement = mode === "box" ? (parent as HTMLElement) : img;
      let pop: HTMLElement = base, lift = 0;
      try {
        const br = base.getBoundingClientRect();
        for (let i = 0; i < 5; i++) {
          const p: HTMLElement | null = pop.parentElement;
          if (!p || p === body || p === this.doc.documentElement) break;
          if (p.getElementsByTagName("img").length > 4) break;
          if (decoy && p.contains(decoy)) break; // the glow copy must not tilt with the case
          const cls = typeof p.className === "string" ? p.className : "";
          const focusable = /(^|\s)Focusable(\s|$)|(^|\s)gpfocus/.test(cls);
          const pr = p.getBoundingClientRect();
          const near = pr.width <= br.width + 48 && pr.height <= br.height + 64 && pr.width >= br.width - 2;
          if (focusable) { if (pr.width <= br.width * 1.5 + 60 && pr.height <= br.height * 1.5 + 80) { pop = p; lift++; } break; }
          if (!near) break;
          pop = p; lift++;
        }
      } catch (e) { /* keep the cover itself */ }
      // Steam's focusable item above the pop element (if any): it gets the focus class, the case reacts to it
      let flift = 0;
      if (!/(^|\s)Focusable(\s|$)/.test(typeof pop.className === "string" ? pop.className : "")) {
        let q: HTMLElement | null = pop.parentElement;
        for (let i = 1; q && q !== body && i <= 6; i++, q = q.parentElement) {
          if (q.getElementsByTagName("img").length > 6) break;
          const c = typeof q.className === "string" ? q.className : "";
          if (/(^|\s)Focusable(\s|$)/.test(c) || q.hasAttribute("tabindex")) { flift = i; break; }
        }
      }
      // the grid cell (outermost wrapper holding only this game): its neighbours lean away
      let clift = 0;
      { let q: HTMLElement = pop;
        for (let i = 1; i <= 5; i++) {
          const pp: HTMLElement | null = q.parentElement;
          if (!pp || pp === body || pp === this.doc.documentElement) break;
          const nf = pp.getElementsByClassName("Focusable").length;
          if (nf > 1 || (nf === 0 && pp.getElementsByTagName("img").length > 4)) break; // holds another game
          q = pp; clift = i;
        } }
      let big = false, popStatic = false, own = false, w = 0;
      try { w = base.getBoundingClientRect().width; } catch (e) { w = 0; }
      try {
        const st = pop.parentElement;
        const pr = pop.getBoundingClientRect();
        if (st && view) {
          const sr = st.getBoundingClientRect();
          big = sr.width > pr.width * 1.8 || sr.height > pr.height * 1.6;
        }
        const pcs = view ? view.getComputedStyle(pop) : null;
        popStatic = !!pcs && pcs.position === "static";
        // Steam lifts the focused item with its own transform; ours replaces it, so that one does not count
        let busy = false;
        try { busy = pop.matches(":focus, .gpfocus, :hover"); } catch (e) { busy = false; }
        own = !!pcs && (pcs.transform === "none" || pcs.transform === "" || busy);
      } catch (e) { /* ignore */ }
      fresh.push({ img, mode, makeStatic, lift, big, popStatic, own, w, flift, clift });
    }
    for (const f of fresh) {
      const img = f.img;
      const target: HTMLElement = f.mode === "box" ? (img.parentElement as HTMLElement) : img;
      const r = resolveAppId(img, this.eng.prov);
      if (r.key && ovFor(s, r.key, this.eng.prov.collectionsOf(r.key)).off === true) { this.offImgs.add(img); continue; }
      target.setAttribute("data-sanso-case", f.mode);
      if (f.makeStatic) target.setAttribute("data-sanso-static", "1");
      let pop: HTMLElement = target;
      for (let i = 0; i < f.lift && pop.parentElement; i++) {
        pop = pop.parentElement;
        if (i < f.lift - 1) pop.setAttribute("data-sanso-link", "1");
      }
      pop.setAttribute("data-sanso-pop", "1");
      if (f.popStatic) pop.setAttribute("data-sanso-pstatic", "1");
      if (f.own) pop.setAttribute("data-sanso-own", "1");
      { let q: HTMLElement | null = pop; for (let i = 0; q && i < f.clift; i++) q = q.parentElement; if (q && q !== this.doc.body) q.setAttribute("data-sanso-cell", "1"); }
      if (f.flift) { let q: HTMLElement | null = pop; for (let i = 0; q && i < f.flift; i++) q = q.parentElement; if (q) q.setAttribute("data-sanso-focus", "1"); }
      if (view) { let q: HTMLElement | null = pop.parentElement; for (let i = 0; q && q !== this.doc.body && i < 8; i++, q = q.parentElement) { try { const pe = view.getComputedStyle(q).perspective; if (pe && pe !== "none") q.setAttribute("data-sanso-persp", "1"); } catch (e) { /* ignore */ } } }
      const stage = pop.parentElement;
      if (stage && stage !== this.doc.body && f.own) stage.setAttribute("data-sanso-stage", "own"); // Steam's own perspective there would distort ours
      else if (stage && stage !== this.doc.body) {
        if (f.big || stage.getAttribute("data-sanso-stage") === "big") stage.setAttribute("data-sanso-stage", "big");
        else stage.setAttribute("data-sanso-stage", "small");
      }
      if (r.key) target.setAttribute("data-sanso-app", r.key);
      const tr: Tracked = { img, target, mode: f.mode, appid: r.key, how: r.how, w: f.w, pop };
      this.tracked.set(img, tr);
      this.paint(tr);
    }
    if (this.tracked.size > 600 || this.decoys.size > 200) this.prune();
  }
  paint(tr: Tracked): void {
    const s = this.eng.settings, prov = this.eng.prov;
    const lk = lookFor(s, prov, tr.appid);
    if (lk.off) { untag(tr.target); this.tracked.delete(tr.img); this.offImgs.add(tr.img); return; } // switched off for this game or collection
    // thickness follows the cover's size, so it looks the same on a small and on a big cover
    if (tr.w && tr.w > 40) lk.depthPx = Math.max(4, Math.round(tr.w * 0.0075 * s.depth * lk.dfac * lk.thick));
    const sig = [lk.style, lk.pal.a, lk.pal.b, lk.pal.band, lk.pal.frame, lk.depthPx, lk.shape.radius, lk.shape.rim, lk.wear, lk.band, lk.frame].join("|");
    if (tr.sig !== sig) {
      setVars(tr.target, lk.pal, lk.style, lk.depthPx, lk.shape.radius, lk.shape.rim, lk.wear, lk.band, lk.frame); tr.sig = sig;
      if (tr.pop && tr.pop !== tr.target) tr.pop.style.setProperty("--c3d-r", `${lk.shape.radius}px`);
    }
    if (tr.pop) {
      // The case hinges on its right edge, so its far edge swings toward you by width x sin(tilt). On a wide item (Home's
      // big tiles) the full tilt pushes that edge so close to the camera that the whole cover is magnified and smeared.
      // Keep the swing small compared with the perspective distance.
      const w = Math.max(tr.w || 0, 1);
      const max = Math.asin(Math.min(1, (0.12 * 1100) / w)) * 180 / Math.PI;
      if (s.angle > max) tr.pop.style.setProperty("--c3d-ang", `${max.toFixed(1)}deg`); else tr.pop.style.removeProperty("--c3d-ang");
    }
    if (tr.mode === "box") { ensureFaces(this.doc, tr.target, ""); this.syncTemplate(tr, lk.style); }
  }
  // a template look: a layer with the game's art in the window and the frame picture over it
  syncTemplate(tr: Tracked, style: string): void {
    let layer = tr.target.querySelector(":scope > [data-sanso-tpl]") as HTMLElement | null;
    if (!(style.indexOf(TPL_PREFIX) === 0 && TEMPLATES[style])) { if (layer) layer.remove(); return; }
    if (!layer) {
      layer = this.doc.createElement("div");
      layer.setAttribute("data-sanso-tpl", "1");
      ["art", "frame"].forEach((t) => { const c = this.doc.createElement("div"); c.setAttribute("data-t", t); layer!.appendChild(c); });
      tr.target.appendChild(layer);
    }
    const art = layer.firstElementChild as HTMLElement | null;
    const src = tr.img.currentSrc || tr.img.src;
    if (art && src && art.getAttribute("data-src") !== src) { art.setAttribute("data-src", src); art.style.backgroundImage = `url(${JSON.stringify(src)})`; }
  }
  prune(): void {
    this.tracked.forEach((_tr, img) => { if (!img.isConnected) this.tracked.delete(img); });
    this.decoys.forEach((img) => { if (!img.isConnected) this.decoys.delete(img); });
    this.plain.forEach((img) => { if (!img.isConnected) this.plain.delete(img); });
  }
  // settings changed: restyle what is already tracked, no page scan
  restyle(): void {
    this.obs.disconnect();
    try {
      this.prune();
      ensureStyle(this.doc, buildCss(this.eng.settings));
      this.tracked.forEach((tr) => this.paint(tr));
      // covers that were switched off: look at them again (they may be on now)
      if (this.offImgs.size) {
        const back = Array.from(this.offImgs); this.offImgs.clear();
        back.forEach((im) => { if (im.isConnected) this.queue.add(im); });
        this.schedule();
      }
      this.obs.takeRecords();
    } finally { this.observe(); }
  }
  /** The case you are on: the focused one (gamepad or keyboard), else the one under the pointer. */
  focusedPop(): HTMLElement | null {
    const d = this.doc;
    const q = (sel: string) => d.querySelector(sel) as HTMLElement | null;
    const viaFocus = (el: Element | null): HTMLElement | null => {
      if (!el) return null;
      const own = el.closest("[data-sanso-pop]") as HTMLElement | null;
      if (own) return own;
      const f = el.closest("[data-sanso-focus]");
      return f ? (f.querySelector("[data-sanso-pop]") as HTMLElement | null) : null;
    };
    return q("[data-sanso-pop].gpfocus") || q("[data-sanso-pop]:focus") || viaFocus(q(".gpfocus")) || viaFocus(d.activeElement)
      || q("[data-sanso-pop]:hover");
  }
  /** Marks the cases right beside the one you are on (data-sanso-nb = "l" / "r") so the CSS can lean them away.
   *  It goes by position, not by DOM siblings, so it works however Steam nests the tiles. */
  updateNeighbours(): void {
    try {
      const d = this.doc, s = this.eng.settings;
      const want = new Map<HTMLElement, string>();
      const cur = s.enabled && s.neighbors && !this.eng.sleeping ? this.focusedPop() : null;
      if (cur) {
        // the smallest ancestor that holds a row of games
        let root: HTMLElement | null = cur.parentElement, pops: HTMLElement[] = [];
        for (let i = 0; root && root !== d.body && i < 8; i++, root = root.parentElement) {
          pops = Array.prototype.slice.call(root.querySelectorAll("[data-sanso-pop]"), 0, 400);
          if (pops.length >= 2) break;
        }
        const fr = cur.getBoundingClientRect();
        if (pops.length >= 2 && fr.width > 0 && fr.height > 0) {
          const fx = fr.left + fr.width / 2, fy = fr.top + fr.height / 2;
          let left: HTMLElement | null = null, right: HTMLElement | null = null, ld = Infinity, rd = Infinity;
          for (const p of pops) {
            if (p === cur || p.contains(cur) || cur.contains(p)) continue;
            const r = p.getBoundingClientRect();
            if (r.width <= 0 || r.height <= 0) continue;
            const cy = r.top + r.height / 2, dx = r.left + r.width / 2 - fx;
            if (Math.abs(cy - fy) > fr.height * 0.6) continue; // another row
            if (dx < -fr.width * 0.25 && -dx < ld) { ld = -dx; left = p; }
            else if (dx > fr.width * 0.25 && dx < rd) { rd = dx; right = p; }
          }
          if (left) want.set(left, "l");
          if (right) want.set(right, "r");
        }
      }
      if (s.nbPause) {
        // the case you just left settles flat first (its box turns back and disappears after the turn-back time), then leans
        const now = Date.now();
        if (this.nbLast && this.nbLast !== cur && this.nbLast.isConnected) {
          const T = s.speed === "calm" ? 0.8 : s.speed === "snappy" ? 0.28 : 0.5;
          this.nbHold.set(this.nbLast, now + T * 1000 + 80);
        }
        this.nbLast = cur;
        let wake = 0;
        this.nbHold.forEach((until, e) => {
          if (until <= now || !e.isConnected) this.nbHold.delete(e);
          else if (want.has(e)) { want.delete(e); wake = Math.max(wake, until); }
        });
        clearTimeout(this.nbTimer); this.nbTimer = null;
        if (wake) this.nbTimer = setTimeout(() => { this.nbTimer = null; this.updateNeighbours(); }, wake - now + 20);
      } else { this.nbHold.clear(); this.nbLast = null; }
      d.querySelectorAll("[data-sanso-nb]").forEach((e) => { if (want.get(e as HTMLElement) !== e.getAttribute("data-sanso-nb")) e.removeAttribute("data-sanso-nb"); });
      want.forEach((v, e) => { if (e.getAttribute("data-sanso-nb") !== v) e.setAttribute("data-sanso-nb", v); });
    } catch (e) { /* never block Steam */ }
  }
  destroy(): void {
    this.obs.disconnect();
    clearTimeout(this.timer);
    if (this.nbRaf !== null) { try { cancelAnimationFrame(this.nbRaf); } catch (e) { /* ignore */ } this.nbRaf = null; }
    clearTimeout(this.nbTimer); this.nbTimer = null; this.nbHold.clear(); this.nbLast = null;
    for (const ev of ["focusin", "focusout", "mouseover", "mouseout"]) this.doc.removeEventListener(ev, this.onNb, true);
    this.doc.removeEventListener("load", this.onLoad, true);
    this.doc.removeEventListener("vgp_onok", this.onPick, true);
    this.doc.removeEventListener("click", this.onPick, true);
    this.doc.removeEventListener("visibilitychange", this.onVis);
    try { clearAll(this.doc); if (this.doc.documentElement.getAttribute(OWNER_ATTR) === this.eng.owner) this.doc.documentElement.removeAttribute(OWNER_ATTR); } catch (e) { /* window gone */ }
    this.tracked.clear();
    this.queue.clear();
  }
}


// ---------- experimental: the game disc / card goes into the slot when a game launches ----------
// One temporary layer above the page, removed again when the animation ends; nothing stays behind.
// The case and the disc (or game card) are printed with the game's own cover art.

export interface InsertSrc { rect: { left: number; top: number; width: number; height: number } | null; art: string; logo?: string; look: Look }
/** eject: the same scene played backwards (the disc comes out of the slot and back into the case, which closes).
 *  tear: a sealed game's first launch, the shrink-wrap is ripped off before the case opens. */
export interface InsertOpts { eject?: boolean; tear?: boolean; speed?: number; artMode?: InsertArt }

// The game cards and cartridges that go into the slot. Sizes are a share of the case width (wf) and height / width (ratio);
// label = [left, top, right, height] and pins = [left, right, bottom, height] in % of the cartridge. The shapes are stylised.
type CartKind = "card" | "nes" | "snes" | "n64" | "gb" | "gbc" | "gba" | "ds" | "ds3";
interface CartSpec { wf: number; ratio: number; clip: string; body: string; rad: number; label: number[]; pins?: number[] /* gold contacts along the bottom [left, right, bottom, height] (only the Game Boy Color shows them) */; grip: boolean; radius?: string /* the label's own border-radius */; bands?: [number, number] /* white bands over the top and the bottom of the label, % of its height; the art window is what lies between them */; notch?: number /* the art window's top edge steps up in the middle, % of the cartridge's height */; logo?: "ds" | "3ds" /* the console's mark in the top band: a line, thicker at the right end, which grows downward from the line's top edge (and red where the 3 is on the 3DS) */; barcode?: "center" | "right" /* dashes in the bottom band, centered or at its right end */; ridges?: number[] /* [left, top, width, height] of a ridged grip panel */; under?: string[] /* css of extra pieces drawn under the label (a see-through cartridge shows its circuit board) */; extra?: string[] /* css of extra pieces drawn over it (grooves, slot, arrow) */; glass?: boolean /* see-through plastic */; slant?: number /* the label's lower left corner is cut off, this many % of the cartridge's width */; noOutline?: boolean /* no white edge around the label */; stop?: number /* in the insert animation it goes only part of the way into the slot, this share of it still out (0.4 = 40%) */; strips?: [number, number] /* a light sticker with a vertical strip on each side of the art (Game Boy, Game Boy Color), each with three black dots in a column; widths in % of the label's width: [left, right] */; plate?: { bg: string; win: [number, number, number, number]; parts: string[] } /* a label printed around the art (SNES): its ground, the art window [left, top, width, height] and the printed pieces, all in % of the label */ }
const CART_OF: Partial<Record<ShapeId, CartKind>> = { cartridge: "card", nes: "nes", snes: "snes", n64: "n64", gb: "gb", gbc: "gbc", gba: "gba", ds: "ds", "3ds": "ds3" };
/** An embedded downward arrow: a dark triangle with a light edge just below it, so it looks pressed into the plastic. Percentages of the cartridge. */
function arrowPieces(l: number, t: number, w: number, h: number, dark = 0.35): string[] {
  const tri = "clip-path:polygon(0 0,100% 0,50% 100%);";
  return [
    `left:${l}%;top:${(t + h * 0.08).toFixed(2)}%;width:${w}%;height:${h}%;background:rgba(255,255,255,.28);${tri}`,
    `left:${l}%;top:${t}%;width:${w}%;height:${h}%;background:rgba(0,0,0,${dark});${tri}`,
  ];
}
/** The GBA's scooped lip at the top: a lens, rising in the middle (u = 0..1 across it, y in % of its height) */
function lensClip(): string {
  const top: string[] = [], bot: string[] = [];
  for (let i = 0; i <= 20; i++) {
    const u = i / 20, k = 1 - Math.pow(2 * u - 1, 2);
    top.push(`${(u * 100).toFixed(1)}% ${(78 - 78 * k).toFixed(1)}%`);
    bot.unshift(`${(u * 100).toFixed(1)}% ${(78 + 22 * k).toFixed(1)}%`);
  }
  return `clip-path:polygon(${top.concat(bot).join(",")});`;
}
const CART: Record<CartKind, CartSpec> = {
  // the Switch game card: small and tall, dark gray, a recessed black panel with the red band (the console's logo) above the art,
  // a black strip with the number under it, the notch at the top and the arrow at the bottom; square corners at the top
  card: {
    wf: 0.3, ratio: 1.45, clip: "none", body: "linear-gradient(180deg,#4a4c52,#26282d)", rad: 9, label: [8, 28.5, 8, 49], noOutline: true, grip: false,
    under: ["left:5%;right:5%;top:6%;height:84%;border-radius:7px;background:#0b0c0e;"],
    extra: [
      "left:8%;right:8%;top:9.5%;height:19%;border-radius:4px 4px 0 0;background:linear-gradient(180deg,#ee3a3f,#d11a22);",
      "left:13%;width:15%;top:13.8%;height:10.4%;border-radius:3px;border:2px solid rgba(255,255,255,.92);",
      "left:32%;right:13%;top:15.2%;height:3%;background:rgba(255,255,255,.92);",
      "left:32%;right:13%;top:19.8%;height:4%;background:rgba(255,255,255,.96);",
      "left:8%;right:8%;top:77.5%;height:11%;border-radius:0 0 4px 4px;background:#0c0d0f;",
      "left:16%;right:16%;top:81.8%;height:2.6%;background:repeating-linear-gradient(90deg,rgba(255,255,255,.8) 0 2px,transparent 2px 4px);",
      "left:34%;right:34%;top:1.5%;height:2.4%;border-radius:0 0 2px 2px;background:#0d0e11;",
      ...arrowPieces(41, 90.8, 18, 5, 0.6),
    ],
  },
  n64: { stop: 0.4, wf: 0.7, ratio: 0.7, clip: "polygon(52% 0%, 62.3% 1%, 68.5% 2%, 73% 3%, 76.5% 4%, 82.5% 6%, 87.3% 8%, 92% 10%, 95.6% 12%, 97.6% 14%, 98.7% 16%, 100% 18.5%, 100% 95.4%, 99.9% 96.6%, 99.6% 97.7%, 99.1% 98.7%, 98.4% 99.4%, 97.6% 99.8%, 96.8% 100%, 3.2% 100%, 2.4% 99.8%, 1.6% 99.4%, 0.9% 98.7%, 0.4% 97.7%, 0.1% 96.6%, 0% 95.4%, 0% 18.5%, 1.3% 16%, 2.4% 14%, 4.4% 12%, 8% 10%, 12.7% 8%, 17.5% 6%, 23.5% 4%, 27% 3%, 31.5% 2%, 37.7% 1%, 48% 0%)", body: "linear-gradient(180deg,#b9babe,#84858a)", rad: 0, label: [25.9, 10.9, 25.6, 80.2], noOutline: true, radius: "50% 50% 4px 4px / 5.5% 5.5% 4px 4px", grip: false, extra: [
    // the two vertical lines (grooves) beside the label
    "left:20.2%;top:5%;width:0.8%;height:94%;background:linear-gradient(90deg,rgba(0,0,0,.38) 0 50%,rgba(255,255,255,.3) 50%);",
    "right:20.2%;top:5%;width:0.8%;height:94%;background:linear-gradient(90deg,rgba(0,0,0,.38) 0 50%,rgba(255,255,255,.3) 50%);",
    // a line in each lower corner: from the bottom edge up, then curving out to the side of the cartridge
    "left:0;top:71.4%;width:8.1%;height:28.6%;border-style:solid;border-color:rgba(0,0,0,.36);border-width:1.5px 1.5px 0 0;border-radius:0 18px 0 0;filter:drop-shadow(1px 1px 0 rgba(255,255,255,.3));",
    "right:0;top:71.4%;width:8.1%;height:28.6%;border-style:solid;border-color:rgba(0,0,0,.36);border-width:1.5px 0 0 1.5px;border-radius:18px 0 0 0;filter:drop-shadow(-1px 1px 0 rgba(255,255,255,.3));",
  ] },
  gba: { wf: 0.7, ratio: 0.59, clip: "polygon(0% 7.1%, 0.1% 5.3%, 0.6% 3.6%, 1.2% 2.1%, 2.1% 1%, 3.1% 0.2%, 4.2% 0%, 95.8% 0%, 96.9% 0.2%, 97.9% 1%, 98.8% 2.1%, 99.4% 3.6%, 99.9% 5.3%, 100% 7.1%, 100% 19.2%, 99.4% 20.3%, 96.8% 21.4%, 96.8% 94.2%, 96.7% 95.7%, 96.3% 97.1%, 95.8% 98.3%, 95.1% 99.2%, 94.3% 99.8%, 93.4% 100%, 6.6% 100%, 5.7% 99.8%, 4.9% 99.2%, 4.2% 98.3%, 3.7% 97.1%, 3.3% 95.7%, 3.2% 94.2%, 3.2% 21.4%, 0.6% 20.3%, 0% 19.2%)", body: "linear-gradient(180deg,#4a4c52,#26282d)", rad: 0, label: [13.5, 22.6, 12.5, 65], noOutline: true, grip: false, extra: [
    // the scooped lip at the top (a lens rising in the middle), lit along its upper edge
    `left:16%;top:3.1%;width:70%;height:13.6%;background:rgba(255,255,255,.13);${lensClip()}`,
    `left:16%;top:3.9%;width:70%;height:13.6%;background:linear-gradient(180deg,rgba(0,0,0,.66),rgba(0,0,0,.18));${lensClip()}`,
    ...arrowPieces(40.25, 91.3, 19.5, 6.1, 0.55),
  ] },
  gb: { wf: 0.58, ratio: 1.146, clip: "polygon(0% 1.9%, 0.2% 1.2%, 0.6% 0.6%, 1.4% 0.1%, 2.2% 0%, 90.8% 0%, 90.8% 3.9%, 91.5% 4.8%, 98.4% 4.8%, 100% 6.8%, 100% 97.4%, 99.9% 98.2%, 99.4% 98.9%, 98.8% 99.5%, 97.9% 99.9%, 97% 100%, 3% 100%, 2.1% 99.9%, 1.2% 99.5%, 0.6% 98.9%, 0.1% 98.2%, 0% 97.4%)", body: "linear-gradient(180deg,#aaa6b2,#7d7886)", rad: 0, label: [12.7, 29.1, 13.2, 57.3], strips: [9.1, 9.8], grip: false, extra: ["left:11.4%;top:6%;right:11%;height:15%;border-radius:999px;box-shadow:inset 0 0 0 1.5px rgba(0,0,0,.22),0 1px 0 rgba(255,255,255,.2);", "left:2%;top:6%;width:8%;height:15%;background:repeating-linear-gradient(180deg,rgba(0,0,0,.3) 0 1px,rgba(255,255,255,.18) 1px 2px,transparent 2px 4px);", "left:90%;top:6%;width:8%;height:15%;background:repeating-linear-gradient(180deg,rgba(0,0,0,.3) 0 1px,rgba(255,255,255,.18) 1px 2px,transparent 2px 4px);", ...arrowPieces(42.4, 89.4, 15.3, 7.6, 0.32)] },
  gbc: { wf: 0.58, ratio: 1.07, clip: "polygon(0% 3.9%, 0.2% 2.7%, 0.8% 1.6%, 1.7% 0.7%, 2.9% 0.2%, 4.2% 0%, 95.8% 0%, 97.1% 0.2%, 98.3% 0.7%, 99.2% 1.6%, 99.8% 2.7%, 100% 3.9%, 100% 98.1%, 99.9% 98.7%, 99.6% 99.2%, 99.2% 99.6%, 98.6% 99.9%, 98% 100%, 2% 100%, 1.4% 99.9%, 0.8% 99.6%, 0.4% 99.2%, 0.1% 98.7%, 0% 98.1%)", body: "linear-gradient(180deg,rgba(104,110,118,.58),rgba(30,33,38,.78))", rad: 0, label: [13, 29.5, 12.6, 61.2], strips: [10.6, 10.5], pins: [11, 12, 1.5, 6], grip: false, glass: true, under: ["left:6%;top:7%;right:6%;bottom:8%;border-radius:2px;background:linear-gradient(180deg,rgba(52,104,74,.9),rgba(24,60,42,.92));box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);", "left:6%;top:7%;right:6%;height:22.5%;background:repeating-linear-gradient(0deg,rgba(170,215,170,.11) 0 1px,transparent 1px 6px),repeating-linear-gradient(90deg,rgba(170,215,170,.08) 0 1px,transparent 1px 9px);", "left:51.4%;top:7.7%;width:24.4%;height:22.8%;border-radius:50%;background:rgba(8,28,18,.5);", "left:52.7%;top:8.9%;width:21.6%;height:20.2%;border-radius:50%;background:radial-gradient(circle at 42% 38%,rgba(216,220,224,.4),rgba(152,158,164,.36) 58%,rgba(98,104,110,.36));box-shadow:inset 0 0 0 2px rgba(255,255,255,.26),inset 0 0 0 4px rgba(0,0,0,.1);", "left:56.2%;top:12.2%;width:14.6%;height:13.6%;border-radius:50%;box-shadow:inset 0 0 0 1px rgba(255,255,255,.2);", "left:43%;top:18.2%;width:40%;height:4.4%;border-radius:1px;background:linear-gradient(180deg,rgba(218,222,226,.4),rgba(138,144,150,.36));", "left:22.4%;top:9.6%;width:15.2%;height:9%;background:repeating-linear-gradient(0deg,rgba(205,205,205,.5) 0 1px,transparent 1px 3px);", "left:24%;top:9%;width:12%;height:10%;border-radius:1px;background:linear-gradient(180deg,#2c2f36,#0d0e11);", "left:22%;top:21.8%;width:15%;height:4.4%;background:repeating-linear-gradient(90deg,rgba(205,205,205,.45) 0 1px,transparent 1px 3px);", "left:23%;top:22.3%;width:13%;height:3.4%;border-radius:1px;background:linear-gradient(180deg,#2c2f36,#0d0e11);", "left:40%;top:11%;width:6.5%;height:5%;border-radius:1px;background:linear-gradient(180deg,#2c2f36,#0d0e11);", "left:10%;top:14%;width:2.2%;height:2.1%;background:#b8923f;border-radius:1px;", "left:10%;top:19.5%;width:2.2%;height:2.1%;background:#b8923f;border-radius:1px;", "left:14.6%;top:14%;width:2.2%;height:2.1%;background:#b8923f;border-radius:1px;", "left:38.4%;top:21%;width:2.2%;height:2.1%;background:#b8923f;border-radius:1px;", "left:45.5%;top:25.4%;width:2.2%;height:2.1%;background:#b8923f;border-radius:1px;", "left:81.5%;top:13%;width:2.2%;height:2.1%;background:#b8923f;border-radius:1px;", "left:85%;top:18.2%;width:2.2%;height:2.1%;background:#b8923f;border-radius:1px;", "left:14.6%;top:24.5%;width:2.2%;height:2.1%;background:#b8923f;border-radius:1px;", "left:9%;right:10%;top:91%;height:7.5%;background:#15171b;"], extra: ["inset:0;background:linear-gradient(180deg,rgba(255,255,255,.2),rgba(255,255,255,0) 22%);"] },
  nes: { wf: 0.62, ratio: 1.16, clip: "polygon(0% 1.2%, 0.6% 0%, 3.6% 0%, 3.9% 0.9%, 9.2% 0.9%, 9.5% 0%, 91.1% 0%, 91.3% 1.1%, 95.2% 1.1%, 95.6% 0%, 99.4% 0%, 100% 1.2%, 100% 79.5%, 96.6% 80.7%, 95.2% 82.7%, 95.2% 100%, 4.8% 100%, 4.8% 82.7%, 3.4% 80.7%, 0% 79.5%)", body: "linear-gradient(180deg,#9a9ba0,#6a6b70)", rad: 0, label: [41.1, 0.8, 12.3, 66.1], noOutline: true, grip: false,
    // the strips run from the bottom box up into the boxed hole at the top of the cartridge
    ridges: [16.7, 1.2, 21.4, 88.5],
    under: ["left:16.7%;top:0;width:21.4%;height:13%;background:linear-gradient(180deg,rgba(10,9,12,.8),rgba(30,28,33,.6));box-shadow:inset 0 0 0 1px rgba(0,0,0,.35);"],
    extra: [
      // the box where the strips stop
      "left:15.8%;top:90.2%;width:22.3%;height:9.3%;border-radius:4px 4px 0 0;background:linear-gradient(180deg,rgba(255,255,255,.1),rgba(255,255,255,.02));box-shadow:inset 0 0 0 1px rgba(0,0,0,.3),inset 1px 1px 0 rgba(255,255,255,.15);",
      // the arrow: as far from the strips (to its left) as from the art (above it)
      ...arrowPieces(45.6, 73.3, 10.2, 7.4, 0.3),
    ] },
  snes: { stop: 0.4, wf: 0.72, ratio: 0.647, clip: "polygon(16.8% 0%, 83.2% 0%, 83.2% 0%, 83.6% 0.2%, 84% 0.7%, 84.1% 1.4%, 84.1% 4.2%, 97.6% 4.2%, 98.3% 4.4%, 99% 4.9%, 99.5% 5.7%, 99.9% 6.8%, 100% 7.9%, 100% 94.5%, 99.9% 95.6%, 99.5% 96.7%, 99% 97.5%, 98.3% 98%, 97.6% 98.2%, 84.1% 98.2%, 84.1% 100%, 15.9% 100%, 15.9% 98.2%, 2.4% 98.2%, 1.7% 98%, 1% 97.5%, 0.5% 96.7%, 0.1% 95.6%, 0% 94.5%, 0% 7.9%, 0.1% 6.8%, 0.5% 5.7%, 1% 4.9%, 1.7% 4.4%, 2.4% 4.2%, 15.9% 4.2%, 15.9% 1.4%, 16% 0.7%, 16.4% 0.2%, 16.8% 0%)", body: "linear-gradient(180deg,#b9babe,#84858a)", rad: 0, label: [18.4, 2, 17.5, 45], plate: { bg: "linear-gradient(180deg,#151518,#09090b)", win: [14.7, 1.6, 56.6, 81], parts: ["left:72.5%;right:0.4%;top:0;height:6%;background:linear-gradient(180deg,#ea343c,#cb2029);", "left:84%;top:19.5%;width:14.6%;height:43.5%;border-radius:1px;background:linear-gradient(180deg,#2b2c31,#222328);box-shadow:inset 0 0 0 1px rgba(255,255,255,.05);", "left:2.7%;top:15.2%;width:12%;height:6.4%;border-radius:2px;background:linear-gradient(180deg,#f4efef,#d8cfcf);box-shadow:inset 0 0 0 1px #d42a33;", "left:4.1%;top:29.5%;width:3.8%;height:5%;background:#b48ad2;clip-path:polygon(0 0,100% 0,50% 100%);", "left:3.9%;top:70%;width:9.6%;height:16%;border-radius:50%;background:radial-gradient(ellipse at 50% 45%,#ddd7b6 0 38%,#a9a27a 40% 58%,#eee9cb 60% 76%,#7c7656 80%);", "left:3.1%;width:12.6%;top:90.8%;height:3.2%;background:radial-gradient(closest-side,rgba(255,255,255,.92) 0 85%,transparent 100%) 0 0/3px 100% round;", "left:3.1%;width:13.8%;top:95.4%;height:3.2%;background:radial-gradient(closest-side,rgba(255,255,255,.92) 0 85%,transparent 100%) 0 0/3px 100% round;", "left:74%;right:1.2%;top:86%;height:4%;background:#d8232e;", "left:74.6%;right:1.8%;top:94.6%;height:1.8%;background:#d8232e;"] }, grip: false, extra: ["left:0%;width:15.6%;top:19.2%;height:1.8%;background:linear-gradient(180deg,rgba(0,0,0,.38) 0 55%,rgba(255,255,255,.2) 55% 100%);", "left:0%;width:15.6%;top:34.8%;height:1.8%;background:linear-gradient(180deg,rgba(0,0,0,.38) 0 55%,rgba(255,255,255,.2) 55% 100%);", "left:0%;width:15.6%;top:50.5%;height:1.8%;background:linear-gradient(180deg,rgba(0,0,0,.38) 0 55%,rgba(255,255,255,.2) 55% 100%);", "left:0%;width:15.6%;top:66.4%;height:1.8%;background:linear-gradient(180deg,rgba(0,0,0,.38) 0 55%,rgba(255,255,255,.2) 55% 100%);", "left:0%;width:15.6%;top:82.4%;height:1.8%;background:linear-gradient(180deg,rgba(0,0,0,.38) 0 55%,rgba(255,255,255,.2) 55% 100%);", "left:84.4%;width:15.6%;top:19.2%;height:1.8%;background:linear-gradient(180deg,rgba(0,0,0,.38) 0 55%,rgba(255,255,255,.2) 55% 100%);", "left:84.4%;width:15.6%;top:34.8%;height:1.8%;background:linear-gradient(180deg,rgba(0,0,0,.38) 0 55%,rgba(255,255,255,.2) 55% 100%);", "left:84.4%;width:15.6%;top:50.5%;height:1.8%;background:linear-gradient(180deg,rgba(0,0,0,.38) 0 55%,rgba(255,255,255,.2) 55% 100%);", "left:84.4%;width:15.6%;top:66.4%;height:1.8%;background:linear-gradient(180deg,rgba(0,0,0,.38) 0 55%,rgba(255,255,255,.2) 55% 100%);", "left:84.4%;width:15.6%;top:82.4%;height:1.8%;background:linear-gradient(180deg,rgba(0,0,0,.38) 0 55%,rgba(255,255,255,.2) 55% 100%);", "left:19%;top:60.7%;width:63%;height:7%;border-radius:4px;background:linear-gradient(180deg,rgba(0,0,0,.55),rgba(0,0,0,.3));box-shadow:inset 0 1px 2px rgba(0,0,0,.6),0 1px 0 rgba(255,255,255,.18);", "left:41%;top:60.7%;width:18%;height:7%;background:rgba(0,0,0,.38);"] },
  ds: { wf: 0.36, ratio: 1.06, clip: "polygon(0% 4.3%,4.6% 0%,95.4% 0%,100% 4.3%,100% 95.7%,95.4% 100%,16.00% 100.00%,14.21% 99.91%,12.44% 99.62%,10.72% 99.15%,9.06% 98.51%,7.49% 97.69%,6.02% 96.71%,4.69% 95.58%,3.49% 94.32%,2.45% 92.94%,1.58% 91.45%,0.90% 89.89%,0.40% 88.26%,0.10% 86.60%,0.00% 84.91%)", body: "linear-gradient(180deg,#4a4c52,#26282d)", rad: 0, label: [11, 8.6, 11, 82.2], slant: 6, bands: [17.5, 11.7], notch: 1.5, logo: "ds", barcode: "right", grip: false, extra: arrowPieces(45, 93.2, 10, 4.2, 0.35) },
  ds3: { wf: 0.38, ratio: 1.0042, clip: "polygon(0 0, 100% 0, 100% 15%, 93% 24%, 93% 100%, 10.00% 100.00%, 8.88% 99.94%, 7.77% 99.75%, 6.70% 99.44%, 5.66% 99.01%, 4.68% 98.47%, 3.77% 97.83%, 2.93% 97.08%, 2.18% 96.25%, 1.53% 95.34%, 0.99% 94.36%, 0.56% 93.33%, 0.25% 92.26%, 0.06% 91.16%, 0.00% 90.04%)", body: "linear-gradient(180deg,#d3d4d7,#9fa1a6)", rad: 6, label: [8.9, 9.6, 14.2, 81.1], slant: 6, bands: [17.7, 11.8], logo: "3ds", barcode: "center", grip: false, extra: arrowPieces(41.5, 93.2, 10, 4.2, 0.28) },
};

/** What is printed on a disc or cartridge besides the plain cover: the whole cover fitted on a blurred copy of itself,
 *  the game's logo on a dark ground, or nothing. Returns the layers to put inside the printed area (which clips them). */
// where the logo goes on a disc: the top part (the way it always was), or the bottom, left or right part (all clear of the hub)
const DISC_LOGO_BOX: Record<LogoPos, string> = {
  top: "left:19%;right:19%;top:6%;height:32%;",
  bottom: "left:19%;right:19%;top:62%;height:32%;",
  left: "left:5%;width:28%;top:33%;height:34%;",
  right: "right:5%;width:28%;top:33%;height:34%;",
};
function artLayers(doc: Document, mode: InsertArt, art: string, logo: string, disc: boolean, logoPos: LogoPos = "top"): HTMLElement[] {
  const out: HTMLElement[] = [];
  if (mode === "none" || mode === "cover") return out;
  const u = (v: string) => `url(${JSON.stringify(v)})`;
  if (mode === "logo" && logo) {
    const pos = disc ? DISC_LOGO_BOX[logoPos] || DISC_LOGO_BOX.top : "left:8%;right:8%;top:10%;bottom:10%;";
    out.push(box(doc, `${pos}background:${u(logo)} center/contain no-repeat;filter:drop-shadow(0 1px 2px rgba(0,0,0,.6));`));
    return out;
  }
  if (!art) return out;
  out.push(box(doc, `inset:-14%;background:${u(art)} center/cover no-repeat;filter:blur(8px) brightness(.75);`));
  out.push(box(doc, `${disc ? "left:8%;right:8%;top:8%;bottom:8%;" : "inset:0;"}background:${u(art)} center/contain no-repeat;`));
  return out;
}

/** Loads all addresses at once and calls back with the best one that loads (the earlier in the list the better), or "" */
function loadBest(view: any, urls: string[], ok: (im: HTMLImageElement) => boolean, ms: number, cb: (u: string) => void): void {
  if (!urls.length) { cb(""); return; }
  const done: boolean[] = [], good: boolean[] = [];
  let settled = false;
  const decide = (force: boolean) => {
    if (settled) return;
    for (let i = 0; i < urls.length; i++) {
      if (good[i]) { settled = true; cb(urls[i]); return; }
      if (!done[i] && !force) return; // a better one may still come
    }
    if (force || done.filter(Boolean).length === urls.length) { settled = true; cb(""); }
  };
  urls.forEach((u, i) => {
    const im = new view.Image();
    im.onload = () => { done[i] = true; good[i] = ok(im); decide(false); };
    im.onerror = () => { done[i] = true; decide(false); };
    im.src = u;
  });
  setTimeout(() => decide(true), ms);
}
const TEAR_MS = 700;   // extra time a shrink-wrap tear adds
const TEAR_AT = 519;   // the timeline is pushed back from here (the case has flown in, the cover is still closed)

function box(doc: Document, css: string): HTMLElement {
  const e = doc.createElement("div");
  e.style.cssText = "position:absolute;box-sizing:border-box;" + css;
  return e;
}

// Case and disc sounds, made on the spot with Web Audio (no sound files): plastic clicks, the disc lifting,
// the slide into the slot, the drive spinning up and the final clunk. Times are in ms from the start.
export function insertSounds(view: Window, card: boolean, volume: number, mode: "insert" | "eject" = "insert", warp0: (ms: number) => number = (ms) => ms, speed = 1): void {
  const warp = (ms: number) => warp0(ms) / speed; // the timeline in real time, at this speed
  try {
    const AC: any = (view as any).AudioContext || (view as any).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    if (ctx.state === "suspended" && ctx.resume) ctx.resume();
    const master = ctx.createGain(); master.gain.value = Math.max(0, Math.min(1, volume)); master.connect(ctx.destination);
    const t0 = ctx.currentTime + 0.03;
    const noise = (len: number) => { const b = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * len), ctx.sampleRate); const ch = b.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1; return b; };
    // short filtered noise burst: plastic click / snap
    const click = (ms: number, freq: number, len: number, gain: number, q = 2) => {
      const s = ctx.createBufferSource(); s.buffer = noise(len);
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q;
      const g = ctx.createGain(); const at = t0 + warp(ms) / 1000;
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(gain, at + 0.002); g.gain.exponentialRampToValueAtTime(0.0008, at + len);
      s.connect(f); f.connect(g); g.connect(master); s.start(at); s.stop(at + len + 0.02);
    };
    // low body thump
    const thump = (ms: number, freq: number, len: number, gain: number) => {
      const o = ctx.createOscillator(); o.type = "sine"; const g = ctx.createGain(); const at = t0 + warp(ms) / 1000;
      o.frequency.setValueAtTime(freq * 1.6, at); o.frequency.exponentialRampToValueAtTime(freq, at + len * 0.6);
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(gain, at + 0.004); g.gain.exponentialRampToValueAtTime(0.0008, at + len);
      o.connect(g); g.connect(master); o.start(at); o.stop(at + len + 0.02);
    };
    // sliding: noise swept through a filter
    const slide = (ms: number, len: number, f1: number, f2: number, gain: number) => {
      const s = ctx.createBufferSource(); s.buffer = noise(len);
      const f = ctx.createBiquadFilter(); f.type = "bandpass"; f.Q.value = 1.2; const at = t0 + warp(ms) / 1000;
      f.frequency.setValueAtTime(f1, at); f.frequency.exponentialRampToValueAtTime(f2, at + len);
      const g = ctx.createGain(); g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(gain, at + len * 0.3); g.gain.exponentialRampToValueAtTime(0.0008, at + len);
      s.connect(f); f.connect(g); g.connect(master); s.start(at); s.stop(at + len + 0.02);
    };
    // drive motor spinning up
    const motor = (ms: number, len: number, gain: number) => {
      const o = ctx.createOscillator(); o.type = "sawtooth"; const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900;
      const g = ctx.createGain(); const at = t0 + warp(ms) / 1000;
      o.frequency.setValueAtTime(70, at); o.frequency.exponentialRampToValueAtTime(240, at + len);
      g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(gain, at + len * 0.35); g.gain.exponentialRampToValueAtTime(0.0008, at + len);
      o.connect(lp); lp.connect(g); g.connect(master); o.start(at); o.stop(at + len + 0.02);
    };
    if (mode === "eject") {
      // the reverse: case opens, the drive spins down and pushes the disc out, it drops into the tray, the case shuts
      const spinDown = (ms: number, len: number, gain: number) => {
        const o = ctx.createOscillator(); o.type = "sawtooth"; const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900;
        const g = ctx.createGain(); const at = t0 + warp(ms) / 1000;
        o.frequency.setValueAtTime(240, at); o.frequency.exponentialRampToValueAtTime(60, at + len);
        g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(gain, at + 0.05); g.gain.exponentialRampToValueAtTime(0.0008, at + len);
        o.connect(lp); lp.connect(g); g.connect(master); o.start(at); o.stop(at + len + 0.02);
      };
      click(330, 3200, 0.03, 0.5); thump(350, 140, 0.08, 0.22);
      if (!card) spinDown(420, 0.45, 0.05);
      click(600, 2200, 0.04, 0.45, 3); thump(610, 110, 0.1, 0.4);
      slide(620, 0.3, 2600, 900, card ? 0.35 : 0.28);
      if (card) { click(1300, 4200, 0.025, 0.4); } else { click(1290, 3600, 0.03, 0.3); click(1310, 5200, 0.02, 0.35); }
      click(1820, 2800, 0.035, 0.55); thump(1840, 160, 0.08, 0.3);
      view.setTimeout(() => { try { ctx.close(); } catch (e) { /* ignore */ } }, Math.round(3200 / speed) + 200);
      return;
    }
    // case: hinge unlatches, cover opens and taps open
    click(380, 3200, 0.03, 0.55); thump(400, 140, 0.08, 0.25);
    click(880, 2400, 0.04, 0.35);
    // disc / card lifts off the hub
    if (card) { click(900, 4200, 0.025, 0.4); } else { click(890, 5200, 0.02, 0.35); click(915, 3600, 0.03, 0.3); }
    // into the slot: slide, (disc) motor spin-up, clunk
    slide(1320, 0.3, 900, 2600, card ? 0.35 : 0.28);
    if (card) { click(1575, 1800, 0.05, 0.6, 3); thump(1580, 110, 0.12, 0.5); }
    else { thump(1585, 95, 0.14, 0.5); click(1580, 2200, 0.04, 0.45, 3); motor(1600, 0.55, 0.06); }
    // case snaps shut
    click(1850, 2800, 0.035, 0.5); thump(1855, 160, 0.07, 0.25);
    // a sealed game: the shrink-wrap crinkles and rips first. The rest of the timeline is pushed back for it, so these
    // use real time (the tear runs from 540 to about 1150 ms).
    if (warp0(519) !== 519) {
      const burst = (ms: number, len: number, freq: number, gain: number, kind: BiquadFilterType) => {
        const b = ctx.createBufferSource(); b.buffer = noise(len);
        const f = ctx.createBiquadFilter(); f.type = kind; f.frequency.value = freq; f.Q.value = 3;
        const g = ctx.createGain(); const at = t0 + ms / speed / 1000;
        g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(gain, at + 0.004); g.gain.exponentialRampToValueAtTime(0.0008, at + len);
        b.connect(f); f.connect(g); g.connect(master); b.start(at); b.stop(at + len + 0.02);
      };
      for (let k = 0; k < 7; k++) burst(540 + k * 34 + Math.random() * 18, 0.014, 5200 + Math.random() * 2600, 0.2, "bandpass"); // crinkle as it is gripped
      burst(800, 0.28, 2600, 0.38, "highpass");                                                                                  // the rip
      for (let k = 0; k < 5; k++) burst(900 + k * 45 + Math.random() * 20, 0.012, 6000 + Math.random() * 2000, 0.14, "bandpass"); // the pieces fly off
    }
    view.setTimeout(() => { try { ctx.close(); } catch (e) { /* ignore */ } }, Math.round(3200 / speed) + 200);
  } catch (e) { /* no sound is fine */ }
}

/** The first color in a css value (a hex color, rgb(), rgba(), hsl() or hsla(), also inside a gradient) as hue, saturation, lightness. */
export function cssToHsl(css: string): HslColor | null {
  const m = /#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3})\b|(rgba?|hsla?)\(([^)]*)\)/i.exec(css || "");
  if (!m) return null;
  let r = 0, g = 0, b = 0;
  if (m[1]) {
    let h = m[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16);
  } else {
    const v = m[3].split(/[\s,\/]+/).filter(Boolean).map((x) => parseFloat(x));
    if (v.length < 3 || v.some((x) => !isFinite(x))) return null;
    if (/^hsl/i.test(m[2])) {
      const hh = ((v[0] % 360) + 360) % 360, ss = v[1] / 100, ll = v[2] / 100;
      return { h: Math.round(hh), s: Math.round(Math.min(100, Math.max(0, ss * 100))), l: Math.round(Math.min(94, Math.max(4, ll * 100))) };
    }
    r = v[0]; g = v[1]; b = v[2];
  }
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  let h = 0, s = 0;
  if (d > 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = Math.round(((h * 60) + 360) % 360);
  }
  return { h, s: Math.round(s * 100), l: Math.round(Math.min(94, Math.max(4, l * 100))) };
}

/** The color a disc or cartridge has when nothing sets one: the console's own plastic of a cartridge, or the printed color of a disc.
 *  Used as the starting point of the color sliders. */
export function autoMediaColor(shapeId: ShapeId, pal: Pal): HslColor {
  const kind = CART_OF[shapeId];
  const c = kind ? cssToHsl(CART[kind].body) : cssToHsl(pal.a);
  return c || { h: 220, s: 10, l: 40 };
}

/** The color of a look's disc or cartridge as drawn: the one set for it, else the console's own. */
export function mediaColorOf(look: Look): HslColor {
  return look.media || autoMediaColor(look.shapeId, look.pal);
}

export function wearCss(w: WearId): string { return WEAR_CSS[w]; }

/** The art window of a cartridge when no color is set for it: black (a dark backdrop), or white, or the cartridge's own color. */
const WINDOW_DARK = "linear-gradient(160deg,#2c313b,#0d0f13)";
const WINDOW_WHITE = "linear-gradient(160deg,#fbfbfa,#cfd2d8)";
export function autoWindowColor(): HslColor { return cssToHsl(WINDOW_DARK) || { h: 220, s: 15, l: 20 }; }
export function whiteWindowColor(): HslColor { return cssToHsl(WINDOW_WHITE) || { h: 0, s: 0, l: 94 }; }

/** What goes into the media builder: the case's shape (decides disc or which cartridge), its palette and the color of the disc or cartridge. */
export interface MediaIn { shapeId: ShapeId; pal: Pal; media: HslColor | null; window?: HslColor | null /* cartridges: the art window's color (none = by windowMode) */; windowMode?: "black" | "white" | "match"; artCss: string /* a css background image: url(...) or a gradient */; artUrl: string; logo: string; artMode: InsertArt; logoPos?: LogoPos /* discs: where the logo sits */; artY?: number /* Cover (Fill): the cover moved down (+) or up (-), -50 to 50 */ }

/** The shape of what goes in the case: a disc (round) or a cartridge, as a share of the case width and as height / width. */
export function mediaGeom(shapeId: ShapeId): { card: boolean; wf: number; ratio: number; discK: number } {
  const kind = CART_OF[shapeId];
  const spec = kind ? CART[kind] : null;
  if (spec) return { card: true, wf: spec.wf, ratio: spec.ratio, discK: 1 };
  return { card: false, wf: 0.76 * (shapeId === "gc" ? 0.667 : 1), ratio: 1, discK: shapeId === "gc" ? 0.667 : 1 }; // a GameCube mini disc is 8 cm, a normal disc 12 cm
}

/** A disc or cartridge printed with the game's art, filling its box (position:absolute; inset:0). Used by the insert animation
 *  and by the still previews in Looks, colors and presets. */
export function buildMedia(doc: Document, o: MediaIn): { el: HTMLElement; spin: HTMLElement | null } {
  const pal = o.pal, artMode = o.artMode;
  // Cover (Fill): the cover is centered by default; "Adjust Art Vertically" moves it down (+) or up (-) within the room the picture has
  const coverPos = `50% ${50 - Math.max(ART_Y_MIN, Math.min(ART_Y_MAX, o.artY || 0))}%`;
  const cartKind = CART_OF[o.shapeId];
  const spec: CartSpec | null = cartKind ? CART[cartKind] : null;
  const shade = (c: HslColor) => `linear-gradient(160deg, hsl(${c.h}, ${c.s}%, ${Math.min(94, c.l + 10)}%), hsl(${c.h}, ${c.s}%, ${Math.max(4, c.l - 16)}%))`;
  // what shows behind the logo (or the whole cover, or when nothing is printed): a disc is one color, so the print simply goes over it;
  // a cartridge has an art window of its own: the color set for it, else a dark backdrop, or the cartridge's own color (the global choice)
  const printBg = spec
    ? (o.window ? shade(o.window) : o.windowMode === "match" ? shade(o.media || autoMediaColor(o.shapeId, pal)) : o.windowMode === "white" ? WINDOW_WHITE : WINDOW_DARK)
    : o.media ? shade(o.media)
    : artMode === "logo" && o.logo ? "linear-gradient(160deg,#2c313b,#0d0f13)" : `linear-gradient(160deg, ${pal.a}, ${pal.b})`;
  const el = box(doc, "inset:0;");
  if (spec) {
    // the plastic: the console's own color, or the color set for this game / collection
    const cc = o.media;
    const al = spec.glass ? [0.62, 0.8] : [1, 1]; // see-through plastic keeps some of what is behind it
    const plastic = cc ? `linear-gradient(180deg,hsla(${cc.h},${cc.s}%,${Math.min(94, cc.l + 10)}%,${al[0]}),hsla(${cc.h},${cc.s}%,${Math.max(4, cc.l - 16)}%,${al[1]}))` : spec.body;
    const c = box(doc, `inset:0;border-radius:${spec.rad}px;clip-path:${spec.clip};background:${plastic};box-shadow:inset 0 0 0 2px rgba(255,255,255,.18);`);
    (spec.under || []).forEach((u) => c.appendChild(box(doc, u)));
    const [ll, lt, lr, lh] = spec.label;
    const print = artMode === "cover" ? `background:${o.artCss} ${coverPos}/cover no-repeat;` : `overflow:hidden;background:${printBg};`;
    // the label's lower left corner can be cut off at a slant (DS, 3DS); a clip also cuts the white edge, so that is drawn as a piece of its own
    let cut = "";
    if (spec.slant) {
      const cx = spec.slant / (100 - ll - lr) * 100, cy = spec.slant / (lh * spec.ratio) * 100;
      cut = `clip-path:polygon(0 0,100% 0,100% 100%,${cx.toFixed(1)}% 100%,0 ${(100 - cy).toFixed(1)}%);`;
      if (!spec.noOutline && !spec.bands) c.appendChild(box(doc, `left:calc(${ll}% - 2px);top:calc(${lt}% - 2px);right:calc(${lr}% - 2px);height:calc(${lh}% + 4px);border-radius:6px;background:rgba(255,255,255,.85);${cut}`));
    }
    const edge = spec.noOutline || spec.slant ? "" : "box-shadow:0 0 0 2px rgba(255,255,255,.85);";
    let lab: HTMLElement;
    let sheet: HTMLElement | null = null; // when the label is made of several pieces: the piece that goes on the cartridge (the art window sits on it)
    if (spec.plate) {
      // a label printed around the art (the SNES's black "U"): the ground with its printed pieces, the art window on top
      const [wl, wt, ww, wh] = spec.plate.win;
      sheet = box(doc, `left:${ll}%;top:${lt}%;right:${lr}%;height:${lh}%;border-radius:2px;overflow:hidden;background:${spec.plate.bg};`);
      spec.plate.parts.forEach((u) => (sheet as HTMLElement).appendChild(box(doc, u)));
      lab = box(doc, `left:${wl}%;top:${wt}%;width:${ww}%;height:${wh}%;${print}`);
      sheet.appendChild(lab);
    } else if (spec.strips) {
      // a light sticker with a vertical strip on each side of the art, and a small black dot in the middle of each strip
      const [sl, sr] = spec.strips, lw = 100 - ll - lr;
      sheet = box(doc, `left:${ll}%;top:${lt}%;right:${lr}%;height:${lh}%;border-radius:4px;overflow:hidden;background:#e9ebef;box-shadow:0 0 0 1.5px rgba(0,0,0,.22);`);
      lab = box(doc, `left:${sl}%;right:${sr}%;top:0;bottom:0;${print}`);
      sheet.appendChild(lab);
      // the dot is round: its height in % of the sticker's height follows from its width in % of the sticker's width
      const dw = Math.min(sl, sr) * 0.36, dh = dw * lw / (lh * spec.ratio);
      // three dots on each strip: one in the middle, one above it and one below it
      for (const dy of [-2.4 * dh, 0, 2.4 * dh]) {
        sheet.appendChild(box(doc, `left:${sl / 2 - dw / 2}%;top:${50 + dy - dh / 2}%;width:${dw}%;height:${dh}%;border-radius:50%;background:#15161a;`));
        sheet.appendChild(box(doc, `right:${sr / 2 - dw / 2}%;top:${50 + dy - dh / 2}%;width:${dw}%;height:${dh}%;border-radius:50%;background:#15161a;`));
      }
    } else if (spec.bands) {
      // the label is a white sticker: a band over the top (with the console's logo), the art window, a band under it; the cut corner belongs to the sticker
      const lw = 100 - ll - lr, [bt, bb] = spec.bands;
      const aTop = lt + lh * bt / 100, aH = lh * (100 - bt - bb) / 100, n = spec.notch || 0;
      c.appendChild(box(doc, `left:${ll}%;top:${lt}%;right:${lr}%;height:${lh}%;border-radius:4px;background:#f6f6f3;${cut}`));
      const nPct = n ? (n / (aH + n) * 100).toFixed(1) : "0";
      const step = n ? `clip-path:polygon(0 ${nPct}%,36% ${nPct}%,39% 0,66% 0,69% ${nPct}%,100% ${nPct}%,100% 100%,0 100%);` : "";
      lab = box(doc, `left:${ll}%;top:${aTop - n}%;right:${lr}%;height:${aH + n}%;${print}${step}`);
      // the console's mark in the top band: one black line in the middle, a little bigger at its right end (where the logo grows into "DS" / "3DS");
      // on the 3DS the start of that bigger part is red, where the 3 is. Nothing else in the band.
      const bandH = lh * bt / 100, ink = "#23242a", mid = lt + bandH / 2 - bandH * 0.125; // raised: the thin line and the bigger part under it are centered in the band together
      if (spec.logo) {
        const x0 = ll + lw * 0.1, x1 = ll + lw * 0.9, xs = ll + lw * (spec.logo === "3ds" ? 0.5 : 0.58); // the thin part ends, the bigger part starts
        c.appendChild(box(doc, `left:${x0}%;width:${xs - x0}%;top:${mid - bandH * 0.045}%;height:${bandH * 0.09}%;background:${ink};`));
        c.appendChild(box(doc, `left:${xs}%;width:${x1 - xs}%;top:${mid - bandH * 0.045}%;height:${bandH * 0.34}%;border-radius:1px;background:${ink};`));
        if (spec.logo === "3ds") c.appendChild(box(doc, `left:${xs}%;width:${(x1 - xs) * 0.3}%;top:${mid - bandH * 0.045}%;height:${bandH * 0.34}%;border-radius:1px;background:#d9262c;`));
      }
      // the number of the cartridge, as dashes in the bottom band
      if (spec.barcode) {
        const bt0 = lt + lh * (100 - bb) / 100, bh = lh * bb / 100;
        const pos = spec.barcode === "right" ? `right:${lr + lw * 0.07}%;width:${lw * 0.42}%;` : `left:${ll + lw * 0.2}%;width:${lw * 0.6}%;`;
        c.appendChild(box(doc, `${pos}top:${bt0 + bh * 0.3}%;height:${bh * 0.4}%;background:repeating-linear-gradient(90deg,${ink} 0 2px,transparent 2px 4px);`));
      }
    } else {
      lab = box(doc, `left:${ll}%;top:${lt}%;right:${lr}%;height:${lh}%;border-radius:${spec.radius || (spec.noOutline ? 1 : 4) + "px"};${print}${edge}${cut}`);
    }
    artLayers(doc, artMode, o.artUrl, o.logo, false).forEach((k) => lab.appendChild(k));
    c.appendChild(sheet || lab);
    if (spec.grip) c.appendChild(box(doc, `left:${ll}%;right:${lr}%;top:${lt + lh + 3}%;height:12%;background:repeating-linear-gradient(0deg, rgba(0,0,0,.28) 0 1px, rgba(255,255,255,.12) 1px 2px, transparent 2px 5px);`));
    if (spec.ridges) { const [rl, rt, rw, rh] = spec.ridges; c.appendChild(box(doc, `left:${rl}%;top:${rt}%;width:${rw}%;height:${rh}%;background:repeating-linear-gradient(0deg, rgba(0,0,0,.34) 0 2px, rgba(255,255,255,.14) 2px 3px, transparent 3px 7px);`)); }
    (spec.extra || []).forEach((u) => c.appendChild(box(doc, u)));
    if (spec.pins) {
      const [pl, pr, pb, ph] = spec.pins;
      c.appendChild(box(doc, `left:${pl}%;right:${pr}%;bottom:${pb}%;height:${ph}%;background:repeating-linear-gradient(90deg,#e0bf55 0 3px,#8a6d1c 3px 4px,transparent 4px 7px);border-radius:2px;`));
    }
    c.appendChild(box(doc, `inset:0;border-radius:${spec.rad}px;clip-path:${spec.clip};background:linear-gradient(120deg, rgba(255,255,255,.28), rgba(255,255,255,0) 40%);`));
    el.appendChild(c);
    return { el, spin: null };
  }
  const hole = "radial-gradient(circle, transparent 0 6.2%, #000 6.6%)";
  const discArt = artMode === "cover" ? `background:${o.artCss} ${coverPos}/cover no-repeat, ${o.media ? hslCss(o.media) : pal.b};` : `overflow:hidden;background:${printBg};`;
  const spin = box(doc, `inset:0;border-radius:50%;${discArt}-webkit-mask:${hole};mask:${hole};`);
  artLayers(doc, artMode, o.artUrl, o.logo, true, o.logoPos).forEach((k) => spin.appendChild(k));
  // the hub ring (clear plastic, or the disc's own color) and the outer rim (they spin with the print)
  const hub = o.media ? `hsla(${o.media.h}, ${o.media.s}%, ${o.media.l}%, .92)` : "rgba(230,236,245,.62)";
  spin.appendChild(box(doc, `inset:0;border-radius:50%;background:radial-gradient(circle, transparent 0 6.4%, ${hub} 6.8% 15.2%, rgba(255,255,255,.95) 15.5% 16.1%, rgba(0,0,0,.25) 16.4% 17%, transparent 17.4% 95.6%, rgba(255,255,255,.7) 96.2% 97.4%, rgba(0,0,0,.45) 98%);`));
  el.appendChild(spin);
  // light on the disc stays still while it spins (plain alpha: blend modes would flatten the 3D case)
  el.appendChild(box(doc, `inset:0;border-radius:50%;-webkit-mask:${hole};mask:${hole};background:conic-gradient(from 40deg, rgba(255,255,255,0) 0, rgba(255,255,255,.30) 6%, rgba(160,220,255,.14) 11%, rgba(255,255,255,0) 17%, rgba(255,255,255,0) 50%, rgba(255,255,255,.26) 56%, rgba(255,190,240,.12) 61%, rgba(255,255,255,0) 67%);`));
  return { el, spin };
}

export function runInsert(doc: Document, src: InsertSrc, target: "handheld" | "console", sound = true, opts: InsertOpts = {}): boolean {
  const view = doc.defaultView;
  if (!view || !doc.body || typeof (doc.body as any).animate !== "function") return false;
  const old = doc.getElementById("sanso-insert");
  if (old) old.remove(); // a newer launch replaces one still playing
  const W = view.innerWidth, H = view.innerHeight;
  if (W < 200 || H < 200) return false; // the window is not laid out yet (e.g. Steam coming back after a game): try again later
  const variant = target;
  const L = src.look, pal = L.pal;
  const art = src.art ? `url(${JSON.stringify(src.art)})` : `linear-gradient(160deg, ${pal.a}, ${pal.b})`;
  const cartKind = CART_OF[L.shapeId];
  const spec: CartSpec | null = cartKind ? CART[cartKind] : null;
  const card = !!spec;
  const speed = Math.max(0.25, Math.min(4, opts.speed || 1));
  // what is printed on the disc / cartridge (the logo falls back to the fitted cover when the game has none)
  const artMode: InsertArt = opts.artMode === "logo" && !src.logo ? "fit" : (opts.artMode || "cover");
  const rad = Math.max(3, L.shape.radius + 2);

  // final size and place of the case: big and centered a little to the right, so the cover can swing open to the left
  const ch = Math.round(Math.min(H * 0.56, W * 0.42 * 1.5)), cw = Math.round(ch / 1.5);
  const cx = Math.round(W * 0.56 - cw / 2), cy = Math.round(H * 0.42 - ch / 2);
  const d = Math.max(10, Math.round(cw * (card ? 0.06 : 0.1)));
  // where it starts: the cover on screen, or a little smaller in the same place
  const r0 = src.rect && src.rect.width > 30 && src.rect.top < H && src.rect.top + src.rect.height > 0 ? src.rect : null;
  const s0 = r0 ? r0.width / cw : 0.82;
  const x0 = r0 ? r0.left + r0.width / 2 - (cx + cw / 2) : 0, y0 = r0 ? r0.top + r0.height / 2 - (cy + ch / 2) : 30;

  const root = box(doc, `position:fixed;left:0;top:0;width:${W}px;height:${H}px;z-index:2147483000;pointer-events:none;overflow:hidden;perspective:1500px;perspective-origin:50% 38%;`);
  root.id = "sanso-insert";
  // nearly opaque: Steam's launch screen (the big game logo) is only revealed once the case has played
  const shade = box(doc, `inset:0;background:radial-gradient(120% 95% at 55% 40%, rgb(16,21,32), rgb(3,4,8));opacity:0;`);
  root.appendChild(shade);

  // soft light behind the case in the game's color
  const glow = box(doc, `left:${Math.round(cx - cw * 0.9)}px;top:${Math.round(cy - ch * 0.35)}px;width:${Math.round(cw * 2.8)}px;height:${Math.round(ch * 1.7)}px;border-radius:50%;background:radial-gradient(closest-side, ${pal.a}, transparent);opacity:0;filter:blur(30px);`);
  root.appendChild(glow);
  // ---- the case ----
  const wrap = box(doc, `left:${cx}px;top:${cy}px;width:${cw}px;height:${ch}px;perspective:1400px;perspective-origin:50% 35%;`);
  // contact shadow on the "floor" under the case
  const floor = box(doc, `left:-8%;right:-8%;bottom:-9%;height:12%;border-radius:50%;background:radial-gradient(closest-side, rgba(0,0,0,.7), rgba(0,0,0,0));`);
  wrap.appendChild(floor);
  const stage = box(doc, `inset:0;transform-style:preserve-3d;`);
  wrap.appendChild(stage);
  const shell = `linear-gradient(135deg, rgba(255,255,255,.10), rgba(0,0,0,.25)), ${pal.b}`;
  stage.appendChild(box(doc, `inset:0;border-radius:${rad}px;background:${shell};transform:translateZ(-${d}px);box-shadow:0 30px 60px rgba(0,0,0,.55);`));
  const discK = L.shapeId === "gc" ? 0.667 : 1; // a GameCube mini disc is 8 cm, a normal disc 12 cm
  // inside: dark plastic tray with the hub (or a card slot)
  const tray = card
    ? `linear-gradient(180deg, rgba(255,255,255,.05), rgba(0,0,0,.2)), repeating-linear-gradient(90deg, rgba(255,255,255,.025) 0 2px, transparent 2px 6px), #15171c`
    : `radial-gradient(circle at 50% 50%, #3d424b 0 4.5%, #0b0c0f 5% 6.5%, #2c3038 7% 10.5%, #121418 11% ${(42 * discK).toFixed(1)}%, rgba(255,255,255,.07) ${(42.6 * discK).toFixed(1)}% ${(43.4 * discK).toFixed(1)}%, #14161b ${(44 * discK).toFixed(1)}% 100%)`;
  stage.appendChild(box(doc, `left:4%;top:3%;right:4%;bottom:3%;border-radius:${Math.max(2, rad - 2)}px;background:${tray};transform:translateZ(-${d - 2}px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.06), inset 0 8px 18px rgba(0,0,0,.5);`));
  if (spec) {
    // a recess in the tray a little bigger than the cartridge
    const rw = Math.round(cw * spec.wf * 1.08), rh = Math.round(cw * spec.wf * spec.ratio * 1.08);
    stage.appendChild(box(doc, `left:${Math.round(cw / 2 - rw / 2)}px;top:${Math.round(ch * 0.36 - rh / 2)}px;width:${rw}px;height:${rh}px;border-radius:6px;background:rgba(0,0,0,.55);box-shadow:inset 0 0 0 2px rgba(255,255,255,.07);transform:translateZ(-${d - 3}px);`));
  }
  // walls: spine (left, hinge side), top, bottom, right
  stage.appendChild(box(doc, `top:0;bottom:0;left:0;width:${d}px;transform-origin:left center;transform:rotateY(90deg);background:linear-gradient(90deg, ${pal.a}, ${pal.b});`));
  stage.appendChild(box(doc, `top:0;bottom:0;right:0;width:${d}px;transform-origin:right center;transform:rotateY(-90deg);background:linear-gradient(270deg, ${pal.b}, ${pal.a});`));
  stage.appendChild(box(doc, `left:0;right:0;top:0;height:${d}px;transform-origin:center top;transform:rotateX(-90deg);background:linear-gradient(0deg, ${pal.b}, ${pal.a});`));
  stage.appendChild(box(doc, `left:0;right:0;bottom:0;height:${d}px;transform-origin:center bottom;transform:rotateX(90deg);background:linear-gradient(180deg, ${pal.b}, #000);`));
  // the front cover swings open on the spine
  const cover = box(doc, `inset:0;transform-origin:left center;transform-style:preserve-3d;`);
  cover.appendChild(box(doc, `inset:0;border-radius:${rad}px;backface-visibility:hidden;background:${art} center/cover no-repeat, ${pal.b};box-shadow:inset 0 0 0 1px ${pal.line};`));
  cover.appendChild(box(doc, `inset:0;border-radius:${rad}px;backface-visibility:hidden;transform:translateZ(.6px);background:linear-gradient(90deg, rgba(0,0,0,.35) 0, rgba(255,255,255,.28) 1.6%, rgba(0,0,0,.15) 3.4%, transparent 7%), linear-gradient(115deg, rgba(255,255,255,.34), rgba(255,255,255,0) 32%, rgba(255,255,255,0) 62%, rgba(255,255,255,.12) 74%, transparent 76%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.3), inset 0 0 0 4px rgba(255,255,255,.08);`));
  // inside of the cover: the dark sleeve with the art showing faintly through, and the manual clips
  // a light sweep across the cover as the case turns towards you
  const glint = box(doc, `inset:0;border-radius:${rad}px;backface-visibility:hidden;transform:translateZ(.8px);overflow:hidden;`);
  const glintBar = box(doc, `top:-20%;bottom:-20%;left:-60%;width:45%;background:linear-gradient(100deg, transparent, rgba(255,255,255,.38), transparent);transform:skewX(-14deg);`);
  glint.appendChild(glintBar);
  cover.appendChild(glint);
  cover.appendChild(box(doc, `inset:0;border-radius:${rad}px;backface-visibility:hidden;transform:rotateY(180deg);background:linear-gradient(rgba(12,14,19,.84), rgba(12,14,19,.92)), ${art} center/cover no-repeat;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08);`));
  stage.appendChild(cover);
  root.appendChild(wrap);

  // ---- the disc / card (its own flat layer so the slot can hide it as it goes in) ----
  const handheld = variant !== "console";
  const slotY = H - 7, slotX = W - 7;
  const layer = box(doc, `inset:0;${handheld ? `clip-path:inset(0 0 ${H - slotY}px 0);` : `clip-path:inset(0 ${W - slotX}px 0 0);`}`);
  const D = Math.round(spec ? cw * spec.wf : cw * 0.76 * discK);
  const DH = spec ? Math.round(D * spec.ratio) : D;
  const dcx = cx + cw / 2, dcy = cy + ch * (card ? 0.36 : 0.5);
  const holder = box(doc, `left:${Math.round(dcx - D / 2)}px;top:${Math.round(dcy - DH / 2)}px;width:${D}px;height:${DH}px;opacity:0;will-change:transform,opacity;`);
  const shadow = box(doc, `left:6%;top:9%;width:88%;height:88%;border-radius:${card ? "10px" : "50%"};background:rgba(0,0,0,.55);filter:blur(10px);`);
  holder.appendChild(shadow);
  // the disc / card, printed with the game's art (built twice: one sits in the tray, one flies to the slot)
  const mediaIn: MediaIn = { shapeId: L.shapeId, pal, media: L.media, window: L.window, windowMode: L.windowMode, artCss: art, artUrl: src.art || "", logo: src.logo || "", artMode, logoPos: L.logoPos, artY: L.artY };
  const makeItem = () => buildMedia(doc, mediaIn);
  const flying = makeItem();
  holder.appendChild(flying.el);
  const spinner = flying.spin;
  // the copy that sits in the tray from the start, so the case is never empty when it opens
  const seated = makeItem();
  const seat = box(doc, `left:${Math.round(cw / 2 - D / 2)}px;top:${Math.round(ch * (card ? 0.36 : 0.5) - DH / 2)}px;width:${D}px;height:${DH}px;transform:translateZ(-${d - 3}px);`);
  seat.appendChild(seated.el);
  stage.appendChild(seat);
  layer.appendChild(holder);
  root.appendChild(layer);

  // ---- the slot ----
  const slot = handheld
    ? box(doc, `left:${Math.round(W / 2 - D * 0.62)}px;top:${slotY - 3}px;width:${Math.round(D * 1.24)}px;height:7px;border-radius:4px;background:linear-gradient(180deg,#000,#1b1e24);box-shadow:0 0 0 1px rgba(255,255,255,.16), 0 -1px 0 rgba(255,255,255,.25);opacity:0;`)
    : box(doc, `left:${slotX - 3}px;top:${Math.round(H / 2 - D * 0.62)}px;width:7px;height:${Math.round(D * 1.24)}px;border-radius:4px;background:linear-gradient(90deg,#000,#1b1e24);box-shadow:0 0 0 1px rgba(255,255,255,.16), -1px 0 0 rgba(255,255,255,.25);opacity:0;`);
  const bezel = handheld
    ? box(doc, `left:${Math.round(W / 2 - D * 0.8)}px;top:${slotY - 12}px;width:${Math.round(D * 1.6)}px;height:24px;border-radius:12px;background:linear-gradient(180deg, #2a2e36, #121418);box-shadow:inset 0 1px 0 rgba(255,255,255,.12), 0 6px 18px rgba(0,0,0,.6);opacity:0;`)
    : box(doc, `left:${slotX - 12}px;top:${Math.round(H / 2 - D * 0.8)}px;width:24px;height:${Math.round(D * 1.6)}px;border-radius:12px;background:linear-gradient(90deg, #2a2e36, #121418);box-shadow:inset 1px 0 0 rgba(255,255,255,.12), 0 6px 18px rgba(0,0,0,.6);opacity:0;`);
  const streak = box(doc, handheld
    ? `left:0;top:2px;width:30%;height:2px;border-radius:2px;background:linear-gradient(90deg, transparent, rgba(150,215,255,.95), transparent);opacity:0;`
    : `top:0;left:2px;height:30%;width:2px;border-radius:2px;background:linear-gradient(180deg, transparent, rgba(150,215,255,.95), transparent);opacity:0;`);
  slot.appendChild(streak);
  root.insertBefore(bezel, layer);
  root.appendChild(slot);
  doc.body.appendChild(root);

  // ---- timeline (ms) ----
  const fx: Animation[] = [];
  const A = (el: HTMLElement, kf: Keyframe[], o: KeyframeAnimationOptions) => { fx.push(el.animate(kf, { fill: "both", ...o })); };
  // fly in 0-420, open 380-900, disc shows 780, lifts 880-1060, travels 1060-1560, close 1520-1860, fade out to 2100
  const eject = !!opts.eject, tearing = !!opts.tear && !eject;
  const TEAR = tearing ? TEAR_MS : 0;
  const warp = (ms: number) => (ms < TEAR_AT ? ms : ms + TEAR);
  const T_END = 2200 + TEAR;
  const at = (ms: number) => Math.min(1, Math.max(0, warp(ms) / T_END));
  A(shade, [{ opacity: 0 }, { opacity: 1, offset: at(200) }, { opacity: 1, offset: at(1880) }, { opacity: 0 }], { duration: T_END, easing: "ease-in-out" });
  // seated copy hands over to the flying one at the same spot
  A(seat, [{ opacity: 1 }, { opacity: 1, offset: at(880) }, { opacity: 0, offset: at(881) }, { opacity: 0 }], { duration: T_END, easing: "linear" });
  const back = r0 ? `translate(${x0}px,${y0}px) scale(${s0})` : `translate(0,${Math.round(ch * 0.08)}px) scale(.88)`;
  A(glow, [{ opacity: 0 }, { opacity: 0.55, offset: at(500) }, { opacity: 0.4, offset: at(1500) }, { opacity: 0, offset: at(1900) }, { opacity: 0 }], { duration: T_END, easing: "ease-in-out" });
  // fly out with a little overshoot, settle, then go back where it came from
  A(wrap, [
    { transform: `translate(${x0}px,${y0}px) scale(${s0})`, opacity: 1, easing: "cubic-bezier(.2,.8,.3,1)" },
    { transform: "translate(0,-6px) scale(1.035)", opacity: 1, offset: at(360), easing: "cubic-bezier(.4,0,.3,1)" },
    { transform: "translate(0,0) scale(1)", opacity: 1, offset: at(520) },
    { transform: "translate(0,0) scale(1)", opacity: 1, offset: at(1640), easing: "cubic-bezier(.6,0,.4,1)" },
    { transform: back, opacity: 1, offset: at(1900), easing: "ease-in" },
    { transform: back, opacity: 0, offset: at(1990) },
    { transform: back, opacity: 0 },
  ], { duration: T_END });
  A(floor, [{ opacity: 0, transform: "scale(.6)" }, { opacity: 1, transform: "scale(1)", offset: at(420) }, { opacity: 1, transform: "scale(1)", offset: at(1640) }, { opacity: 0, transform: "scale(.7)", offset: at(1880) }, { opacity: 0 }], { duration: T_END, easing: "ease-out" });
  A(glintBar, [{ transform: "translateX(0) skewX(-14deg)" }, { transform: "translateX(0) skewX(-14deg)", offset: at(80) }, { transform: `translateX(${Math.round(cw * 2.6)}px) skewX(-14deg)`, offset: at(560) }, { transform: `translateX(${Math.round(cw * 2.6)}px) skewX(-14deg)` }], { duration: T_END, easing: "cubic-bezier(.4,0,.2,1)" });
  A(stage, [
    { transform: "rotateX(0deg) rotateY(0deg)", easing: "cubic-bezier(.2,.8,.3,1)" },
    { transform: "rotateX(8deg) rotateY(-22deg)", offset: at(480), easing: "ease-in-out" },
    { transform: "rotateX(6deg) rotateY(-14deg)", offset: at(1500), easing: "ease-in-out" },
    { transform: "rotateX(5deg) rotateY(-10deg)", offset: at(1830), easing: "ease-out" },
    { transform: "rotateX(3deg) rotateY(-12deg)", offset: at(1870), easing: "ease-in-out" }, // little bump when the cover snaps shut
    { transform: "rotateX(0deg) rotateY(0deg)" },
  ], { duration: T_END });
  // the cover swings open, overshoots the hinge stop a touch and settles; later it snaps shut
  A(cover, [
    { transform: "rotateY(0deg)" },
    { transform: "rotateY(0deg)", offset: at(tearing ? 520 : 380), easing: "cubic-bezier(.5,0,.3,1)" },
    { transform: "rotateY(-168deg)", offset: at(860), easing: "ease-in-out" },
    { transform: "rotateY(-157deg)", offset: at(960), easing: "ease-in-out" },
    { transform: "rotateY(-160deg)", offset: at(1040) },
    { transform: "rotateY(-160deg)", offset: at(1520), easing: "cubic-bezier(.55,0,.85,.35)" },
    { transform: "rotateY(0deg)", offset: at(1830) },
    { transform: "rotateY(0deg)" },
  ], { duration: T_END });
  // the disc / card: lifts out with a small wobble, swings along an arc, turns edge-on and is pulled into the slot
  // the NES, SNES and N64 cartridges stop part-way in, the way they sit in the real console (stop = the share still sticking out)
  const stop = spec && spec.stop ? spec.stop : 0;
  const tx = handheld ? W / 2 - dcx : slotX + D * (stop ? 0.5 - stop : 0.7) - dcx;
  const ty = handheld ? slotY + DH * (stop ? 0.5 - stop : 0.62) - dcy : H / 2 - dcy;
  const preX = handheld ? W / 2 - dcx : slotX - D * 0.8 - dcx;
  const preY = handheld ? slotY - DH * 0.75 - dcy : H / 2 - dcy;
  const midX = handheld ? preX * 0.5 - D * 0.18 : preX * 0.5, midY = handheld ? preY * 0.42 : preY * 0.5 - DH * 0.25;
  const edge = handheld ? (card ? "rotateX(0deg)" : "rotateX(72deg)") : (card ? "rotateY(0deg)" : "rotateY(72deg)");
  const half = handheld ? (card ? "rotateX(0deg) rotateZ(-6deg)" : "rotateX(30deg) rotateZ(-4deg)") : (card ? "rotateY(0deg)" : "rotateY(30deg)");
  const inTray = "rotateX(6deg) rotateY(-14deg)";
  const P = (x: number, y: number, r: string, s: number) => `perspective(1000px) translate(${Math.round(x)}px,${Math.round(y)}px) ${r} scale(${s})`;
  A(holder, [
    { opacity: 0, transform: P(0, 0, inTray, 0.97) },
    { opacity: 0, transform: P(0, 0, inTray, 0.97), offset: at(879) },
    { opacity: 1, transform: P(0, 0, inTray, 0.97), offset: at(880), easing: "cubic-bezier(.2,.8,.3,1)" },
    { opacity: 1, transform: P(0, -ch * 0.06, "rotateX(-4deg) rotateY(3deg)", 1.07), offset: at(1010), easing: "ease-in-out" },
    { opacity: 1, transform: P(0, -ch * 0.055, "rotateX(2deg) rotateY(-2deg)", 1.06), offset: at(1080), easing: "cubic-bezier(.45,0,.55,1)" },
    { opacity: 1, transform: P(midX, midY, half, 0.95), offset: at(1250), easing: "cubic-bezier(.45,0,.55,1)" },
    { opacity: 1, transform: P(preX, preY, edge, 0.84), offset: at(1430), easing: "cubic-bezier(.6,0,1,.5)" },
    { opacity: 1, transform: P(tx, ty, edge, 0.82), offset: at(1580) },
    // one that stays in view stays until the scene fades; the others have gone into the slot
    ...(stop ? [{ opacity: 1, transform: P(tx, ty, edge, 0.82), offset: at(1950) }] : []),
    { opacity: 0, transform: P(tx, ty, edge, 0.82) },
  ], { duration: T_END });
  // a tiny jolt when it clicks in
  A(root, [{ transform: "translate(0,0)" }, { transform: "translate(0,0)", offset: at(1575) }, { transform: "translate(0,2.5px)", offset: at(1605) }, { transform: "translate(0,-1px)", offset: at(1650) }, { transform: "translate(0,0)", offset: at(1700) }, { transform: "translate(0,0)" }], { duration: T_END, easing: "ease-out" });
  A(bezel, [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 0, transform: "translateY(10px)", offset: at(900) }, { opacity: 1, transform: "translateY(0)", offset: at(1120) }, { opacity: 1, transform: "translateY(0)", offset: at(1760) }, { opacity: 0, transform: "translateY(8px)", offset: at(2000) }, { opacity: 0 }], { duration: T_END, easing: "cubic-bezier(.2,.8,.3,1)" });
  A(streak, handheld
    ? [{ opacity: 0, transform: "translateX(0)" }, { opacity: 0, transform: "translateX(0)", offset: at(1560) }, { opacity: 1, transform: `translateX(${Math.round(D * 0.6)}px)`, offset: at(1650) }, { opacity: 0, transform: `translateX(${Math.round(D * 1.24)}px)`, offset: at(1780) }, { opacity: 0 }]
    : [{ opacity: 0, transform: "translateY(0)" }, { opacity: 0, transform: "translateY(0)", offset: at(1560) }, { opacity: 1, transform: `translateY(${Math.round(D * 0.6)}px)`, offset: at(1650) }, { opacity: 0, transform: `translateY(${Math.round(D * 1.24)}px)`, offset: at(1780) }, { opacity: 0 }],
    { duration: T_END, easing: "linear" });
  A(shadow, [{ opacity: 0.9, transform: "translate(0,0)" }, { opacity: 0.9, transform: "translate(0,0)", offset: at(880) }, { opacity: 0.45, transform: `translate(${Math.round(D * 0.06)}px,${Math.round(D * 0.1)}px)`, offset: at(1060) }, { opacity: 0, offset: at(1400) }, { opacity: 0 }], { duration: T_END, easing: "linear" });
  if (spinner) A(spinner, [{ transform: "rotate(0deg)" }, { transform: "rotate(0deg)", offset: at(900), easing: "cubic-bezier(.5,0,.8,.5)" }, { transform: "rotate(1080deg)", offset: at(1580) }, { transform: "rotate(1080deg)" }], { duration: T_END });
  A(slot, [
    { opacity: 0, transform: "scale(.9)" },
    { opacity: 0, transform: "scale(.9)", offset: at(950) },
    { opacity: 1, transform: "scale(1)", offset: at(1150) },
    { opacity: 1, transform: "scale(1)", offset: at(1480) },
    { opacity: 1, transform: "scale(1.05)", boxShadow: "0 0 0 1px rgba(170,225,255,.95), 0 0 24px 7px rgba(80,170,255,.8)", offset: at(1600) },
    { opacity: 1, transform: "scale(1)", boxShadow: "0 0 0 1px rgba(170,225,255,.6), 0 0 14px 3px rgba(80,170,255,.4)", offset: at(1800) },
    { opacity: 0, transform: "scale(1)" },
  ], { duration: T_END, easing: "ease-out" });
  if (tearing) {
    // the shrink-wrap: a glossy film with the seal sticker, in two pieces that are torn apart and fly off
    const film = `linear-gradient(115deg, rgba(255,255,255,.30) 0 7%, transparent 7% 30%, rgba(255,255,255,.18) 30% 33%, transparent 33%), radial-gradient(circle at 86% 91%, #ffd44d 0 4.5%, #b98a12 4.5% 6%, transparent 6.2%), repeating-linear-gradient(0deg, rgba(255,255,255,.07) 0 1px, transparent 1px 5px), linear-gradient(rgba(255,255,255,.10), rgba(255,255,255,.05))`;
    const edge = ["52% 0", "47% 12%", "54% 25%", "46% 38%", "55% 52%", "47% 66%", "53% 80%", "48% 92%", "52% 100%"];
    const left = `polygon(0 0, ${edge.join(", ")}, 0 100%)`;
    const right = `polygon(100% 0, ${edge.join(", ")}, 100% 100%)`;
    const wrapL = box(doc, `inset:-1px;border-radius:${rad}px;background:${film};clip-path:${left};-webkit-clip-path:${left};transform:translateZ(1.2px);backface-visibility:hidden;`);
    const wrapR = box(doc, `inset:-1px;border-radius:${rad}px;background:${film};clip-path:${right};-webkit-clip-path:${right};transform:translateZ(1.2px);backface-visibility:hidden;`);
    cover.appendChild(wrapL); cover.appendChild(wrapR);
    const r = (ms: number) => Math.min(1, ms / T_END); // real time (the tear itself is not pushed back)
    A(wrapL, [
      { transform: "translateZ(1.2px)", opacity: 1 },
      { transform: "translateZ(1.2px)", opacity: 1, offset: r(540) },
      { transform: "translateZ(1.2px) translate(-2px,1px) rotate(-1deg)", opacity: 1, offset: r(700) },      // gripped, crinkles
      { transform: "translateZ(1.2px) translate(1px,-1px) rotate(.5deg)", opacity: 1, offset: r(790), easing: "cubic-bezier(.3,0,.6,1)" },
      { transform: `translateZ(40px) translate(${-Math.round(cw * 0.75)}px,${Math.round(ch * 0.18)}px) rotate(-24deg) rotateY(-35deg)`, opacity: 0, offset: r(1150) },
      { transform: `translateZ(40px) translate(${-Math.round(cw * 0.75)}px,${Math.round(ch * 0.18)}px) rotate(-24deg) rotateY(-35deg)`, opacity: 0 },
    ], { duration: T_END });
    A(wrapR, [
      { transform: "translateZ(1.2px)", opacity: 1 },
      { transform: "translateZ(1.2px)", opacity: 1, offset: r(540) },
      { transform: "translateZ(1.2px) translate(2px,-1px) rotate(1deg)", opacity: 1, offset: r(700) },
      { transform: "translateZ(1.2px) translate(-1px,1px) rotate(-.5deg)", opacity: 1, offset: r(800), easing: "cubic-bezier(.3,0,.6,1)" },
      { transform: `translateZ(60px) translate(${Math.round(cw * 0.9)}px,${-Math.round(ch * 0.28)}px) rotate(30deg) rotateY(40deg)`, opacity: 0, offset: r(1120) },
      { transform: `translateZ(60px) translate(${Math.round(cw * 0.9)}px,${-Math.round(ch * 0.28)}px) rotate(30deg) rotateY(40deg)`, opacity: 0 },
    ], { duration: T_END });
  }
  // eject: everything runs backwards, from the slot back into the case and back to the cover's place
  // speed: every animation runs at the same rate (set before the eject reverses them, which flips the sign)
  if (speed !== 1) fx.forEach((a) => { try { a.playbackRate = speed; } catch (e) { /* ignore */ } });
  if (eject) fx.forEach((a) => { try { a.reverse(); } catch (e) { /* ignore */ } });
  if (sound) insertSounds(view, card, 0.85, eject ? "eject" : "insert", warp, speed);
  const done = () => { fx.forEach((a) => { try { a.cancel(); } catch (e) { /* ignore */ } }); try { if (root.isConnected) root.remove(); } catch (e) { /* ignore */ } };
  setTimeout(done, Math.round(T_END / speed) + 120);
  return true;
}

export class Engine {
  settings: Settings;
  prov: Provider;
  stats: Stats = { batches: 0, imagesChecked: 0, mutationCalls: 0, ms: 0 };
  private watches = new Map<Document, DocWatch>();
  private findTimer: any = null;
  owner: "plugin" | "inject";
  selfDoc: Document | null;
  errors = 0;
  lastError = "";

  constructor(settings: Settings, prov: Provider, opts?: { owner?: "plugin" | "inject"; selfDoc?: Document }) {
    this.settings = settings;
    this.prov = prov;
    this.owner = (opts && opts.owner) || "plugin";
    this.selfDoc = (opts && opts.selfDoc) || null;
  }

  /** While a game runs the plugin does nothing at all: no page watching, no timers, no animations.
   *  On waking up it catches up with one scan of each window. */
  sleeping = false;
  setSleeping(on: boolean): void {
    if (on === this.sleeping) return;
    this.sleeping = on;
    this.watches.forEach((w) => {
      try {
        if (on) { w.obs.disconnect(); clearTimeout(w.timer); w.timer = null; w.doc.documentElement.setAttribute("data-sanso-sleep", "1"); }
        else { w.doc.documentElement.removeAttribute("data-sanso-sleep"); w.observe(); w.scanAll(); }
      } catch (e) { this.noteError(e); }
    });
    if (on) { if (this.findTimer) clearInterval(this.findTimer); this.findTimer = null; }
    else if (!this.findTimer && this.settings.enabled) { this.discover(); this.findTimer = setInterval(() => this.discover(), DISCOVER_MS); }
  }

  /** New or changed template pictures: every cover is restyled. */
  setTemplates(list: TemplateInfo[]): void {
    registerTemplates(list);
    this.watches.forEach((w) => w.restyle());
  }

  noteError(e: any): void { this.errors++; this.lastError = String(e && e.message ? e.message : e); }

  start(): void {
    this.discover();
    this.findTimer = setInterval(() => this.discover(), DISCOVER_MS);
  }

  stop(): void {
    if (this.findTimer) clearInterval(this.findTimer);
    this.findTimer = null;
    this.watches.forEach((w) => w.destroy());
    this.watches.clear();
  }

  update(s: Settings): void {
    const prev = this.settings;
    this.settings = s;
    if (!s.enabled) {
      this.watches.forEach((w) => w.destroy());
      this.watches.clear();
      return;
    }
    if (!prev.enabled || this.watches.size === 0) { this.discover(); return; }
    this.watches.forEach((w) => {
      w.restyle();
    });
  }


  /** True when the plugin can see a window that holds the library (not just its own). */
  libraryReachable(): boolean {
    if (!this.selfDoc) return this.watches.size > 0;
    let ok = false;
    this.watches.forEach((w, d) => { if (d !== this.selfDoc || w.tracked.size > 0) ok = true; });
    return ok;
  }

  coverTotals(): { covers: number; matched: number; unmatched: number; images: number } {
    let covers = 0, matched = 0, images = 0;
    this.watches.forEach((w) => {
      images += w.doc.getElementsByTagName("img").length;
      w.tracked.forEach((tr) => { covers++; if (tr.how === "src" || tr.how === "fiber" || tr.how === "name") matched++; });
    });
    return { covers, matched, unmatched: covers - matched, images };
  }

  /** One line per thing that has to work, each marked ok / fail / warn / skip (not testable right now). */
  selfCheck(): CheckLine[] {
    const out: CheckLine[] = [];
    const s = this.settings;
    const L = (status: CheckLine["status"], label: string, detail: string) => out.push({ status, label, detail });
    if (!s.enabled) { L("warn", "3D cases switched on", "they are turned off in the settings"); return out; }
    L(this.watches.size > 0 ? "ok" : "fail", "Steam windows watched", `${this.watches.size} window(s)`);
    const reach = this.libraryReachable();
    L(reach ? "ok" : "fail", "Library window reachable", reach ? "the library window can be changed" : "no library window found");
    let styled = false;
    this.watches.forEach((w) => { if (w.doc.getElementById(STYLE_ID)) styled = true; });
    L(styled ? "ok" : (this.watches.size ? "fail" : "skip"), "Style sheet added", styled ? "in place" : "missing");
    const t = this.coverTotals();
    let nBox = 0, nImg = 0;
    this.watches.forEach((w) => w.tracked.forEach((tr) => { if (tr.mode === "box") nBox++; else nImg++; }));
    if (t.covers > 0) L("ok", "Covers found", `${t.covers} covers out of ${t.images} images (${nBox} full 3D, ${nImg} simple)`);
    else L(t.images > 0 ? "fail" : "skip", "Covers found", t.images > 0 ? `0 covers out of ${t.images} images (open your Library and check again)` : "no images on screen yet (open your Library)");
    if (t.covers > 0) {
      const ratio = t.matched / t.covers;
      L(ratio >= 0.9 ? "ok" : ratio >= 0.5 ? "warn" : "fail", "Games matched to covers", `${t.matched} of ${t.covers} matched (${t.unmatched} not)`);
    }
    // is the look really applied?
    let first: Tracked | null = null, firstBox: Tracked | null = null;
    this.watches.forEach((w) => w.tracked.forEach((tr) => { if (!first) first = tr; if (!firstBox && tr.mode === "box") firstBox = tr; }));
    if (this.watches.size > 0 && firstBox === null && t.covers > 0) L("warn", "Full 3D boxes", "covers are in simple mode (no wrapper element); the spine and top are not drawn");
    let focBox: HTMLElement | null = null;
    this.watches.forEach((w) => { if (!focBox) { try { focBox = w.doc.querySelector(".gpfocus [data-sanso-case='box'], :focus [data-sanso-case='box'], [data-sanso-case='box'].gpfocus, [data-sanso-pop]:focus [data-sanso-case='box']"); } catch (e) { focBox = null; } } });
    if (firstBox && !focBox) L("skip", "Full 3D boxes", "move onto a game with the controller, then run the check again");
    if (focBox) {
      const why = flattenReasons(focBox);
      L(why.length ? "warn" : "ok", "Full 3D boxes", why.length ? "Steam may flatten them: " + why.join(", ") : "nothing flattens the case (spine, top and back can be drawn)");
    }
    // focus pop-out
    let foc: { n: number; popped: boolean; info: string } | null = null;
    this.watches.forEach((w) => {
      try {
        const g = w.doc.querySelector(".gpfocus");
        if (g && !foc) {
          const cs = g.querySelectorAll("[data-sanso-case]");
          let popped = false, info = "";
          const v = w.doc.defaultView;
          if (cs.length === 1 && v) { const pe = (cs[0] as HTMLElement).closest("[data-sanso-pop]") as HTMLElement | null; if (pe) { const pc = v.getComputedStyle(pe); popped = (pc.rotate || "").indexOf(String(s.angle) + "deg") >= 0 || (pc.transform !== "none" && pc.transform !== ""); info = `${pe.tagName.toLowerCase()}.${typeof pe.className === "string" ? pe.className.split(/\s+/).slice(0, 3).join(".") : ""} own=${pe.hasAttribute("data-sanso-own")} rotate=${pc.rotate} transform=${pc.transform.slice(0, 40)}`; } else info = "no pop element found"; }
          foc = { n: cs.length, popped, info };
        }
      } catch (e) { /* ignore */ }
    });
    if (!foc) L("skip", "Focus pop-out", "move onto a game with the controller, then run the check again");
    else {
      const f: { n: number; popped: boolean; info: string } = foc;
      if (f.n === 1) L(f.popped ? "ok" : "warn", "Focus pop-out", f.popped ? "the focused game pops out" : "the focused game has a case but did not pop out (" + f.info + ")");
      else if (f.n === 0) L("warn", "Focus pop-out", "the focused item holds no cover (it may be a menu)");
      else L("fail", "Focus pop-out", `the focused item holds ${f.n} covers; a whole row would pop out`);
    }
    // themes and other plugins' styles
    try {
      let doc: Document | null = null, el: HTMLElement | null = null;
      this.watches.forEach((w) => {
        if (doc) return;
        const f = w.doc.querySelector(".gpfocus [data-sanso-pop], [data-sanso-pop].gpfocus, [data-sanso-pop]:focus") as HTMLElement | null;
        const any = f || (w.tracked.size ? (w.tracked.values().next().value as Tracked).pop || null : null);
        if (any) { doc = w.doc; el = any; }
      });
      if (doc) {
        const sc = themeScan(doc, el);
        if (sc.conflicts.length) L("warn", "Themes", `other styles also change the case: ${sc.conflicts.join("; ")}`);
        else L("ok", "Themes", sc.others.length ? `${sc.others.length} other style sheet(s), none change the case (${sc.others.slice(0, 4).join(", ")})` : "no other style sheets found");
      }
    } catch (e) { /* ignore */ }
    if (this.errors > 0) L("warn", "Errors inside the plugin", `${this.errors} (last: ${this.lastError.slice(0, 80)})`);
    return out;
  }

  /** Text copy of what the plugin sees, for a saved report. */
  snapshot(): string {
    const out: string[] = [];
    out.push(`time: ${new Date().toISOString()}`);
    try { out.push(`user agent: ${navigator.userAgent}`); } catch (e) { /* ignore */ }
    this.report().forEach((l) => out.push(l));
    this.watches.forEach((w) => {
      const doc = w.doc;
      out.push("");
      out.push(`=== window "${doc.title}" path ${screenPath(doc)} size ${doc.defaultView ? doc.defaultView.innerWidth + "x" + doc.defaultView.innerHeight : "?"} ===`);
      const imgs = Array.from(doc.getElementsByTagName("img")).slice(0, 200);
      out.push(`-- first ${imgs.length} images (natural size, tracked?, address, ancestors) --`);
      imgs.forEach((img) => {
        const chain: string[] = [];
        let e: Element | null = img.parentElement;
        for (let i = 0; e && i < 5; i++, e = e.parentElement) chain.push(e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.split(/\s+/).slice(0, 2).join(".") : ""));
        out.push(`${img.naturalWidth}x${img.naturalHeight} ${w.tracked.has(img) ? "TAGGED " + (w.tracked.get(img) as Tracked).how : "-"} ${img.currentSrc || img.src} <- ${chain.join(" < ")}`);
      });
      try {
        const g = doc.querySelector(".gpfocus [data-sanso-case]");
        const v = doc.defaultView;
        if (g && v) {
          out.push("-- focused cover: ancestors with style (outline | box-shadow | border) --");
          let e: Element | null = g;
          for (let i = 0; e && i < 8; i++, e = e.parentElement) {
            const cs = v.getComputedStyle(e);
            out.push(`${e.tagName.toLowerCase()}.${typeof e.className === "string" ? e.className.split(/\s+/).slice(0, 4).join(".") : ""} pop=${e.hasAttribute("data-sanso-pop")} | ${cs.outline} | ${cs.boxShadow.slice(0, 80)} | ${cs.borderTopWidth} ${cs.borderTopColor} | transform=${cs.transform.slice(0, 40)} ts=${cs.transformStyle} filter=${cs.filter}`);
          }
        }
      } catch (err) { /* ignore */ }
      out.push("-- unmatched covers: parent html --");
      let n = 0;
      w.tracked.forEach((tr) => {
        if (n < 15 && (tr.how === "raw" || tr.how === "none")) { n++; out.push((tr.img.parentElement ? tr.img.parentElement.outerHTML : tr.img.outerHTML).slice(0, 600)); }
      });
      out.push("-- body html (start) --");
      out.push((doc.body ? doc.body.innerHTML : "").slice(0, 40000));
    });
    return out.join("\n");
  }

  /** Re-read playtime etc. for every cover (e.g. after a game session ended). */
  refreshWear(): void {
    if (!this.settings.enabled) return;
    this.watches.forEach((w) => w.restyle());
  }

  /** Play the insert animation for a game (key = unsigned app id) or, with null, for any visible cover. */
  private lastInsert = { key: "", t: 0 };
  /** Play the insert animation for a game (key = unsigned app id). With null: the game page you are on, or any visible cover. */
  /** Called when a sealed game's wrap was torn off (its own "Sealed" wear can then be removed). */
  onTear: ((key: string) => void) | null = null;

  playInsert(key: string | null, opts: { eject?: boolean; force?: boolean } = {}): boolean {
    const eject = !!opts.eject;
    // Steam's windows: the watched ones, or (3D cases switched off) straight from Steam, so the animation works on its own
    let docs: Document[] = Array.from(this.watches.keys());
    if (!docs.length) { try { docs = this.prov.getDocs().filter((x) => !!x && !!x.body); } catch (e) { docs = []; } }
    // the game page you are on (Play pressed there, or Preview)
    let pageDoc: Document | null = null;
    if (key === null) {
      docs.forEach((dd) => {
        const m = /\/library\/app\/(\d+)/.exec(screenPath(dd));
        if (m && !dd.hidden && !pageDoc) { key = normId(m[1]) || null; pageDoc = dd; }
      });
    }
    if (key !== null && !eject) {
      const now = Date.now();
      if (this.lastInsert.key === key && now - this.lastInsert.t < 8000) return false; // launch reported twice
      this.lastInsert = { key, t: now };
    }
    // the game's cover on screen: the case starts there and its picture is the art
    const onScreen = (im: HTMLImageElement, dd: Document): DOMRect | null => {
      let rect: DOMRect | null = null;
      try { rect = im.getBoundingClientRect(); } catch (e) { rect = null; }
      const vh = dd.defaultView ? dd.defaultView.innerHeight : 0;
      return rect && rect.width > 20 && rect.height > 20 && rect.bottom > 0 && rect.top < vh ? rect : null;
    };
    let hit: { doc: Document; img: HTMLImageElement; rect: DOMRect; key: string | null } | null = null;
    this.watches.forEach((w) => {
      if (w.doc.hidden) return;
      w.tracked.forEach((tr) => {
        if (hit || !tr.img.isConnected || (key !== null && tr.appid !== key)) return;
        const rect = onScreen(tr.img, w.doc);
        if (rect) hit = { doc: w.doc, img: tr.img, rect, key: tr.appid };
      });
    });
    if (!hit) {
      // 3D cases switched off (nothing is tagged) or this cover is not tagged: look for it on the page directly
      for (const dd of docs) {
        if (hit || dd.hidden) continue;
        const imgs = dd.getElementsByTagName("img");
        for (let i = 0; i < imgs.length && i < 600; i++) {
          const im = imgs[i] as HTMLImageElement;
          if (!isPortraitCover(im)) continue;
          const r = resolveAppId(im, this.prov);
          if (key !== null ? r.key !== key : !r.key) continue;
          if (isDecoy(im, dd.defaultView) || isTwinDecoy(im)) continue;
          const rect = onScreen(im, dd);
          if (rect) { hit = { doc: dd, img: im, rect, key: r.key }; break; }
        }
      }
    }
    const b: any = hit;
    const lookKey = key !== null ? key : b ? b.key : null;
    let doc: Document | null = b ? b.doc : pageDoc;
    if (!doc) {
      // not on screen (game page, Home...): the biggest visible Steam window
      let most = -1;
      docs.forEach((dd) => {
        const v = dd.defaultView; const area = v && !dd.hidden ? v.innerWidth * v.innerHeight : 0;
        if (area > most) { most = area; doc = dd; }
      });
    }
    if (!doc) return false;
    const look = lookFor(this.settings, this.prov, lookKey);
    // the insert (or eject) animation can be on or off for each game and collection; "force" is the preview button
    if (!opts.force && !(eject ? look.eject : look.insert)) return true;
    const rect = b ? { left: b.rect.left, top: b.rect.top, width: b.rect.width, height: b.rect.height } : null;
    // the game's cover art: the picture already on screen, else the art Steam has for the game (custom art first)
    const cands: string[] = [];
    const add = (u: string) => { if (u && cands.indexOf(u) < 0) cands.push(u); };
    if (b) add(b.img.currentSrc || b.img.src);
    if (lookKey && this.prov.artUrls) { try { this.prov.artUrls(lookKey).forEach(add); } catch (e) { /* ignore */ } }
    // where Steam keeps a game's portrait art (custom art first): used when the calls above give nothing usable
    if (lookKey && /^\d+$/.test(lookKey)) {
      ["png", "jpg", "webp"].forEach((x) => add(`/customimages/${lookKey}p.${x}`));
      add(`/assets/${lookKey}/library_600x900.jpg`);
      add(`/assets/${lookKey}/library_600x900_2x.jpg`);
    }
    const d: Document = doc;
    // first launch of a sealed game: the wrap is torn off. "First" = never played, or the game itself is set to Sealed.
    let tear = false;
    if (!eject && lookKey && look.wear === "sealed") {
      let info: PlayInfo | null = null;
      try { info = this.prov.playInfo(lookKey); } catch (e) { info = null; }
      tear = (this.settings.gameOv[lookKey] && this.settings.gameOv[lookKey].wear) === "sealed" || (!!info && info.minutes <= 0 && !info.last);
    }
    // the game's logo, only when the logo option is on: custom logo first, then Steam's own (these addresses are Steam's
    // own, as for the portrait art above; a game without a logo just gets the fitted cover)
    const logoCands: string[] = [];
    if (look.art === "logo" && lookKey && /^\d+$/.test(lookKey)) {
      ["png", "jpg", "webp"].forEach((x) => logoCands.push(`/customimages/${lookKey}_logo.${x}`));
      logoCands.push(`/assets/${lookKey}/logo.png`);
      logoCands.push(`/assets/${lookKey}/logo_2x.png`);
    }
    const go = (art: string, logo = ""): boolean => {
      try {
        const ok = runInsert(d, { rect, art, logo, look }, look.slot, this.settings.insertSound,
          { eject, tear, speed: eject ? this.settings.ejectSpeed : this.settings.insertSpeed, artMode: look.art });
        if (ok && tear && lookKey && this.onTear) this.onTear(lookKey);
        return ok;
      } catch (e) { this.noteError(e); return false; }
    };
    // the art is known at once when the cover is on screen; otherwise it is loaded first (below). The logo, if wanted, is
    // loaded at the same time (short wait: it is a small local file), and the animation starts when both are settled.
    const view = d.defaultView as any;
    let artRes: string | null = !cands.length ? "" : b ? cands[0] : null;
    let logoRes: string | null = logoCands.length ? null : "";
    if (artRes !== null && logoRes !== null) return go(artRes, logoRes);
    const fire = () => { if (artRes !== null && logoRes !== null) go(artRes, logoRes); };
    // all candidates at once, the best one that loads (at most ~1.5 s), so the case and the disc are never blank.
    // Relative addresses are Steam's own (steamloopback.host), as in its own pages.
    if (artRes === null) loadBest(view, cands, (im) => im.naturalWidth > 10 && im.naturalHeight > im.naturalWidth, 1500, (u) => { artRes = u; fire(); });
    if (logoRes === null) loadBest(view, logoCands, (im) => im.naturalWidth > 10 && im.naturalHeight > 5, 800, (u) => { logoRes = u; fire(); });
    return true;
  }

  // cheap: compares window identities and the screen address only; the page is scanned once per new window
  private discover(): void {
    if (!this.settings.enabled || this.sleeping) return;
    let docs: Document[] = [];
    try { docs = this.prov.getDocs(); } catch (e) { docs = []; }
    this.watches.forEach((w, doc) => {
      if (docs.indexOf(doc) < 0) { w.destroy(); this.watches.delete(doc); }
    });
    for (const doc of docs) {
      try {
        if (!doc.body) continue;
        let w = this.watches.get(doc);
        if (!w) {
          const o = doc.documentElement.getAttribute(OWNER_ATTR);
          if (o && o !== this.owner) continue; // the other injection method already looks after this window
          doc.documentElement.setAttribute(OWNER_ATTR, this.owner);
          w = new DocWatch(doc, this);
          this.watches.set(doc, w);
          ensureStyle(doc, buildCss(this.settings));
          w.checkPath(true);
        } else {
          if (!doc.getElementById(STYLE_ID)) ensureStyle(doc, buildCss(this.settings)); // Steam rebuilt <head>
          w.checkPath();
        }
      } catch (e) { this.noteError(e); }
    }
  }

  report(): string[] {
    const lines: string[] = [];
    lines.push(`Steam windows watched: ${this.watches.size}`);
    let tagged = 0;
    this.watches.forEach((w) => {
      const doc = w.doc;
      let box = 0, simple = 0;
      const how: Record<string, number> = { src: 0, fiber: 0, name: 0, raw: 0, none: 0 };
      const unknown: string[] = [];
      w.tracked.forEach((tr) => {
        if (tr.mode === "box") box++; else simple++;
        how[tr.how]++;
        if ((tr.how === "raw" || tr.how === "none") && unknown.length < 3) {
          unknown.push(`${tr.appid || "no id"}: ...${(tr.img.currentSrc || tr.img.src || "").slice(-46)}`);
        }
      });
      tagged += box + simple;
      lines.push(`- ${doc.title || "(untitled)"}: ${box} full 3D, ${simple} simple, ${w.decoys.size} glow/reflection copies left alone${w.plain.size ? `, ${w.plain.size} game page cover${w.plain.size === 1 ? "" : "s"} left plain` : ""}`);
      lines.push(`  screen: ${screenPath(doc) || "(unknown)"}${screenAllowed(doc, this.settings) ? "" : " (other screen, off)"}`);
      { let rp = ""; try { rp = (this.prov.pagePath && this.prov.pagePath(doc)) || ""; } catch (e) { rp = ""; }
        lines.push(`  game page: ${gamePageKey(doc, this.prov) || "no"}${rp ? ` (Steam's router: ${rp})` : ""}`); }
      lines.push(`  game found by: picture address ${how.src}, Steam data ${how.fiber}, name ${how.name}; not in your game list ${how.raw}; no id ${how.none}`);
      unknown.forEach((x) => lines.push(`  unmatched ${x}`));
      try {
        const g = doc.querySelector(".gpfocus");
        if (g) lines.push(`  focused tile holds ${g.querySelectorAll("[data-sanso-case]").length} covers (should be 1)`);
      } catch (e) { /* ignore */ }
    });
    const st = this.stats;
    lines.push(`Work so far: ${st.imagesChecked} images checked in ${st.batches} slices, ${st.ms.toFixed(1)} ms total, ${st.mutationCalls} page changes seen.`);
    lines.push(tagged > 0 ? `OK: ${tagged} covers are 3D right now.` : "No covers tagged. Open your Library, then check again.");
    return lines;
  }
}
