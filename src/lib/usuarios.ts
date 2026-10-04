import { formatearRun } from './formato'
import type { Rol, Usuario } from './tipos'

// Usuarios de prueba, ficticios. Uno por rol del sistema. Los RUN están en un rango que no se
// asigna (sobre 90 millones) para que ninguno coincida con una persona real.
export const USUARIOS_INICIALES: Usuario[] = [
  { id: 'u1', nombre: 'Dra. Paula Riquelme Soto', run: formatearRun(90412337), profesion: 'Médico oftalmólogo', rol: 'oftalmologo', ubicacion: 'Box 2', activo: true },
  { id: 'u2', nombre: 'TM Andrés Molina Vera', run: formatearRun(90877120), profesion: 'Tecnólogo médico, mención oftalmología', rol: 'tecnologo', ubicacion: 'Pre-atención', activo: true },
  { id: 'u3', nombre: 'Dr. Rodrigo Henríquez Pino', run: formatearRun(90155904), profesion: 'Médico oftalmólogo', rol: 'jefatura', ubicacion: 'Jefatura de policlínico', activo: true },
  { id: 'u4', nombre: 'Carla Núñez Bravo', run: formatearRun(90633018), profesion: 'Ingeniera en informática', rol: 'administrador', ubicacion: 'Unidad de informática', activo: true },
  { id: 'u5', nombre: 'Dr. Felipe Andrade Ulloa', run: formatearRun(90290461), profesion: 'Médico oftalmólogo', rol: 'oftalmologo', ubicacion: 'Box 1', activo: true },
  { id: 'u6', nombre: 'TENS Marcela Ortiz Leal', run: formatearRun(90718842), profesion: 'Técnico en enfermería de nivel superior', rol: 'tecnologo', ubicacion: 'Pre-atención', activo: true },
]

export const ROLES: Record<Rol, { nombre: string; funciones: string }> = {
  oftalmologo: {
    nombre: 'Oftalmólogo',
    funciones: 'Registra la consulta completa, diagnostica, prescribe, ordena exámenes y emite la contrarreferencia.',
  },
  tecnologo: {
    nombre: 'Tecnólogo médico / TENS',
    funciones: 'Registra la agudeza visual y la presión intraocular antes de que el paciente entre al box.',
  },
  jefatura: {
    nombre: 'Jefatura de policlínico',
    funciones: 'Consulta los reportes de actividad y los indicadores del proyecto.',
  },
  administrador: {
    nombre: 'Administrador del sistema',
    funciones: 'Gestiona usuarios, roles, catálogos y plantillas. No ve datos clínicos.',
  },
}

export const ORDEN_ROLES: Rol[] = ['oftalmologo', 'tecnologo', 'jefatura', 'administrador']
