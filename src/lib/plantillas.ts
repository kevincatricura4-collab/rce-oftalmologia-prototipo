import type { CampoPlantilla, GrupoPlantilla, Plantilla, TipoAtencionId } from './tipos'

// Plantillas de tipo de atención (RF-06, RNF-07). El formulario de examen se dibuja desde
// estas definiciones: un tipo nuevo, o un campo nuevo, se agrega aquí o desde Administración,
// sin escribir pantalla. Campos tomados de las fichas en papel RCE-OFT-F01, F02 y F03.
//
// Los campos comunes usan el mismo id en los tres tipos: al cambiar de tipo de atención no se
// pierde lo escrito en ellos.

const G = {
  control: 'Control',
  av: 'Agudeza visual',
  pio: 'Presión intraocular',
  refraccion: 'Refracción',
  bio: 'Biomicroscopía',
  fondo: 'Fondo de ojo',
  nervio: 'Nervio óptico y ángulo',
  cristalino: 'Cristalino',
  funcion: 'Repercusión funcional',
  decision: 'Decisión',
  tratamiento: 'Tratamiento hipotensor',
  evolucion: 'Evolución',
} as const

const AV: CampoPlantilla[] = [
  { id: 'av_sc', etiqueta: 'AV sin corrección', grupo: G.av, lateralidad: 'por_ojo', tipo: 'decimal', desdePreAtencion: true, obligatorio: true },
  { id: 'av_cc', etiqueta: 'AV con corrección', grupo: G.av, lateralidad: 'por_ojo', tipo: 'decimal', desdePreAtencion: true },
  { id: 'av_estenopeico', etiqueta: 'AV estenopeico', grupo: G.av, lateralidad: 'por_ojo', tipo: 'decimal', desdePreAtencion: true },
]

const PIO: CampoPlantilla[] = [
  { id: 'pio', etiqueta: 'PIO', grupo: G.pio, lateralidad: 'por_ojo', tipo: 'numero', unidad: 'mmHg', desdePreAtencion: true, obligatorio: true },
]

const PIO_TOMA: CampoPlantilla[] = [
  { id: 'pio_metodo', etiqueta: 'Método de la toma', grupo: G.pio, lateralidad: 'AO', tipo: 'opcion', opciones: ['Aplanación', 'Neumotonómetro', 'Rebote'], desdePreAtencion: true },
  { id: 'pio_hora', etiqueta: 'Hora de la toma', grupo: G.pio, lateralidad: 'AO', tipo: 'texto', desdePreAtencion: true },
]

const REFRACCION: CampoPlantilla[] = [
  { id: 'ref_esfera', etiqueta: 'Esfera', grupo: G.refraccion, lateralidad: 'por_ojo', tipo: 'decimal', unidad: 'D' },
  { id: 'ref_cilindro', etiqueta: 'Cilindro', grupo: G.refraccion, lateralidad: 'por_ojo', tipo: 'decimal', unidad: 'D' },
  { id: 'ref_eje', etiqueta: 'Eje', grupo: G.refraccion, lateralidad: 'por_ojo', tipo: 'numero', unidad: '°' },
  { id: 'ref_adicion', etiqueta: 'Adición', grupo: G.refraccion, lateralidad: 'por_ojo', tipo: 'decimal', unidad: 'D' },
]

const BIOMICROSCOPIA: CampoPlantilla[] = [
  { id: 'bio_cornea', etiqueta: 'Córnea', grupo: G.bio, lateralidad: 'por_ojo', tipo: 'texto', obligatorio: true },
  { id: 'bio_camara', etiqueta: 'Cámara anterior', grupo: G.bio, lateralidad: 'por_ojo', tipo: 'texto', obligatorio: true },
  { id: 'bio_cristalino', etiqueta: 'Cristalino', grupo: G.bio, lateralidad: 'por_ojo', tipo: 'texto', obligatorio: true },
]

const FONDO: CampoPlantilla[] = [
  { id: 'fo_papila', etiqueta: 'Papila', grupo: G.fondo, lateralidad: 'por_ojo', tipo: 'texto', obligatorio: true },
  { id: 'fo_macula', etiqueta: 'Mácula', grupo: G.fondo, lateralidad: 'por_ojo', tipo: 'texto', obligatorio: true },
  { id: 'fo_retina', etiqueta: 'Retina', grupo: G.fondo, lateralidad: 'por_ojo', tipo: 'texto', obligatorio: true },
]

const GRUPOS_BASE: Record<string, GrupoPlantilla> = {
  [G.bio]: { nombre: G.bio, sinHallazgos: true },
  [G.fondo]: { nombre: G.fondo, sinHallazgos: true },
}

function grupos(...nombres: string[]): GrupoPlantilla[] {
  return nombres.map((nombre) => GRUPOS_BASE[nombre] ?? { nombre })
}

