import { useAuthStore } from '@/store/authStore'
import { Navigate } from 'react-router-dom'
import { TecnicoHome } from './TecnicoHome'
import { AtletaHome } from './AtletaHome'
import { FisioterapeutaHome } from './FisioterapeutaHome'
import { PreparadorHome } from './PreparadorHome'

export function HomePage() {
  const user = useAuthStore((s) => s.user)

  if (!user) return <Navigate to="/login" replace />

  switch (user.role) {
    case 'admin':
      return <Navigate to="/dashboard" replace />
    case 'tecnico':
      return <TecnicoHome />
    case 'atleta':
      return <AtletaHome />
    case 'fisioterapeuta':
      return <FisioterapeutaHome />
    case 'preparador':
      return <PreparadorHome />
    default:
      return <TecnicoHome />
  }
}
