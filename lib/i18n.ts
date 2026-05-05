export type Lang = "zh" | "en";

export const t = {
  // Header
  appTitle: { zh: "简历助手", en: "Resume Assistant" },
  analyzeDesc: { zh: "上传简历，获取修改建议", en: "Upload your resume for AI feedback" },
  matchDesc: { zh: "对比职位描述，分析匹配度", en: "Compare with job description" },
  compareDesc: { zh: "上传新旧版本，评估改进效果", en: "Compare two resume versions" },

  // Tabs
  tabAnalyze: { zh: "简历分析", en: "Analysis" },
  tabMatch: { zh: "职位匹配", en: "Job Match" },
  tabCompare: { zh: "版本对比", en: "Compare" },

  // Dropzone
  dropHere: { zh: "把你的简历拖到这里", en: "Drop your resume here" },
  supportedFormats: { zh: "支持 PDF 和 Word (.docx) 格式，最大 10MB", en: "Supports PDF & Word (.docx), max 10MB" },
  clickToSelect: { zh: "或者点击选择文件", en: "or click to select file" },

  // Review step
  fileSelected: { zh: "已选择文件", en: "File selected" },
  reselect: { zh: "重选", en: "Change" },
  supplementLabel: { zh: "补充信息（选填）", en: "Additional notes (optional)" },
  supplementPlaceholder: { zh: "例如：我想应聘产品经理岗位，希望能突出我的项目管理经验...", en: "e.g. I'm targeting product manager roles, want to highlight my project management..." },
  startAnalysis: { zh: "开始分析", en: "Start Analysis" },
  startMatch: { zh: "开始匹配分析", en: "Start Matching" },
  startCompare: { zh: "开始对比", en: "Start Comparison" },

  // Loading
  analyzing: { zh: "正在分析", en: "Analyzing" },
  analyzingFile: { zh: "正在分析：", en: "Analyzing: " },
  loadingMessages: {
    zh: ["正在仔细阅读你的简历... 🔍", "发现了你的闪光点！✨", "在思考如何让你更出彩... 💭", "你的努力值得被看见... 🌟", "马上就好，正在打磨建议... 💎", "每一份经历都很珍贵... 📝", "你比你想象中更优秀... 💪"],
    en: ["Reading your resume carefully... 🔍", "Finding your strengths! ✨", "Thinking how to make you shine... 💭", "Your effort deserves to be seen... 🌟", "Almost ready, polishing suggestions... 💎", "Every experience matters... 📝", "You're more amazing than you know... 💪"],
  },
  comparing: { zh: "正在对比两份简历...", en: "Comparing two resumes..." },

  // Results
  overallScore: { zh: "综合评分", en: "Overall Score" },
  overallReview: { zh: "整体评价", en: "Overall Review" },
  strengths: { zh: "做得很好的地方", en: "Strengths" },
  improvements: { zh: "可以提升的地方", en: "Areas to Improve" },
  suggestion: { zh: "修改建议", en: "Suggestion" },
  aiRewrite: { zh: "✨ AI 一键改写", en: "✨ AI Rewrite" },
  reupload: { zh: "← 重新上传", en: "← Upload New" },
  exportCopy: { zh: "📋 复制报告", en: "📋 Copy Report" },
  exportDownload: { zh: "📥 下载报告", en: "📥 Download Report" },

  // Error
  errorTitle: { zh: "出了点小问题", en: "Something went wrong" },
  retry: { zh: "重新上传", en: "Try Again" },

  // Match
  jdLabel: { zh: "粘贴职位描述 (JD)", en: "Paste Job Description" },
  jdPlaceholder: { zh: "把目标职位的招聘描述粘贴到这里...", en: "Paste the job description here..." },
  matchOverall: { zh: "综合匹配度", en: "Overall Match" },
  keywordsMatched: { zh: "匹配的关键词", en: "Matched Keywords" },
  keywordsMissing: { zh: "缺少的关键词", en: "Missing Keywords" },
  gapAnalysis: { zh: "差距分析", en: "Gap Analysis" },
  tailoredAdvice: { zh: "优化建议", en: "Tailored Advice" },
  rematch: { zh: "← 重新匹配", en: "← New Match" },

  // Compare
  oldVersion: { zh: "旧版简历", en: "Old Version" },
  newVersion: { zh: "新版简历", en: "New Version" },
  remove: { zh: "移除", en: "Remove" },
  clickUpload: { zh: "点击上传", en: "Click to upload" },
  overallImprovement: { zh: "整体改进评估", en: "Overall Improvement" },
  furtherSuggestions: { zh: "进一步优化建议", en: "Further Suggestions" },
  recompare: { zh: "← 重新对比", en: "← New Compare" },

  // Rewrite modal
  rewriteTitle: { zh: "AI 改写", en: "AI Rewrite" },
  rewriteSuggestion: { zh: "💡 改进建议", en: "💡 Improvement Suggestion" },
  rewritePaste: { zh: "请粘贴该模块的原文（可自由修改）", en: "Paste the original text of this section" },
  rewritePlaceholder: { zh: "把你简历中该部分的内容粘贴在这里...", en: "Paste your content here..." },
  rewriteStart: { zh: "✨ 开始改写", en: "✨ Start Rewriting" },
  rewriteResult: { zh: "改写结果", en: "Rewritten Result" },
  copyResult: { zh: "复制改写结果", en: "Copy Result" },
  rewriteAgain: { zh: "重新改写", en: "Rewrite Again" },

  // Score labels
  scoreExcellent: { zh: "优秀", en: "Excellent" },
  scoreGood: { zh: "良好", en: "Good" },
  scoreAverage: { zh: "一般", en: "Average" },
  scoreNeedsWork: { zh: "需要改进", en: "Needs Work" },

  // History
  historyTitle: { zh: "历史记录", en: "History" },
  historyEmpty: { zh: "暂无历史记录", en: "No history yet" },
  historyClear: { zh: "清空记录", en: "Clear All" },
  noSuggestion: { zh: "无具体建议", en: "No specific suggestion" },

  // Misc
  reset: { zh: "重新开始", en: "Start Over" },
  restart: { zh: "重试", en: "Retry" },
  close: { zh: "关闭", en: "Close" },
  noContent: { zh: "无内容", en: "No content" },

  // Dimension names
  dimSkills: { zh: "技能匹配", en: "Skills Match" },
  dimExperience: { zh: "经验匹配", en: "Experience Match" },
  dimEducation: { zh: "学历匹配", en: "Education Match" },
  dimOverall: { zh: "综合素质", en: "Overall Fit" },
} as const;

export function useT(lang: Lang) {
  return function tk(key: keyof typeof t): string {
    return (t as any)[key][lang] ?? key;
  };
}
