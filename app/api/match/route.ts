import { NextRequest, NextResponse } from "next/server";
import { parseFile, getFileType } from "@/lib/parsers";
import { matchResumeToJD } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const jdText = (formData.get("jd") as string) || "";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "请上传简历文件" }, { status: 400 });
    }
    if (!jdText || jdText.trim().length < 10) {
      return NextResponse.json({ error: "请输入完整的职位描述（至少10个字）" }, { status: 400 });
    }
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "文件大小不能超过 10MB" }, { status: 413 });
    }

    const fileType = getFileType(file as unknown as File);
    if (!fileType) {
      return NextResponse.json({ error: "暂不支持此文件格式，请上传 PDF 或 Word (.docx) 文件" }, { status: 400 });
    }

    const resumeText = await parseFile(file as unknown as File);
    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json({ error: "无法从文件中提取足够的文字内容" }, { status: 422 });
    }

    const lang = ((formData.get("lang") as string) || "zh") as "zh" | "en";
    const result = await matchResumeToJD(resumeText, jdText.trim(), lang);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "服务器错误";
    console.error("Match error:", message);
    if (message === "MISSING_API_KEY") {
      return NextResponse.json({ error: "API Key 未配置" }, { status: 500 });
    }
    return NextResponse.json({ error: "匹配分析失败，请稍后重试" }, { status: 500 });
  }
}

export const runtime = "nodejs";
