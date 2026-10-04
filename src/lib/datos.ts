import { FECHA_JORNADA, formatearRun } from './formato'
import type { Cita, Consulta, Establecimiento, Hallazgos, Paciente, PreAtencion, Sic, ValoresRefraccion } from './tipos'

// Datos de prueba. Todo es ficticio: nombres, RUN (rango sobre 90 millones, no asignado),
// fichas y establecimientos. Jornada de la mañana del Box 2, Hospital San Lucas.
//
// La agenda cubre los cuatro estados y los tres tipos de atención, e incluye una SIC
// incompleta, una SIC emitida por tecnólogo médico de UAPO, un paciente sin RUN y el
// paciente de la Figura 4 del informe (glaucoma, ficha 000123).

const J = FECHA_JORNADA

export const ESTABLECIMIENTOS: Establecimiento[] = [
  { id: 'e1', codigo: 'PRB-101', nombre: 'CESFAM Los Aromos', tipo: 'CESFAM', comuna: 'Santa Inés' },
  { id: 'e2', codigo: 'PRB-102', nombre: 'CESFAM Villa El Roble', tipo: 'CESFAM', comuna: 'Río Quilén' },
  { id: 'e3', codigo: 'PRB-103', nombre: 'UAPO Santa Inés', tipo: 'UAPO', comuna: 'Santa Inés' },
  { id: 'e4', codigo: 'PRB-104', nombre: 'CESFAM Lomas del Sauce', tipo: 'CESFAM', comuna: 'Santa Inés' },
  { id: 'e5', codigo: 'PRB-100', nombre: 'Hospital San Lucas', tipo: 'Hospital', comuna: 'Santa Inés' },
]

export const PACIENTES: Paciente[] = [
  { id: 'p1', ficha: '000123', tipoDocumento: 'RUN', documento: formatearRun(91234567), nombre: 'Hernán Alberto Saavedra Ruiz', fechaNacimiento: '1959-03-14', sexo: 'Masculino', prevision: 'FONASA B' },
  { id: 'p2', ficha: '000245', tipoDocumento: 'RUN', documento: formatearRun(93408112), nombre: 'María Teresa Carrasco Jara', fechaNacimiento: '1952-01-22', sexo: 'Femenino', prevision: 'FONASA A' },
  { id: 'p3', ficha: '000311', tipoDocumento: 'RUN', documento: formatearRun(97560213), nombre: 'Luis Ignacio Pereira Mella', fechaNacimiento: '1980-07-09', sexo: 'Masculino', prevision: 'FONASA C' },
  { id: 'p4', ficha: '000402', tipoDocumento: 'RUN', documento: formatearRun(94021775), nombre: 'Rosa Elvira Manríquez Toro', fechaNacimiento: '1955-05-30', sexo: 'Femenino', prevision: 'FONASA B' },
  { id: 'p5', ficha: '000518', tipoDocumento: 'RUN', documento: formatearRun(95876340), nombre: 'Jorge Patricio Fuentealba Díaz', fechaNacimiento: '1968-02-17', sexo: 'Masculino', prevision: 'FONASA D' },
  { id: 'p6', ficha: '000533', tipoDocumento: 'RUN', documento: formatearRun(96133408), nombre: 'Ana Luisa Contreras Villagrán', fechaNacimiento: '1964-11-03', sexo: 'Femenino', prevision: 'FONASA B' },
  { id: 'p7', ficha: '000547', tipoDocumento: 'Identificador provisorio', documento: 'IP-2026-004127', nombre: 'Yolanda Beatriz Gutiérrez Silva', fechaNacimiento: '1949-08-25', sexo: 'Femenino', prevision: 'FONASA A' },
  { id: 'p8', ficha: '000561', tipoDocumento: 'RUN', documento: formatearRun(98245019), nombre: 'Pedro Antonio Valdebenito Soto', fechaNacimiento: '1987-04-12', sexo: 'Masculino', prevision: 'FONASA C' },
  { id: 'p9', ficha: '000188', tipoDocumento: 'RUN', documento: formatearRun(92710386), nombre: 'Elena Margarita Sepúlveda Lagos', fechaNacimiento: '1956-06-02', sexo: 'Femenino', prevision: 'FONASA B' },
  { id: 'p10', ficha: '000572', tipoDocumento: 'RUN', documento: formatearRun(93055671), nombre: 'Juan Carlos Orellana Muñoz', fechaNacimiento: '1946-12-19', sexo: 'Masculino', prevision: 'FONASA A' },
]

