import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { useFormContext, useWatch } from 'react-hook-form'
import styled from 'styled-components'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'

import { colors } from '../../theme'
import { resumeAtom } from '../../atoms/resume'
import { renderModeAtom } from '../../atoms/renderMode'
import { PrimaryButton } from '../core/Button'
import { FormValues, ResumeSection } from '../../types'

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

`

const NavItem = styled.div`
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 20px;
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

const ReorderControls = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 18px);
  gap: 2px;
`

const ReorderButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: ${colors.foreground};
  cursor: pointer;

  :disabled {
    cursor: not-allowed;
    color: #4b5563;
  }

  :hover:not(:disabled),
  :focus:not(:disabled) {
    background: ${colors.borders};
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

const sectionLabels: Record<ResumeSection, string> = {
  profile: 'Profile',
  education: 'Education',
  work: 'Work Experience',
  skills: 'Skills',
  projects: 'Projects',
  awards: 'Awards'
}

const sectionRoutes: Record<ResumeSection, string> = {
  profile: 'basics',
  education: 'education',
  work: 'work',
  skills: 'skills',
  projects: 'projects',
  awards: 'awards'
}

function normalizeSections(sections: ResumeSection[]) {
  return [
    ...sections,
    ...sectionOrder.filter((section) => !sections.includes(section))
  ]
}

export function Sidebar() {
  const router = useRouter()
  const [resume] = useAtom(resumeAtom)
  const [renderMode] = useAtom(renderModeAtom)
  const { control, setValue } = useFormContext<FormValues>()
  const sections = normalizeSections(
    useWatch({ control, name: 'sections' }) || sectionOrder
  )
  const hiddenSections = useWatch({ control, name: 'hiddenSections' }) || []
  const { section: currSection = 'basics' } = router.query

  const updateSections = (nextSections: ResumeSection[]) => {
    setValue('sections', nextSections, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  const toggleSection = (section: ResumeSection) => {
    const nextHiddenSections = hiddenSections.includes(section)
      ? hiddenSections.filter((currSection) => currSection !== section)
      : [...hiddenSections, section]

    setValue('hiddenSections', nextHiddenSections, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true
    })
  }

  const moveSection = (section: ResumeSection, direction: -1 | 1) => {
    const currIndex = sections.indexOf(section)
    const nextIndex = currIndex + direction

    if (currIndex === -1 || nextIndex < 0 || nextIndex >= sections.length) {
      return
    }

    const nextSections = [...sections]
    const nextSection = nextSections[nextIndex]

    nextSections[nextIndex] = section
    nextSections[currIndex] = nextSection
    updateSections(nextSections)
  }

  return (
    <Aside>
      <Nav>
        <NavItem>
          <span />
          <StyledLink
            href="/generator?section=templates"
            $active={currSection === 'templates'}
            $enabled
          >
            Templates
          </StyledLink>
          <span />
        </NavItem>
        {sections.map((resumeSection, index) => {
          const label = sectionLabels[resumeSection]
          const section = sectionRoutes[resumeSection]
          const isEnabled = !hiddenSections.includes(resumeSection)

          return (
            <NavItem key={resumeSection}>
              <ReorderControls>
                <ReorderButton
                  type="button"
                  disabled={index === 0}
                  aria-label={`Move ${label} up`}
                  title={`Move ${label} up`}
                  onClick={() => moveSection(resumeSection, -1)}
                >
                  <MdKeyboardArrowUp />
                </ReorderButton>
                <ReorderButton
                  type="button"
                  disabled={index === sections.length - 1}
                  aria-label={`Move ${label} down`}
                  title={`Move ${label} down`}
                  onClick={() => moveSection(resumeSection, 1)}
                >
                  <MdKeyboardArrowDown />
                </ReorderButton>
              </ReorderControls>
              <StyledLink
                href={`/generator?section=${section}`}
                $active={section === currSection}
                $enabled={isEnabled}
              >
                {label}
              </StyledLink>
              <SectionToggle
                type="checkbox"
                checked={isEnabled}
                aria-label={`${isEnabled ? 'Hide' : 'Show'} ${label}`}
                title={`${isEnabled ? 'Hide' : 'Show'} ${label}`}
                onChange={() => toggleSection(resumeSection)}
              />
            </NavItem>
          )
        })}
      </Nav>

      <PrimaryButton
        form="resume-form"
        disabled={resume.isLoading || renderMode === 'html'}
      >
        {renderMode === 'html'
          ? 'LIVE PREVIEW'
          : resume.isLoading
          ? 'MAKING...'
          : 'MAKE'}
      </PrimaryButton>
    </Aside>
  )
}
