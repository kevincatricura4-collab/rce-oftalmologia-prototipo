import { Alert, Button, Drawer, Menu, MenuDivider, Tag } from '@blueprintjs/core'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEstado } from '../lib/store'
import type { Rol } from '../lib/tipos'
import { ROLES } from '../lib/usuarios'
import { BarraSuperior } from './BarraSuperior'
import {
  IconoAgenda,
  IconoCambiarPerfil,
  IconoCatalogos,
  IconoCerrar,
  IconoHistorial,
  IconoPlantillas,
  IconoRegistroAccesos,
  IconoReportes,
  IconoRestablecer,
  IconoUsuarios,
  type Icono,
} from './iconos'
import { cx } from './ui'

interface ItemMenu {
  ruta: string
  texto: string
  icono: Icono
  roles: Rol[]
  nota?: Partial<Record<Rol, string>>
}

// Menú por rol, según la matriz de acceso (especificación, sección 3).
export const MENU: ItemMenu[] = [
  { ruta: '/agenda', texto: 'Agenda del box', icono: IconoAgenda, roles: ['oftalmologo', 'tecnologo'] },
  { ruta: '/historial', texto: 'Historial de pacientes', icono: IconoHistorial, roles: ['oftalmologo', 'tecnologo'], nota: { tecnologo: 'Solo AV y PIO' } },
  { ruta: '/reportes', texto: 'Reportes', icono: IconoReportes, roles: ['oftalmologo', 'jefatura'] },
  { ruta: '/admin/usuarios', texto: 'Usuarios y roles', icono: IconoUsuarios, roles: ['administrador'] },
  { ruta: '/admin/plantillas', texto: 'Plantillas de atención', icono: IconoPlantillas, roles: ['administrador'] },
  { ruta: '/admin/catalogos', texto: 'Catálogos', icono: IconoCatalogos, roles: ['administrador'] },
  { ruta: '/admin/auditoria', texto: 'Registro de accesos', icono: IconoRegistroAccesos, roles: ['administrador'] },
]

export function inicioDeRol(rol: Rol): string {
  return MENU.find((m) => m.roles.includes(rol))?.ruta ?? '/'
}

