"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { cn, formatCurrency, getDemandColor } from "@/lib/utils";
import { RandSign, EmptyState, Badge } from "@/components/ui";
import {
  Target,
  Briefcase,
  BookOpen,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Sparkles,
} from "lucide-react";

interface CourseRec {
  course: {
    id: string;
    name: string;
    qualification: string;
    durationYears: number;
    apsMin: number | null;
    annualCost: number | null;
    description: string | null;
    careerPaths: string | null;
    university: { id: string; name: string; slug: string; city: string; province: string };
  };
  matchScore: number;
  meetsAps: boolean;
  meetsSubjectReqs: boolean;
  matchedSubjects: string[];
  missingSubjects: string[];
  why?: string;
  dataSource?: string;
}

interface CareerRec {
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
  relatedCourses: { id: string; name: string; university: string }[];
}

export default function RecommendationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"courses" | "careers">("courses");
  const [courseRecs, setCourseRecs] = useState<CourseRec[]>([]);
  const [careerRecs, setCareerRecs] = useState<CareerRec[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
    if (status === "authenticated") fetchRecommendations();
  }, [status, tab]);

  async function fetchRecommendations() {
    setLoading(true);
    setError("");
    try {
      if (tab === "courses") {
        const res = await fetch("/api/recommendations?type=courses");
        const data = await res.json();
        setCourseRecs(data.data || []);
      } else {
        const res = await fetch("/api/recommendations?type=careers");
        const data = await res.json();
        setCareerRecs(data.data || []);
      }
    } catch {
      setError("Failed to load recommendations");
    }
    setLoading(false);
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-sm font-medium text-slate-500">Finding your matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Your Recommendations</h1>
        <p className="mt-1.5 text-slate-300">
          Personalized matches based on your academic results
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="mb-8 flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 max-w-xs">
        {[
          { key: "courses" as const, label: "Courses", icon: BookOpen },
          { key: "careers" as const, label: "Careers", icon: Briefcase },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200",
              tab === t.key
                ? "bg-white text-emerald-700 shadow-md shadow-slate-200/50"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "courses" && (
        <div>
          {courseRecs.length === 0 ? (
            <EmptyState
              icon={<Target className="h-8 w-8" />}
              title="No Recommendations Yet"
              description="Upload your results to get personalized course recommendations."
              action={
                <Link
                  href="/upload-results"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:brightness-110 transition-all"
                >
                  Upload Results
                </Link>
              }
            />
          ) : (
            <div className="space-y-3.5">
              {courseRecs.map((rec, i) => (
                <div
                  key={rec.course.id}
                  className={`animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm card-hover delay-${Math.min((i+1)*50, 400)}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Link
                          href={`/courses/${rec.course.id}`}
                          className="text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                        >
                          {rec.course.name}
                        </Link>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-0.5 text-xs font-bold text-white",
                            rec.matchScore >= 80
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                              : rec.matchScore >= 60
                                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                                : "bg-gradient-to-r from-orange-500 to-red-500"
                          )}
                        >
                          {rec.matchScore}% match
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-emerald-600">
                        {rec.course.university.name} &mdash; {rec.course.university.city}
                      </p>

                      <div className="mt-3.5 flex flex-wrap gap-2">
                        <Badge>{rec.course.qualification}</Badge>
                        <Badge variant="outline">
                          <Clock className="h-3 w-3" />
                          {rec.course.durationYears} years
                        </Badge>
                        {rec.course.apsMin && (
                          <Badge variant={rec.meetsAps ? "success" : "danger"}>
                            APS {rec.course.apsMin}+
                            {rec.meetsAps ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                          </Badge>
                        )}
                        {rec.course.annualCost && (
                          <Badge variant="outline">
                            <RandSign className="h-3 w-3 text-slate-500" />
                            {formatCurrency(rec.course.annualCost)}/yr
                          </Badge>
                        )}
                      </div>

                      <div className="mt-3.5 flex flex-wrap gap-4 text-xs font-medium">
                        {rec.matchedSubjects.length > 0 && (
                          <div>
                            <span className="text-slate-500">Matched: </span>
                            <span className="text-emerald-700">
                              {rec.matchedSubjects.join(", ")}
                            </span>
                          </div>
                        )}
                        {rec.missingSubjects.length > 0 && (
                          <div>
                            <span className="text-slate-500">Missing: </span>
                            <span className="text-red-600">
                              {rec.missingSubjects.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>

                      {rec.why && (
                        <div className="mt-3 rounded-xl bg-slate-50 border border-slate-100 p-3.5">
                          <p className="text-sm font-semibold text-slate-700 mb-1">Why this course?</p>
                          <p className="text-sm text-slate-600 leading-relaxed">{rec.why}</p>
                        </div>
                      )}

                      {rec.dataSource === "live" && (
                        <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-purple-600">
                          <Sparkles className="h-2.5 w-2.5" />
                          Live data from apply.org.za
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "careers" && (
        <div>
          {careerRecs.length === 0 ? (
            <EmptyState
              icon={<Briefcase className="h-8 w-8" />}
              title="No Career Recommendations"
              description="Upload your results first to get career path recommendations."
              action={
                <Link
                  href="/upload-results"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:brightness-110 transition-all"
                >
                  Upload Results
                </Link>
              }
            />
          ) : (
            <div className="space-y-3.5">
              {careerRecs.map((rec, i) => (
                <div
                  key={rec.career.id}
                  className={`animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm card-hover delay-${Math.min((i+1)*50, 400)}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Link
                          href={`/careers/${rec.career.slug}`}
                          className="text-lg font-bold text-slate-900 hover:text-emerald-700 transition-colors"
                        >
                          {rec.career.name}
                        </Link>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-0.5 text-xs font-bold text-white",
                            rec.matchScore >= 80
                              ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                              : rec.matchScore >= 60
                                ? "bg-gradient-to-r from-amber-500 to-orange-500"
                                : "bg-gradient-to-r from-orange-500 to-red-500"
                          )}
                        >
                          {rec.matchScore}% match
                        </span>
                      </div>
                      {rec.career.category && (
                        <p className="mt-1 text-sm font-medium text-slate-500">{rec.career.category}</p>
                      )}

                      <div className="mt-3.5 flex flex-wrap gap-3 text-sm text-slate-600">
                        {rec.career.demandLevel && (
                          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", getDemandColor(rec.career.demandLevel))}>
                            Demand: {rec.career.demandLevel}
                          </span>
                        )}
                        {rec.career.avgSalaryMin && rec.career.avgSalaryMax && (
                          <span className="flex items-center gap-1.5">
                            <RandSign className="h-3.5 w-3.5 text-slate-500" />
                            {formatCurrency(rec.career.avgSalaryMin)} - {formatCurrency(rec.career.avgSalaryMax)}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                          {rec.matchingCourses} courses lead here
                        </span>
                      </div>

                      {rec.relatedCourses.length > 0 && (
                        <div className="mt-3.5">
                          <p className="text-xs font-semibold text-slate-400 mb-1.5">Related Courses:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {rec.relatedCourses.slice(0, 3).map((c) => (
                              <Link
                                key={c.id}
                                href={`/courses/${c.id}`}
                                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                              >
                                {c.name} ({c.university})
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
