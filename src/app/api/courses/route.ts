import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError, successResponse, paginateParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, skip } = paginateParams(request);
    const url = new URL(request.url);

    const where: Record<string, unknown> = {};
    const search = url.searchParams.get("q");
    const universityId = url.searchParams.get("universityId");
    const faculty = url.searchParams.get("faculty");

    if (universityId) where.universityId = universityId;
    if (faculty) where.faculty = faculty;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { careerPaths: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          university: { select: { id: true, name: true, slug: true, city: true } },
          _count: { select: { requirements: true } },
        },
        orderBy: { name: "asc" },
        skip,
        take: pageSize,
      }),
      prisma.course.count({ where }),
    ]);

    return successResponse({
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
