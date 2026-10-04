import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CATALOGOS_INICIALES } from './catalogos'
import { hallazgosDePreAtencion } from './consulta'
import { CITAS, CONSULTAS } from './datos'
import { marcaTiempo, nuevoId } from './formato'
import { PLANTILLAS_INICIALES } from './plantillas'
import type { Catalogos, Cita, Consulta, EventoAuditoria, Plantilla, PreAtencion, TipoAtencionId, Usuario } from './tipos'
import { USUARIOS_INICIALES } from './usuarios'

// Estado del prototipo. En el sistema final esto vive en el backend (FastAPI + PostgreSQL);
// aquí se guarda en el navegador para que el recorrido sobreviva a una recarga, y se puede
// volver a los datos de prueba originales desde la barra lateral.

export type Tema = 'claro' | 'oscuro'

export interface Datos {
  usuarios: Usuario[]
  citas: Cita[]
  consultas: Record<string, Consulta>
  plantillas: Record<TipoAtencionId, Plantilla>
  catalogos: Catalogos
  auditoria: EventoAuditoria[]
}

interface Estado {
  usuario: Usuario | null
  ingresar: (usuario: Usuario) => void
  salir: () => void
  tema: Tema
  alternarTema: () => void

  datos: Datos
  guardarPreAtencion: (citaId: string, pa: PreAtencion) => void
  abrirConsulta: (citaId: string) => string
  actualizarConsulta: (consultaId: string, cambio: (c: Consulta) => Consulta) => void
  registrarBloque: (consultaId: string, bloque: string) => void
  cerrarConsulta: (consultaId: string, pendientes: number) => void
  auditar: (accion: string, detalle: string) => void
  guardarUsuario: (usuario: Usuario) => void
  guardarPlantilla: (plantilla: Plantilla) => void
  guardarCatalogos: (catalogos: Catalogos) => void
  restablecer: () => void
}

const Contexto = createContext<Estado | null>(null)

const CLAVE_TEMA = 'rce-tema'
// Subir la versión cuando cambie la forma de los datos de prueba o de las plantillas: así un navegador
// que ya recorrió el prototipo no se queda con datos guardados en el formato anterior.
const CLAVE_DATOS = 'rce-datos-v2'
const CLAVE_SESION = 'rce-sesion'

function datosIniciales(): Datos {
  return {
    usuarios: structuredClone(USUARIOS_INICIALES),
    citas: structuredClone(CITAS),
    consultas: Object.fromEntries(structuredClone(CONSULTAS).map((c) => [c.id, c])),
    plantillas: structuredClone(PLANTILLAS_INICIALES),
    catalogos: structuredClone(CATALOGOS_INICIALES),
    auditoria: [],
  }
}

function leer<T>(almacen: () => Storage, clave: string): T | null {
  try {
    const crudo = almacen().getItem(clave)
    return crudo ? (JSON.parse(crudo) as T) : null
  } catch {
    return null
  }
}

function escribir(almacen: () => Storage, clave: string, valor: unknown) {
  try {
    if (valor === null) almacen().removeItem(clave)
    else almacen().setItem(clave, JSON.stringify(valor))
  } catch {
    // Sin almacenamiento disponible: el prototipo funciona igual, solo no recuerda el recorrido.
  }
}

const local = () => localStorage
const sesion = () => sessionStorage

function temaInicial(): Tema {
  const guardado = leer<Tema>(local, CLAVE_TEMA)
  return guardado === 'oscuro' ? 'oscuro' : 'claro'
}

