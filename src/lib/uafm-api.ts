const UAFM_BASE = "https://api.apply.org.za/v1";
const UAFM_KEY = process.env.UAFM_API_KEY || "";

interface UafmResponse<T> {
  data: T;
  meta?: { total: number; page: number; per_page: number };
}

export interface UafmUniversity {
  id: string;
  name: string;
  short_name: string;
  province: string;
  town: string;
  website: string;
  aps_minimum: number;
  application_opens: string;
  application_closes: string;
  faculties: string[];
}

export interface UafmQualification {
  id: string;
  name: string;
  nqf_level: number;
  duration: string;
  university_id: string;
  university_name: string;
  faculty: string;
  aps_minimum: number;
  subject_requirements: Record<string, number>;
  description?: string;
}

async function uafmFetch<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T | null> {
  if (!UAFM_KEY) {
    console.warn("UAFM_API_KEY not set — skipping live data fetch");
    return null;
  }

  const url = new URL(`${UAFM_BASE}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  try {
    const res = await fetch(url.toString(), {
      headers: { "X-API-Key": UAFM_KEY },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.error(`UAFM API error: ${res.status} ${res.statusText}`);
      return null;
    }

    const json: UafmResponse<T> = await res.json();
    return json.data;
  } catch (err) {
    console.error("UAFM fetch failed:", err);
    return null;
  }
}

export async function fetchUniversities(
  search?: string,
  province?: string
): Promise<UafmUniversity[]> {
  const params: Record<string, string> = {};
  if (search) params.search = search;
  if (province) params.province = province;
  const data = await uafmFetch<UafmUniversity[]>("/universities", params);
  return data || [];
}

export async function fetchQualifications(params?: {
  nqf_level?: number;
  university_id?: string;
  search?: string;
}): Promise<UafmQualification[]> {
  const q: Record<string, string> = {};
  if (params?.nqf_level) q.nqf_level = String(params.nqf_level);
  if (params?.university_id) q.university_id = params.university_id;
  if (params?.search) q.search = params.search;
  const data = await uafmFetch<UafmQualification[]>("/qualifications", q);
  return data || [];
}

export async function fetchHighSchools(search?: string) {
  const q: Record<string, string> = {};
  if (search) q.search = search;
  return uafmFetch("/high-schools", q);
}
