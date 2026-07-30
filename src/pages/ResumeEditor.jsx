import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useReactToPrint } from 'react-to-print'
import {
  ChevronDown, Plus, Sparkles, User, BookOpen, Briefcase,
  GraduationCap, Wrench, FolderGit2, Award, Trash2, ArrowLeft,
  Download, X
} from 'lucide-react'

import DashboardLayout from '../components/dashboard/DashboardLayout'
import ResumePreview from '../components/resume/ResumePreview'
import UploadedResumePreview from '../components/resume/UploadedResumePreview'
import ZoomControls from '../components/resume/ZoomControls'
import { useResume } from '../context/ResumeContext'

const A4_WIDTH = 595
const A4_HEIGHT = 842

function Section({ id, title, icon: Icon, defaultOpen, children, actions }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-outline-variant/30 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition hover:bg-surface-container-low"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-primary shrink-0" aria-hidden />
          <span className="text-label-sm font-medium text-on-surface">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          {actions}
          <ChevronDown className={`h-4 w-4 text-on-surface-variant transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
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
    <div className="flex flex-wrap gap-1.5 rounded-lg border border-outline-variant/40 bg-white p-2">
      {tags.map((tag, i) => (
        <span key={i} className="inline-flex items-center gap-1 rounded-md bg-surface-container-low px-2 py-0.5 text-label-sm text-on-surface">
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
        className="min-w-[120px] flex-1 border-0 bg-transparent text-label-sm text-on-surface outline-none placeholder:text-on-surface-variant/50"
      />
    </div>
  )
}

function ResumeEditor() {
  const navigate = useNavigate()
  const location = useLocation()
  const mode = location.pathname === '/dashboard/resume/new' ? 'new' : (location.state?.mode || 'edit')

  const {
    resumeData,
    uploadedFile,
    updatePersonal,
    updateSummary,
    addExperience, updateExperience, removeExperience,
    addEducation, updateEducation, removeEducation,
    addSkillItem, removeSkillItem,
    addProject, updateProject, removeProject, addProjectTechnology, removeProjectTechnology,
    addCertification, updateCertification, removeCertification,
    loadResume,
  } = useResume()

  const [zoom, setZoom] = useState(0.7)
  const previewRef = useRef(null)
  const containerRef = useRef(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleExportPDF = useReactToPrint({
    contentRef: previewRef,
    documentTitle: `${resumeData.personal.fullName || 'Resume'}.pdf`,
  })

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

  /* ---------- auto-save ---------- */
  const AUTO_SAVE_KEY = 'pathfinder-resume-editor'
  const saveTimer = useRef(null)

  useEffect(() => {
    if ((mode === 'new' || mode === 'edit') && loadResume) {
      const saved = localStorage.getItem(AUTO_SAVE_KEY)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          if (parsed && parsed.personal) {
            loadResume(parsed)
          }
        } catch { /* ignore */ }
      }
    }
  }, [])

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(resumeData))
    }, 1000)
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
  }, [resumeData])

  /* ---------- AI placeholders ---------- */
  const aiGenerateSummary = () => {
    showToast('AI summary generation coming soon')
  }
  const aiImproveBullet = (id) => {
    showToast('AI bullet improvement coming soon')
  }
  const aiSuggestSkills = () => {
    showToast('AI skill suggestions coming soon')
  }

  /* ---------- field helpers ---------- */
  const setPersonal = (field) => (e) => updatePersonal(field, e.target.value)

  const renderField = (label, value, onChange, opts = {}) => (
    <div className="space-y-1">
      <label className="text-label-sm text-on-surface-variant">{label}</label>
      {opts.textarea ? (
        <textarea
          value={value || ''}
          onChange={onChange}
          rows={opts.rows || 3}
          className="w-full rounded-lg border border-outline-variant/40 bg-white px-3 py-2 text-label-sm text-on-surface outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10 placeholder:text-on-surface-variant/50"
          placeholder={opts.placeholder || ''}
        />
      ) : (
        <input
          type={opts.type || 'text'}
          value={value || ''}
          onChange={onChange}
          className="w-full rounded-lg border border-outline-variant/40 bg-white px-3 py-2 text-label-sm text-on-surface outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10 placeholder:text-on-surface-variant/50"
          placeholder={opts.placeholder || ''}
        />
      )}
    </div>
  )

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-64px)] flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-lowest px-5 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard/resume')}
              className="rounded-lg p-2 text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface"
              aria-label="Back to Resume Builder"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-headline-sm text-on-surface">Resume Editor</h1>
              <p className="text-label-sm text-on-surface-variant">
                {mode === 'new' ? 'Creating from scratch' : mode === 'upload' ? 'Editing uploaded resume' : 'Editing saved resume'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleExportPDF()}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-label-sm font-medium text-white transition hover:bg-primary/90"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
        </div>

        {/* Body: 40/60 layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar - collapsible sections */}
          <aside className="w-[40%] min-w-[340px] overflow-y-auto border-r border-outline-variant/30 bg-surface-container-lowest">
            <div className="divide-y divide-outline-variant/30">
              {/* Personal Information */}
              <Section id="personal" title="Personal Information" icon={User} defaultOpen>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {renderField('Full Name', resumeData.personal.fullName, setPersonal('fullName'), { placeholder: 'John Doe' })}
                    {renderField('Professional Title', resumeData.personal.professionalTitle, setPersonal('professionalTitle'), { placeholder: 'Software Engineer' })}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {renderField('Email', resumeData.personal.email, setPersonal('email'), { type: 'email', placeholder: 'john@example.com' })}
                    {renderField('Phone', resumeData.personal.phone, setPersonal('phone'), { type: 'tel', placeholder: '+1 (555) 123-4567' })}
                  </div>
                  {renderField('Location', resumeData.personal.location, setPersonal('location'), { placeholder: 'San Francisco, CA' })}
                  <div className="grid grid-cols-2 gap-3">
                    {renderField('Portfolio URL', resumeData.personal.portfolio, setPersonal('portfolio'), { placeholder: 'https://portfolio.dev' })}
                    {renderField('LinkedIn', resumeData.personal.linkedin, setPersonal('linkedin'), { placeholder: 'https://linkedin.com/in/...' })}
                  </div>
                  {renderField('GitHub', resumeData.personal.github, setPersonal('github'), { placeholder: 'https://github.com/...' })}
                </div>
              </Section>

              {/* Professional Summary */}
              <Section id="summary" title="Professional Summary" icon={BookOpen}>
                <div className="space-y-2">
                  <textarea
                    value={resumeData.personal.professionalSummary || ''}
                    onChange={(e) => updateSummary(e.target.value)}
                    rows={5}
                    className="w-full rounded-lg border border-outline-variant/40 bg-white px-3 py-2 text-label-sm text-on-surface outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10 placeholder:text-on-surface-variant/50"
                    placeholder="Write a brief professional summary highlighting your key qualifications and career objectives..."
                  />
                  <button
                    type="button"
                    onClick={aiGenerateSummary}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-label-sm text-primary transition hover:bg-primary/10"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Generate with AI
                  </button>
                </div>
              </Section>

              {/* Work Experience */}
              <Section
                id="experience"
                title="Work Experience"
                icon={Briefcase}
                actions={
                  <button
                    type="button"
                    onClick={addExperience}
                    className="rounded-md p-1 text-primary transition hover:bg-primary/5"
                    title="Add experience"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                }
              >
                {resumeData.experience.length === 0 ? (
                  <p className="text-label-sm text-on-surface-variant/60">No experience added yet. Click + to add.</p>
                ) : (
                  <div className="space-y-3">
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id} className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-label-sm font-medium text-on-surface truncate mr-2">
                            {[exp.jobTitle, exp.company].filter(Boolean).join(' @ ') || 'New position'}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => aiImproveBullet(exp.id)}
                              className="rounded-md p-1 text-primary transition hover:bg-primary/5"
                              title="Improve with AI"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeExperience(exp.id)}
                              className="rounded-md p-1 text-red-500 transition hover:bg-red-50"
                              title="Remove"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Job Title', exp.jobTitle, (e) => updateExperience(exp.id, 'jobTitle', e.target.value), { placeholder: 'Senior Developer' })}
                            {renderField('Company', exp.company, (e) => updateExperience(exp.id, 'company', e.target.value), { placeholder: 'Acme Corp' })}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Start Date', exp.startDate, (e) => updateExperience(exp.id, 'startDate', e.target.value), { type: 'month' })}
                            {renderField('End Date', exp.endDate, (e) => updateExperience(exp.id, 'endDate', e.target.value), { type: 'month', placeholder: !exp.currentlyWorking ? 'Present' : '' })}
                          </div>
                          <label className="flex items-center gap-2 text-label-sm text-on-surface cursor-pointer">
                            <input
                              type="checkbox"
                              checked={exp.currentlyWorking || false}
                              onChange={(e) => updateExperience(exp.id, 'currentlyWorking', e.target.checked)}
                              className="rounded border-outline-variant/40 text-primary focus:ring-primary/20"
                            />
                            I currently work here
                          </label>
                          {renderField('Description', exp.description, (e) => updateExperience(exp.id, 'description', e.target.value), { textarea: true, rows: 2, placeholder: 'Describe your responsibilities and achievements' })}
                          {renderField('Key Achievements', exp.achievements, (e) => updateExperience(exp.id, 'achievements', e.target.value), { textarea: true, rows: 2, placeholder: '• Increased revenue by 20%\n• Led a team of 5 engineers' })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              {/* Education */}
              <Section
                id="education"
                title="Education"
                icon={GraduationCap}
                actions={
                  <button
                    type="button"
                    onClick={addEducation}
                    className="rounded-md p-1 text-primary transition hover:bg-primary/5"
                    title="Add education"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                }
              >
                {resumeData.education.length === 0 ? (
                  <p className="text-label-sm text-on-surface-variant/60">No education added yet. Click + to add.</p>
                ) : (
                  <div className="space-y-3">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-label-sm font-medium text-on-surface truncate mr-2">
                            {[edu.degree, edu.institution].filter(Boolean).join(' @ ') || 'New education'}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeEducation(edu.id)}
                            className="rounded-md p-1 text-red-500 transition hover:bg-red-50 shrink-0"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Institution', edu.institution, (e) => updateEducation(edu.id, 'institution', e.target.value), { placeholder: 'Stanford University' })}
                            {renderField('Degree', edu.degree, (e) => updateEducation(edu.id, 'degree', e.target.value), { placeholder: 'Bachelor of Science' })}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Field of Study', edu.fieldOfStudy, (e) => updateEducation(edu.id, 'fieldOfStudy', e.target.value), { placeholder: 'Computer Science' })}
                            {renderField('Grade', edu.grade, (e) => updateEducation(edu.id, 'grade', e.target.value), { placeholder: '3.8 GPA' })}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Start Date', edu.startDate, (e) => updateEducation(edu.id, 'startDate', e.target.value), { type: 'month' })}
                            {renderField('End Date', edu.endDate, (e) => updateEducation(edu.id, 'endDate', e.target.value), { type: 'month' })}
                          </div>
                          {renderField('Description', edu.description, (e) => updateEducation(edu.id, 'description', e.target.value), { textarea: true, rows: 2, placeholder: 'Relevant coursework, honors, activities...' })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              {/* Skills */}
              <Section
                id="skills"
                title="Skills"
                icon={Wrench}
                actions={
                  <button
                    type="button"
                    onClick={aiSuggestSkills}
                    className="rounded-md p-1 text-primary transition hover:bg-primary/5"
                    title="Suggest with AI"
                  >
                    <Sparkles className="h-4 w-4" />
                  </button>
                }
              >
                <div className="space-y-4">
                  <div>
                    <p className="mb-1.5 text-label-sm text-on-surface-variant">Technical Skills</p>
                    <TagInput
                      tags={resumeData.skills.technical}
                      onAdd={(item) => addSkillItem('technical', item)}
                      onRemove={(i) => removeSkillItem('technical', i)}
                      placeholder="JavaScript, React, Python..."
                    />
                  </div>
                  <div>
                    <p className="mb-1.5 text-label-sm text-on-surface-variant">Soft Skills</p>
                    <TagInput
                      tags={resumeData.skills.soft}
                      onAdd={(item) => addSkillItem('soft', item)}
                      onRemove={(i) => removeSkillItem('soft', i)}
                      placeholder="Leadership, Communication..."
                    />
                  </div>
                  <div>
                    <p className="mb-1.5 text-label-sm text-on-surface-variant">Languages</p>
                    <TagInput
                      tags={resumeData.skills.languages}
                      onAdd={(item) => addSkillItem('languages', item)}
                      onRemove={(i) => removeSkillItem('languages', i)}
                      placeholder="English, Spanish..."
                    />
                  </div>
                </div>
              </Section>

              {/* Projects */}
              <Section
                id="projects"
                title="Projects"
                icon={FolderGit2}
                actions={
                  <button
                    type="button"
                    onClick={addProject}
                    className="rounded-md p-1 text-primary transition hover:bg-primary/5"
                    title="Add project"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                }
              >
                {resumeData.projects.length === 0 ? (
                  <p className="text-label-sm text-on-surface-variant/60">No projects added yet. Click + to add.</p>
                ) : (
                  <div className="space-y-3">
                    {resumeData.projects.map((proj) => (
                      <div key={proj.id} className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-label-sm font-medium text-on-surface truncate mr-2">
                            {proj.name || 'New project'}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeProject(proj.id)}
                            className="rounded-md p-1 text-red-500 transition hover:bg-red-50 shrink-0"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Project Name', proj.name, (e) => updateProject(proj.id, 'name', e.target.value), { placeholder: 'E-commerce Platform' })}
                            {renderField('Role', proj.role, (e) => updateProject(proj.id, 'role', e.target.value), { placeholder: 'Lead Developer' })}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Start Date', proj.startDate, (e) => updateProject(proj.id, 'startDate', e.target.value), { type: 'month' })}
                            {renderField('End Date', proj.endDate, (e) => updateProject(proj.id, 'endDate', e.target.value), { type: 'month' })}
                          </div>
                          {renderField('Description', proj.description, (e) => updateProject(proj.id, 'description', e.target.value), { textarea: true, rows: 2, placeholder: 'Describe the project and your contributions' })}
                          <div>
                            <p className="mb-1 text-label-sm text-on-surface-variant">Technologies</p>
                            <TagInput
                              tags={proj.technologies}
                              onAdd={(tech) => addProjectTechnology(proj.id, tech)}
                              onRemove={(i) => removeProjectTechnology(proj.id, i)}
                              placeholder="React, Node.js..."
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('GitHub Link', proj.githubLink, (e) => updateProject(proj.id, 'githubLink', e.target.value), { placeholder: 'https://github.com/...' })}
                            {renderField('Live Link', proj.liveLink, (e) => updateProject(proj.id, 'liveLink', e.target.value), { placeholder: 'https://...' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>

              {/* Certifications */}
              <Section
                id="certificates"
                title="Certifications"
                icon={Award}
                actions={
                  <button
                    type="button"
                    onClick={addCertification}
                    className="rounded-md p-1 text-primary transition hover:bg-primary/5"
                    title="Add certification"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                }
              >
                {(!resumeData.certifications || resumeData.certifications.length === 0) ? (
                  <p className="text-label-sm text-on-surface-variant/60">No certifications added yet. Click + to add.</p>
                ) : (
                  <div className="space-y-3">
                    {resumeData.certifications.map((cert) => (
                      <div key={cert.id} className="rounded-lg border border-outline-variant/30 bg-surface-container-lowest p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-label-sm font-medium text-on-surface truncate mr-2">
                            {cert.name || 'New certification'}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeCertification(cert.id)}
                            className="rounded-md p-1 text-red-500 transition hover:bg-red-50 shrink-0"
                            title="Remove"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Name', cert.name, (e) => updateCertification(cert.id, 'name', e.target.value), { placeholder: 'AWS Solutions Architect' })}
                            {renderField('Issuer', cert.issuer, (e) => updateCertification(cert.id, 'issuer', e.target.value), { placeholder: 'Amazon Web Services' })}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {renderField('Date', cert.date, (e) => updateCertification(cert.id, 'date', e.target.value), { type: 'month' })}
                            {renderField('Credential URL', cert.url, (e) => updateCertification(cert.id, 'url', e.target.value), { placeholder: 'https://credential.example.com/...' })}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Section>
            </div>
          </aside>

          {/* Right panel - A4 preview */}
          <main className="flex flex-1 flex-col overflow-hidden bg-surface-container-low">
            {/* Zoom controls */}
            <div className="flex items-center justify-between border-b border-outline-variant/30 bg-surface-container-lowest px-5 py-2">
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
              <div className="border-b border-outline-variant/30 bg-surface-container-lowest px-5 py-2">
                <UploadedResumePreview file={uploadedFile} />
              </div>
            )}

            {/* Scrollable preview area */}
            <div ref={containerRef} className="flex-1 overflow-auto p-6">
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
          </main>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[70]" role="status" aria-live="polite">
          <style>{`
            @keyframes toast-slide-up {
              from { opacity: 0; transform: translateY(16px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .toast-enter { animation: toast-slide-up 250ms ease-out; }
          `}</style>
          <div className="toast-enter flex items-center gap-3 rounded-xl border border-primary/20 bg-white px-5 py-3.5 shadow-lg">
            <Sparkles className="h-5 w-5 text-primary shrink-0" />
            <p className="text-body-sm font-medium text-on-surface">{toast}</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default ResumeEditor