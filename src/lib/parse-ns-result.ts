import * as pdfjsLib from "pdfjs-dist";
import Tesseract from "tesseract.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

/* ── Types ──────────────────────────────────────────────────────── */

export interface ParsedSubject {
  subjectName: string;
  level: number;
  percentage?: number;
  symbol?: string;
}

export interface ParseProgress {
  stage: "reading" | "ocr" | "parsing" | "done";
  percent: number;
  message: string;
}

/* ── Complete SA Subject Database ────────────────────────────────── */

interface SubjectDef {
  canonical: string;
  codes: string[];        // NSC subject codes
  aliases: string[];      // common names / abbreviations
  keywords: string[];     // for fuzzy matching
}

const SUBJECTS: SubjectDef[] = [
  {
    canonical: "Home Language",
    codes: ["ENGHL", "AFMHL", "ZULHL", "XHOHL", "SESOHL", "SETSWAHL", "VENHL", "TSONGHL", "SWAHL", "NDEHL"],
    aliases: ["english home language", "afrikaans home language", "isiZulu home language",
              "isixhosa home language", "sesotho home language", "setswana home language",
              "tshivenda home language", "xitsonga home language", "siSwati home language",
              "isiNdebele home language", "home language", "first language", "hl"],
    keywords: ["home language", "first language", "enghl", "afmhl", "zulhl", "xhohL"],
  },
  {
    canonical: "First Additional Language",
    codes: ["ENGFL", "AFHAL", "ZULFL", "XHOFL", "SESFL", "SETSWFL", "VENFL", "TSONGFL", "SWAFL", "NDEFL"],
    aliases: ["english first additional language", "afrikaans first additional language",
              "english first additional", "afrikaans first additional", "isizulu first additional",
              "first additional language", "fal", "first additional", "second language"],
    keywords: ["first additional", "fal", "second language", "engfl", "afhal"],
  },
  {
    canonical: "Mathematics",
    codes: ["MAT"],
    aliases: ["mathematics", "maths", "math", "mathematics nsc", "wiskunde"],
    keywords: ["mathematics", "maths", "math"],
  },
  {
    canonical: "Mathematical Literacy",
    codes: ["MAML"],
    aliases: ["mathematical literacy", "maths lit", "math lit", "mathematical literacy nsc", "wiskunde geletterdheid"],
    keywords: ["mathematical literacy", "maths lit", "math lit"],
  },
  {
    canonical: "Life Orientation",
    codes: ["LO"],
    aliases: ["life orientation", "lewensterorientering", "lo"],
    keywords: ["life orientation"],
  },
  {
    canonical: "Physical Sciences",
    codes: ["PHYSCI", "PHYS"],
    aliases: ["physical sciences", "physical science", "physics", "fisiese wetenskappe"],
    keywords: ["physical science", "physics", "fisiese"],
  },
  {
    canonical: "Life Sciences",
    codes: ["LIFSCI", "BIO"],
    aliases: ["life sciences", "life science", "biology", "lewenswetenskappe"],
    keywords: ["life science", "biology", "lewens"],
  },
  {
    canonical: "Geography",
    codes: ["GEOG"],
    aliases: ["geography", "geografie"],
    keywords: ["geography", "geografie"],
  },
  {
    canonical: "History",
    codes: ["HIST"],
    aliases: ["history", "geskiedenis"],
    keywords: ["history", "geskiedenis"],
  },
  {
    canonical: "Accounting",
    codes: ["ACC"],
    aliases: ["accounting", "rekeningkunde"],
    keywords: ["accounting", "rekeningkunde"],
  },
  {
    canonical: "Business Studies",
    codes: ["BS"],
    aliases: ["business studies", "besigheidstudies", "business studies nsc"],
    keywords: ["business studies", "besigheid"],
  },
  {
    canonical: "Economics",
    codes: ["ECON"],
    aliases: ["economics", "ekonomie"],
    keywords: ["economics", "ekonomie"],
  },
  {
    canonical: "Information Technology",
    codes: ["IT"],
    aliases: ["information technology", "informatics", "inligtingkunde", "it nsc"],
    keywords: ["information technology", "informatics", "inligting"],
  },
  {
    canonical: "Computer Applications Technology",
    codes: ["CAT"],
    aliases: ["computer applications technology", "cat nsc"],
    keywords: ["computer applications", "cat"],
  },
  {
    canonical: "Design",
    codes: ["DES"],
    aliases: ["design", "ontwerp"],
    keywords: ["design", "ontwerp"],
  },
  {
    canonical: "Visual Arts",
    codes: ["VISART"],
    aliases: ["visual arts", "visuele kunste"],
    keywords: ["visual arts", "visuele"],
  },
  {
    canonical: "Music",
    codes: ["MUS"],
    aliases: ["music", "musiek"],
    keywords: ["music", "musiek"],
  },
  {
    canonical: "Dramatic Arts",
    codes: ["DRAM"],
    aliases: ["dramatic arts", "drama", "dramatiese kunste"],
    keywords: ["dramatic arts", "drama", "dramatiese"],
  },
  {
    canonical: "Hospitality Studies",
    codes: ["HOSP"],
    aliases: ["hospitality studies", "gastvryheidstudies"],
    keywords: ["hospitality", "gastvryheid"],
  },
  {
    canonical: "Tourism",
    codes: ["TOUR"],
    aliases: ["tourism", "toerisme"],
    keywords: ["tourism", "toerisme"],
  },
  {
    canonical: "Engineering Graphics and Design",
    codes: ["EGD"],
    aliases: ["engineering graphics and design", "engineering graphics & design", "egd nsc"],
    keywords: ["engineering graphics", "egd"],
  },
  {
    canonical: "Agricultural Sciences",
    codes: ["AGRISC"],
    aliases: ["agricultural sciences", "agriculture", "landbouwetenskappe", "landbou"],
    keywords: ["agricultural", "agriculture", "landbou"],
  },
  {
    canonical: "Consumer Studies",
    codes: ["CONS"],
    aliases: ["consumer studies", "verbruikerstudies"],
    keywords: ["consumer studies", "verbruiker"],
  },
  {
    canonical: "Religion Studies",
    codes: ["REL"],
    aliases: ["religion studies", "godsdiensstudie"],
    keywords: ["religion studies", "godsdiens"],
  },
  {
    canonical: "Civil Technology",
    codes: ["CIVIL"],
    aliases: ["civil technology", "civiele tegnologie"],
    keywords: ["civil technology", "civiele"],
  },
  {
    canonical: "Electrical Technology",
    codes: ["ELECTECH"],
    aliases: ["electrical technology", "elektriese tegnologie"],
    keywords: ["electrical technology", "elektriese"],
  },
  {
    canonical: "Mechanical Technology",
    codes: ["MECHTECH"],
    aliases: ["mechanical technology", "meganiese tegnologie"],
    keywords: ["mechanical technology", "meganiese"],
  },
];

