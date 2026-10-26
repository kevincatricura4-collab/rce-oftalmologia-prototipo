import { Button, Navbar, NavbarGroup, NavbarHeading, Tag } from '@blueprintjs/core'
import type { ReactNode } from 'react'
import { useEstado } from '../lib/store'
import { IconoDatosPrueba, IconoMenu, IconoModoClaro, IconoModoOscuro, LogoRce } from './iconos'

export function BarraSuperior({ children, onMenu }: { children?: ReactNode; onMenu?: () => void }) {
  const { tema, alternarTema } = useEstado()
  const oscuro = tema === 'oscuro'
  return <header className="rce-app-header sticky top-0 z-30 print:hidden">
    <Navbar className="rce-navbar bp6-dark">
      <NavbarGroup className="min-w-0 gap-3">
        {onMenu && <Button variant="minimal" aria-label="Abrir menú" onClick={onMenu} className="lg:hidden" icon={<IconoMenu size={20} aria-hidden="true" />} />}
        <LogoRce className="size-6 shrink-0" />
        <NavbarHeading className="rce-brand"><span>RCE Oftalmología</span><span className="hidden text-[0.8125rem] font-normal sm:block">Hospital San Lucas</span></NavbarHeading>
      </NavbarGroup>
      <NavbarGroup className="ml-auto gap-3">
        <Tag intent="warning" minimal icon={<IconoDatosPrueba size={16} aria-hidden="true" />}><span className="hidden sm:inline">Datos de prueba</span><span className="sm:hidden">Prueba</span></Tag>
        {children}
        <Button variant="minimal" aria-pressed={oscuro} aria-label={oscuro ? 'Modo claro' : 'Modo box oscuro'} onClick={alternarTema}
          icon={oscuro ? <IconoModoClaro size={16} aria-hidden="true" /> : <IconoModoOscuro size={16} aria-hidden="true" />}>
          <span className="hidden xl:inline">{oscuro ? 'Modo claro' : 'Modo box oscuro'}</span>
        </Button>
      </NavbarGroup>
    </Navbar>
  </header>
}
