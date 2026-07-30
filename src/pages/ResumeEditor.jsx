import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronDown, Plus, Sparkles, User, BookOpen, Briefcase,
  GraduationCap, Wrench, FolderGit2, Award, Trash2, ArrowLeft,
  Download, X, Loader2, Eye, Edit3, AlertTriangle, RotateCcw,
} from 'lucide-react'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import ResumePreview from '../components/resume/ResumePreview'
import ZoomControls from '../components/resume/ZoomControls'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { useResume } from '../context/ResumeContext'
import { generateResumePDF, downloadBlob, getPDFFilename } from '../services/pdfExport'
import { isResumeEmpty } from '../services/resumeValidation'
import { generateSummary as apiGenerateSummary } from '../services/api'

const A4_WIDTH = 595
const A4_HEIGHT = 842
const AUTO_SAVE_KEY = 'pathfinder-resume-editor'

function Section({ title, icon: Icon, defaultOpen, children, onAdd, aiBadge, actions }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-xl border border-outline-variant/20 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className={`sticky top-0 z-10 rounded-t-xl bg-white ${!open ? 'rounded-b-xl' : ''}`}>
        <div className="flex items-center justify-between px-4 py-2.5">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 text-left flex-1 min-w-0"
          >
            <Icon className="h-4 w-4 text-primary shrink-0" aria-hidden />
            <span className="text-label-sm font-semibold text-on-surface truncate">{title}</span>
            {aiBadge && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary shrink-0">
                <Sparkles className="h-3 w-3" />
                AI
              </span>
            )}
          </button>
          <div className="flex items-center gap-1 shrink-0">
            {onAdd && (
              <button
                type="button"
                onClick={onAdd}
                className="rounded-lg p-1.5 text-primary transition hover:bg-primary/5 active:scale-95"
                title={`Add ${title.toLowerCase()}`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
            {actions}
            <button
              type="button"
              onClick={() => setOpen(!open)}
              className="rounded-lg p-1.5 text-on-surface-variant transition hover:bg-surface-container-low active:scale-95"
              aria-label={open ? `Collapse ${title}` : `Expand ${title}`}
            >
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-200 ease-in-out ${open ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-outline-variant/10 px-4 pb-4 pt-3">{children}</div>
      </div>
    </div>
  )
}

function TagInput({ tags, onAdd, onRemove, placeholder }) {
  const [value, setValue] = useState('')
  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && value.trim()) {
      e.preventDefault()
      onAdd(value.trim())
      setValue('')
    }
  }
  return (
    <div className="flex flex-wrap gap-1.5 rounded-lg border border-outline-variant/30 bg-white px-2.5 py-1.5 transition focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
      {tags.map((tag, i) => (
        <span key={i} className="inline-flex items-center gap-1 rounded-md bg-primary/5 px-2 py-0.5 text-label-sm text-on-surface">
          {tag}
          <button type="button" onClick={() => onRemove(i)} className="text-on-surface-variant hover:text-on-surface" aria-label={`Remove ${tag}`}>
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'Type and press Enter'}
        className="min-w-[100px] flex-1 border-0 bg-transparent text-label-sm text-on-surface outline-none placeholder:text-on-surface-variant/40"
      />
    </div>
  )
}

function LoadingOverlay({ visible, exporting }) {
  if (!visible) return null
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-10 py-8 shadow-2xl">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-body-sm font-medium text-on-surface">
          {exporting ? 'Generating your PDF...' : 'Processing your resume...'}
        </p>
        <p className="text-label-sm text-on-surface-variant">
          {exporting ? 'Creating a professional print-ready document' : 'Extracting and analyzing content'}
        </p>
      </div>
    </div>
  )
}

function EmptySection({ label }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-outline-variant/20 py-6 text-center">
      <p className="text-label-sm text-on-surface-variant/50">{label}</p>
    </div>
  )
}