/* ── Grading ────────────────────────────────────────────────────── */

const SYMBOL_TO_LEVEL: Record<string, number> = {
  "a": 7, "b": 6, "c": 5, "d": 4, "e": 3, "f": 2, "g": 1,
  "a+": 7, "b+": 6, "c+": 5, "d+": 4, "e+": 3, "f+": 2,
  "a-": 7, "b-": 6, "c-": 5, "d-": 4, "e-": 3,
};

function levelFromPercent(pct: number): number {
  if (pct >= 80) return 7;
  if (pct >= 70) return 6;
  if (pct >= 60) return 5;
  if (pct >= 50) return 4;
  if (pct >= 40) return 3;
  if (pct >= 30) return 2;
  return 1;
}

function levelToSymbol(level: number): string {
  return ["", "G", "F", "E", "D", "C", "B", "A"][level] || "?";
}

function extractLevel(text: string): { level: number; symbol: string; percentage?: number } | null {
  const t = text.trim();

  // Percentage first (most useful for the UI)
  const pctMatch = t.match(/(\d{1,3})\s*%/);
  if (pctMatch) {
    const pct = parseInt(pctMatch[1]);
    if (pct <= 100) {
      const level = levelFromPercent(pct);
      return { level, symbol: levelToSymbol(level), percentage: pct };
    }
  }

  // NSC level (1-7) as standalone number
  const lvlMatch = t.match(/\b([1-7])\b/);
  if (lvlMatch) {
    const level = parseInt(lvlMatch[1]);
    return { level, symbol: levelToSymbol(level) };
  }

  // Letter symbol (A-G)
  const symMatch = t.match(/\b([A-Ga-g])\b/);
  if (symMatch) {
    const level = SYMBOL_TO_LEVEL[symMatch[1].toLowerCase()];
    if (level) return { level, symbol: levelToSymbol(level) };
  }

  return null;
}

/* ── Subject Matching ───────────────────────────────────────────── */

