import type { Payment } from '@/types'

export const mockPayments: Payment[] = [
  { id: 'p1', atletaId: 'a1', valor: 3500, vencimento: '2026-04-05', status: 'pendente', descricao: 'Salario Marco/2026' },
  { id: 'p2', atletaId: 'a2', valor: 4000, vencimento: '2026-04-05', status: 'pendente', descricao: 'Salario Marco/2026' },
  { id: 'p3', atletaId: 'a3', valor: 3800, vencimento: '2026-04-05', status: 'pendente', descricao: 'Salario Marco/2026' },
  { id: 'p4', atletaId: 'a6', valor: 3000, vencimento: '2026-03-05', status: 'atrasado', descricao: 'Salario Fevereiro/2026' },
  { id: 'p5', atletaId: 'a8', valor: 5000, vencimento: '2026-03-05', status: 'pago', descricao: 'Salario Fevereiro/2026' },
  { id: 'p6', atletaId: 'a7', valor: 3200, vencimento: '2026-03-05', status: 'pago', descricao: 'Salario Fevereiro/2026' },
  { id: 'p7', atletaId: 'a9', valor: 2800, vencimento: '2026-04-05', status: 'pendente', descricao: 'Salario Marco/2026' },
  { id: 'p8', atletaId: 'a12', valor: 3500, vencimento: '2026-03-05', status: 'atrasado', descricao: 'Salario Fevereiro/2026' },
]
