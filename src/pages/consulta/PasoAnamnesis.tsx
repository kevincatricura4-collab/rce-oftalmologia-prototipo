import { TarjetaSic } from '../../components/TarjetaSic'
import { AreaTexto, Campo, Entrada, Tarjeta } from '../../components/ui'
import { ANTECEDENTES_SISTEMICOS } from '../../lib/catalogos'
import { sic as buscarSic } from '../../lib/datos'
import type { Anamnesis } from '../../lib/tipos'
import type { PropsPaso } from './contexto'

/** Pantalla 3 — Consulta, paso 1: SIC de origen y anamnesis (RF-01, RF-04). */
export function PasoAnamnesis({ consulta, soloLectura, actualizar }: PropsPaso) {
  const sic = buscarSic(consulta.sicId)
  const a = consulta.anamnesis
  const cambiar = (parcial: Partial<Anamnesis>) => actualizar((c) => ({ ...c, anamnesis: { ...c.anamnesis, ...parcial } }))

  const alternarAntecedente = (opcion: string, marcado: boolean) => {
    let lista = marcado ? [...a.antecedentesSistemicos, opcion] : a.antecedentesSistemicos.filter((x) => x !== opcion)
    // "Ninguno" excluye a los demás.
    if (marcado && opcion === 'Ninguno') lista = ['Ninguno']
    else if (marcado) lista = lista.filter((x) => x !== 'Ninguno')
    cambiar({ antecedentesSistemicos: ANTECEDENTES_SISTEMICOS.filter((x) => lista.includes(x)) })
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <TarjetaSic sic={sic} />

      <Tarjeta id="anamnesis" titulo="Anamnesis">
        <fieldset disabled={soloLectura} className="flex flex-col gap-4">
          <legend className="sr-only">Anamnesis</legend>
          <Campo etiqueta="Motivo de consulta" ayuda="Necesario para cerrar la consulta.">
            {(p) => <AreaTexto {...p} rows={2} value={a.motivo} onChange={(e) => cambiar({ motivo: e.target.value })} placeholder="Ej.: control de glaucoma, baja de visión de lejos" />}
          </Campo>
          <Campo etiqueta="Antecedentes oftalmológicos">
            {(p) => <AreaTexto {...p} rows={2} value={a.antecedentesOculares} onChange={(e) => cambiar({ antecedentesOculares: e.target.value })} placeholder="Cirugías, traumatismos, uso de lentes, glaucoma familiar" />}
          </Campo>

          <fieldset>
            <legend className="mb-1 text-[0.8125rem] font-medium text-fg-muted">Antecedentes sistémicos</legend>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {ANTECEDENTES_SISTEMICOS.map((o) => (
                <label key={o} className="inline-flex min-h-10 items-center gap-2">
                  <input type="checkbox" className="size-4 accent-primary" checked={a.antecedentesSistemicos.includes(o)} onChange={(e) => alternarAntecedente(o, e.target.checked)} />
                  {o}
                </label>
              ))}
            </div>
            {sic.diabetes !== null && (
              <p className="mt-1 text-[0.8125rem] text-fg-muted">Desde SIC: antecedente de diabetes {sic.diabetes ? 'sí' : 'no'}.</p>
            )}
          </fieldset>
          {a.antecedentesSistemicos.includes('Otro') && (
            <Campo etiqueta="Otro antecedente sistémico">
              {(p) => <Entrada {...p} value={a.otroSistemico} onChange={(e) => cambiar({ otroSistemico: e.target.value })} />}
            </Campo>
          )}

          <Campo etiqueta="Fármacos en uso" ayuda={sic.farmacos ? `Desde SIC: ${sic.farmacos}` : undefined}>
            {(p) => <AreaTexto {...p} rows={2} value={a.farmacos} onChange={(e) => cambiar({ farmacos: e.target.value })} />}
          </Campo>
        </fieldset>
      </Tarjeta>
    </div>
  )
}
