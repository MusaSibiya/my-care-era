"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { UniversityCard, EmptyState } from "@/components/ui";
import { Building2, Search, Loader2, MapPin } from "lucide-react";

const provinces = [
  "All Provinces", "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape",
];

interface University {
  id: string;
  name: string;
  slug: string;
  city: string;
  province: string;
  type: string;
  ranking: number | null;
  _count: { courses: number; accommodations: number; reviews: number };
}

export default function UniversitiesPage() {
  const searchParams = useSearchParams();
  const initialProvince = searchParams.get("province") || "All Provinces";

  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState(initialProvince);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUniversities();
  }, [province]);

  async function fetchUniversities() {
    setLoading(true);
    const params = new URLSearchParams();
    if (province !== "All Provinces") params.set("province", province);
    if (search) params.set("q", search);

    try {
      const res = await fetch(`/api/universities?${params}`);
      const data = await res.json();
      setUniversities(data.data?.data || []);
      setTotal(data.data?.total || 0);
    } catch {
      console.error("Failed to fetch");
    }
    setLoading(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchUniversities();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <Building2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              South African Universities
            </h1>
            <p className="mt-0.5 text-sm font-medium text-slate-300">
              Browse {total} universities across all provinces
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search universities..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </form>
        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          {provinces.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button
          onClick={fetchUniversities}
          className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md active:scale-[0.98]"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        </div>
      ) : universities.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-8 w-8" />}
          title="No Universities Found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {universities.map((uni, i) => (
            <div
              key={uni.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <UniversityCard university={uni} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
