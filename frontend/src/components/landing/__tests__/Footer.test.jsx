import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

describe('Footer', () => {
  it('renders brand and newsletter form', () => {
    render(<Footer />)

    expect(screen.getByRole('link', { name: 'Pathfinder AI' })).toBeInTheDocument()
    expect(screen.getByRole('form', { name: 'Newsletter signup' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument()
  })
})
