// Tipos del dominio. Reflejan el modelo de datos de docs/especificacion.md (sección 8).

export type Rol = 'oftalmologo' | 'tecnologo' | 'jefatura' | 'administrador'

export type Lateralidad = 'OD' | 'OI' | 'AO'

export type TipoAtencionId = 'general' | 'catarata' | 'glaucoma'

export type EstadoAtencion = 'en_espera' | 'con_pre_atencion' | 'en_atencion' | 'cerrado'

export type Desenlace = 'alta' | 'control' | 'examen_pendiente' | 'indicacion_quirurgica'

// Hay pacientes sin RUN: se identifica con tipo de documento + número.
export type TipoDocumento = 'RUN' | 'Pasaporte' | 'Identificador provisorio'

export interface Usuario {
  id: string
  nombre: string
  profesion: string
  rol: Rol
  ubicacion: string
}
