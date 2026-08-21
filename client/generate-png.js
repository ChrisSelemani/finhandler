const fs = require("fs");

// Create a minimal valid PNG (purple square)
// This is a 1x1 purple pixel PNG
const pngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
const pngBuffer = Buffer.from(pngBase64, "base64");

for (const size of [192, 512]) {
  fs.writeFileSync(`public/icons/finhandler-${size}.png`, pngBuffer);
  console.log(`Created finhandler-${size}.png`);
}

fs.writeFileSync("public/icons/finhandler-maskable-512.png", pngBuffer);
console.log("Created finhandler-maskable-512.png");
console.log("Done!");
