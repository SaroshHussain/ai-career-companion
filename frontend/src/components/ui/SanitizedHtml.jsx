import DOMPurify from 'dompurify'

// Renders an HTML string produced by a third-party source (e.g. the
// Jooble API) with all unsafe markup stripped. This is the only place
// dangerouslySetInnerHTML is used — never render untrusted HTML directly.
function SanitizedHtml({ html, className = '' }) {
  const clean = DOMPurify.sanitize(html)
  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
}

export default SanitizedHtml