function BarraLateral({ alNavegar }: { alNavegar?: () => void }) {
  const { usuario, salir, restablecer } = useEstado()
  const [confirmarReinicio, setConfirmarReinicio] = useState(false)
  const navegar = useNavigate()
  if (!usuario) return null
  const items = MENU.filter((m) => m.roles.includes(usuario.rol))

  return (
    <div className="rce-sidebar flex h-full flex-col">
      <div className="rce-workspace">
        <p className="text-[0.8125rem] font-semibold uppercase tracking-wider text-fg-muted">Policlínico</p>
        <p className="mt-1 text-base font-semibold">Oftalmología</p>
        <Tag minimal className="mt-3">{usuario.ubicacion}</Tag>
      </div>
      <nav aria-label="Menú principal" className="flex-1 overflow-y-auto py-2">
        <Menu className="rce-menu">
          <MenuDivider title={usuario.rol === 'administrador' ? 'Configuración' : usuario.rol === 'jefatura' ? 'Gestión' : 'Espacio de atención'} />
          {items.map((item) => (
            <li key={item.ruta}>
              <NavLink
                to={item.ruta}
                onClick={alNavegar}
                className={({ isActive }) =>
                  cx(
                    // Enlaces de React Router con selección y estilo del menú Blueprint.
                    'bp6-menu-item rce-menu-link',
                    isActive ? 'bp6-active' : '',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icono size={16} className={cx('shrink-0', isActive ? 'text-primary' : 'text-fg-muted')} aria-hidden="true" />
                    <span className="min-w-0">
                      {item.texto}
                      {item.nota?.[usuario.rol] && <span className="block text-[0.8125rem] font-normal text-fg-muted">{item.nota[usuario.rol]}</span>}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </Menu>
      </nav>

      <div className="border-t border-line p-3">
        <p className="px-3 text-sm font-semibold">{usuario.nombre}</p>
        <p className="px-3 text-[0.8125rem] text-fg-muted">{usuario.profesion}</p>
        <div className="mt-3 flex flex-col gap-1">
          <Button variant="minimal" alignText="start"
            type="button"
            onClick={() => {
              salir()
              navegar('/')
            }}
            className="flex min-h-10 items-center gap-3 rounded-sm px-3 py-2 text-left text-sm font-medium transition-colors duration-150 hover:bg-muted"
          >
            <IconoCambiarPerfil size={16} className="shrink-0 text-fg-muted" aria-hidden="true" />
            Cambiar de perfil
          </Button>
          <Button variant="minimal" alignText="start"
            type="button"
            onClick={() => {
              setConfirmarReinicio(true)
            }}
            className="flex min-h-10 items-center gap-3 rounded-sm px-3 py-2 text-left text-sm font-medium transition-colors duration-150 hover:bg-muted"
          >
            <IconoRestablecer size={16} className="shrink-0 text-fg-muted" aria-hidden="true" />
            Restablecer datos de prueba
          </Button>
        </div>
      </div>
      <Alert isOpen={confirmarReinicio} onCancel={() => setConfirmarReinicio(false)} onConfirm={() => { restablecer(); setConfirmarReinicio(false) }} cancelButtonText="Cancelar" confirmButtonText="Restablecer datos" intent="danger" canEscapeKeyCancel>
        <h2 className="mb-2 text-lg font-semibold">Restablecer datos de prueba</h2>
        <p>Se perderá lo registrado en este navegador durante el recorrido.</p>
      </Alert>
    </div>
  )
}

/** Título de la pestaña del navegador por pantalla (WCAG 2.4.2). */
export function useTituloPagina(titulo: string) {
  useEffect(() => {
    document.title = `${titulo} · RCE Oftalmología`
  }, [titulo])
}

export function Layout() {
  const { usuario } = useEstado()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { pathname } = useLocation()
  const contenido = useRef<HTMLElement>(null)
  const primeraCarga = useRef(true)

  // Al cambiar de pantalla se vuelve arriba y el foco pasa al contenido, como en una carga de página:
  // así "Continuar a diagnóstico" no deja al usuario al final del paso siguiente.
  useEffect(() => {
    setMenuAbierto(false)
    if (primeraCarga.current) {
      primeraCarga.current = false
      return
    }
    window.scrollTo(0, 0)
    contenido.current?.focus({ preventScroll: true })
  }, [pathname])

  if (!usuario) return null

  return (
    <div className="min-h-dvh">
      <a
        href="#contenido"
        onClick={(e) => {
          // Con HashRouter el ancla cambiaría la ruta: se mueve el foco a mano.
          e.preventDefault()
          contenido.current?.focus()
        }}
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 font-medium text-on-primary focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Saltar al contenido
      </a>
      <BarraSuperior onMenu={() => setMenuAbierto(true)}>
        <span className="rce-role-location hidden text-sm whitespace-nowrap lg:inline">
          {ROLES[usuario.rol].nombre} · {usuario.ubicacion}
        </span>
      </BarraSuperior>

      <div className="flex">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 border-r border-line bg-surface lg:block print:hidden">
          <BarraLateral />
        </aside>

        <Drawer title={<span className="flex items-center justify-between gap-3">Navegación<Button variant="minimal" aria-label="Cerrar menú" onClick={() => setMenuAbierto(false)} icon={<IconoCerrar size={20} aria-hidden="true" />} /></span>}
          isCloseButtonShown={false} isOpen={menuAbierto} onClose={() => setMenuAbierto(false)} position="left" size="280px" transitionDuration={0} className="rce-navigation-drawer"
          onOpening={(elemento) => { elemento.setAttribute('role', 'dialog'); elemento.setAttribute('aria-modal', 'true'); elemento.setAttribute('aria-label', 'Navegación') }}
          onOpened={(elemento) => elemento.querySelector<HTMLButtonElement>('[aria-label="Cerrar menú"]')?.focus()}>
          <BarraLateral alNavegar={() => setMenuAbierto(false)} />
        </Drawer>

        <main id="contenido" ref={contenido} tabIndex={-1} className="rce-main min-w-0 flex-1 px-4 py-6 focus:outline-none sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/** Título de pantalla con texto de apoyo y acciones a la derecha. */
export function TituloPantalla({ titulo, detalle, acciones }: { titulo: ReactNode; detalle?: ReactNode; acciones?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[1.375rem] font-bold sm:text-2xl">{titulo}</h1>
        {detalle && <div className="mt-1 text-fg-muted">{detalle}</div>}
      </div>
      {acciones && <div className="flex flex-wrap gap-2">{acciones}</div>}
    </div>
  )
}
