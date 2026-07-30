import { Document, Page, View, Text, StyleSheet, Link } from '@react-pdf/renderer'

const C = {
  text: '#1a1a2e',
  secondary: '#64748b',
  primary: '#004ac6',
  divider: '#e2e8f0',
  chipBg: '#f1f5f9',
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    color: C.text,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    color: C.primary,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    fontSize: 9,
    color: C.secondary,
    marginBottom: 2,
  },
  contactSep: {
    color: C.divider,
    marginHorizontal: 2,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
    marginVertical: 10,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: C.secondary,
    marginBottom: 8,
  },
  subsectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: C.secondary,
    marginBottom: 4,
    marginTop: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  entryTitle: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  entrySubtitle: {
    fontSize: 10,
    color: C.primary,
    marginBottom: 1,
  },
  entryDate: {
    fontSize: 9,
    color: C.secondary,
    whiteSpace: 'nowrap',
  },
  entry: {
    marginBottom: 8,
  },
  bulletBlock: {
    marginTop: 2,
  },
  bullet: {
    fontSize: 9,
    color: C.secondary,
    marginBottom: 1,
    paddingLeft: 6,
  },
  descBlock: {
    marginTop: 1,
  },
  textBody: {
    fontSize: 9,
    color: C.secondary,
    marginBottom: 1,
    lineHeight: 1.6,
  },
  summaryText: {
    fontSize: 10,
    color: C.text,
    lineHeight: 1.6,
  },
  skillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  chip: {
    fontSize: 9,
    color: C.text,
    backgroundColor: C.chipBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 2,
  },
  linkText: {
    fontSize: 9,
    color: C.primary,
    textDecoration: 'none',
  },
})

function formatDate(value) {
  if (!value) return ''
  const [year, month] = value.split('-')
  if (!year) return value
  const date = new Date(Number(year), Number(month) - 1)
  if (isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

function formatText(text) {
  if (!text) return []
  const lines = text.split('\n').filter(Boolean)
  if (lines.length <= 1) {
    const sentences = text.match(/[^.!?\n]+[.!?]+/g)
    if (sentences && sentences.length > 1) {
      return sentences.map((s) => s.trim()).filter(Boolean)
    }
    return [text.trim()]
  }
  return lines.map((l) => l.trim()).filter(Boolean)
}

function BulletBlock({ text }) {
  const items = formatText(text)
  if (items.length === 0) return null
  return (
    <View style={styles.bulletBlock}>
      {items.map((line, i) => (
        <Text key={i} style={styles.bullet}>
          {line && (line.startsWith('-') || line.startsWith('•')) ? line : `• ${line || ''}`}
        </Text>
      ))}
    </View>
  )
}

function HeaderBlock({ personal }) {
  const contactItems = []
  if (personal.email) contactItems.push(personal.email)
  if (personal.phone) contactItems.push(personal.phone)
  if (personal.location) contactItems.push(personal.location)
  if (personal.portfolio) contactItems.push(personal.portfolio)
  if (personal.linkedin) contactItems.push(personal.linkedin)
  if (personal.github) contactItems.push(personal.github)

  const hasContact = contactItems.length > 0

  return (
    <View>
      {personal.fullName ? (
        <Text style={styles.name}>{personal.fullName}</Text>
      ) : null}
      {personal.professionalTitle ? (
        <Text style={styles.title}>{personal.professionalTitle}</Text>
      ) : null}
      {hasContact ? (
        <View style={styles.contactRow}>
          {contactItems.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
              {i > 0 ? <Text style={styles.contactSep}>|</Text> : null}
              <Text>{item || ''}</Text>
            </View>
          ))}
        </View>
      ) : null}
      {(personal.fullName || personal.professionalTitle || hasContact) ? (
        <View style={styles.divider} />
      ) : null}
    </View>
  )
}

function SummaryBlock({ summary }) {
  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.sectionTitle}>Professional Summary</Text>
      <Text style={styles.summaryText}>{summary || ''}</Text>
    </View>
  )
}

function ExperienceBlock({ experience }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Experience</Text>
      {(experience || []).map((exp) => (
        <View key={exp.id} style={styles.entry} wrap={false}>
          <View style={styles.entryHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.entryTitle}>{exp.jobTitle || ''}</Text>
              {exp.company ? <Text style={styles.entrySubtitle}>{exp.company || ''}</Text> : null}
            </View>
            {(exp.startDate || exp.endDate || exp.currentlyWorking) ? (
              <Text style={styles.entryDate}>
                {exp.startDate ? formatDate(exp.startDate) : ''}
                {(exp.startDate || exp.endDate) ? ' – ' : ''}
                {exp.currentlyWorking ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}
              </Text>
            ) : null}
          </View>
          {exp.description ? <BulletBlock text={exp.description} /> : null}
          {exp.achievements ? <BulletBlock text={exp.achievements} /> : null}
        </View>
      ))}
    </View>
  )
}

