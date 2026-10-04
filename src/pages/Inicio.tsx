import { HourglassMedium, SignOut } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { BarraSuperior } from '../components/BarraSuperior'
import { useEstado } from '../lib/store'
import type { Rol, Usuario } from '../lib/tipos'
import { ROLES } from '../lib/usuarios'

// Las diez pantallas del informe y quién accede a cada una (matriz de acceso, especificación sección 3).
const PANTALLAS: { numero: number; nombre: string; roles: Rol[]; nota?: Partial<Record<Rol, string>> }[] = [
  { numero: 1, nombre: 'Agenda del día del box', roles: ['oftalmologo', 'tecnologo'] },
  { numero: 2, nombre: 'Pre-atención: agudeza visual y PIO por ojo', roles: ['oftalmologo', 'tecnologo'] },
  { numero: 3, nombre: 'Consulta, paso 1: SIC de origen y anamnesis', roles: ['oftalmologo'] },
  { numero: 4, nombre: 'Consulta, paso 2: examen por ojo según tipo de atención', roles: ['oftalmologo'] },
  { numero: 5, nombre: 'Consulta, paso 3: diagnóstico CIE-10', roles: ['oftalmologo'] },
  { numero: 6, nombre: 'Consulta, paso 4: recetas y orden de examen', roles: ['oftalmologo'] },
  { numero: 7, nombre: 'Consulta, paso 5: desenlace, contrarreferencia y resumen', roles: ['oftalmologo'] },
  { numero: 8, nombre: 'Historial del paciente', roles: ['oftalmologo', 'tecnologo'], nota: { tecnologo: 'Solo AV y PIO' } },
  { numero: 9, nombre: 'Reportes de actividad e indicadores', roles: ['oftalmologo', 'jefatura'] },
  { numero: 10, nombre: 'Administración de usuarios, plantillas y catálogos', roles: ['administrador'] },
]

// Pantalla provisoria: se reemplaza por el layout con navegación cuando existan las pantallas.
export function Inicio({ usuario }: { usuario: Usuario }) {
  const { salir } = useEstado()
  const navegar = useNavigate()
  const pantallas = PANTALLAS.filter((p) => p.roles.includes(usuario.rol))

  return (
    <div className="min-h-dvh">
      <BarraSuperior>
        <span className="hidden text-sm text-fg-muted md:inline">
          {ROLES[usuario.rol].nombre} · {usuario.ubicacion}
        </span>
      </BarraSuperior>
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-2xl font-bold">{usuario.nombre}</h1>
        <p className="mt-1 text-fg-muted">
          {usuario.profesion} · {ROLES[usuario.rol].nombre}
        </p>

        <section aria-labelledby="titulo-pantallas" className="mt-8 rounded-lg border border-line bg-surface">
          <h2 id="titulo-pantallas" className="border-b border-line px-5 py-3 text-base font-semibold">
            Pantallas de este perfil
          </h2>
          <ul className="divide-y divide-line">
            {pantallas.map((p) => (
              <li key={p.numero} className="flex items-center gap-3 px-5 py-3">
                <span className="tnum w-6 shrink-0 text-sm font-semibold text-fg-muted">{p.numero}</span>
                <span className="min-w-0 flex-1">
                  {p.nombre}
                  {p.nota?.[usuario.rol] && <span className="text-fg-muted"> · {p.nota[usuario.rol]}</span>}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-warn-soft px-2 py-1 text-[0.8125rem] font-medium text-warn">
                  <HourglassMedium size={14} aria-hidden="true" />
                  En construcción
                </span>
              </li>
            ))}
          </ul>
        </section>

        <button
          type="button"
          onClick={() => {
            salir()
            navegar('/')
          }}
          className="mt-6 inline-flex h-10 items-center gap-2 rounded-md border border-line-strong px-4 text-sm font-medium transition-colors duration-150 hover:bg-muted"
        >
          <SignOut size={18} aria-hidden="true" />
          Cambiar de perfil
        </button>
      </main>
    </div>
  )
}
