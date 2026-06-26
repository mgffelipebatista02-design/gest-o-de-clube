import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const forgotSchema = z.object({
  email: z.string().email('Email invalido'),
})

type ForgotFormData = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = (_data: ForgotFormData) => {
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800 shadow-lg">
            <Shield className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Clube Pro</h1>
          <p className="text-sm text-muted-foreground">Recuperar senha</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="pb-4">
            <h2 className="text-lg font-semibold text-center">Esqueci minha senha</h2>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="text-center space-y-4 py-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100">
                  <CheckCircle className="w-8 h-8 text-slate-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700">Email enviado!</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Email de recuperacao enviado. Verifique sua caixa de entrada e siga as instrucoes para redefinir sua senha.
                  </p>
                </div>
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="mt-2"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar ao login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Informe seu email cadastrado e enviaremos um link para redefinir sua senha.
                </p>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Enviar link de recuperacao
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-slate-600 hover:underline inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Voltar ao login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
