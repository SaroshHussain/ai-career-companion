// Resume controller — handles file upload, text extraction, and
// AI-powered parsing into structured JSON.

import { extractText } from "../services/textExtractor.js";
import { parseResumeText } from "../services/resumeParser.js";

export async function uploadResume(req, res, next) {
  const file = req.file;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: "No file provided. Please attach a resume file.",
    });
  }

  try {
    const text = await extractText(file.path, file.mimetype);
    // Attempt to parse the extracted text into the exact JSON layout
    // the frontend expects. If parsing fails we still return the raw
    // extracted text so the client can retry parsing.
    let parsed = null;
    try {
      parsed = await parseResumeText(text);
    } catch (err) {
      // Don't fail the whole upload for parse errors; return the text
      // and a note so the frontend can choose to call /resume/parse
      // again or show a fallback.
      console.warn(
        "[resumeController] parsing during upload failed:",
        err?.message || err,
      );
    }

    res.status(200).json({
      success: true,
      message: "Resume uploaded and text extracted successfully.",
      data: {
        originalName: file.originalname,
        storedName: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        text,
        parsed,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function parseResume(req, res, next) {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message:
          'Request body must contain a non-empty "text" field with the resume content.',
      });
    }

    const parsed = await parseResumeText(text);

    res.status(200).json({
      success: true,
      message: "Resume parsed successfully.",
      data: parsed,
    });
  } catch (err) {
    const msg = (err.message || "").toLowerCase();
    const isRateLimit =
      err.status === 429 ||
      err.code === 429 ||
      msg.includes("429") ||
      msg.includes("rate limit") ||
      msg.includes("quota") ||
      msg.includes("exhausted") ||
      msg.includes("too many requests") ||
      msg.includes("unavailable") ||
      msg.includes("resource exhausted");

    if (isRateLimit) {
      return res.status(200).json({
        success: true,
        message:
          "Resume parsed heuristically (AI unavailable — partial result).",
        data: extractFallback(req.body.text || ""),
        note: "Groq API is rate-limited. The result was built from a basic heuristic.",
      });
    }

    next(err);
  }
}

// Minimal heuristic fallback when the AI API is unavailable.
// Extracts whatever looks like a name, email, phone, and returns
// empty arrays for list fields so the frontend stays functional.
function extractFallback(text) {
  const nameMatch = text.match(/^([A-Z][a-z]+ [A-Z][a-z]+)/m);
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
  const phoneMatch = text.match(/([\+]?[\d\s\-\(\)]{7,})/);

  return {
    personal: {
      fullName: nameMatch?.[1] || "",
      professionalTitle: "",
      email: emailMatch?.[0] || "",
      phone: phoneMatch?.[0] || "",
      address: "",
      city: "",
      state: "",
      country: "",
      location: "",
      portfolio: "",
      linkedin: "",
      github: "",
    },
    summary: "",
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
      tools: [],
      frameworks: [],
      languages: [],
      databases: [],
      cloud: [],
    },
    projects: [],
    certifications: [],
    awards: [],
    publications: [],
    volunteer: [],
    interests: [],
    references: [],
  };
}