function matchSubject(raw: string): string | null {
  const cleaned = raw.toLowerCase().replace(/[^a-z0-9\s&]/g, "").replace(/\s+/g, " ").trim();
  if (!cleaned || cleaned.length < 2) return null;

  // 1. Exact code match
  const codeUpper = raw.trim().toUpperCase().replace(/[^A-Z]/g, "");
  for (const def of SUBJECTS) {
    if (def.codes.some(c => c === codeUpper)) return def.canonical;
  }

  // 2. Exact alias match
  for (const def of SUBJECTS) {
    if (def.aliases.includes(cleaned)) return def.canonical;
  }

  // 3. Substring match (alias in text or text in alias)
  for (const def of SUBJECTS) {
    for (const alias of def.aliases) {
      if (cleaned.includes(alias) || alias.includes(cleaned)) return def.canonical;
    }
  }

  // 4. Keyword match
  for (const def of SUBJECTS) {
    for (const kw of def.keywords) {
      if (cleaned.includes(kw) || kw.includes(cleaned)) return def.canonical;
    }
  }

  // 5. Partial word match for common short forms
  if (cleaned.length >= 2) {
    for (const def of SUBJECTS) {
      for (const alias of def.aliases) {
        const aliasWords = alias.split(" ");
        if (aliasWords.some(w => w === cleaned || cleaned === w)) return def.canonical;
      }
    }
  }

  return null;
}

/* ── Exam Board Detection ───────────────────────────────────────── */

type ExamBoard = "DBE" | "IEB" | "UNKNOWN";

function detectExamBoard(text: string): ExamBoard {
  const lower = text.toLowerCase();
  if (lower.includes("department of basic education") || lower.includes("national senior certificate") || lower.includes("dbe")) return "DBE";
  if (lower.includes("independent examination board") || lower.includes("ieb")) return "IEB";
  return "UNKNOWN";
}

/* ── Line-Based Extraction (digital PDFs) ───────────────────────── */

function extractFromLines(lines: string[]): ParsedSubject[] {
  const results: ParsedSubject[] = [];
  const seen = new Set<string>();

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 3) continue;

    // Try to split on common delimiters used in report cards
    const parts = trimmed.split(/\s{2,}|\t|[\|│┃]/).map(p => p.trim()).filter(p => p);

    if (parts.length >= 2) {
      // Multi-column: try each combination of subject + level
      // Also try joining 2-3 adjacent parts for multi-word subjects
      for (let i = 0; i < parts.length; i++) {
        let subject = matchSubject(parts[i]);
        let subjectEnd = i;

        // Try joining with next part(s) for multi-word subjects
        if (!subject && i + 1 < parts.length) {
          subject = matchSubject(parts[i] + " " + parts[i + 1]);
          if (subject) subjectEnd = i + 1;
        }
        if (!subject && i + 2 < parts.length) {
          subject = matchSubject(parts[i] + " " + parts[i + 1] + " " + parts[i + 2]);
          if (subject) subjectEnd = i + 2;
        }

        if (!subject || seen.has(subject.toLowerCase())) continue;

        // Look for level/percentage in columns after the subject
        for (let j = subjectEnd + 1; j < parts.length; j++) {
          const levelResult = extractLevel(parts[j]);
          if (levelResult) {
            seen.add(subject.toLowerCase());
            results.push({ subjectName: subject, level: levelResult.level, symbol: levelResult.symbol, percentage: levelResult.percentage });
            break;
          }
        }
      }
    }

    // Single-line patterns: "Subject: Level" or "Subject 6 B"
    const singleLinePatterns = [
      // "Mathematics: 6" or "Mathematics: Level 6 (70%)"
      /^(.+?)\s*[:|\-–]\s*(?:level\s*)?([1-7]|[A-Ga-g])\s*(?:\(([A-Ga-g])\)|\((\d{1,3})%?\)|[-–]\s*(\d{1,3})%)?$/i,
      // "Mathematics 6 B" or "Mathematics Level 6 (70%)"
      /^(.+?)\s+(?:Level\s+)?([1-7])\s*([A-Ga-g])?\s*(?:\((\d{1,3})%?\))?$/i,
      // "Mathematics B 70%" or "Mathematics B 70"
      /^(.+?)\s+([A-Ga-g])\s+(\d{1,3})\s*%?$/i,
      // "Mathematics 6 - 70%"
      /^(.+?)\s+([1-7])\s*[-–]\s*(?:[A-Ga-g]\s*[-–]\s*)?(\d{1,3})?%?$/i,
      // "Mathematics 6" (just level, no symbol)
      /^(.+?)\s+([1-7])\s*$/,
      // "Mathematics B" (just symbol)
      /^(.+?)\s+([A-Ga-g])\s*$/,
    ];

    for (const pattern of singleLinePatterns) {
      const match = trimmed.match(pattern);
      if (!match) continue;

      const subjectRaw = match[1];
      let subject = matchSubject(subjectRaw);
      if (!subject || seen.has(subject.toLowerCase())) break;

      // Build the text to pass to extractLevel — includes level, symbol, and percentage
      const levelText = match[0].substring(match[1].length).trim();
      const levelResult = extractLevel(levelText);

      if (levelResult) {
        seen.add(subject.toLowerCase());
        results.push({ subjectName: subject, level: levelResult.level, symbol: levelResult.symbol, percentage: levelResult.percentage });
      }
      break;
    }
  }

  return results;
}

