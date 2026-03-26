import { useAuthStore } from '@/store/authStore'
import type { UserRole } from '@/types'

interface NavItem {
  label: string
  icon: string
  path: string
}

const NAV_CONFIG: Record<UserRole, NavItem[]> = {
  admin: [
    { label: 'Dashboard', icon: 'LayoutDashboard', path: '/dashboard' },
    { label: 'Calendario', icon: 'Calendar', path: '/calendario' },
    { label: 'Elenco', icon: 'Users', path: '/elenco' },
    { label: 'Relatorios', icon: 'BarChart3', path: '/relatorios' },
    { label: 'Configuracoes', icon: 'Settings', path: '/config' },
  ],
  tecnico: [
    { label: 'Home', icon: 'Home', path: '/home' },
    { label: 'Calendario', icon: 'Calendar', path: '/calendario' },
    { label: 'Escalacao', icon: 'ClipboardList', path: '/escalacao' },
    { label: 'Desempenho', icon: 'TrendingUp', path: '/desempenho' },
    { label: 'Perfil', icon: 'User', path: '/perfil' },
  ],
  preparador: [
    { label: 'Home', icon: 'Home', path: '/home' },
    { label: 'Calendario', icon: 'Calendar', path: '/calendario' },
    { label: 'Treinos', icon: 'Dumbbell', path: '/treinos' },
    { label: 'Elenco', icon: 'Users', path: '/elenco' },
    { label: 'Perfil', icon: 'User', path: '/perfil' },
  ],
  fisioterapeuta: [
    { label: 'Home', icon: 'Home', path: '/home' },
    { label: 'Calendario', icon: 'Calendar', path: '/calendario' },
    { label: 'Clinico', icon: 'HeartPulse', path: '/clinico' },
    { label: 'Elenco', icon: 'Users', path: '/elenco' },
    { label: 'Perfil', icon: 'User', path: '/perfil' },
  ],
  atleta: [
    { label: 'Home', icon: 'Home', path: '/home' },
    { label: 'Calendario', icon: 'Calendar', path: '/calendario' },
    { label: 'Convocacao', icon: 'ClipboardCheck', path: '/convocacao' },
    { label: 'Estatisticas', icon: 'BarChart3', path: '/stats' },
    { label: 'Perfil', icon: 'User', path: '/perfil' },
  ],
  convidado: [
    { label: 'Home', icon: 'Home', path: '/home' },
    { label: 'Calendario', icon: 'Calendar', path: '/calendario' },
    { label: 'Elenco', icon: 'Users', path: '/elenco' },
    { label: 'Perfil', icon: 'User', path: '/perfil' },
  ],
}

export function usePermissions() {
  const user = useAuthStore((s) => s.user)
  const role = user?.role ?? 'convidado'

  return {
    role,
    navItems: NAV_CONFIG[role] ?? NAV_CONFIG.convidado,
    canManageUsers: role === 'admin',
    canCreateEvents: ['admin', 'tecnico', 'preparador', 'fisioterapeuta'].includes(role),
    canCreateLineup: ['admin', 'tecnico'].includes(role),
    canViewReports: ['admin', 'tecnico', 'preparador'].includes(role),
    canManageClinical: ['admin', 'fisioterapeuta'].includes(role),
    canConfirmPresence: role === 'atleta',
    canEditClub: role === 'admin',
    getHomePath: () => role === 'admin' ? '/dashboard' : '/home',
  }
}
