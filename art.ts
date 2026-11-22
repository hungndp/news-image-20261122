// art.ts — drawn artwork for the 22 Nov 2026 front page (v2): three
// big lead illustrations, small motif icons for the feature cards,
// and a stylised equirectangular world map with numbered pins.
// Everything is vector code over the gfx Canvas; no assets.
import { Canvas, rng, type RGB } from "./gfx.ts";

export const PAL = {
  paper: [246, 240, 224] as RGB,
  paperDim: [214, 200, 164] as RGB,
  white: [255, 253, 247] as RGB,
  ink: [28, 26, 22] as RGB,
  grey: [110, 104, 92] as RGB,
  navy: [26, 34, 62] as RGB,
  navy2: [40, 50, 88] as RGB,
  gold: [198, 158, 62] as RGB,
  goldSoft: [226, 196, 116] as RGB,
  red: [178, 44, 32] as RGB,
  redDark: [120, 28, 20] as RGB,
  teal: [34, 110, 108] as RGB,
  sky: [52, 84, 128] as RGB,
  sea: [38, 66, 96] as RGB,
  sand: [216, 190, 138] as RGB,
  flame: [232, 122, 40] as RGB,
};

// ---- big lead art 1: Gulf night — skyline, missile streaks, tanker ----
export function artGulf(cv: Canvas, x: number, y: number, w: number, h: number): void {
  // dusk sky bands
  for (let i = 0; i < h; i++) {
    const t = i / h;
    const c: RGB = [
      Math.round(30 + 40 * t), Math.round(38 + 30 * t), Math.round(70 - 10 * t),
    ];
    cv.rect(x, y + i, w, 1, c);
  }
  // stars
  const r = rng(2211);
  for (let i = 0; i < 40; i++) {
    cv.px(x + Math.floor(r() * w), y + Math.floor(r() * (h * 0.5)), [230, 226, 210]);
  }
  // moon
  cv.circle(x + w - 26, y + 14, 8, [238, 230, 200], true);
  cv.circle(x + w - 29, y + 11, 7, [52, 62, 92], true);
  // skyline
  const base = y + h - 16;
  const towers = [0.05, 0.16, 0.24, 0.33, 0.42, 0.52, 0.60, 0.70, 0.78, 0.88];
  const heights = [26, 40, 30, 48, 34, 44, 28, 38, 30, 24];
  for (let i = 0; i < towers.length; i++) {
    const tx = x + Math.floor(towers[i] * w);
    const th = heights[i];
    cv.rect(tx, base - th, 14, th, [16, 20, 38]);
    // lit windows
    for (let wy = base - th + 4; wy < base - 4; wy += 6) {
      for (let wx = tx + 3; wx < tx + 12; wx += 5) {
        if (r() < 0.45) cv.rect(wx, wy, 2, 3, [240, 200, 90]);
      }
    }
  }
  // sea
  cv.rect(x, base, w, h - (base - y), PAL.sea);
  for (let i = 0; i < 5; i++) {
    cv.line(x + 8, base + 4 + i * 3, x + w - 8, base + 4 + i * 3, [90, 120, 150], 1);
  }
  // tanker with smoke
  const sx = x + Math.floor(w * 0.42);
  cv.rect(sx, base - 6, 74, 6, [30, 30, 34]);
  cv.rect(sx + 8, base - 14, 10, 8, [60, 60, 66]);
  cv.rect(sx + 56, base - 12, 6, 6, [60, 60, 66]);
  cv.circle(sx + 13, base - 18, 3, [120, 120, 126], true);
  cv.circle(sx + 18, base - 24, 4, [150, 150, 156], true);
  // flame on deck
  cv.circle(sx + 44, base - 9, 4, PAL.flame, true);
  cv.circle(sx + 44, base - 10, 2, [250, 220, 120], true);
  // missile streaks
  const streaks: [number, number, number][] = [
    [0.08, 0.10, 26], [0.30, 0.06, 34], [0.55, 0.12, 30], [0.78, 0.08, 24], [0.92, 0.16, 18],
  ];
  for (const [fx, fy, len] of streaks) {
    const px0 = x + Math.floor(fx * w);
    const py0 = y + Math.floor(fy * h);
    cv.line(px0, py0, px0 + len, py0 + Math.floor(len * 0.45), [255, 210, 110], 2);
    cv.line(px0 + len, py0 + Math.floor(len * 0.45), px0 + len + 6, py0 + Math.floor(len * 0.45) + 3, [255, 240, 190], 1);
    cv.circle(px0 + len + 6, py0 + Math.floor(len * 0.45) + 3, 2, [255, 240, 190], true);
  }
}