export const PLANTILLAS_INICIALES: Record<TipoAtencionId, Plantilla> = {
  general: {
    id: 'general',
    nombre: 'Consulta general',
    ficha: 'RCE-OFT-F01',
    descripcion: 'Base común: agudeza visual, PIO, refracción, biomicroscopía y fondo de ojo.',
    grupos: grupos(G.av, G.pio, G.refraccion, G.bio, G.fondo),
    campos: [...AV, ...PIO, ...PIO_TOMA, ...REFRACCION, ...BIOMICROSCOPIA, ...FONDO],
  },

  catarata: {
    id: 'catarata',
    nombre: 'Catarata',
    ficha: 'RCE-OFT-F02',
    descripcion: 'Caso resolutivo: opacidad del cristalino, repercusión funcional e indicación quirúrgica. GES.',
    grupos: grupos(G.av, G.pio, G.refraccion, G.bio, G.cristalino, G.funcion, G.fondo, G.decision),
    campos: [
      ...AV,
      ...PIO,
      ...PIO_TOMA,
      ...REFRACCION,
      ...BIOMICROSCOPIA,
      { id: 'cat_opacidad', etiqueta: 'Tipo de opacidad', grupo: G.cristalino, lateralidad: 'por_ojo', tipo: 'opcion', opciones: ['Nuclear', 'Cortical', 'Subcapsular posterior', 'Otra'], obligatorio: true },
      { id: 'cat_grado', etiqueta: 'Grado (escala 1 a 4)', grupo: G.cristalino, lateralidad: 'por_ojo', tipo: 'opcion', opciones: ['1 · incipiente', '2 · moderada', '3 · avanzada', '4 · madura'], obligatorio: true },
      { id: 'cat_reflejo', etiqueta: 'Reflejo rojo', grupo: G.cristalino, lateralidad: 'por_ojo', tipo: 'opcion', opciones: ['Presente', 'Disminuido', 'Ausente'] },
      { id: 'cat_repercusion', etiqueta: 'Repercusión funcional', grupo: G.funcion, lateralidad: 'AO', tipo: 'opciones', opciones: ['Dificultad para leer', 'Dificultad para conducir', 'Deslumbramiento', 'Ninguna'], obligatorio: true },
      { id: 'cat_comorbilidad', etiqueta: 'Comorbilidad ocular', grupo: G.funcion, lateralidad: 'AO', tipo: 'texto' },
      ...FONDO,
      { id: 'cat_indicacion', etiqueta: 'Indicación quirúrgica', grupo: G.decision, lateralidad: 'AO', tipo: 'si_no', obligatorio: true },
      { id: 'cat_ojo_operar', etiqueta: 'Ojo a operar', grupo: G.decision, lateralidad: 'AO', tipo: 'ojo', obligatorio: true, visibleSi: { campo: 'cat_indicacion', valor: 'Sí' } },
    ],
  },

  glaucoma: {
    id: 'glaucoma',
    nombre: 'Glaucoma',
    ficha: 'RCE-OFT-F03',
    descripcion: 'Control crónico: PIO, excavación y campo visual de cada ojo comparados en el tiempo. GES.',
    grupos: grupos(G.control, G.av, G.pio, G.nervio, G.bio, G.fondo, G.refraccion, G.tratamiento, G.evolucion),
    campos: [
      { id: 'gl_n_control', etiqueta: 'N° de control', grupo: G.control, lateralidad: 'AO', tipo: 'numero' },
      { id: 'gl_fecha_anterior', etiqueta: 'Fecha del control anterior', grupo: G.control, lateralidad: 'AO', tipo: 'fecha' },
      ...AV,
      ...PIO,
      { id: 'gl_pio_objetivo', etiqueta: 'PIO objetivo', grupo: G.pio, lateralidad: 'por_ojo', tipo: 'numero', unidad: 'mmHg' },
      ...PIO_TOMA,
      { id: 'gl_cd', etiqueta: 'Excavación (C/D)', grupo: G.nervio, lateralidad: 'por_ojo', tipo: 'decimal', obligatorio: true },
      { id: 'gl_paquimetria', etiqueta: 'Paquimetría', grupo: G.nervio, lateralidad: 'por_ojo', tipo: 'numero', unidad: 'µm' },
      { id: 'gl_gonioscopia', etiqueta: 'Gonioscopía', grupo: G.nervio, lateralidad: 'por_ojo', tipo: 'opcion', opciones: ['Ángulo abierto', 'Ángulo estrecho', 'Ángulo cerrado'] },
      { id: 'gl_campo_visual', etiqueta: 'Campo visual', grupo: G.nervio, lateralidad: 'por_ojo', tipo: 'texto', placeholder: 'Fecha / resultado' },
      { id: 'gl_oct', etiqueta: 'OCT', grupo: G.nervio, lateralidad: 'por_ojo', tipo: 'texto', placeholder: 'Fecha / resultado' },
      ...BIOMICROSCOPIA,
      ...FONDO,
      ...REFRACCION,
      { id: 'gl_hipotensor', etiqueta: 'Fármaco', grupo: G.tratamiento, lateralidad: 'por_ojo', tipo: 'texto' },
      { id: 'gl_posologia', etiqueta: 'Posología', grupo: G.tratamiento, lateralidad: 'por_ojo', tipo: 'texto' },
      { id: 'gl_inicio', etiqueta: 'Fecha de inicio', grupo: G.tratamiento, lateralidad: 'por_ojo', tipo: 'fecha' },
      { id: 'gl_progresion', etiqueta: 'Progresión', grupo: G.evolucion, lateralidad: 'AO', tipo: 'opcion', opciones: ['Estable', 'Progresa', 'No evaluable'], obligatorio: true },
    ],
  },
}

export const TIPOS_ATENCION: TipoAtencionId[] = ['general', 'catarata', 'glaucoma']

export const NOMBRE_TIPO: Record<TipoAtencionId, string> = {
  general: 'Consulta general',
  catarata: 'Catarata',
  glaucoma: 'Glaucoma',
}

export const SIN_HALLAZGOS = 'Sin hallazgos'

/** Un campo condicionado se muestra solo si se cumple su condición. */
export function campoVisible(campo: CampoPlantilla, hallazgos: Record<string, Partial<Record<string, string>>>): boolean {
  if (!campo.visibleSi) return true
  return hallazgos[campo.visibleSi.campo]?.AO === campo.visibleSi.valor
}
