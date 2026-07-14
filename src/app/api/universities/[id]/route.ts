import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError, successResponse } from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const university = await prisma.university.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        courses: {
          orderBy: { name: "asc" },
          include: { requirements: true },
        },
        accommodations: { orderBy: { priceMin: "asc" } },
        safetyData: true,
        reviews: {
          include: { user: { select: { name: true, image: true } } },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        _count: {
          select: { courses: true, accommodations: true, reviews: true },
        },
      },
    });

    if (!university) {
      return handleApiError({ statusCode: 404, message: "University not found" });
    }

    return successResponse(university);
  } catch (error) {
    return handleApiError(error);
  }
}
