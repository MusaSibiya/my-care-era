import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { handleApiError, successResponse } from "@/lib/api-utils";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const course = await prisma.course.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: {
        university: true,
        requirements: true,
        careerCourses: {
          include: { careerPath: true },
        },
      },
    });

    if (!course) {
      return handleApiError({ statusCode: 404, message: "Course not found" });
    }

    return successResponse(course);
  } catch (error) {
    return handleApiError(error);
  }
}
