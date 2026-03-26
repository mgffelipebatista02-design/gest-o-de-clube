import { NavLink } from 'react-router-dom'
import { usePermissions } from '@/hooks/usePermissions'
import {
  LayoutDashboard, Calendar, Users, BarChart3, Settings,
  Home, ClipboardList, TrendingUp, User, HeartPulse,
  Dumbbell, ClipboardCheck,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard, Calendar, Users, BarChart3, Settings,
  Home, ClipboardList, TrendingUp, User, HeartPulse,
  Dumbbell, ClipboardCheck,
}

export function BottomNav() {
  const { navItems } = usePermissions()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? Home
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-2 py-1 text-xs font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
