const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

export const SPOTIFY_PROFILE_URL =
  "https://open.spotify.com/user/31ajvsvptg6aygrakjcsm7xnm5am";

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT =
  "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT =
  "https://api.spotify.com/v1/me/player/recently-played?limit=1";

async function getAccessToken() {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
    return null;
  }

  const basic = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
    cache: "no-store",
  });

  if (!response.ok) return null;
  return response.json();
}

export async function getNowPlaying() {
  try {
    const tokenData = await getAccessToken();
    if (!tokenData?.access_token) {
      return { isPlaying: false, configured: false };
    }

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      cache: "no-store",
    });

    if (response.status === 204 || response.status > 400) {
      // Fallback: check recently played
      const recentRes = await fetch(RECENTLY_PLAYED_ENDPOINT, {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
        cache: "no-store",
      });

      if (recentRes.ok) {
        const recentData = await recentRes.json();
        const item = recentData.items?.[0]?.track;
        if (item) {
          return {
            isPlaying: false,
            configured: true,
            title: item.name,
            artist: item.artists.map((_art: { name: string }) => _art.name).join(", "),
            album: item.album.name,
            albumImageUrl: item.album.images?.[0]?.url,
            songUrl: item.external_urls?.spotify,
          };
        }
      }

      return { isPlaying: false, configured: true };
    }

    const song = await response.json();
    if (!song.item) {
      return { isPlaying: false, configured: true };
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists
      .map((_art: { name: string }) => _art.name)
      .join(", ");
    const album = song.item.album.name;
    const albumImageUrl = song.item.album.images?.[0]?.url;
    const songUrl = song.item.external_urls?.spotify;

    return {
      isPlaying,
      configured: true,
      title,
      artist,
      album,
      albumImageUrl,
      songUrl,
    };
  } catch {
    return { isPlaying: false, configured: false };
  }
}
