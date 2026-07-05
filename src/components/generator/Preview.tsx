import { useAtom } from 'jotai'
import { useState, useCallback } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { pdfjs, Document, Page } from 'react-pdf'
import type { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'
import styled, { createGlobalStyle } from 'styled-components'
import { resumeAtom } from '../../atoms/resume'
import { renderModeAtom } from '../../atoms/renderMode'
import { FormValues } from '../../types'
import { HtmlResumePreview } from './HtmlResumePreview'

const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`
pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

const Output = styled.output`
  grid-area: preview;
  background: ${(props) => props.theme.lightBlack};
  overflow-y: auto;

  @media (max-width: 900px) {
    min-height: 0;
  }
`

const ExportToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem;

  @media (max-width: 900px) {
    position: sticky;
    top: 0;
    z-index: 2;
    background: ${(props) => props.theme.lightBlack};
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`

const ExportButton = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: white;
  cursor: pointer;
  padding: 0.45rem 0.7rem;

  @media (max-width: 900px) {
    min-height: 40px;
    flex: 1 1 auto;
  }
`

const PdfContainer = styled.article`
  width: 100%;
  height: 100%;
`

const StatusMessage = styled.div`
  padding: 1rem;
  color: white;
`

const ErrorMessage = styled(StatusMessage)`
  color: #ff8f8f;
`

const ResumeDocument = styled(Document)`
  width: 100%;
`

const ResumePage = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5em 0 10rem 0;

  canvas {
    max-width: 95% !important;
    height: auto !important;
  }

  @media (max-width: 900px) {
    padding: 1rem 0 6rem 0;

    canvas {
      max-width: calc(100% - 24px) !important;
    }
  }
`

const PrintStyle = createGlobalStyle`
  body > .resume-print-clone {
    position: fixed;
    left: -10000px;
    bottom: 0;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  @media print {
    @page {
      size: A4;
      margin: 0;
    }

    html,
    body,
    #__next {
      width: 100%;
      height: auto;
      margin: 0;
      padding: 0;
      background: #ffffff !important;
      overflow: visible !important;
    }

    body.printing-html-resume > *:not(.resume-print-clone) {
      display: none !important;
    }

    body.printing-html-resume > .resume-print-clone {
      display: block !important;
      position: static !important;
      width: 210mm !important;
      height: auto !important;
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      overflow: visible !important;
      min-height: auto !important;
      box-shadow: none !important;
      box-sizing: border-box !important;
      break-after: avoid !important;
      page-break-after: avoid !important;
    }

    body.printing-html-resume > .resume-print-clone.html-resume-print {
      width: 210mm !important;
      max-width: 210mm !important;
      min-height: auto !important;
      margin: 0 !important;
      padding: 14mm 16mm !important;
      box-sizing: border-box !important;
      box-shadow: none !important;
      overflow: visible !important;
    }
  }
`

function getDocumentStyles() {
  return Array.from(document.querySelectorAll('style[data-styled]'))
    .map((style) => style.outerHTML)
    .join('\n')
}

function createResumeHtmlDocument(resumeElement: Element, print = false) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Resume</title>
    ${getDocumentStyles()}
    <style>
      @page {
        size: A4;
        margin: 0;
      }

      html,
      body {
        margin: 0;
        background: ${print ? '#ffffff' : '#f3f4f6'};
      }

      ${print ? '.html-resume-print { margin: 0 !important; box-shadow: none !important; }' : ''}
    </style>
  </head>
  <body>
    ${resumeElement.outerHTML}
  </body>
</html>`
}

export function Preview() {
  const [resume] = useAtom(resumeAtom)
  const [renderMode] = useAtom(renderModeAtom)
  const { control } = useFormContext<FormValues>()
  const values = useWatch({ control }) as FormValues
  const [, setPageCount] = useState(1)
  const [pageNumber] = useState(1)
  const [scale] = useState(document.body.clientWidth > 1440 ? 1.75 : 1)

  const handleDocumentLoadSuccess = useCallback((pdf: PDFDocumentProxy) => {
    setPageCount(pdf.numPages)
  }, [])

  const getSavedResume = useCallback(() => {
    const savedResume = localStorage.getItem('jsonResume')

    if (!savedResume) {
      return '{}'
    }

    return savedResume
  }, [])

  const downloadBlob = useCallback(
    (content: BlobPart, filename: string, type: string) => {
      const url = URL.createObjectURL(new Blob([content], { type }))
      const anchor = document.createElement('a')

      anchor.href = url
      anchor.download = filename
      anchor.click()
      URL.revokeObjectURL(url)
    },
    []
  )

  const handleExportPdf = useCallback(() => {
    if (renderMode === 'html') {
      const resumeElement = document.querySelector('.html-resume-print')

      if (!resumeElement) {
        return
      }

      const printClone = resumeElement.cloneNode(true) as HTMLElement
      const cleanup = () => {
        printClone.remove()
        document.body.classList.remove('printing-html-resume')
      }

      printClone.classList.add('resume-print-clone')
      document.body.classList.add('printing-html-resume')
      document.body.appendChild(printClone)
      window.addEventListener('afterprint', cleanup, { once: true })

      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          window.print()
          window.setTimeout(cleanup, 60000)
        })
      })
      return
    }

    if (resume.url) {
      window.open(resume.url)
    }
  }, [renderMode, resume.url])

  const handleExportJson = useCallback(() => {
    downloadBlob(getSavedResume(), 'resume.json', 'application/json')
  }, [downloadBlob, getSavedResume])

  const handleExportLatex = useCallback(async () => {
    const response = await fetch('/api/generate-source', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: getSavedResume()
    })

    if (!response.ok) {
      return
    }

    downloadBlob(await response.blob(), 'resume.zip', 'application/zip')
  }, [downloadBlob, getSavedResume])

  const handleExportHtml = useCallback(() => {
    const resumeElement = document.querySelector('.html-resume-print')

    if (!resumeElement) {
      return
    }

    const htmlDocument = createResumeHtmlDocument(resumeElement)

    downloadBlob(htmlDocument, 'resume.html', 'text/html')
  }, [downloadBlob])

  return (
    <Output>
      {renderMode === 'html' && <PrintStyle />}
      <ExportToolbar>
        <ExportButton type="button" onClick={handleExportPdf}>
          {renderMode === 'html' ? 'Print PDF' : 'PDF'}
        </ExportButton>
        {renderMode === 'html' && (
          <ExportButton type="button" onClick={handleExportHtml}>
            HTML
          </ExportButton>
        )}
        <ExportButton type="button" onClick={handleExportJson}>
          JSON
        </ExportButton>
        {renderMode === 'latex' && (
          <ExportButton type="button" onClick={handleExportLatex}>
            LaTeX
          </ExportButton>
        )}
      </ExportToolbar>
      {renderMode === 'latex' && resume.isLoading && (
        <StatusMessage>Generating PDF...</StatusMessage>
      )}
      {renderMode === 'latex' && resume.isError && (
        <ErrorMessage>
          {resume.errorMessage || 'Unable to generate your resume.'}
        </ErrorMessage>
      )}
      {renderMode === 'html' ? (
        <HtmlResumePreview values={values} />
      ) : (
        <PdfContainer>
          <ResumeDocument
            file={resume.url || '/blank.pdf'}
            onLoadSuccess={handleDocumentLoadSuccess}
            loading=""
          >
            <ResumePage
              pageNumber={pageNumber}
              scale={scale}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              loading=""
            />
          </ResumeDocument>
        </PdfContainer>
      )}
    </Output>
  )
}
