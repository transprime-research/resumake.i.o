import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { useFormContext, useWatch } from 'react-hook-form'
import styled from 'styled-components'
import { MdDragIndicator } from 'react-icons/md'

import { colors } from '../../theme'
import { resumeAtom } from '../../atoms/resume'
import { PrimaryButton, IconButton } from '../core/Button'
import { FormValues } from '../../types'

const Aside = styled.aside`
  grid-area: sidebar;
  border-right: 1px solid ${colors.borders};
  padding: 24px 36px;
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 18px;
  margin-bottom: 28px;

  button {
    cursor: grab;
  }
`

const NavItem = styled.div`
  display: grid;
  grid-template-columns: 24px minmax(0, 1fr) 20px;
  align-items: center;
  gap: 8px;
  width: 100%;
`

const StyledLink = styled(Link)<{ $active: boolean; $enabled: boolean }>`
  text-decoration: none;
  font-weight: 300;
  color: ${(props) => (props.$enabled ? colors.foreground : '#6b7280')};
  min-width: 0;

  ${(props) => props.$active && `color: ${colors.primary};`}
`

const SectionToggle = styled.input`
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: ${colors.primary};
  cursor: pointer;
`

type SectionName = FormValues['sections'][number]

const sectionOrder: SectionName[] = [
  'profile',
  'education',
  'work',
  'skills',
  'projects',
  'awards'
]

export function Sidebar() {
  const router = useRouter()
  const [resume] = useAtom(resumeAtom)
  const { control, setValue } = useFormContext<FormValues>()
  const enabledSections = useWatch({ control, name: 'sections' }) || []
  const { section: currSection = 'basics' } = router.query

  const sectionLinks: {
    label: string
    section: string
    resumeSection?: SectionName
  }[] = [
    { label: 'Templates', section: 'templates' },
    { label: 'Profile', section: 'basics', resumeSection: 'profile' },
    { label: 'Education', section: 'education', resumeSection: 'education' },
    { label: 'Work Experience', section: 'work', resumeSection: 'work' },
    { label: 'Skills', section: 'skills', resumeSection: 'skills' },
    { label: 'Projects', section: 'projects', resumeSection: 'projects' },
    { label: 'Awards', section: 'awards', resumeSection: 'awards' }
  ]

  const toggleSection = (section: SectionName) => {
    const nextSections = enabledSections.includes(section)
      ? enabledSections.filter((currSection) => currSection !== section)
      : sectionOrder.filter(
          (currSection) =>
            enabledSections.includes(currSection) || currSection === section
        )

    setValue('sections', nextSections, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  return (
    <Aside>
      <Nav>
        {sectionLinks.map(({ label, section, resumeSection }) => {
          const isEnabled =
            !resumeSection || enabledSections.includes(resumeSection)

          return (
            <NavItem key={section}>
              <IconButton type="button">
                <MdDragIndicator />
              </IconButton>
              <StyledLink
                href={`/generator?section=${section}`}
                $active={section === currSection}
                $enabled={isEnabled}
              >
                {label}
              </StyledLink>
              {resumeSection && (
                <SectionToggle
                  type="checkbox"
                  checked={isEnabled}
                  aria-label={`${isEnabled ? 'Hide' : 'Show'} ${label}`}
                  title={`${isEnabled ? 'Hide' : 'Show'} ${label}`}
                  onChange={() => toggleSection(resumeSection)}
                />
              )}
            </NavItem>
          )
        })}
      </Nav>

      <PrimaryButton form="resume-form" disabled={resume.isLoading}>
        {resume.isLoading ? 'MAKING...' : 'MAKE'}
      </PrimaryButton>
    </Aside>
  )
}
