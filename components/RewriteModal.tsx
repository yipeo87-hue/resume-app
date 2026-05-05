"use client";
import { useState } from "react";
import type { RewriteResult } from "@/lib/types";
import { useT, type Lang } from "@/lib/i18n";

interface Props { sectionTitle: string; originalText: string; suggestion: string; lang: Lang; onClose: () => void; }
export default function RewriteModal({ sectionTitle, originalText, suggestion, lang, onClose }: Props) {
  const t = useT(lang);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [text, setText] = useState(originalText);
  const [result, setResult] = useState<RewriteResult | null>(null);
  const [error, setError] = useState("");

  async function handleRewrite() {
    if (!text.trim()) { setError(lang === "zh" ? "请先粘贴需要改写的原文" : "Please paste the original text first"); setStatus("error"); return; }
    setStatus("loading"); setError("");
    try {
      const res = await fetch("/api/rewrite", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ originalText: text.trim(), sectionTitle, improvementNote: suggestion, lang }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rewrite failed");
      setResult(data); setStatus("done");
    } catch (e: any) { setError(e.message); setStatus("error"); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">{t("rewriteTitle")} - {sectionTitle}</h3>
          <button onClick={onClose} className="text-gray-300 hover:text-gray-500 text-xl leading-none">&times;</button>
        </div>
        {status === "idle" && (<>
          <div className="rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-3 mb-3">
            <p className="text-xs text-amber-500 font-semibold mb-1">{t("rewriteSuggestion")}</p>
            <p className="text-sm text-amber-700">{suggestion || t("noSuggestion")}</p>
          </div>
          <div className="mb-4">
            <label className="block text-xs text-gray-400 mb-1">{t("rewritePaste")}</label>
            <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t("rewritePlaceholder")} rows={6}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3 text-sm text-gray-700 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all" />
          </div>
          <button onClick={handleRewrite} className="w-full rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 py-2.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-amber-200 transition-all active:scale-[0.98]">{t("rewriteStart")}</button>
        </>)}
        {status === "loading" && (<div className="text-center py-10"><div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" /><p className="text-sm text-gray-400">{lang === "zh" ? "AI 正在帮你改写..." : "AI is rewriting..."}</p></div>)}
        {status === "done" && result && (<>
          <div className="rounded-xl bg-gray-50 p-3 mb-2"><p className="text-xs text-gray-400 mb-1">{lang === "zh" ? "原文" : "Original"}</p><p className="text-sm text-gray-500">{result.original}</p></div>
          <div className="rounded-xl bg-green-50 p-4 mb-3"><p className="text-xs text-green-500 font-semibold mb-1">{t("rewriteResult")}</p><p className="text-sm text-gray-700 whitespace-pre-wrap">{result.rewritten}</p></div>
          <p className="text-xs text-gray-400 mb-4">💡 {result.explanation}</p>
          <div className="flex gap-3">
            <button onClick={() => { navigator.clipboard.writeText(result.rewritten); }} className="flex-1 rounded-xl border border-amber-300 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 transition-all">{t("copyResult")}</button>
            <button onClick={() => { setStatus("idle"); setResult(null); }} className="rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50">{t("rewriteAgain")}</button>
          </div>
        </>)}
        {status === "error" && (<div className="text-center py-8"><p className="text-red-400 text-sm mb-3">{error}</p><button onClick={() => setStatus("idle")} className="text-sm text-amber-500 underline">{t("restart")}</button></div>)}
      </div>
    </div>
  );
}
