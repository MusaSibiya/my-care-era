import { prisma } from "@/lib/db";
import { calculateAPS, slugify } from "@/lib/utils";
import { fetchQualifications, type UafmQualification } from "@/lib/uafm-api";
import type { RecommendationResult, CareerRecommendation, SubjectInput } from "@/lib/types";

function buildWhyExplanation(
  meetsAps: boolean,
  meetsSubjects: boolean,
  studentAps: number,
  apsMin: number | null,
  matched: string[],
  missing: string[],
  courseName: string
): string {
  const parts: string[] = [];

  if (meetsAps && meetsSubjects) {
    parts.push(`You fully qualify for ${courseName}.`);
    if (apsMin) parts.push(`Your APS of ${studentAps} meets the minimum of ${apsMin}.`);
    if (matched.length) parts.push(`You have all required subjects: ${matched.join(", ")}.`);
  } else if (!meetsAps && !meetsSubjects) {
    parts.push(`You don't yet meet the requirements for ${courseName}.`);
    if (apsMin) parts.push(`Your APS of ${studentAps} is below the minimum of ${apsMin} (need ${apsMin - studentAps} more points).`);
    if (missing.length) parts.push(`Missing or below-level subjects: ${missing.join(", ")}.`);
  } else if (!meetsAps) {
    parts.push(`You meet the subject requirements but your APS needs work.`);
    if (apsMin) parts.push(`Your APS of ${studentAps} is below the minimum of ${apsMin}. Consider improving marks in weaker subjects.`);
  } else {
    parts.push(`Your APS qualifies you but some subject requirements aren't met.`);
    if (missing.length) parts.push(`Missing or below-level: ${missing.join(", ")}. You may need to take these as supplementary subjects.`);
  }

  return parts.join(" ");
}

