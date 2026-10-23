"use client";

import React, { useState, useEffect } from "react";
import {
  Github,
  Music,
  Disc3,
  ExternalLink,
  Code2,
  Play,
  Pause,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "@/lib/config";

interface SpotifyState {
  isPlaying: boolean;
  configured: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  profileUrl: string;
}

export function ActivityShowcase() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showEmbed, setShowEmbed] = useState(false);
  const [spotify, setSpotify] = useState<SpotifyState>({
    isPlaying: false,
    configured: false,
    profileUrl: "https://open.spotify.com/user/31ajvsvptg6aygrakjcsm7xnm5am",
  });

  useEffect(() => {
    let mounted = true;
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch("/api/spotify");
        if (res.ok && mounted) {
          const data: SpotifyState = await res.json();
          setSpotify(data);
          if (data.configured) {
            setIsPlaying(data.isPlaying);
          }
        }
      } catch {
        // Fallback to static mode
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 30000); // refresh every 30s
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
        <Sparkles className="h-4 w-4" />
        <span>Currently Crafting & Grooving</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: What I'm Building (GitHub) */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container-low p-6 transition-all duration-200 hover:border-primary/40 hover:bg-surface-container hover:shadow-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-on-surface-variant">
                <Code2 className="h-3.5 w-3.5 text-primary" />
                <span>Currently Building</span>
              </span>
              <a
                href={siteConfig.author.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:bg-primary-container hover:text-primary-on-container"
                aria-label="GitHub Profile"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors">
                <a
                  href="https://github.com/uga961/StayActive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5"
                >
                  StayActive
                  <ExternalLink className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                </a>
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                A lightweight Windows desktop app for digital wellbeing, mindful breaks, and physical health while working.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-[11px] font-medium text-on-surface-variant">
                Python
              </span>
              <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-[11px] font-medium text-on-surface-variant">
                Windows App
              </span>
              <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-[11px] font-medium text-primary">
                Open Source
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <a
              href="https://github.com/uga961/StayActive"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>View Repository</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href={siteConfig.author.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-on-surface-variant hover:text-on-surface"
            >
              @uga961 on GitHub
            </a>
          </div>
        </div>

        {/* Card 2: What I'm Listening To (Spotify Vinyl) */}
        <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-outline-variant/30 bg-surface-container-low p-6 transition-all duration-200 hover:border-primary/40 hover:bg-surface-container hover:shadow-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-on-surface-variant">
                <Music className="h-3.5 w-3.5 text-[#1DB954]" />
                <span>
                  {spotify.isPlaying ? "Listening Now on Spotify" : "Spotify On Rotation"}
                </span>
              </span>
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container text-on-surface-variant transition-colors hover:bg-surface-container-high"
                aria-label={isPlaying ? "Pause vinyl" : "Spin vinyl"}
                title={isPlaying ? "Pause vinyl" : "Spin vinyl"}
              >
                {isPlaying ? (
                  <Pause className="h-3.5 w-3.5" />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Vinyl Record Display */}
            <div className="flex items-center gap-4">
              {/* Spinning Vinyl Disc - Black & Spotify Green Design */}
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-neutral-950 shadow-md ring-2 ring-neutral-800">
                <div
                  className={`flex h-full w-full items-center justify-center rounded-full transition-transform ${
                    isPlaying ? "animate-spin" : ""
                  }`}
                  style={{ animationDuration: "6s" }}
                >
                  <div className="h-16 w-16 rounded-full border border-neutral-800/80 flex items-center justify-center">
                    <div className="h-12 w-12 rounded-full border border-neutral-700/50 flex items-center justify-center">
                      {/* Center Green & Black Label */}
                      <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#1DB954] text-neutral-950 shadow-inner ring-1 ring-[#1DB954]/60">
                        <Disc3 className="h-4 w-4" />
                        <span className="absolute h-1.5 w-1.5 rounded-full bg-neutral-950" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Music Details */}
              <div className="space-y-1 min-w-0">
                {spotify.title ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-2 w-2 rounded-full bg-[#1DB954] animate-pulse" />
                      <span className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                        {spotify.isPlaying ? "Live on Spotify" : "Recently Played"}
                      </span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-on-surface truncate">
                      <a
                        href={spotify.songUrl || spotify.profileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {spotify.title}
                      </a>
                    </h4>
                    <p className="text-xs text-on-surface-variant truncate">
                      {spotify.artist}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-2 w-2 rounded-full bg-[#1DB954] animate-pulse" />
                      <span className="text-[11px] font-medium uppercase tracking-wider text-on-surface-variant">
                        Ugandhar&apos;s Spotify
                      </span>
                    </div>
                    <h4 className="font-serif text-base font-bold text-on-surface">
                      Hot Hits Telugu & Daily Rotation
                    </h4>
                    <p className="text-xs text-on-surface-variant line-clamp-1">
                      Tollywood hits, energetic rhythms & Telugu favorites.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Optional Spotify Mini-Player Embed Toggle */}
            {showEmbed ? (
              <div className="pt-2">
                <iframe
                  style={{ borderRadius: "16px" }}
                  src="https://open.spotify.com/embed/playlist/37i9dQZF1DX6XE7HRLM75P?utm_source=generator&theme=0"
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  title="Spotify Embed"
                />
              </div>
            ) : null}
          </div>

          <div className="mt-5 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs">
            <a
              href="https://open.spotify.com/user/31ajvsvptg6aygrakjcsm7xnm5am"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>View Profile on Spotify</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <button
              onClick={() => setShowEmbed((s) => !s)}
              className="text-on-surface-variant hover:text-on-surface text-[11px] underline"
            >
              {showEmbed ? "Hide Player" : "Mini Player"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
