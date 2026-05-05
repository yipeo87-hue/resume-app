"use client";

import type { Lang } from "@/lib/i18n";

interface Props {
  lang: Lang;
  onChange: (lang: Lang) => void;
}

export default function LanguageToggle({ lang, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(lang === "zh" ? "en" : "zh")}
      className="flex items-center gap-1.5 rounded-full border border-amber-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 hover:border-amber-300 transition-all shadow-sm"
    >
      <span className={lang === "zh" ? "opacity-100" : "opacity-40"}>中</span>
      <span className="text-amber-300">/</span>
      <span className={lang === "en" ? "opacity-100" : "opacity-40"}>EN</span>
    </button>
  );
}
