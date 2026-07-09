import { useMemo } from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { colors, radii, nativeShadows } from '@lockin90/tokens';

export interface QRCodeProps {
  /** The encoded payload (e.g. an `otpauth://` URI or a URL). */
  value: string;
  /** Rendered side length in px (the QR is square). Default 180. */
  size?: number;
  /** Optional container style (margins/spacing). */
  style?: StyleProp<ViewStyle>;
}

/* ============================================================================
 * Dependency-free QR Code encoder — QR Model 2, byte mode.
 * Ported verbatim from the web `@lockin90/ui` QRCode encoder (pure TS, no DOM):
 * data encoding (byte mode), Reed–Solomon error correction, finder/alignment/
 * timing patterns, format + version info, all 8 data masks with penalty-based
 * mask selection, and automatic version sizing. Rendered here with
 * `react-native-svg` instead of a DOM SVG. Self-contained — no runtime deps.
 * ========================================================================== */

type ECLevel = 'L' | 'M' | 'Q' | 'H';

// --- Galois field GF(256) tables (generator 0x11d) -------------------------
const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
})();

function gfMul(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

// Reed–Solomon: compute `ecCount` error-correction codewords for `data`.
function rsEncode(data: number[], ecCount: number): number[] {
  // Build the generator polynomial g(x) = ∏ (x + α^i), i = 0..ecCount-1,
  // stored leading-coefficient-first: gen[0] = 1 (x^ecCount), gen[ecCount] = const.
  let gen = [1];
  for (let i = 0; i < ecCount; i++) {
    // Multiply gen by (x + α^i): shift (×x) then add α^i × gen.
    const next = new Array<number>(gen.length + 1).fill(0);
    for (let j = 0; j < gen.length; j++) {
      next[j] ^= gen[j]; // × x  (degree up)
      next[j + 1] ^= gfMul(gen[j], GF_EXP[i]); // + α^i × gen
    }
    gen = next;
  }
  // Polynomial long division of (data · x^ecCount) by gen; the remainder is the EC.
  const res = new Array<number>(ecCount).fill(0);
  for (let i = 0; i < data.length; i++) {
    const factor = data[i] ^ res[0];
    res.shift();
    res.push(0);
    if (factor !== 0) {
      // gen[0] is the leading 1 (already eliminated by the shift); apply gen[1..].
      for (let j = 0; j < ecCount; j++) res[j] ^= gfMul(gen[j + 1], factor);
    }
  }
  return res;
}

// --- Per-version error-correction parameters (versions 1..10) --------------
// Each entry: [ecCodewordsPerBlock, [group1Blocks, group1DataCw], [group2Blocks, group2DataCw]]
// Source: ISO/IEC 18004 EC characteristics tables.
type ECParams = [number, [number, number], [number, number]];
const EC_TABLE: Record<ECLevel, ECParams[]> = {
  L: [
    [7, [1, 19], [0, 0]],
    [10, [1, 34], [0, 0]],
    [15, [1, 55], [0, 0]],
    [20, [1, 80], [0, 0]],
    [26, [1, 108], [0, 0]],
    [18, [2, 68], [0, 0]],
    [20, [2, 78], [0, 0]],
    [24, [2, 97], [0, 0]],
    [30, [2, 116], [0, 0]],
    [18, [2, 68], [2, 69]],
  ],
  M: [
    [10, [1, 16], [0, 0]],
    [16, [1, 28], [0, 0]],
    [26, [1, 44], [0, 0]],
    [18, [2, 32], [0, 0]],
    [24, [2, 43], [0, 0]],
    [16, [4, 27], [0, 0]],
    [18, [4, 31], [0, 0]],
    [22, [2, 38], [2, 39]],
    [22, [3, 36], [2, 37]],
    [26, [4, 43], [1, 44]],
  ],
  Q: [
    [13, [1, 13], [0, 0]],
    [22, [1, 22], [0, 0]],
    [18, [2, 17], [0, 0]],
    [26, [2, 24], [0, 0]],
    [18, [2, 15], [2, 16]],
    [24, [4, 19], [0, 0]],
    [18, [2, 14], [4, 15]],
    [22, [4, 18], [2, 19]],
    [20, [4, 16], [4, 17]],
    [24, [6, 19], [2, 20]],
  ],
  H: [
    [17, [1, 9], [0, 0]],
    [28, [1, 16], [0, 0]],
    [22, [2, 13], [0, 0]],
    [16, [4, 9], [0, 0]],
    [22, [2, 11], [2, 12]],
    [28, [4, 15], [0, 0]],
    [26, [4, 13], [1, 14]],
    [26, [4, 14], [2, 15]],
    [24, [4, 12], [4, 13]],
    [28, [6, 15], [2, 16]],
  ],
};

const EC_ORDER: ECLevel[] = ['L', 'M', 'Q', 'H'];

// Alignment-pattern center coordinates per version (1..10).
const ALIGN_POS: number[][] = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

function totalDataCodewords(level: ECLevel, version: number): number {
  const [, g1, g2] = EC_TABLE[level][version - 1];
  return g1[0] * g1[1] + g2[0] * g2[1];
}

// Pick the smallest version (1..10) whose capacity (in byte mode) holds the data.
function chooseVersion(byteLen: number, level: ECLevel): number | null {
  for (let v = 1; v <= 10; v++) {
    const dataCw = totalDataCodewords(level, v);
    const charCountBits = v < 10 ? 8 : 16; // byte mode: 8 bits for v1..9, 16 for v10+
    const capacityBits = dataCw * 8;
    const neededBits = 4 + charCountBits + byteLen * 8;
    if (neededBits <= capacityBits) return v;
  }
  return null;
}

// --- Bit buffer ------------------------------------------------------------
class BitBuffer {
  bits: number[] = [];
  put(value: number, length: number) {
    for (let i = length - 1; i >= 0; i--) this.bits.push((value >>> i) & 1);
  }
}

function utf8Bytes(str: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < str.length; i++) {
    let code = str.charCodeAt(i);
    if (code >= 0xd800 && code <= 0xdbff && i + 1 < str.length) {
      const next = str.charCodeAt(i + 1);
      if (next >= 0xdc00 && next <= 0xdfff) {
        code = 0x10000 + ((code - 0xd800) << 10) + (next - 0xdc00);
        i++;
      }
    }
    if (code < 0x80) out.push(code);
    else if (code < 0x800) out.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    else if (code < 0x10000)
      out.push(0xe0 | (code >> 12), 0x80 | ((code >> 6) & 0x3f), 0x80 | (code & 0x3f));
    else
      out.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f),
      );
  }
  return out;
}

