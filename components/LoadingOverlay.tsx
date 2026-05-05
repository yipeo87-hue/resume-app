"use client";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

interface Props { lang: Lang; }
export default function LoadingOverlay({ lang }: Props) {
  const msgs = t.loadingMessages[lang];
  const [idx, setIdx] = useState(0);
  useEffect(() => { const timer = setInterval(() => setIdx((p) => (p + 1) % msgs.length), 2500); return () => clearInterval(timer); }, [msgs.length]);
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-6">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-amber-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-amber-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-orange-400 animate-spin animation-delay-300" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
      </div>
      <p className="text-base text-amber-600 font-medium animate-pulse transition-all duration-500">{msgs[idx]}</p>
    </div>
  );
}
