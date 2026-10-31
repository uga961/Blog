#!/usr/bin/env node

/**
 * Spotify Refresh Token Generator
 * Run: node scripts/get-spotify-token.mjs
 */

import http from "http";
import url from "url";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.log("Please define SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in your environment.");
  process.exit(1);
}

const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-recently-played",
].join(" ");

const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&scope=${encodeURIComponent(scopes)}`;

console.log("\n=======================================================");
console.log("1. Open this URL in your browser:\n");
console.log(authUrl);
console.log("\n2. Authorize the app and wait for redirect...");
console.log("=======================================================\n");

const server = http.createServer(async (req, res) => {
  const reqUrl = url.parse(req.url, true);
  if (reqUrl.pathname === "/callback") {
    const code = reqUrl.query.code;
    res.end("Authentication successful! You can close this window now.");
    server.close();

    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await response.json();
    console.log("\nYOUR REFRESH TOKEN IS:\n");
    console.log(data.refresh_token);
    console.log("\nAdd this to your .env file as SPOTIFY_REFRESH_TOKEN.\n");
    process.exit(0);
  }
});

server.listen(PORT);
