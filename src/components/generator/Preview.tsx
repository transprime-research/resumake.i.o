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
`

const ExportToolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem;
`

const ExportButton = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.08);
  color: white;
  cursor: pointer;
  padding: 0.45rem 0.7rem;
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
`

const PrintStyle = createGlobalStyle`
  @media print {
    body * {
      visibility: hidden;
    }

    .html-resume-print,
    .html-resume-print * {
      visibility: visible;
    }

    .html-resume-print {
      position: absolute;
      inset: 0 auto auto 0;
    }
  }
`

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
      window.print()
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

  return (
    <Output>
      {renderMode === 'html' && <PrintStyle />}
      <ExportToolbar>
        <ExportButton type="button" onClick={handleExportPdf}>
          PDF
        </ExportButton>
        <ExportButton type="button" onClick={handleExportJson}>
          JSON
        </ExportButton>
        <ExportButton type="button" onClick={handleExportLatex}>
          LaTeX
        </ExportButton>
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