function ProjectsBlock({ projects }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Projects</Text>
      {(projects || []).map((proj) => (
        <View key={proj.id} style={styles.entry} wrap={false}>
          <View style={styles.entryHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.entryTitle}>{proj.name || ''}</Text>
              {proj.role ? <Text style={styles.entrySubtitle}>{proj.role || ''}</Text> : null}
            </View>
            {(proj.startDate || proj.endDate) ? (
              <Text style={styles.entryDate}>
                {proj.startDate ? formatDate(proj.startDate) : ''}
                {(proj.startDate || proj.endDate) ? ' – ' : ''}
                {proj.endDate ? formatDate(proj.endDate) : 'Present'}
              </Text>
            ) : null}
          </View>
          {proj.description ? <BulletBlock text={proj.description} /> : null}
          {(proj.technologies && proj.technologies.length > 0) ? (
            <View style={[styles.skillRow, { marginTop: 3 }]}>
              {proj.technologies.map((tech, i) => (
                <Text key={i} style={styles.chip}>{tech || ''}</Text>
              ))}
            </View>
          ) : null}
        </View>
      ))}
    </View>
  )
}

function EducationBlock({ education }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      {(education || []).map((edu) => (
        <View key={edu.id} style={styles.entry} wrap={false}>
          <View style={styles.entryHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.entryTitle}>{edu.institution || ''}</Text>
              <Text style={[styles.entrySubtitle, { color: C.secondary }]}>
                {edu.degree || ''}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy || ''}` : ''}
              </Text>
            </View>
            {(edu.startDate || edu.endDate) ? (
              <Text style={styles.entryDate}>
                {edu.startDate ? formatDate(edu.startDate) : ''} – {edu.endDate ? formatDate(edu.endDate) : ''}
              </Text>
            ) : null}
          </View>
          {edu.description ? <BulletBlock text={edu.description} /> : null}
          {edu.grade ? (
            <Text style={[styles.bullet, { paddingLeft: 0, marginTop: 1 }]}>Grade: {edu.grade || ''}</Text>
          ) : null}
        </View>
      ))}
    </View>
  )
}

function SkillsBlock({ skills }) {
  const s = skills || {}
  const technical = s.technical || []
  const languages = s.languages || []
  const certs = s.certifications || []

  if (technical.length === 0 && languages.length === 0 && certs.length === 0) return null

  return (
    <View style={styles.section}>
      {technical.length > 0 && (
        <View style={{ marginBottom: 6 }}>
          <Text style={styles.sectionTitle}>Technical Skills</Text>
          <View style={styles.skillRow}>
            {technical.map((skill, i) => (
              <Text key={i} style={styles.chip}>{skill}</Text>
            ))}
          </View>
        </View>
      )}
      {languages.length > 0 && (
        <View style={{ marginBottom: 6 }}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.skillRow}>
            {languages.map((lang, i) => (
              <Text key={i} style={styles.chip}>{lang}</Text>
            ))}
          </View>
        </View>
      )}
      {certs.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <View style={styles.skillRow}>
            {certs.map((cert, i) => (
              <Text key={i} style={styles.chip}>{cert}</Text>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

function CertificationsBlock({ certifications }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Certifications</Text>
      {(certifications || []).map((cert) => (
        <View key={cert.id} style={styles.entry} wrap={false}>
          <Text style={styles.entryTitle}>{cert.name || ''}</Text>
          {(cert.issuer || cert.date) ? (
            <Text style={[styles.entryDate, { marginTop: 1 }]}>
              {cert.issuer || ''}{cert.issuer && cert.date ? ' — ' : ''}{cert.date ? formatDate(cert.date) : ''}
            </Text>
          ) : null}
          {cert.url ? (
            <Link src={cert.url || ''} style={[styles.linkText, { marginTop: 1 }]}>
              {cert.url || ''}
            </Link>
          ) : null}
        </View>
      ))}
    </View>
  )
}

export function ResumePDFDocument({ data }) {
  const safe = data || {}
  const personal = safe.personal || {}
  const education = safe.education || []
  const experience = safe.experience || []
  const projects = safe.projects || []
  const skills = safe.skills || {}
  const certifications = safe.certifications || []

  const hasHeader = !!(personal.fullName || personal.professionalTitle)
  const hasSummary = !!personal.professionalSummary
  const hasExperience = experience.length > 0
  const hasEducation = education.length > 0
  const hasProjects = projects.length > 0
  const hasSkills = !!(skills.technical && skills.technical.length) ||
    !!(skills.soft && skills.soft.length) ||
    !!(skills.languages && skills.languages.length) ||
    !!(skills.certifications && skills.certifications.length)
  const hasCertifications = certifications.length > 0

  const hasAnyContent = hasHeader || hasSummary || hasExperience ||
    hasEducation || hasProjects || hasSkills || hasCertifications

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {hasAnyContent ? (
          <View>
            {hasHeader ? <HeaderBlock personal={personal} /> : null}
            {hasSummary ? <SummaryBlock summary={personal.professionalSummary} /> : null}
            {hasExperience ? <ExperienceBlock experience={experience} /> : null}
            {hasProjects ? <ProjectsBlock projects={projects} /> : null}
            {hasEducation ? <EducationBlock education={education} /> : null}
            {hasSkills ? <SkillsBlock skills={skills} /> : null}
            {hasCertifications ? <CertificationsBlock certifications={certifications} /> : null}
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: C.secondary }}>Your resume is empty</Text>
            <Text style={{ fontSize: 9, color: C.secondary, marginTop: 4 }}>Start filling in your details to generate a PDF</Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
