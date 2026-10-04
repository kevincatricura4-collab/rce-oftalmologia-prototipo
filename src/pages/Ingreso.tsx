import { useNavigate } from 'react-router-dom'
import { BarraSuperior } from '../components/BarraSuperior'
import {
  IconoAvanzar,
  IconoReportes,
  IconoRolAdministrador,
  IconoRolOftalmologo,
  IconoRolTecnologo,
  type Icono,
} from '../components/iconos'
import { useEstado } from '../lib/store'
import type { Rol } from '../lib/tipos'
import { ROLES } from '../lib/usuarios'
import { inicioDeRol, useTituloPagina } from '../components/Layout'

// Cada rol se identifica por su herramienta de trabajo; la jefatura existe para ver reportes.
const ICONO_ROL: Record<Rol, Icono> = {
  oftalmologo: IconoRolOftalmologo,
  tecnologo: IconoRolTecnologo,
  jefatura: IconoReportes,
  administrador: IconoRolAdministrador,
}

export function Ingreso() {
  const { ingresar, datos } = useEstado()
  // Un usuario de prueba por rol (el primero activo), para recorrer el módulo desde cada perfil.
  const perfiles = (['oftalmologo', 'tecnologo', 'jefatura', 'administrador'] as Rol[])
    .map((rol) => datos.usuarios.find((u) => u.rol === rol && u.activo))
    .filter((u) => u !== undefined)
  const navegar = useNavigate()
  useTituloPagina('Ingreso')

  return (
    <div className="min-h-dvh">
      <BarraSuperior />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold">Ingreso al módulo de consulta oftalmológica</h1>
        <p className="mt-2 max-w-2xl text-fg-muted">
          Prototipo con datos de prueba. Cada perfil ve solo lo que le corresponde: elige uno para recorrer el
          módulo desde ese rol.
        </p>

        {/* Selector de perfil en lista, sin truncar: el outline negativo evita que overflow-hidden recorte el foco. */}
        <ul aria-label="Perfiles de prueba" className="mt-8 divide-y divide-line overflow-hidden rounded-lg border border-line bg-surface">
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
                  className="grid w-full grid-cols-[1rem_1fr] gap-x-3 gap-y-1 px-4 py-4 text-left transition-colors duration-150 hover:bg-muted focus-visible:outline-offset-[-3px] sm:grid-cols-[1rem_15rem_1fr_auto] sm:items-center sm:gap-x-5 sm:px-5"
                >
                  <Icono size={16} className="mt-1 self-start text-fg-muted" aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block font-display font-semibold">{rol.nombre}</span>
                    <span className="block text-sm text-fg-muted">
                      {usuario.nombre} · {usuario.ubicacion}
                    </span>
                  </span>
                  <span className="col-start-2 text-sm sm:col-start-auto">{rol.funciones}</span>
                  <span className="col-start-2 inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-primary sm:col-start-auto">
                    Ingresar
                    <IconoAvanzar size={16} aria-hidden="true" />
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <section aria-labelledby="recorrido" className="mt-8 rounded-lg border border-line bg-surface p-5">
          <h2 id="recorrido" className="text-base font-semibold">
            Recorrido sugerido (10 minutos)
          </h2>
          <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-[0.9375rem] marker:font-semibold marker:text-fg-muted">
            <li>
              <strong>Tecnólogo médico:</strong> registre la pre-atención del paciente de las 10:20, que está en espera.
            </li>
            <li>
              <strong>Oftalmólogo:</strong> continúe la consulta de las 08:40. Es el paciente de glaucoma de la Figura 4: AV y PIO llegan
              desde la pre-atención y al lado se ven los controles previos.
            </li>
            <li>Avance por diagnóstico, indicaciones y cierre. Al cerrar se emite la contrarreferencia y la consulta queda en solo lectura.</li>
            <li>
              <strong>Jefatura:</strong> revise los tres indicadores del proyecto.
            </li>
            <li>
              <strong>Administrador:</strong> agregue un campo a la plantilla de glaucoma y vuelva como oftalmólogo: aparece en el examen.
            </li>
          </ol>
          <p className="mt-4 border-t border-line pt-3 text-sm text-fg-muted">
            Arriba a la derecha está el modo box oscuro. Lo que registre queda guardado en este navegador; desde el menú lateral se
            vuelve a los datos originales. En el sistema real el ingreso es con usuario y contraseña, y cada lectura de una ficha queda
            registrada (Ley 20.584).
          </p>
        </section>
      </main>
    </div>
  )
}
