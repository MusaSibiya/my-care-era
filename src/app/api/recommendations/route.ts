import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { handleApiError, successResponse, paginateParams } from "@/lib/api-utils";
import { getCourseRecommendations, getCareerRecommendations } from "@/lib/recommendations";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return handleApiError({ statusCode: 401, message: "Unauthorized" });
    }

    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "courses";

    if (type === "careers") {
      const careers = await getCareerRecommendations(session.user.id);
      return successResponse(careers);
    }

    const courses = await getCourseRecommendations(session.user.id);
    return successResponse(courses);
  } catch (error) {
    return handleApiError(error);
  }
}
