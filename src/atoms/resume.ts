import { atom } from 'jotai'

export interface Resume {
  url: string
  isLoading: boolean
  isError: boolean
  errorMessage: string
}

export const resumeAtom = atom({
  url: '',
  isLoading: false,
  isError: false,
  errorMessage: ''
})

resumeAtom.debugLabel = 'resumeAtom'
