import { TopBar } from '@/components/layout/TopBar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/authStore'
import { ROLE_LABELS } from '@/types'
import type { Athlete } from '@/types'
import { format } from 'date-fns'
import { User, Mail, Phone, Calendar, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ProfilePage() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  if (!user) return null

  const isAthlete = user.role === 'atleta'
  const athlete = isAthlete ? (user as Athlete) : null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex flex-col">
      <TopBar title="Meu Perfil" />
      <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto w-full">
        {/* Profile Header */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <img src={user.foto} alt={user.nome} className="w-24 h-24 rounded-full mb-4" />
              <h2 className="text-2xl font-bold">{user.nome}</h2>
              <p className="text-muted-foreground">{user.cargo}</p>
              <Badge variant="secondary" className="mt-2">{ROLE_LABELS[user.role]}</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Informacoes Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground flex-1">Email</span>
              <span className="text-sm font-medium">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground flex-1">Telefone</span>
              <span className="text-sm font-medium">{user.telefone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground flex-1">Nascimento</span>
              <span className="text-sm font-medium">{format(new Date(user.dataNascimento), 'dd/MM/yyyy')}</span>
            </div>
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground flex-1">Cargo</span>
              <span className="text-sm font-medium">{user.cargo}</span>
            </div>
          </CardContent>
        </Card>

        {/* Athlete specific */}
        {athlete && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Dados do Atleta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold">{athlete.altura} cm</p>
                  <p className="text-xs text-muted-foreground">Altura</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-lg font-bold">{athlete.peso} kg</p>
                  <p className="text-xs text-muted-foreground">Peso</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Logout */}
        <Button variant="outline" className="w-full text-destructive border-destructive" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Sair da Conta
        </Button>
      </div>
    </div>
  )
}
