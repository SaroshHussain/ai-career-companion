import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiEye, HiEyeSlash } from 'react-icons/hi2'
import { FcGoogle } from 'react-icons/fc'
import { FaLinkedinIn } from 'react-icons/fa6'
import { MdArrowForward } from 'react-icons/md'

import Input from '../components/ui/Input'
import Button from '../components/ui/Button'

function SignUp() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center px-margin-mobile py-3xl md:px-gutter">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block text-headline-md font-bold text-primary">
              Pathfinder AI
            </Link>
            <h1 className="mt-6 text-headline-lg text-on-surface">Create your account</h1>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Start your journey to a better career today.
            </p>
            <p className="mt-3 text-body-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link to="/login" className="font-label-md text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </div>

          <div className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-xl shadow-card">
            <div className="flex flex-col gap-3">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-body-sm text-on-surface transition hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <FcGoogle className="text-xl" />
                Sign up with Google
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-body-sm text-on-surface transition hover:bg-surface-container-low focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <FaLinkedinIn className="text-xl text-[#0A66C2]" />
                Sign up with LinkedIn
              </button>
            </div>

            <div className="my-6 flex items-center gap-3">
              <span className="flex-1 border-t border-outline-variant/30" />
              <span className="text-label-sm text-on-surface-variant">OR CONTINUE WITH EMAIL</span>
              <span className="flex-1 border-t border-outline-variant/30" />
            </div>

            <form className="flex flex-col gap-5" noValidate onSubmit={handleSubmit}>
              <Input
                label="Full Name"
                id="name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
              />
              <Input
                label="Email Address"
                id="email"
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
              />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-label-md font-label-md text-on-surface">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 pr-10 text-body-md text-on-surface outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
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
                <p className="text-body-sm text-on-surface-variant">
                  Must be at least 12 characters with a mix of letters and symbols.
                </p>
              </div>

              <label className="flex cursor-pointer items-start gap-2.5 text-body-sm text-on-surface">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                I agree to the{' '}
                <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </label>

              <Button type="submit" className="w-full" iconRight={<MdArrowForward />}>
                Create Your Account
              </Button>
            </form>
          </div>
        </div>
      </div>

      <footer className="border-t border-outline-variant/30 py-4">
        <div className="mx-auto flex max-w-container-max flex-col items-center justify-between gap-2 px-margin-mobile text-body-sm text-on-surface-variant md:flex-row md:px-gutter">
          <p>&copy; 2024 Pathfinder AI</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary">Support</a>
            <a href="#" className="hover:text-primary">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SignUp
