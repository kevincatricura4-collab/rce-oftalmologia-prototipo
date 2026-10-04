import { ArrowRight, ChartBar, Eyeglasses, GearSix, Stethoscope, type Icon } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { BarraSuperior } from '../components/BarraSuperior'
import { useEstado } from '../lib/store'
import type { Rol } from '../lib/tipos'
import { ROLES } from '../lib/usuarios'
import { inicioDeRol } from '../components/Layout'

const ICONO_ROL: Record<Rol, Icon> = {
  oftalmologo: Stethoscope,
  tecnologo: Eyeglasses,
  jefatura: ChartBar,
  administrador: GearSix,
}

export function Ingreso() {
  const { ingresar, datos } = useEstado()
  // Un usuario de prueba por rol (el primero activo), para recorrer el módulo desde cada perfil.
  const perfiles = (['oftalmologo', 'tecnologo', 'jefatura', 'administrador'] as Rol[])
    .map((rol) => datos.usuarios.find((u) => u.rol === rol && u.activo))
    .filter((u) => u !== undefined)
  const navegar = useNavigate()

  return (
    <div className="min-h-dvh">
      <BarraSuperior />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold">Ingreso al módulo de consulta oftalmológica</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">
          Prototipo con datos de prueba. Cada perfil ve solo lo que le corresponde: elige uno para recorrer el
          módulo desde ese rol.
        </p>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {perfiles.map((usuario) => {
            const Icono = ICONO_ROL[usuario.rol]
            const rol = ROLES[usuario.rol]
            return (
              <li key={usuario.id}>
                <button
                  type="button"
                  onClick={() => {
                    ingresar(usuario)
                    navegar(inicioDeRol(usuario.rol))
                  }}
                  className="group flex h-full w-full flex-col rounded-lg border border-line bg-surface p-5 text-left transition-colors duration-150 hover:border-primary hover:bg-primary-soft"
                >
                  <span className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary-soft text-primary group-hover:bg-surface" aria-hidden="true">
                      <Icono size={22} />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-display text-base font-semibold">{rol.nombre}</span>
                      <span className="block truncate text-sm text-fg-muted">
                        {usuario.nombre} · {usuario.ubicacion}
                      </span>
                    </span>
                  </span>
                  <span className="mt-3 block text-sm">{rol.funciones}</span>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Ingresar como {rol.nombre.toLowerCase()}
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <p className="mt-8 text-sm text-fg-muted">
          En el sistema real el ingreso es con usuario y contraseña, y cada lectura de una ficha queda registrada
          (Ley 20.584).
        </p>
      </main>
    </div>
  )
}
