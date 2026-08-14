import { render, screen } from '@testing-library/react'
import Button from '../Button'
import { FaBeer } from 'react-icons/fa'

describe('Button', () => {
  it('renders as an anchor when `as="a"` is provided', () => {
    render(
      <Button as="a" href="#">
        Click me
      </Button>,
    )

    expect(screen.getByRole('link', { name: /Click me/i })).toBeInTheDocument()
  })

  it('renders left and right icons with aria-hidden', () => {
    render(
      <Button iconLeft={<FaBeer data-testid="left" />} iconRight={<FaBeer data-testid="right" />}>
        Label
      </Button>,
    )

    expect(screen.getByTestId('left')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByTestId('right')).toHaveAttribute('aria-hidden', 'true')
  })
})
