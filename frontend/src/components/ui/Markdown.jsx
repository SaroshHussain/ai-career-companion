import ReactMarkdown from 'react-markdown'

// Renders assistant responses as clean markdown. Note: `react-markdown`
// escapes raw HTML by default (no `dangerouslySetInnerHTML`), so model
// output is safe to render.
function Markdown({ children, className = '' }) {
  return (
    <div className={`space-y-2 text-body-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        components={{
          p: ({ children: pChildren }) => <p className="leading-relaxed">{pChildren}</p>,
          ul: ({ children: ulChildren }) => (
            <ul className="list-disc space-y-1 pl-5">{ulChildren}</ul>
          ),
          ol: ({ children: olChildren }) => (
            <ol className="list-decimal space-y-1 pl-5">{olChildren}</ol>
          ),
          li: ({ children: liChildren }) => <li className="leading-relaxed">{liChildren}</li>,
          h1: ({ children: hChildren }) => (
            <h1 className="pt-2 text-body-lg font-semibold">{hChildren}</h1>
          ),
          h2: ({ children: hChildren }) => (
            <h2 className="pt-2 text-body-md font-semibold">{hChildren}</h2>
          ),
          h3: ({ children: hChildren }) => (
            <h3 className="pt-2 text-body-md font-semibold">{hChildren}</h3>
          ),
          strong: ({ children: strongChildren }) => (
            <strong className="font-semibold">{strongChildren}</strong>
          ),
          code: ({ children: codeChildren }) => (
            <code className="rounded bg-surface-container-low px-1 py-0.5 text-label-sm">
              {codeChildren}
            </code>
          ),
          pre: ({ children: preChildren }) => (
            <pre className="overflow-x-auto rounded-lg bg-surface-container-low p-3 text-label-sm">
              {preChildren}
            </pre>
          ),
          blockquote: ({ children: quoteChildren }) => (
            <blockquote className="border-l-2 border-primary/40 pl-3 text-on-surface-variant">
              {quoteChildren}
            </blockquote>
          ),
          a: ({ children: linkChildren, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline">
              {linkChildren}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}

export default Markdown
