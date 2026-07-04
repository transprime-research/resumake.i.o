import type { BusyTexRunner as BusyTexRunnerType, FileInput } from 'texlyre-busytex'
import { LaTeXOpts } from '../types'

type TexlyreModule = typeof import('texlyre-busytex')

let runner: BusyTexRunnerType | undefined

const busytexBasePath = '/core/busytex'
const texlivePackages = [
  `${busytexBasePath}/texlive-basic.js`,
  `${busytexBasePath}/texlive-recommended.js`,
  `${busytexBasePath}/texlive-extra.js`
]

export default async function texlyre(texDoc: string, opts: LaTeXOpts) {
  const texlyreModule = await import('texlyre-busytex')
  const runner = await getRunner(texlyreModule)
  const Tool = opts.cmd === 'xelatex' ? texlyreModule.XeLatex : texlyreModule.PdfLatex
  const compiler = new Tool(runner)
  const result = await compiler.compile({
    input: texDoc,
    additionalFiles: await resolveAdditionalFiles(opts),
    rerun: true
  })

  if (!result.success || !result.pdf) {
    throw new Error(result.log || 'TeXlyre was unable to compile the PDF.')
  }

  return URL.createObjectURL(new Blob([result.pdf], { type: 'application/pdf' }))
}

async function getRunner(texlyreModule: TexlyreModule) {
  if (!runner) {
    runner = new texlyreModule.BusyTexRunner({
      busytexBasePath,
      catalogDataPackages: texlivePackages,
      engineMode: 'combined',
      preloadDataPackages: texlivePackages
    })
    await runner.initialize(false)
  }

  return runner
}

async function resolveAdditionalFiles(opts: LaTeXOpts): Promise<FileInput[]> {
  const inputFiles = await resolveAssets(opts.inputs || [], basename)
  const fontFiles = await resolveAssets(
    opts.fonts || [],
    (url) => `fonts/${basename(url)}`
  )

  return [...inputFiles, ...fontFiles]
}

async function resolveAssets(
  urls: string[],
  getPath: (url: string) => string
): Promise<FileInput[]> {
  return Promise.all(
    urls.map(async (url) => {
      const res = await fetch(url)

      if (!res.ok) {
        throw new Error(`Unable to load TeX asset: ${url}`)
      }

      return {
        path: getPath(url),
        content: new Uint8Array(await res.arrayBuffer())
      }
    })
  )
}

function basename(url: string) {
  return url.split('/').pop() || url
}
