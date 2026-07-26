import { HiSparkles } from 'react-icons/hi2'
import { MdArrowForward, MdPlayCircle } from 'react-icons/md'

import Button from '../ui/Button'

function Hero() {
  return (
    <section className="relative mx-auto max-w-container-max overflow-hidden px-margin-mobile py-3xl md:px-gutter">
      <div className="grid grid-cols-1 items-center gap-2xl lg:grid-cols-2">
        <div className="z-10 text-center lg:text-left">
          <div className="mb-lg inline-flex items-center gap-2 rounded-full border border-secondary-container/20 bg-secondary-container/10 px-3 py-1 text-secondary">
            <HiSparkles className="text-[18px]" aria-hidden />
            <span className="text-label-sm uppercase tracking-wider">AI-Powered Career Transformation</span>
          </div>

          <h1 className="mb-lg text-display leading-tight text-on-surface">
            Your AI Career Companion for <span className="text-primary">Landing Your Dream Job</span>
          </h1>

          <p className="mb-xl mx-auto max-w-xl text-body-lg text-on-surface-variant lg:mx-0">
            From resume optimization to hyper-realistic interview coaching, we manage every stage of your career journey with precision AI.
          </p>

          <div className="flex flex-col justify-center gap-md sm:flex-row lg:justify-start">
            <Button as="a" href="#features" iconRight={<MdArrowForward />}>
              Get Started Free
            </Button>
            <Button as="a" href="#solutions" variant="secondary" iconLeft={<MdPlayCircle />}>
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="relative min-h-[400px] lg:min-h-[500px]">
          <div className="absolute inset-0 rotate-3 scale-105 rounded-[2rem] bg-primary/5" />
          <div className="absolute inset-0 rounded-[2rem] border border-outline-variant/30 bg-white/40 shadow-2xl backdrop-blur-sm">
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                className="h-auto w-[85%] rounded-md border border-white/50 shadow-2xl"
                alt="A clean, minimalist 3D isometric illustration of a professional workspace with a holographic AI interface floating above a sleek laptop."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn35vxVxT9xHy-imx78azDxPn5GJYJBqFXCS7_NZ-G2lYvKPWnywgW2wrr03YDu7QYMDz2c8suCuj5gwGf_hMBg2k-XbVGw-DaVJIbLNcFLCtOKYJu7cyy4vwiLuYlGkqbomVDTt1XJJ97Gpto1Wq1m75VtWv2LBICx_ZhM4noai3iViIVTeY3qLd2pgS3J0xUWYg_5Ufrt3bVUABJBOaa5YwX5m95qCU9owcurjxN7JZdepPDDO8eMGYa3rZ2kcDmrd8KR2ujh1c"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
