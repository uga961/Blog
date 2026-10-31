import { getNowPlaying as getSpotifyNowPlaying, SPOTIFY_PROFILE_URL } from "./spotify";

const LASTFM_API_KEY = process.env.LASTFM_API_KEY;
const LASTFM_USERNAME = process.env.LASTFM_USERNAME;

export interface MusicTrack {
  isPlaying: boolean;
  configured: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  profileUrl: string;
  source?: "lastfm" | "spotify" | "static";
}

/**
 * Fetches real-time playback from Last.fm (100% free, scrobbles live from Spotify).
 */
async function getLastFmNowPlaying(): Promise<MusicTrack | null> {
  if (!LASTFM_API_KEY || !LASTFM_USERNAME) {
    return null;
  }

  try {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(
      LASTFM_USERNAME
    )}&api_key=${encodeURIComponent(LASTFM_API_KEY)}&format=json&limit=1`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "UgandharThoughts/2.0",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = await res.json();
    const track = data?.recenttracks?.track?.[0] || data?.recenttracks?.track;
    if (!track) return null;

    const isPlaying = track["@attr"]?.nowplaying === "true";
    const title = track.name;
    const artist =
      typeof track.artist === "object"
        ? track.artist["#text"] || track.artist.name
        : track.artist;
    const album =
      typeof track.album === "object"
        ? track.album["#text"] || track.album.name
        : track.album;

    // Get highest resolution image (ignore Last.fm placeholder star)
    const images = Array.isArray(track.image) ? track.image : [];
    const bestImage =
      images.find((img: { size?: string }) => img.size === "extralarge")?.["#text"] ||
      images.find((img: { size?: string }) => img.size === "large")?.["#text"] ||
      images[images.length - 1]?.["#text"];

    const isValidImage =
      bestImage &&
      !bestImage.includes("2a96cbd8b46e442fc41c2b86b821562f") &&
      bestImage.trim() !== "";

    return {
      isPlaying,
      configured: true,
      title,
      artist,
      album,
      albumImageUrl: isValidImage ? bestImage : undefined,
      songUrl: track.url || SPOTIFY_PROFILE_URL,
      profileUrl: `https://www.last.fm/user/${LASTFM_USERNAME}`,
      source: "lastfm",
    };
  } catch {
    return null;
  }
}

/**
 * Master music resolver:
 * 1. Checks Last.fm first (free live scrobbling from Spotify).
 * 2. Checks native Spotify API.
 * 3. Falls back to static playlist showcase.
 */
export async function getLiveMusicTrack(): Promise<MusicTrack> {
  // 1. Try Last.fm
  const lastFmTrack = await getLastFmNowPlaying();
  if (lastFmTrack && lastFmTrack.title) {
    return lastFmTrack;
  }

  // 2. Try Spotify API
  const spotifyTrack = await getSpotifyNowPlaying();
  if (spotifyTrack && spotifyTrack.configured && spotifyTrack.title) {
    return {
      ...spotifyTrack,
      profileUrl: SPOTIFY_PROFILE_URL,
      source: "spotify",
    };
  }

  // 3. Fallback
  return {
    isPlaying: false,
    configured: false,
    title: "Hot Hits Telugu & Rhythm",
    artist: "Tollywood energy & daily focus tracks",
    profileUrl: SPOTIFY_PROFILE_URL,
    source: "static",
  };
}
