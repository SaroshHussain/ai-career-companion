import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

const C = {
  text: '#1a1a2e',
  secondary: '#64748b',
  primary: '#004ac6',
  divider: '#e2e8f0',
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.6,
    color: C.text,
  },
  header: {
    marginBottom: 24,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  title: {
    fontSize: 12,
    color: C.primary,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    fontSize: 9,
    color: C.secondary,
  },
  contactSep: {
    color: C.divider,
    marginHorizontal: 2,
  },
  date: {
    fontSize: 10,
    color: C.secondary,
    marginBottom: 16,
  },
  recipient: {
    marginBottom: 16,
  },
  recipientLine: {
    fontSize: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
    marginVertical: 16,
  },
  body: {
    fontSize: 11,
    lineHeight: 1.7,
  },
  paragraph: {
    marginBottom: 10,
  },
  signature: {
    marginTop: 8,
    fontSize: 11,
  },
})

function CoverLetterPDFDocument({ letter, resumeData }) {
  const personal = resumeData?.personal || {}
  const contact = [
    personal.email,
    personal.phone,
    personal.location || personal.city,
  ]
    .filter(Boolean)
    .join('  |  ')

  const today = new Date().toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  // The letter comes back from the model as paragraphs separated by
  // blank lines. Normalize newlines and split them into paragraphs.
  const paragraphs = (letter || '')
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(Boolean)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{personal.fullName || 'Applicant'}</Text>
          <Text style={styles.title}>{personal.professionalTitle || ''}</Text>
          {contact ? <Text style={styles.contactRow}>{contact}</Text> : null}
        </View>

        <Text style={styles.date}>{today}</Text>

        <View style={styles.body}>
          {paragraphs.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </View>

        <View style={styles.divider} />

        <Text style={styles.signature}>Warm regards,</Text>
        <Text style={[styles.signature, { fontWeight: 'bold' }]}>
          {personal.fullName || 'Applicant'}
        </Text>
      </Page>
    </Document>
  )
}

export default CoverLetterPDFDocument
