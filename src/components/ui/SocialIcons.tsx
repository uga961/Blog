"use client";

import React from "react";
import {
  SiGithub,
  SiYoutube,
  SiReddit,
  SiInstagram,
  SiHackerrank,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";
import { BookOpen, ExternalLink, Globe, Code2 } from "lucide-react";

interface SocialIconProps {
  name: string;
  className?: string;
}

export function SocialIcon({ name, className = "w-5 h-5" }: SocialIconProps) {
  const norm = name.toLowerCase();

  const iconProps = {
    className,
    "aria-hidden": "true" as const,
  };

  switch (norm) {
    case "github":
      return <SiGithub {...iconProps} />;
    case "linkedin":
      return <FaLinkedin {...iconProps} />;
    case "youtube":
      return <SiYoutube {...iconProps} />;
    case "reddit":
      return <SiReddit {...iconProps} />;
    case "instagram":
      return <SiInstagram {...iconProps} />;
    case "hackerrank":
      return <SiHackerrank {...iconProps} />;
    case "blog":
      return <BookOpen {...iconProps} />;
    case "website":
    case "globe":
      return <Globe {...iconProps} />;
    case "code":
      return <Code2 {...iconProps} />;
    default:
      return <ExternalLink {...iconProps} />;
  }
}
