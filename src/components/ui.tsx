import { cn, formatCurrency } from "@/lib/utils";
import { Star, MapPin, Clock, TrendingUp, Users, BookOpen, Shield } from "lucide-react";
import Link from "next/link";

/* ── Rand Sign Icon (replaces DollarSign everywhere) ── */

export function RandSign({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center justify-center font-bold", className)}>
      R
    </span>
  );
}

/* ── Star Rating ── */

export function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sizeClass = size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            sizeClass,
            "transition-colors duration-200",
            i <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
          )}
        />
      ))}
      <span className="ml-1.5 text-sm font-medium text-slate-600">{rating}/5</span>
    </div>
  );
}

/* ── Badge ── */

export function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "outline";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "default" && "bg-slate-100 text-slate-700",
        variant === "success" && "bg-emerald-100 text-emerald-800",
        variant === "warning" && "bg-amber-100 text-amber-800",
        variant === "danger" && "bg-red-100 text-red-700",
        variant === "outline" && "border border-slate-200 text-slate-600 bg-white"
      )}
    >
      {children}
    </span>
  );
}

/* ── University Card ── */

export function UniversityCard({
  university,
}: {
  university: {
    id: string;
    name: string;
    slug: string;
    city: string;
    province: string;
    type: string;
    ranking?: number | null;
    _count: { courses: number; accommodations: number; reviews: number };
  };
}) {
  return (
    <Link
      href={`/universities/${university.slug}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
            {university.name}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            {university.city}, {university.province}
          </div>
        </div>
        {university.ranking && (
          <Badge variant="success">#{university.ranking}</Badge>
        )}
      </div>

      <div className="mt-5 flex items-center gap-5 text-sm text-slate-600">
        <div className="flex items-center gap-1.5">
          <div className="rounded-md bg-emerald-50 p-1">
            <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          {university._count.courses} courses
        </div>
        <div className="flex items-center gap-1.5">
          <div className="rounded-md bg-slate-100 p-1">
            <Users className="h-3.5 w-3.5 text-slate-500" />
          </div>
          {university._count.reviews} reviews
        </div>
      </div>

      <div className="mt-4">
        <Badge variant={university.type === "public" ? "default" : "outline"}>
          {university.type === "public" ? "Public University" : "Private Institution"}
        </Badge>
      </div>
    </Link>
  );
}

/* ── Course Card ── */

export function CourseCard({
  course,
}: {
  course: {
    id: string;
    name: string;
    slug: string;
    qualification: string;
    durationYears: number;
    apsMin?: number | null;
    annualCost?: number | null;
    faculty?: string | null;
    university: { id: string; name: string; slug: string; city: string };
  };
}) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
            {course.name}
          </h3>
          <p className="mt-1 text-sm font-medium text-emerald-600 truncate">
            {course.university.name}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>{course.qualification}</Badge>
        <Badge variant="outline">
          <Clock className="h-3 w-3" />
          {course.durationYears}yr
        </Badge>
        {course.apsMin && <Badge variant="warning">APS {course.apsMin}+</Badge>}
        {course.annualCost && (
          <Badge variant="outline">
            <RandSign className="h-3 w-3 text-slate-500" />
            {formatCurrency(course.annualCost)}/yr
          </Badge>
        )}
      </div>

      <p className="mt-3 text-xs font-medium text-slate-400">
        {course.university.city}
      </p>
    </Link>
  );
}

/* ── Career Card ── */

export function CareerCard({
  career,
}: {
  career: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    category?: string | null;
    avgSalaryMin?: number | null;
    avgSalaryMax?: number | null;
    demandLevel?: string | null;
    _count?: { careerCourses: number };
  };
}) {
  const demandVariant =
    career.demandLevel?.toLowerCase() === "very high" || career.demandLevel?.toLowerCase() === "high"
      ? "success"
      : career.demandLevel?.toLowerCase() === "moderate"
        ? "warning"
        : "danger";

  return (
    <Link
      href={`/careers/${career.slug}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm card-hover"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
            {career.name}
          </h3>
          {career.category && (
            <p className="text-sm font-medium text-slate-500">{career.category}</p>
          )}
        </div>
        {career.demandLevel && <Badge variant={demandVariant}>{career.demandLevel}</Badge>}
      </div>

      {career.description && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{career.description}</p>
      )}

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
        {career.avgSalaryMin && career.avgSalaryMax && (
          <div className="flex items-center gap-1.5">
            <div className="rounded-md bg-emerald-50 p-1">
              <RandSign className="h-3.5 w-3.5 text-emerald-600" />
            </div>
            {formatCurrency(career.avgSalaryMin)} - {formatCurrency(career.avgSalaryMax)}
          </div>
        )}
        {career._count && (
          <div className="flex items-center gap-1.5">
            <div className="rounded-md bg-slate-100 p-1">
              <BookOpen className="h-3.5 w-3.5 text-slate-500" />
            </div>
            {career._count.careerCourses} courses
          </div>
        )}
      </div>
    </Link>
  );
}

/* ── Safety Score Badge ── */

export function SafetyScoreBadge({ score }: { score: number }) {
  if (score >= 80)
    return (
      <div className="flex items-center gap-2.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2">
        <div className="rounded-lg bg-emerald-100 p-1.5">
          <Shield className="h-4 w-4 text-emerald-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-emerald-800">{score}/100</p>
          <p className="text-xs font-medium text-emerald-600">Very Safe</p>
        </div>
      </div>
    );
  if (score >= 60)
    return (
      <div className="flex items-center gap-2.5 rounded-xl bg-amber-50 border border-amber-200 px-3.5 py-2">
        <div className="rounded-lg bg-amber-100 p-1.5">
          <Shield className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-bold text-amber-800">{score}/100</p>
          <p className="text-xs font-medium text-amber-600">Generally Safe</p>
        </div>
      </div>
    );
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2">
      <div className="rounded-lg bg-red-100 p-1.5">
        <Shield className="h-4 w-4 text-red-600" />
      </div>
      <div>
        <p className="text-sm font-bold text-red-800">{score}/100</p>
        <p className="text-xs font-medium text-red-600">Exercise Caution</p>
      </div>
    </div>
  );
}

/* ── Empty State ── */

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white/50 px-6 py-20 text-center animate-fade-in">
      <div className="rounded-2xl bg-slate-100 p-4 text-slate-400">{icon}</div>
      <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ── Section Heading ── */

export function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="text-center animate-fade-in-up">
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}
