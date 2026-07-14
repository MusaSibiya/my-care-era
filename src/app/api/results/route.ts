import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { handleApiError, successResponse } from "@/lib/api-utils";
import { parseNSCResults } from "@/lib/recommendations";

const uploadSchema = z.object({
  yearCompleted: z.number().min(2000).max(2030),
  province: z.string().optional(),
  subjects: z.array(
    z.object({
      subjectName: z.string(),
      level: z.number().min(1).max(7),
      symbol: z.string().optional(),
      percentage: z.number().min(0).max(100).optional(),
    })
  ).min(3, "At least 3 subjects required"),
});

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return handleApiError({ statusCode: 401, message: "Unauthorized" });
    }

    const results = await prisma.academicResult.findMany({
      where: { userId: session.user.id },
      include: { subjects: true },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(results);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return handleApiError({ statusCode: 401, message: "Unauthorized" });
    }

    const body = await request.json();
    const data = uploadSchema.parse(body);
    const subjects = parseNSCResults(data.subjects);

    const result = await prisma.academicResult.create({
      data: {
        userId: session.user.id,
        yearCompleted: data.yearCompleted,
        province: data.province,
        subjects: {
          create: subjects.map((s) => ({
            subjectName: s.subjectName,
            level: s.level,
            symbol: s.symbol,
            percentage: s.percentage,
          })),
        },
      },
      include: { subjects: true },
    });

    return successResponse(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
