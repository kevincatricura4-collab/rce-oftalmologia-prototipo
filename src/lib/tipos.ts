// Tipos del dominio. Reflejan el modelo de datos de docs/especificacion.md (sección 8).
// Entre paréntesis, el recurso FHIR al que se homologa cada entidad en el sistema final.

export type Rol = 'oftalmologo' | 'tecnologo' | 'jefatura' | 'administrador'

export type Ojo = 'OD' | 'OI'
export type Lateralidad = Ojo | 'AO'

export type TipoAtencionId = 'general' | 'catarata' | 'glaucoma'

export type EstadoAtencion = 'en_espera' | 'con_pre_atencion' | 'en_atencion' | 'cerrado'

export type Desenlace = 'alta' | 'control' | 'examen_pendiente' | 'indicacion_quirurgica'

// Hay pacientes sin RUN: se identifica con tipo de documento + número.
export type TipoDocumento = 'RUN' | 'Pasaporte' | 'Identificador provisorio'

/** usuario (Practitioner) */
export interface Usuario {
  id: string
  nombre: string
  run: string
  profesion: string
  rol: Rol
  ubicacion: string
  activo: boolean
}

/** paciente (Patient) */
export interface Paciente {
  id: string
  ficha: string
  tipoDocumento: TipoDocumento
  documento: string
  nombre: string
  fechaNacimiento: string // ISO aaaa-mm-dd
  sexo: 'Femenino' | 'Masculino'
  prevision: string
}

/** establecimiento (Organization) */
export interface Establecimiento {
  id: string
  codigo: string
  nombre: string
  tipo: 'CESFAM' | 'UAPO' | 'Hospital'
  comuna: string
}

/**
 * sic (ServiceRequest). Solicitud de interconsulta según la Norma Técnica 118.
 * Un campo en null es un campo que la SIC trajo vacío: se marca uno por uno.
 */
export interface Sic {
  id: string
  folio: string
  pacienteId: string
  fechaEmision: string
  establecimientoId: string
  // Puede derivar un médico o un tecnólogo médico de UAPO: se guarda nombre y profesión.
  profesional: { nombre: string; profesion: string }
  sospecha: string | null
  fundamento: string | null
  avPrevia: Record<Ojo, string> | null
  pioPrevia: Record<Ojo, string> | null
  diabetes: boolean | null
  farmacos: string | null
  ges: boolean | null
  prioridad: 'Alta' | 'Media' | 'Baja' | null
}

// ---------- Plantillas de tipo de atención (Questionnaire) ----------

export type TipoCampo =
  | 'texto' // texto corto
  | 'texto_largo'
  | 'numero'
  | 'decimal' // agudeza visual, C/D, dioptrías: coma decimal
  | 'opcion' // una opción de una lista
  | 'opciones' // varias opciones de una lista
  | 'si_no'
  | 'ojo' // elegir OD / OI / AO
  | 'fecha'

/**
 * por_ojo: un valor para OD y otro para OI (dos columnas).
 * AO: un solo valor para ambos ojos (ocupa las dos columnas).
 */
export type LateralidadCampo = 'por_ojo' | 'AO'

export interface CampoPlantilla {
  id: string
  etiqueta: string
  grupo: string
  lateralidad: LateralidadCampo
  tipo: TipoCampo
  unidad?: string
  opciones?: string[]
  /** El valor llega de la pre-atención y se marca "desde pre-atención". */
  desdePreAtencion?: boolean
  /** Exigido al cerrar la consulta (indicador 1). Nunca se exige antes. */
  obligatorio?: boolean
  /** Solo se muestra (y se exige) si otro campo tiene ese valor. */
  visibleSi?: { campo: string; valor: string }
  placeholder?: string
  /** Agregado por el administrador desde la pantalla de plantillas. */
  personalizado?: boolean
}

export interface GrupoPlantilla {
  nombre: string
  /** Atajo "Sin hallazgos" por ojo: llena los campos de texto del grupo. */
  sinHallazgos?: boolean
}

