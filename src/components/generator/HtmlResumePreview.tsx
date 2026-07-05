import styled, { css } from 'styled-components'
import {
  Award,
  Education,
  FormValues,
  Project,
  ResumeSection,
  Skill,
  Work
} from '../../types'

type HeaderLayout = 'center' | 'left' | 'split' | 'right'
type SectionStyle =
  | 'classic'
  | 'awesome'
  | 'boxed'
  | 'deedy'
  | 'res'
  | 'minimal'
  | 'moderncv'
  | 'compact'
  | 'modern'

type HtmlTemplateStyle = {
  accent: string
  border: string
  contactSeparator: string
  entrySpacing: string
  fontFamily: string
  headerLayout: HeaderLayout
  headingCase: 'uppercase' | 'none'
  metaColor: string
  nameColor: string
  pageWidth: string
  rule: string
  sectionColor: string
  sectionStyle: SectionStyle
}

const templateStyles: Record<number, HtmlTemplateStyle> = {
  1: {
    accent: '#111827',
    border: '#111827',
    contactSeparator: ' · ',
    entrySpacing: '14px',
    fontFamily: "Georgia, 'Times New Roman', serif",
    headerLayout: 'center',
    headingCase: 'uppercase',
    metaColor: '#4b5563',
    nameColor: '#111827',
    pageWidth: '850px',
    rule: '#d1d5db',
    sectionColor: '#111827',
    sectionStyle: 'classic'
  },
  2: {
    accent: '#dc2626',
    border: '#dc2626',
    contactSeparator: ' | ',
    entrySpacing: '16px',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    headerLayout: 'center',
    headingCase: 'none',
    metaColor: '#64748b',
    nameColor: '#111827',
    pageWidth: '880px',
    rule: '#fecaca',
    sectionColor: '#dc2626',
    sectionStyle: 'awesome'
  },
  3: {
    accent: '#374151',
    border: '#9ca3af',
    contactSeparator: ' | ',
    entrySpacing: '12px',
    fontFamily: "Arial, 'Helvetica Neue', sans-serif",
    headerLayout: 'split',
    headingCase: 'none',
    metaColor: '#475569',
    nameColor: '#0f172a',
    pageWidth: '820px',
    rule: '#d1d5db',
    sectionColor: '#111827',
    sectionStyle: 'boxed'
  },
  4: {
    accent: '#4b5563',
    border: '#111827',
    contactSeparator: ' | ',
    entrySpacing: '15px',
    fontFamily: "'Raleway', 'Helvetica Neue', Arial, sans-serif",
    headerLayout: 'center',
    headingCase: 'uppercase',
    metaColor: '#6b7280',
    nameColor: '#111827',
    pageWidth: '900px',
    rule: '#d1d5db',
    sectionColor: '#111827',
    sectionStyle: 'deedy'
  },
  5: {
    accent: '#111827',
    border: '#111827',
    contactSeparator: ' | ',
    entrySpacing: '18px',
    fontFamily: "'Times New Roman', Times, serif",
    headerLayout: 'center',
    headingCase: 'uppercase',
    metaColor: '#374151',
    nameColor: '#111827',
    pageWidth: '790px',
    rule: '#111827',
    sectionColor: '#111827',
    sectionStyle: 'res'
  },
  6: {
    accent: '#111827',
    border: '#111827',
    contactSeparator: ' -- ',
    entrySpacing: '17px',
    fontFamily: "'Montserrat', 'Helvetica Neue', Arial, sans-serif",
    headerLayout: 'center',
    headingCase: 'uppercase',
    metaColor: '#4b5563',
    nameColor: '#111827',
    pageWidth: '840px',
    rule: '#e5e7eb',
    sectionColor: '#111827',
    sectionStyle: 'minimal'
  },
  7: {
    accent: '#2563eb',
    border: '#2563eb',
    contactSeparator: ' | ',
    entrySpacing: '15px',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    headerLayout: 'left',
    headingCase: 'none',
    metaColor: '#475569',
    nameColor: '#1e3a8a',
    pageWidth: '860px',
    rule: '#bfdbfe',
    sectionColor: '#2563eb',
    sectionStyle: 'moderncv'
  },
  8: {
    accent: '#111827',
    border: '#111827',
    contactSeparator: ' · ',
    entrySpacing: '13px',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    headerLayout: 'split',
    headingCase: 'none',
    metaColor: '#475569',
    nameColor: '#111827',
    pageWidth: '860px',
    rule: '#d1d5db',
    sectionColor: '#111827',
    sectionStyle: 'compact'
  },
  9: {
    accent: '#111827',
    border: '#111827',
    contactSeparator: ' | ',
    entrySpacing: '14px',
    fontFamily: "'Helvetica Neue', Arial, sans-serif",
    headerLayout: 'right',
    headingCase: 'uppercase',
    metaColor: '#57534e',
    nameColor: '#111827',
    pageWidth: '820px',
    rule: '#111827',
    sectionColor: '#111827',
    sectionStyle: 'modern'
  }
}

