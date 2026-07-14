"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Badge, RandSign } from "@/components/ui";
import {
  ArrowLeft,
  Clock,
  Target,
  Briefcase,
  BookOpen,
  CheckCircle2,
  Loader2,
} from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/courses/${params.id}`);
      const data = await res.json();
      setCourse(data.data);
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

  if (!course) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 text-center">
        <p className="text-slate-500">Course not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <Link
        href="/courses"
        className="animate-fade-in inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All Courses
      </Link>

      <div className="mt-6 animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{course.name}</h1>
        <Link
          href={`/universities/${course.university.slug}`}
          className="mt-2 inline-block text-lg font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          {course.university.name}
        </Link>
        <p className="text-sm text-slate-500">
          {course.university.city}, {course.university.province}
        </p>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <Badge>{course.qualification}</Badge>
          <Badge variant="outline">
            <Clock className="h-3 w-3" />
            {course.durationYears} years
          </Badge>
          {course.nqfLevel && <Badge>NQF Level {course.nqfLevel}</Badge>}
          {course.apsMin && <Badge variant="warning">APS {course.apsMin}+</Badge>}
          {course.faculty && <Badge variant="outline">{course.faculty}</Badge>}
          <Badge variant="default">{course.mode}</Badge>
        </div>

        {course.annualCost && (
          <div className="mt-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-5">
            <p className="text-sm font-medium text-slate-500">Estimated Annual Cost</p>
            <p className="mt-1 text-2xl font-extrabold text-emerald-800">
              {formatCurrency(course.annualCost)}
            </p>
          </div>
        )}

        {course.description && (
          <div className="mt-6">
            <h2 className="text-lg font-bold text-slate-900">About This Course</h2>
            <p className="mt-2.5 leading-relaxed text-slate-600">{course.description}</p>
          </div>
        )}

        {course.careerPaths && (
          <div className="mt-6">
            <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
              <div className="rounded-lg bg-emerald-100 p-1.5">
                <Briefcase className="h-4 w-4 text-emerald-600" />
              </div>
              Career Opportunities
            </h2>
            <p className="mt-2.5 leading-relaxed text-slate-600">{course.careerPaths}</p>
          </div>
        )}

        {course.requirements?.length > 0 && (
          <div className="mt-6">
            <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
              <div className="rounded-lg bg-emerald-100 p-1.5">
                <Target className="h-4 w-4 text-emerald-600" />
              </div>
              Subject Requirements
            </h2>
            <div className="mt-4 space-y-2">
              {course.requirements.map((req: any) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 px-4 py-3"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-slate-900">
                      {req.subject}
                    </span>
                    {req.isRequired && <Badge variant="danger">Required</Badge>}
                  </div>
                  <span className="text-sm font-medium text-slate-600">
                    Level {req.minLevel}+ ({["", "G", "F", "E", "D", "C", "B", "A"][req.minLevel]}+)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {course.careerCourses?.length > 0 && (
          <div className="mt-6">
            <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
              <div className="rounded-lg bg-emerald-100 p-1.5">
                <Briefcase className="h-4 w-4 text-emerald-600" />
              </div>
              Related Careers
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {course.careerCourses.map((cc: any) => (
                <Link
                  key={cc.careerPath.id}
                  href={`/careers/${cc.careerPath.slug}`}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-sm"
                >
                  {cc.careerPath.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
