import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError, successResponse, paginateParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, skip } = paginateParams(request);
    const url = new URL(request.url);

    const where: Record<string, unknown> = {};
    const search = url.searchParams.get("q");
    const category = url.searchParams.get("category");
    const demand = url.searchParams.get("demand");

    if (category) where.category = category;
    if (demand) where.demandLevel = demand;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.careerPath.findMany({
        where,
        include: {
          _count: { select: { careerCourses: true } },
        },
        orderBy: { name: "asc" },
        skip,
        take: pageSize,
      }),
      prisma.careerPath.count({ where }),
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