/* ── Full-Text Code Extraction (catches codes anywhere) ─────────── */

function extractFromCodes(fullText: string): ParsedSubject[] {
  const results: ParsedSubject[] = [];
  const seen = new Set<string>();

  for (const def of SUBJECTS) {
    for (const code of def.codes) {
      // Look for code followed by a level/symbol within ~50 chars
      const regex = new RegExp(
        `${code}[\\s\\S]{0,60}?\\b([1-7]|[A-Ga-g])\\b`,
        "gi"
      );
      let match;
      while ((match = regex.exec(fullText)) !== null) {
        const levelResult = extractLevel(match[1]);
        if (levelResult && !seen.has(def.canonical.toLowerCase())) {
          seen.add(def.canonical.toLowerCase());
          results.push({
            subjectName: def.canonical,
            level: levelResult.level,
            symbol: levelResult.symbol,
            percentage: levelResult.percentage,
          });
          break;
        }
      }
    }
  }

  return results;
}

/* ── Keyword Proximity Extraction ────────────────────────────────── */

function extractByKeywordProximity(fullText: string): ParsedSubject[] {
  const results: ParsedSubject[] = [];
  const seen = new Set<string>();
  const lower = fullText.toLowerCase();

  for (const def of SUBJECTS) {
    if (seen.has(def.canonical.toLowerCase())) continue;

    for (const kw of def.keywords) {
      const idx = lower.indexOf(kw);
      if (idx === -1) continue;

      // Extract ~80 chars around the keyword
      const window = fullText.substring(Math.max(0, idx - 10), idx + kw.length + 80);
      const levelResult = extractLevel(window);

      if (levelResult) {
        seen.add(def.canonical.toLowerCase());
        results.push({
          subjectName: def.canonical,
          level: levelResult.level,
          symbol: levelResult.symbol,
        });
        break;
      }
    }
  }

  return results;
}

/* ── PDF Text Extraction ─────────────────────────────────────────── */

async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    let lastY: number | null = null;
    const lineChunks: string[][] = [[]];

    for (const item of content.items as any[]) {
      const y = Math.round(item.transform[5]);

      if (lastY !== null && Math.abs(y - lastY) > 3) {
        lineChunks.push([]);
      }

      const str = item.str;
      if (str) {
        lineChunks[lineChunks.length - 1].push(str);
      }

      lastY = y;
    }

    for (const chunk of lineChunks) {
      fullText += chunk.join(" ") + "\n";
    }
  }

  return fullText;
}

/* ── OCR Extraction (scanned PDFs) ───────────────────────────────── */

async function ocrPdfPages(
  file: File,
  onProgress?: (p: ParseProgress) => void
): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    onProgress?.({
      stage: "ocr",
      percent: Math.round((i / pdf.numPages) * 100),
      message: `Scanning page ${i} of ${pdf.numPages}...`,
    });

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2.0 }); // 2x for better OCR

    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const imageData = canvas.toDataURL("image/png");
    canvas.remove();

    const { data } = await Tesseract.recognize(imageData, "eng", {});
    fullText += "\n" + data.text;
  }

  return fullText;
}

/* ── Year Extraction ─────────────────────────────────────────────── */

function extractYear(text: string): number | undefined {
  // Match "2023" or "2024" etc. that appears near "year" or "examination"
  const yearPatterns = [
    /(?:year|examination|exam|session|november|february|march|june)\s*(?:of|:|-|\s)?\s*(20[12]\d)/i,
    /\b(20[12]\d)\s+(?:examination|exam|session|november|results)/i,
    /\b(20[12]\d)\b/,
  ];

  for (const pattern of yearPatterns) {
    const match = text.match(pattern);
    if (match) {
      const year = parseInt(match[1]);
      if (year >= 2008 && year <= 2030) return year; // NSC started 2008
    }
  }

  return undefined;
}

/* ── Province Extraction ─────────────────────────────────────────── */