/** tipo_atencion (Questionnaire) */
export interface Plantilla {
  id: TipoAtencionId
  nombre: string
  ficha: string
  descripcion: string
  grupos: GrupoPlantilla[]
  campos: CampoPlantilla[]
}

// ---------- Registro clínico ----------

/** Valores de un campo: por ojo o AO. hallazgo (Observation) */
export type ValorCampo = Partial<Record<Lateralidad, string>>
export type Hallazgos = Record<string, ValorCampo>

export interface PreAtencion {
  avSc: Record<Ojo, string>
  avCc: Record<Ojo, string>
  avEstenopeico: Record<Ojo, string>
  pio: Record<Ojo, string>
  metodoPio: 'Aplanación' | 'Neumotonómetro' | 'Rebote' | ''
  horaPio: string
  observaciones: string
  autorId: string
  fecha: string // ISO con hora
}

/** diagnostico (Condition) */
export interface Diagnostico {
  id: string
  codigo: string
  descripcion: string
  lateralidad: Lateralidad | null
  principal: boolean
}

export interface ValoresRefraccion {
  esfera: string
  cilindro: string
  eje: string
  adicion: string
}

/** receta_optica (VisionPrescription) */
export interface RecetaOptica {
  OD: ValoresRefraccion
  OI: ValoresRefraccion
  distanciaPupilar: string
  indicaciones: string
  emitida: string | null // fecha y hora de emisión
}

/** receta_medicamento (MedicationRequest) */
export interface RecetaMedicamento {
  id: string
  farmaco: string
  dosis: string
  frecuencia: string
  duracion: string
  ojo: Lateralidad | null
  emitida: string | null
}

export type EstadoOrden = 'Emitida' | 'Resultado recibido'

/** orden_examen (ServiceRequest) */
export interface OrdenExamen {
  id: string
  examen: string
  ojo: Lateralidad | null
  indicacion: string
  estado: EstadoOrden
  referenciaResultado: string
  emitida: string | null
}

/** contrarreferencia (Communication) */
export interface Contrarreferencia {
  destinoId: string
  conducta: string
  controlSugerido: string
  emitida: string | null
}

export interface Anamnesis {
  motivo: string
  antecedentesOculares: string
  antecedentesSistemicos: string[]
  otroSistemico: string
  farmacos: string
}

/** Trazabilidad de autoría (RNF-08): quién registró qué bloque y cuándo. */
export interface RegistroAutoria {
  bloque: string
  autorId: string
  fecha: string
}

/** consulta (Encounter) */
export interface Consulta {
  id: string
  citaId: string | null // las consultas históricas no tienen cita en la agenda de hoy
  pacienteId: string
  sicId: string
  autorId: string
  tipoAtencion: TipoAtencionId
  estado: 'borrador' | 'cerrada'
  inicio: string
  cierre: string | null
  anamnesis: Anamnesis
  hallazgos: Hallazgos
  diagnosticos: Diagnostico[]
  recetaOptica: RecetaOptica | null
  recetasMedicamento: RecetaMedicamento[]
  ordenesExamen: OrdenExamen[]
  desenlace: Desenlace | null
  plazoControl: string
  examenPendiente: string
  ojoOperar: Lateralidad | null
  indicacionTratamiento: boolean | null
  contrarreferencia: Contrarreferencia | null
  resumenPaciente: { texto: string; entregado: string | null } | null
  /** Campos obligatorios del tipo que quedaron pendientes al cerrar (indicador 1). */
  cerradaConPendientes: number
  registros: RegistroAutoria[]
}

/** Cita de la agenda del box. La citación viene del SOME; aquí es de lectura. */
export interface Cita {
  id: string
  hora: string
  pacienteId: string
  sicId: string
  tipoSugerido: TipoAtencionId
  preAtencion: PreAtencion | null
  consultaId: string | null
}

/** auditoria (AuditEvent) */
export interface EventoAuditoria {
  id: string
  usuarioId: string
  accion: string
  detalle: string
  fecha: string
}

export interface Catalogos {
  farmacos: string[]
  examenes: string[]
}
