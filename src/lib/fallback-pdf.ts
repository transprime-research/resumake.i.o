import { FormValues } from '../types'

const PAGE_WIDTH = 595
const PAGE_HEIGHT = 842
const LEFT_MARGIN = 50
const TOP = 790
const LINE_HEIGHT = 14
const MAX_LINE_LENGTH = 86

export default function fallbackPdf(values: FormValues) {
  const lines = buildResumeLines(values)
  const content = makeContentStream(lines)
  const pdf = makePdf(content)

  return URL.createObjectURL(new Blob([pdf], { type: 'application/pdf' }))
}

type ResumeLine = {
  text: string
  size?: number
  gap?: number
}

function buildResumeLines(values: FormValues): ResumeLine[] {
  const lines: ResumeLine[] = []
  const basics = values.basics || {}
  const contactLine = [
    basics.location?.address,
    basics.email,
    basics.phone,
    basics.website
  ]
    .filter(Boolean)
    .join(' | ')

  lines.push({
    text: basics.name || 'Resume',
    size: 20,
    gap: 18
  })

  if (contactLine) {
    lines.push({ text: contactLine, size: 10, gap: 18 })
  }

  if (values.education?.length) {
    addSection(lines, values.headings.education || 'Education')
    for (const education of values.education) {
      addWrappedLine(
        lines,
        [
          education.institution,
          education.studyType,
          education.area,
          dateRange(education.startDate, education.endDate)
        ]
          .filter(Boolean)
          .join(' - ')
      )
    }
  }

  if (values.work?.length) {
    addSection(lines, values.headings.work || 'Experience')
    for (const work of values.work) {
      addWrappedLine(
        lines,
        [work.company || work.name, work.position, dateRange(work.startDate, work.endDate)]
          .filter(Boolean)
          .join(' - ')
      )
      addWrappedLine(lines, work.summary || '')
      for (const highlight of work.highlights || []) {
        addWrappedLine(lines, `- ${highlight}`)
      }
    }
  }

  if (values.skills?.length) {
    addSection(lines, values.headings.skills || 'Skills')
    for (const skill of values.skills) {
      addWrappedLine(
        lines,
        [skill.name, skill.keywords?.join(', ')].filter(Boolean).join(': ')
      )
    }
  }

  if (values.projects?.length) {
    addSection(lines, values.headings.projects || 'Projects')
    for (const project of values.projects) {
      addWrappedLine(lines, [project.name, project.description].filter(Boolean).join(' - '))
    }
  }

  if (values.awards?.length) {
    addSection(lines, values.headings.awards || 'Awards')
    for (const award of values.awards) {
      addWrappedLine(
        lines,
        [award.title, award.awarder, award.date].filter(Boolean).join(' - ')
      )
    }
  }

  return lines
}

function addSection(lines: ResumeLine[], heading: string) {
  lines.push({ text: heading, size: 14, gap: 20 })
}

function addWrappedLine(lines: ResumeLine[], text: string) {
  if (!text) {
    return
  }

  for (const line of wrapText(text)) {
    lines.push({ text: line })
  }
}

function wrapText(text: string) {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (next.length > MAX_LINE_LENGTH) {
      if (line) {
        lines.push(line)
      }
      line = word
    } else {
      line = next
    }
  }

  if (line) {
    lines.push(line)
  }

  return lines
}

function dateRange(startDate?: string, endDate?: string) {
  if (startDate && endDate) {
    return `${startDate} - ${endDate}`
  }

  return startDate || endDate || ''
}

function makeContentStream(lines: ResumeLine[]) {
  let y = TOP
  const commands = ['BT', `${LEFT_MARGIN} ${y} Td`]

  for (const line of lines) {
    const size = line.size || 11
    const gap = line.gap || LINE_HEIGHT
    commands.push(`/F1 ${size} Tf`, `(${escapePdfText(line.text)}) Tj`)
    y -= gap

    if (y < 60) {
      break
    }

    commands.push(`0 -${gap} Td`)
  }

  commands.push('ET')
  return commands.join('\n')
}

function makePdf(content: string) {
  const objects = [
    `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`,
    `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`,
    `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
    `4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n`,
    `5 0 obj\n<< /Length ${content.length} >>\nstream\n${content}\nendstream\nendobj\n`
  ]

  let pdf = '%PDF-1.4\n'
  const offsets = [0]

  for (const object of objects) {
    offsets.push(pdf.length)
    pdf += object
  }

  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  pdf += offsets
    .slice(1)
    .map((offset) => `${offset.toString().padStart(10, '0')} 00000 n \n`)
    .join('')
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`
  pdf += `startxref\n${xrefOffset}\n%%EOF\n`

  return pdf
}

function escapePdfText(text: string) {
  return text
    .replace(/[^\x20-\x7E]/g, '?')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
}
