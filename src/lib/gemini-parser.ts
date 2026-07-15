import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const MODEL = "gemini-2.0-flash";

export interface ParsedSubject {
  name: string;
  symbol?: string;
  level?: number;
  percentage?: number;
}

export interface GeminiParseResult {
  subjects: ParsedSubject[];
  yearCompleted?: number;
  studentName?: string;
  examBoard?: string;
  rawText?: string;
}

export async function parseNSCWithGemini(
  fileBuffer: ArrayBuffer,
  mimeType: string
): Promise<GeminiParseResult> {
  const model = genAI.getGenerativeModel({ model: MODEL });

  const uint8 = new Uint8Array(fileBuffer);
  const base64 = Buffer.from(uint8).toString("base64");

  const prompt = `You are parsing a South African NSC (National Senior Certificate) / Matric results document.

Extract ALL subjects and their results from this document. For each subject provide:
- name: The full subject name (e.g. "English Home Language", "Mathematics", "Physical Sciences")
- symbol: The letter symbol if present (A, B, C, D, E, F, G)
- level: The NSC level (1-7) if present
- percentage: The percentage/marks if present

Also extract:
- yearCompleted: The year the results were obtained
- studentName: The student's name if visible
- examBoard: The exam board (e.g. IEB, Department of Education)

Return a JSON array with this structure:
{
  "subjects": [
    { "name": "Subject Name", "symbol": "A", "level": 7, "percentage": 85 }
  ],
  "yearCompleted": 2024,
  "studentName": "John Doe",
  "examBoard": "Department of Education"
}

Be thorough — extract EVERY subject listed. South African NSC subjects include:
English Home Language, Afrikaans Home Language, isiZulu Home Language, Mathematics, Mathematical Literacy, Physical Sciences, Life Sciences, Geography, History, Accounting, Business Studies, Economics, Computer Applications Technology, Information Technology, Tourism, Hospitality Studies, Consumer Studies, Visual Arts, Music, Dramatic Arts, Engineering Graphics and Design, Agricultural Sciences, Civil Technology, Electrical Technology, Mechanical Technology, Life Orientation.

Return ONLY valid JSON, no markdown formatting.`;

  try {
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: mimeType,
          data: base64,
        },
      },
    ]);

    const response = result.response.text();

    try {
      const cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return {
        subjects: parsed.subjects || [],
        yearCompleted: parsed.yearCompleted,
        studentName: parsed.studentName,
        examBoard: parsed.examBoard,
        rawText: response,
      };
    } catch {
      console.error("Failed to parse Gemini response as JSON:", response);
      return { subjects: [], rawText: response };
    }
  } catch (err) {
    console.error("Gemini API error:", err);
    throw new Error(`Gemini API failed: ${err instanceof Error ? err.message : "Unknown error"}`);
  }
}

export async function parseNSCTextWithGemini(
  text: string
): Promise<GeminiParseResult> {
  const model = genAI.getGenerativeModel({ model: MODEL });

  const prompt = `You are parsing extracted text from a South African NSC (National Senior Certificate) / Matric results document.

Here is the extracted text:
---
${text}
---

Extract ALL subjects and their results. For each subject provide:
- name: The full subject name
- symbol: The letter symbol if present (A, B, C, D, E, F, G)
- level: The NSC level (1-7) if present
- percentage: The percentage/marks if present

Also extract yearCompleted, studentName, and examBoard if available.

Return ONLY valid JSON:
{
  "subjects": [
    { "name": "Subject Name", "symbol": "A", "level": 7, "percentage": 85 }
  ],
  "yearCompleted": 2024,
  "studentName": "John Doe",
  "examBoard": "Department of Education"
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    try {
      const cleaned = response.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      const parsed = JSON.parse(cleaned);
      return {
        subjects: parsed.subjects || [],
        yearCompleted: parsed.yearCompleted,
        studentName: parsed.studentName,
        examBoard: parsed.examBoard,
        rawText: response,
      };
    } catch {
      console.error("Failed to parse Gemini text response:", response);
      return { subjects: [], rawText: response };
    }
  } catch (err) {
    console.error("Gemini API error:", err);
    throw new Error(`Gemini API failed: ${err instanceof Error ? err.message : "Unknown error"}`);
  }
}