// ---- big lead art 2: climate deadlock — split sun, thermometer, clock --
// The summit is on its SECOND day of overtime on Sunday: the clock
// reads past midnight, the thermometer keeps rising, the two arrows
// still pull apart.
export function artClimate(cv: Canvas, x: number, y: number, w: number, h: number): void {
  // pale sky
  cv.rect(x, y, w, h, [232, 226, 200]);
  // split sun: half bright, half grey
  const cx = x + Math.floor(w * 0.20);
  const cy = y + Math.floor(h * 0.42);
  cv.circle(cx, cy, 22, [232, 170, 60], true);
  cv.rect(cx, cy - 22, 22, 44, [150, 146, 134]);
  cv.circle(cx, cy, 22, [150, 146, 134], false);
  // ground line
  cv.rect(x, y + h - 18, w, 2, [120, 100, 70]);
  // cracked earth
  const r = rng(2212);
  for (let i = 0; i < 7; i++) {
    const gx = x + 10 + Math.floor(r() * (w - 20));
    cv.line(gx, y + h - 18, gx + (r() < 0.5 ? -6 : 6), y + h - 4, [120, 100, 70], 1);
  }
  // big thermometer
  const tx = x + Math.floor(w * 0.60);
  const ty = y + 6;
  const th = h - 22;
  cv.rect(tx, ty, 14, th - 12, [255, 253, 247]);
  cv.frame(tx, ty, 14, th - 12, PAL.ink, 1);
  cv.rect(tx + 3, ty + Math.floor((th - 12) * 0.45), 8, Math.floor((th - 12) * 0.55), PAL.red);
  cv.circle(tx + 7, ty + th - 12, 11, PAL.red, true);
  cv.circle(tx + 7, ty + th - 12, 11, PAL.ink, false);
  cv.circle(tx + 7, ty + th - 12, 6, [255, 253, 247], true);
  cv.circle(tx + 7, ty + th - 12, 4, PAL.red, true);
  // tick marks
  for (let i = 0; i < 5; i++) {
    const yy = ty + 4 + i * Math.floor((th - 20) / 4);
    cv.line(tx + 14, yy, tx + 20, yy, PAL.ink, 1);
  }
  // overtime clock (top right): hands past midnight
  const kx = x + w - 34;
  const ky = y + 22;
  cv.circle(kx, ky, 15, [255, 253, 247], true);
  cv.circle(kx, ky, 15, PAL.ink, false);
  cv.line(kx, ky, kx - 2, ky - 10, PAL.ink, 2);
  cv.line(kx, ky, kx + 9, ky + 3, PAL.red, 2);
  cv.circle(kx, ky, 2, PAL.ink, true);
  // two opposing arrows (deadlock)
  cv.line(x + w - 52, y + 48, x + w - 16, y + 48, PAL.red, 2);
  cv.line(x + w - 16, y + 48, x + w - 22, y + 44, PAL.red, 2);
  cv.line(x + w - 16, y + 48, x + w - 22, y + 52, PAL.red, 2);
  cv.line(x + w - 16, y + 62, x + w - 52, y + 62, PAL.teal, 2);
  cv.line(x + w - 52, y + 62, x + w - 46, y + 58, PAL.teal, 2);
  cv.line(x + w - 52, y + 62, x + w - 46, y + 66, PAL.teal, 2);
  // rising heat waves
  for (let i = 0; i < 3; i++) {
    const wx = x + Math.floor(w * 0.40) + i * 12;
    for (let yy = 0; yy < 18; yy += 2) {
      cv.px(wx + Math.round(Math.sin(yy / 3) * 2), y + h - 40 + yy, PAL.flame);
    }
  }
}

