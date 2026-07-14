export interface SubjectInput {
  subjectName: string;
  level: number;
  symbol?: string;
  percentage?: number;
}

export interface RecommendationResult {
  course: {
    id: string;
    name: string;
    qualification: string;
    durationYears: number;
    apsMin: number | null;
    annualCost: number | null;
    description: string | null;
    careerPaths: string | null;
    university: {
      id: string;
      name: string;
      slug: string;
      city: string;
      province: string;
    };
  };
  matchScore: number;
  meetsAps: boolean;
  meetsSubjectReqs: boolean;
  matchedSubjects: string[];
  missingSubjects: string[];
}

export interface CareerRecommendation {
  career: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    category: string | null;
    avgSalaryMin: number | null;
    avgSalaryMax: number | null;
    demandLevel: string | null;
    growthRate: string | null;
    keySkills: string | null;
  };
  matchScore: number;
  matchingCourses: number;
  relatedCourses: {
    id: string;
    name: string;
    university: string;
  }[];
}

export interface SafetyReport {
  score: number;
  label: string;
  details: string[];
}

export interface SearchResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
