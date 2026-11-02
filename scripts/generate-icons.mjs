import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

function createPNG(width, height, isMaskable = false) {
  // Simple uncompressed RGBA bitmap to valid PNG
  const bytesPerPixel = 4;
  const rowSize = width * bytesPerPixel + 1; // 1 filter byte per scanline
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * (isMaskable ? 0.38 : 0.44);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background gradient
      const t = (x + y) / (width + height);
      let r = 9 + Math.floor(t * 15);
      let g = 9 + Math.floor(t * 15);
      let b = 11 + Math.floor(t * 20);
      let a = 255;

      // Squircle or circle boundary
      if (dist < radius) {
        // Gradient inner circle
        if (dist > radius - 10) {
          // Purple ring
          r = 99; g = 102; b = 241;
        } else if (dist > radius - 20) {
          // Emerald ring
          r = 16; g = 185; b = 129;
        } else {
          // Central emblem area
          // Stylized play triangle or R
          if (x > cx - width * 0.15 && x < cx + width * 0.15 && y > cy - height * 0.15 && y < cy + height * 0.15) {
            r = 99; g = 102; b = 241;
          }
          if (x > cx && x < cx + width * 0.18 && y > cy - height * 0.08 && y < cy + height * 0.08) {
            r = 16; g = 185; b = 129;
          }
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type 6 (RGBA)
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method

  const ihdrChunk = createChunk('IHDR', ihdr);

  // IDAT chunk
  const compressed = zlib.deflateSync(rawData);
  const idatChunk = createChunk('IDAT', compressed);

  // IEND chunk
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);

  const crcTarget = Buffer.concat([Buffer.from(type), data]);
  const crc = crc32(crcTarget);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

const outDir = path.resolve('public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'pwa-192x192.png'), createPNG(192, 192));
fs.writeFileSync(path.join(outDir, 'pwa-512x512.png'), createPNG(512, 512));
fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), createPNG(180, 180));
fs.writeFileSync(path.join(outDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, true));
console.log('PWA PNG icons generated successfully in public/');