function ResumeEditor() {
  const navigate = useNavigate()
  const location = useLocation()
  const mode = location.pathname === '/dashboard/resume/new' ? 'new' : (location.state?.mode || 'edit')

  const {
    resumeData,
    updatePersonal,
    updateSummary,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    addSkillItem, removeSkillItem,
    addProject, updateProject, removeProject, addProjectTechnology, removeProjectTechnology,
    addCertification, updateCertification, removeCertification,
    loadResume,
    resetToNew,
  } = useResume()

  const [zoom, setZoom] = useState(0.7)
  const [toast, setToast] = useState(null)
  const [toastTitle, setToastTitle] = useState(null)
  const [toastType, setToastType] = useState('success')
  const [isProcessing, setIsProcessing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isSummaryGenerating, setIsSummaryGenerating] = useState(false)
  const [aiGeneratedFields] = useState(new Set())
  const [mobileView, setMobileView] = useState('editor')
  const containerRef = useRef(null)
  const saveTimer = useRef(null)

  const clearToast = useCallback(() => {
    setToast(null)
    setToastTitle(null)
  }, [])

  const showToast = (msg, type = 'success') => {
    setToastTitle(null)
    setToast(msg)
    setToastType(type)
    setTimeout(clearToast, 3000)
  }

  const showWarningToast = useCallback((title, message) => {
    setToastTitle(title)
    setToast(message)
    setToastType('error')
    setTimeout(clearToast, 5000)
  }, [clearToast])

  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleResetClick = useCallback(() => {
    if (isResumeEmpty(resumeData)) {
      showWarningToast('Resume is already empty', 'There is nothing to reset.')
      return
    }
    setShowResetConfirm(true)
  }, [resumeData])

  const handleReset = useCallback(() => {
    setShowResetConfirm(false)
    resetToNew()
    localStorage.removeItem(AUTO_SAVE_KEY)
    showToast('Resume has been reset')
  }, [resetToNew])

  const handleExportPDF = useCallback(async () => {
    if (isExporting) return
    if (mode === 'new' && isResumeEmpty(resumeData)) {
      showWarningToast('Resume is empty', 'Please fill in at least one field before downloading your resume.')
      return
    }
    setIsExporting(true)
    setIsProcessing(true)
    try {
      const blob = await generateResumePDF(resumeData)
      const filename = getPDFFilename(resumeData.personal)
      downloadBlob(blob, filename)
      showToast('PDF downloaded successfully')
    } catch (err) {
      console.error('PDF export failed:', err?.message || err, 'Data keys:', Object.keys(resumeData || {}))
      showToast('Failed to generate PDF. Please try again.', 'error')
    } finally {
      setIsExporting(false)
      setIsProcessing(false)
    }
  }, [resumeData, isExporting, mode])

  const handleZoomIn = useCallback(() => setZoom((p) => Math.min(p + 0.1, 2)), [])
  const handleZoomOut = useCallback(() => setZoom((p) => Math.max(p - 0.1, 0.3)), [])
  const handleFitWidth = useCallback(() => {
    if (containerRef.current) {
      const w = containerRef.current.clientWidth - 32
      setZoom(w / A4_WIDTH)
    }
  }, [])
  const handleFitPage = useCallback(() => {
    if (containerRef.current) {
      const w = containerRef.current.clientWidth - 32
      const h = containerRef.current.clientHeight - 80
      setZoom(Math.min(w / A4_WIDTH, h / A4_HEIGHT, 1))
    }
  }, [])

  useEffect(() => {
    if (mode === 'new') {
      resetToNew()
      localStorage.removeItem(AUTO_SAVE_KEY)
    }
  }, [mode, resetToNew])

  useEffect(() => {
    if (mode === 'edit' && loadResume) {
      const saved = localStorage.getItem(AUTO_SAVE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed && parsed.personal) loadResume(parsed)
        } catch { /* ignore */ }
      }
    }
  }, [])

  useEffect(() => {
    if (mode === 'new') return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(resumeData))
    }, 1000)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [resumeData, mode])

  const handleGenerateSummary = useCallback(async () => {
    const hasData =
      resumeData.experience?.length > 0 ||
      resumeData.education?.length > 0 ||
      (resumeData.skills?.technical?.length > 0) ||
      (resumeData.skills?.soft?.length > 0) ||
      resumeData.projects?.length > 0 ||
      resumeData.certifications?.length > 0 ||
      resumeData.personal?.professionalTitle

    if (!hasData) {
      showWarningToast('Not enough information', 'Please complete more resume sections before generating a professional summary.')
      return
    }

    if (isSummaryGenerating) return
    setIsSummaryGenerating(true)

    try {
      const result = await apiGenerateSummary(resumeData)
      if (result?.data?.summary) {
        updateSummary(result.data.summary)
        showToast('Professional summary generated successfully')
      }
    } catch (err) {
      console.error('Summary generation failed:', err?.message || err)
      showToast('Unable to generate summary. Please try again.', 'error')
    } finally {
      setIsSummaryGenerating(false)
    }
  }, [resumeData, isSummaryGenerating, updateSummary])

  const aiImproveBullet = () => showToast('AI bullet improvement coming soon')
  const setPersonal = (field) => (e) => updatePersonal(field, e.target.value)

  const renderField = (label, value, onChange, opts = {}) => {
    const isAiField = opts.aiField && aiGeneratedFields.has(opts.aiField)
    const inputClass = `w-full rounded-lg border bg-white px-2.5 py-1.5 text-body-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/15 ${
      isAiField
        ? 'border-primary/30 bg-primary/[0.02] ring-1 ring-primary/10'
        : 'border-outline-variant/30'
    }`
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-label-sm text-on-surface-variant">{label}</label>
          {isAiField && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              <Sparkles className="h-2.5 w-2.5" />
              AI
            </span>
          )}
        </div>
        {opts.textarea ? (
          <textarea
            value={value || ''}
            onChange={onChange}
            rows={opts.rows || 3}
            placeholder={opts.placeholder || ''}
            className={inputClass}
          />
        ) : (
          <input
            type={opts.type || 'text'}
            value={value || ''}
            onChange={onChange}
            placeholder={opts.placeholder || ''}
            className={inputClass}
          />
        )}
        {opts.helperText && (
          <p className="text-[11px] text-on-surface-variant/60">{opts.helperText}</p>
        )}
      </div>
    )
  }

  const renderEntryCard = (entry, fields, onRemove, entryTitle) => (
    <div className="rounded-xl border border-outline-variant/15 bg-surface-container-low px-3.5 py-3 transition-shadow hover:shadow-sm">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-label-sm font-medium text-on-surface truncate mr-2">{entryTitle || 'New entry'}</span>
        <button
          type="button"
          onClick={() => onRemove(entry.id)}
          className="rounded-lg p-1.5 text-on-surface-variant/60 transition hover:bg-error-container/20 hover:text-error active:scale-95 shrink-0"
          title="Remove"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="space-y-2.5">{fields}</div>
    </div>
  )

  return (
    <DashboardLayout>
      <LoadingOverlay visible={isProcessing} exporting={isExporting} />
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-lowest px-4 py-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate('/dashboard/resume')}
              className="rounded-lg p-1.5 text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface active:scale-95"
              aria-label="Back to Resume Builder"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-headline-sm text-on-surface truncate">Resume Editor</h1>
              <p className="text-label-sm text-on-surface-variant truncate">
                {mode === 'new' ? 'Creating from scratch' : mode === 'upload' ? 'Editing uploaded resume' : 'Editing saved resume'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(mode === 'new' || mode === 'upload') && (
              <button
                type="button"
                onClick={handleResetClick}
                className="inline-flex items-center gap-2 rounded-lg border border-outline-variant/50 px-4 py-2 text-label-sm font-medium text-on-surface transition hover:bg-surface-container-low active:scale-95"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-sm font-medium text-white transition hover:bg-primary/90 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{isExporting ? 'Generating...' : 'Download PDF'}</span>
            </button>
          </div>
        </div>

        <div className="flex border-b border-outline-variant/20 bg-surface-container-lowest lg:hidden">
          <button
            onClick={() => setMobileView('editor')}
            className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-label-sm font-medium transition ${
              mobileView === 'editor'
                ? 'border-b-2 border-primary text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Edit3 className="h-4 w-4" />
            Editor
          </button>
          <button
            onClick={() => setMobileView('preview')}
            className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-label-sm font-medium transition ${
              mobileView === 'preview'
                ? 'border-b-2 border-primary text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <aside
            className={`${
              mobileView === 'editor' ? 'flex' : 'hidden'
            } w-full flex-col overflow-y-auto bg-surface-container-lowest lg:flex lg:w-[42%] lg:min-w-[380px] xl:w-[38%]`}
          >
            <div className="flex flex-col gap-3 p-4">
              <Section title="Personal Information" icon={User} defaultOpen aiBadge={aiGeneratedFields.size > 0}>
                <div className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2.5">
                    {renderField('Full Name', resumeData.personal.fullName, setPersonal('fullName'), { placeholder: 'Enter your full name', aiField: 'fullName' })}
                    {renderField('Title', resumeData.personal.professionalTitle, setPersonal('professionalTitle'), { placeholder: 'e.g. Software Engineer', aiField: 'professionalTitle' })}
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {renderField('Email', resumeData.personal.email, setPersonal('email'), { type: 'email', placeholder: 'you@example.com', aiField: 'email' })}
                    {renderField('Phone', resumeData.personal.phone, setPersonal('phone'), { type: 'tel', placeholder: '03XXXXXXXXX', aiField: 'phone' })}
                  </div>
                  {renderField('Location', resumeData.personal.location, setPersonal('location'), { placeholder: 'Rawalpindi, Pakistan', aiField: 'location' })}
                  <div className="grid grid-cols-2 gap-2.5">
                    {renderField('Portfolio', resumeData.personal.portfolio, setPersonal('portfolio'), { placeholder: 'https://yourportfolio.com', aiField: 'portfolio' })}
                    {renderField('LinkedIn', resumeData.personal.linkedin, setPersonal('linkedin'), { placeholder: 'https://linkedin.com/in/yourname', aiField: 'linkedin' })}
                  </div>
                  {renderField('GitHub', resumeData.personal.github, setPersonal('github'), { placeholder: 'https://github.com/yourusername', aiField: 'github' })}
                </div>
              </Section>

              <Section title="Professional Summary" icon={BookOpen} aiBadge={aiGeneratedFields.has('summary')}>
                <div className="space-y-2">
                  <textarea
                    value={resumeData.personal.professionalSummary || ''}
                    onChange={(e) => updateSummary(e.target.value)}
                    rows={4}
                    placeholder="Write a brief professional summary highlighting your key qualifications and career objectives..."
                    className="w-full rounded-lg border border-outline-variant/30 bg-white px-2.5 py-1.5 text-body-sm text-on-surface outline-none transition placeholder:text-on-surface-variant/40 focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateSummary}
                    disabled={isSummaryGenerating}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary/15 bg-primary/[0.03] px-2.5 py-1.5 text-label-sm text-primary transition hover:bg-primary/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSummaryGenerating ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    {isSummaryGenerating ? 'Generating...' : 'Generate with AI'}
                  </button>
                </div>
              </Section>

              <Section title="Experience" icon={Briefcase} onAdd={addExperience}>
                {resumeData.experience.length === 0 ? (
                  <EmptySection label="No experience yet. Click + to add." />
                ) : (
                  <div className="space-y-2.5">
                    {resumeData.experience.map((exp) =>
                      renderEntryCard(
                        exp,
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Job Title', exp.jobTitle, (e) => updateExperience(exp.id, 'jobTitle', e.target.value), { placeholder: 'Senior Developer' })}
                            {renderField('Company', exp.company, (e) => updateExperience(exp.id, 'company', e.target.value), { placeholder: 'Acme Corp' })}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Start', exp.startDate, (e) => updateExperience(exp.id, 'startDate', e.target.value), { type: 'month' })}
                            {renderField('End', exp.endDate, (e) => updateExperience(exp.id, 'endDate', e.target.value), { type: 'month' })}
                          </div>
                          <label className="flex items-center gap-2 text-label-sm text-on-surface cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={exp.currentlyWorking || false}
                              onChange={(e) => updateExperience(exp.id, 'currentlyWorking', e.target.checked)}
                              className="h-4 w-4 rounded border-outline-variant/40 text-primary focus:ring-primary/20"
                            />
                            I currently work here
                          </label>
                          {renderField('Description', exp.description, (e) => updateExperience(exp.id, 'description', e.target.value), { textarea: true, rows: 2, placeholder: 'Responsibilities and achievements' })}
                          <div className="relative">
                            {renderField('Key Achievements', exp.achievements, (e) => updateExperience(exp.id, 'achievements', e.target.value), { textarea: true, rows: 2, placeholder: '• Increased revenue by 20%' })}
                            <button
                              type="button"
                              onClick={aiImproveBullet}
                              className="absolute right-2 top-7 rounded-md p-1 text-primary/40 transition hover:text-primary"
                              title="Improve with AI"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </>,
                        removeExperience,
                        [exp.jobTitle, exp.company].filter(Boolean).join(' @ ') || 'New position',
                      )
                    )}
                  </div>
                )}
              </Section>

              <Section title="Education" icon={GraduationCap} onAdd={addEducation}>
                {resumeData.education.length === 0 ? (
                  <EmptySection label="No education yet. Click + to add." />
                ) : (
                  <div className="space-y-2.5">
                    {resumeData.education.map((edu) =>
                      renderEntryCard(
                        edu,
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Institution', edu.institution, (e) => updateEducation(edu.id, 'institution', e.target.value), { placeholder: 'Stanford University' })}
                            {renderField('Degree', edu.degree, (e) => updateEducation(edu.id, 'degree', e.target.value), { placeholder: 'B.Sc. Computer Science' })}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Field of Study', edu.fieldOfStudy, (e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value), { placeholder: 'Computer Science' })}
                            {renderField('Grade', edu.grade, (e) => updateEducation(edu.id, 'grade', e.target.value), { placeholder: '3.8 GPA' })}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Start', edu.startDate, (e) => updateEducation(edu.id, 'startDate', e.target.value), { type: 'month' })}
                            {renderField('End', edu.endDate, (e) => updateEducation(edu.id, 'endDate', e.target.value), { type: 'month' })}
                          </div>
                          {renderField('Description', edu.description, (e) => updateEducation(edu.id, 'description', e.target.value), { textarea: true, rows: 2, placeholder: 'Honors, activities, relevant coursework...' })}
                        </>,
                        removeEducation,
                        [edu.degree, edu.institution].filter(Boolean).join(' @ ') || 'New education',
                      )
                    )}
                  </div>
                )}
              </Section>

              <Section title="Skills" icon={Wrench}>
                <div className="space-y-3">
                  <div>
                    <p className="mb-1 text-label-sm text-on-surface-variant">Technical</p>
                    <TagInput tags={resumeData.skills.technical} onAdd={(item) => addSkillItem('technical', item)} onRemove={(i) => removeSkillItem('technical', i)} placeholder="JavaScript, React, Python..." />
                  </div>
                  <div>
                    <p className="mb-1 text-label-sm text-on-surface-variant">Soft Skills</p>
                    <TagInput tags={resumeData.skills.soft} onAdd={(item) => addSkillItem('soft', item)} onRemove={(i) => removeSkillItem('soft', i)} placeholder="Leadership, Communication..." />
                  </div>
                  <div>
                    <p className="mb-1 text-label-sm text-on-surface-variant">Languages</p>
                    <TagInput tags={resumeData.skills.languages} onAdd={(item) => addSkillItem('languages', item)} onRemove={(i) => removeSkillItem('languages', i)} placeholder="English, Spanish..." />
                  </div>
                </div>
              </Section>

              <Section title="Projects" icon={FolderGit2} onAdd={addProject}>
                {resumeData.projects.length === 0 ? (
                  <EmptySection label="No projects yet. Click + to add." />
                ) : (
                  <div className="space-y-2.5">
                    {resumeData.projects.map((proj) =>
                      renderEntryCard(
                        proj,
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Project Name', proj.name, (e) => updateProject(proj.id, 'name', e.target.value), { placeholder: 'E-commerce Platform' })}
                            {renderField('Role', proj.role, (e) => updateProject(proj.id, 'role', e.target.value), { placeholder: 'Lead Developer' })}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Start', proj.startDate, (e) => updateProject(proj.id, 'startDate', e.target.value), { type: 'month' })}
                            {renderField('End', proj.endDate, (e) => updateProject(proj.id, 'endDate', e.target.value), { type: 'month' })}
                          </div>
                          {renderField('Description', proj.description, (e) => updateProject(proj.id, 'description', e.target.value), { textarea: true, rows: 2, placeholder: 'Describe the project and your contributions' })}
                          <div>
                            <p className="mb-1 text-label-sm text-on-surface-variant">Technologies</p>
                            <TagInput tags={proj.technologies} onAdd={(tech) => addProjectTechnology(proj.id, tech)} onRemove={(i) => removeProjectTechnology(proj.id, i)} placeholder="React, Node.js..." />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('GitHub', proj.githubLink, (e) => updateProject(proj.id, 'githubLink', e.target.value), { placeholder: 'https://github.com/...' })}
                            {renderField('Live Link', proj.liveLink, (e) => updateProject(proj.id, 'liveLink', e.target.value), { placeholder: 'https://...' })}
                          </div>
                        </>,
                        removeProject,
                        proj.name || 'New project',
                      )
                    )}
                  </div>
                )}
              </Section>

              <Section title="Certifications" icon={Award} onAdd={addCertification}>
                {(!resumeData.certifications || resumeData.certifications.length === 0) ? (
                  <EmptySection label="No certifications yet. Click + to add." />
                ) : (
                  <div className="space-y-2.5">
                    {resumeData.certifications.map((cert) =>
                      renderEntryCard(
                        cert,
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Name', cert.name, (e) => updateCertification(cert.id, 'name', e.target.value), { placeholder: 'AWS Solutions Architect' })}
                            {renderField('Issuer', cert.issuer, (e) => updateCertification(cert.id, 'issuer', e.target.value), { placeholder: 'Amazon Web Services' })}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Date', cert.date, (e) => updateCertification(cert.id, 'date', e.target.value), { type: 'month' })}
                            {renderField('URL', cert.url, (e) => updateCertification(cert.id, 'url', e.target.value), { placeholder: 'https://credential.example.com/...' })}
                          </div>
                        </>,
                        removeCertification,
                        cert.name || 'New certification',
                      )
                    )}
                  </div>
                )}
              </Section>

              <div className="h-4" />
            </div>
          </aside>

          <main
            className={`${
              mobileView === 'preview' ? 'flex' : 'hidden'
            } flex-1 flex-col overflow-hidden bg-surface-container-low lg:flex`}
          >
            <div className="flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-lowest px-4 py-2">
              <span className="text-label-sm font-medium text-on-surface-variant">Preview</span>
              <ZoomControls
                zoom={zoom}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onFitWidth={handleFitWidth}
                onFitPage={handleFitPage}
              />
            </div>

            <div ref={containerRef} className="flex-1 overflow-auto p-6">
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top center',
                  width: A4_WIDTH,
                  margin: '0 auto',
                }}
              >
                <div className="shadow-[0_2px_20px_rgba(0,0,0,0.10)]">
                  <div className="min-h-[842px] w-[595px] bg-white">
                    <ResumePreview data={resumeData} />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
        title="Reset Resume?"
        message="This will clear all entered resume information. This action cannot be undone."
        confirmLabel="Reset"
        confirmVariant="danger"
      />

      {toast && (
        <div className="fixed bottom-6 right-6 z-[70]" role="status" aria-live="polite">
          <style>{`
            @keyframes toast-slide-up {
              from { opacity: 0; transform: translateY(16px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .toast-enter { animation: toast-slide-up 250ms ease-out; }
          `}</style>
          <div className={`toast-enter flex items-start gap-3 rounded-xl border px-5 py-3.5 shadow-lg ${
            toastType === 'error'
              ? 'border-error/20 bg-error-container'
              : 'border-primary/15 bg-white'
          }`}>
            {toastType === 'error' ? (
              <AlertTriangle className="mt-0.5 h-5 w-5 text-error shrink-0" />
            ) : (
              <Sparkles className="mt-0.5 h-5 w-5 text-primary shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              {toastTitle && (
                <p className="text-body-sm font-semibold text-on-surface">{toastTitle}</p>
              )}
              <p className={`text-body-sm ${toastTitle ? 'text-on-surface-variant mt-0.5' : toastType === 'error' ? 'text-on-error-container' : 'text-on-surface'}`}>{toast}</p>
            </div>
            <button
              type="button"
              onClick={clearToast}
              className="rounded-md p-0.5 text-on-surface-variant/60 hover:text-on-surface transition shrink-0"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default ResumeEditor
