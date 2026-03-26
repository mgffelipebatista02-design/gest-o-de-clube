import type { ClubEvent } from '@/types'

export const mockEvents: ClubEvent[] = [
  {
    id: 'e1', titulo: 'Jogo vs FC Estrela', tipo: 'jogo',
    dataInicio: '2026-03-28T16:00:00', dataFim: '2026-03-28T18:00:00',
    local: 'Estadio Municipal', descricao: 'Campeonato Regional - Rodada 8',
    publico: true, recorrente: false, criadoPor: 'u2', criadoPorNome: 'Marcos Silva',
    adversario: 'FC Estrela', competicao: 'Campeonato Regional',
  },
  {
    id: 'e2', titulo: 'Treino Tatico', tipo: 'treino',
    dataInicio: '2026-03-27T09:00:00', dataFim: '2026-03-27T11:00:00',
    local: 'CT Clube Pro', descricao: 'Treino tatico focado em bola parada',
    publico: true, recorrente: false, criadoPor: 'u2', criadoPorNome: 'Marcos Silva',
  },
  {
    id: 'e3', titulo: 'Academia - Grupo A', tipo: 'academia',
    dataInicio: '2026-03-27T14:00:00', dataFim: '2026-03-27T15:30:00',
    local: 'Academia do CT', descricao: 'Treino de forca - membros inferiores',
    publico: false, recorrente: true, criadoPor: 'u3', criadoPorNome: 'Roberto Almeida',
  },
  {
    id: 'e4', titulo: 'Reuniao da Diretoria', tipo: 'reuniao',
    dataInicio: '2026-03-26T19:00:00', dataFim: '2026-03-26T20:30:00',
    local: 'Sala de Reunioes', descricao: 'Planejamento do segundo semestre',
    publico: false, recorrente: false, criadoPor: 'u1', criadoPorNome: 'Carlos Mendes',
  },
  {
    id: 'e5', titulo: 'Treino Fisico', tipo: 'treino',
    dataInicio: '2026-03-29T08:00:00', dataFim: '2026-03-29T10:00:00',
    local: 'CT Clube Pro', descricao: 'Treino de resistencia e velocidade',
    publico: true, recorrente: true, criadoPor: 'u3', criadoPorNome: 'Roberto Almeida',
  },
  {
    id: 'e6', titulo: 'Folga', tipo: 'folga',
    dataInicio: '2026-03-30T00:00:00', dataFim: '2026-03-30T23:59:00',
    local: '-', descricao: 'Dia de descanso apos o jogo',
    publico: true, recorrente: false, criadoPor: 'u2', criadoPorNome: 'Marcos Silva',
  },
  {
    id: 'e7', titulo: 'Jogo vs Atletico Vila', tipo: 'jogo',
    dataInicio: '2026-04-02T20:00:00', dataFim: '2026-04-02T22:00:00',
    local: 'Estadio Vila Nova', descricao: 'Campeonato Regional - Rodada 9',
    publico: true, recorrente: false, criadoPor: 'u2', criadoPorNome: 'Marcos Silva',
    adversario: 'Atletico Vila', competicao: 'Campeonato Regional',
  },
  {
    id: 'e8', titulo: 'Fisioterapia - Diego Souza', tipo: 'fisioterapia',
    dataInicio: '2026-03-27T10:00:00', dataFim: '2026-03-27T11:00:00',
    local: 'Departamento Medico', descricao: 'Sessao de fisioterapia - joelho esquerdo',
    publico: false, recorrente: true, criadoPor: 'u4', criadoPorNome: 'Ana Beatriz Costa',
  },
  {
    id: 'e9', titulo: 'Treino Tatico', tipo: 'treino',
    dataInicio: '2026-03-31T09:00:00', dataFim: '2026-03-31T11:00:00',
    local: 'CT Clube Pro', descricao: 'Ensaio de jogadas de bola parada',
    publico: true, recorrente: false, criadoPor: 'u2', criadoPorNome: 'Marcos Silva',
  },
  {
    id: 'e10', titulo: 'Pagamento - Salarios', tipo: 'pagamento',
    dataInicio: '2026-04-05T00:00:00', dataFim: '2026-04-05T23:59:00',
    local: '-', descricao: 'Pagamento de salarios do mes de marco',
    publico: false, recorrente: true, criadoPor: 'u1', criadoPorNome: 'Carlos Mendes',
  },
  {
    id: 'e11', titulo: 'Treino Tecnico', tipo: 'treino',
    dataInicio: '2026-04-01T09:00:00', dataFim: '2026-04-01T11:00:00',
    local: 'CT Clube Pro', descricao: 'Treino de finalizacao e cruzamentos',
    publico: true, recorrente: false, criadoPor: 'u2', criadoPorNome: 'Marcos Silva',
  },
  {
    id: 'e12', titulo: 'Refeicao Coletiva', tipo: 'alimentacao',
    dataInicio: '2026-03-28T12:00:00', dataFim: '2026-03-28T13:30:00',
    local: 'Refeitorio do CT', descricao: 'Almoco pre-jogo com cardapio especial',
    publico: true, recorrente: false, criadoPor: 'u3', criadoPorNome: 'Roberto Almeida',
  },
  {
    id: 'e13', titulo: 'Academia - Grupo B', tipo: 'academia',
    dataInicio: '2026-03-28T08:00:00', dataFim: '2026-03-28T09:30:00',
    local: 'Academia do CT', descricao: 'Treino de forca - membros superiores',
    publico: false, recorrente: true, criadoPor: 'u3', criadoPorNome: 'Roberto Almeida',
  },
  {
    id: 'e14', titulo: 'Treino Regenerativo', tipo: 'treino',
    dataInicio: '2026-04-03T09:00:00', dataFim: '2026-04-03T10:30:00',
    local: 'CT Clube Pro', descricao: 'Treino leve de recuperacao pos-jogo',
    publico: true, recorrente: false, criadoPor: 'u3', criadoPorNome: 'Roberto Almeida',
  },
  {
    id: 'e15', titulo: 'Jogo vs SC Progresso', tipo: 'jogo',
    dataInicio: '2026-04-06T16:00:00', dataFim: '2026-04-06T18:00:00',
    local: 'Estadio Municipal', descricao: 'Campeonato Regional - Rodada 10',
    publico: true, recorrente: false, criadoPor: 'u2', criadoPorNome: 'Marcos Silva',
    adversario: 'SC Progresso', competicao: 'Campeonato Regional',
  },
]