// ---- big lead art 3: quake — Andes ridge, seismograph, broken homes ---
// USGS revised the quake to M6.7; Sunday's count is 152 homes
// uninhabitable near Junin, no deaths reported.
export function artQuake(cv: Canvas, x: number, y: number, w: number, h: number): void {
  cv.rect(x, y, w, h, [224, 214, 188]);
  // ridge
  const ridge: [number, number][] = [
    [0, 0.78], [0.08, 0.55], [0.16, 0.68], [0.24, 0.42], [0.32, 0.60],
    [0.40, 0.34], [0.48, 0.58], [0.56, 0.46], [0.64, 0.66], [0.72, 0.52],
    [0.80, 0.70], [0.88, 0.58], [0.96, 0.74], [1, 0.80],
  ];
  const pts: [number, number][] = ridge.map(([fx, fy]) => [
    x + Math.floor(fx * w), y + Math.floor(fy * h),
  ] as [number, number]);
  pts.push([x + w, y + h], [x, y + h]);
  cv.poly(pts, [96, 82, 62]);
  // snow caps on the two highest peaks
  cv.poly([
    [x + Math.floor(0.40 * w), y + Math.floor(0.34 * h)],
    [x + Math.floor(0.365 * w), y + Math.floor(0.44 * h)],
    [x + Math.floor(0.435 * w), y + Math.floor(0.44 * h)],
  ], [250, 248, 240]);
  cv.poly([
    [x + Math.floor(0.24 * w), y + Math.floor(0.42 * h)],
    [x + Math.floor(0.205 * w), y + Math.floor(0.52 * h)],
    [x + Math.floor(0.275 * w), y + Math.floor(0.52 * h)],
  ], [250, 248, 240]);
  // crack down the middle
  cv.line(x + Math.floor(w * 0.5), y + Math.floor(h * 0.55), x + Math.floor(w * 0.47), y + h - 4, PAL.redDark, 2);
  cv.line(x + Math.floor(w * 0.47), y + h - 4, x + Math.floor(w * 0.52), y + h - 1, PAL.redDark, 1);
  // three broken houses at the foot of the ridge
  for (let i = 0; i < 3; i++) {
    const hx = x + Math.floor(w * (0.60 + i * 0.13));
    const hy = y + h - 22;
    cv.rect(hx, hy + 6, 16, 10, [150, 120, 90]);
    cv.poly([[hx - 2, hy + 6], [hx + 8, hy - 2], [hx + 18, hy + 6]], [120, 28, 20]);
    cv.rect(hx + 6, hy + 10, 4, 6, [60, 50, 40]);
  }
  // seismograph strip
  const sy = y + 8;
  cv.rect(x + 8, sy, w - 16, 20, [255, 253, 247]);
  cv.frame(x + 8, sy, w - 16, 20, PAL.ink, 1);
  let px = x + 10;
  const mid = sy + 10;
  cv.line(px, mid, px + 14, mid, PAL.ink, 1);
  px += 14;
  const spikes = [3, -6, 8, -9, 6, -4, 9, -8, 5, -3, 7, -6, 4, -2];
  for (const s of spikes) {
    const nx = px + 12;
    cv.line(px, mid, nx, mid + s, PAL.red, 1);
    cv.line(nx, mid + s, nx + 4, mid, PAL.red, 1);
    px = nx + 4;
    if (px > x + w - 16) break;
  }
  cv.line(px, mid, x + w - 10, mid, PAL.ink, 1);
}

