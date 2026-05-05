"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import type { Lang } from "@/lib/i18n";
import { useT } from "@/lib/i18n";

interface Props { onFileSelected: (file: File) => void; lang: Lang; }
export default function FileDropzone({ onFileSelected, lang }: Props) {
  const t = useT(lang);
  const onDrop = useCallback((accepted: File[]) => { if (accepted.length > 0) onFileSelected(accepted[0]); }, [onFileSelected]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, maxFiles: 1, maxSize: 10 * 1024 * 1024,
    accept: { "application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"] },
  });

  return (
    <div {...getRootProps()}
      className={`relative w-full max-w-xl mx-auto rounded-3xl border-2 border-dashed p-14 text-center cursor-pointer transition-all duration-500 ${
        isDragActive ? "border-amber-400 bg-amber-50/80 scale-[1.02] shadow-2xl shadow-amber-100" : "border-amber-200/60 bg-white/60 hover:border-amber-300 hover:bg-amber-50/40 hover:shadow-xl hover:shadow-amber-50"
      }`}>
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-4xl shadow-inner animate-float">📄</div>
        {isDragActive ? (
          <p className="text-lg text-amber-500 font-medium animate-pulse">{lang === "zh" ? "放手吧 ✨" : "Drop it! ✨"}</p>
        ) : (
          <>
            <p className="text-xl font-semibold text-gray-700">{t("dropHere")}</p>
            <p className="text-sm text-gray-400">{t("supportedFormats")}</p>
            <span className="mt-2 inline-block rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-7 py-2.5 text-sm font-medium text-white hover:shadow-lg hover:shadow-amber-200 transition-all active:scale-95">{t("clickToSelect")}</span>
          </>
        )}
      </div>
    </div>
  );
}