const Page = styled.article<{ $style: HtmlTemplateStyle }>`
  width: min(${(props) => props.$style.pageWidth}, calc(100% - 48px));
  min-height: 1100px;
  margin: 24px auto 96px;
  padding: 56px 64px;
  background: #ffffff;
  color: #111827;
  font-family: ${(props) => props.$style.fontFamily};
  font-size: ${(props) =>
    props.$style.sectionStyle === 'res'
      ? '0.96rem'
      : props.$style.sectionStyle === 'modern'
      ? '0.84rem'
      : '0.92rem'};
  line-height: ${(props) =>
    props.$style.sectionStyle === 'compact'
      ? '1.34'
      : props.$style.sectionStyle === 'modern'
      ? '1.28'
      : '1.45'};
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);

  ${(props) =>
    props.$style.sectionStyle === 'res' &&
    css`
      padding-left: 92px;
      border-left: 1px solid ${props.$style.rule};
    `}

  ${(props) =>
    props.$style.sectionStyle === 'minimal' &&
    css`
      letter-spacing: 0.01em;
    `}

  ${(props) =>
    props.$style.sectionStyle === 'moderncv' &&
    css`
      border-top: 6px solid ${props.$style.accent};
    `}

  @media print {
    width: 210mm;
    max-width: 210mm;
    min-height: auto;
    margin: 0;
    padding: 14mm 16mm;
    box-sizing: border-box;
    box-shadow: none;
  }

  @media (max-width: 720px) {
    width: min(100% - 24px, ${(props) => props.$style.pageWidth});
    min-height: auto;
    margin: 12px auto 64px;
    padding: 28px 22px;
  }
`

const Header = styled.header<{ $style: HtmlTemplateStyle }>`
  display: ${(props) =>
    props.$style.headerLayout === 'split' ? 'grid' : 'block'};
  grid-template-columns: minmax(0, 1fr) minmax(220px, 0.9fr);
  gap: 24px;
  align-items: end;
  padding-bottom: ${(props) =>
    props.$style.sectionStyle === 'awesome' ? '20px' : '16px'};
  margin-bottom: 24px;
  text-align: ${(props) =>
    props.$style.headerLayout === 'center'
      ? 'center'
      : props.$style.headerLayout === 'right'
      ? 'right'
      : 'left'};
  border-bottom: ${(props) =>
    ['classic', 'res'].includes(props.$style.sectionStyle)
      ? `2px solid ${props.$style.border}`
      : 'none'};

  @media (max-width: 640px) {
    display: block;
    text-align: left;
  }
`

