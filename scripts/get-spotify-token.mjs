import readline from "readline";
import fs from "fs";
import path from "path";

const CLIENT_ID = process.argv[2] || "cf52a672b46643218d7904013ad57a70";
const CLIENT_SECRET = process.argv[3] || "62eb9bdf24764fd493efb2f0faa0bc2c";
const REDIRECT_URI = "https://blog.ugandhar.in/callback";

const SCOPES = [
  "user-read-currently-playing",
  "user-read-recently-played",
  "user-read-playback-state",
].join(" ");

const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&scope=${encodeURIComponent(SCOPES)}`;

console.log("\n========================================================");
console.log("🎵 SPOTIFY REFRESH TOKEN GENERATOR");
console.log("========================================================\n");
console.log("STEP 1: Make sure your Spotify App has this Redirect URI added:");
console.log(`👉  ${REDIRECT_URI}\n`);
console.log("(In your Spotify Developer Dashboard -> Settings -> Redirect URIs -> Add -> Save)\n");

console.log("STEP 2: Open this URL in your web browser:");
console.log(`👉  ${authUrl}\n`);

console.log("STEP 3: Click 'Agree'. Your browser will redirect to a URL like:");
console.log("    https://blog.ugandhar.in/callback?code=AQB...");
console.log("Even if the page says 404, that's completely normal! Just copy that entire URL from the browser address bar.\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Paste the redirected URL (or code) here: ", async (input) => {
  rl.close();

  let code = input.trim();
  if (code.includes("code=")) {
    try {
      const url = new URL(code.startsWith("http") ? code : `http://localhost/${code}`);
      code = url.searchParams.get("code") || code;
    } catch {
      const match = code.match(/code=([^&]+)/);
      if (match) code = match[1];
    }
  }

  if (!code) {
    console.error("❌ No authorization code provided.");
    process.exit(1);
  }

  console.log("\nExchanging authorization code with Spotify API...");

  const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
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

    const data = await res.json();

    if (data.error || !data.refresh_token) {
      console.error("\n❌ Spotify API Error:", data.error_description || data.error);
      process.exit(1);
    }

    console.log("\n========================================================");
    console.log("✅ SUCCESS! Here are your credentials for .env:");
    console.log("========================================================\n");
    console.log(`SPOTIFY_CLIENT_ID="${CLIENT_ID}"`);
    console.log(`SPOTIFY_CLIENT_SECRET="${CLIENT_SECRET}"`);
    console.log(`SPOTIFY_REFRESH_TOKEN="${data.refresh_token}"\n`);

    // Auto-update .env file
    const envPath = path.join(process.cwd(), ".env");
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, "utf-8");
      if (envContent.includes("SPOTIFY_REFRESH_TOKEN=")) {
        envContent = envContent.replace(
          /SPOTIFY_REFRESH_TOKEN=.*/g,
          `SPOTIFY_REFRESH_TOKEN="${data.refresh_token}"`
        );
      } else {
        envContent += `\nSPOTIFY_REFRESH_TOKEN="${data.refresh_token}"\n`;
      }
      fs.writeFileSync(envPath, envContent, "utf-8");
      console.log("💾 Automatically updated your local .env file with the real refresh token!");
    }

    console.log("👉 Remember to also add this SPOTIFY_REFRESH_TOKEN in Vercel settings for production!");
  } catch (err) {
    console.error("❌ Request failed:", err.message);
  }
});
