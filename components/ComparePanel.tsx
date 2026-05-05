"use client";
import { useState } from "react";
import type { CompareResult } from "@/lib/types";
import { useT, type Lang } from "@/lib/i18n";
import { saveHistory } from "@/lib/history";

interface Props { lang: Lang; }
export default function ComparePanel({ lang }: Props) {
  const t = useT(lang);
  const [step, setStep] = useState<"upload" | "analyzing" | "done" | "error">("upload");
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [result, setResult] = useState<CompareResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function getHandler(which: "A" | "B") { return (f: File) => { if (which === "A") setFileA(f); else setFileB(f); setError(null); }; }
  async function handleCompare() {
    if (!fileA || !fileB) return; setStep("analyzing");
    try {
      const fd = new FormData(); fd.append("fileA", fileA); fd.append("fileB", fileB); fd.append("lang", lang);
      const res = await fetch("/api/compare", { method: "POST", body: fd }); const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Compare failed");
      setResult(data); setStep("done");
      saveHistory({ mode: "compare", fileName: `${fileA.name} ↔ ${fileB.name}`, result: data });
    } catch (e: any) { setError(e.message); setStep("error"); }
  }
  function reset() { setStep("upload"); setFileA(null); setFileB(null); setResult(null); setError(null); }

  if (step === "upload") return (
    <div className="max-w-xl mx-auto space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {([['A', 'oldVersion', fileA, setFileA], ['B', 'newVersion', fileB, setFileB]] as const).map(([which, labelKey, f, setF]) => (
          <div key={which}>
            <p className="text-center text-xs font-semibold text-gray-400 mb-3">{t(labelKey)}</p>
            {f ? (
              <div className="rounded-2xl bg-white/90 border border-green-200/50 p-4 text-center shadow-sm"><p className="text-sm font-medium truncate">{f.name}</p><button onClick={() => setF(null)} className="text-xs text-red-400 mt-1 hover:text-red-500">{t("remove")}</button></div>
            ) : (
              <label className="flex flex-col items-center justify-center h-32 rounded-2xl border-2 border-dashed border-gray-200/80 bg-white/60 cursor-pointer hover:border-amber-300 hover:bg-amber-50/30 transition-all shadow-sm">
                <span className="text-2xl">{which === 'A' ? '📄' : '📝'}</span><span className="text-xs text-gray-400 mt-1">{t("clickUpload")}</span>
                <input type="file" accept=".pdf,.docx" onChange={(e) => e.target.files?.[0] && getHandler(which)(e.target.files[0])} className="hidden" />
              </label>
            )}
          </div>
        ))}
      </div>
      <button onClick={handleCompare} disabled={!fileA || !fileB} className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-3.5 text-base font-semibold text-white hover:shadow-lg hover:shadow-amber-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all">{t("startCompare")}</button>
    </div>
  );
  if (step === "analyzing") return (<div className="flex flex-col items-center justify-center py-20 gap-6"><div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" /><p className="text-base text-amber-600 font-medium animate-pulse">{t("comparing")}</p></div>);
  if (step === "error") return (<div className="text-center py-20"><p className="text-5xl mb-4">😥</p><p className="text-red-400 mb-4">{error}</p><button onClick={reset} className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-2.5 text-sm font-medium text-white">{t("reset")}</button></div>);

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <button onClick={reset} className="text-sm text-amber-500 hover:text-amber-600 underline font-medium">{t("recompare")}</button>
      <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 p-5">
        <p className="text-xs font-semibold text-amber-600 mb-1 uppercase tracking-wide">{t("overallImprovement")}</p><p className="text-sm text-gray-700">{result!.overallImprovement}</p>
      </div>
      <div className="space-y-3">
        {result!.sections.map((s) => (
          <div key={s.name} className="rounded-2xl bg-white/90 border border-gray-100 p-5 shadow-sm">
            <p className="font-semibold text-gray-800 mb-3">{s.name}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-red-50/50 p-3"><p className="text-red-400 text-xs mb-1">{lang === "zh" ? "旧版" : "Old"}</p><p className="text-gray-600 text-xs">{s.versionA}</p></div>
              <div className="rounded-xl bg-green-50/50 p-3"><p className="text-green-400 text-xs mb-1">{lang === "zh" ? "新版" : "New"}</p><p className="text-gray-600 text-xs">{s.versionB}</p></div>
            </div><p className="mt-2 text-xs text-amber-500">{s.verdict}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl bg-white/90 border border-gray-100 p-5 shadow-sm">
        <p className="text-xs font-semibold text-gray-500 mb-2">{t("furtherSuggestions")}</p>
        <ul className="space-y-1">{result!.suggestions.map((s, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600"><span className="text-amber-400">•</span>{s}</li>)}</ul>
      </div>
      <div className="rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 border border-amber-200/50 p-5 text-center"><p className="text-2xl mb-2">🌈</p><p className="text-gray-700 italic">"{result!.motivation}"</p></div>
    </div>
  );
}