const Name = styled.h1<{ $style: HtmlTemplateStyle }>`
  margin: 0;
  color: ${(props) => props.$style.nameColor};
  font-size: ${(props) =>
    props.$style.sectionStyle === 'awesome'
      ? '2.55rem'
      : props.$style.sectionStyle === 'minimal'
      ? '2rem'
      : props.$style.sectionStyle === 'modern'
      ? '2.45rem'
      : '2.2rem'};
  font-weight: ${(props) =>
    ['awesome', 'minimal'].includes(props.$style.sectionStyle)
      ? 300
      : 700};
  letter-spacing: ${(props) =>
    props.$style.sectionStyle === 'minimal' ? '0.12em' : '0'};
  line-height: 1.1;
  text-transform: ${(props) =>
    props.$style.sectionStyle === 'minimal' ? 'uppercase' : 'none'};

  strong {
    color: ${(props) => props.$style.accent};
    font-weight: 700;
  }
`

const Contact = styled.p<{ $style: HtmlTemplateStyle }>`
  margin: 8px 0 0;
  color: ${(props) => props.$style.metaColor};
  font-size: ${(props) =>
    props.$style.sectionStyle === 'boxed' ? '0.82rem' : '0.9rem'};
  font-style: ${(props) =>
    props.$style.sectionStyle === 'boxed' ? 'italic' : 'normal'};
  overflow-wrap: anywhere;
`

const Section = styled.section<{ $style: HtmlTemplateStyle }>`
  margin-top: ${(props) =>
    props.$style.sectionStyle === 'modern'
      ? '18px'
      : props.$style.sectionStyle === 'minimal'
      ? '26px'
      : '22px'};
`

const SectionTitle = styled.h2<{ $style: HtmlTemplateStyle }>`
  margin: 0 0 10px;
  color: ${(props) => props.$style.sectionColor};
  font-size: ${(props) =>
    props.$style.sectionStyle === 'awesome' ? '1rem' : '0.95rem'};
  font-weight: 700;
  line-height: 1.8;
  text-transform: ${(props) => props.$style.headingCase};

  ${(props) =>
    props.$style.sectionStyle === 'classic' &&
    css`
      border-bottom: 1px solid ${props.$style.rule};
      letter-spacing: 0.08em;
    `}

  ${(props) =>
    props.$style.sectionStyle === 'awesome' &&
    css`
      border-bottom: 1px solid ${props.$style.rule};
      color: ${props.$style.accent};
      font-size: 1.05rem;
    `}

  ${(props) =>
    props.$style.sectionStyle === 'boxed' &&
    css`
      padding: 4px 8px;
      border: 3px solid #bfbfbf;
      background: #eeeeee;
      color: #111827;
      font-size: 0.98rem;
      line-height: 1.4;
    `}

  ${(props) =>
    props.$style.sectionStyle === 'deedy' &&
    css`
      border-bottom: 1px solid ${props.$style.rule};
      font-size: 1rem;
      letter-spacing: 0.05em;
    `}

  ${(props) =>
    props.$style.sectionStyle === 'res' &&
    css`
      border-bottom: 1px solid ${props.$style.rule};
      font-size: 1rem;
      letter-spacing: 0.04em;
    `}

  ${(props) =>
    props.$style.sectionStyle === 'minimal' &&
    css`
      border-bottom: 1px solid ${props.$style.rule};
      letter-spacing: 0.16em;
      font-weight: 500;
    `}

  ${(props) =>
    props.$style.sectionStyle === 'moderncv' &&
    css`
      border-bottom: 1px solid ${props.$style.rule};
      color: ${props.$style.accent};
      font-size: 1.12rem;
    `}

  ${(props) =>
    props.$style.sectionStyle === 'compact' &&
    css`
      border-bottom: 1px solid ${props.$style.rule};
      font-size: 1.08rem;
    `}

  ${(props) =>
    props.$style.sectionStyle === 'modern' &&
    css`
      border-bottom: 3px solid ${props.$style.rule};
      letter-spacing: 0.08em;
      text-align: left;
    `}
`