function extractProvince(text: string): string | undefined {
  const provinces = [
    "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
    "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape",
  ];
  const lower = text.toLowerCase();
  for (const p of provinces) {
    if (lower.includes(p.toLowerCase())) return p;
  }
  return undefined;
}

/* ── Main Parser ─────────────────────────────────────────────────── */

export async function parseNsResultPdf(
  file: File,
  onProgress?: (p: ParseProgress) => void
): Promise<{
  subjects: ParsedSubject[];
  year?: number;
  province?: string;
  examBoard: string;
  rawText: string;
  warnings: string[];
  usedOcr: boolean;
}> {
  const warnings: string[] = [];

  // Step 1: Try text extraction
  onProgress?.({ stage: "reading", percent: 0, message: "Reading PDF..." });
  const rawText = await extractTextFromPdf(file);
  onProgress?.({ stage: "reading", percent: 50, message: "Analyzing content..." });

  const textLength = rawText.replace(/\s/g, "").length;
  const examBoard = detectExamBoard(rawText);
  const year = extractYear(rawText);
  const province = extractProvince(rawText);

  console.log("[PDF Parser] Text length:", textLength, "Board:", examBoard, "Year:", year);
  console.log("[PDF Parser] Raw text preview:\n", rawText.substring(0, 1500));

  let workingText = rawText;
  let usedOcr = false;

  // Step 2: If text is too short, try OCR
  if (textLength < 100) {
    onProgress?.({
      stage: "ocr",
      percent: 0,
      message: "No text found — scanning document with OCR...",
    });
    const ocrText = await ocrPdfPages(file, onProgress);
    workingText = ocrText;
    usedOcr = true;
    onProgress?.({ stage: "ocr", percent: 100, message: "OCR complete." });
  }

  // Step 3: Multi-pass subject extraction
  onProgress?.({ stage: "parsing", percent: 0, message: "Extracting subjects..." });

  const lines = workingText.split(/[\n\r]+/).map(l => l.trim()).filter(l => l.length > 0);

  // Pass 1: Line-by-line structured extraction
  let subjects = extractFromLines(lines);

  // Pass 2: Subject code matching (catches ENGHL, MAT, etc.)
  if (subjects.length < 5) {
    const codeSubjects = extractFromCodes(workingText);
    for (const s of codeSubjects) {
      if (!subjects.find(x => x.subjectName === s.subjectName)) {
        subjects.push(s);
      }
    }
  }

  // Pass 3: Keyword proximity (last resort for text-based)
  if (subjects.length < 5) {
    const kwSubjects = extractByKeywordProximity(workingText);
    for (const s of kwSubjects) {
      if (!subjects.find(x => x.subjectName === s.subjectName)) {
        subjects.push(s);
      }
    }
  }

  console.log("[PDF Parser] Extracted subjects:", subjects.length, subjects.map(s => `${s.subjectName}: ${s.percentage ?? s.level}`).join(", "));

  // Step 4: If still nothing and we didn't try OCR yet, try OCR
  if (subjects.length === 0 && !usedOcr && textLength >= 100) {
    onProgress?.({
      stage: "ocr",
      percent: 0,
      message: "Text extraction unsuccessful — trying OCR scan...",
    });
    const ocrText = await ocrPdfPages(file, onProgress);
    usedOcr = true;

    // Re-run all passes on OCR text
    const ocrLines = ocrText.split(/[\n\r]+/).map(l => l.trim()).filter(l => l.length > 0);
    subjects = extractFromLines(ocrLines);

    if (subjects.length < 5) {
      const codeSubjects = extractFromCodes(ocrText);
      for (const s of codeSubjects) {
        if (!subjects.find(x => x.subjectName === s.subjectName)) {
          subjects.push(s);
        }
      }
    }

    if (subjects.length < 5) {
      const kwSubjects = extractByKeywordProximity(ocrText);
      for (const s of kwSubjects) {
        if (!subjects.find(x => x.subjectName === s.subjectName)) {
          subjects.push(s);
        }
      }
    }
  }

  // Warnings
  if (subjects.length === 0) {
    warnings.push(
      "Could not auto-detect subjects from this PDF. It may be a scanned image — please try a clearer copy, or enter results manually."
    );
  } else if (subjects.length < 3) {
    warnings.push(
      `Found ${subjects.length} subject(s). NSC results typically have 6-8. Please add any missing subjects manually.`
    );
  }

  onProgress?.({ stage: "done", percent: 100, message: "Done." });

  return { subjects, year, province, examBoard, rawText: workingText, warnings, usedOcr };
}
