import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { handleApiError, successResponse } from "@/lib/api-utils";

const reviewSchema = z.object({
  universityId: z.string().optional(),
  accommodationId: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  content: z.string().optional(),
  category: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const universityId = url.searchParams.get("universityId");
    const accommodationId = url.searchParams.get("accommodationId");

    const where: Record<string, unknown> = {};
    if (universityId) where.universityId = universityId;
    if (accommodationId) where.accommodationId = accommodationId;

    const reviews = await prisma.review.findMany({
      where,
      include: {
        user: { select: { name: true, image: true } },
        university: { select: { name: true, slug: true } },
        accommodation: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return successResponse(reviews);
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
    const data = reviewSchema.parse(body);

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        ...data,
      },
      include: {
        user: { select: { name: true, image: true } },
      },
    });

    return successResponse(review, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
