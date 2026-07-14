"use client";

import { useEffect, useState } from "react";
import { CareerCard, EmptyState } from "@/components/ui";
import { Briefcase, Search, Loader2 } from "lucide-react";

interface Career {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  avgSalaryMin: number | null;
  avgSalaryMax: number | null;
  demandLevel: string | null;
  _count: { careerCourses: number };
}

export default function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCareers();
  }, []);

  async function fetchCareers() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);

    try {
      const res = await fetch(`/api/careers?${params}`);
      const data = await res.json();
      setCareers(data.data?.data || []);
      setTotal(data.data?.total || 0);
    } catch {
      console.error("Failed");
    }
    setLoading(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchCareers();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <Briefcase className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Career Explorer
            </h1>
            <p className="mt-0.5 text-sm font-medium text-slate-300">
              Explore {total} career paths with salary, demand, and growth data
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex gap-3">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search careers (e.g. Software Engineer, Doctor...)"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </form>
        <button
          onClick={fetchCareers}
          className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-[0.98]"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : careers.length === 0 ? (
        <EmptyState
          icon={<Briefcase className="h-8 w-8" />}
          title="No Careers Found"
          description="Try a different search term."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {careers.map((career, i) => (
            <div
              key={career.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <CareerCard career={career} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
