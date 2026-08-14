import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../Navbar'

describe('Navbar', () => {
  it('renders brand and navigation links', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    )

    expect(screen.getByText(/Pathfinder AI/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Get Started/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Open navigation menu|Close navigation menu/i })).toBeInTheDocument()
  })
})
