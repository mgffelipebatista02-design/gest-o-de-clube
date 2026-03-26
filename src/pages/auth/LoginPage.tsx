import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Eye, EyeOff, LogIn, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/store/authStore'
import { ROLE_LABELS } from '@/types'
import type { UserRole } from '@/types'

const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z
    .string()
    .min(8, 'Minimo 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter ao menos 1 letra maiuscula')
    .regex(/[0-9]/, 'Deve conter ao menos 1 numero')
    .regex(/[^A-Za-z0-9]/, 'Deve conter ao menos 1 caractere especial'),
})

type LoginFormData = z.infer<typeof loginSchema>

const quickLoginRoles: UserRole[] = ['admin', 'tecnico', 'atleta', 'fisioterapeuta', 'preparador']

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const loginAsRole = useAuthStore((s) => s.loginAsRole)
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    setLoginError('')
    const success = login(data.email, data.password)
    if (success) {
      const user = useAuthStore.getState().user
      navigate(user?.role === 'admin' ? '/dashboard' : '/home')
    } else {
      setLoginError('Email ou senha incorretos')
    }
  }

  const handleQuickLogin = (role: UserRole) => {
    loginAsRole(role)
    navigate(role === 'admin' ? '/dashboard' : '/home')
  }

  const handleGoogleLogin = () => {
    alert('Login com Google ainda nao disponivel. Em breve!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1B5E20] shadow-lg">
            <Shield className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1B5E20]">Clube Pro</h1>
          <p className="text-sm text-muted-foreground">
            Gestao inteligente para seu clube
          </p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold text-center">Entrar na sua conta</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-xs text-[#C62828]">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <Link
                    to="/esqueci-senha"
                    className="text-xs text-[#1565C0] hover:underline"
                  >
                    Esqueci minha senha
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-[#C62828]">{errors.password.message}</p>
                )}
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-[#C62828]">{loginError}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1B5E20] hover:bg-[#1B5E20]/90 text-white"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Entrar
              </Button>
            </form>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-muted-foreground">
                ou
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
            >
              <Globe className="w-4 h-4 mr-2" />
              Entrar com Google
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Nao tem conta?{' '}
              <Link to="/registro" className="text-[#1565C0] font-medium hover:underline">
                Criar conta
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Quick Login for Testing */}
        <Card className="shadow-sm border border-dashed border-muted-foreground/30">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Acesso rapido (ambiente de teste)
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {quickLoginRoles.map((role) => (
                <Button
                  key={role}
                  variant="outline"
                  size="sm"
                  className="text-xs border-[#4CAF50] text-[#1B5E20] hover:bg-[#4CAF50]/10"
                  onClick={() => handleQuickLogin(role)}
                >
                  {ROLE_LABELS[role]}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
