"use client";
import { useState } from "react";
import type { SectionFeedback } from "@/lib/types";
import { useT, type Lang } from "@/lib/i18n";
import RewriteModal from "./RewriteModal";

interface Props { section: SectionFeedback; lang: Lang; defaultOpen?: boolean; }
export default function SectionCard({ section, lang, defaultOpen = false }: Props) {
  const t = useT(lang);
  const [open, setOpen] = useState(defaultOpen);
  const [showRewrite, setShowRewrite] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-100/80 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50/50 transition-colors">
        <h3 className="text-base font-semibold text-gray-800">{section.title}</h3>
        <span className={`text-sm text-gray-300 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>▾</span>
      </button>
      <div className={`px-5 overflow-hidden transition-all duration-300 ${open ? "max-h-[800px] pb-5" : "max-h-0"}`}>
        <div className="mb-4">
          <p className="text-xs font-semibold text-green-500 mb-2 uppercase tracking-wide">✅ {t("strengths")}</p>
          <ul className="space-y-1.5">{section.strengths.map((s, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600"><span className="text-green-300 mt-1">•</span>{s}</li>)}</ul>
        </div>
        <div className="mb-4">
          <p className="text-xs font-semibold text-amber-500 mb-2 uppercase tracking-wide">💡 {t("improvements")}</p>
          <ul className="space-y-1.5">{section.improvements.map((s, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600"><span className="text-amber-300 mt-1">•</span>{s}</li>)}</ul>
        </div>
        <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-4 border border-amber-100/50">
          <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wide">📝 {t("suggestion")}</p>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">{section.suggestion}</p>
          <button onClick={(e) => { e.stopPropagation(); setShowRewrite(true); }}
            className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 text-xs font-semibold text-white hover:shadow-lg hover:shadow-amber-200 transition-all active:scale-95">{t("aiRewrite")}</button>
        </div>
      </div>
      {showRewrite && <RewriteModal sectionTitle={section.title} originalText="" suggestion={section.suggestion} lang={lang} onClose={() => setShowRewrite(false)} />}
    </div>
  );
}
