import assert from 'node:assert/strict'
import { mkdtemp, readFile, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { basename, join, resolve } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'

// Compila únicamente las reglas puras a un directorio temporal; no requiere otro runner.
const temporal = await mkdtemp(join(tmpdir(), 'rce-reglas-'))
try {
  execFileSync(process.execPath, [fileURLToPath(new URL('../node_modules/typescript/bin/tsc', import.meta.url)),
    ...['formato', 'documentos', 'seguimiento'].map((n) => fileURLToPath(new URL(`../src/lib/${n}.ts`, import.meta.url))),
    '--ignoreConfig', '--outDir', temporal, '--module', 'esnext', '--target', 'es2022', '--skipLibCheck', '--moduleResolution', 'bundler',
  ], { stdio: 'inherit' })
  for (const nombre of ['formato', 'documentos', 'seguimiento']) {
    const js = (await readFile(join(temporal, `${nombre}.js`), 'utf8')).replace(/from '\.\/formato'/g, "from './formato.mjs'")
    await writeFile(join(temporal, `${nombre}.mjs`), js)
  }
  const { erroresMedicamentos, erroresOptica, erroresOrden, erroresContrarreferencia } = await import(pathToFileURL(join(temporal, 'documentos.mjs')))
  const { sincronizarDecision, anexarResultado } = await import(pathToFileURL(join(temporal, 'seguimiento.mjs')))
  assert.ok(erroresMedicamentos([{ farmaco: '', dosis: '', frecuencia: '', duracion: '', ojo: null }]).length)
  assert.deepEqual(erroresMedicamentos([{ farmaco: 'Fármaco de prueba', dosis: '1 gota', frecuencia: 'Diaria', duracion: '1 mes', ojo: 'OD' }]), [])
  const vacio = { esfera: '', cilindro: '', eje: '', adicion: '' }
  assert.ok(erroresOptica({ OD: vacio, OI: vacio }).length)
  assert.deepEqual(erroresOptica({ OD: { ...vacio, esfera: '0' }, OI: vacio }), [])
  assert.ok(erroresOptica({ OD: { ...vacio, esfera: '1,5', cilindro: '-1' }, OI: vacio }).length)
  assert.ok(erroresOptica({ OD: { ...vacio, esfera: '1', eje: '181' }, OI: vacio }).length)
  assert.deepEqual(erroresOptica({ OD: { esfera: '1,5', cilindro: '-1', eje: '90', adicion: '' }, OI: vacio }), [])
  assert.ok(erroresOrden({ examen: 'OCT', ojo: null, indicacion: '' }).length)
  assert.deepEqual(erroresOrden({ examen: 'OCT', ojo: 'OD', indicacion: 'Evaluación' }), [])
  assert.ok(erroresContrarreferencia({ diagnosticos: [], desenlace: null, contrarreferencia: null }).length)
  assert.deepEqual(erroresContrarreferencia({ diagnosticos: [{ principal: true, lateralidad: 'OD' }], desenlace: 'alta', contrarreferencia: { destinoId: 'e1', conducta: 'Conducta registrada', controlSugerido: 'No corresponde' } }), [])

  const original = { tipoAtencion: 'catarata', hallazgos: {}, desenlace: null, ojoOperar: null }
  const examen = sincronizarDecision(original, { ...original, hallazgos: { cat_indicacion: { AO: 'Sí' }, cat_ojo_operar: { AO: 'OD' } } })
  assert.equal(examen.desenlace, 'indicacion_quirurgica')
  assert.equal(examen.ojoOperar, 'OD')
  const cierre = sincronizarDecision(examen, { ...examen, ojoOperar: 'OI' })
  assert.equal(cierre.hallazgos.cat_ojo_operar.AO, 'OI')
  const control = sincronizarDecision(cierre, { ...cierre, desenlace: 'control' })
  assert.equal(control.hallazgos.cat_indicacion.AO, 'No')
  assert.equal(control.ojoOperar, null)

  const cerrada = { estado: 'cerrada', cierre: '2026-10-26T10:00', ordenesExamen: [{ id: 'o1', emitida: '2026-10-26T09:00', referenciaResultado: '' }] }
  const copia = structuredClone(cerrada)
  const resultado = { id: 'r1', ordenId: 'o1', referencia: ' Informe en sala 3 ', autorId: 'u1', fecha: '2026-10-27T10:00' }
  const seguida = anexarResultado(cerrada, resultado)
  assert.deepEqual(cerrada, copia)
  assert.deepEqual(seguida.ordenesExamen, copia.ordenesExamen)
  assert.equal(seguida.cierre, cerrada.cierre)
  assert.equal(seguida.resultadosExamen[0].referencia, 'Informe en sala 3')
  assert.equal(anexarResultado(cerrada, { ...resultado, referencia: ' ' }), cerrada)
  assert.equal(anexarResultado(cerrada, { ...resultado, ordenId: 'inexistente' }), cerrada)
  const borrador = { ...cerrada, estado: 'borrador' }
  assert.equal(anexarResultado(borrador, resultado), borrador)
  assert.equal(anexarResultado(seguida, { ...resultado, id: 'r2', referencia: 'Aclaración' }).resultadosExamen.length, 2)
  console.log('Reglas verificadas: documentos, decisión de catarata y anexos posteriores inmutables.')
} finally {
  assert.ok(resolve(temporal).startsWith(resolve(tmpdir()) + (process.platform === 'win32' ? '\\' : '/')) && basename(temporal).startsWith('rce-reglas-'))
  await rm(temporal, { recursive: true, force: true })
}
