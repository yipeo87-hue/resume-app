export interface SectionFeedback {
  title: string;
  strengths: string[];
  improvements: string[];
  suggestion: string;
}

export interface AnalysisResult {
  overall: {
    score: number;
    summary: string;
  };
  sections: SectionFeedback[];
  motivation: string;
}

// JD Match
export interface MatchResult {
  overallMatch: number; // 0-100%
  dimensions: {
    name: string;
    score: number; // 0-100%
    detail: string;
  }[];
  matchedKeywords: string[];
  missingKeywords: string[];
  gapAnalysis: string;
  tailoredAdvice: string;
}

// Rewrite
export interface RewriteResult {
  original: string;
  rewritten: string;
  explanation: string;
}

// Compare
export interface CompareResult {
  overallImprovement: string;
  sections: {
    name: string;
    versionA: string;
    versionB: string;
    verdict: string;
  }[];
  suggestions: string[];
  motivation: string;
}

export type AppMode = "analyze" | "match" | "compare";

export type AppStatus =
  | "idle"
  | "review"
  | "analyzing"
  | "done"
  | "error";
