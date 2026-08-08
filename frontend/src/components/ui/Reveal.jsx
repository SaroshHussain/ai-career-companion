import useScrollReveal from '../../hooks/useScrollReveal'

function Reveal({ as: Component = 'div', className = '', delay = 0, children }) {
  const [ref, isVisible] = useScrollReveal()

  return (
    <Component
      ref={ref}
      className={`${className} transform-gpu transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Component>
  )
}

export default Reveal