const MEDICO_LOS_AROMOS = { nombre: 'Dr. Ignacio Barrera Lillo', profesion: 'Médico cirujano' }
const MEDICA_EL_ROBLE = { nombre: 'Dra. Camila Toledo Reyes', profesion: 'Médico cirujano' }
const TM_UAPO = { nombre: 'TM Sofía Cárcamo Neira', profesion: 'Tecnólogo médico, mención oftalmología (UAPO)' }
const MEDICO_LOMAS = { nombre: 'Dr. Tomás Vergara Alarcón', profesion: 'Médico cirujano' }

const ojos = (od: string, oi: string) => ({ OD: od, OI: oi })

export const SICS: Sic[] = [
  // Paciente de la Figura 4: SIC sin agudeza visual.
  { id: 's1', folio: 'SIC-2026-001284', pacienteId: 'p1', fechaEmision: '2026-01-19', establecimientoId: 'e1', profesional: MEDICO_LOS_AROMOS, sospecha: 'Glaucoma', fundamento: 'PIO elevada en control cardiovascular. Antecedente de padre con glaucoma.', avPrevia: null, pioPrevia: ojos('27', '21'), diabetes: false, farmacos: 'Losartán 50 mg', ges: true, prioridad: 'Media' },
  { id: 's2', folio: 'SIC-2026-002931', pacienteId: 'p2', fechaEmision: '2026-05-06', establecimientoId: 'e2', profesional: MEDICA_EL_ROBLE, sospecha: 'Catarata', fundamento: 'Disminución progresiva de visión en ambos ojos, mayor en OD. Dificultad para leer.', avPrevia: ojos('0,2', '0,5'), pioPrevia: ojos('15', '16'), diabetes: false, farmacos: 'Atorvastatina 20 mg', ges: true, prioridad: 'Media' },
  { id: 's3', folio: 'SIC-2026-004410', pacienteId: 'p3', fechaEmision: '2026-07-14', establecimientoId: 'e2', profesional: MEDICA_EL_ROBLE, sospecha: 'Vicio de refracción', fundamento: 'Visión borrosa de cerca y de lejos. Usa lentes antiguos.', avPrevia: ojos('0,4', '0,5'), pioPrevia: ojos('14', '14'), diabetes: false, farmacos: 'No usa', ges: false, prioridad: 'Baja' },
  { id: 's4', folio: 'SIC-2026-003377', pacienteId: 'p4', fechaEmision: '2026-06-02', establecimientoId: 'e4', profesional: MEDICO_LOMAS, sospecha: 'Catarata', fundamento: 'Deslumbramiento al conducir de noche y baja de visión OI.', avPrevia: ojos('0,6', '0,3'), pioPrevia: ojos('16', '17'), diabetes: true, farmacos: 'Metformina 850 mg, enalapril 10 mg', ges: true, prioridad: 'Media' },
  { id: 's5', folio: 'SIC-2026-005102', pacienteId: 'p5', fechaEmision: '2026-08-04', establecimientoId: 'e1', profesional: MEDICO_LOS_AROMOS, sospecha: 'Glaucoma', fundamento: 'Excavación papilar aumentada en fondo de ojo de control. PIO límite.', avPrevia: ojos('1,0', '0,9'), pioPrevia: ojos('22', '23'), diabetes: false, farmacos: 'No usa', ges: true, prioridad: 'Alta' },
  // SIC emitida por tecnólogo médico de UAPO (tamizaje de retinopatía diabética).
  { id: 's6', folio: 'SIC-2026-004988', pacienteId: 'p6', fechaEmision: '2026-07-28', establecimientoId: 'e3', profesional: TM_UAPO, sospecha: 'Retinopatía diabética', fundamento: 'Fondo de ojo de tamizaje con microaneurismas y exudados en ambos ojos.', avPrevia: ojos('0,7', '0,6'), pioPrevia: ojos('17', '16'), diabetes: true, farmacos: 'Metformina 850 mg, insulina NPH', ges: true, prioridad: 'Alta' },
  { id: 's7', folio: 'SIC-2026-003865', pacienteId: 'p7', fechaEmision: '2026-06-23', establecimientoId: 'e4', profesional: MEDICO_LOMAS, sospecha: 'Catarata', fundamento: 'Baja visión bilateral, no logra leer. Sin control oftalmológico previo.', avPrevia: ojos('0,1', '0,3'), pioPrevia: ojos('15', '15'), diabetes: false, farmacos: null, ges: true, prioridad: 'Media' },
  { id: 's8', folio: 'SIC-2026-005640', pacienteId: 'p8', fechaEmision: '2026-08-21', establecimientoId: 'e1', profesional: MEDICO_LOS_AROMOS, sospecha: 'Pterigión', fundamento: 'Lesión conjuntival nasal OD que avanza hacia córnea, irritación frecuente.', avPrevia: ojos('0,9', '1,0'), pioPrevia: ojos('13', '14'), diabetes: false, farmacos: 'No usa', ges: false, prioridad: 'Baja' },
  { id: 's9', folio: 'SIC-2025-008817', pacienteId: 'p9', fechaEmision: '2025-10-08', establecimientoId: 'e2', profesional: MEDICA_EL_ROBLE, sospecha: 'Glaucoma', fundamento: 'PIO 24 y 23 mmHg en neumotonometría de control.', avPrevia: ojos('0,8', '0,8'), pioPrevia: ojos('24', '23'), diabetes: false, farmacos: 'Levotiroxina 50 µg', ges: true, prioridad: 'Media' },
  // SIC incompleta en varios campos de la NT 118.
  { id: 's10', folio: 'SIC-2026-002204', pacienteId: 'p10', fechaEmision: '2026-04-09', establecimientoId: 'e1', profesional: MEDICO_LOS_AROMOS, sospecha: 'Catarata', fundamento: null, avPrevia: null, pioPrevia: null, diabetes: null, farmacos: 'Enalapril 10 mg', ges: true, prioridad: null },
]

