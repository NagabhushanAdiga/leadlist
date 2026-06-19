import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const src = process.argv[2] || 'assets/app-logo.png'
const outDir = path.resolve('assets')
const BRAND_BG = { r: 11, g: 27, b: 58, alpha: 1 }

if (!fs.existsSync(src)) {
  console.error(`Source image not found: ${src}`)
  console.error('Usage: node scripts/generate-icons.mjs <source-image>')
  process.exit(1)
}

fs.mkdirSync(outDir, { recursive: true })

const metadata = await sharp(src).metadata()
const cropTop = Math.round(metadata.height * 0.08)
const cropHeight = Math.round(metadata.height * 0.58)
const cropLeft = Math.round(metadata.width * 0.08)
const cropWidth = Math.round(metadata.width * 0.84)

const iconOnly = await sharp(src)
  .extract({
    left: cropLeft,
    top: cropTop,
    width: cropWidth,
    height: cropHeight,
  })
  .resize(1024, 1024, {
    fit: 'contain',
    background: BRAND_BG,
  })
  .png()
  .toBuffer()

await sharp(iconOnly).toFile(path.join(outDir, 'icon.png'))
await sharp(iconOnly).toFile(path.join(outDir, 'android-icon-foreground.png'))
await sharp(iconOnly).resize(48, 48).toFile(path.join(outDir, 'favicon.png'))

await sharp(src)
  .resize(1024, 1024, {
    fit: 'contain',
    background: BRAND_BG,
  })
  .png()
  .toFile(path.join(outDir, 'splash-icon.png'))

await sharp({
  create: {
    width: 1024,
    height: 1024,
    channels: 4,
    background: BRAND_BG,
  },
})
  .png()
  .toFile(path.join(outDir, 'android-icon-background.png'))

const mono = await sharp(iconOnly)
  .greyscale()
  .threshold(110)
  .png()
  .toBuffer()

await sharp(mono).toFile(path.join(outDir, 'android-icon-monochrome.png'))

const { data, info } = await sharp(iconOnly)
  .resize(512, 512)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const notif = Buffer.alloc(info.width * info.height * 4)
for (let i = 0; i < data.length; i += 4) {
  const r = data[i]
  const g = data[i + 1]
  const b = data[i + 2]
  const a = data[i + 3]
  const lum = 0.299 * r + 0.587 * g + 0.114 * b
  const out = i
  if (a > 50 && lum > 95) {
    notif[out] = 255
    notif[out + 1] = 255
    notif[out + 2] = 255
    notif[out + 3] = 255
  }
}

await sharp(notif, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .resize(96, 96)
  .png()
  .toFile(path.join(outDir, 'notification-icon.png'))

console.log('Generated app icon and splash assets in', outDir)