// ---- small motif icons (40x40 box) -------------------------------------
export function iconBolt(cv: Canvas, x: number, y: number): void {
  const pts: [number, number][] = [
    [x + 24, y + 2], [x + 10, y + 24], [x + 18, y + 24],
    [x + 14, y + 38], [x + 30, y + 16], [x + 21, y + 16],
  ];
  cv.poly(pts, PAL.gold);
  cv.polyLine(pts, PAL.ink);
}

export function iconWave(cv: Canvas, x: number, y: number): void {
  for (let k = 0; k < 3; k++) {
    const yy = y + 10 + k * 10;
    for (let xx = 0; xx < 36; xx++) {
      const off = Math.round(Math.sin(xx / 5) * 3);
      cv.px(x + 2 + xx, yy + off, PAL.teal);
      cv.px(x + 2 + xx, yy + off + 1, PAL.teal);
    }
  }
}

export function iconGlobe(cv: Canvas, x: number, y: number): void {
  cv.circle(x + 20, y + 20, 16, PAL.teal, false);
  cv.circle(x + 20, y + 20, 16, PAL.teal, true);
  cv.circle(x + 20, y + 20, 16, PAL.paper, false);
  // crude land blobs
  cv.circle(x + 14, y + 14, 5, PAL.paper, true);
  cv.circle(x + 27, y + 26, 5, PAL.paper, true);
  cv.circle(x + 26, y + 12, 3, PAL.paper, true);
  cv.line(x + 4, y + 20, x + 36, y + 20, PAL.paper, 1);
  cv.line(x + 20, y + 4, x + 20, y + 36, PAL.paper, 1);
}

export function iconChart(cv: Canvas, x: number, y: number): void {
  const bars = [8, 16, 12, 24, 30];
  for (let i = 0; i < bars.length; i++) {
    cv.rect(x + 4 + i * 7, y + 36 - bars[i], 5, bars[i], i === 4 ? PAL.red : PAL.navy2);
  }
  cv.line(x + 2, y + 36, x + 38, y + 36, PAL.ink, 1);
}

export function iconScale(cv: Canvas, x: number, y: number): void {
  cv.line(x + 20, y + 4, x + 20, y + 34, PAL.ink, 2);
  cv.line(x + 6, y + 8, x + 34, y + 8, PAL.ink, 2);
  cv.line(x + 6, y + 8, x + 4, y + 20, PAL.ink, 1);
  cv.line(x + 6, y + 8, x + 8, y + 20, PAL.ink, 1);
  cv.line(x + 4, y + 20, x + 8, y + 20, PAL.ink, 1);
  cv.line(x + 34, y + 8, x + 32, y + 20, PAL.ink, 1);
  cv.line(x + 34, y + 8, x + 36, y + 20, PAL.ink, 1);
  cv.line(x + 32, y + 20, x + 36, y + 20, PAL.ink, 1);
  cv.rect(x + 14, y + 34, 12, 2, PAL.ink);
}

export function iconFlame(cv: Canvas, x: number, y: number): void {
  cv.circle(x + 20, y + 24, 10, PAL.flame, true);
  cv.circle(x + 20, y + 20, 6, [250, 220, 120], true);
  cv.circle(x + 20, y + 16, 3, [255, 253, 247], true);
  const pts: [number, number][] = [
    [x + 20, y + 4], [x + 28, y + 18], [x + 24, y + 18], [x + 30, y + 28],
    [x + 10, y + 28], [x + 16, y + 18], [x + 12, y + 18],
  ];
  cv.poly(pts, PAL.flame);
}