function preAtencion(sc: [string, string], cc: [string, string], est: [string, string], pio: [string, string], metodo: PreAtencion['metodoPio'], horaToma: string, observaciones = ''): PreAtencion {
  return {
    avSc: ojos(...sc),
    avCc: ojos(...cc),
    avEstenopeico: ojos(...est),
    pio: ojos(...pio),
    metodoPio: metodo,
    horaPio: horaToma,
    observaciones,
    autorId: 'u2',
    fecha: `${J}T${horaToma}`,
  }
}

export const CITAS: Cita[] = [
  { id: 'c1', hora: '08:00', pacienteId: 'p3', sicId: 's3', tipoSugerido: 'general', preAtencion: preAtencion(['0,4', '0,5'], ['0,6', '0,6'], ['0,9', '1,0'], ['14', '15'], 'Neumotonómetro', '07:52', 'Trae lentes antiguos.'), consultaId: 'k-c1' },
  { id: 'c2', hora: '08:20', pacienteId: 'p2', sicId: 's2', tipoSugerido: 'catarata', preAtencion: preAtencion(['0,2', '0,5'], ['0,3', '0,6'], ['0,3', '0,6'], ['15', '16'], 'Neumotonómetro', '08:09'), consultaId: 'k-c2' },
  { id: 'c3', hora: '08:40', pacienteId: 'p1', sicId: 's1', tipoSugerido: 'glaucoma', preAtencion: preAtencion(['0,5', '0,3'], ['0,8', '0,6'], ['0,8', '0,6'], ['24', '19'], 'Aplanación', '08:31'), consultaId: 'k-c3' },
  { id: 'c4', hora: '09:00', pacienteId: 'p4', sicId: 's4', tipoSugerido: 'catarata', preAtencion: preAtencion(['0,6', '0,2'], ['0,7', '0,3'], ['0,7', '0,3'], ['16', '16'], 'Neumotonómetro', '08:48'), consultaId: 'k-c4' },
  { id: 'c5', hora: '09:20', pacienteId: 'p5', sicId: 's5', tipoSugerido: 'glaucoma', preAtencion: preAtencion(['1,0', '0,9'], ['', ''], ['', ''], ['23', '24'], 'Aplanación', '09:06', 'No usa lentes.'), consultaId: null },
  { id: 'c6', hora: '09:40', pacienteId: 'p6', sicId: 's6', tipoSugerido: 'general', preAtencion: preAtencion(['0,6', '0,6'], ['0,7', '0,6'], ['0,7', '0,7'], ['17', '17'], 'Neumotonómetro', '09:21', 'Glicemia capilar no informada. Se dilata a indicación del médico.'), consultaId: null },
  { id: 'c7', hora: '10:00', pacienteId: 'p7', sicId: 's7', tipoSugerido: 'catarata', preAtencion: preAtencion(['0,1', '0,3'], ['', ''], ['0,1', '0,3'], ['15', '14'], 'Rebote', '09:44', 'Paciente sin RUN: se identifica con identificador provisorio.'), consultaId: null },
  { id: 'c8', hora: '10:20', pacienteId: 'p8', sicId: 's8', tipoSugerido: 'general', preAtencion: null, consultaId: null },
  { id: 'c9', hora: '10:40', pacienteId: 'p9', sicId: 's9', tipoSugerido: 'glaucoma', preAtencion: null, consultaId: null },
  { id: 'c10', hora: '11:00', pacienteId: 'p10', sicId: 's10', tipoSugerido: 'catarata', preAtencion: null, consultaId: null },
]