export async function getCourseRecommendations(
  userId: string
): Promise<RecommendationResult[]> {
  const latestResult = await prisma.academicResult.findFirst({
    where: { userId },
    include: { subjects: true },
    orderBy: { createdAt: "desc" },
  });

  if (!latestResult || latestResult.subjects.length === 0) return [];

  const studentAps = calculateAPS(latestResult.subjects);
  const subjectNames = latestResult.subjects.map((s) =>
    s.subjectName.toLowerCase()
  );

  // Fetch live qualifications from apply.org.za if API key is set
  let liveQualifications: UafmQualification[] = [];
  try {
    liveQualifications = await fetchQualifications();
  } catch {
    // API not available, fall back to local DB only
  }

  const allCourses = await prisma.course.findMany({
    include: {
      university: { select: { id: true, name: true, slug: true, city: true, province: true } },
      requirements: true,
    },
  });

  const results: RecommendationResult[] = [];

  // Score local DB courses
  for (const course of allCourses) {
    const meetsAps = !course.apsMin || studentAps >= course.apsMin;

    let matchedCount = 0;
    const matched: string[] = [];
    const missing: string[] = [];

    for (const req of course.requirements) {
      if (subjectNames.includes(req.subject.toLowerCase())) {
        const studentSubject = latestResult.subjects.find(
          (s) => s.subjectName.toLowerCase() === req.subject.toLowerCase()
        );
        if (studentSubject && studentSubject.level >= req.minLevel) {
          matchedCount++;
          matched.push(req.subject);
        } else {
          missing.push(req.subject);
        }
      } else if (req.isRequired) {
        missing.push(req.subject);
      }
    }

    const totalReqs = course.requirements.length || 1;
    const subjectScore = (matchedCount / totalReqs) * 60;
    const apsScore = meetsAps ? 30 : (studentAps / (course.apsMin || 28)) * 30;
    const matchScore = Math.round(subjectScore + apsScore + 10);

    if (matchScore > 30) {
      const meetsSubjects = missing.length === 0;
      results.push({
        course: {
          id: course.id,
          name: course.name,
          qualification: course.qualification,
          durationYears: course.durationYears,
          apsMin: course.apsMin,
          annualCost: course.annualCost,
          description: course.description,
          careerPaths: course.careerPaths,
          university: course.university,
        },
        matchScore: Math.min(100, matchScore),
        meetsAps,
        meetsSubjectReqs: meetsSubjects,
        matchedSubjects: matched,
        missingSubjects: missing,
        why: buildWhyExplanation(meetsAps, meetsSubjects, studentAps, course.apsMin, matched, missing, course.name),
      });
    }
  }

  // Also score live qualifications from apply.org.za
  for (const qual of liveQualifications) {
    const meetsAps = !qual.aps_minimum || studentAps >= qual.aps_minimum;
    const qualReqs = qual.subject_requirements || {};
    const matched: string[] = [];
    const missing: string[] = [];

    for (const [subject, minLevel] of Object.entries(qualReqs)) {
      const studentSubject = latestResult.subjects.find(
        (s) => s.subjectName.toLowerCase() === subject.toLowerCase()
      );
      if (studentSubject && studentSubject.level >= minLevel) {
        matched.push(subject);
      } else {
        missing.push(subject);
      }
    }

    const totalReqs = Object.keys(qualReqs).length || 1;
    const subjectScore = (matched.length / totalReqs) * 60;
    const apsScore = meetsAps ? 30 : (studentAps / (qual.aps_minimum || 28)) * 30;
    const matchScore = Math.round(subjectScore + apsScore + 10);

    if (matchScore > 30) {
      const meetsSubjects = missing.length === 0;
      results.push({
        course: {
          id: qual.id,
          name: qual.name,
          qualification: qual.duration,
          durationYears: parseInt(qual.duration) || 3,
          apsMin: qual.aps_minimum,
          annualCost: null,
          description: qual.description || "",
          careerPaths: null,
          university: {
            id: qual.university_id,
            name: qual.university_name,
            slug: qual.university_id,
            city: "",
            province: "",
          },
        },
        matchScore: Math.min(100, matchScore),
        meetsAps,
        meetsSubjectReqs: meetsSubjects,
        matchedSubjects: matched,
        missingSubjects: missing,
        why: buildWhyExplanation(meetsAps, meetsSubjects, studentAps, qual.aps_minimum, matched, missing, qual.name),
        dataSource: "live",
      });
    }
  }

  // Deduplicate by course name + university
  const seen = new Set<string>();
  const deduped = results.filter((r) => {
    const key = `${r.course.name.toLowerCase()}-${r.course.university.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped.sort((a, b) => b.matchScore - a.matchScore).slice(0, 30);
}

export async function getCareerRecommendations(
  userId: string
): Promise<CareerRecommendation[]> {
  const courseRecs = await getCourseRecommendations(userId);
  const topCourseIds = courseRecs.slice(0, 10).map((r) => r.course.id);

  const careerCourses = await prisma.careerCourse.findMany({
    where: { courseId: { in: topCourseIds } },
    include: {
      careerPath: true,
      course: {
        select: { id: true, name: true },
      },
    },
  });

  const careerMap = new Map<
    string,
    {
      career: (typeof careerCourses)[0]["careerPath"];
      courses: { id: string; name: string; university: string }[];
    }
  >();

  for (const cc of careerCourses) {
    const existing = careerMap.get(cc.careerPathId);
    const uniName =
      courseRecs.find((r) => r.course.id === cc.courseId)?.course.university
        .name || "";

    if (existing) {
      existing.courses.push({
        id: cc.course.id,
        name: cc.course.name,
        university: uniName,
      });
    } else {
      careerMap.set(cc.careerPathId, {
        career: cc.careerPath,
        courses: [
          { id: cc.course.id, name: cc.course.name, university: uniName },
        ],
      });
    }
  }

  const results: CareerRecommendation[] = [];

  for (const [, { career, courses }] of careerMap) {
    const demandScore =
      career.demandLevel?.toLowerCase() === "high"
        ? 30
        : career.demandLevel?.toLowerCase() === "moderate"
          ? 20
          : 10;

    const matchScore = Math.min(
      100,
      40 + demandScore + courses.length * 5
    );

    results.push({
      career: {
        id: career.id,
        name: career.name,
        slug: career.slug,
        description: career.description,
        category: career.category,
        avgSalaryMin: career.avgSalaryMin,
        avgSalaryMax: career.avgSalaryMax,
        demandLevel: career.demandLevel,
        growthRate: career.growthRate,
        keySkills: career.keySkills,
      },
      matchScore,
      matchingCourses: courses.length,
      relatedCourses: courses,
    });
  }

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

export function parseNSCResults(data: SubjectInput[]) {
  const validSubjects = [
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

  return data
    .filter(
      (s) =>
        s.subjectName &&
        s.level >= 1 &&
        s.level <= 7
    )
    .map((s) => ({
      subjectName: s.subjectName.trim(),
      level: Math.min(7, Math.max(1, s.level)),
      symbol: s.symbol,
      percentage: s.percentage,
    }));
}