// shield: diplomacy / expulsion / protection
export function iconShield(cv: Canvas, x: number, y: number): void {
  const pts: [number, number][] = [
    [x + 20, y + 3], [x + 34, y + 9], [x + 34, y + 20],
    [x + 20, y + 37], [x + 6, y + 20], [x + 6, y + 9],
  ];
  cv.poly(pts, PAL.navy2);
  cv.polyLine(pts, PAL.ink);
  cv.line(x + 20, y + 10, x + 20, y + 30, PAL.goldSoft, 2);
  cv.line(x + 12, y + 16, x + 28, y + 16, PAL.goldSoft, 2);
}

// ballot box: elections / votes
export function iconVote(cv: Canvas, x: number, y: number): void {
  cv.rect(x + 8, y + 16, 24, 20, PAL.white);
  cv.frame(x + 8, y + 16, 24, 20, PAL.ink, 1);
  cv.rect(x + 16, y + 12, 8, 4, PAL.ink);
  // ballot slip going in
  cv.poly([[x + 14, y + 4], [x + 26, y + 4], [x + 26, y + 12], [x + 14, y + 12]], PAL.paper);
  cv.line(x + 17, y + 6, x + 23, y + 6, PAL.red, 1);
  cv.line(x + 17, y + 9, x + 21, y + 9, PAL.red, 1);
  // tick on the box
  cv.line(x + 12, y + 28, x + 17, y + 33, PAL.teal, 2);
  cv.line(x + 17, y + 33, x + 28, y + 20, PAL.teal, 2);
}

// crosshair: strikes / targeting
export function iconTarget(cv: Canvas, x: number, y: number): void {
  cv.circle(x + 20, y + 20, 15, PAL.red, false);
  cv.circle(x + 20, y + 20, 8, PAL.red, false);
  cv.circle(x + 20, y + 20, 3, PAL.red, true);
  cv.line(x + 20, y + 2, x + 20, y + 8, PAL.ink, 2);
  cv.line(x + 20, y + 32, x + 20, y + 38, PAL.ink, 2);
  cv.line(x + 2, y + 20, x + 8, y + 20, PAL.ink, 2);
  cv.line(x + 32, y + 20, x + 38, y + 20, PAL.ink, 2);
}

// skyline: a city / mayoral politics
export function iconCity(cv: Canvas, x: number, y: number): void {
  cv.rect(x + 5, y + 16, 8, 22, PAL.navy2);
  cv.rect(x + 15, y + 8, 10, 30, PAL.ink);
  cv.rect(x + 27, y + 20, 8, 18, PAL.navy2);
  for (let wy = y + 12; wy < y + 34; wy += 6) {
    for (const wx of [x + 7, x + 17, x + 29]) {
      cv.rect(wx, wy, 3, 3, PAL.goldSoft);
    }
  }
  cv.line(x + 4, y + 38, x + 36, y + 38, PAL.ink, 1);
}