const SIN = 'Sin hallazgos'
const bioNormal = (cristalinoOD = SIN, cristalinoOI = SIN): Hallazgos => ({
  bio_cornea: ojos(SIN, SIN),
  bio_camara: ojos(SIN, SIN),
  bio_cristalino: ojos(cristalinoOD, cristalinoOI),
})
const fondoNormal = (papilaOD = SIN, papilaOI = SIN): Hallazgos => ({
  fo_papila: ojos(papilaOD, papilaOI),
  fo_macula: ojos(SIN, SIN),
  fo_retina: ojos(SIN, SIN),
})
const ref = (esfera: string, cilindro = '', eje = '', adicion = ''): ValoresRefraccion => ({ esfera, cilindro, eje, adicion })

function base(parcial: Partial<Consulta> & Pick<Consulta, 'id' | 'pacienteId' | 'sicId' | 'tipoAtencion' | 'inicio'>): Consulta {
  return {
    citaId: null,
    autorId: 'u1',
    estado: 'cerrada',
    cierre: null,
    anamnesis: { motivo: '', antecedentesOculares: '', antecedentesSistemicos: [], otroSistemico: '', farmacos: '' },
    hallazgos: {},
    diagnosticos: [],
    recetaOptica: null,
    recetasMedicamento: [],
    ordenesExamen: [],
    desenlace: null,
    plazoControl: '',
    examenPendiente: '',
    ojoOperar: null,
    indicacionTratamiento: null,
    contrarreferencia: null,
    resumenPaciente: null,
    cerradaConPendientes: 0,
    registros: [],
    ...parcial,
  }
}

