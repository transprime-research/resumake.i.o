import dynamic from 'next/dynamic'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import styled from 'styled-components'

import { Form, initialFormValues } from '../components/generator/Form'
import { Header } from '../components/generator/Header'
import { Sidebar } from '../components/generator/Sidebar'
import { FormValues } from '../types'

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
        sections: jsonResume.sections || initialFormValues.sections
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
