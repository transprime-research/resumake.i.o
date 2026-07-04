import styled from 'styled-components'
import { FormValues, ResumeSection } from '../../types'

const Page = styled.article`
  width: min(850px, calc(100% - 48px));
  min-height: 1100px;
  margin: 24px auto 96px;
  padding: 64px;
  background: #ffffff;
  color: #111827;
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.45;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);

  @media print {
    width: 100%;
    min-height: auto;
    margin: 0;
    box-shadow: none;
  }
`

const Header = styled.header`
  border-bottom: 2px solid #111827;
  padding-bottom: 16px;
  margin-bottom: 24px;
`

const Name = styled.h1`
  margin: 0;
  font-size: 2.2rem;
  line-height: 1.1;
`

const Contact = styled.p`
  margin: 8px 0 0;
  color: #4b5563;
  font-size: 0.95rem;
`

const Section = styled.section`
  margin-top: 22px;
`

const SectionTitle = styled.h2`
  margin: 0 0 10px;
  border-bottom: 1px solid #d1d5db;
  color: #111827;
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  line-height: 1.8;
  text-transform: uppercase;
`

const Entry = styled.div`
  margin-bottom: 14px;
`

const EntryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-weight: 700;
`

const Meta = styled.div`
  color: #4b5563;
  font-style: italic;
`

const Paragraph = styled.p`
  margin: 6px 0;
`

const List = styled.ul`
  margin: 6px 0 0 1.2rem;
  padding: 0;
`

interface Props {
  values: FormValues
}

export function HtmlResumePreview({ values }: Props) {
  const visibleSections = values.sections.filter(
    (section) => !values.hiddenSections?.includes(section)
  )

  return (
    <Page className="html-resume-print">
      <Header>
        <Name>{values.basics?.name || 'Your Name'}</Name>
        <Contact>{makeContactLine(values)}</Contact>
      </Header>

      {visibleSections.map((section) => renderSection(section, values))}
    </Page>
  )
}

function renderSection(section: ResumeSection, values: FormValues) {
  switch (section) {
    case 'profile':
      if (!values.basics?.website && !values.basics?.profiles?.length) {
        return null
      }

      return (
        <Section key={section}>
          <SectionTitle>{values.headings.basics || 'Profile'}</SectionTitle>
          <Paragraph>{values.basics.website}</Paragraph>
        </Section>
      )

    case 'education':
      return renderEntries(
        section,
        values.headings.education || 'Education',
        values.education,
        (education) => (
          <Entry key={`${education.institution}-${education.area}`}>
            <EntryHeader>
              <span>{education.institution}</span>
              <span>{joinDateRange(education.startDate, education.endDate)}</span>
            </EntryHeader>
            <Meta>
              {[education.studyType, education.area, education.location]
                .filter(Boolean)
                .join(', ')}
            </Meta>
          </Entry>
        )
      )

    case 'work':
      return renderEntries(
        section,
        values.headings.work || 'Work',
        values.work,
        (work) => (
          <Entry key={`${work.company}-${work.position}`}>
            <EntryHeader>
              <span>{work.company || work.name}</span>
              <span>{joinDateRange(work.startDate, work.endDate)}</span>
            </EntryHeader>
            <Meta>{work.position}</Meta>
            {work.summary && <Paragraph>{work.summary}</Paragraph>}
            {!!work.highlights?.length && (
              <List>
                {work.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </List>
            )}
          </Entry>
        )
      )

    case 'skills':
      return renderEntries(
        section,
        values.headings.skills || 'Skills',
        values.skills,
        (skill) => (
          <Entry key={skill.name}>
            <EntryHeader>
              <span>{skill.name}</span>
            </EntryHeader>
            <Paragraph>{skill.keywords?.join(', ')}</Paragraph>
          </Entry>
        )
      )

    case 'projects':
      return renderEntries(
        section,
        values.headings.projects || 'Projects',
        values.projects,
        (project) => (
          <Entry key={project.name}>
            <EntryHeader>
              <span>{project.name}</span>
              <span>{project.url}</span>
            </EntryHeader>
            {project.description && <Paragraph>{project.description}</Paragraph>}
            {!!project.keywords?.length && (
              <Paragraph>{project.keywords.join(', ')}</Paragraph>
            )}
          </Entry>
        )
      )

    case 'awards':
      return renderEntries(
        section,
        values.headings.awards || 'Awards',
        values.awards,
        (award) => (
          <Entry key={`${award.title}-${award.date}`}>
            <EntryHeader>
              <span>{award.title}</span>
              <span>{award.date}</span>
            </EntryHeader>
            <Meta>{award.awarder}</Meta>
            {award.summary && <Paragraph>{award.summary}</Paragraph>}
          </Entry>
        )
      )

    default:
      return null
  }
}

function renderEntries<T>(
  key: string,
  title: string,
  entries: T[] | undefined,
  renderEntry: (entry: T) => JSX.Element
) {
  if (!entries?.length) {
    return null
  }

  return (
    <Section key={key}>
      <SectionTitle>{title}</SectionTitle>
      {entries.map(renderEntry)}
    </Section>
  )
}

function makeContactLine(values: FormValues) {
  const location = [
    values.basics?.location?.city,
    values.basics?.location?.region,
    values.basics?.location?.countryCode
  ]
    .filter(Boolean)
    .join(', ')

  return [values.basics?.email, values.basics?.phone, location]
    .filter(Boolean)
    .join(' | ')
}

function joinDateRange(startDate?: string, endDate?: string) {
  return [startDate, endDate].filter(Boolean).join(' - ')
}
