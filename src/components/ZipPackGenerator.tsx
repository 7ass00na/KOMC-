"use client";
import { useState } from "react";

type FileEntry = { name: string; data: Uint8Array };

function le16(n: number, out: number[]) {
  out.push(n & 0xff, (n >> 8) & 0xff);
}
function le32(n: number, out: number[]) {
  out.push(n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff);
}

// CRC32 (IEEE 802.3) for ZIP
function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
}
const CRC_TABLE = makeCrcTable();
function crc32(buf: Uint8Array) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function createZip(files: FileEntry[]): Blob {
  const chunks: number[] = [];
  const central: number[] = [];
  const encoder = new TextEncoder();

  let offset = 0;
  for (const f of files) {
    const nameBytes = encoder.encode(f.name);
    const crc = crc32(f.data);
    const local: number[] = [];
    // Local file header
    le32(0x04034b50, local); // signature
    le16(20, local); // version needed
    le16(0, local); // flags
    le16(0, local); // compression (store)
    le16(0, local); // mod time (0)
    le16(0, local); // mod date (0)
    le32(crc, local); // CRC32
    le32(f.data.length, local); // compressed size
    le32(f.data.length, local); // uncompressed size
    le16(nameBytes.length, local); // file name length
    le16(0, local); // extra length
    // Append local header + name + data
    chunks.push(...local, ...nameBytes, ...Array.from(f.data));

    // Central directory header
    const cent: number[] = [];
    le32(0x02014b50, cent); // signature
    le16(20, cent); // version made by
    le16(20, cent); // version needed
    le16(0, cent); // flags
    le16(0, cent); // compression
    le16(0, cent); // mod time
    le16(0, cent); // mod date
    le32(crc, cent); // CRC32
    le32(f.data.length, cent); // compressed size
    le32(f.data.length, cent); // uncompressed size
    le16(nameBytes.length, cent); // file name length
    le16(0, cent); // extra length
    le16(0, cent); // comment length
    le16(0, cent); // disk number
    le16(0, cent); // internal attrs
    le32(0, cent); // external attrs
    le32(offset, cent); // local header offset
    central.push(...cent, ...nameBytes);

    offset = chunks.length;
  }

  const centralOffset = chunks.length;
  const centralSize = central.length;
  chunks.push(...central);

  // End of central directory record
  const end: number[] = [];
  le32(0x06054b50, end); // signature
  le16(0, end); // disk number
  le16(0, end); // start disk
  le16(files.length, end); // total entries on this disk
  le16(files.length, end); // total entries
  le32(centralSize, end); // size of central directory
  le32(centralOffset, end); // offset of central directory
  le16(0, end); // comment length
  chunks.push(...end);

  return new Blob([new Uint8Array(chunks)], { type: "application/zip" });
}

export default function ZipPackGenerator() {
  const [downloading, setDownloading] = useState(false);
  const generate = () => {
    setDownloading(true);
    const enc = new TextEncoder();
    const files: FileEntry[] = [];

    const prompt = `
Ultra-realistic 4K cinematic legal thriller for Khaled Omer Maritime Consultancy (KOMC).
Style: dramatic lighting, shallow depth of field (35mm f/1.4), slow-motion camera, trailer-style flash cuts (2–4-frame black frames), sound-driven transitions.
Palette: deep navy shadows, cool blue-grey midtones, crisp white and warm amber highlights.
Scenes (5x3s):
1) Court Order flash → Container ship arrival in fog; HUD overlay (Vessel, Coordinates, Status: UNDER LEGAL REVIEW); slow aerial drift.
2) Office micro-shots: cufflinks, signature, case review, confident nod; warm controlled lighting; glass reflections; shallow DOF.
3) Dockside seizure: impact cut; coast guard lights; slow-mo footsteps; lawyer raises SEIZURE ORDER; officers move; brief dissolving clauses.
4) Resolution: glass office overlooking seized ship; minimalist handshake; calm power and control.
5) Brand reveal: deep navy; metallic gold logo sweep (1.2s + 0.3s shimmer); taglines EN/AR; elegant fade.
`.trim();
    files.push({ name: "prompt.txt", data: enc.encode(prompt) });

    const timing = `
Total: 15s at 24 fps (360 frames)
Shot 1: 0.0–3.0s (0–72f)
Shot 2: 3.0–6.0s (72–144f)
Shot 3: 6.0–9.0s (144–216f)
Shot 4: 9.0–12.0s (216–288f)
Shot 5: 12.0–15.0s (288–360f)
Logo sweep: start ~12.4s; duration 1.2s + 0.3s shimmer; taglines 13.6–14.6s; fade 14.6–15.0s.
`.trim();
    files.push({ name: "timing.txt", data: enc.encode(timing) });

    const sfx = `
Sound design:
- Deep ambient bass (heartbeat tension)
- Ocean and port ambiences
- Metallic impacts for flash cuts
- Coast guard radio chatter (subtle texture)
- Logo: soft cinematic boom + shimmering tail
Mix target loudness: ~ -14 LUFS; 48 kHz
`.trim();
    files.push({ name: "sound.txt", data: enc.encode(sfx) });

    const overlays = `
On-screen overlays:
- Shot 1 HUD (brief, 2–3s): Vessel KOMC-A12 • 25.2953°N, 55.3283°E • Status: UNDER LEGAL REVIEW
- Shot 3 legal stamp: SEIZURE ORDER (close-up)
- Shot 5 taglines:
  EN: "Precision in Maritime Law."
  AR: "دقة في القانون البحري"
`.trim();
    files.push({ name: "overlays.txt", data: enc.encode(overlays) });

    const integration = `
Integration:
- Copy final MP4 to public/videos/komc-intro.mp4
- Homepage auto-plays once via IntroOverlay
- Demo page player: fallback upload preview if file missing
Export:
- 4K 3840x2160, 24 fps
- H.264 high profile 100–150 Mbps CBR (or ProRes 422 HQ)
- Audio 48 kHz; final loudness ~ -14 LUFS
`.trim();
    files.push({ name: "integration.txt", data: enc.encode(integration) });

    const zip = createZip(files);
    const url = URL.createObjectURL(zip);
    const a = document.createElement("a");
    a.href = url;
    a.download = "komc-intro-pack.zip";
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 2000);
  };

  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <div className="text-sm text-white/80">Download the production pack (prompts, timing, SFX, overlays, integration).</div>
      <button
        onClick={generate}
        disabled={downloading}
        className="mt-3 rounded-lg bg-[var(--brand-accent)] px-3 py-1.5 text-xs font-semibold text-black hover:opacity-90 disabled:opacity-60"
      >
        {downloading ? "Preparing..." : "Generate & Download Pack"}
      </button>
    </div>
  );
}
