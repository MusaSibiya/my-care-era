import Link from "next/link";
import {
  GraduationCap,
  Target,
  Building2,
  BookOpen,
  Briefcase,
  Shield,
  MapPin,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Users,
  Zap,
  Sparkles,
  BarChart3,
  Compass,
} from "lucide-react";
import { SectionHeading } from "@/components/ui";

const features = [
  {
    icon: Target,
    title: "Smart Matching",
    description:
      "Upload your NSC results and get personalized course and career recommendations based on your subjects and APS score.",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Building2,
    title: "University Explorer",
    description:
      "Browse all South African universities with detailed info on courses, costs, rankings, and student reviews.",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
  },
  {
    icon: Briefcase,
    title: "Career Insights",
    description:
      "See salary ranges, job demand levels, growth rates, and key skills for every career path in South Africa.",
    color: "from-purple-500 to-violet-600",
    bg: "bg-purple-50",
  },
  {
    icon: MapPin,
    title: "Find Accommodation",
    description:
      "Discover verified student accommodation near universities with prices, amenities, and distance info.",
    color: "from-orange-500 to-amber-600",
    bg: "bg-orange-50",
  },
  {
    icon: Shield,
    title: "Safety Data",
    description:
      "Get safety scores, crime stats, and security information for areas around every university campus.",
    color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50",
  },
  {
    icon: BookOpen,
    title: "Prospectus Data",
    description:
      "Access official course information, requirements, NQF levels, and fees from South African university prospectuses.",
    color: "from-cyan-500 to-sky-600",
    bg: "bg-cyan-50",
  },
];

const stats = [
  { label: "Universities", value: "26+", icon: Building2 },
  { label: "Courses Listed", value: "2,000+", icon: BookOpen },
  { label: "Career Paths", value: "200+", icon: Briefcase },
  { label: "Students Helped", value: "10,000+", icon: Users },
];

const steps = [
  {
    step: "01",
    title: "Upload Your Results",
    desc: "Enter your NSC/Matric subject grades and APS score. We support all official SA subjects.",
    icon: Upload,
  },
  {
    step: "02",
    title: "Get Recommendations",
    desc: "Our algorithm matches your results with 2000+ courses across 26 universities instantly.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Explore & Decide",
    desc: "Compare courses, check accommodation, safety data, costs, and career prospects side by side.",
    icon: Compass,
  },
];

function Upload({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="overflow-hidden">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-4 py-24 text-center sm:py-32">
        {/* Background image of smiling school kid */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/school-kid.jpg')"
          }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-800/75 to-emerald-900/80" />
        
        {/* Animated decorative orbs */}
        <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl animate-float" />
        <div className="absolute top-32 right-20 h-80 w-80 rounded-full bg-teal-400/12 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl animate-float" style={{ animationDelay: "4s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-56 w-56 rounded-full bg-emerald-300/8 blur-2xl animate-pulse-glow" />

        <div className="relative mx-auto max-w-4xl">
          <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-5 py-2 text-sm font-semibold text-emerald-300 backdrop-blur-sm">
            <Zap className="h-4 w-4 text-emerald-400" />
            Built for South African students
          </div>

          <h1 className="animate-fade-in-up mt-8 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-7xl delay-100">
            Find Your Perfect
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Course & Career
            </span>
          </h1>

          <p className="animate-fade-in-up mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl delay-200">
            Upload your matric results and discover the best university courses,
            career paths, accommodation options, and safety information &mdash; all in one place.
          </p>

          <div className="animate-fade-in-up mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row delay-300">
            <Link
              href="/auth/register"
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/30 hover:brightness-110"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:bg-white/10"
            >
              Explore Universities
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="relative -mt-10 mx-auto max-w-5xl px-4 z-10">
        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-6 shadow-2xl shadow-slate-200/50 sm:grid-cols-4 sm:p-8 animate-fade-in-up delay-400">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center group">
                <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 transition-colors group-hover:bg-emerald-100">
                  <Icon className="h-5 w-5 text-emerald-600" />
                </div>
                <p className="text-2xl font-extrabold text-slate-900">{stat.value}</p>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="How It Works"
            subtitle="Three simple steps to find your perfect path"
          />
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {steps.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className={`animate-fade-in-up relative text-center delay-${(i + 1) * 200}`}
                >
                  <div className="mx-auto mb-6 flex h-18 w-18 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
                    <Icon className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-600">
                    Step {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section className="bg-white px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            title="Everything You Need"
            subtitle="Comprehensive tools to make the right decision about your future"
          />
          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`animate-fade-in-up group rounded-2xl border border-slate-200 bg-slate-50/50 p-7 transition-all duration-300 hover:border-emerald-200 hover:bg-white hover:shadow-lg hover:shadow-slate-100 delay-${(i + 1) * 100}`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-500">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Market Intelligence ── */}
      <section className="px-4 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="animate-slide-in-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700">
                <BarChart3 className="h-4 w-4" />
                Market Intelligence
              </div>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Know the Market{" "}
                <span className="gradient-text">Before You Decide</span>
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-slate-500">
                We aggregate real job market data from South African employers to show you
                which careers are in demand, expected salaries, and growth projections.
              </p>
              <ul className="mt-8 space-y-4">
                {[
                  "Real-time job demand levels across SA industries",
                  "Salary ranges by career and experience level",
                  "Growth projections for each career field",
                  "Key skills employers are looking for",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
                      <ChevronRight className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/careers"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:brightness-110"
              >
                <TrendingUp className="h-4 w-4" />
                Explore Career Data
              </Link>
            </div>

            {/* Example card */}
            <div className="animate-fade-in-up delay-300 rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-200/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Example: Software Engineer
              </h4>
              <div className="mt-5 space-y-3.5">
                {[
                  { label: "Demand Level", value: "Very High", bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800" },
                  { label: "Avg. Salary", value: "R420,000 - R850,000", bg: "bg-blue-50 border-blue-100", text: "text-blue-700" },
                  { label: "Growth Rate", value: "+18% (5yr)", bg: "bg-purple-50 border-purple-100", text: "text-purple-700" },
                  { label: "Work-Life Balance", value: "Good", bg: "bg-amber-50 border-amber-100", text: "text-amber-700" },
                ].map((row) => (
                  <div key={row.label} className={`flex items-center justify-between rounded-xl border ${row.bg} p-4`}>
                    <span className="text-sm font-medium text-slate-600">{row.label}</span>
                    {row.badge ? (
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${row.badge}`}>
                        {row.value}
                      </span>
                    ) : (
                      <span className={`text-sm font-bold ${row.text}`}>{row.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 py-20">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-900 to-teal-900 p-14 text-center text-white shadow-2xl">
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="relative">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
              <GraduationCap className="h-7 w-7 text-emerald-300" />
            </div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">
              Ready to Find Your Future?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-slate-300">
              Join thousands of South African students who have found their perfect
              course and career path.
            </p>
            <Link
              href="/auth/register"
              className="mt-8 inline-flex items-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-base font-bold text-slate-900 shadow-xl transition-all duration-300 hover:shadow-2xl hover:brightness-95"
            >
              Start for Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
