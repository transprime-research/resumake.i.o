import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { useFormContext } from 'react-hook-form'
import { useAtom } from 'jotai'
import styled from 'styled-components'

import { TemplatesSection } from './sections/TemplatesSection'
import { ProfileSection } from './sections/ProfileSection'
import { EducationSection } from './sections/EducationSection'
import { WorkSection } from './sections/WorkSection'
import { SkillsSection } from './sections/SkillsSection'
import { AwardSection } from './sections/AwardsSection'
import { ProjectsSection } from './sections/projectsSection'
import { resumeAtom } from '../../../atoms/resume'
import { FormValues } from '../../../types'

import getTemplateData from '../../../lib/templates'
import texlyre from '../../../lib/texlyre'

async function generateResume(formData: FormValues): Promise<string> {
  const { texDoc, opts } = getTemplateData(formData)

  return texlyre(texDoc, opts)
}

const StyledForm = styled.form`
  grid-area: form;
  overflow: auto;
`

export const initialFormValues: FormValues = {
  headings: {},
  sections: ['profile', 'education', 'work', 'skills', 'projects', 'awards'],
  hiddenSections: [],
  selectedTemplate: 1
}

export function Form() {
  const router = useRouter()
  const { section: currSection = 'basics' } = router.query

  const [resume, setResume] = useAtom(resumeAtom)
  const formContext = useFormContext<FormValues>()

  const handleFormSubmit = useCallback(async () => {
    if (resume.isLoading) {
      return
    }

    const formValues = formContext.getValues()
    setResume((currResume) => ({
      ...currResume,
      isLoading: true,
      isError: false,
      errorMessage: ''
    }))
    try {
      const newResumeUrl = await generateResume(formValues)
      setResume((currResume) => ({
        ...currResume,
        url: newResumeUrl,
        isLoading: false,
        isError: false,
        errorMessage: ''
      }))
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Unable to generate your resume.'

      setResume((currResume) => ({
        ...currResume,
        isError: true,
        isLoading: false,
        errorMessage
      }))
    }
  }, [formContext, resume.isLoading, setResume])

  return (
    <StyledForm
      id="resume-form"
      onSubmit={formContext.handleSubmit(handleFormSubmit)}
    >
      {currSection === 'templates' && <TemplatesSection />}
      {currSection === 'basics' && <ProfileSection />}
      {currSection === 'education' && <EducationSection />}
      {currSection === 'work' && <WorkSection />}
      {currSection === 'skills' && <SkillsSection />}
      {currSection === 'awards' && <AwardSection />}
      {currSection === 'projects' && <ProjectsSection />}
    </StyledForm>
  )
}
