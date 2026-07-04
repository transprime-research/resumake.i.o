import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { Form, initialFormValues } from '../components/generator/Form'
import { Header } from '../components/generator/Header'
import { Sidebar } from '../components/generator/Sidebar'
import { FormValues, ResumeSection } from '../types'

const Preview = dynamic(
  async () => (await import('../components/generator/Preview')).Preview,
  { ssr: false }
)

const Main = styled.main`
  display: grid;
  grid-template-columns: 0.3fr 0.7fr 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'header header header'
    'sidebar form preview';
  height: 100vh;
`

const sectionOrder: ResumeSection[] = [
  'profile',
  'education',
  'work',
  'skills',
  'projects',
  'awards'
]

function normalizeSections(savedSections?: ResumeSection[]) {
  if (!savedSections?.length) {
    return initialFormValues.sections
  }

  return [
    ...savedSections,
    ...sectionOrder.filter((section) => !savedSections.includes(section))
  ]
}

function normalizeHiddenSections(jsonResume: FormValues) {
  const hiddenSections = jsonResume.hiddenSections || []
  const savedSections = jsonResume.sections || initialFormValues.sections

  return [
    ...hiddenSections,
    ...sectionOrder.filter((section) => !savedSections.includes(section))
  ]
}

export default function GeneratorPage() {
  const formContext = useForm<FormValues>({ defaultValues: initialFormValues })

  useEffect(() => {
    const lastSession = localStorage.getItem('jsonResume')

    if (lastSession) {
      const jsonResume = JSON.parse(lastSession) as FormValues
      formContext.reset({
        ...initialFormValues,
        ...jsonResume,
        headings: {
          ...initialFormValues.headings,
          ...jsonResume.headings
        },
        sections: normalizeSections(jsonResume.sections),
        hiddenSections: normalizeHiddenSections(jsonResume)
      })
    }

    const subscription = formContext.watch((data) => {
      localStorage.setItem('jsonResume', JSON.stringify(data))
    })

    return () => subscription.unsubscribe()
  }, [formContext])

  return (
    <FormProvider {...formContext}>
      <Main>
        <Header />
        <Sidebar />
        <Form />
        <Preview />
      </Main>
    </FormProvider>
  )
}
