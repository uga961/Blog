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
    title: "Hot Hits Telugu & Rhythm",
    artist: "Tollywood energy & daily focus tracks",
    profileUrl: siteConfig.spotify.profileUrl,
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

    const initialTimer = setTimeout(fetchNowPlaying, 800);
    const interval = setInterval(fetchNowPlaying, 30000);
    return () => {
      mounted = false;
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <section id="activity" className="scroll-mt-28 space-y-6 pt-4">
      {/* Editorial Header */}
      <div className="flex items-center justify-between border-b border-border/80 pb-3 text-xs font-mono text-on-surface-variant">
        <div className="flex items-center gap-2 sm:gap-3 truncate">
          <span className="text-foreground font-semibold uppercase tracking-wider flex-shrink-0">
            INDEX 003
          </span>
          <span className="text-border flex-shrink-0">/</span>
          <span className="truncate">CURRENTLY CRAFTING &amp; GROOVING</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0 font-mono text-[11px]">
          <span className="inline-block w-2 h-2 rounded-full bg-[#1DB954] shadow-[0_0_8px_rgba(29,185,84,0.6)] animate-pulse" />
          <span className="text-[#1DB954] font-medium">LIVE TELEMETRY</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: What I'm Building (GitHub) */}
        <div className="rounded-[4px] border border-border/80 bg-surface/60 p-5 sm:p-6 flex flex-col justify-between space-y-5 transition-colors hover:border-foreground/30">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
              <span className="inline-flex items-center gap-2 font-semibold uppercase tracking-wider text-foreground">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
                <Code2 className="h-3.5 w-3.5 text-on-surface-variant" />
                <span>Currently Building</span>
              </span>
              <a
                href={siteConfig.author.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-[3px] border border-border/80 bg-surface text-foreground transition-colors hover:border-foreground touch-manipulation"
                aria-label="GitHub Profile"
              >
                <Github className="h-3.5 w-3.5" />
              </a>
            </div>

            <div>
              <h3 className="font-serif text-xl font-bold tracking-tight text-foreground">
                <a
                  href={siteConfig.currentCrafting.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:underline"
                >
                  {siteConfig.currentCrafting.title}
                  <ExternalLink className="h-3.5 w-3.5 opacity-60" />
                </a>
              </h3>
              <p className="mt-1.5 text-xs sm:text-sm text-on-surface-variant leading-relaxed font-sans">
                {siteConfig.currentCrafting.description}
              </p>
            </div>

            <div className="pt-1 text-xs font-mono text-on-surface-variant break-words">
              <span>{siteConfig.currentCrafting.tech}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono">
            <a
              href={siteConfig.currentCrafting.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:underline inline-flex items-center gap-1 touch-manipulation"
            >
              <span>View Repository</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
            <span className="text-on-surface-variant">@uga961 on GitHub</span>
          </div>
        </div>

        {/* Card 2: What I'm Listening To (Spotify Vinyl) */}
        <div className="rounded-[4px] border border-border/80 bg-surface/60 p-5 sm:p-6 flex flex-col justify-between space-y-5 transition-colors hover:border-foreground/30">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs font-mono text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-foreground">
                <Music className="h-3.5 w-3.5 text-[#1DB954]" />
                <span>Audio Stream</span>
              </span>
              <button
                onClick={() => setIsPlaying((p) => !p)}
                className="flex h-7 w-7 items-center justify-center rounded-[3px] border border-border/80 bg-surface text-foreground transition-colors hover:border-foreground cursor-pointer touch-manipulation"
                aria-label={isPlaying ? "Pause turntable" : "Spin turntable"}
                title={isPlaying ? "Pause turntable" : "Spin turntable"}
              >
                {isPlaying ? (
                  <Pause className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
              </button>
            </div>

            {/* Vinyl Record Display with Spotify Green Styling */}
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 sm:h-18 sm:w-18 shrink-0 items-center justify-center rounded-full bg-neutral-950 border border-neutral-800 shadow-md ring-1 ring-neutral-800">
                <div
                  className={`flex h-full w-full items-center justify-center rounded-full transition-transform ${
                    isPlaying ? "animate-spin" : ""
                  }`}
                  style={{ animationDuration: "6s" }}
                >
                  <div className="h-13 w-13 sm:h-14 sm:w-14 rounded-full border border-neutral-800/80 flex items-center justify-center">
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border border-neutral-700/60 flex items-center justify-center">
                      {/* Center Spotify Green Label */}
                      <div className="relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-[#1DB954] text-neutral-950 shadow-inner ring-1 ring-[#1DB954]/60">
                        <Disc3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-950" />
                        <span className="absolute h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full bg-neutral-950" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Music Details */}
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
                  <span className="text-[#1DB954] font-medium">
                    {spotify.isPlaying
                      ? "Listening Now on Spotify"
                      : "Spotify On Rotation"}
                  </span>
                </div>
                <h4 className="font-serif text-base font-bold text-foreground truncate">
                  <a
                    href={spotify.songUrl || spotify.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-[#1DB954] transition-colors"
                  >
                    {spotify.title || "Hot Hits Telugu & Rhythm"}
                  </a>
                </h4>
                <p className="text-xs text-on-surface-variant truncate font-mono">
                  {spotify.artist || "Tollywood energy & daily focus tracks"}
                </p>
              </div>
            </div>

            {showEmbed && (
              <div className="pt-2">
                <iframe
                  style={{ borderRadius: "4px" }}
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
            )}
          </div>

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs font-mono">
            <a
              href={siteConfig.spotify.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground hover:underline hover:text-[#1DB954] inline-flex items-center gap-1 touch-manipulation transition-colors"
            >
              <span>View Profile</span>
              <ExternalLink className="h-3 w-3 opacity-60" />
            </a>
            <button
              onClick={() => setShowEmbed((s) => !s)}
              className="text-on-surface-variant hover:text-foreground underline cursor-pointer touch-manipulation text-[11px]"
            >
              {showEmbed ? "Hide Player" : "Mini Player"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
