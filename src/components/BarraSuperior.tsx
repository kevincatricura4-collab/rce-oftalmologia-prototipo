import { Eye, Moon, Sun, TestTube } from '@phosphor-icons/react'
import type { ReactNode } from 'react'
import { useEstado } from '../lib/store'

export function BarraSuperior({ children }: { children?: ReactNode }) {
  const { tema, alternarTema } = useEstado()
  const oscuro = tema === 'oscuro'

  return (
    <header className="flex h-14 items-center gap-3 border-b border-line bg-surface px-4 sm:px-6">
      <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary text-on-primary" aria-hidden="true">
        <Eye size={20} weight="bold" />
      </span>
      <p className="min-w-0 truncate font-display text-base font-semibold">
        RCE Oftalmología <span className="font-normal text-fg-muted">· Hospital San Lucas</span>
      </p>

      <div className="ml-auto flex items-center gap-2 sm:gap-3">
        <span className="hidden items-center gap-1.5 rounded-md border border-warn-line bg-warn-soft px-2 py-1 text-[0.8125rem] font-medium text-warn sm:inline-flex">
          <TestTube size={16} aria-hidden="true" />
          Datos de prueba
        </span>
        {children}
        <button
          type="button"
          onClick={alternarTema}
          aria-pressed={oscuro}
          title="El examen con lámpara de hendidura se hace con la luz baja"
          className="inline-flex h-10 items-center gap-2 rounded-md border border-line-strong px-3 text-sm font-medium transition-colors duration-150 hover:bg-muted"
        >
          {oscuro ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
          <span className="hidden sm:inline">{oscuro ? 'Modo claro' : 'Modo box oscuro'}</span>
          <span className="sr-only sm:hidden">{oscuro ? 'Cambiar a modo claro' : 'Cambiar a modo box oscuro'}</span>
        </button>
      </div>
    </header>
  )
}
