import { atom } from 'jotai'

export type RenderMode = 'html' | 'latex'

export const renderModeAtom = atom<RenderMode>('latex')

renderModeAtom.debugLabel = 'renderModeAtom'
