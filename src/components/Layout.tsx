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
  const navegar = useNavigate()
  if (!usuario) return null
  const items = MENU.filter((m) => m.roles.includes(usuario.rol))

  return (
    <div className="flex h-full flex-col">
      <nav aria-label="Menú principal" className="flex-1 overflow-y-auto py-2">
        <ul className="flex flex-col">
          {items.map((item) => (
            <li key={item.ruta}>
              <NavLink
                to={item.ruta}
                onClick={alNavegar}
                className={({ isActive }) =>
                  cx(
                    // Menú lateral al estilo Carbon: filas a ras y barra izquierda en el activo (no solo color).
                    'flex min-h-10 items-center gap-3 border-l-[3px] px-4 py-2 text-[0.9375rem] transition-colors duration-150 focus-visible:outline-offset-[-3px]',
                    isActive ? 'border-primary bg-muted font-semibold text-fg' : 'border-transparent font-medium text-fg hover:bg-muted',
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
        </ul>
      </nav>

      <div className="border-t border-line p-3">
        <p className="px-3 text-sm font-semibold">{usuario.nombre}</p>
        <p className="px-3 text-[0.8125rem] text-fg-muted">{usuario.profesion}</p>
        <div className="mt-3 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => {
              salir()
              navegar('/')
            }}
            className="flex min-h-10 items-center gap-3 rounded-sm px-3 py-2 text-left text-sm font-medium transition-colors duration-150 hover:bg-muted"
          >
            <IconoCambiarPerfil size={16} className="shrink-0 text-fg-muted" aria-hidden="true" />
            Cambiar de perfil
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm('¿Volver a los datos de prueba originales? Se pierde lo registrado en este recorrido.')) restablecer()
            }}
            className="flex min-h-10 items-center gap-3 rounded-sm px-3 py-2 text-left text-sm font-medium transition-colors duration-150 hover:bg-muted"
          >
            <IconoRestablecer size={16} className="shrink-0 text-fg-muted" aria-hidden="true" />
            Restablecer datos de prueba
          </button>
        </div>
      </div>
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
  const cerrarMenu = useRef<HTMLButtonElement>(null)
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

  useEffect(() => {
    if (menuAbierto) cerrarMenu.current?.focus()
  }, [menuAbierto])

  useEffect(() => {
    if (!menuAbierto) return
    const cerrar = (e: KeyboardEvent) => e.key === 'Escape' && setMenuAbierto(false)
    window.addEventListener('keydown', cerrar)
    return () => window.removeEventListener('keydown', cerrar)
  }, [menuAbierto])

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
        <span className="hidden text-sm whitespace-nowrap text-fg-muted lg:inline">
          {ROLES[usuario.rol].nombre} · {usuario.ubicacion}
        </span>
      </BarraSuperior>

      <div className="flex">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 border-r border-line bg-surface lg:block print:hidden">
          <BarraLateral />
        </aside>

        {menuAbierto && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
            <div className="absolute inset-0 bg-scrim" onClick={() => setMenuAbierto(false)} aria-hidden="true" />
            <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-surface shadow-xl">
              <div className="flex h-14 items-center justify-between border-b border-line px-4">
                <span className="font-display font-semibold">Menú</span>
                <button ref={cerrarMenu} type="button" onClick={() => setMenuAbierto(false)} aria-label="Cerrar menú" className="grid size-10 place-items-center rounded-md hover:bg-muted">
                  <IconoCerrar size={20} aria-hidden="true" />
                </button>
              </div>
              <div className="min-h-0 flex-1">
                <BarraLateral alNavegar={() => setMenuAbierto(false)} />
              </div>
            </div>
          </div>
        )}

        <main id="contenido" ref={contenido} tabIndex={-1} className="min-w-0 flex-1 px-4 py-6 focus:outline-none sm:px-6 lg:px-8">
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
