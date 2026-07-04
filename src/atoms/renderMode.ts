import { atom } from 'jotai'

export type RenderMode = 'html' | 'latex'

export const renderModeAtom = atom<RenderMode>('html')

renderModeAtom.debugLabel = 'renderModeAtom'
