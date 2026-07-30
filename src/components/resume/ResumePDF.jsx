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
          {line.startsWith('-') || line.startsWith('•') ? line : `• ${line}`}
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
  const hasName = personal.fullName || personal.professionalTitle

  if (!hasName) return null

  return (
    <View>
      {personal.fullName && (
        <Text style={styles.name}>{personal.fullName}</Text>
      )}
      {personal.professionalTitle && (
        <Text style={styles.title}>{personal.professionalTitle}</Text>
      )}
      {hasContact && (
        <View style={styles.contactRow}>
          {contactItems.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
              {i > 0 && <Text style={styles.contactSep}>|</Text>}
              <Text>{item}</Text>
            </View>
          ))}
        </View>
      )}
      {(hasName || hasContact) && <View style={styles.divider} />}
    </View>
  )
}

function SummaryBlock({ summary }) {
  if (!summary) return null
  return (
    <View style={styles.section} wrap={false}>
      <Text style={styles.sectionTitle}>Professional Summary</Text>
      <Text style={styles.summaryText}>{summary}</Text>
    </View>
  )
}

function ExperienceBlock({ experience }) {
  if (!experience || experience.length === 0) return null
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Experience</Text>
      {experience.map((exp) => (
        <View key={exp.id} style={styles.entry} wrap={false}>
          <View style={styles.entryHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.entryTitle}>{exp.jobTitle}</Text>
              {exp.company && <Text style={styles.entrySubtitle}>{exp.company}</Text>}
            </View>
            {(exp.startDate || exp.endDate || exp.currentlyWorking) && (
              <Text style={styles.entryDate}>
                {exp.startDate ? formatDate(exp.startDate) : ''}
                {(exp.startDate || exp.endDate) ? ' – ' : ''}
                {exp.currentlyWorking ? 'Present' : exp.endDate ? formatDate(exp.endDate) : ''}
              </Text>
            )}
          </View>
          {exp.description && <BulletBlock text={exp.description} />}
          {exp.achievements && <BulletBlock text={exp.achievements} />}
        </View>
      ))}
    </View>
  )
}

function ProjectsBlock({ projects }) {
  if (!projects || projects.length === 0) return null
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Projects</Text>
      {projects.map((proj) => (
        <View key={proj.id} style={styles.entry} wrap={false}>
          <View style={styles.entryHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.entryTitle}>{proj.name}</Text>
              {proj.role && <Text style={styles.entrySubtitle}>{proj.role}</Text>}
            </View>
            {(proj.startDate || proj.endDate) && (
              <Text style={styles.entryDate}>
                {proj.startDate ? formatDate(proj.startDate) : ''}
                {(proj.startDate || proj.endDate) ? ' – ' : ''}
                {proj.endDate ? formatDate(proj.endDate) : 'Present'}
              </Text>
            )}
          </View>
          {proj.description && <BulletBlock text={proj.description} />}
          {proj.technologies && proj.technologies.length > 0 && (
            <View style={[styles.skillRow, { marginTop: 3 }]}>
              {proj.technologies.map((tech, i) => (
                <Text key={i} style={styles.chip}>{tech}</Text>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  )
}

function EducationBlock({ education }) {
  if (!education || education.length === 0) return null
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Education</Text>
      {education.map((edu) => (
        <View key={edu.id} style={styles.entry} wrap={false}>
          <View style={styles.entryHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.entryTitle}>{edu.institution}</Text>
              <Text style={[styles.entrySubtitle, { color: C.secondary }]}>
                {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
              </Text>
            </View>
            {(edu.startDate || edu.endDate) && (
              <Text style={styles.entryDate}>
                {edu.startDate ? formatDate(edu.startDate) : ''} – {edu.endDate ? formatDate(edu.endDate) : ''}
              </Text>
            )}
          </View>
          {edu.description && <BulletBlock text={edu.description} />}
          {edu.grade && (
            <Text style={[styles.bullet, { paddingLeft: 0, marginTop: 1 }]}>Grade: {edu.grade}</Text>
          )}
        </View>
      ))}
    </View>
  )
}

function SkillsBlock({ skills }) {
  const hasTech = skills.technical && skills.technical.length > 0
  const hasLangs = skills.languages && skills.languages.length > 0
  const hasCerts = skills.certifications && skills.certifications.length > 0

  if (!hasTech && !hasLangs && !hasCerts) return null

  return (
    <View style={styles.section}>
      {hasTech && (
        <View style={{ marginBottom: 6 }}>
          <Text style={styles.sectionTitle}>Technical Skills</Text>
          <View style={styles.skillRow}>
            {skills.technical.map((skill, i) => (
              <Text key={i} style={styles.chip}>{skill}</Text>
            ))}
          </View>
        </View>
      )}
      {hasLangs && (
        <View style={{ marginBottom: 6 }}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.skillRow}>
            {skills.languages.map((lang, i) => (
              <Text key={i} style={styles.chip}>{lang}</Text>
            ))}
          </View>
        </View>
      )}
      {hasCerts && (
        <View>
          <Text style={styles.sectionTitle}>Certifications</Text>
          <View style={styles.skillRow}>
            {skills.certifications.map((cert, i) => (
              <Text key={i} style={styles.chip}>{cert}</Text>
            ))}
          </View>
        </View>
      )}
    </View>
  )
}

function CertificationsBlock({ certifications }) {
  if (!certifications || certifications.length === 0) return null
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Certifications</Text>
      {certifications.map((cert) => (
        <View key={cert.id} style={styles.entry} wrap={false}>
          <Text style={styles.entryTitle}>{cert.name}</Text>
          {(cert.issuer || cert.date) && (
            <Text style={[styles.entryDate, { marginTop: 1 }]}>
              {cert.issuer}{cert.issuer && cert.date ? ' — ' : ''}{cert.date ? formatDate(cert.date) : ''}
            </Text>
          )}
          {cert.url && (
            <Link src={cert.url} style={[styles.linkText, { marginTop: 1 }]}>
              {cert.url}
            </Link>
          )}
        </View>
      ))}
    </View>
  )
}

export function ResumePDFDocument({ data }) {
  const { personal, education, experience, projects, skills, certifications } = data

  const hasAnyContent =
    personal.fullName ||
    personal.professionalTitle ||
    personal.professionalSummary ||
    (experience && experience.length > 0) ||
    (education && education.length > 0) ||
    (projects && projects.length > 0) ||
    (skills.technical && skills.technical.length > 0) ||
    (skills.soft && skills.soft.length > 0) ||
    (skills.languages && skills.languages.length > 0) ||
    (skills.certifications && skills.certifications.length > 0) ||
    (certifications && certifications.length > 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {!hasAnyContent ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: C.secondary }}>Your resume is empty</Text>
            <Text style={{ fontSize: 9, color: C.secondary, marginTop: 4 }}>Start filling in your details to generate a PDF</Text>
          </View>
        ) : (
          <>
            <HeaderBlock personal={personal} />
            <SummaryBlock summary={personal.professionalSummary} />
            <ExperienceBlock experience={experience} />
            <ProjectsBlock projects={projects} />
            <EducationBlock education={education} />
            <SkillsBlock skills={skills} />
            <CertificationsBlock certifications={certifications} />
          </>
        )}
      </Page>
    </Document>
  )
}
