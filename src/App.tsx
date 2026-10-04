import { Navigate, Route, Routes } from 'react-router-dom'
import { useEstado } from './lib/store'
import { Ingreso } from './pages/Ingreso'
import { Inicio } from './pages/Inicio'

export function App() {
  const { usuario } = useEstado()

  return (
    <Routes>
      <Route path="/" element={<Ingreso />} />
      <Route path="/inicio" element={usuario ? <Inicio usuario={usuario} /> : <Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
