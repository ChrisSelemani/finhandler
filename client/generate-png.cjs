const fs = require("fs");

// Function to create a simple PNG with a solid color
function createPNG(width, height, r, g, b, a) {
  const PNG_HEADER = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  
  function crc32(buf) {
    let table = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      table[i] = c;
    }
    let crc = 0xFFFFFFFF;
    for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function chunk(type, data) {
    const typeBuf = Buffer.from(type, "ascii");
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(data.length, 0);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
    return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const rawData = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    rawData[y * (width * 4 + 1)] = 0; // filter type: none
    for (let x = 0; x < width; x++) {
      const offset = y * (width * 4 + 1) + 1 + x * 4;
      // Create a gradient effect (indigo)
      const ratio = (x + y) / (width + height);
      rawData[offset] = Math.round(99 + (118 - 99) * ratio); // R
      rawData[offset + 1] = Math.round(102 + (74 - 102) * ratio); // G
      rawData[offset + 2] = Math.round(241 + (162 - 241) * ratio); // B
      rawData[offset + 3] = 255; // A
    }
  }

  const idat = zlib.deflateSync(rawData);
  return Buffer.concat([PNG_HEADER, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

const zlib = require("zlib");

for (const size of [192, 512]) {
  const png = createPNG(size, size);
  fs.writeFileSync(`public/icons/finhandler-${size}.png`, png);
  console.log(`Created finhandler-${size}.png (${png.length} bytes)`);
}

const maskable = createPNG(512, 512);
fs.writeFileSync("public/icons/finhandler-maskable-512.png", maskable);
console.log("Created finhandler-maskable-512.png");
console.log("Done!");
