import { NavLink } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { usePermissions } from '@/hooks/usePermissions'
import {
  LayoutDashboard, Calendar, Users, BarChart3, Settings,
  Home, ClipboardList, TrendingUp, User, HeartPulse,
  Dumbbell, ClipboardCheck, LogOut, Shield,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Calendar, Users, BarChart3, Settings,
  Home, ClipboardList, TrendingUp, User, HeartPulse,
  Dumbbell, ClipboardCheck,
}

export function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { navItems } = usePermissions()

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sidebar text-sidebar-foreground min-h-screen">
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
          <Shield className="w-6 h-6 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">Clube Pro</h1>
          <p className="text-xs text-sidebar-foreground/70">Gestao Esportiva</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? Home
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {user && (
        <div className="px-3 py-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <img
              src={user.foto}
              alt={user.nome}
              className="w-9 h-9 rounded-full bg-sidebar-accent"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.nome}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user.cargo}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 rounded-md hover:bg-sidebar-accent/50 transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
