import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiEye, HiEyeSlash, HiOutlineArrowPath } from 'react-icons/hi2'
import { MdArrowForward } from 'react-icons/md'

import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useAuth } from '../hooks/useAuth'

function Login() {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const emailError = touched.email && !email.trim() ? 'Email is required.' : ''
  const passwordError = touched.password && !password ? 'Password is required.' : ''
  const fieldError = error &&
    (error.includes('email') || error.includes('password') || error.includes('Invalid'))
    && email.trim() && password

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setTouched({ email: true, password: true })

    if (!email.trim() || !password) return

    setLoading(true)

    const result = await login(email.trim(), password)
    setLoading(false)

    if (result.success) {
      navigate('/dashboard', { replace: true })
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-margin-mobile py-3xl md:px-gutter">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block text-headline-md font-bold text-primary">
              Pathfinder AI
            </Link>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Your personal mentor for career growth.
            </p>
          </div>

          <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-xl shadow-card">
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-body-sm text-red-700">
                {error}
              </div>
            )}

            <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>
              <Input
                label="Email Address"
                id="email"
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                value={email}
                error={emailError || (fieldError ? '' : '')}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                className={error ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30' : ''}
              />

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-label-md font-label-md text-on-surface">
                    Password
                  </label>
                  <a href="#" className="text-label-sm font-label-sm text-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                    className={`w-full rounded-lg border bg-surface-container-lowest px-3 py-2.5 pr-10 text-body-md text-on-surface outline-none transition focus:ring-1 ${
                      error
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-500/30'
                        : 'border-outline-variant focus:border-primary focus:ring-primary'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <HiEyeSlash className="text-xl" /> : <HiEye className="text-xl" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-body-sm text-red-600">{passwordError}</p>
                )}
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 text-body-sm text-on-surface">
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                Remember me for 30 days
              </label>

              <Button type="submit" className="w-full" disabled={loading} iconRight={loading ? <HiOutlineArrowPath className="animate-spin" /> : <MdArrowForward />}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </div>

          <p className="mt-6 text-center text-body-sm text-on-surface-variant">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-label-md text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <footer className="border-t border-outline-variant/30 py-4">
        <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-2 px-margin-mobile text-body-sm text-on-surface-variant md:flex-row md:px-gutter">
          <p>&copy; 2024 Pathfinder AI Career Companion</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary">
              Help Center
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Login
