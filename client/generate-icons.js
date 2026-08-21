const sharp = require("sharp");
const fs = require("fs");

async function generateIcons() {
  const sizes = [192, 512];
  
  for (const size of sizes) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="#6366f1"/>
        <text x="${size / 2}" y="${size * 0.55}" font-size="${size * 0.4}" text-anchor="middle" fill="white" font-family="Arial" font-weight="bold">💰</text>
      </svg>
    `;
    
    await sharp(Buffer.from(svg)).png().toFile(`public/icons/finhandler-${size}.png`);
    console.log(`Generated finhandler-${size}.png`);
  }
  
  // Also create maskable icon
  const maskableSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <rect width="512" height="512" fill="#6366f1"/>
      <text x="256" y="280" font-size="200" text-anchor="middle" fill="white" font-family="Arial" font-weight="bold">💰</text>
    </svg>
  `;
  
  await sharp(Buffer.from(maskableSvg)).png().toFile("public/icons/finhandler-maskable-512.png");
  console.log("Generated finhandler-maskable-512.png");
}

generateIcons().catch(console.error);
