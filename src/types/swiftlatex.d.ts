declare module 'swiftlatex' {
  type CompileResult = {
    status: number
    log: string
    pdf: Uint8Array
  }

  class LaTeXEngine {
    loadEngine(): Promise<void>
    makeMemFSFolder(folder: string): Promise<void>
    writeMemFSFile(filename: string, content: string | Uint8Array): Promise<void>
    setEngineMainFile(filename: string): Promise<void>
    compileLaTeX(): Promise<CompileResult>
    compilePDF(): Promise<CompileResult>
    closeWorker(): void
  }

  export class PdfTeXEngine extends LaTeXEngine {}
  export class XeTeXEngine extends LaTeXEngine {}
  export class DvipdfmxEngine extends LaTeXEngine {}
}