// Build the full codeword stream (data + EC, interleaved per spec).
function buildCodewords(data: number[], level: ECLevel, version: number): number[] {
  const bb = new BitBuffer();
  const charCountBits = version < 10 ? 8 : 16;
  bb.put(0b0100, 4); // byte mode indicator
  bb.put(data.length, charCountBits);
  for (const b of data) bb.put(b, 8);

  const totalDataCw = totalDataCodewords(level, version);
  const capacityBits = totalDataCw * 8;
  // Terminator (up to 4 zero bits).
  const remaining = capacityBits - bb.bits.length;
  bb.put(0, Math.min(4, remaining));
  // Pad to a byte boundary.
  while (bb.bits.length % 8 !== 0) bb.bits.push(0);
  // Fill with alternating pad bytes.
  const padBytes = [0xec, 0x11];
  let pi = 0;
  while (bb.bits.length < capacityBits) {
    bb.put(padBytes[pi % 2], 8);
    pi++;
  }

  // Slice bits into data codewords.
  const dataCw: number[] = [];
  for (let i = 0; i < bb.bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bb.bits[i + j];
    dataCw.push(byte);
  }

  // Split into blocks per EC table, compute EC per block.
  const [ecPerBlock, g1, g2] = EC_TABLE[level][version - 1];
  const blocks: { data: number[]; ec: number[] }[] = [];
  let offset = 0;
  const groups = [g1, g2];
  for (const [count, sizeCw] of groups) {
    for (let b = 0; b < count; b++) {
      const blockData = dataCw.slice(offset, offset + sizeCw);
      offset += sizeCw;
      blocks.push({ data: blockData, ec: rsEncode(blockData, ecPerBlock) });
    }
  }

  // Interleave data codewords.
  const result: number[] = [];
  const maxData = Math.max(...blocks.map((b) => b.data.length));
  for (let i = 0; i < maxData; i++)
    for (const blk of blocks) if (i < blk.data.length) result.push(blk.data[i]);
  // Interleave EC codewords.
  for (let i = 0; i < ecPerBlock; i++) for (const blk of blocks) result.push(blk.ec[i]);

  return result;
}

