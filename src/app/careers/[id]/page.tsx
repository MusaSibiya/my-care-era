"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency, cn, getDemandColor } from "@/lib/utils";
import { Badge, RandSign } from "@/components/ui";
import {
  ArrowLeft,
  TrendingUp,
  BookOpen,
  MapPin,
  Loader2,
  Briefcase,
  Wrench,
} from "lucide-react";

export default function CareerDetailPage() {
  const params = useParams();
  const [career, setCareer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/careers/${params.id}`);
      const data = await res.json();
      setCareer(data.data);
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!career) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 text-center">
        <p className="text-slate-500">Career not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <Link
        href="/careers"
        className="animate-fade-in inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All Careers
      </Link>

      <div className="mt-6 animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{career.name}</h1>
            {career.category && (
              <p className="mt-1.5 text-lg font-medium text-slate-500">{career.category}</p>
            )}
          </div>
          {career.demandLevel && (
            <Badge
              variant={
                career.demandLevel.toLowerCase() === "high" || career.demandLevel.toLowerCase() === "very high"
                  ? "success"
                  : career.demandLevel.toLowerCase() === "moderate"
                    ? "warning"
                    : "danger"
              }
            >
              {career.demandLevel} Demand
            </Badge>
          )}
        </div>

        {career.description && (
          <p className="mt-6 leading-relaxed text-slate-600">{career.description}</p>
        )}

        {/* Key Metrics */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {career.avgSalaryMin && career.avgSalaryMax && (
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                <RandSign className="h-4 w-4 font-bold text-emerald-700" />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-500">Salary Range</p>
              <p className="mt-0.5 text-lg font-extrabold text-emerald-800">
                {formatCurrency(career.avgSalaryMin)} - {formatCurrency(career.avgSalaryMax)}
              </p>
              <p className="text-xs text-slate-400">per year</p>
            </div>
          )}
          {career.demandLevel && (
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                <TrendingUp className="h-4 w-4 text-blue-700" />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-500">Demand</p>
              <p className="mt-0.5 text-lg font-extrabold text-blue-800">{career.demandLevel}</p>
            </div>
          )}
          {career.growthRate && (
            <div className="rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                <TrendingUp className="h-4 w-4 text-purple-700" />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-500">Growth Rate</p>
              <p className="mt-0.5 text-lg font-extrabold text-purple-800">{career.growthRate}</p>
            </div>
          )}
          {career.workLife && (
            <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                <Briefcase className="h-4 w-4 text-amber-700" />
              </div>
              <p className="mt-3 text-sm font-medium text-slate-500">Work-Life Balance</p>
              <p className="mt-0.5 text-lg font-extrabold text-amber-800">{career.workLife}</p>
            </div>
          )}
        </div>

        {/* Key Skills */}
        {career.keySkills && (
          <div className="mt-8">
            <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
              <div className="rounded-lg bg-emerald-100 p-1.5">
                <Wrench className="h-4 w-4 text-emerald-600" />
              </div>
              Key Skills
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {career.keySkills.split(",").map((skill: string, i: number) => (
                <span
                  key={i}
                  className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Courses */}
        {career.careerCourses?.length > 0 && (
          <div className="mt-8">
            <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
              <div className="rounded-lg bg-emerald-100 p-1.5">
                <BookOpen className="h-4 w-4 text-emerald-600" />
              </div>
              Courses That Lead Here ({career.careerCourses.length})
            </h2>
            <div className="mt-4 space-y-2.5">
              {career.careerCourses.map((cc: any) => (
                <Link
                  key={cc.course.id}
                  href={`/courses/${cc.course.id}`}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50/50 hover:shadow-sm"
                >
                  <div>
                    <h3 className="font-semibold text-slate-900 hover:text-emerald-700">
                      {cc.course.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      {cc.course.university.name}, {cc.course.university.city}
                    </div>
                  </div>
                  <Badge>{cc.course.qualification}</Badge>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
