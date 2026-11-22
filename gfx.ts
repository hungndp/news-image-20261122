// gfx.ts — own tiny graphics kit for the 22 Nov 2026 poster.
// Canvas over a raw RGB buffer, a hand-built 5x7 bitmap font
// (uppercase + digits + punctuation, drawn from a glyph table I
// wrote for this build), deterministic seeded grain/halftone, and
// a minimal PNG encoder (zlib deflate, CRC32). No assets, no
// network, no randomness outside fixed seeds: two runs are
// byte-identical.
import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

export type RGB = [number, number, number];

// ---- deterministic PRNG (mulberry32) --------------------------------
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- CRC32 -----------------------------------------------------------
const CRC_TABLE: number[] = (() => {
  const t: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t.push(c >>> 0);
  }
  return t;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td), 0);
  return Buffer.concat([len, td, crc]);
}

// ---- 5x7 bitmap font --------------------------------------------------
// Each glyph is 7 rows of 5 cells ('#' on, '.' off). Written from
// the classic 5x7 letterforms; only uppercase, digits and the
// punctuation the poster uses.
const FONT: Record<string, string[]> = {
  A: [".###.", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  B: ["####.", "#...#", "#...#", "####.", "#...#", "#...#", "####."],
  C: [".####", "#....", "#....", "#....", "#....", "#....", ".####"],
  D: ["####.", "#...#", "#...#", "#...#", "#...#", "#...#", "####."],
  E: ["#####", "#....", "#....", "####.", "#....", "#....", "#####"],
  F: ["#####", "#....", "#....", "####.", "#....", "#....", "#...."],
  G: [".####", "#....", "#....", "#.###", "#...#", "#...#", ".###."],
  H: ["#...#", "#...#", "#...#", "#####", "#...#", "#...#", "#...#"],
  I: [".###.", "..#..", "..#..", "..#..", "..#..", "..#..", ".###."],
  J: ["..###", "...#.", "...#.", "...#.", "...#.", "#..#.", ".##.."],
  K: ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
  L: ["#....", "#....", "#....", "#....", "#....", "#....", "#####"],
  M: ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
  N: ["#...#", "##..#", "#.#.#", "#..##", "#...#", "#...#", "#...#"],
  O: [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  P: ["####.", "#...#", "#...#", "####.", "#....", "#....", "#...."],
  Q: [".###.", "#...#", "#...#", "#...#", "#.#.#", "#..#.", ".##.#"],
  R: ["####.", "#...#", "#...#", "####.", "#.#..", "#..#.", "#...#"],
  S: [".####", "#....", "#....", ".###.", "....#", "....#", "####."],
  T: ["#####", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  U: ["#...#", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
  V: ["#...#", "#...#", "#...#", "#...#", "#...#", ".#.#.", "..#.."],
  W: ["#...#", "#...#", "#...#", "#.#.#", "#.#.#", "##.##", "#...#"],
  X: ["#...#", ".#.#.", "..#..", "..#..", "..#..", ".#.#.", "#...#"],
  Y: ["#...#", "#...#", ".#.#.", "..#..", "..#..", "..#..", "..#.."],
  Z: ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],
  "0": [".###.", "#...#", "#..##", "#.#.#", "##..#", "#...#", ".###."],
  "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
  "2": [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
  "3": ["####.", "....#", "....#", ".###.", "....#", "....#", "####."],
  "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
  "5": ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
  "6": [".###.", "#....", "#....", "####.", "#...#", "#...#", ".###."],
  "7": ["#####", "....#", "...#.", "...#.", "..#..", "..#..", "..#.."],
  "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
  "9": [".###.", "#...#", "#...#", ".####", "....#", "....#", ".###."],
  " ": [".....", ".....", ".....", ".....", ".....", ".....", "....."],
  ".": [".....", ".....", ".....", ".....", ".....", ".....", ".##.."],
  ",": [".....", ".....", ".....", ".....", ".....", "..#..", ".#..."],
  ":": [".....", "..#..", ".....", ".....", ".....", "..#..", "....."],
  ";": [".....", "..#..", ".....", ".....", "..#..", ".#...", "....."],
  "-": [".....", ".....", ".....", "#####", ".....", ".....", "....."],
  "'": ["..#..", "..#..", ".....", ".....", ".....", ".....", "....."],
  "/": ["....#", "...#.", "...#.", "..#..", ".#...", ".#...", "#...."],
  "(": ["...#.", "..#..", ".#...", ".#...", ".#...", "..#..", "...#."],
  ")": [".#...", "..#..", "...#.", "...#.", "...#.", "..#..", ".#..."],
  "%": ["#...#", "#..#.", "...#.", "..#..", ".#...", "#..#.", "#...#"],
  "+": [".....", "..#..", "..#..", "#####", "..#..", "..#..", "....."],
  "=": [".....", ".....", "#####", ".....", "#####", ".....", "....."],
  "&": [".###.", "#...#", "#...#", ".#...", "#.#.#", "#..#.", ".##.#"],
  "!": ["..#..", "..#..", "..#..", "..#..", "..#..", ".....", "..#.."],
  "?": [".###.", "#...#", "....#", "...#.", "..#..", ".....", "..#.."],
  '"': [".#.#.", ".#.#.", ".....", ".....", ".....", ".....", "....."],
  "[": [".###.", ".#...", ".#...", ".#...", ".#...", ".#...", ".###."],
  "]": [".###.", "...#.", "...#.", "...#.", "...#.", "...#.", ".###."],
  $: ["..#..", ".####", "#.#.#", ".#.#.", "..###", "..#..", "....."],
  ">": ["#....", ".#...", "..#..", "...#.", "..#..", ".#...", "#...."],
  "<": ["....#", "...#.", "..#..", ".#...", "..#..", "...#.", "....#"],
  "*": [".....", ".#.#.", "..#..", "#####", "..#..", ".#.#.", "....."],
  _: [".....", ".....", ".....", ".....", ".....", ".....", "#####"],
  "@": [".###.", "#...#", "#.###", "#.#.#", "#.###", "#....", ".###."],
  "|": ["..#..", "..#..", "..#..", "..#..", "..#..", "..#..", "..#.."],
  "\\": ["#....", "#....", ".#...", "..#..", "...#.", "....#", "....#"],
};

export function charWidth(scale: number): number {
  return 6 * scale;
}

export function textWidth(s: string, scale: number): number {
  let w = 0;
  for (const ch of s) w += ch === " " ? 6 * scale : 6 * scale;
  return w === 0 ? 0 : w - scale; // no trailing gap
}

// Word-wrap a string to lines of at most `cols` characters.
export function wrap(s: string, cols: number): string[] {
  const words = s.split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (cur === "") cur = w;
    else if (cur.length + 1 + w.length <= cols) cur += " " + w;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur !== "") lines.push(cur);
  return lines;
}

// ---- canvas -----------------------------------------------------------
export class Canvas {
  w: number;
  h: number;
  buf: Uint8Array;

  constructor(w: number, h: number, bg: RGB) {
    this.w = w;
    this.h = h;
    this.buf = new Uint8Array(w * h * 3);
    for (let i = 0; i < w * h; i++) {
      this.buf[i * 3] = bg[0];
      this.buf[i * 3 + 1] = bg[1];
      this.buf[i * 3 + 2] = bg[2];
    }
  }

  px(x: number, y: number, c: RGB): void {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 3;
    this.buf[i] = c[0];
    this.buf[i + 1] = c[1];
    this.buf[i + 2] = c[2];
  }

  get(x: number, y: number): RGB {
    const i = (y * this.w + x) * 3;
    return [this.buf[i], this.buf[i + 1], this.buf[i + 2]];
  }

  rect(x: number, y: number, w: number, h: number, c: RGB): void {
    const x0 = Math.max(0, x), y0 = Math.max(0, y);
    const x1 = Math.min(this.w, x + w), y1 = Math.min(this.h, y + h);
    for (let yy = y0; yy < y1; yy++) {
      for (let xx = x0; xx < x1; xx++) {
        const i = (yy * this.w + xx) * 3;
        this.buf[i] = c[0]; this.buf[i + 1] = c[1]; this.buf[i + 2] = c[2];
      }
    }
  }

  // alpha-blend a translucent rect (a in 0..1)
  blendRect(x: number, y: number, w: number, h: number, c: RGB, a: number): void {
    const x0 = Math.max(0, x), y0 = Math.max(0, y);
    const x1 = Math.min(this.w, x + w), y1 = Math.min(this.h, y + h);
    for (let yy = y0; yy < y1; yy++) {
      for (let xx = x0; xx < x1; xx++) {
        const i = (yy * this.w + xx) * 3;
        this.buf[i] = Math.round(this.buf[i] * (1 - a) + c[0] * a);
        this.buf[i + 1] = Math.round(this.buf[i + 1] * (1 - a) + c[1] * a);
        this.buf[i + 2] = Math.round(this.buf[i + 2] * (1 - a) + c[2] * a);
      }
    }
  }

  frame(x: number, y: number, w: number, h: number, c: RGB, t = 1): void {
    this.rect(x, y, w, t, c);
    this.rect(x, y + h - t, w, t, c);
    this.rect(x, y, t, h, c);
    this.rect(x + w - t, y, t, h, c);
  }

  line(x0: number, y0: number, x1: number, y1: number, c: RGB, t = 1): void {
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    let x = x0, y = y0;
    for (let guard = 0; guard < 4096; guard++) {
      if (t === 1) this.px(x, y, c);
      else this.rect(x - Math.floor(t / 2), y - Math.floor(t / 2), t, t, c);
      if (x === x1 && y === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x += sx; }
      if (e2 < dx) { err += dx; y += sy; }
    }
  }

  circle(cx: number, cy: number, r: number, c: RGB, filled: boolean): void {
    if (filled) {
      for (let y = -r; y <= r; y++) {
        const half = Math.floor(Math.sqrt(r * r - y * y));
        this.rect(cx - half, cy + y, half * 2 + 1, 1, c);
      }
    } else {
      for (let a = 0; a < 360; a += 2) {
        const rad = (a * Math.PI) / 180;
        this.px(Math.round(cx + r * Math.cos(rad)), Math.round(cy + r * Math.sin(rad)), c);
      }
    }
  }

  // deterministic paper grain: speckles of two tones
  grain(x: number, y: number, w: number, h: number, seed: number, dark: RGB, light: RGB): void {
    const r = rng(seed);
    const n = Math.floor(w * h * 0.02);
    for (let i = 0; i < n; i++) {
      const px = x + Math.floor(r() * w);
      const py = y + Math.floor(r() * h);
      this.px(px, py, r() < 0.5 ? dark : light);
    }
  }

  // halftone dot field, deterministic
  halftone(x: number, y: number, w: number, h: number, c: RGB, a: number): void {
    const step = 4;
    for (let yy = y; yy < y + h; yy += step) {
      for (let xx = x; xx < x + w; xx += step) {
        if (((xx + yy) / step) % 2 === 0) this.blendRect(xx, yy, 1, 1, c, a);
      }
    }
  }

  // newsprint texture: a small deterministic luminance jitter over
  // 2x2 blocks, applied last so the whole sheet carries fibre.
  // `amount` caps the per-channel shift, `p` the block coverage.
  texture(seed: number, amount: number, p: number): void {
    const r = rng(seed);
    for (let y = 0; y < this.h; y += 2) {
      for (let x = 0; x < this.w; x += 2) {
        if (r() >= p) continue;
        const d = Math.floor((r() * 2 - 1) * amount);
        for (let dy = 0; dy < 2 && y + dy < this.h; dy++) {
          for (let dx = 0; dx < 2 && x + dx < this.w; dx++) {
            const i = ((y + dy) * this.w + (x + dx)) * 3;
            for (let k = 0; k < 3; k++) {
              const v = this.buf[i + k] + d;
              this.buf[i + k] = v < 0 ? 0 : v > 255 ? 255 : v;
            }
          }
        }
      }
    }
  }

  // filled polygon (scanline fill, deterministic)
  poly(pts: [number, number][], c: RGB): void {
    let minY = Infinity, maxY = -Infinity;
    for (const [, y] of pts) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
    for (let y = Math.ceil(minY); y <= Math.floor(maxY); y++) {
      const xs: number[] = [];
      for (let i = 0; i < pts.length; i++) {
        const [x0, y0] = pts[i];
        const [x1, y1] = pts[(i + 1) % pts.length];
        if ((y0 <= y && y1 > y) || (y1 <= y && y0 > y)) {
          xs.push(x0 + ((y - y0) / (y1 - y0)) * (x1 - x0));
        }
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        this.rect(Math.ceil(xs[k]), y, Math.floor(xs[k + 1]) - Math.ceil(xs[k]) + 1, 1, c);
      }
    }
  }

  polyLine(pts: [number, number][], c: RGB): void {
    for (let i = 0; i < pts.length; i++) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[(i + 1) % pts.length];
      this.line(Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1), c, 1);
    }
  }
}

// ---- text --------------------------------------------------------------
export function drawText(cv: Canvas, x: number, y: number, s: string, scale: number, c: RGB): void {
  let cx = x;
  const up = s.toUpperCase();
  for (const ch of up) {
    const g = FONT[ch] ?? FONT["?"];
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (g[row][col] === "#") {
          cv.rect(cx + col * scale, y + row * scale, scale, scale, c);
        }
      }
    }
    cx += 6 * scale;
  }
}

// ---- PNG encode ---------------------------------------------------------
export function savePNG(cv: Canvas, path: string): number {
  const raw = Buffer.alloc((cv.w * 3 + 1) * cv.h);
  for (let y = 0; y < cv.h; y++) {
    raw[y * (cv.w * 3 + 1)] = 0; // filter: none
    Buffer.from(cv.buf.buffer, y * cv.w * 3, cv.w * 3).copy(raw, y * (cv.w * 3 + 1) + 1);
  }
  const idat = deflateSync(raw, { level: 9 });
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(cv.w, 0);
  ihdr.writeUInt32BE(cv.h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type RGB
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  writeFileSync(path, png);
  return png.length;
}
