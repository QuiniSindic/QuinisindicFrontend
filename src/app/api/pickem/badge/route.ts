const ALLOWED_BADGE_HOSTS = new Set([
  'raw.githubusercontent.com',
  'lsm-static-prod.livescore.com',
  'images.fotmob.com',
  'flagcdn.com',
  'www.flagcdn.com',
]);

function isAllowedBadgeUrl(value: string) {
  try {
    const url = new URL(value);

    return url.protocol === 'https:' && ALLOWED_BADGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url || !isAllowedBadgeUrl(url)) {
    return new Response('Invalid badge url', { status: 400 });
  }

  const response = await fetch(url, {
    headers: {
      accept: 'image/avif,image/webp,image/png,image/svg+xml,image/*,*/*;q=0.8',
    },
    next: { revalidate: 60 * 60 * 24 * 30 },
  });

  if (!response.ok || !response.body) {
    return new Response('Badge not found', { status: 404 });
  }

  return new Response(response.body, {
    headers: {
      'content-type': response.headers.get('content-type') ?? 'image/png',
      'cache-control': 'public, max-age=2592000, immutable',
    },
  });
}
