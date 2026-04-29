import { mkdir, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const brandDir = path.join(publicDir, "brand");
const sourcePath = path.join(publicDir, "KOMC Logo.jpeg");
const outputSizes = [16, 32, 64, 128, 256, 512];
const extraRasterSizes = [180];

function paddingFor(size) {
  if (size <= 32) return 1;
  if (size <= 64) return 2;
  if (size <= 128) return 4;
  return Math.round(size * 0.06);
}

function buildSvg(size, pngBuffer) {
  const encoded = pngBuffer.toString("base64");
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-labelledby="komc-logo-title">`,
    `  <title id="komc-logo-title">Khaled Omer Maritime &amp; Legal Consultancy logo</title>`,
    `  <image href="data:image/png;base64,${encoded}" width="${size}" height="${size}" preserveAspectRatio="xMidYMid meet" />`,
    `</svg>`,
  ].join("\n");
}

async function renderSquareLogo(size) {
  const padding = paddingFor(size);
  const innerSize = Math.max(size - padding * 2, 1);
  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: await sharp(sourcePath)
          .resize({
            width: innerSize,
            height: innerSize,
            fit: "contain",
            background: { r: 0, g: 0, b: 0, alpha: 0 },
          })
          .sharpen()
          .png()
          .toBuffer(),
        top: padding,
        left: padding,
      },
    ])
    .png()
    .toBuffer();
}

async function writeRasterSet(size) {
  const pngBuffer = await renderSquareLogo(size);
  const pngPath = path.join(brandDir, `komc-logo-${size}.png`);
  const webpPath = path.join(brandDir, `komc-logo-${size}.webp`);
  const svgPath = path.join(brandDir, `komc-logo-${size}.svg`);

  await writeFile(pngPath, pngBuffer);
  await writeFile(webpPath, await sharp(pngBuffer).webp({ quality: 92 }).toBuffer());
  await writeFile(svgPath, buildSvg(size, pngBuffer));

  return { pngBuffer, pngPath, svgPath };
}

async function main() {
  await mkdir(brandDir, { recursive: true });

  const rasterOutputs = new Map();

  for (const size of [...outputSizes, ...extraRasterSizes]) {
    const output = await writeRasterSet(size);
    rasterOutputs.set(size, output);
  }

  await copyFile(rasterOutputs.get(16).pngPath, path.join(publicDir, "favicon-16x16.png"));
  await copyFile(rasterOutputs.get(32).pngPath, path.join(publicDir, "favicon-32x32.png"));
  await copyFile(rasterOutputs.get(180).pngPath, path.join(publicDir, "apple-touch-icon.png"));
  await writeFile(path.join(publicDir, "main_logo.svg"), buildSvg(512, rasterOutputs.get(512).pngBuffer));
  await writeFile(
    path.join(publicDir, "favicon.ico"),
    await pngToIco([rasterOutputs.get(16).pngPath, rasterOutputs.get(32).pngPath, rasterOutputs.get(64).pngPath]),
  );
}

await main();
