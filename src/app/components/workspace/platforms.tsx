/**
 * Catálogo central de redes sociais suportadas pelo Agendador Social.
 * Compartilhado entre o agendador, a gestão de acessos e a conexão de contas.
 */
import { Instagram, Facebook, Twitter, Linkedin, Youtube, Music2 } from "lucide-react";
import type { ComponentType } from "react";

export type PlatformId =
  | "instagram"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "tiktok"
  | "youtube"
  | "pinterest"
  | "threads";

type IconProps = { className?: string };

/* Ícones customizados (não disponíveis no lucide) */
function PinterestIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.64 7.85 6.36 9.31-.09-.79-.17-2 .03-2.87.18-.78 1.17-4.97 1.17-4.97s-.3-.6-.3-1.48c0-1.39.81-2.43 1.81-2.43.85 0 1.26.64 1.26 1.41 0 .86-.55 2.14-.83 3.33-.24 1 .5 1.81 1.48 1.81 1.78 0 3.14-1.88 3.14-4.58 0-2.39-1.72-4.07-4.18-4.07-2.85 0-4.52 2.14-4.52 4.35 0 .86.33 1.79.74 2.29.08.1.09.19.07.29-.08.32-.25 1-.28 1.14-.05.19-.15.23-.35.14-1.3-.61-2.11-2.5-2.11-4.02 0-3.28 2.38-6.29 6.87-6.29 3.61 0 6.41 2.57 6.41 6.01 0 3.58-2.26 6.47-5.4 6.47-1.05 0-2.04-.55-2.38-1.2l-.65 2.47c-.23.9-.86 2.03-1.29 2.72.97.3 2 .46 3.07.46 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
    </svg>
  );
}

function ThreadsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.19 2c3.02 0 5.24 1 6.6 2.98 1.03 1.49 1.55 3.5 1.62 6.02v1.99c-.07 2.5-.59 4.51-1.62 6-1.36 1.98-3.58 2.98-6.6 2.98h-.02c-2.63-.02-4.65-.88-6.01-2.55C4.94 17.9 4.3 15.5 4.25 12.5v-1c.05-3 .69-5.4 1.91-6.94C7.52 2.88 9.54 2.02 12.17 2h.02Zm.62 15.36c1.32-.07 2.36-.5 2.36-1.66 0-.9-.72-1.51-1.9-1.72l-.5-.06c.05-.63.35-1.06.95-1.06.5 0 .84.28 1.03.83l1.68-.49c-.4-1.28-1.36-1.98-2.72-1.98-1.68 0-2.77 1.12-2.86 3.02-.98.28-1.66.94-1.66 1.98 0 1.42 1.24 2.28 3.02 2.28l.6-.02Zm-.5-2.98c.6.06.96.29.96.7 0 .43-.44.66-1.06.66-.6 0-1.02-.26-1.02-.72 0-.4.42-.68 1.12-.64Z" />
    </svg>
  );
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  icon: ComponentType<IconProps>;
  color: string;
  bg: string; // gradiente tailwind (usar com bg-gradient-to-br)
  charLimit: number;
  features: {
    location: boolean;
    tagProfiles: boolean;
    collab: boolean;
    firstComment: boolean;
    hashtags: boolean;
    title: boolean; // título separado (YouTube, Pinterest)
  };
  formats: string[];
}

export const PLATFORMS: PlatformConfig[] = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
    bg: "from-[#F58529] via-[#DD2A7B] to-[#8134AF]",
    charLimit: 2200,
    features: { location: true, tagProfiles: true, collab: true, firstComment: true, hashtags: true, title: false },
    formats: ["Feed", "Reels", "Stories", "Carrossel"],
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    bg: "from-blue-500 to-blue-700",
    charLimit: 63206,
    features: { location: true, tagProfiles: true, collab: false, firstComment: true, hashtags: true, title: false },
    formats: ["Feed", "Stories", "Reels"],
  },
  {
    id: "twitter",
    name: "Twitter / X",
    icon: Twitter,
    color: "text-sky-500",
    bg: "from-sky-400 to-sky-600",
    charLimit: 280,
    features: { location: false, tagProfiles: true, collab: false, firstComment: false, hashtags: true, title: false },
    formats: ["Post", "Thread"],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "text-blue-700",
    bg: "from-blue-600 to-blue-800",
    charLimit: 3000,
    features: { location: false, tagProfiles: true, collab: false, firstComment: true, hashtags: true, title: false },
    formats: ["Post", "Artigo", "Documento"],
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music2,
    color: "text-fuchsia-500",
    bg: "from-fuchsia-500 via-rose-500 to-cyan-400",
    charLimit: 2200,
    features: { location: false, tagProfiles: true, collab: false, firstComment: false, hashtags: true, title: false },
    formats: ["Vídeo"],
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "text-red-600",
    bg: "from-red-500 to-red-700",
    charLimit: 5000,
    features: { location: false, tagProfiles: false, collab: false, firstComment: false, hashtags: true, title: true },
    formats: ["Vídeo", "Shorts"],
  },
  {
    id: "pinterest",
    name: "Pinterest",
    icon: PinterestIcon,
    color: "text-rose-600",
    bg: "from-rose-500 to-red-600",
    charLimit: 500,
    features: { location: false, tagProfiles: false, collab: false, firstComment: false, hashtags: true, title: true },
    formats: ["Pin", "Idea Pin"],
  },
  {
    id: "threads",
    name: "Threads",
    icon: ThreadsIcon,
    color: "text-foreground",
    bg: "from-neutral-700 to-black",
    charLimit: 500,
    features: { location: false, tagProfiles: true, collab: false, firstComment: false, hashtags: false, title: false },
    formats: ["Post", "Thread"],
  },
];

export const platformById = (id: PlatformId): PlatformConfig =>
  PLATFORMS.find((p) => p.id === id) || PLATFORMS[0];
