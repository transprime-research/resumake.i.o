import { ReactNode } from 'react'
import styled from 'styled-components'

const Container = styled.fieldset`
  width: 100%;
  padding: 0 2rem;
  padding-bottom: 2rem;

  @media (max-width: 900px) {
    padding: 0 1rem 2rem;
  }
`

const Title = styled.h2`
  margin: 1.5rem 0;
  font-size: 1.15rem;
  letter-spacing: 2px;
  text-transform: uppercase;

  @media (max-width: 900px) {
    margin: 1rem 0;
    font-size: 1rem;
    letter-spacing: 1px;
  }
`

interface Props {
  title?: string
  children: ReactNode
}

export function FormSection({ title = '', children }: Props) {
  return (
    <Container>
      <Title>{title}</Title>
      {children}
    </Container>
  )
}
