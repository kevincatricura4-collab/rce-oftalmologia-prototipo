import { Prohibit } from '@phosphor-icons/react'
import { useEffect, type ReactNode } from 'react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Layout, inicioDeRol, useTituloPagina } from './components/Layout'
import { useEstado } from './lib/store'
import type { Rol } from './lib/tipos'
import { Admin } from './pages/Admin'
import { Agenda } from './pages/Agenda'
import { Consulta } from './pages/consulta/Consulta'
import { Historial, ListaHistorial } from './pages/Historial'
import { Ingreso } from './pages/Ingreso'
import { PreAtencion } from './pages/PreAtencion'
import { Reportes } from './pages/Reportes'

/** Acceso por rol según la matriz de la especificación (sección 3). */
function Solo({ roles, children }: { roles: Rol[]; children: ReactNode }) {
  const { usuario } = useEstado()
  if (!usuario) return <Navigate to="/" replace />
  if (!roles.includes(usuario.rol)) return <SinAcceso rol={usuario.rol} />
  return children
}

function SinAcceso({ rol }: { rol: Rol }) {
  const { auditar } = useEstado()
  const { pathname } = useLocation()
  useTituloPagina('Sin acceso')
  useEffect(() => auditar('Acceso denegado por rol', pathname), [auditar, pathname])

  return (
    <div className="mx-auto max-w-xl rounded-lg border border-line bg-surface p-6 text-center">
      <Prohibit size={32} className="mx-auto text-fg-muted" aria-hidden="true" />
      <h1 className="mt-3 text-xl font-bold">Esta pantalla no corresponde a su perfil</h1>
      <p className="mt-2 text-fg-muted">Cada rol ve solo lo que necesita para su trabajo (Ley 21.719). El intento queda en el registro de accesos.</p>
      <Link to={inicioDeRol(rol)} className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 font-medium text-on-primary hover:bg-primary-hover">
        Ir a mi inicio
      </Link>
    </div>
  )
}

const CLINICOS: Rol[] = ['oftalmologo', 'tecnologo']

export function App() {
  const { usuario } = useEstado()

  return (
    <Routes>
      <Route path="/" element={usuario ? <Navigate to={inicioDeRol(usuario.rol)} replace /> : <Ingreso />} />
      <Route element={usuario ? <Layout /> : <Navigate to="/" replace />}>
        <Route path="/agenda" element={<Solo roles={CLINICOS}><Agenda /></Solo>} />
        <Route path="/pre-atencion/:citaId" element={<Solo roles={CLINICOS}><PreAtencion /></Solo>} />
        <Route path="/consulta/:consultaId/:paso?" element={<Solo roles={['oftalmologo']}><Consulta /></Solo>} />
        <Route path="/historial" element={<Solo roles={CLINICOS}><ListaHistorial /></Solo>} />
        <Route path="/historial/:pacienteId" element={<Solo roles={CLINICOS}><Historial /></Solo>} />
        <Route path="/reportes" element={<Solo roles={['oftalmologo', 'jefatura']}><Reportes /></Solo>} />
        <Route path="/admin/:seccion?" element={<Solo roles={['administrador']}><Admin /></Solo>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