const Entry = styled.div<{ $style: HtmlTemplateStyle }>`
  margin-bottom: ${(props) => props.$style.entrySpacing};
`

const EntryHeader = styled.div<{ $style: HtmlTemplateStyle }>`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: baseline;
  font-weight: 700;

  ${(props) =>
    props.$style.sectionStyle === 'moderncv' &&
    css`
      grid-template-columns: 120px minmax(0, 1fr);
    `}

  @media (max-width: 560px) {
    display: block;
  }
`

const EntryTitle = styled.span<{ $style: HtmlTemplateStyle }>`
  color: ${(props) => props.$style.nameColor};

  ${(props) =>
    ['deedy', 'minimal'].includes(props.$style.sectionStyle) &&
    css`
      text-transform: uppercase;
    `}
`

const Meta = styled.div<{ $style: HtmlTemplateStyle }>`
  color: ${(props) => props.$style.metaColor};
  font-style: italic;
`

const Paragraph = styled.p`
  margin: 6px 0;
  overflow-wrap: anywhere;
`

const List = styled.ul<{ $style: HtmlTemplateStyle }>`
  margin: 6px 0 0 1.2rem;
  padding: 0;

  ${(props) =>
    props.$style.sectionStyle === 'minimal' &&
    css`
      list-style: circle;
    `}
`

const SkillTable = styled.div`
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  column-gap: 14px;
  row-gap: 4px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`

const ModernDateBadge = styled.span`
  justify-self: end;
  min-width: 9em;
  padding: 1px 8px;
  background: #111827;
  color: #ffffff;
  font-size: 0.84rem;
  line-height: 1.35;
  text-align: right;
`

const ModernDetail = styled.p`
  margin: 2px 0 0;
  font-style: italic;
`

const ModernSmall = styled.p`
  margin: 3px 0 0;
  font-size: 0.86rem;
`

const ModernLabeledRows = styled.div`
  display: grid;
  grid-template-columns: 9.5em minmax(0, 1fr);
  column-gap: 1.5em;
  row-gap: 4px;

  em {
    color: #57534e;
  }

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
    row-gap: 2px;
  }
`

const ModernInlineHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: baseline;

  @media (max-width: 560px) {
    display: block;
  }