/** Control de glaucoma ya cerrado, para el historial y el panel "PIO en controles previos". */
function controlGlaucoma(id: string, pacienteId: string, sicId: string, fecha: string, n: number, pio: [string, string], cd: [string, string], campo: string, motivo: string, autorId = 'u1'): Consulta {
  return base({
    id,
    pacienteId,
    sicId,
    autorId,
    tipoAtencion: 'glaucoma',
    inicio: `${fecha}T09:10`,
    cierre: `${fecha}T09:32`,
    anamnesis: { motivo, antecedentesOculares: '', antecedentesSistemicos: [], otroSistemico: '', farmacos: '' },
    hallazgos: {
      gl_n_control: { AO: String(n) },
      av_sc: ojos('0,5', '0,4'),
      av_cc: ojos('0,8', '0,7'),
      pio: ojos(...pio),
      gl_cd: ojos(...cd),
      gl_campo_visual: ojos(campo, campo),
      gl_progresion: { AO: n === 1 ? 'No evaluable' : 'Estable' },
      ...bioNormal(),
      ...fondoNormal(`Excavación ${cd[0]}`, `Excavación ${cd[1]}`),
    },
    diagnosticos: [{ id: `${id}-d1`, codigo: 'H40.1', descripcion: 'Glaucoma primario de ángulo abierto', lateralidad: 'AO', principal: true }],
    desenlace: 'control',
    plazoControl: '3 meses',
    indicacionTratamiento: true,
    registros: [{ bloque: 'Cierre de consulta', autorId, fecha: `${fecha}T09:32` }],
  })
}

