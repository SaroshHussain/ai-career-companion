import { HiCheck } from 'react-icons/hi2'

const steps = ['Personal', 'Education', 'Experience', 'Skills', 'Projects', 'Preview']

function ResumeStepper({ currentStep, onStepClick }) {
  return (
    <nav aria-label="Resume builder steps" className="w-full">
      <ol className="flex items-center justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1
          const isCompleted = currentStep > stepNumber
          const isCurrent = currentStep === stepNumber
          const isClickable = stepNumber < currentStep

          return (
            <li key={label} className="flex flex-1 items-center">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(stepNumber)}
                disabled={!isClickable}
                className={`flex items-center gap-2 text-label-sm font-medium transition-colors ${
                  isClickable ? 'cursor-pointer' : 'cursor-default'
                } ${
                  isCurrent
                    ? 'text-primary'
                    : isCompleted
                      ? 'text-green-600'
                      : 'text-on-surface-variant'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors ${
                    isCurrent
                      ? 'border-primary bg-primary text-white'
                      : isCompleted
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant'
                  }`}
                >
                  {isCompleted ? <HiCheck className="text-sm" /> : stepNumber}
                </span>
                <span className="hidden sm:inline">{label}</span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-px flex-1 ${
                    isCompleted ? 'bg-green-500' : 'bg-outline-variant/50'
                  }`}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default ResumeStepper