export function ProveedorEstado({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<Tema>(temaInicial)
  const [datos, setDatos] = useState<Datos>(() => leer<Datos>(local, CLAVE_DATOS) ?? datosIniciales())
  const [usuarioId, setUsuarioId] = useState<string | null>(() => leer<string>(sesion, CLAVE_SESION))

  useEffect(() => {
    document.documentElement.dataset.theme = tema === 'oscuro' ? 'dark' : 'light'
    escribir(local, CLAVE_TEMA, tema)
  }, [tema])

  useEffect(() => escribir(local, CLAVE_DATOS, datos), [datos])
  useEffect(() => escribir(sesion, CLAVE_SESION, usuarioId), [usuarioId])

  const usuario = datos.usuarios.find((u) => u.id === usuarioId && u.activo) ?? null

  const evento = useCallback(
    (accion: string, detalle: string): EventoAuditoria => ({ id: nuevoId('a'), usuarioId: usuarioId ?? '', accion, detalle, fecha: marcaTiempo() }),
    [usuarioId],
  )

  const auditar = useCallback(
    (accion: string, detalle: string) =>
      setDatos((d) => {
        const ultimo = d.auditoria[0]
        // Evita duplicar la misma lectura en el mismo minuto (React monta dos veces en desarrollo).
        if (ultimo && ultimo.accion === accion && ultimo.detalle === detalle && ultimo.usuarioId === usuarioId && ultimo.fecha === marcaTiempo()) return d
        return { ...d, auditoria: [evento(accion, detalle), ...d.auditoria].slice(0, 200) }
      }),
    [evento, usuarioId],
  )

  const valor = useMemo<Estado>(() => {
    const autor = usuarioId ?? ''

    const actualizarConsulta: Estado['actualizarConsulta'] = (consultaId, cambio) =>
      setDatos((d) => {
        const actual = d.consultas[consultaId]
        // Una consulta cerrada queda en solo lectura (RNF-08).
        if (!actual || actual.estado === 'cerrada') return d
        return { ...d, consultas: { ...d.consultas, [consultaId]: cambio(actual) } }
      })

    return {
      usuario,
      ingresar: (u) => setUsuarioId(u.id),
      salir: () => setUsuarioId(null),
      tema,
      alternarTema: () => setTema((t) => (t === 'claro' ? 'oscuro' : 'claro')),
      datos,

      guardarPreAtencion: (citaId, pa) =>
        setDatos((d) => ({
          ...d,
          citas: d.citas.map((c) => (c.id === citaId ? { ...c, preAtencion: pa } : c)),
          auditoria: [evento('Registro de pre-atención', `Cita ${citaId}`), ...d.auditoria],
        })),

      abrirConsulta: (citaId) => {
        const cita = datos.citas.find((c) => c.id === citaId)
        if (!cita) return ''
        if (cita.consultaId) return cita.consultaId
        const id = `k-${citaId}`
        const consulta: Consulta = {
          id,
          citaId,
          pacienteId: cita.pacienteId,
          sicId: cita.sicId,
          autorId: autor,
          tipoAtencion: cita.tipoSugerido,
          estado: 'borrador',
          inicio: marcaTiempo(),
          cierre: null,
          anamnesis: { motivo: '', antecedentesOculares: '', antecedentesSistemicos: [], otroSistemico: '', farmacos: '' },
          // AV y PIO llegan precargadas desde la pre-atención.
          hallazgos: cita.preAtencion ? hallazgosDePreAtencion(cita.preAtencion) : {},
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
        }
        setDatos((d) => ({
          ...d,
          citas: d.citas.map((c) => (c.id === citaId ? { ...c, consultaId: id } : c)),
          consultas: { ...d.consultas, [id]: consulta },
          auditoria: [evento('Apertura de consulta', `Cita ${citaId}`), ...d.auditoria],
        }))
        return id
      },

      actualizarConsulta,

      registrarBloque: (consultaId, bloque) =>
        actualizarConsulta(consultaId, (c) => ({ ...c, registros: [...c.registros, { bloque, autorId: autor, fecha: marcaTiempo() }] })),

      cerrarConsulta: (consultaId, pendientes) =>
        setDatos((d) => {
          const c = d.consultas[consultaId]
          if (!c || c.estado === 'cerrada') return d
          const fecha = marcaTiempo()
          const cerrada: Consulta = {
            ...c,
            estado: 'cerrada',
            cierre: fecha,
            cerradaConPendientes: pendientes,
            registros: [...c.registros, { bloque: 'Cierre de consulta', autorId: autor, fecha }],
          }
          return {
            ...d,
            consultas: { ...d.consultas, [consultaId]: cerrada },
            auditoria: [evento('Cierre de consulta', `Consulta ${consultaId}`), ...d.auditoria],
          }
        }),

      auditar,

      guardarUsuario: (u) =>
        setDatos((d) => {
          const existe = d.usuarios.some((x) => x.id === u.id)
          return {
            ...d,
            usuarios: existe ? d.usuarios.map((x) => (x.id === u.id ? u : x)) : [...d.usuarios, u],
            auditoria: [evento(existe ? 'Modificación de usuario' : 'Alta de usuario', u.nombre), ...d.auditoria],
          }
        }),

      guardarPlantilla: (p) =>
        setDatos((d) => ({
          ...d,
          plantillas: { ...d.plantillas, [p.id]: p },
          auditoria: [evento('Modificación de plantilla', p.nombre), ...d.auditoria],
        })),

      guardarCatalogos: (catalogos) =>
        setDatos((d) => ({ ...d, catalogos, auditoria: [evento('Modificación de catálogo', 'Fármacos y exámenes'), ...d.auditoria] })),

      restablecer: () => setDatos(datosIniciales()),
    }
  }, [usuario, usuarioId, tema, datos, evento, auditar])

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useEstado(): Estado {
  const estado = useContext(Contexto)
  if (!estado) throw new Error('useEstado debe usarse dentro de ProveedorEstado')
  return estado
}

/** Busca por id en los datos de prueba (pacientes, SIC, establecimientos son de lectura). */
export function usuarioPorId(datos: Datos, id: string): Usuario | undefined {
  return datos.usuarios.find((u) => u.id === id)
}
