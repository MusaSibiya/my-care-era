"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2, X, Scan, FileSearch, Sparkles } from "lucide-react";

interface ParsedSubject {
  name: string;
  symbol?: string;
  level?: number;
  percentage?: number;
}

interface PdfUploadZoneProps {
  onParsed: (subjects: ParsedSubject[], year?: number, province?: string) => void;
}

export default function PdfUploadZone({ onParsed }: PdfUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    count: number;
    board?: string;
    source: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.endsWith(".pdf")) {
        setError("Please upload a PDF file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError("File too large. Maximum 10MB.");
        return;
      }

      setError(null);
      setFileName(file.name);
      setIsParsing(true);
      setResult(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/parse-pdf", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to parse PDF. Please try again or enter manually.");
          setIsParsing(false);
          return;
        }

        if (data.subjects && data.subjects.length > 0) {
          const mapped = data.subjects.map((s: Record<string, unknown>) => ({
            name: s.name as string,
            symbol: s.symbol as string | undefined,
            level: s.level as number | undefined,
            percentage: s.percentage as number | undefined,
          }));

          setResult({
            count: data.count,
            board: data.examBoard,
            source: "Gemini AI",
          });
          onParsed(mapped, data.yearCompleted);
        } else {
          setError("No subjects found. Please try a different file or enter manually.");
        }
      } catch (err) {
        console.error("PDF parse error:", err);
        setError("Failed to read PDF. Please try again or enter manually.");
      }

      setIsParsing(false);
    },
    [onParsed]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const clearFile = () => {
    setFileName(null);
    setError(null);
    setResult(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={onFileSelect}
        className="hidden"
        id="pdf-upload"
      />

      {!fileName ? (
        <label
          htmlFor="pdf-upload"
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`flex cursor-pointer flex-col items-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
            isDragging
              ? "border-emerald-400 bg-emerald-50 scale-[1.01]"
              : "border-slate-200 bg-slate-50 hover:border-emerald-300 hover:bg-emerald-50/50"
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
            <Upload className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900">
              Drop your NSC results PDF here
            </p>
            <p className="mt-1 text-xs text-slate-500">
              or <span className="font-semibold text-emerald-600">browse</span> to upload
            </p>
            <p className="mt-1.5 text-[11px] text-slate-400">
              Works with DBE certificates, IEB results, school reports &amp; scanned copies
            </p>
          </div>
        </label>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
              {isParsing ? (
                <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
              ) : result ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              ) : error ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <FileText className="h-5 w-5 text-emerald-600" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">{fileName}</p>
              {isParsing && (
                <p className="mt-1 text-xs text-slate-500">Analyzing with Gemini AI...</p>
              )}
              {result && !isParsing && (
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <p className="text-xs font-medium text-emerald-600">
                    {result.count} subject{result.count !== 1 ? "s" : ""} detected
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-600">
                    <Sparkles className="h-2.5 w-2.5" />
                    {result.source}
                  </span>
                  {result.board && result.board !== "UNKNOWN" && (
                    <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                      {result.board}
                    </span>
                  )}
                </div>
              )}
              {error && !isParsing && (
                <p className="text-xs text-red-500">{error}</p>
              )}
            </div>
            {!isParsing && (
              <button
                type="button"
                onClick={clearFile}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {error && !fileName && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm font-medium text-red-700">
          <AlertCircle className="inline h-3.5 w-3.5" /> {error}
        </div>
      )}
    </div>
  );
}