// ---- world map ----------------------------------------------------------
// Rough continent outlines in [lon, lat]; equirectangular projection.
const CONTINENTS: [number, number][][] = [
  // North America
  [[-168, 66], [-140, 70], [-120, 72], [-95, 80], [-80, 73], [-60, 60], [-55, 47], [-70, 42], [-75, 35], [-80, 26], [-85, 20], [-95, 16], [-105, 20], [-115, 28], [-125, 40], [-125, 49], [-140, 60], [-165, 60]],
  // Greenland
  [[-55, 60], [-40, 65], [-30, 70], [-20, 76], [-30, 80], [-55, 78], [-58, 70]],
  // South America
  [[-80, 9], [-75, 10], [-60, 8], [-50, 0], [-35, -8], [-40, -20], [-48, -28], [-58, -35], [-65, -42], [-70, -50], [-70, -55], [-75, -45], [-75, -30], [-70, -18], [-80, -5]],
  // Africa
  [[-17, 15], [-10, 30], [0, 35], [10, 37], [20, 32], [32, 31], [35, 28], [40, 15], [48, 11], [51, 10], [45, 0], [40, -10], [35, -20], [30, -30], [20, -35], [15, -30], [12, -18], [9, -1], [9, 4], [-8, 4], [-13, 8]],
  // Eurasia
  [[-10, 36], [-9, 43], [-2, 48], [-4, 50], [2, 51], [5, 53], [8, 57], [10, 59], [18, 56], [21, 55], [24, 59], [28, 60], [30, 62], [32, 70], [40, 68], [55, 70], [70, 72], [90, 75], [110, 76], [130, 72], [150, 70], [170, 66], [178, 65], [170, 60], [162, 56], [158, 52], [142, 50], [140, 45], [135, 42], [130, 38], [127, 35], [122, 32], [120, 28], [110, 20], [108, 12], [105, 8], [100, 6], [97, 10], [92, 15], [88, 22], [80, 15], [76, 8], [72, 20], [66, 25], [60, 25], [57, 26], [52, 28], [50, 30], [48, 30], [44, 29], [40, 32], [36, 36], [30, 36], [26, 38], [22, 36], [19, 40], [12, 44], [8, 44], [3, 42], [0, 38], [-2, 37], [-6, 36]],
  // Australia
  [[113, -22], [114, -30], [115, -35], [120, -34], [129, -32], [132, -32], [137, -35], [140, -38], [145, -38], [150, -37], [153, -32], [153, -27], [150, -22], [146, -19], [142, -15], [142, -11], [136, -12], [132, -11], [126, -14], [122, -17], [118, -20]],
  // Britain
  [[-5, 50], [-3, 53], [-5, 56], [-3, 58], [-1, 57], [0, 53], [1, 51]],
  // Japan
  [[130, 31], [132, 33], [135, 34], [137, 35], [139, 37], [141, 39], [141, 41], [143, 42], [145, 44], [142, 44], [140, 40], [139, 38], [137, 36], [134, 34], [131, 33]],
  // Indonesia
  [[95, 5], [100, 0], [105, -5], [110, -7], [115, -8], [120, -10], [125, -9], [130, -5], [135, -4], [140, -8], [138, -2], [132, 0], [128, 2], [122, 0], [115, 2]],
  // New Zealand
  [[167, -45], [170, -42], [174, -39], [176, -38], [178, -37], [175, -40], [172, -42], [168, -46]],
];

export function drawMap(
  cv: Canvas, x: number, y: number, w: number, h: number,
): (lon: number, lat: number) => [number, number] {
  cv.rect(x, y, w, h, [210, 224, 232]);
  // graticule
  for (let lon = -150; lon <= 150; lon += 30) {
    const gx = x + Math.round(((lon + 180) / 360) * w);
    for (let yy = y; yy < y + h; yy += 3) cv.px(gx, yy, [190, 200, 212]);
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    const gy = y + Math.round(((90 - lat) / 180) * h);
    for (let xx = x; xx < x + w; xx += 3) cv.px(xx, gy, [190, 200, 212]);
  }
  const proj = (lon: number, lat: number): [number, number] => [
    x + Math.round(((lon + 180) / 360) * w),
    // crop the latitude range to -60..85 so the continents use the
    // strip's height instead of flattening into a ribbon
    y + Math.round(((85 - lat) / 145) * h),
  ];
  for (const cont of CONTINENTS) {
    const pts = cont.map(([lo, la]) => proj(lo, la));
    cv.poly(pts, [196, 178, 128]);
    cv.polyLine(pts, [90, 78, 55]);
  }
  // equator
  const [, ey] = proj(0, 0);
  cv.line(x, ey, x + w, ey, [150, 140, 110], 1);
  return proj;
}

export function drawPin(cv: Canvas, x: number, y: number, n: number, c: RGB, fg: RGB): void {
  cv.circle(x, y, 6, c, true);
  cv.circle(x, y, 6, PAL.ink, false);
  cv.px(x, y, fg);
  void n;
}
