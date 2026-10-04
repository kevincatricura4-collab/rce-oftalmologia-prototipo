import type { Catalogos, Desenlace } from './tipos'

// Subconjunto oftalmológico de la CIE-10 (OMS). En el sistema final viene del catálogo
// institucional; aquí basta para la búsqueda por texto del paso de diagnóstico (RF-07).
export const CIE10: { codigo: string; descripcion: string; terminos?: string }[] = [
  { codigo: 'H40.0', descripcion: 'Sospecha de glaucoma', terminos: 'hipertensión ocular' },
  { codigo: 'H40.1', descripcion: 'Glaucoma primario de ángulo abierto', terminos: 'gpaa crónico' },
  { codigo: 'H40.2', descripcion: 'Glaucoma primario de ángulo cerrado', terminos: 'agudo' },
  { codigo: 'H40.3', descripcion: 'Glaucoma secundario a traumatismo ocular' },
  { codigo: 'H40.4', descripcion: 'Glaucoma secundario a inflamación ocular' },
  { codigo: 'H40.5', descripcion: 'Glaucoma secundario a otros trastornos del ojo', terminos: 'pseudoexfoliativo pigmentario' },
  { codigo: 'H40.9', descripcion: 'Glaucoma, no especificado' },
  { codigo: 'H25.0', descripcion: 'Catarata senil incipiente', terminos: 'cortical subcapsular' },
  { codigo: 'H25.1', descripcion: 'Catarata senil nuclear' },
  { codigo: 'H25.2', descripcion: 'Catarata senil, tipo morgagnian', terminos: 'hipermadura' },
  { codigo: 'H25.9', descripcion: 'Catarata senil, no especificada' },
  { codigo: 'H26.2', descripcion: 'Catarata complicada' },
  { codigo: 'H26.4', descripcion: 'Catarata secundaria', terminos: 'opacidad cápsula posterior' },
  { codigo: 'H26.9', descripcion: 'Catarata, no especificada' },
  { codigo: 'H52.0', descripcion: 'Hipermetropía', terminos: 'vicio de refracción' },
  { codigo: 'H52.1', descripcion: 'Miopía', terminos: 'vicio de refracción' },
  { codigo: 'H52.2', descripcion: 'Astigmatismo', terminos: 'vicio de refracción' },
  { codigo: 'H52.4', descripcion: 'Presbicia', terminos: 'vicio de refracción lentes de cerca' },
  { codigo: 'H52.7', descripcion: 'Trastorno de la refracción, no especificado', terminos: 'vicio de refracción' },
  { codigo: 'H36.0', descripcion: 'Retinopatía diabética', terminos: 'diabetes fondo de ojo' },
  { codigo: 'H35.0', descripcion: 'Retinopatía de fondo y cambios vasculares retinianos', terminos: 'hipertensiva' },
  { codigo: 'H35.3', descripcion: 'Degeneración de la mácula y del polo posterior', terminos: 'dmae macular' },
  { codigo: 'H34.8', descripcion: 'Otras oclusiones vasculares retinianas', terminos: 'trombosis vena' },
  { codigo: 'H33.0', descripcion: 'Desprendimiento de la retina con ruptura' },
  { codigo: 'H43.1', descripcion: 'Hemorragia del vítreo' },
  { codigo: 'H47.2', descripcion: 'Atrofia óptica' },
  { codigo: 'H11.0', descripcion: 'Pterigión' },
  { codigo: 'H11.1', descripcion: 'Degeneraciones y depósitos conjuntivales', terminos: 'pinguécula' },
  { codigo: 'H10.1', descripcion: 'Conjuntivitis atópica aguda', terminos: 'alérgica' },
  { codigo: 'H04.1', descripcion: 'Otros trastornos de la glándula lagrimal', terminos: 'ojo seco' },
  { codigo: 'H16.0', descripcion: 'Úlcera de la córnea', terminos: 'queratitis' },
  { codigo: 'H18.6', descripcion: 'Queratocono' },
  { codigo: 'H00.1', descripcion: 'Calacio', terminos: 'chalazión' },
  { codigo: 'H02.0', descripcion: 'Entropión y triquiasis del párpado' },
  { codigo: 'H02.1', descripcion: 'Ectropión del párpado' },
  { codigo: 'H50.0', descripcion: 'Estrabismo concomitante convergente' },
  { codigo: 'H53.0', descripcion: 'Ambliopía ex anopsia' },
  { codigo: 'H54.4', descripcion: 'Ceguera de un ojo' },
  { codigo: 'Z96.1', descripcion: 'Presencia de lentes intraoculares', terminos: 'pseudofaquia operado' },
  { codigo: 'Z01.0', descripcion: 'Examen de ojos y de la visión', terminos: 'control sano' },
]

export const CATALOGOS_INICIALES: Catalogos = {
  farmacos: [
    'Timolol 0,5% colirio',
    'Latanoprost 0,005% colirio',
    'Dorzolamida 2% colirio',
    'Brimonidina 0,2% colirio',
    'Dorzolamida 2% + timolol 0,5% colirio',
    'Acetazolamida 250 mg comprimido',
    'Hialuronato de sodio 0,1% colirio (lágrima artificial)',
    'Tobramicina 0,3% colirio',
    'Tobramicina 0,3% + dexametasona 0,1% colirio',
    'Prednisolona acetato 1% colirio',
    'Ketorolaco 0,5% colirio',
    'Olopatadina 0,1% colirio',
  ],
  examenes: ['OCT de nervio óptico', 'OCT macular', 'Campimetría computarizada', 'Topografía corneal', 'Biometría ocular'],
}

export const FRECUENCIAS = ['Cada 8 horas', 'Cada 12 horas', 'Cada 24 horas (noche)', 'Cada 6 horas', 'Cada 4 horas']
export const DURACIONES = ['7 días', '14 días', '30 días', 'Uso permanente hasta control']

export const DESENLACES: { id: Desenlace; nombre: string; detalle: string }[] = [
  { id: 'alta', nombre: 'Alta', detalle: 'Vuelve a su establecimiento de origen con contrarreferencia.' },
  { id: 'control', nombre: 'Control con plazo', detalle: 'Se cita a control en el policlínico.' },
  { id: 'examen_pendiente', nombre: 'Examen pendiente', detalle: 'Se decide con el resultado del examen ordenado.' },
  { id: 'indicacion_quirurgica', nombre: 'Indicación quirúrgica', detalle: 'Cierra esta espera y abre la quirúrgica en el SOME.' },
]

export const NOMBRE_DESENLACE: Record<Desenlace, string> = {
  alta: 'Alta',
  control: 'Control con plazo',
  examen_pendiente: 'Examen pendiente',
  indicacion_quirurgica: 'Indicación quirúrgica',
}

export const ANTECEDENTES_SISTEMICOS = ['Diabetes mellitus', 'Hipertensión arterial', 'Ninguno', 'Otro']
