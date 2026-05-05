"use client";
import { useState } from "react";
import type { MatchResult } from "@/lib/types";
import { useT, type Lang } from "@/lib/i18n";
import { saveHistory } from "@/lib/history";
import FileDropzone from "./FileDropzone";
import LoadingOverlay from "./LoadingOverlay";

interface Props { lang: Lang; }
export default function MatchPanel({ lang }: Props) {
  const t = useT(lang);
  const [step, setStep] = useState<"upload" | "jd" | "analyzing" | "done" | "error">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileSelected(f: File) { setFile(f); setError(null); setStep("jd"); }
  async function handleAnalyze() {
    if (!file || jdText.trim().length < 10) return; setStep("analyzing");
    try {
      const fd = new FormData(); fd.append("file", file); fd.append("jd", jdText.trim()); fd.append("lang", lang);
      const res = await fetch("/api/match", { method: "POST", body: fd }); const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Match failed");
      setResult(data); setStep("done");
      saveHistory({ mode: "match", fileName: file.name, result: data, jdText: jdText.trim() });
    } catch (e: any) { setError(e.message); setStep("error"); }
  }
  function reset() { setStep("upload"); setFile(null); setJdText(""); setResult(null); setError(null); }

  if (step === "upload") return <FileDropzone onFileSelected={handleFileSelected} lang={lang} />;
  if (step === "jd") return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="flex items-center gap-3 rounded-2xl bg-white/90 border border-green-200/50 px-5 py-4 shadow-sm"><span className="text-2xl">📄</span><p className="text-gray-800 font-medium truncate flex-1">{file?.name}</p><button onClick={reset} className="text-sm text-gray-300 hover:text-red-400">{t("reselect")}</button></div>
      <div><label className="block text-sm font-medium text-gray-500 mb-2">{t("jdLabel")}</label><textarea value={jdText} onChange={(e) => setJdText(e.target.value)} placeholder={t("jdPlaceholder")} rows={8} className="w-full rounded-2xl border border-gray-200/80 bg-white/90 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/50" /></div>
      <button onClick={handleAnalyze} disabled={jdText.trim().length < 10} className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-base font-semibold text-white hover:shadow-lg hover:shadow-amber-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all">{t("startMatch")}</button>
    </div>
  );
  if (step === "analyzing") return <LoadingOverlay lang={lang} />;
  if (step === "error") return (<div className="text-center py-20"><p className="text-5xl mb-4">😥</p><p className="text-red-400 mb-4">{error}</p><button onClick={reset} className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-2.5 text-sm font-medium text-white">{t("reset")}</button></div>);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button onClick={reset} className="text-sm text-amber-500 hover:text-amber-600 underline font-medium">{t("rematch")}</button>
      <div className="rounded-2xl bg-white/90 border border-gray-100 p-6 text-center shadow-sm">
        <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wide">{t("matchOverall")}</p>
        <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 mb-2">{result!.overallMatch}%</div>
        <div className="w-full bg-gray-100 rounded-full h-2"><div className="bg-gradient-to-r from-amber-400 to-orange-400 h-2 rounded-full transition-all duration-1000" style={{ width: `${result!.overallMatch}%` }} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {result!.dimensions.map((d) => (
          <div key={d.name} className="rounded-2xl bg-white/90 border border-gray-100 p-4 shadow-sm">
            <div className="flex justify-between items-center mb-1"><span className="text-xs font-medium text-gray-600">{d.name}</span><span className="text-xs font-bold text-amber-500">{d.score}%</span></div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2"><div className="bg-gradient-to-r from-amber-400 to-orange-400 h-1.5 rounded-full" style={{ width: `${d.score}%` }} /></div>
            <p className="text-xs text-gray-400">{d.detail}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white/90 border border-gray-100 p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 mb-2">{t("keywordsMatched")}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">{result!.matchedKeywords.map((k) => <span key={k} className="px-2 py-1 rounded-lg bg-green-50 text-green-600 text-xs font-medium">{k}</span>)}</div>
        <p className="text-xs font-semibold text-gray-500 mb-2">{t("keywordsMissing")}</p>
        <div className="flex flex-wrap gap-1.5">{result!.missingKeywords.map((k) => <span key={k} className="px-2 py-1 rounded-lg bg-red-50 text-red-500 text-xs font-medium">{k}</span>)}</div>
      </div>
      <div className="rounded-2xl bg-white/90 border border-gray-100 p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 mb-2">{t("gapAnalysis")}</p><p className="text-sm text-gray-600 mb-4">{result!.gapAnalysis}</p>
        <p className="text-xs font-semibold text-gray-500 mb-2">{t("tailoredAdvice")}</p><p className="text-sm text-gray-600">{result!.tailoredAdvice}</p>
      </div>
    </div>
  );
}
