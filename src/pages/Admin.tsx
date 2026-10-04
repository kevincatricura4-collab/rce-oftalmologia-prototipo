import { Plus, Trash, UserMinus, UserPlus } from '@phosphor-icons/react'
import { useState, type FormEvent } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { TituloPantalla, useTituloPagina } from '../components/Layout'
import { Aviso, Boton, Campo, Entrada, Insignia, Segmentado, Seleccion, Tarjeta } from '../components/ui'
import { camposPorGrupo } from '../lib/consulta'
import { fechaHora, nuevoId } from '../lib/formato'
import { NOMBRE_TIPO, TIPOS_ATENCION } from '../lib/plantillas'
import { useEstado, usuarioPorId } from '../lib/store'
import type { CampoPlantilla, Catalogos, LateralidadCampo, Rol, TipoAtencionId, TipoCampo } from '../lib/tipos'
import { ORDEN_ROLES, ROLES } from '../lib/usuarios'

/** Pantalla 10 — Administración (RF-16, RF-17). Sin datos clínicos. */
export function Admin() {
  const { seccion } = useParams()
  switch (seccion) {
    case 'usuarios':
      return <Usuarios />
    case 'plantillas':
      return <Plantillas />
    case 'catalogos':
      return <CatalogosAdmin />
    case 'auditoria':
      return <Auditoria />
    default:
      return <Navigate to="/admin/usuarios" replace />
  }
}

// ---------- Usuarios y roles ----------

