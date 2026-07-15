import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { handleApiError, successResponse } from "@/lib/api-utils";
import { parseNSCWithGemini } from "@/lib/gemini-parser";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return handleApiError({ statusCode: 401, message: "Unauthorized" });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return handleApiError({ statusCode: 400, message: "No file provided" });
    }

    if (file.type !== "application/pdf") {
      return handleApiError({ statusCode: 400, message: "Only PDF files are accepted" });
    }

    if (file.size > 10 * 1024 * 1024) {
      return handleApiError({ statusCode: 400, message: "File too large (max 10MB)" });
    }

    console.log("Parsing PDF with Gemini:", file.name, file.size, file.type);

    const buffer = await file.arrayBuffer();
    const result = await parseNSCWithGemini(buffer, file.type);

    console.log("Gemini result:", result.subjects.length, "subjects");

    return successResponse({
      subjects: result.subjects,
      yearCompleted: result.yearCompleted,
      studentName: result.studentName,
      examBoard: result.examBoard,
      count: result.subjects.length,
    });
  } catch (error) {
    console.error("Parse PDF error:", error);
    return handleApiError(error);
  }
}
