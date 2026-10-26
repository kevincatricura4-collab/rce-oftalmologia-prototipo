import { Button, Card, Tag } from '@blueprintjs/core'
import { useNavigate } from 'react-router-dom'
import { BarraSuperior } from '../components/BarraSuperior'
import { IconoAvanzar, IconoReportes, IconoRolAdministrador, IconoRolOftalmologo, IconoRolTecnologo, type Icono } from '../components/iconos'
import { inicioDeRol, useTituloPagina } from '../components/Layout'
import { useEstado } from '../lib/store'
import type { Rol } from '../lib/tipos'
import { ROLES } from '../lib/usuarios'

const ICONO_ROL: Record<Rol, Icono> = { oftalmologo: IconoRolOftalmologo, tecnologo: IconoRolTecnologo, jefatura: IconoReportes, administrador: IconoRolAdministrador }

export function Ingreso() {
  const { ingresar, datos } = useEstado()
  const navegar = useNavigate()
  const perfiles = (['oftalmologo', 'tecnologo', 'jefatura', 'administrador'] as Rol[])
    .map((rol) => datos.usuarios.find((u) => u.rol === rol && u.activo)).filter((u) => u !== undefined)
  useTituloPagina('Ingreso')
  return <div className="min-h-dvh">
    <BarraSuperior />
    <main className="rce-login">
      <div className="rce-login-intro">
        <Tag minimal intent="primary" className="mb-4">Policlínico · Hospital San Lucas</Tag>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Atención oftalmológica</h1>
        <p className="mt-4 text-base leading-relaxed text-fg-muted">Una consulta, un registro. Mediciones por ojo, decisiones clínicas y seguimiento del paciente en un mismo espacio.</p>
        <p className="mt-3 text-sm text-fg-muted">Elija un perfil para recorrer el prototipo con datos de prueba.</p>
      </div>
      <ul aria-label="Perfiles de prueba" className="rce-login-grid">
        {perfiles.map((usuario) => {
          const Icono = ICONO_ROL[usuario.rol]
          const rol = ROLES[usuario.rol]
          return <li key={usuario.id}>
            <Card className="rce-role-card">
              <div className="mb-4 flex items-center gap-3"><Icono size={20} className="text-primary" aria-hidden="true" /><h2 className="text-lg font-semibold">{rol.nombre}</h2></div>
              <p className="mb-2 text-sm text-fg-muted">{usuario.nombre} · {usuario.ubicacion}</p>
              <p className="mb-6 text-sm leading-relaxed">{rol.funciones}</p>
              <Button intent={usuario.rol === 'oftalmologo' ? 'primary' : 'none'} variant={usuario.rol === 'oftalmologo' ? 'solid' : 'outlined'} endIcon={<IconoAvanzar size={16} aria-hidden="true" />} onClick={() => { ingresar(usuario); navegar(inicioDeRol(usuario.rol)) }}>Ingresar como {rol.nombre}</Button>
            </Card>
          </li>
        })}
      </ul>
      <details className="mt-8 rounded-md border border-line bg-surface">
        <summary className="cursor-pointer p-4 font-semibold">Recorrido sugerido · 10 minutos</summary>
        <ol className="flex list-decimal flex-col gap-3 px-10 py-5 text-sm">
          <li><strong>Tecnólogo médico:</strong> registre la pre-atención del paciente de las 10:20.</li>
          <li><strong>Oftalmólogo:</strong> continúe la consulta de glaucoma de las 08:40 y compare las mediciones con los controles previos.</li>
          <li>Avance por diagnóstico, indicaciones y cierre. Emita los documentos que correspondan.</li>
          <li><strong>Jefatura:</strong> consulte los indicadores. <strong>Administrador:</strong> revise usuarios y plantillas.</li>
        </ol>
      </details>
      <p className="mt-6 text-[0.8125rem] text-fg-muted">Los cambios se guardan en este navegador. Puede restablecer los datos de prueba desde el menú de su perfil.</p>
    </main>
  </div>
}
