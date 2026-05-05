"use client";
import type { AnalysisResult } from "@/lib/types";
import type { Lang } from "@/lib/i18n";
import AtsScoreCard from "./AtsScoreCard";
import SectionCard from "./SectionCard";
import MotivationBanner from "./MotivationBanner";
import ExportButton from "./ExportButton";

interface Props { result: AnalysisResult; lang: Lang; }
export default function ResultsPanel({ result, lang }: Props) {
  const atsSection = result.sections.find((s) => s.title.includes("ATS") || s.title.includes("兼容性"));
  const otherSections = result.sections.filter((s) => !s.title.includes("ATS") && !s.title.includes("兼容性"));
  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <AtsScoreCard score={result.overall.score} lang={lang} />
        <div className="flex-1 rounded-2xl border border-gray-100/80 bg-white/90 backdrop-blur-sm shadow-sm p-5">
          <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">{lang === "zh" ? "整体评价" : "Overall Review"}</p>
          <p className="text-gray-700 leading-relaxed text-sm">{result.overall.summary}</p>
        </div>
      </div>
      <div className="space-y-3">
        {otherSections.map((s) => <SectionCard key={s.title} section={s} lang={lang} />)}
        {atsSection && <SectionCard key="ats" section={atsSection} lang={lang} />}
      </div>
      <MotivationBanner text={result.motivation} />
      <div className="flex justify-center"><ExportButton result={result} lang={lang} /></div>
    </div>
  );
}
