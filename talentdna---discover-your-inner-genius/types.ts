
export interface Question {
  id: number;
  text: string;
  category: string;
  options: {
    label: string;
    value: number;
  }[];
}

export interface TalentScore {
  subject: string;
  score: number;
  fullMark: number;
}

export interface AnalysisResult {
  title: string;
  description: string;
  traits: string[];
  careerPaths: string[];
  radarData: TalentScore[];
  summary: string;
  actionPlan: string[];
}

export type AssessmentState = 'home' | 'quiz' | 'analyzing' | 'result';
