import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { useFormContext, useWatch } from 'react-hook-form'
import styled from 'styled-components'
import {
  MdCheck,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdMenu
} from 'react-icons/md'

import { colors } from '../../theme'
import { resumeAtom } from '../../atoms/resume'
import { renderModeAtom } from '../../atoms/renderMode'
import { PrimaryButton } from '../core/Button'
import { FormValues, ResumeSection } from '../../types'

const Aside = styled.aside`
  grid-area: sidebar;
  border-right: 1px solid ${colors.borders};
  padding: 24px 36px;

  @media (max-width: 900px) {
    border-right: none;
    border-bottom: 1px solid ${colors.borders};
    padding: 12px 16px;
    overflow: visible;

    > button {
      width: 100%;
      height: 40px;
      margin: 10px 0 0;
    }
  }
`

const MobileSections = styled.details`
  display: none;

  @media (max-width: 900px) {
    display: block;
    position: relative;
  }
`

const MobileSectionsSummary = styled.summary`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  padding: 0 14px;
  border: 1px solid ${colors.borders};
  border-radius: 6px;
  background: ${colors.card};
  color: ${colors.foreground};
  cursor: pointer;
  list-style: none;

  ::-webkit-details-marker {
    display: none;
  }
`

const MobileSectionsLabel = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`

const MobileNav = styled.nav`
  display: none;

  @media (max-width: 900px) {
    position: absolute;
    inset: calc(100% + 8px) 0 auto 0;
    z-index: 4;
    display: grid;
    gap: 6px;
    max-height: min(70vh, 420px);
    overflow: auto;
    padding: 10px;
    border: 1px solid ${colors.borders};
    border-radius: 8px;
    background: ${colors.card};
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.35);
  }
`

const MobileNavItem = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 44px;
  gap: 8px;
  align-items: center;
`

const MobileLink = styled(Link)<{ $active: boolean; $enabled: boolean }>`
  display: flex;
  align-items: center;
  min-height: 42px;
  padding: 0 10px;
  border-radius: 6px;
  color: ${(props) => (props.$enabled ? colors.foreground : '#6b7280')};
  text-decoration: none;
  background: ${(props) => (props.$active ? colors.borders : 'transparent')};

  ${(props) => props.$active && `color: ${colors.primary};`}
`

const MobileToggle = styled.button<{ $enabled: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  border: 1px solid ${colors.borders};
  border-radius: 6px;
  background: ${(props) => (props.$enabled ? colors.primary : 'transparent')};
  color: ${(props) => (props.$enabled ? colors.black : colors.foreground)};
  cursor: pointer;
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 18px;
  margin-bottom: 28px;

  @media (max-width: 900px) {
    display: none;
  }
`

const NavItem = styled.div`
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 20px;
  align-items: center;
  gap: 8px;
  width: 100%;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, auto) 20px;
    flex: 0 0 auto;
    width: auto;
    min-height: 36px;
    padding: 0 2px;

    > span:first-child {
      display: none;
    }
  }
`

const StyledLink = styled(Link)<{ $active: boolean; $enabled: boolean }>`
  text-decoration: none;
  font-weight: 300;
  color: ${(props) => (props.$enabled ? colors.foreground : '#6b7280')};
  min-width: 0;
  white-space: nowrap;

  ${(props) => props.$active && `color: ${colors.primary};`}

  @media (max-width: 900px) {
    display: inline-flex;
    align-items: center;
    min-height: 36px;
    padding: 0 8px;
    border-radius: 6px;
    background: ${(props) => (props.$active ? colors.borders : 'transparent')};
  }
`

const SectionToggle = styled.input`
  width: 16px;
  height: 16px;
  margin: 0;
  accent-color: ${colors.primary};
  cursor: pointer;

  @media (max-width: 900px) {
    width: 18px;
    height: 18px;
  }
`

const ReorderControls = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 18px);
  gap: 2px;

  @media (max-width: 900px) {
    display: none;
  }
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
      <MobileSections>
        <MobileSectionsSummary>
          <MobileSectionsLabel>
            <MdMenu />
            Sections
          </MobileSectionsLabel>
          <MdKeyboardArrowDown />
        </MobileSectionsSummary>
        <MobileNav>
          <MobileNavItem>
            <MobileLink
              href="/generator?section=templates"
              $active={currSection === 'templates'}
              $enabled
            >
              Templates
            </MobileLink>
            <span />
          </MobileNavItem>
          {sections.map((resumeSection) => {
            const label = sectionLabels[resumeSection]
            const section = sectionRoutes[resumeSection]
            const isEnabled = !hiddenSections.includes(resumeSection)

            return (
              <MobileNavItem key={resumeSection}>
                <MobileLink
                  href={`/generator?section=${section}`}
                  $active={section === currSection}
                  $enabled={isEnabled}
                >
                  {label}
                </MobileLink>
                <MobileToggle
                  type="button"
                  $enabled={isEnabled}
                  aria-label={`${isEnabled ? 'Hide' : 'Show'} ${label}`}
                  title={`${isEnabled ? 'Hide' : 'Show'} ${label}`}
                  onClick={() => toggleSection(resumeSection)}
                >
                  <MdCheck />
                </MobileToggle>
              </MobileNavItem>
            )
          })}
        </MobileNav>
      </MobileSections>
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
        type="submit"
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