export const CONSULTAS: Consulta[] = [
  // ---- Historial ----
  controlGlaucoma('k-h1', 'p1', 's1', '2026-03-10', 1, ['26', '20'], ['0,6', '0,5'], 'Defecto arqueado superior OD', 'Primera consulta por SIC: sospecha de glaucoma.', 'u5'),
  controlGlaucoma('k-h2', 'p1', 's1', '2026-06-15', 2, ['25', '19'], ['0,6', '0,5'], 'Sin cambios respecto de marzo', 'Control. Usa timolol en OD, buena tolerancia.'),
  controlGlaucoma('k-h3', 'p9', 's9', '2025-11-20', 1, ['22', '21'], ['0,5', '0,6'], 'Normal ambos ojos', 'Primera consulta por SIC: PIO elevada.'),
  controlGlaucoma('k-h4', 'p9', 's9', '2026-04-22', 2, ['18', '17'], ['0,5', '0,6'], 'Sin progresión', 'Control con latanoprost AO.'),

  // ---- Jornada de hoy: cerradas ----
  base({
    id: 'k-c1',
    citaId: 'c1',
    pacienteId: 'p3',
    sicId: 's3',
    tipoAtencion: 'general',
    inicio: `${J}T08:02`,
    cierre: `${J}T08:24`,
    anamnesis: { motivo: 'Visión borrosa de lejos y dificultad para leer de cerca.', antecedentesOculares: 'Usa lentes desde los 20 años, receta de hace 6 años.', antecedentesSistemicos: ['Ninguno'], otroSistemico: '', farmacos: 'No usa' },
    hallazgos: {
      av_sc: ojos('0,4', '0,5'),
      av_cc: ojos('0,6', '0,6'),
      av_estenopeico: ojos('0,9', '1,0'),
      pio: ojos('14', '15'),
      pio_metodo: { AO: 'Neumotonómetro' },
      pio_hora: { AO: '07:52' },
      ref_esfera: ojos('-1,75', '-1,50'),
      ref_cilindro: ojos('-0,50', '-0,75'),
      ref_eje: ojos('180', '175'),
      ref_adicion: ojos('+1,25', '+1,25'),
      ...bioNormal(),
      ...fondoNormal(),
    },
    diagnosticos: [
      { id: 'd-c1-1', codigo: 'H52.1', descripcion: 'Miopía', lateralidad: 'AO', principal: true },
      { id: 'd-c1-2', codigo: 'H52.4', descripcion: 'Presbicia', lateralidad: 'AO', principal: false },
    ],
    recetaOptica: { OD: ref('-1,75', '-0,50', '180', '+1,25'), OI: ref('-1,50', '-0,75', '175', '+1,25'), distanciaPupilar: '63', indicaciones: 'Lentes bifocales o progresivos de uso permanente.', emitida: `${J}T08:19` },
    desenlace: 'alta',
    indicacionTratamiento: true,
    contrarreferencia: { destinoId: 'e2', conducta: 'Se indica receta óptica para lejos y cerca. Sin patología ocular asociada.', controlSugerido: 'Control de agudeza visual en UAPO en 2 años o antes si baja la visión.', emitida: `${J}T08:22` },
    resumenPaciente: { texto: 'Sus ojos están sanos. Necesita lentes nuevos para ver de lejos y de cerca. Lleve la receta a la óptica. Vuelva a su CESFAM si nota que la visión baja.', entregado: `${J}T08:24` },
    registros: [
      { bloque: 'Anamnesis', autorId: 'u1', fecha: `${J}T08:05` },
      { bloque: 'Examen', autorId: 'u1', fecha: `${J}T08:14` },
      { bloque: 'Receta óptica', autorId: 'u1', fecha: `${J}T08:19` },
      { bloque: 'Cierre de consulta', autorId: 'u1', fecha: `${J}T08:24` },
    ],
  }),
  base({
    id: 'k-c2',
    citaId: 'c2',
    pacienteId: 'p2',
    sicId: 's2',
    tipoAtencion: 'catarata',
    inicio: `${J}T08:26`,
    cierre: `${J}T08:47`,
    anamnesis: { motivo: 'Baja de visión progresiva en ambos ojos, peor en OD. No puede leer ni enhebrar.', antecedentesOculares: 'Sin cirugías oculares.', antecedentesSistemicos: ['Otro'], otroSistemico: 'Dislipidemia', farmacos: 'Atorvastatina 20 mg' },
    hallazgos: {
      av_sc: ojos('0,2', '0,5'),
      av_cc: ojos('0,3', '0,6'),
      av_estenopeico: ojos('0,3', '0,6'),
      pio: ojos('15', '16'),
      pio_metodo: { AO: 'Neumotonómetro' },
      pio_hora: { AO: '08:09' },
      ...bioNormal('Opacidad nuclear densa', 'Opacidad nuclear leve'),
      cat_opacidad: ojos('Nuclear', 'Nuclear'),
      cat_grado: ojos('3 · avanzada', '2 · moderada'),
      cat_reflejo: ojos('Disminuido', 'Presente'),
      cat_repercusion: { AO: 'Dificultad para leer; Deslumbramiento' },
      cat_comorbilidad: { AO: 'Ninguna conocida' },
      ...fondoNormal(),
      cat_indicacion: { AO: 'Sí' },
      cat_ojo_operar: { AO: 'OD' },
    },
    diagnosticos: [
      { id: 'd-c2-1', codigo: 'H25.1', descripcion: 'Catarata senil nuclear', lateralidad: 'OD', principal: true },
      { id: 'd-c2-2', codigo: 'H25.1', descripcion: 'Catarata senil nuclear', lateralidad: 'OI', principal: false },
    ],
    ordenesExamen: [{ id: 'o-c2-1', examen: 'Biometría ocular', ojo: 'OD', indicacion: 'Cálculo de lente intraocular', estado: 'Emitida', referenciaResultado: '', emitida: `${J}T08:41` }],
    desenlace: 'indicacion_quirurgica',
    ojoOperar: 'OD',
    indicacionTratamiento: false,
    resumenPaciente: { texto: 'Tiene catarata en ambos ojos, más avanzada en el ojo derecho. Se indicó operar el ojo derecho. El SOME del hospital la llamará para la cirugía; no necesita volver a pedir hora en su CESFAM.', entregado: `${J}T08:47` },
    registros: [
      { bloque: 'Anamnesis', autorId: 'u1', fecha: `${J}T08:29` },
      { bloque: 'Examen', autorId: 'u1', fecha: `${J}T08:38` },
      { bloque: 'Orden de examen', autorId: 'u1', fecha: `${J}T08:41` },
      { bloque: 'Cierre de consulta', autorId: 'u1', fecha: `${J}T08:47` },
    ],
  }),

  // ---- Jornada de hoy: en atención (borrador) ----
  // Paciente de la Figura 4 del informe.
  base({
    id: 'k-c3',
    citaId: 'c3',
    pacienteId: 'p1',
    sicId: 's1',
    tipoAtencion: 'glaucoma',
    estado: 'borrador',
    inicio: `${J}T08:49`,
    anamnesis: { motivo: 'Control de glaucoma. Refiere buena adherencia a timolol en OD.', antecedentesOculares: 'Glaucoma primario de ángulo abierto OD en tratamiento desde marzo 2026.', antecedentesSistemicos: ['Hipertensión arterial'], otroSistemico: '', farmacos: 'Losartán 50 mg; timolol 0,5% OD cada 12 horas' },
    hallazgos: {
      gl_n_control: { AO: '3' },
      gl_fecha_anterior: { AO: '15-06-2026' },
      av_sc: ojos('0,5', '0,3'),
      av_cc: ojos('0,8', '0,6'),
      av_estenopeico: ojos('0,8', '0,6'),
      pio: ojos('24', '19'),
      gl_pio_objetivo: ojos('18', '18'),
      pio_metodo: { AO: 'Aplanación' },
      pio_hora: { AO: '08:31' },
      gl_cd: ojos('0,7', '0,5'),
      gl_campo_visual: ojos('Orden enviada', 'Orden enviada'),
      ...bioNormal(),
      gl_hipotensor: ojos('Timolol 0,5% colirio', ''),
      gl_posologia: ojos('Cada 12 horas', ''),
      gl_inicio: ojos('10-03-2026', ''),
    },
    ordenesExamen: [{ id: 'o-c3-1', examen: 'Campimetría computarizada', ojo: 'AO', indicacion: 'Control de glaucoma, estrategia 24-2', estado: 'Emitida', referenciaResultado: '', emitida: `${J}T08:56` }],
    registros: [
      { bloque: 'Anamnesis', autorId: 'u1', fecha: `${J}T08:52` },
      { bloque: 'Orden de examen', autorId: 'u1', fecha: `${J}T08:56` },
    ],
  }),
  base({
    id: 'k-c4',
    citaId: 'c4',
    pacienteId: 'p4',
    sicId: 's4',
    tipoAtencion: 'catarata',
    estado: 'borrador',
    inicio: `${J}T09:04`,
    anamnesis: { motivo: 'Deslumbramiento al conducir de noche y baja de visión en OI.', antecedentesOculares: '', antecedentesSistemicos: ['Diabetes mellitus', 'Hipertensión arterial'], otroSistemico: '', farmacos: 'Metformina 850 mg, enalapril 10 mg' },
    hallazgos: {
      av_sc: ojos('0,6', '0,2'),
      av_cc: ojos('0,7', '0,3'),
      av_estenopeico: ojos('0,7', '0,3'),
      pio: ojos('16', '16'),
      pio_metodo: { AO: 'Neumotonómetro' },
      pio_hora: { AO: '08:48' },
    },
    registros: [{ bloque: 'Anamnesis', autorId: 'u1', fecha: `${J}T09:06` }],
  }),
]

export function paciente(id: string): Paciente {
  const p = PACIENTES.find((x) => x.id === id)
  if (!p) throw new Error(`Paciente ${id} no existe en los datos de prueba`)
  return p
}

export function sic(id: string): Sic {
  const s = SICS.find((x) => x.id === id)
  if (!s) throw new Error(`SIC ${id} no existe en los datos de prueba`)
  return s
}

export function establecimiento(id: string): Establecimiento {
  const e = ESTABLECIMIENTOS.find((x) => x.id === id)
  if (!e) throw new Error(`Establecimiento ${id} no existe en los datos de prueba`)
  return e
}
