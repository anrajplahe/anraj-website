/** Parse only known YouTube URL shapes; never use submitted URLs as iframe sources. */
export function parseYouTubeUrl(value: string): { id: string; url: string } | null {
  if (typeof value !== "string" || value.length > 2048) return null;
  try {
    const url = new URL(value.trim());
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port) return null;
    let id: string | null = null;
    if (url.hostname === 'youtu.be') {
      id = /^\/([\w-]{11})\/?$/.exec(url.pathname)?.[1] ?? null;
    } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
      if (url.pathname === '/watch' && url.searchParams.getAll('v').length === 1) {
        id = url.searchParams.get('v');
      } else {
        id = /^\/(?:shorts|embed)\/([\w-]{11})\/?$/.exec(url.pathname)?.[1] ?? null;
      }
    }
    return id && /^[\w-]{11}$/.test(id)
      ? { id, url: `https://www.youtube.com/watch?v=${id}` }
      : null;
  } catch {
    return null;
  }
}

export const MAX_JOURNAL_VIDEOS = 20;

export function validateVideoUrls(value: unknown): string[] {
  if (!Array.isArray(value) || value.length > MAX_JOURNAL_VIDEOS) {
    throw new Error(`Use at most ${MAX_JOURNAL_VIDEOS} YouTube videos.`);
  }
  const urls = value.map((item: unknown) => {
    const video = typeof item === 'string' ? parseYouTubeUrl(item) : null;
    if (!video) throw new Error('Enter a valid YouTube video URL.');
    return video.url;
  });
  if (new Set(urls).size !== urls.length) throw new Error('This video has already been added.');
  return urls;
}
