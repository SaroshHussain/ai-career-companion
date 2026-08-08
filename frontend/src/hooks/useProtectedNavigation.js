import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export default function useProtectedNavigation() {
  const navigate = useNavigate()

  const handleProtectedNavigation = useCallback(() => {
    navigate('/login')
  }, [navigate])

  return handleProtectedNavigation
}
