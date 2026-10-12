import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

// A code-native share cover, using the same local ribbon as the actual page.
const ribbon = (await readFile("public/cstd-atelier/fold-study-v1.svg", "utf8"))
  .replace(/<svg[^>]*>/, '<svg x="970" y="100" width="830" height="858" viewBox="0 0 600 620" fill="none">');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
<rect width="1920" height="1080" fill="#f8f5ef"/>
<path d="M112 148h1696M112 946h1696" stroke="#d7d6cc"/>
<g fill="#242b27" font-family="Georgia, 'Times New Roman', serif">
<text x="112" y="508" font-size="168" letter-spacing="-5">Custard<tspan fill="#b2945c">.</tspan></text>
<text x="118" y="630" font-family="'Segoe UI', sans-serif" font-size="42">Data. Systems. Things that work.</text>
</g>
<g fill="#667064" font-family="'Segoe UI', sans-serif" font-size="23" letter-spacing="3">
<text x="116" y="114">CUSTARD / PERSONAL STUDIO</text>
<text x="116" y="1002">ANALYSIS · PRODUCT · ENGINEERING</text>
<text x="1808" y="1002" text-anchor="end">CUSTARD.TOP</text>
</g>
${ribbon}
</svg>`;
await writeFile("public/cstd-atelier/studio-share-v1.svg", svg);
await sharp(Buffer.from(svg)).png().toFile("public/cstd-atelier/studio-share-v1.png");
console.log("Generated ATELIER share cover at 1920 × 1080.");
