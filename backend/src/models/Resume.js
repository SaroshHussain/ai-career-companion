// Resume model.
// Persists a user's parsed/edited resume as a single document so it can be
// reopened by id. The `data` field stores the full canonical resume shape the
// frontend editor uses (personal, experience, education, skills, etc.) and the
// backend AI parser produces. Every resume belongs to a user (from the JWT),
// so list/get operations are scoped per account.
//
// The schema mirrors the fixed structure returned by resumeParser.js so the
// exact parsed fields are persisted with their correct types instead of as an
// untyped Mixed blob.

import mongoose from 'mongoose'

// Personal / contact details (summary lives here as professionalSummary).
const personalSchema = new mongoose.Schema(
  {
    fullName: { type: String, default: '' },
    professionalTitle: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    location: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    professionalSummary: { type: String, default: '' },
  },
  { _id: false },
)

// Shared helper for list-entry schemas: each entry carries a client-side `id`
// (used by the editor for React keys and updates) plus its own fields.
function entrySchema(fields) {
  return new mongoose.Schema(
    { id: { type: String, default: undefined }, ...fields },
    { _id: false },
  )
}

const experienceSchema = entrySchema({
  jobTitle: { type: String, default: '' },
  company: { type: String, default: '' },
  employmentType: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  currentlyWorking: { type: Boolean, default: false },
  description: { type: String, default: '' },
  achievements: { type: String, default: '' },
  technologiesUsed: [{ type: String }],
})

const educationSchema = entrySchema({
  institution: { type: String, default: '' },
  degree: { type: String, default: '' },
  fieldOfStudy: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  grade: { type: String, default: '' },
  description: { type: String, default: '' },
})

const projectSchema = entrySchema({
  name: { type: String, default: '' },
  role: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  description: { type: String, default: '' },
  technologies: [{ type: String }],
  githubLink: { type: String, default: '' },
  liveLink: { type: String, default: '' },
})

const certificationSchema = entrySchema({
  name: { type: String, default: '' },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  credentialId: { type: String, default: '' },
  url: { type: String, default: '' },
})

const awardSchema = entrySchema({
  title: { type: String, default: '' },
  issuer: { type: String, default: '' },
  date: { type: String, default: '' },
  description: { type: String, default: '' },
})

const publicationSchema = entrySchema({
  title: { type: String, default: '' },
  publisher: { type: String, default: '' },
  date: { type: String, default: '' },
  url: { type: String, default: '' },
  description: { type: String, default: '' },
})

const volunteerSchema = entrySchema({
  role: { type: String, default: '' },
  organization: { type: String, default: '' },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  currentlyActive: { type: Boolean, default: false },
  description: { type: String, default: '' },
})

const referenceSchema = entrySchema({
  name: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
  company: { type: String, default: '' },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
})

// Skills grouped by category (certifications included, matches editor shape).
const skillsSchema = new mongoose.Schema(
  {
    technical: [{ type: String }],
    soft: [{ type: String }],
    tools: [{ type: String }],
    frameworks: [{ type: String }],
    languages: [{ type: String }],
    databases: [{ type: String }],
    cloud: [{ type: String }],
    certifications: [{ type: String }],
  },
  { _id: false },
)

// The canonical resume document shape shared by parser, editor, and storage.
const dataSchema = new mongoose.Schema(
  {
    personal: { type: personalSchema, default: () => ({}) },
    experience: { type: [experienceSchema], default: [] },
    education: { type: [educationSchema], default: [] },
    skills: { type: skillsSchema, default: () => ({}) },
    projects: { type: [projectSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },
    awards: { type: [awardSchema], default: [] },
    publications: { type: [publicationSchema], default: [] },
    volunteer: { type: [volunteerSchema], default: [] },
    interests: [{ type: String }],
    references: { type: [referenceSchema], default: [] },
  },
  { _id: false },
)

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // A short human-friendly label (defaults to the original file name).
    name: {
      type: String,
      trim: true,
      default: 'Untitled Resume',
    },
    // The full resume document in the canonical editor/parser shape.
    data: {
      type: dataSchema,
      default: () => ({}),
    },
    // Original uploaded file metadata (when created from an upload).
    // Stored as Mixed because it contains a key literally named "type"
    // (the MIME type), which would clash with Mongoose's type keyword.
    fileInfo: {
      type: mongoose.Schema.Types.Mixed,
      default: undefined,
    },
  },
  {
    timestamps: true,
  },
)

const Resume = mongoose.model('Resume', resumeSchema)

export default Resume
