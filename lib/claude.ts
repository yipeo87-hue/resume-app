import type { AnalysisResult, MatchResult, RewriteResult, CompareResult } from "./types";

const DEEPSEEK_BASE = "https://api.deepseek.com/v1";
const MODEL = "deepseek-chat";
const TEMPERATURE = 0.1;

const PLACEHOLDER_KEYS = ["your_api_key_here", "your-key-", "your_key_here"];

function extractJson(text: string): string {
  let s = text.trim();
  if (s.startsWith("```json")) s = s.slice(7);
  else if (s.startsWith("```")) s = s.slice(3);
  if (s.endsWith("```")) s = s.slice(0, -3);
  return s.trim();
}

async function callDeepSeek(system: string, user: string, maxTokens = 3000): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || PLACEHOLDER_KEYS.some((p) => apiKey.includes(p))) {
    throw new Error("MISSING_API_KEY");
  }
  const res = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model: MODEL, max_tokens: maxTokens, temperature: TEMPERATURE,
      messages: [{ role: "system", content: system }, { role: "user", content: user }],
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    if (res.status === 401) throw new Error("DeepSeek authentication failed: " + errText);
    throw new Error(`DeepSeek API error ${res.status}: ${errText}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("DeepSeek returned no content");
  return content;
}

// ==================== Prompts ====================

const ANALYZE_ZH = `你是温暖的职场导师。分析简历并给出修改建议和鼓励。规则：先优点后改进，具体可操作，只返回JSON。

评分标准(1-10)：10完美 8-9优秀 6-7良好 4-5一般 2-3较差 1空白
评分维度：内容完整性25% 量化成果25% 语言表达20% 结构排版15% ATS友好度15%

返回JSON：{ "overall": { "score": <1-10>, "summary": "<2-3句>" }, "sections": [ { "title": "个人总结", "strengths": [], "improvements": [], "suggestion": "" }, { "title": "工作经历", "strengths": [], "improvements": [], "suggestion": "" }, { "title": "技能专长", "strengths": [], "improvements": [], "suggestion": "" }, { "title": "教育背景", "strengths": [], "improvements": [], "suggestion": "" }, { "title": "ATS 兼容性", "strengths": [], "improvements": [], "suggestion": "" } ], "motivation": "<温暖鼓励>" }`;

const ANALYZE_EN = `You are a warm, empathetic career coach. Analyze the resume and provide specific, actionable feedback in ENGLISH. The resume text may be in Chinese — read and understand it, but ALL your output MUST be in English.

CRITICAL: Write every field (summary, strengths, improvements, suggestion, motivation) in English. Do not output any Chinese text.

Rules: strengths first then improvements, be specific, return ONLY JSON.

Scoring (1-10): 10=Perfect 8-9=Excellent 6-7=Good 4-5=Average 2-3=Poor 1=Blank
Dimensions: Completeness 25% Quantitative Results 25% Expression 20% Structure 15% ATS Friendliness 15%

Return JSON: { "overall": { "score": <1-10>, "summary": "<2-3 sentences>" }, "sections": [ { "title": "Professional Summary", "strengths": [], "improvements": [], "suggestion": "" }, { "title": "Work Experience", "strengths": [], "improvements": [], "suggestion": "" }, { "title": "Skills", "strengths": [], "improvements": [], "suggestion": "" }, { "title": "Education", "strengths": [], "improvements": [], "suggestion": "" }, { "title": "ATS Compatibility", "strengths": [], "improvements": [], "suggestion": "" } ], "motivation": "<encouraging message in English>" }`;

const MATCH_ZH = `你是求职匹配分析师。对比简历和JD，给出匹配分析。只返回JSON。

格式：{ "overallMatch": <0-100>, "dimensions": [{"name":"技能匹配","score":<0-100>,"detail":""},{"name":"经验匹配","score":<0-100>,"detail":""},{"name":"学历匹配","score":<0-100>,"detail":""},{"name":"综合素质","score":<0-100>,"detail":""}], "matchedKeywords": [], "missingKeywords": [], "gapAnalysis": "", "tailoredAdvice": "" }`;

const MATCH_EN = `You are a job matching analyst. Compare the resume with the JD and provide matching analysis. The resume may be in Chinese — understand it, but output ALL content in English. Return ONLY JSON.

Format: { "overallMatch": <0-100>, "dimensions": [{"name":"Skills Match","score":<0-100>,"detail":""},{"name":"Experience Match","score":<0-100>,"detail":""},{"name":"Education Match","score":<0-100>,"detail":""},{"name":"Overall Fit","score":<0-100>,"detail":""}], "matchedKeywords": [], "missingKeywords": [], "gapAnalysis": "", "tailoredAdvice": "" }`;

const REWRITE_ZH = `你是简历写作专家。根据原文和建议，重写简历片段。规则：保留原意、量化语言、专业表达、简洁有力。只返回JSON。

格式：{ "original": "<原文>", "rewritten": "<改写版>", "explanation": "<改写理由>" }`;

const REWRITE_EN = `You are a resume writing expert. Rewrite the resume section based on the original text and suggestions. The original may be in Chinese — understand it, but rewrite the output in English. Return ONLY JSON.

Format: { "original": "<original>", "rewritten": "<rewritten in English>", "explanation": "<reasoning in English>" }`;

const COMPARE_ZH = `你是简历评审专家。对比A(旧版)和B(新版)，评估改进。只返回JSON。

格式：{ "overallImprovement": "<2-3句>", "sections": [{"name":"个人总结","versionA":"","versionB":"","verdict":""},{"name":"工作经历","versionA":"","versionB":"","verdict":""},{"name":"技能专长","versionA":"","versionB":"","verdict":""},{"name":"教育背景","versionA":"","versionB":"","verdict":""}], "suggestions": [], "motivation": "" }`;

const COMPARE_EN = `You are a resume review expert. Compare version A (old) and B (new), evaluate improvements. The resumes may be in Chinese — understand them, but output ALL content in English. Return ONLY JSON.

Format: { "overallImprovement": "<2-3 sentences in English>", "sections": [{"name":"Professional Summary","versionA":"","versionB":"","verdict":""},{"name":"Work Experience","versionA":"","versionB":"","verdict":""},{"name":"Skills","versionA":"","versionB":"","verdict":""},{"name":"Education","versionA":"","versionB":"","verdict":""}], "suggestions": [], "motivation": "" }`;

// ==================== Functions ====================

export async function analyzeResume(resumeText: string, supplement?: string, lang: "zh" | "en" = "zh"): Promise<AnalysisResult> {
  const system = lang === "en" ? ANALYZE_EN : ANALYZE_ZH;
  const extraLine = lang === "en" ? "Return strictly in JSON format." : "严格按JSON格式返回。";
  const supplementBlock = supplement ? (lang === "en"
    ? `\n\nApplicant notes: ${supplement}\n\nPlease consider these notes in your analysis.`
    : `\n\n求职者补充说明：${supplement}\n\n请结合以上补充信息进行分析。`) : "";
  const analysisLabel = lang === "en" ? "Analyze this resume:" : "分析这份简历：";
  const user = `${analysisLabel}\n---\n${resumeText}\n---${supplementBlock}\n${extraLine}`;
  const content = await callDeepSeek(system, user);
  return JSON.parse(extractJson(content)) as AnalysisResult;
}

export async function matchResumeToJD(resumeText: string, jdText: string, lang: "zh" | "en" = "zh"): Promise<MatchResult> {
  const system = lang === "en" ? MATCH_EN : MATCH_ZH;
  const resumeLabel = lang === "en" ? "Resume:" : "简历内容：";
  const jdLabel = lang === "en" ? "Job Description:" : "职位描述：";
  const extraLine = lang === "en" ? "Return strictly in JSON format." : "严格按JSON格式返回。";
  const user = `${resumeLabel}\n---\n${resumeText}\n---\n\n${jdLabel}\n---\n${jdText}\n---\n\n${lang === "en" ? "Compare and analyze." : "请对比分析。"}\n${extraLine}`;
  const content = await callDeepSeek(system, user);
  return JSON.parse(extractJson(content)) as MatchResult;
}

export async function rewriteSection(originalText: string, sectionTitle: string, improvementNote: string, lang: "zh" | "en" = "zh"): Promise<RewriteResult> {
  const system = lang === "en" ? REWRITE_EN : REWRITE_ZH;
  const sectionLabel = lang === "en" ? "Section:" : "简历模块：";
  const originalLabel = lang === "en" ? "Original:" : "原文：";
  const improveLabel = lang === "en" ? "Improvement direction:" : "改进方向：";
  const rewriteLabel = lang === "en" ? "Please rewrite this section." : "请改写这段内容。";
  const user = `${sectionLabel} ${sectionTitle}\n${originalLabel} ${originalText}\n${improveLabel} ${improvementNote}\n\n${rewriteLabel}`;
  const content = await callDeepSeek(system, user, 1500);
  return JSON.parse(extractJson(content)) as RewriteResult;
}

export async function compareResumes(resumeA: string, resumeB: string, lang: "zh" | "en" = "zh"): Promise<CompareResult> {
  const system = lang === "en" ? COMPARE_EN : COMPARE_ZH;
  const oldLabel = lang === "en" ? "Old Version:" : "旧版简历：";
  const newLabel = lang === "en" ? "New Version:" : "新版简历：";
  const compareLabel = lang === "en" ? "Compare both versions and evaluate improvements." : "请对比两份简历，评估改进效果。";
  const user = `${oldLabel}\n---\n${resumeA}\n---\n\n${newLabel}\n---\n${resumeB}\n---\n\n${compareLabel}`;
  const content = await callDeepSeek(system, user);
  return JSON.parse(extractJson(content)) as CompareResult;
}
