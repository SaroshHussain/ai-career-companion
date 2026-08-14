import { render, screen } from '@testing-library/react'
import Footer from '../Footer'

describe('Footer', () => {
  it('renders brand and newsletter form', () => {
    render(<Footer />)

    expect(screen.getByText(/Pathfinder AI/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Newsletter signup/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Email address/i)).toBeInTheDocument()
  })
})
