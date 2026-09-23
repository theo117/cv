import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const sources = ['tradeflow.webp', 'img1.webp', 'img3.webp', 'images/clinical-reasoning-still.webp'];
await mkdir('public/images/posters', { recursive: true });
for (const source of sources) {
  const name = source.split('/').pop().replace('.webp', '');
  for (const width of [480, 800, 1440]) {
    await sharp(`public/${source}`)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(`public/images/posters/${name}-${width}.webp`);
  }
}
