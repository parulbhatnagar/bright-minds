import { NextRequest, NextResponse } from 'next/server';
import type { Image, ImageListResponse } from '@bright-minds/types';

const UNSPLASH_API = 'https://api.unsplash.com';

const CATEGORIES: Record<string, string[]> = {
  animals: [
    'dog park', 'cat window', 'ducks pond', 'rabbit garden',
    'baby animals', 'butterfly flowers', 'birds nest', 'puppy playing',
  ],
  nature: [
    'rainbow hills', 'sunflower field', 'beach waves', 'autumn leaves forest',
    'snowy mountain', 'waterfall', 'cherry blossom', 'meadow wildflowers',
  ],
  everyday: [
    'playground children', 'farmers market', 'cosy library books',
    'fruit kitchen', 'hot air balloon', 'lighthouse coast', 'colourful kite', 'bicycle park',
  ],
};

const CATEGORY_NAMES = Object.keys(CATEGORIES);

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface UnsplashPhoto {
  id: string;
  urls: { regular: string };
  alt_description: string | null;
  description: string | null;
}

async function fetchFromUnsplash(count: number): Promise<Image[]> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) throw new Error('UNSPLASH_ACCESS_KEY is not set');

  const images: Image[] = [];
  for (let i = 0; i < count; i++) {
    const category = CATEGORY_NAMES[i % CATEGORY_NAMES.length];
    const query = pickRandom(CATEGORIES[category]);

    const url = new URL(`${UNSPLASH_API}/photos/random`);
    url.searchParams.set('query', query);
    url.searchParams.set('count', '1');
    url.searchParams.set('orientation', 'landscape');
    url.searchParams.set('content_filter', 'high');

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Client-ID ${accessKey}` },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Unsplash error ${res.status}: ${text}`);
    }

    const [photo] = (await res.json()) as UnsplashPhoto[];
    images.push({
      id: photo.id,
      url: photo.urls.regular,
      altText: photo.alt_description ?? photo.description ?? 'A photo',
      category,
    });
  }
  return images;
}

export async function GET(req: NextRequest) {
  const count = Math.min(Number(req.nextUrl.searchParams.get('count') ?? 1), 10);
  try {
    const images = await fetchFromUnsplash(count);
    const response: ImageListResponse = { images };
    return NextResponse.json(response);
  } catch {
    return NextResponse.json({ error: 'images_unavailable', message: 'Could not load images right now. Please try again.' }, { status: 503 });
  }
}