function Usuarios() {
  useTituloPagina('Usuarios y roles')
  const { datos, usuario, guardarUsuario } = useEstado()
  const [nuevo, setNuevo] = useState({ nombre: '', run: '', profesion: '', rol: 'oftalmologo' as Rol, ubicacion: '' })
  const [error, setError] = useState('')

  const crear = (e: FormEvent) => {
    e.preventDefault()
    if (!nuevo.nombre.trim() || !nuevo.run.trim()) {
      setError('Nombre y RUN son necesarios para crear el usuario.')
      return
    }
    guardarUsuario({ id: nuevoId('u'), ...nuevo, activo: true })
    setNuevo({ nombre: '', run: '', profesion: '', rol: 'oftalmologo', ubicacion: '' })
    setError('')
  }

  return (
    <div className="mx-auto max-w-[72rem]">
      <TituloPantalla titulo="Usuarios y roles" detalle="Alta, baja y asignación de rol. Cada cambio queda en el registro de accesos." />
      <div className="relative overflow-x-auto rounded-lg border border-line bg-surface">
        <table className="w-full min-w-[44rem] border-collapse text-left">
          <caption className="sr-only">Usuarios del sistema</caption>
          <thead className="bg-muted text-sm">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-semibold">Usuario</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">RUN</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">Rol</th>
              <th scope="col" className="px-3 py-2.5 font-semibold">Estado</th>
              <th scope="col" className="px-4 py-2.5 text-right font-semibold">Acción</th>
            </tr>
          </thead>
          <tbody>
            {datos.usuarios.map((u) => (
              <tr key={u.id} className="border-t border-line">
                <td className="px-4 py-2.5">
                  <span className="block font-semibold">{u.nombre}</span>
                  <span className="block text-sm text-fg-muted">
                    {u.profesion} · {u.ubicacion}
                  </span>
                </td>
                <td className="tnum px-3 py-2.5 text-sm">{u.run}</td>
                <td className="px-3 py-2.5">
                  <Seleccion aria-label={`Rol de ${u.nombre}`} value={u.rol} disabled={u.id === usuario?.id} onChange={(e) => guardarUsuario({ ...u, rol: e.target.value as Rol })} className="h-9 w-56">
                    {ORDEN_ROLES.map((r) => (
                      <option key={r} value={r}>
                        {ROLES[r].nombre}
                      </option>
                    ))}
                  </Seleccion>
                </td>
                <td className="px-3 py-2.5">{u.activo ? <Insignia tono="ok">Activo</Insignia> : <Insignia>De baja</Insignia>}</td>
                <td className="px-4 py-2.5 text-right">
                  {u.id === usuario?.id ? (
                    <span className="text-sm text-fg-muted">Sesión actual</span>
                  ) : u.activo ? (
                    <Boton pequeno icono={UserMinus} onClick={() => confirm(`¿Dar de baja a ${u.nombre}? No podrá ingresar al sistema; sus registros se conservan.`) && guardarUsuario({ ...u, activo: false })}>
                      Dar de baja
                    </Boton>
                  ) : (
                    <Boton pequeno icono={UserPlus} onClick={() => guardarUsuario({ ...u, activo: true })}>
                      Reactivar
                    </Boton>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Tarjeta id="nuevo-usuario" titulo="Nuevo usuario" className="mt-6">
        <form onSubmit={crear} noValidate className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Campo etiqueta="Nombre completo">{(p) => <Entrada {...p} value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />}</Campo>
          <Campo etiqueta="RUN" ayuda="Datos de prueba: no usar RUN reales.">{(p) => <Entrada {...p} value={nuevo.run} placeholder="Ej.: 90.000.000-0" onChange={(e) => setNuevo({ ...nuevo, run: e.target.value })} />}</Campo>
          <Campo etiqueta="Profesión">{(p) => <Entrada {...p} value={nuevo.profesion} onChange={(e) => setNuevo({ ...nuevo, profesion: e.target.value })} />}</Campo>
          <Campo etiqueta="Rol">
            {(p) => (
              <Seleccion {...p} value={nuevo.rol} onChange={(e) => setNuevo({ ...nuevo, rol: e.target.value as Rol })}>
                {ORDEN_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLES[r].nombre}
                  </option>
                ))}
              </Seleccion>
            )}
          </Campo>
          <Campo etiqueta="Ubicación">{(p) => <Entrada {...p} value={nuevo.ubicacion} placeholder="Ej.: Box 3" onChange={(e) => setNuevo({ ...nuevo, ubicacion: e.target.value })} />}</Campo>
          <div className="flex items-end">
            <Boton type="submit" variante="primario" icono={UserPlus}>
              Crear usuario
            </Boton>
          </div>
          {error && (
            <p role="alert" className="text-sm text-danger md:col-span-2 lg:col-span-3">
              {error}
            </p>
          )}
        </form>
      </Tarjeta>
    </div>
  )
}

// ---------- Plantillas de tipo de atención ----------

const NOMBRE_TIPO_CAMPO: Record<TipoCampo, string> = {
  texto: 'Texto corto',
  texto_largo: 'Texto largo',
  numero: 'Número entero',
  decimal: 'Número con decimales',
  opcion: 'Una opción de una lista',
  opciones: 'Varias opciones de una lista',
  si_no: 'Sí / No',
  ojo: 'Elegir ojo (OD / OI / AO)',
  fecha: 'Fecha (dd-mm-aaaa)',
  hora: 'Hora (24 h)',
}

function Plantillas() {
  useTituloPagina('Plantillas de atención')
  const { datos, guardarPlantilla } = useEstado()
  const [tipo, setTipo] = useState<TipoAtencionId>('glaucoma')
  const plantilla = datos.plantillas[tipo]
  const [campo, setCampo] = useState({ etiqueta: '', grupo: plantilla.grupos[0]?.nombre ?? '', grupoNuevo: '', lateralidad: 'por_ojo' as LateralidadCampo, tipo: 'texto' as TipoCampo, opciones: '', obligatorio: false, unidad: '' })
  const [error, setError] = useState('')

  const agregar = (e: FormEvent) => {
    e.preventDefault()
    const grupo = campo.grupo === '__nuevo' ? campo.grupoNuevo.trim() : campo.grupo
    if (!campo.etiqueta.trim() || !grupo) {
      setError('El campo necesita etiqueta y grupo.')
      return
    }
    const conOpciones = campo.tipo === 'opcion' || campo.tipo === 'opciones'
    const opciones = campo.opciones.split(',').map((o) => o.trim()).filter(Boolean)
    if (conOpciones && opciones.length < 2) {
      setError('Escriba al menos dos opciones separadas por coma.')
      return
    }
    const nuevo: CampoPlantilla = {
      id: nuevoId('cp'),
      etiqueta: campo.etiqueta.trim(),
      grupo,
      lateralidad: campo.lateralidad,
      tipo: campo.tipo,
      opciones: conOpciones ? opciones : undefined,
      unidad: campo.unidad.trim() || undefined,
      obligatorio: campo.obligatorio,
      personalizado: true,
    }
    const grupos = plantilla.grupos.some((g) => g.nombre === grupo) ? plantilla.grupos : [...plantilla.grupos, { nombre: grupo }]
    guardarPlantilla({ ...plantilla, grupos, campos: [...plantilla.campos, nuevo] })
    setCampo({ ...campo, etiqueta: '', opciones: '', unidad: '', grupoNuevo: '', grupo })
    setError('')
  }

  const editar = (id: string, parcial: Partial<CampoPlantilla>) => guardarPlantilla({ ...plantilla, campos: plantilla.campos.map((c) => (c.id === id ? { ...c, ...parcial } : c)) })
  const quitar = (id: string) => guardarPlantilla({ ...plantilla, campos: plantilla.campos.filter((c) => c.id !== id) })

  return (
    <div className="mx-auto max-w-[72rem]">
      <TituloPantalla
        titulo="Plantillas de tipo de atención"
        detalle="El formulario de examen se dibuja desde estas plantillas (RNF-07): un campo agregado aquí aparece de inmediato en el paso Examen, sin programar."
      />
      <div className="mb-5">
        <Segmentado
          nombre="tipo-plantilla"
          etiqueta="Tipo de atención"
          valor={tipo}
          onCambio={(t) => {
            setTipo(t)
            setCampo((c) => ({ ...c, grupo: datos.plantillas[t].grupos[0]?.nombre ?? '' }))
          }} opciones={TIPOS_ATENCION.map((t) => ({ valor: t, texto: NOMBRE_TIPO[t] }))} />
      </div>

      <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Tarjeta id="campos" titulo={`${plantilla.nombre} · ${plantilla.ficha} · ${plantilla.campos.length} campos`}>
          <p className="mb-4 text-sm text-fg-muted">{plantilla.descripcion}</p>
          {camposPorGrupo(plantilla).map(({ grupo, campos }) => (
            <section key={grupo.nombre} className="mb-4 last:mb-0">
              <h3 className="mb-1.5 text-sm font-semibold">
                {grupo.nombre} {grupo.sinHallazgos && <span className="font-normal text-fg-muted">· con atajo "Sin hallazgos"</span>}
              </h3>
              <ul className="divide-y divide-line rounded-md border border-line">
                {campos.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 py-2">
                    <span className="min-w-0 flex-1">
                      <span className="font-medium">{c.etiqueta}</span>
                      {c.unidad && <span className="text-fg-muted"> ({c.unidad})</span>}
                      <span className="block text-[0.8125rem] text-fg-muted">
                        {c.lateralidad === 'por_ojo' ? 'Por ojo (OD / OI)' : 'Ambos ojos (AO)'} · {NOMBRE_TIPO_CAMPO[c.tipo]}
                        {c.desdePreAtencion && ' · desde pre-atención'}
                        {c.visibleSi && ` · solo si ${c.visibleSi.valor.toLowerCase()} en indicación`}
                      </span>
                    </span>
                    {c.personalizado && <Insignia tono="info">Agregado</Insignia>}
                    <label className="inline-flex min-h-9 items-center gap-2 text-sm">
                      <input type="checkbox" className="size-4 accent-primary" checked={Boolean(c.obligatorio)} onChange={(e) => editar(c.id, { obligatorio: e.target.checked })} />
                      Obligatorio al cerrar
                    </label>
                    {c.personalizado && (
                      <button type="button" onClick={() => quitar(c.id)} aria-label={`Quitar campo ${c.etiqueta}`} className="grid size-9 place-items-center rounded-md text-danger hover:bg-danger-soft">
                        <Trash size={18} aria-hidden="true" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </Tarjeta>

        <Tarjeta id="nuevo-campo" titulo="Agregar campo" className="xl:sticky xl:top-20">
          <form onSubmit={agregar} noValidate className="flex flex-col gap-4">
            <Campo etiqueta="Etiqueta">{(p) => <Entrada {...p} value={campo.etiqueta} placeholder="Ej.: Ángulo iridocorneal (Van Herick)" onChange={(e) => setCampo({ ...campo, etiqueta: e.target.value })} />}</Campo>
            <Campo etiqueta="Grupo">
              {(p) => (
                <Seleccion {...p} value={campo.grupo} onChange={(e) => setCampo({ ...campo, grupo: e.target.value })}>
                  {plantilla.grupos.map((g) => (
                    <option key={g.nombre}>{g.nombre}</option>
                  ))}
                  <option value="__nuevo">Grupo nuevo…</option>
                </Seleccion>
              )}
            </Campo>
            {campo.grupo === '__nuevo' && <Campo etiqueta="Nombre del grupo nuevo">{(p) => <Entrada {...p} value={campo.grupoNuevo} onChange={(e) => setCampo({ ...campo, grupoNuevo: e.target.value })} />}</Campo>}
            <Segmentado<LateralidadCampo>
              nombre="lateralidad-campo"
              etiqueta="Lateralidad"
              valor={campo.lateralidad}
              onCambio={(v) => setCampo({ ...campo, lateralidad: v })}
              opciones={[
                { valor: 'por_ojo', texto: 'Por ojo (OD / OI)' },
                { valor: 'AO', texto: 'Ambos ojos (AO)' },
              ]}
            />
            <Campo etiqueta="Tipo de dato">
              {(p) => (
                <Seleccion {...p} value={campo.tipo} onChange={(e) => setCampo({ ...campo, tipo: e.target.value as TipoCampo })}>
                  {(Object.keys(NOMBRE_TIPO_CAMPO) as TipoCampo[]).map((t) => (
                    <option key={t} value={t}>
                      {NOMBRE_TIPO_CAMPO[t]}
                    </option>
                  ))}
                </Seleccion>
              )}
            </Campo>
            {(campo.tipo === 'opcion' || campo.tipo === 'opciones') && (
              <Campo etiqueta="Opciones" ayuda="Separadas por coma.">{(p) => <Entrada {...p} value={campo.opciones} placeholder="Ej.: Grado I, Grado II, Grado III" onChange={(e) => setCampo({ ...campo, opciones: e.target.value })} />}</Campo>
            )}
            {(campo.tipo === 'numero' || campo.tipo === 'decimal') && <Campo etiqueta="Unidad (opcional)">{(p) => <Entrada {...p} value={campo.unidad} placeholder="Ej.: mmHg" onChange={(e) => setCampo({ ...campo, unidad: e.target.value })} />}</Campo>}
            <label className="inline-flex min-h-10 items-center gap-2">
              <input type="checkbox" className="size-4 accent-primary" checked={campo.obligatorio} onChange={(e) => setCampo({ ...campo, obligatorio: e.target.checked })} />
              Obligatorio al cerrar la consulta
            </label>
            {error && (
              <p role="alert" className="text-sm text-danger">
                {error}
              </p>
            )}
            <Boton type="submit" variante="primario" icono={Plus}>
              Agregar a {plantilla.nombre.toLowerCase()}
            </Boton>
          </form>
        </Tarjeta>
      </div>
    </div>
  )
}

// ---------- Catálogos ----------

function CatalogosAdmin() {
  useTituloPagina('Catálogos')
  const { datos, guardarCatalogos } = useEstado()
  return (
    <div className="mx-auto max-w-[72rem]">
      <TituloPantalla titulo="Catálogos" detalle="Fármacos y exámenes que se eligen en las indicaciones de la consulta." />
      <div className="grid gap-5 lg:grid-cols-2">
        <ListaCatalogo titulo="Fármacos" clave="farmacos" catalogos={datos.catalogos} onGuardar={guardarCatalogos} ejemplo="Ej.: Bimatoprost 0,01% colirio" />
        <ListaCatalogo titulo="Exámenes de apoyo" clave="examenes" catalogos={datos.catalogos} onGuardar={guardarCatalogos} ejemplo="Ej.: Ecografía ocular" />
      </div>
    </div>
  )
}

function ListaCatalogo({ titulo, clave, catalogos, onGuardar, ejemplo }: { titulo: string; clave: keyof Catalogos; catalogos: Catalogos; onGuardar: (c: Catalogos) => void; ejemplo: string }) {
  const [texto, setTexto] = useState('')
  const lista = catalogos[clave]
  const agregar = (e: FormEvent) => {
    e.preventDefault()
    const v = texto.trim()
    if (!v || lista.includes(v)) return
    onGuardar({ ...catalogos, [clave]: [...lista, v] })
    setTexto('')
  }
  return (
    <Tarjeta id={`cat-${clave}`} titulo={`${titulo} (${lista.length})`}>
      <ul className="divide-y divide-line rounded-md border border-line">
        {lista.map((item) => (
          <li key={item} className="flex min-h-11 items-center justify-between gap-3 px-3 py-1.5">
            <span className="min-w-0">{item}</span>
            <button type="button" onClick={() => onGuardar({ ...catalogos, [clave]: lista.filter((x) => x !== item) })} aria-label={`Quitar ${item}`} className="grid size-9 shrink-0 place-items-center rounded-md text-danger hover:bg-danger-soft">
              <Trash size={18} aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={agregar} className="mt-4 flex items-end gap-2">
        <Campo etiqueta={`Agregar a ${titulo.toLowerCase()}`} className="flex-1">
          {(p) => <Entrada {...p} value={texto} placeholder={ejemplo} onChange={(e) => setTexto(e.target.value)} />}
        </Campo>
        <Boton type="submit" icono={Plus}>
          Agregar
        </Boton>
      </form>
    </Tarjeta>
  )
}

// ---------- Registro de accesos ----------

function Auditoria() {
  useTituloPagina('Registro de accesos')
  const { datos } = useEstado()
  return (
    <div className="mx-auto max-w-[72rem]">
      <TituloPantalla titulo="Registro de accesos" detalle="Cada lectura de ficha y cada registro quedan con usuario, acción, fecha y hora (Ley 20.584). Se muestran referencias internas, no datos clínicos." />
      {datos.auditoria.length === 0 ? (
        <Aviso titulo="Sin eventos en este recorrido">Ingrese como oftalmólogo o tecnólogo y abra una ficha: el acceso aparecerá aquí.</Aviso>
      ) : (
        <div className="relative overflow-x-auto rounded-lg border border-line bg-surface">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <caption className="sr-only">Eventos de auditoría, del más reciente al más antiguo</caption>
            <thead className="bg-muted text-sm">
              <tr>
                <th scope="col" className="px-4 py-2.5 font-semibold">Fecha y hora</th>
                <th scope="col" className="px-3 py-2.5 font-semibold">Usuario</th>
                <th scope="col" className="px-3 py-2.5 font-semibold">Acción</th>
                <th scope="col" className="px-4 py-2.5 font-semibold">Referencia</th>
              </tr>
            </thead>
            <tbody>
              {datos.auditoria.map((a) => (
                <tr key={a.id} className="border-t border-line">
                  <td className="tnum px-4 py-2 text-sm">{fechaHora(a.fecha)}</td>
                  <td className="px-3 py-2 text-sm">{usuarioPorId(datos, a.usuarioId)?.nombre ?? '—'}</td>
                  <td className="px-3 py-2 text-sm">{a.accion}</td>
                  <td className="px-4 py-2 text-sm text-fg-muted">{a.detalle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
