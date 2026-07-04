import { useFormContext, Controller } from 'react-hook-form'
import styled from 'styled-components'

import { FormSection } from './FormSection'
import { TEMPLATES } from '../../../../lib/templates/constants'
import { colors } from '../../../../theme'

import { FormValues } from '../../../../types'

const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
`

const TemplateCard = styled.label<{ $selected: boolean }>`
  display: grid;
  gap: 0.75rem;
  cursor: pointer;
  color: ${(props) => (props.$selected ? colors.primary : colors.foreground)};
`

const TemplatePreview = styled.div<{ $selected: boolean }>`
  aspect-ratio: 8.5 / 11;
  border: 1px solid
    ${(props) => (props.$selected ? colors.primary : colors.borders)};
  border-radius: 6px;
  background: #f8fafc;
  padding: 12%;
  box-shadow: ${(props) =>
    props.$selected ? `0 0 0 2px ${colors.primary}` : 'none'};
`

const PreviewHeader = styled.div`
  height: 10%;
  margin-bottom: 10%;
  background: #202530;
`

const PreviewLine = styled.div<{ $width: number }>`
  width: ${(props) => props.$width}%;
  height: 4%;
  margin-bottom: 6%;
  background: #9ca3af;
`

const TemplateMeta = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
`

const HiddenRadio = styled.input`
  accent-color: ${colors.primary};
`

export function TemplatesSection() {
  const { control } = useFormContext<FormValues>()

  return (
    <FormSection title="Choose a Template">
      <TemplateGrid>
        {TEMPLATES.map((templateId) => (
          <Controller
            key={templateId}
            control={control}
            name="selectedTemplate"
            render={({ field }) => {
              const selected = field.value === templateId

              return (
                <TemplateCard $selected={selected}>
                  <TemplatePreview $selected={selected}>
                    <PreviewHeader />
                    <PreviewLine $width={82} />
                    <PreviewLine $width={64} />
                    <PreviewLine $width={72} />
                    <PreviewLine $width={48} />
                    <PreviewLine $width={76} />
                  </TemplatePreview>
                  <TemplateMeta>
                    <HiddenRadio
                      ref={field.ref}
                      name={field.name}
                      type="radio"
                      value={templateId}
                      checked={selected}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                    Template {templateId}
                  </TemplateMeta>
                </TemplateCard>
              )
            }}
          />
        ))}
      </TemplateGrid>
    </FormSection>
  )
}
