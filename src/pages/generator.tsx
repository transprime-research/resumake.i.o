import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled, { css } from 'styled-components'

import { Form, initialFormValues } from '../components/generator/Form'
import { Header } from '../components/generator/Header'
import { Sidebar } from '../components/generator/Sidebar'
import { colors } from '../theme'
import { FormValues, ResumeSection } from '../types'

const Preview = dynamic(
  async () => (await import('../components/generator/Preview')).Preview,
  { ssr: false }
)

type MobileView = 'editor' | 'preview'

const Main = styled.main<{ $mobileView: MobileView }>`
  display: grid;
  grid-template-columns: 0.3fr 0.7fr 1fr;
  grid-template-rows: auto 1fr;
  grid-template-areas:
    'header header header'
    'sidebar form preview';
  height: 100vh;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto 1fr;
    grid-template-areas:
      'header'
      'mobile-toggle'
      'sidebar'
      'form';
    overflow: hidden;

    ${(props) =>
      props.$mobileView === 'preview' &&
      css`
        grid-template-rows: auto auto 1fr;
        grid-template-areas:
          'header'
          'mobile-toggle'
          'preview';
      `}

    > aside {
      display: ${(props) => (props.$mobileView === 'editor' ? 'block' : 'none')};
    }

    > form {
      display: ${(props) => (props.$mobileView === 'editor' ? 'block' : 'none')};
    }

    > output {
      display: ${(props) => (props.$mobileView === 'preview' ? 'block' : 'none')};
    }
  }
`

const MobileViewControl = styled.div`
  display: none;
  grid-area: mobile-toggle;
  gap: 8px;
  padding: 10px 16px;
  border-bottom: 1px solid ${colors.borders};
  background: ${colors.background};
`

const MobileViewButton = styled.button<{ $active: boolean }>`
  flex: 1;
  min-height: 40px;
  border: 1px solid ${colors.borders};
  border-radius: 6px;
  background: ${(props) => (props.$active ? colors.primary : colors.card)};
  color: ${(props) => (props.$active ? colors.black : colors.foreground)};
  font: inherit;
  cursor: pointer;

  @media (max-width: 900px) {
    display: block;
  }
`

const MobileViewControlWrapper = styled(MobileViewControl)`
  @media (max-width: 900px) {
    display: flex;
  }
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
  const [mobileView, setMobileView] = useState<MobileView>('editor')

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
      <Main $mobileView={mobileView}>
        <Header />
        <MobileViewControlWrapper aria-label="Mobile workspace view">
          <MobileViewButton
            type="button"
            $active={mobileView === 'editor'}
            onClick={() => setMobileView('editor')}
          >
            Editor
          </MobileViewButton>
          <MobileViewButton
            type="button"
            $active={mobileView === 'preview'}
            onClick={() => setMobileView('preview')}
          >
            Preview
          </MobileViewButton>
        </MobileViewControlWrapper>
        <Sidebar />
        <Form />
        <Preview />
      </Main>
    </FormProvider>
  )
}
