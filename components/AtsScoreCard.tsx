import type { Lang } from "@/lib/i18n";
import { useT } from "@/lib/i18n";

interface Props { score: number; lang: Lang; }
function getLabelKey(score: number): "scoreExcellent" | "scoreGood" | "scoreAverage" | "scoreNeedsWork" {
  if (score >= 8) return "scoreExcellent"; if (score >= 6) return "scoreGood"; if (score >= 4) return "scoreAverage"; return "scoreNeedsWork";
}
function getColor(score: number): string {
  if (score >= 8) return "text-green-500"; if (score >= 6) return "text-amber-500"; if (score >= 4) return "text-orange-500"; return "text-red-400";
}

export default function AtsScoreCard({ score, lang }: Props) {
  const t = useT(lang);
  const pct = (score / 10) * 100;
  return (
    <div className="rounded-2xl border border-gray-100/80 bg-white/90 backdrop-blur-sm shadow-sm p-6 text-center">
      <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wide">{t("overallScore")}</p>
      <div className="relative w-24 h-24 mx-auto mb-3">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#f3f4f6" strokeWidth="10" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" className={getColor(score)} strokeDasharray={`${pct * 2.64} 264`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{score}</span>
          <span className="text-xs text-gray-300">/10</span>
        </div>
      </div>
      <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
        score >= 8 ? "bg-green-50 text-green-600" : score >= 6 ? "bg-amber-50 text-amber-600" : score >= 4 ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-500"}`}>
        {t(getLabelKey(score))}
      </span>
    </div>
  );
}
