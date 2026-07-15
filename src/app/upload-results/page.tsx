"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PdfUploadZone from "@/components/pdf-upload-zone";
import {
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Info,
  Sparkles,
  Loader2,
  FileText,
  Pencil,
} from "lucide-react";

const saSubjects = [
  "Home Language",
  "First Additional Language",
  "Mathematics",
  "Mathematical Literacy",
  "Life Orientation",
  "Physical Sciences",
  "Life Sciences",
  "Geography",
  "History",
  "Accounting",
  "Business Studies",
  "Economics",
  "Information Technology",
  "Computer Applications Technology",
  "Design",
  "Visual Arts",
  "Music",
  "Dramatic Arts",
  "Hospitality Studies",
  "Tourism",
  "Engineering Graphics and Design",
  "Agricultural Sciences",
  "Consumer Studies",
];

const provinces = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape",
];

interface SubjectEntry {
  subjectName: string;
  percentage: number | "";
}

function pctToLevel(pct: number): number {
  if (pct >= 80) return 7;
  if (pct >= 70) return 6;
  if (pct >= 60) return 5;
  if (pct >= 50) return 4;
  if (pct >= 40) return 3;
  if (pct >= 30) return 2;
  return 1;
}

function levelToPctRange(level: number): string {
  const ranges: Record<number, string> = {
    7: "80-100%", 6: "70-79%", 5: "60-69%",
    4: "50-59%", 3: "40-49%", 2: "30-39%", 1: "0-29%",
  };
  return ranges[level] || "";
}

export default function UploadResultsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [year, setYear] = useState(new Date().getFullYear());
  const [province, setProvince] = useState("");
  const [subjects, setSubjects] = useState<SubjectEntry[]>([
    { subjectName: "", percentage: "" },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState<"pdf" | "manual">("pdf");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  function addSubject() {
    setSubjects([...subjects, { subjectName: "", percentage: "" }]);
  }

  function removeSubject(index: number) {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((_, i) => i !== index));
    }
  }

  function updateSubject(index: number, field: keyof SubjectEntry, value: string | number) {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    setSubjects(updated);
  }

  function handlePdfParsed(pdfSubjects: { name: string; percentage?: number }[], pdfYear?: number) {
    const mapped: SubjectEntry[] = pdfSubjects.map((s) => ({
      subjectName: s.name,
      percentage: typeof s.percentage === "number" ? s.percentage : "",
    }));
    setSubjects(mapped.length > 0 ? mapped : [{ subjectName: "", percentage: "" }]);
    if (pdfYear) setYear(pdfYear);
    setInputMode("manual");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validSubjects = subjects.filter((s) => s.subjectName);
    if (validSubjects.length < 3) {
      setError("Please add at least 3 subjects");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          yearCompleted: year,
          province,
          subjects: validSubjects.map((s) => {
            const pct = typeof s.percentage === "number" ? s.percentage : 0;
            return {
              subjectName: s.subjectName,
              level: pctToLevel(pct),
              percentage: pct,
            };
          }),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save results");
        setLoading(false);
        return;
      }

      setSuccess("Results saved successfully!");
      setTimeout(() => router.push("/recommendations"), 1500);
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  const currentAps = subjects.reduce((sum, s) => {
    if (typeof s.percentage === "number") return sum + pctToLevel(s.percentage);
    return sum;
  }, 0);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100">
            <BookOpen className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              Upload Your Results
            </h1>
            <p className="mt-0.5 text-sm font-medium text-slate-300">
              Enter your NSC/Matric subject results to get personalized recommendations
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* PDF Upload Section */}
        <div className="animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="rounded-lg bg-emerald-100 p-1.5">
              <FileText className="h-4 w-4 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Quick Start</h2>
          </div>

          <div className="flex gap-2 mb-5">
            <button
              type="button"
              onClick={() => setInputMode("pdf")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                inputMode === "pdf"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Upload PDF
              </span>
            </button>
            <button
              type="button"
              onClick={() => setInputMode("manual")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                inputMode === "manual"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Pencil className="h-3.5 w-3.5" />
                Enter Manually
              </span>
            </button>
          </div>

          {inputMode === "pdf" ? (
            <PdfUploadZone onParsed={handlePdfParsed} />
          ) : (
            <p className="text-sm text-slate-500">
              Scroll down to enter your subjects manually.
            </p>
          )}
        </div>

        {/* General Info */}
        <div className="animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm delay-100">
          <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
            <div className="rounded-lg bg-emerald-100 p-1.5">
              <BookOpen className="h-4 w-4 text-emerald-600" />
            </div>
            General Information
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Year Completed
              </label>
              <select
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Province</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Select province</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Subjects */}
        <div className="animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm delay-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Subjects & Levels</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Current APS estimate: <span className="font-bold text-emerald-700">{currentAps}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={addSubject}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-100 px-3.5 py-2 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100 active:scale-[0.97]"
            >
              <Plus className="h-4 w-4" />
              Add Subject
            </button>
          </div>

          <div className="mt-5 space-y-2.5">
            {subjects.map((subject, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition-all hover:border-slate-200"
              >
                <select
                  value={subject.subjectName}
                  onChange={(e) => updateSubject(index, "subjectName", e.target.value)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Select subject</option>
                  {saSubjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      placeholder="%"
                      value={subject.percentage === "" ? "" : subject.percentage}
                      onChange={(e) => {
                        const raw = e.target.value;
                        if (raw === "") {
                          updateSubject(index, "percentage", "");
                        } else {
                          const n = parseInt(raw);
                          if (!isNaN(n)) updateSubject(index, "percentage", Math.min(100, Math.max(0, n)));
                        }
                      }}
                      className="w-20 rounded-lg border border-slate-200 bg-white px-2 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                  </div>
                  {typeof subject.percentage === "number" && subject.percentage > 0 && (
                    <span className="inline-flex items-center rounded-lg bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 text-xs font-bold text-emerald-700 whitespace-nowrap">
                      Level {pctToLevel(subject.percentage)}
                    </span>
                  )}
                </div>

                {subjects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubject(index)}
                    className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50 p-3.5 text-sm text-blue-700">
            <Info className="h-4 w-4 mt-0.5 shrink-0 text-blue-500" />
            <span>
              <strong>Tip:</strong> Upload your NSC report card PDF above, or enter subjects manually.
              NSC levels range from 7 (80-100%) down to 1 (0-29%).
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="animate-fade-in-up w-full rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-emerald-700 hover:shadow-md disabled:opacity-50 active:scale-[0.98] delay-300"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" />
              Save Results & Get Recommendations
            </span>
          )}
        </button>
      </form>
    </div>
  );
}
