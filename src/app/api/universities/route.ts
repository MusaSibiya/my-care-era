import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError, successResponse, paginateParams } from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { page, pageSize, skip } = paginateParams(request);
    const url = new URL(request.url);

    const where: Record<string, unknown> = {};
    const province = url.searchParams.get("province");
    const search = url.searchParams.get("q");
    const type = url.searchParams.get("type");

    if (province) where.province = province;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { city: { contains: search } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.university.findMany({
        where,
        include: {
          _count: { select: { courses: true, accommodations: true, reviews: true } },
        },
        orderBy: { ranking: "asc" },
        skip,
        take: pageSize,
      }),
      prisma.university.count({ where }),
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
