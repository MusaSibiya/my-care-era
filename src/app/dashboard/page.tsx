import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatCurrency, calculateAPS } from "@/lib/utils";
import { RandSign } from "@/components/ui";
import {
  Upload,
  Target,
  BookOpen,
  Building2,
  Briefcase,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const [latestResult, universityCount, courseCount, careerCount] =
    await Promise.all([
      prisma.academicResult.findFirst({
        where: { userId: session.user.id },
        include: { subjects: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.university.count(),
      prisma.course.count(),
      prisma.careerPath.count(),
    ]);

  const aps = latestResult ? calculateAPS(latestResult.subjects) : null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="mb-10 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Welcome back, {session.user.name?.split(" ")[0] || "Student"}
        </h1>
        <p className="mt-1.5 text-slate-300">
          Here&apos;s your career discovery dashboard
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Universities", value: universityCount, icon: Building2, color: "from-emerald-500 to-teal-600" },
          { label: "Courses", value: courseCount, icon: BookOpen, color: "from-blue-500 to-indigo-600" },
          { label: "Career Paths", value: careerCount, icon: Briefcase, color: "from-purple-500 to-violet-600" },
          { label: "Your APS", value: aps ?? "\u2014", icon: Target, color: "from-amber-500 to-orange-600" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-5 shadow-sm card-hover delay-${(i+1)*100}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-extrabold text-slate-900">{stat.value}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Actions */}
      {!latestResult ? (
        <div className="mt-10 animate-fade-in-up rounded-2xl border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-12 text-center delay-500">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            <Upload className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="mt-5 text-xl font-bold text-slate-900">
            Upload Your Results
          </h2>
          <p className="mx-auto mt-2 max-w-md text-slate-500">
            Get started by uploading your NSC/Matric results. We&apos;ll use them to
            recommend the best courses and careers for you.
          </p>
          <Link
            href="/upload-results"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:brightness-110"
          >
            <Upload className="h-4 w-4" />
            Upload Results Now
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* Results Summary */}
          <div className="animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
              <div className="rounded-lg bg-emerald-100 p-1.5">
                <Target className="h-4 w-4 text-emerald-600" />
              </div>
              Your Results
            </h2>
            <div className="mt-5 space-y-2.5">
              {[
                { label: "Year Completed", value: latestResult.yearCompleted, highlight: false },
                { label: "APS Score", value: aps, highlight: true },
                { label: "Subjects", value: latestResult.subjects.length, highlight: false },
              ].map((row) => (
                <div key={row.label} className={`flex justify-between rounded-xl px-4 py-2.5 ${row.highlight ? "bg-emerald-50 border border-emerald-100" : "bg-slate-50"}`}>
                  <span className="text-sm text-slate-600">{row.label}</span>
                  <span className={`text-sm font-bold ${row.highlight ? "text-emerald-700" : "text-slate-900"}`}>{row.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2.5">
              <Link
                href="/recommendations"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-500/25 transition-all hover:shadow-lg hover:brightness-110"
              >
                <TrendingUp className="h-4 w-4" />
                View Recommendations
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/upload-results"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Update
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3.5">
            {[
              { href: "/universities", title: "Explore Universities", desc: `Browse ${universityCount} SA universities`, icon: Building2, color: "from-emerald-500 to-teal-600" },
              { href: "/courses", title: "Browse Courses", desc: `${courseCount} courses available`, icon: BookOpen, color: "from-blue-500 to-indigo-600" },
              { href: "/careers", title: "Career Explorer", desc: `${careerCount} career paths`, icon: Briefcase, color: "from-purple-500 to-violet-600" },
            ].map((link, i) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`animate-fade-in-up flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm card-hover delay-${(i+1)*100}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${link.color} shadow-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{link.title}</h3>
                      <p className="text-sm text-slate-500">{link.desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
