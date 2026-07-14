import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError, successResponse } from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const career = await prisma.careerPath.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        careerCourses: {
          include: {
            course: {
              include: {
                university: { select: { id: true, name: true, slug: true, city: true } },
              },
            },
          },
        },
      },
    });

    if (!career) {
      return handleApiError({ statusCode: 404, message: "Career not found" });
    }

    return successResponse(career);
  } catch (error) {
    return handleApiError(error);
  }
}
