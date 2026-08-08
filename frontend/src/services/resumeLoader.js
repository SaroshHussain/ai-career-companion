import { defaultResume } from "../data/defaultResume";

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function withIds(items, prefix) {
  return ensureArray(items).map((item, index) => ({
    id: item?.id || `${prefix}-${Date.now()}-${index}`,
    ...item,
  }));
}

const DEFAULT_ENTRIES = {
  education: {
    institution: "",
    degree: "",
    fieldOfStudy: "",
    location: "",
    startDate: "",
    endDate: "",
    grade: "",
    description: "",
  },
  experience: {
    jobTitle: "",
    company: "",
    employmentType: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyWorking: false,
    description: "",
    achievements: "",
    technologiesUsed: [],
  },
  projects: {
    name: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
    technologies: [],
    githubLink: "",
    liveLink: "",
  },
  certifications: {
    name: "",
    issuer: "",
    date: "",
    credentialId: "",
    url: "",
  },
  awards: {
    title: "",
    issuer: "",
    date: "",
    description: "",
  },
  publications: {
    title: "",
    publisher: "",
    date: "",
    url: "",
    description: "",
  },
  volunteer: {
    role: "",
    organization: "",
    location: "",
    startDate: "",
    endDate: "",
    currentlyActive: false,
    description: "",
  },
  references: {
    name: "",
    jobTitle: "",
    company: "",
    email: "",
    phone: "",
  },
};

function normalizeList(items, entryType, prefix) {
  return withIds(items, prefix).map((item) => ({
    ...DEFAULT_ENTRIES[entryType],
    ...item,
  }));
}

function normalizeSkills(skills = {}) {
  return {
    technical: ensureArray(skills.technical),
    soft: ensureArray(skills.soft),
    tools: ensureArray(skills.tools),
    frameworks: ensureArray(skills.frameworks),
    languages: ensureArray(skills.languages),
    databases: ensureArray(skills.databases),
    cloud: ensureArray(skills.cloud),
    certifications: ensureArray(skills.certifications),
  };
}

export function normalizeParsedResume(parsedData = {}) {
  const parsed = parsedData || {};
  const personal = {
    ...defaultResume.personal,
    ...(parsed.personal || {}),
    professionalSummary:
      parsed.personal?.professionalSummary ||
      parsed.summary ||
      defaultResume.personal.professionalSummary,
  };

  return {
    ...defaultResume,
    ...parsed,
    personal,
    summary: parsed.summary || defaultResume.summary,
    education: normalizeList(parsed.education, "education", "edu"),
    experience: normalizeList(parsed.experience, "experience", "exp"),
    projects: normalizeList(parsed.projects, "projects", "proj"),
    certifications: normalizeList(
      parsed.certifications,
      "certifications",
      "cert",
    ),
    awards: normalizeList(parsed.awards, "awards", "award"),
    publications: normalizeList(parsed.publications, "publications", "pub"),
    volunteer: normalizeList(parsed.volunteer, "volunteer", "vol"),
    references: normalizeList(parsed.references, "references", "ref"),
    interests: ensureArray(parsed.interests),
    skills: normalizeSkills(parsed.skills),
  };
}
