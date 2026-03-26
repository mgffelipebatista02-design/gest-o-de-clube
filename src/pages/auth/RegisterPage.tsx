import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Eye, EyeOff, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/store/authStore'
import { ROLE_LABELS } from '@/types'
import type { UserRole } from '@/types'

const registerSchema = z
  .object({
    nome: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
    email: z.string().email('Email invalido'),
    senha: z
      .string()
      .min(8, 'Minimo 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter ao menos 1 letra maiuscula')
      .regex(/[0-9]/, 'Deve conter ao menos 1 numero')
      .regex(/[^A-Za-z0-9]/, 'Deve conter ao menos 1 caractere especial'),
    confirmarSenha: z.string(),
    perfil: z.enum(['admin', 'tecnico', 'preparador', 'fisioterapeuta', 'atleta']),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas nao conferem',
    path: ['confirmarSenha'],
  })

type RegisterFormData = z.infer<typeof registerSchema>

const roleOptions: UserRole[] = ['admin', 'tecnico', 'preparador', 'fisioterapeuta', 'atleta']

export default function RegisterPage() {
  const navigate = useNavigate()
  const loginAsRole = useAuthStore((s) => s.loginAsRole)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormData) => {
    loginAsRole(data.perfil as UserRole)
    navigate(data.perfil === 'admin' ? '/dashboard' : '/home')
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
          <p className="text-sm text-muted-foreground">Crie sua conta</p>
        </div>

        {/* Register Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold text-center">Cadastro</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  placeholder="Seu nome"
                  {...register('nome')}
                />
                {errors.nome && (
                  <p className="text-xs text-[#C62828]">{errors.nome.message}</p>
                )}
              </div>

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
                <Label htmlFor="perfil">Perfil</Label>
                <Select
                  onValueChange={(val) => { if (val) setValue('perfil', val as 'admin' | 'tecnico' | 'preparador' | 'fisioterapeuta' | 'atleta') }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map((role) => (
                      <SelectItem key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.perfil && (
                  <p className="text-xs text-[#C62828]">{errors.perfil.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <div className="relative">
                  <Input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('senha')}
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
                {errors.senha && (
                  <p className="text-xs text-[#C62828]">{errors.senha.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                <div className="relative">
                  <Input
                    id="confirmarSenha"
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...register('confirmarSenha')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmarSenha && (
                  <p className="text-xs text-[#C62828]">{errors.confirmarSenha.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1B5E20] hover:bg-[#1B5E20]/90 text-white"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Criar conta
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Ja tem conta?{' '}
                <Link to="/login" className="text-[#1565C0] font-medium hover:underline">
                  Entrar
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
