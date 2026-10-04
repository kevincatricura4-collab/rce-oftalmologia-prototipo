import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Usuario } from './tipos'

export type Tema = 'claro' | 'oscuro'

interface Estado {
  usuario: Usuario | null
  ingresar: (usuario: Usuario) => void
  salir: () => void
  tema: Tema
  alternarTema: () => void
}

const Contexto = createContext<Estado | null>(null)

const CLAVE_TEMA = 'rce-tema'

function temaInicial(): Tema {
  try {
    const guardado = localStorage.getItem(CLAVE_TEMA)
    if (guardado === 'claro' || guardado === 'oscuro') return guardado
  } catch {
    // Sin almacenamiento disponible: se usa el tema por defecto.
  }
  return 'claro'
}

export function ProveedorEstado({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [tema, setTema] = useState<Tema>(temaInicial)

  useEffect(() => {
    document.documentElement.dataset.theme = tema === 'oscuro' ? 'dark' : 'light'
    try {
      localStorage.setItem(CLAVE_TEMA, tema)
    } catch {
      // La preferencia no se conserva, pero el tema igual se aplica.
    }
  }, [tema])

  const valor = useMemo<Estado>(
    () => ({
      usuario,
      ingresar: setUsuario,
      salir: () => setUsuario(null),
      tema,
      alternarTema: () => setTema((t) => (t === 'claro' ? 'oscuro' : 'claro')),
    }),
    [usuario, tema],
  )

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>
}

export function useEstado(): Estado {
  const estado = useContext(Contexto)
  if (!estado) throw new Error('useEstado debe usarse dentro de ProveedorEstado')
  return estado
}
