import { useRef, useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import { HiOutlineArrowLeft, HiOutlineArrowRight, HiOutlineArrowDownTray, HiOutlineCheck } from 'react-icons/hi2'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import ResumeStepper from '../components/resume/ResumeStepper'
import PersonalForm from '../components/resume/PersonalForm'
import EducationForm from '../components/resume/EducationForm'
import ExperienceForm from '../components/resume/ExperienceForm'
import SkillsForm from '../components/resume/SkillsForm'
import ProjectsForm from '../components/resume/ProjectsForm'
import PreviewPage from '../components/resume/PreviewPage'
import ResumePreview from '../components/resume/ResumePreview'
import UploadedResumePreview from '../components/resume/UploadedResumePreview'
import ZoomControls from '../components/resume/ZoomControls'
import { useResume } from '../context/ResumeContext'

const TOTAL_STEPS = 6

const stepLabels = [
  'Personal Information',
  'Education',
  'Experience',
  'Skills',
  'Projects',
  'Preview',
]

const A4_WIDTH = 595
const A4_HEIGHT = 842

function ResumeEditor() {
  const location = useLocation()
  const mode = location.state?.mode || 'new'

  const {
    resumeData,
    uploadedFile,
    updatePersonal,
    addEducation,
    updateEducation,
    removeEducation,
    addExperience,
    updateExperience,
    removeExperience,
    addProject,
    updateProject,
    removeProject,
    addProjectTechnology,
    removeProjectTechnology,
    addSkillItem,
    removeSkillItem,
    updateSkillItem,
  } = useResume()

  const [currentStep, setCurrentStep] = useState(1)
  const [zoom, setZoom] = useState(0.85)
  const previewRef = useRef(null)
  const containerRef = useRef(null)

  const handlePrint = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${resumeData.personal.fullName || 'Resume'}.pdf`,
  })

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 32
      const fitZoom = containerWidth / A4_WIDTH
      setZoom(Math.min(fitZoom, 1))
    }
  }, [])

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.1, 2))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.1, 0.3))
  }, [])

  const handleFitWidth = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 32
      setZoom(containerWidth / A4_WIDTH)
    }
  }, [])

  const handleFitPage = useCallback(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 32
      const containerHeight = containerRef.current.clientHeight - 80
      const widthZoom = containerWidth / A4_WIDTH
      const heightZoom = containerHeight / A4_HEIGHT
      setZoom(Math.min(widthZoom, heightZoom, 1))
    }
  }, [])

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1)
  }

  const handleStepClick = (step) => {
    if (step < currentStep) setCurrentStep(step)
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalForm data={resumeData.personal} onUpdate={updatePersonal} />
      case 2:
        return (
          <EducationForm
            education={resumeData.education}
            onAdd={addEducation}
            onUpdate={updateEducation}
            onRemove={removeEducation}
          />
        )
      case 3:
        return (
          <ExperienceForm
            experience={resumeData.experience}
            onAdd={addExperience}
            onUpdate={updateExperience}
            onRemove={removeExperience}
          />
        )
      case 4:
        return (
          <SkillsForm
            skills={resumeData.skills}
            onAdd={addSkillItem}
            onRemove={removeSkillItem}
            onEdit={updateSkillItem}
          />
        )
      case 5:
        return (
          <ProjectsForm
            projects={resumeData.projects}
            onAdd={addProject}
            onUpdate={updateProject}
            onRemove={removeProject}
            onAddTech={addProjectTechnology}
            onRemoveTech={removeProjectTechnology}
          />
        )
      case 6:
        return <PreviewPage data={resumeData} />
      default:
        return null
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-headline-lg text-on-surface">Build Your Resume</h1>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              Step {currentStep} of {TOTAL_STEPS}: {stepLabels[currentStep - 1]}
            </p>
          </div>
          {currentStep === TOTAL_STEPS && (
            <button
              type="button"
              onClick={() => handlePrint()}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-sm font-medium text-white transition hover:bg-primary/90"
            >
              <HiOutlineArrowDownTray className="text-lg" aria-hidden />
              Download PDF
            </button>
          )}
        </div>

        {/* Stepper */}
        <ResumeStepper currentStep={currentStep} onStepClick={handleStepClick} />

        {/* Two-column layout: form left, preview right */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Left column - form */}
          <div className="lg:col-span-3">
            <div className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-4 shadow-card sm:p-6">
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="mt-8 flex items-center justify-between border-t border-outline-variant/30 pt-6">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className="inline-flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-label-sm font-medium text-on-surface transition hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <HiOutlineArrowLeft className="text-base" aria-hidden />
                  Previous
                </button>

                {currentStep < TOTAL_STEPS ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-sm font-medium text-white transition hover:bg-primary/90"
                  >
                    Next
                    <HiOutlineArrowRight className="text-base" aria-hidden />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePrint()}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-label-sm font-medium text-white transition hover:bg-primary/90"
                  >
                    <HiOutlineCheck className="text-base" aria-hidden />
                    Download PDF
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right column - preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-6 flex flex-col gap-4">
              {/* Zoom controls */}
              <div className="flex items-center justify-between">
                <span className="text-label-sm font-medium text-on-surface-variant">Preview</span>
                <ZoomControls
                  zoom={zoom}
                  onZoomIn={handleZoomIn}
                  onZoomOut={handleZoomOut}
                  onFitWidth={handleFitWidth}
                  onFitPage={handleFitPage}
                />
              </div>

              {/* Uploaded resume reference */}
              {uploadedFile && (
                <UploadedResumePreview file={uploadedFile} />
              )}

              {/* Live editable preview - A4 document */}
              <div ref={containerRef} className="overflow-auto rounded-lg bg-surface-container-low">
                <div
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: 'top center',
                    width: A4_WIDTH,
                    margin: '0 auto',
                  }}
                >
                  <div className="shadow-[0_2px_16px_rgba(0,0,0,0.12)]">
                    <div className="min-h-[842px] w-[595px] bg-white">
                      <ResumePreview ref={previewRef} data={resumeData} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ResumeEditor
