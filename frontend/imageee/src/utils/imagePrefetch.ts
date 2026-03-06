import { Image } from 'expo-image';

export async function prefetchImages(urls: string[], max: number = 10) {
  const unique = Array.from(new Set(urls.filter(Boolean))).slice(0, max);
  if (unique.length === 0) return;

  try {
    await Promise.all(unique.map((u) => Image.prefetch(u)));
  } catch {
    // Prefetch is best-effort; ignore failures.
  }
}

