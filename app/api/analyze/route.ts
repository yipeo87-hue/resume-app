import { NextRequest, NextResponse } from "next/server";
import { parseFile, getFileType } from "@/lib/parsers";
import { analyzeResume } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "请上传一个文件" }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "文件大小不能超过 10MB" }, { status: 413 });
    }

    const fileType = getFileType(file as unknown as File);
    if (!fileType) {
      return NextResponse.json(
        { error: "暂不支持此文件格式，请上传 PDF 或 Word (.docx) 文件" },
        { status: 400 }
      );
    }

    const text = await parseFile(file as unknown as File);

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: "无法从文件中提取足够的文字内容，请确认文件包含完整的简历信息" },
        { status: 422 }
      );
    }

    const supplement = (formData.get("supplement") as string) || "";
    const lang = ((formData.get("lang") as string) || "zh") as "zh" | "en";
    const result = await analyzeResume(text, supplement, lang);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "服务器错误";
    console.error("Analysis error:", message);

    if (message === "MISSING_API_KEY") {
      return NextResponse.json(
        { error: "API Key 未配置。请在 .env.local 文件中填入你的 DeepSeek API Key" },
        { status: 500 }
      );
    }

    if (message.includes("authentication") || message.includes("401")) {
      return NextResponse.json(
        { error: "API Key 无效。请检查 .env.local 中的 API Key 是否正确" },
        { status: 500 }
      );
    }

    return NextResponse.json({ error: "分析失败，请稍后重试" }, { status: 500 });
  }
}

export const runtime = "nodejs";