// --- Matrix construction ---------------------------------------------------
type Cell = -1 | 0 | 1; // -1 = unset
function makeMatrix(size: number): Cell[][] {
  return Array.from({ length: size }, () => new Array<Cell>(size).fill(-1));
}

function placeFinder(m: Cell[][], reserved: boolean[][], row: number, col: number) {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const rr = row + r;
      const cc = col + c;
      if (rr < 0 || rr >= m.length || cc < 0 || cc >= m.length) continue;
      const isBorder = r === -1 || r === 7 || c === -1 || c === 7;
      const inRing = r >= 0 && r <= 6 && c >= 0 && c <= 6 && (r === 0 || r === 6 || c === 0 || c === 6);
      const inCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      m[rr][cc] = isBorder ? 0 : inRing || inCore ? 1 : 0;
      reserved[rr][cc] = true;
    }
  }
}

function placeAlignment(m: Cell[][], reserved: boolean[][], cx: number, cy: number) {
  for (let r = -2; r <= 2; r++) {
    for (let c = -2; c <= 2; c++) {
      const ring = Math.max(Math.abs(r), Math.abs(c));
      m[cy + r][cx + c] = ring === 1 ? 0 : 1;
      reserved[cy + r][cx + c] = true;
    }
  }
}

const BCH_FORMAT = 0x537; // format-info BCH(15,5) generator
function formatInfoBits(level: ECLevel, mask: number): number {
  const ecBits: Record<ECLevel, number> = { L: 0b01, M: 0b00, Q: 0b11, H: 0b10 };
  const data = (ecBits[level] << 3) | mask; // 5 bits
  let rem = data << 10;
  for (let i = 14; i >= 10; i--) if ((rem >> i) & 1) rem ^= BCH_FORMAT << (i - 10);
  return ((data << 10) | rem) ^ 0b101010000010010; // XOR mask
}

const BCH_VERSION = 0x1f25; // version-info BCH(18,6) generator
// 18-bit version information (only used for versions 7..40).
function versionInfoBits(version: number): number {
  let rem = version << 12;
  for (let i = 17; i >= 12; i--) if ((rem >> i) & 1) rem ^= BCH_VERSION << (i - 12);
  return (version << 12) | rem;
}

