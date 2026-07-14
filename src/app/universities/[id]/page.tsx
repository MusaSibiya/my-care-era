"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { Badge, SafetyScoreBadge, StarRating, RandSign } from "@/components/ui";
import {
  MapPin,
  Globe,
  Users,
  BookOpen,
  Home,
  Shield,
  Star,
  ExternalLink,
  Loader2,
  ArrowLeft,
  Clock,
} from "lucide-react";

export default function UniversityDetailPage() {
  const params = useParams();
  const [uni, setUni] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/universities/${params.id}`);
      const data = await res.json();
      setUni(data.data);
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

  if (!uni) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 text-center">
        <p className="text-slate-500">University not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <Link
        href="/universities"
        className="animate-fade-in inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All Universities
      </Link>

      <div className="mt-6 animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{uni.name}</h1>
            <div className="mt-2 flex items-center gap-2 text-slate-500">
              <MapPin className="h-4 w-4 text-slate-400" />
              {uni.city}, {uni.province}
              {uni.ranking && (
                <>
                  <span className="text-slate-300">|</span>
                  <Badge variant="success">#{uni.ranking} in SA</Badge>
                </>
              )}
            </div>
          </div>
          {uni.website && (
            <a
              href={uni.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
            >
              <Globe className="h-4 w-4" />
              Website
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>

        {uni.description && (
          <p className="mt-5 leading-relaxed text-slate-600">{uni.description}</p>
        )}

        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-5">
          {[
            { value: uni._count.courses, label: "Courses" },
            { value: uni._count.reviews, label: "Reviews" },
            { value: uni._count.accommodations, label: "Accommodations" },
            uni.students && { value: `${(uni.students / 1000).toFixed(0)}k`, label: "Students" },
            uni.type && { value: uni.type, label: "Type" },
          ].filter(Boolean).map((stat: any, i) => (
            <div key={i} className="rounded-xl bg-slate-50 border border-slate-100 p-3.5 text-center">
              <p className="text-lg font-extrabold text-slate-900 capitalize">{stat.value}</p>
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Safety Data */}
      {uni.safetyData?.length > 0 && (
        <div className="mt-6 animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm delay-100">
          <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
            <div className="rounded-lg bg-emerald-100 p-1.5">
              <Shield className="h-4 w-4 text-emerald-600" />
            </div>
            Safety Information
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {uni.safetyData.map((s: any) => (
              <div key={s.id} className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-900">{s.areaName}</h3>
                  <SafetyScoreBadge score={s.safetyScore} />
                </div>
                <div className="mt-3 space-y-1.5 text-sm text-slate-600">
                  {s.crimeRate && <p>Crime Rate: <span className="font-medium text-slate-800">{s.crimeRate}</span></p>}
                  {s.campusSecurity !== null && (
                    <p>Campus Security: <span className="font-medium text-slate-800">{s.campusSecurity ? "Yes" : "No"}</span></p>
                  )}
                  {s.nearbyPolice !== null && (
                    <p>Nearby Police: <span className="font-medium text-slate-800">{s.nearbyPolice ? "Yes" : "No"}</span></p>
                  )}
                  {s.emergencyContacts && (
                    <p className="text-xs text-slate-500 mt-2">{s.emergencyContacts}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Courses */}
      {uni.courses?.length > 0 && (
        <div className="mt-6 animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm delay-200">
          <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
            <div className="rounded-lg bg-emerald-100 p-1.5">
              <BookOpen className="h-4 w-4 text-emerald-600" />
            </div>
            Courses ({uni.courses.length})
          </h2>
          <div className="mt-4 divide-y divide-slate-100">
            {uni.courses.map((course: any) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                className="flex items-center justify-between py-4 transition-colors hover:bg-slate-50 -mx-4 px-4 rounded-xl"
              >
                <div>
                  <h3 className="font-semibold text-slate-900 hover:text-emerald-700 transition-colors">
                    {course.name}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    <Badge>{course.qualification}</Badge>
                    <Badge variant="outline">
                      <Clock className="h-3 w-3" />
                      {course.durationYears}yr
                    </Badge>
                    {course.apsMin && (
                      <Badge variant="warning">APS {course.apsMin}+</Badge>
                    )}
                    {course.annualCost && (
                      <Badge variant="outline">
                        {formatCurrency(course.annualCost)}/yr
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Accommodations */}
      {uni.accommodations?.length > 0 && (
        <div className="mt-6 animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm delay-300">
          <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
            <div className="rounded-lg bg-emerald-100 p-1.5">
              <Home className="h-4 w-4 text-emerald-600" />
            </div>
            Accommodations ({uni.accommodations.length})
          </h2>
          <div className="mt-4 grid gap-3.5 sm:grid-cols-2">
            {uni.accommodations.map((acc: any) => (
              <div
                key={acc.id}
                className="rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-emerald-200 hover:shadow-sm"
              >
                <h3 className="font-semibold text-slate-900">{acc.name}</h3>
                <p className="text-sm font-medium text-slate-500">{acc.type}</p>
                <div className="mt-2.5 flex gap-4 text-sm text-slate-600">
                  {acc.priceMin && acc.priceMax && (
                    <span className="flex items-center gap-1">
                      <RandSign className="h-3 w-3 text-slate-400" />
                      {formatCurrency(acc.priceMin)} - {formatCurrency(acc.priceMax)}/mo
                    </span>
                  )}
                  {acc.distanceKm && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {acc.distanceKm}km away
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {uni.reviews?.length > 0 && (
        <div className="mt-6 animate-fade-in-up rounded-2xl border border-slate-200 bg-white p-6 shadow-sm delay-400">
          <h2 className="flex items-center gap-2.5 text-lg font-bold text-slate-900">
            <div className="rounded-lg bg-emerald-100 p-1.5">
              <Star className="h-4 w-4 text-emerald-600" />
            </div>
            Reviews ({uni.reviews.length})
          </h2>
          <div className="mt-4 space-y-3.5">
            {uni.reviews.map((review: any) => (
              <div key={review.id} className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {review.user.name || "Anonymous"}
                    </p>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                {review.title && (
                  <p className="mt-2 font-semibold text-slate-800">{review.title}</p>
                )}
                {review.content && (
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{review.content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
