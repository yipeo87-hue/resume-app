import { NextRequest, NextResponse } from "next/server";
import { rewriteSection } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originalText, sectionTitle, improvementNote, lang } = body;

    if (!originalText || !sectionTitle) {
      return NextResponse.json({ error: "请提供原文和模块名称" }, { status: 400 });
    }
    if (originalText.length > 5000) {
      return NextResponse.json({ error: "原文过长" }, { status: 400 });
    }

    const result = await rewriteSection(originalText, sectionTitle, improvementNote || "", (lang as "zh" | "en") || "zh");
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "服务器错误";
    console.error("Rewrite error:", message);
    if (message === "MISSING_API_KEY") {
      return NextResponse.json({ error: "API Key 未配置" }, { status: 500 });
    }
    return NextResponse.json({ error: "改写失败，请稍后重试" }, { status: 500 });
  }
}

export const runtime = "nodejs";
