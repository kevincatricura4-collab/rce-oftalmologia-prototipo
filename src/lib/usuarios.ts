import type { Rol, Usuario } from './tipos'

// Usuarios de prueba, ficticios. Uno por rol del sistema.
export const USUARIOS: Usuario[] = [
  { id: 'u1', nombre: 'Dra. Paula Riquelme Soto', profesion: 'Médico oftalmólogo', rol: 'oftalmologo', ubicacion: 'Box 2' },
  { id: 'u2', nombre: 'TM Andrés Molina Vera', profesion: 'Tecnólogo médico, mención oftalmología', rol: 'tecnologo', ubicacion: 'Pre-atención' },
  { id: 'u3', nombre: 'Dr. Rodrigo Henríquez Pino', profesion: 'Médico oftalmólogo', rol: 'jefatura', ubicacion: 'Jefatura de policlínico' },
  { id: 'u4', nombre: 'Carla Núñez Bravo', profesion: 'Ingeniera en informática', rol: 'administrador', ubicacion: 'Unidad de informática' },
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
