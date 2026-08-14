import { render, screen } from '@testing-library/react'
import Hero from '../Hero'

describe('Hero', () => {
  it('renders headline and buttons', () => {
    render(<Hero />)

    expect(screen.getByText(/Your AI Career Companion/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Get Started Free/i })).toBeInTheDocument()
  })
})
