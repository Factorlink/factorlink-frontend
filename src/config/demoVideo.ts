/**
 * Demo video URL from env. Accepts YouTube watch/share/embed links or a direct mp4 URL.
 * Example: VITE_DEMO_VIDEO_URL=https://www.youtube.com/watch?v=VIDEO_ID
 */
export const FACTORLINK_DEMO_VIDEO_URL: string =
  import.meta.env.VITE_DEMO_VIDEO_URL ?? "";

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

/** Extract YouTube video id from common URL formats, or null if not YouTube. */
export const getYoutubeVideoId = (url: string): string | null => {
  try {
    const parsed = new URL(url.trim());
    if (!YOUTUBE_HOSTS.has(parsed.hostname)) return null;

    if (parsed.hostname.includes("youtu.be")) {
      const id = parsed.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }

    if (parsed.pathname.startsWith("/embed/")) {
      const id = parsed.pathname.split("/")[2];
      return id || null;
    }

    if (parsed.pathname.startsWith("/shorts/")) {
      const id = parsed.pathname.split("/")[2];
      return id || null;
    }

    return parsed.searchParams.get("v");
  } catch {
    return null;
  }
};

export const getYoutubeEmbedUrl = (
  url: string,
  options?: { autoplay?: boolean },
): string | null => {
  const id = getYoutubeVideoId(url);
  if (!id) return null;
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
  });
  if (options?.autoplay) {
    params.set("autoplay", "1");
  }
  return `https://www.youtube.com/embed/${id}?${params.toString()}`;
};