function maskFn(mask: number, r: number, c: number): boolean {
  switch (mask) {
    case 0: return (r + c) % 2 === 0;
    case 1: return r % 2 === 0;
    case 2: return c % 3 === 0;
    case 3: return (r + c) % 3 === 0;
    case 4: return (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0;
    case 5: return ((r * c) % 2) + ((r * c) % 3) === 0;
    case 6: return (((r * c) % 2) + ((r * c) % 3)) % 2 === 0;
    default: return (((r + c) % 2) + ((r * c) % 3)) % 2 === 0;
  }
}

// Penalty scoring for mask selection (ISO 18004 §8.8.2).
function penalty(m: Cell[][]): number {
  const n = m.length;
  let score = 0;
  // Rule 1: runs of 5+ same-color in a row/column.
  for (let r = 0; r < n; r++) {
    let runC = 1, runR = 1;
    for (let c = 1; c < n; c++) {
      if (m[r][c] === m[r][c - 1]) { runC++; if (runC === 5) score += 3; else if (runC > 5) score += 1; }
      else runC = 1;
      if (m[c][r] === m[c - 1][r]) { runR++; if (runR === 5) score += 3; else if (runR > 5) score += 1; }
      else runR = 1;
    }
  }
  // Rule 2: 2x2 blocks of the same color.
  for (let r = 0; r < n - 1; r++)
    for (let c = 0; c < n - 1; c++)
      if (m[r][c] === m[r][c + 1] && m[r][c] === m[r + 1][c] && m[r][c] === m[r + 1][c + 1]) score += 3;
  // Rule 3: finder-like 1:1:3:1:1 patterns.
  const pat1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
  const pat2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
  for (let r = 0; r < n; r++) {
    for (let c = 0; c <= n - 11; c++) {
      let h1 = true, h2 = true, v1 = true, v2 = true;
      for (let k = 0; k < 11; k++) {
        if (m[r][c + k] !== pat1[k]) h1 = false;
        if (m[r][c + k] !== pat2[k]) h2 = false;
        if (m[c + k][r] !== pat1[k]) v1 = false;
        if (m[c + k][r] !== pat2[k]) v2 = false;
      }
      if (h1) score += 40;
      if (h2) score += 40;
      if (v1) score += 40;
      if (v2) score += 40;
    }
  }
  // Rule 4: dark/light balance.
  let dark = 0;
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (m[r][c] === 1) dark++;
  const ratio = (dark * 100) / (n * n);
  score += Math.floor(Math.abs(ratio - 50) / 5) * 10;
  return score;
}

interface QRMatrix {
  size: number;
  modules: boolean[][]; // true = dark
}

function encodeQR(value: string): QRMatrix {
  const data = utf8Bytes(value);
  // Choose the smallest level that fits at the smallest version; prefer M (then L).
  let level: ECLevel = 'M';
  let version = chooseVersion(data.length, 'M');
  if (version === null) {
    for (const lvl of EC_ORDER) {
      const v = chooseVersion(data.length, lvl);
      if (v !== null) { level = lvl; version = v; break; }
    }
  }
  if (version === null) {
    // Beyond v10 capacity — fall back to the largest supported config.
    level = 'L';
    version = 10;
  }

  const size = version * 4 + 17;
  const m = makeMatrix(size);
  const reserved: boolean[][] = Array.from({ length: size }, () => new Array<boolean>(size).fill(false));

  // Finder patterns + separators.
  placeFinder(m, reserved, 0, 0);
  placeFinder(m, reserved, 0, size - 7);
  placeFinder(m, reserved, size - 7, 0);

  // Timing patterns (the continuous alternating lines on row 6 and col 6,
  // spanning between the finders). Placed first so the format reservation
  // below can't clobber the cells where the timing line meets row/col 8.
  for (let i = 8; i < size - 8; i++) {
    m[6][i] = i % 2 === 0 ? 1 : 0;
    reserved[6][i] = true;
    m[i][6] = i % 2 === 0 ? 1 : 0;
    reserved[i][6] = true;
  }

  // Reserve format-info areas (around the top-left finder + mirrored copies),
  // skipping index 6 which belongs to the timing pattern, not format.
  for (let i = 0; i < 9; i++) {
    if (i !== 6) {
      reserved[8][i] = true;
      reserved[i][8] = true;
    }
  }
  for (let i = 0; i < 8; i++) {
    reserved[8][size - 1 - i] = true;
    reserved[size - 1 - i][8] = true;
  }

  // Alignment patterns — at every center-coordinate pair EXCEPT the three that
  // collide with the finder patterns (top-left, top-right, bottom-left corners).
  // Centers on the timing row/col (index 6) are still valid and must be drawn.
  const centers = ALIGN_POS[version - 1];
  const last = centers.length - 1;
  for (let yi = 0; yi < centers.length; yi++) {
    for (let xi = 0; xi < centers.length; xi++) {
      const isFinderCorner =
        (yi === 0 && xi === 0) || // top-left
        (yi === 0 && xi === last) || // top-right
        (yi === last && xi === 0); // bottom-left
      if (isFinderCorner) continue;
      placeAlignment(m, reserved, centers[xi], centers[yi]);
    }
  }

  // Version information (versions 7+): two 6×3 BCH blocks near the top-right
  // and bottom-left finders.
  if (version >= 7) {
    const vbits = versionInfoBits(version);
    for (let i = 0; i < 18; i++) {
      const bit = ((vbits >> i) & 1) as Cell;
      const r = Math.floor(i / 3);
      const c = i % 3;
      // Bottom-left block.
      m[size - 11 + c][r] = bit;
      reserved[size - 11 + c][r] = true;
      // Top-right block (mirrored).
      m[r][size - 11 + c] = bit;
      reserved[r][size - 11 + c] = true;
    }
  }

  // Dark module.
  m[size - 8][8] = 1;
  reserved[size - 8][8] = true;

  // Place data bits in zig-zag (skipping reserved + the vertical timing column).
  const codewords = buildCodewords(data, level, version);
  const bitStream: number[] = [];
  for (const cw of codewords) for (let b = 7; b >= 0; b--) bitStream.push((cw >> b) & 1);

  let bitIdx = 0;
  let upward = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col = 5; // skip the vertical timing column
    for (let i = 0; i < size; i++) {
      const row = upward ? size - 1 - i : i;
      for (let c = 0; c < 2; c++) {
        const cc = col - c;
        if (reserved[row][cc]) continue;
        m[row][cc] = bitIdx < bitStream.length ? ((bitStream[bitIdx] as Cell)) : 0;
        bitIdx++;
      }
    }
    upward = !upward;
  }

  // Apply each of the 8 masks to a copy, score it, keep the lowest-penalty one.
  let bestScore = Infinity;
  let bestMatrix: Cell[][] = m;
  for (let mask = 0; mask < 8; mask++) {
    const test = m.map((row) => row.slice()) as Cell[][];
    for (let r = 0; r < size; r++)
      for (let c = 0; c < size; c++)
        if (!reserved[r][c] && maskFn(mask, r, c)) test[r][c] = (test[r][c] ^ 1) as Cell;
    // Write this mask's format info before scoring (format encodes the mask id).
    writeFormatInfo(test, level, mask, size);
    const sc = penalty(test);
    if (sc < bestScore) { bestScore = sc; bestMatrix = test; }
  }

  const modules: boolean[][] = bestMatrix.map((row) => row.map((cell) => cell === 1));
  return { size, modules };
}

