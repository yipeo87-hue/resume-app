import { NextRequest, NextResponse } from "next/server";
import { parseFile, getFileType } from "@/lib/parsers";
import { compareResumes } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const fileA = formData.get("fileA");
    const fileB = formData.get("fileB");

    if (!fileA || !(fileA instanceof File) || !fileB || !(fileB instanceof File)) {
      return NextResponse.json({ error: "请上传两份简历文件" }, { status: 400 });
    }
    if (fileA.size > 10 * 1024 * 1024 || fileB.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "文件大小不能超过 10MB" }, { status: 413 });
    }

    const typeA = getFileType(fileA as unknown as File);
    const typeB = getFileType(fileB as unknown as File);
    if (!typeA || !typeB) {
      return NextResponse.json({ error: "请上传 PDF 或 Word (.docx) 格式的文件" }, { status: 400 });
    }

    const [textA, textB] = await Promise.all([
      parseFile(fileA as unknown as File),
      parseFile(fileB as unknown as File),
    ]);

    if (textA.trim().length < 50 || textB.trim().length < 50) {
      return NextResponse.json({ error: "无法从文件中提取足够的文字内容" }, { status: 422 });
    }

    const lang = ((formData.get("lang") as string) || "zh") as "zh" | "en";
    const result = await compareResumes(textA, textB, lang);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "服务器错误";
    console.error("Compare error:", message);
    if (message === "MISSING_API_KEY") {
      return NextResponse.json({ error: "API Key 未配置" }, { status: 500 });
    }
    return NextResponse.json({ error: "对比分析失败，请稍后重试" }, { status: 500 });
  }
}

export const runtime = "nodejs";
