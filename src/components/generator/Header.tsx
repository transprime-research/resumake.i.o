import Link from 'next/link'
import { useAtom } from 'jotai'
import styled from 'styled-components'

import { Logo } from '../core/Logo'
import { colors } from '../../theme'
import { renderModeAtom } from '../../atoms/renderMode'

const StyledHeader = styled.header`
  grid-area: header;
  width: 100%;
  height: 10vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 36px;
  border-bottom: 1px solid ${colors.borders};
`

const ModeControl = styled.div`
  display: inline-flex;
  border: 1px solid ${colors.borders};
  border-radius: 999px;
  overflow: hidden;
`

const ModeButton = styled.button<{ $active: boolean }>`
  min-width: 72px;
  height: 34px;
  border: none;
  background: ${(props) => (props.$active ? colors.primary : 'transparent')};
  color: ${(props) => (props.$active ? colors.black : colors.foreground)};
  cursor: pointer;
  font: inherit;
  font-size: 0.8rem;
`

export function Header() {
  const [renderMode, setRenderMode] = useAtom(renderModeAtom)

  return (
    <StyledHeader>
      <Link href="/">
        <Logo scale={0.65} />
      </Link>
      <ModeControl aria-label="Render mode">
        <ModeButton
          type="button"
          $active={renderMode === 'html'}
          onClick={() => setRenderMode('html')}
        >
          HTML
        </ModeButton>
        <ModeButton
          type="button"
          $active={renderMode === 'latex'}
          onClick={() => setRenderMode('latex')}
        >
          LaTeX
        </ModeButton>
      </ModeControl>
    </StyledHeader>
  )
}