function writeFormatInfo(m: Cell[][], level: ECLevel, mask: number, size: number) {
  const bits = formatInfoBits(level, mask); // 15 bits (b14..b0)
  for (let i = 0; i < 15; i++) {
    // Position i (0 = nearest the corner) carries the MSB-first bit (14 - i).
    const bit = ((bits >> (14 - i)) & 1) as Cell;
    // Copy 1 — around the top-left finder: horizontal along row 8, then up col 8.
    if (i < 6) m[8][i] = bit;
    else if (i < 8) m[8][i + 1] = bit; // skip the timing column at col 6
    else if (i === 8) m[7][8] = bit;
    else m[14 - i][8] = bit;
    // Copy 2 — vertical up the right edge (i<7), then horizontal along the
    // bottom edge of row 8. (Row size-8 is the dark module, not a format cell.)
    if (i < 7) m[size - 1 - i][8] = bit;
    else m[8][size - 15 + i] = bit;
  }
}

/** A real, scannable QR code rendered as crisp `react-native-svg` modules —
 *  dependency-free (QR Model 2, byte mode, Reed–Solomon ECC, auto mask +
 *  version sizing). The native twin of the web `@lockin90/ui` `QRCode`, reusing
 *  the identical pure-TS encoder. Used for MFA/TOTP enrolment cards and any
 *  "scan to open" payload. The light surface + near-black modules are fixed
 *  scan-contrast literals (functional, not theming); the card chrome is tokens. */
export function QRCode({ value, size = 180, style }: QRCodeProps) {
  const { count, path } = useMemo(() => {
    const { size: n, modules } = encodeQR(value);
    // 4-module quiet zone on every side (per spec).
    const quiet = 4;
    const dim = n + quiet * 2;
    let d = '';
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++)
        if (modules[r][c]) d += `M${c + quiet} ${r + quiet}h1v1h-1z`;
    return { count: dim, path: d };
  }, [value]);

  // Inner SVG side = card size minus the 11px inset gutter on each edge.
  const inner = Math.max(size - QUIET_PAD * 2, 0);

  return (
    <View
      style={[styles.card, { width: size, height: size }, style]}
      accessibilityRole="image"
      accessibilityLabel="QR code"
    >
      <Svg width={inner} height={inner} viewBox={`0 0 ${count} ${count}`}>
        <Rect x={0} y={0} width={count} height={count} fill={QR_BG} />
        <Path d={path} fill={QR_FG} />
      </Svg>
    </View>
  );
}

// Fixed scan-contrast literals (mirrors the web QRCode — functional, not theming).
const QR_BG = '#ffffff'; // quiet zone
const QR_FG = '#0a0a12'; // dark modules
const QR_SURFACE = '#eef1f8'; // light card surface
const QUIET_PAD = 11; // inset gutter

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: QUIET_PAD,
    borderRadius: radii.sm,
    backgroundColor: QR_SURFACE,
    borderWidth: 1,
    borderColor: colors.border2,
    ...nativeShadows.elev1,
  },
});