`

interface Props {
  values: FormValues
}

export function HtmlResumePreview({ values }: Props) {
  const templateStyle =
    templateStyles[values.selectedTemplate] || templateStyles[1]
  const visibleSections = (values.sections || []).filter(
    (section) => !values.hiddenSections?.includes(section)
  )

  return (
    <Page className="html-resume-print" $style={templateStyle}>
      {visibleSections.map((section) =>
        renderSection(section, values, templateStyle)
      )}
    </Page>
  )
}

function renderHeader(values: FormValues, templateStyle: HtmlTemplateStyle) {
  const name = values.basics?.name || 'Your Name'
  const contactLine = makeContactLine(values, templateStyle.contactSeparator)

  if (templateStyle.sectionStyle === 'awesome') {
    const [firstName, ...rest] = name.split(' ')

    return (
      <>
        <Name $style={templateStyle}>
          {firstName} <strong>{rest.join(' ')}</strong>
        </Name>
        <Contact $style={templateStyle}>{contactLine}</Contact>
      </>
    )
  }

  if (templateStyle.headerLayout === 'split') {
    return (
      <>
        <Name $style={templateStyle}>{name}</Name>
        <Contact $style={templateStyle}>{contactLine}</Contact>
      </>
    )
  }

  return (
    <>
      <Name $style={templateStyle}>{name}</Name>
      <Contact $style={templateStyle}>{contactLine}</Contact>
    </>
  )
}

function renderSection(
  section: ResumeSection,
  values: FormValues,
  templateStyle: HtmlTemplateStyle
) {
  switch (section) {
    case 'profile':
      return renderProfile(values, templateStyle)

    case 'education':
      return renderEntries(
        section,
        values.headings.education || 'Education',
        values.education,
        templateStyle,
        (education) => renderEducation(education, templateStyle)
      )

    case 'work':
      return renderEntries(
        section,
        values.headings.work || 'Experience',
        values.work,
        templateStyle,
        (work) => renderWork(work, templateStyle)
      )

    case 'skills':
      return renderSkills(values, templateStyle)

    case 'projects':
      return renderEntries(
        section,
        values.headings.projects || 'Projects',
        values.projects,
        templateStyle,
        (project) => renderProject(project, templateStyle)
      )

    case 'awards':
      return renderEntries(
        section,
        values.headings.awards || 'Awards',
        values.awards,
        templateStyle,
        (award) => renderAward(award, templateStyle)
      )

    default:
      return null
  }
}

function renderProfile(values: FormValues, templateStyle: HtmlTemplateStyle) {
  return (
    <Header key="profile" $style={templateStyle}>
      {renderHeader(values, templateStyle)}
    </Header>
  )
}

function renderEducation(
  education: Education,
  templateStyle: HtmlTemplateStyle
) {
  if (templateStyle.sectionStyle === 'modern') {
    return renderModernEducation(education, templateStyle)
  }

  const degree = [education.studyType, education.area].filter(Boolean).join(' ')
  const dateRange = joinDateRange(education.startDate, education.endDate)
  const details = [degree, education.score ? `GPA: ${education.score}` : '']
    .filter(Boolean)
    .join(', ')

  return (
    <Entry key={`${education.institution}-${education.area}`} $style={templateStyle}>
      {renderEntryHeader(
        education.institution,
        templateStyle.sectionStyle === 'moderncv' ? dateRange : education.location,
        templateStyle
      )}
      {details && <Meta $style={templateStyle}>{details}</Meta>}
      {templateStyle.sectionStyle !== 'moderncv' && dateRange && (
        <Meta $style={templateStyle}>{dateRange}</Meta>
      )}
      {templateStyle.sectionStyle === 'moderncv' && education.location && (
        <Paragraph>{education.location}</Paragraph>
      )}
    </Entry>
  )
}

function renderWork(work: Work, templateStyle: HtmlTemplateStyle) {
  if (templateStyle.sectionStyle === 'modern') {
    return renderModernWork(work, templateStyle)
  }

  const dateRange = joinDateRange(work.startDate, work.endDate)
  const title = work.company || work.name
  const meta = [work.position, work.location].filter(Boolean).join(' | ')

  return (
    <Entry key={`${title}-${work.position}`} $style={templateStyle}>
      {renderEntryHeader(
        title,
        templateStyle.sectionStyle === 'moderncv' ? dateRange : work.location,
        templateStyle
      )}
      {meta && <Meta $style={templateStyle}>{meta}</Meta>}
      {templateStyle.sectionStyle !== 'moderncv' && dateRange && (
        <Meta $style={templateStyle}>{dateRange}</Meta>
      )}
      {work.summary && <Paragraph>{work.summary}</Paragraph>}
      {!!work.highlights?.length && (
        <List $style={templateStyle}>
          {work.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </List>
      )}
    </Entry>
  )
}

function renderProject(project: Project, templateStyle: HtmlTemplateStyle) {
  if (templateStyle.sectionStyle === 'modern') {
    return renderModernProject(project, templateStyle)
  }

  const secondary =
    templateStyle.sectionStyle === 'moderncv'
      ? project.url
      : project.keywords?.join(', ')

  return (
    <Entry key={project.name} $style={templateStyle}>
      {renderEntryHeader(project.name, secondary, templateStyle)}
      {project.description && <Paragraph>{project.description}</Paragraph>}
      {project.url && templateStyle.sectionStyle !== 'moderncv' && (
        <Meta $style={templateStyle}>{project.url}</Meta>
      )}
      {!!project.keywords?.length && templateStyle.sectionStyle === 'moderncv' && (
        <Meta $style={templateStyle}>{project.keywords.join(', ')}</Meta>
      )}
    </Entry>
  )
}

function renderAward(award: Award, templateStyle: HtmlTemplateStyle) {
  if (templateStyle.sectionStyle === 'modern') {
    return renderModernAward(award, templateStyle)
  }

  const secondary =
    templateStyle.sectionStyle === 'moderncv' ? award.date : award.awarder

  return (
    <Entry key={`${award.title}-${award.date}`} $style={templateStyle}>
      {renderEntryHeader(award.title, secondary, templateStyle)}
      {award.awarder && templateStyle.sectionStyle === 'moderncv' && (
        <Meta $style={templateStyle}>{award.awarder}</Meta>
      )}
      {award.date && templateStyle.sectionStyle !== 'moderncv' && (
        <Meta $style={templateStyle}>{award.date}</Meta>
      )}
      {award.summary && <Paragraph>{award.summary}</Paragraph>}
    </Entry>
  )
}

function renderSkills(values: FormValues, templateStyle: HtmlTemplateStyle) {
  if (!values.skills?.length) {
    return null
  }

  if (templateStyle.sectionStyle === 'modern') {
    return (
      <Section key="skills" $style={templateStyle}>
        <SectionTitle $style={templateStyle}>
          {formatHeading(values.headings.skills || 'Skills', templateStyle)}
        </SectionTitle>
        <ModernLabeledRows>
          {values.skills.map((skill) => (
            <ModernSkillRow key={skill.name} skill={skill} />
          ))}
        </ModernLabeledRows>
      </Section>
    )
  }

  if (['classic', 'boxed', 'res', 'modern'].includes(templateStyle.sectionStyle)) {
    return (
      <Section key="skills" $style={templateStyle}>
        <SectionTitle $style={templateStyle}>
          {values.headings.skills || 'Skills'}
        </SectionTitle>
        <SkillTable>
          {values.skills.map((skill) => (
            <SkillRow key={skill.name} skill={skill} />
          ))}
        </SkillTable>
      </Section>
    )
  }

  return renderEntries(
    'skills',
    values.headings.skills || 'Skills',
    values.skills,
    templateStyle,
    (skill) => (
      <Entry key={skill.name} $style={templateStyle}>
        <Paragraph>
          <strong>{skill.name}</strong>
          {skill.name ? ': ' : ''}
          {skill.keywords?.join(', ')}
        </Paragraph>
      </Entry>
    )
  )
}

function renderModernEducation(
  education: Education,
  templateStyle: HtmlTemplateStyle
) {
  const degree = [education.studyType, education.area].filter(Boolean).join(' ')
  const school = [education.institution, education.location, education.score]
    .filter(Boolean)
    .join(', ')
  const dateRange = joinDateRange(education.startDate, education.endDate)

  return (
    <Entry key={`${education.institution}-${education.area}`} $style={templateStyle}>
      <EntryHeader $style={templateStyle}>
        <EntryTitle $style={templateStyle}>{degree}</EntryTitle>
        {dateRange && <ModernDateBadge>{dateRange}</ModernDateBadge>}
      </EntryHeader>
      {school && <ModernDetail>{school}</ModernDetail>}
    </Entry>
  )
}

function renderModernWork(work: Work, templateStyle: HtmlTemplateStyle) {
  const dateRange = joinDateRange(work.startDate, work.endDate)
  const company = [work.name, work.location].filter(Boolean).join(', ')

  return (
    <Entry key={`${work.company || work.name}-${work.position}`} $style={templateStyle}>
      <EntryHeader $style={templateStyle}>
        <EntryTitle $style={templateStyle}>{work.position}</EntryTitle>
        {dateRange && <ModernDateBadge>{dateRange}</ModernDateBadge>}
      </EntryHeader>
      {company && <ModernDetail>{company}</ModernDetail>}
      {work.summary && <ModernSmall>{work.summary}</ModernSmall>}
      {!!work.highlights?.length && (
        <List $style={templateStyle}>
          {work.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </List>
      )}
    </Entry>
  )
}

function renderModernProject(project: Project, templateStyle: HtmlTemplateStyle) {
  return (
    <Entry key={project.name} $style={templateStyle}>
      <ModernInlineHeader>
        <span>
          <EntryTitle $style={templateStyle}>{project.name}</EntryTitle>{' '}
          {!!project.keywords?.length && <em>{project.keywords.join(', ')}</em>}
        </span>
        {project.url && <span>{project.url}</span>}
      </ModernInlineHeader>
      {project.description && <ModernSmall>{project.description}</ModernSmall>}
    </Entry>
  )
}

function renderModernAward(award: Award, templateStyle: HtmlTemplateStyle) {
  return (
    <Entry key={`${award.title}-${award.date}`} $style={templateStyle}>
      <ModernInlineHeader>
        <span>
          <EntryTitle $style={templateStyle}>{award.title}</EntryTitle>{' '}
          {award.date && <em>{award.date}</em>}
        </span>
        {award.awarder && <span>{award.awarder}</span>}
      </ModernInlineHeader>
      {award.summary && <ModernSmall>{award.summary}</ModernSmall>}
    </Entry>
  )
}

function SkillRow({ skill }: { skill: Skill }) {
  return (
    <>
      <strong>{skill.name}</strong>
      <span>{skill.keywords?.join(', ')}</span>
    </>
  )
}

function ModernSkillRow({ skill }: { skill: Skill }) {
  return (
    <>
      <em>{skill.name}</em>
      <span>{skill.keywords?.join(', ')}</span>
    </>
  )
}

function renderEntryHeader(
  title: string | undefined,
  secondary: string | undefined,
  templateStyle: HtmlTemplateStyle
) {
  if (templateStyle.sectionStyle === 'moderncv') {
    return (
      <EntryHeader $style={templateStyle}>
        <Meta $style={templateStyle}>{secondary}</Meta>
        <EntryTitle $style={templateStyle}>{title}</EntryTitle>
      </EntryHeader>
    )
  }

  return (
    <EntryHeader $style={templateStyle}>
      <EntryTitle $style={templateStyle}>{title}</EntryTitle>
      {secondary && <Meta $style={templateStyle}>{secondary}</Meta>}
    </EntryHeader>
  )
}

function renderEntries<T>(
  key: string,
  title: string,
  entries: T[] | undefined,
  templateStyle: HtmlTemplateStyle,
  renderEntry: (entry: T) => JSX.Element
) {
  if (!entries?.length) {
    return null
  }

  return (
    <Section key={key} $style={templateStyle}>
      <SectionTitle $style={templateStyle}>{formatHeading(title, templateStyle)}</SectionTitle>
      {entries.map(renderEntry)}
    </Section>
  )
}

function formatHeading(title: string, templateStyle: HtmlTemplateStyle) {
  if (templateStyle.headingCase === 'uppercase') {
    return title.toUpperCase()
  }

  return title
}

function makeContactLine(values: FormValues, separator: string) {
  const location = values.basics?.location?.address
    ? values.basics.location.address
    : [
        values.basics?.location?.city,
        values.basics?.location?.region,
        values.basics?.location?.countryCode
      ]
        .filter(Boolean)
        .join(', ')

  return [values.basics?.email, values.basics?.phone, location, values.basics?.website]
    .filter(Boolean)
    .join(separator)
}

function joinDateRange(startDate?: string, endDate?: string) {
  if (startDate && endDate) {
    return `${startDate} - ${endDate}`
  }

  if (startDate) {
    return `${startDate} - Present`
  }

  return endDate || ''
}
