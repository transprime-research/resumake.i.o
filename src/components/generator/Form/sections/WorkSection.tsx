import { Fragment } from 'react'
import { useFieldArray } from 'react-hook-form'

import { LabeledInput } from '../../../core/LabeledInput'
import { AddButton, RemoveButton } from '../../../core/Button'
import { Divider } from '../../../core/Divider'
import { FormSection } from './FormSection'
import Highlights from './Highlights'
import { confirmRemove } from './remove'

import { Work } from '../../../../types'

export function WorkSection() {
  const { fields, append, remove } = useFieldArray({ name: 'work' })

  const handleAdd = () => {
    const defaultWork: Work = {
      company: '',
      position: '',
      summary: '',
      startDate: '',
      endDate: '',
      highlights: []
    }

    append(defaultWork)
  }

  return (
    <FormSection title="Your Work Experience">
      {fields.length > 0 && (
        <Fragment>
          <LabeledInput
            name="headings.work"
            label="Section Heading"
            placeholder="Work"
          />
          <Divider />
        </Fragment>
      )}
      {fields.map((field, index) => (
        <Fragment key={field.id}>
          <LabeledInput
            name={`work.${index}.company`}
            label="Company name"
            placeholder="Netflix"
          />
          <LabeledInput
            name={`work.${index}.position`}
            label="Position"
            placeholder="Software Engineer"
          />
          <LabeledInput
            name={`work.${index}.summary`}
            label="Summary"
            placeholder="lorem ipsum"
          />
          <LabeledInput
            name={`work.${index}.startDate`}
            label="Start Date"
            placeholder="Sep 2015"
          />
          <LabeledInput
            name={`work.${index}.endDate`}
            label="End Date"
            placeholder="Jun 2019"
          />
          <Highlights
            label="Job Responsibilities"
            placeholder="Did cool stuff at company"
            name={`work.${index}.highlights`}
          />
          <RemoveButton
            type="button"
            onClick={() =>
              confirmRemove('work experience entry', () => remove(index))
            }
          >
            Remove Work Experience
          </RemoveButton>
          <Divider />
        </Fragment>
      ))}
      <AddButton type="button" onClick={handleAdd}>
        + Add Work Experience
      </AddButton>
    </FormSection>
  )
}
