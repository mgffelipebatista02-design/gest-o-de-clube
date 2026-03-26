import type { Notification } from '@/types'

export const mockNotifications: Notification[] = [
  {
    id: 'n1', tipo: 'convocacao', titulo: 'Convocacao publicada',
    mensagem: 'Voce foi convocado para o jogo vs FC Estrela em 28/03.',
    data: '2026-03-25T14:00:00', lida: false, destinatarioId: 'a1', link: '/convocacao',
  },
  {
    id: 'n2', tipo: 'evento', titulo: 'Novo treino agendado',
    mensagem: 'Treino tatico agendado para 27/03 as 09:00.',
    data: '2026-03-25T10:00:00', lida: false, destinatarioId: 'all', link: '/calendario/evento/e2',
  },
  {
    id: 'n3', tipo: 'lesao', titulo: 'Lesao registrada',
    mensagem: 'Diego Souza: entorse no joelho esquerdo (moderada).',
    data: '2026-03-10T11:00:00', lida: true, destinatarioId: 'u2', link: '/clinico',
  },
  {
    id: 'n4', tipo: 'liberacao', titulo: 'Atleta liberado',
    mensagem: 'Matheus Costa foi liberado pelo departamento medico.',
    data: '2026-03-03T16:00:00', lida: true, destinatarioId: 'u2',
  },
  {
    id: 'n5', tipo: 'pagamento', titulo: 'Pagamento proximo',
    mensagem: 'Pagamento de salarios vence em 05/04.',
    data: '2026-03-26T08:00:00', lida: false, destinatarioId: 'u1', link: '/config',
  },
  {
    id: 'n6', tipo: 'comunicado', titulo: 'Comunicado da diretoria',
    mensagem: 'Reuniao de planejamento marcada para hoje as 19h.',
    data: '2026-03-26T09:00:00', lida: false, destinatarioId: 'all',
  },
  {
    id: 'n7', tipo: 'evento', titulo: 'Evento alterado',
    mensagem: 'O treino de 29/03 foi alterado para 08:00.',
    data: '2026-03-24T15:00:00', lida: true, destinatarioId: 'all', link: '/calendario/evento/e5',
  },
  {
    id: 'n8', tipo: 'convocacao', titulo: 'Confirme sua presenca',
    mensagem: 'Confirme sua presenca para o jogo vs FC Estrela.',
    data: '2026-03-26T07:00:00', lida: false, destinatarioId: 'a1', link: '/convocacao',
  },
  {
    id: 'n9', tipo: 'lesao', titulo: 'Atleta em transicao',
    mensagem: 'Caio Nascimento esta em fase de transicao. Previsao de retorno: 02/04.',
    data: '2026-03-23T14:00:00', lida: true, destinatarioId: 'u2',
  },
  {
    id: 'n10', tipo: 'comunicado', titulo: 'Bem-vindo ao Clube Pro',
    mensagem: 'Seu cadastro foi realizado com sucesso. Explore o app!',
    data: '2026-03-01T10:00:00', lida: true, destinatarioId: 'all',
  },
]
