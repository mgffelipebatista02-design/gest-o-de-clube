export type UserRole = 'admin' | 'tecnico' | 'preparador' | 'fisioterapeuta' | 'atleta' | 'convidado'

export interface User {
  id: string
  nome: string
  email: string
  foto: string
  telefone: string
  cargo: string
  dataNascimento: string
  role: UserRole
  observacoes?: string
}

export type AthleteStatus = 'ativo' | 'lesionado' | 'emprestado' | 'desligado' | 'suspenso'
export type FootPreference = 'destro' | 'canhoto' | 'ambidestro'
export type Position = 'goleiro' | 'zagueiro' | 'lateral-direito' | 'lateral-esquerdo' | 'volante' | 'meia' | 'ponta-direita' | 'ponta-esquerda' | 'centroavante' | 'atacante'

export interface Athlete extends User {
  role: 'atleta'
  posicao: Position
  posicaoSecundaria?: Position
  peDominante: FootPreference
  altura: number
  peso: number
  numeroCamisa: number
  status: AthleteStatus
  dataIngresso: string
  contratoInicio?: string
  contratoFim?: string
  categoria: Category
  gols: number
  assistencias: number
  cartoesAmarelos: number
  cartoesVermelhos: number
  jogosDisputados: number
  jogosTitular: number
  minutosJogados: number
  presencaTreinos: number
  totalTreinos: number
}

export type Category = 'sub-15' | 'sub-17' | 'sub-20' | 'profissional'

export type EventType = 'jogo' | 'treino' | 'academia' | 'alimentacao' | 'folga' | 'pagamento' | 'fisioterapia' | 'reuniao'

export interface ClubEvent {
  id: string
  titulo: string
  tipo: EventType
  dataInicio: string
  dataFim: string
  local: string
  descricao: string
  publico: boolean
  recorrente: boolean
  criadoPor: string
  criadoPorNome?: string
  categoria?: Category
  adversario?: string
  competicao?: string
}

export type ConfirmationStatus = 'confirmado' | 'ausencia-justificada' | 'nao-confirmou'

export interface EventConfirmation {
  eventoId: string
  atletaId: string
  status: ConfirmationStatus
}

export type Formation = '4-4-2' | '4-3-3' | '3-5-2' | '4-2-3-1' | '4-1-4-1' | '3-4-3'

export interface Convocation {
  id: string
  eventoId: string
  criadoPor: string
  data: string
  atletasConvocados: string[]
  confirmacoes: EventConfirmation[]
}

export interface Lineup {
  id: string
  convocacaoId: string
  formacao: Formation
  titulares: LineupPlayer[]
  reservas: LineupPlayer[]
}

export interface LineupPlayer {
  atletaId: string
  posicaoX: number
  posicaoY: number
  posicaoTatica: string
}

export type InjurySeverity = 'leve' | 'moderada' | 'grave'
export type InjuryStatus = 'em-tratamento' | 'em-transicao' | 'liberado'

export interface Injury {
  id: string
  atletaId: string
  tipo: string
  regiao: string
  dataRegistro: string
  gravidade: InjurySeverity
  status: InjuryStatus
  protocolo: string
  previsaoRetorno?: string
  dataLiberacao?: string
  registradoPor: string
  atendimentos: ClinicalAppointment[]
}

export interface ClinicalAppointment {
  id: string
  data: string
  descricao: string
  profissional: string
}

export interface Evaluation {
  id: string
  atletaId: string
  eventoId: string
  nota: number
  comentario: string
  data: string
  avaliador: string
}

export type NotificationType = 'evento' | 'convocacao' | 'lesao' | 'liberacao' | 'pagamento' | 'comunicado'

export interface Notification {
  id: string
  tipo: NotificationType
  titulo: string
  mensagem: string
  data: string
  lida: boolean
  destinatarioId: string
  link?: string
}

export type PaymentStatus = 'pendente' | 'atrasado' | 'pago'

export interface Payment {
  id: string
  atletaId: string
  valor: number
  vencimento: string
  status: PaymentStatus
  descricao: string
}

export interface Club {
  nomeOficial: string
  nomeFantasia: string
  escudo: string
  corPrimaria: string
  corSecundaria: string
  anoFundacao: number
  endereco: string
  localTreino: string
  categorias: Category[]
  redesSociais: { instagram?: string; facebook?: string; twitter?: string }
}

export const EVENT_COLORS: Record<EventType, string> = {
  jogo: '#C62828',
  treino: '#2E7D32',
  academia: '#F9A825',
  alimentacao: '#E65100',
  folga: '#7B1FA2',
  pagamento: '#1565C0',
  fisioterapia: '#9E9E9E',
  reuniao: '#5D4037',
}

export const EVENT_LABELS: Record<EventType, string> = {
  jogo: 'Jogo Oficial',
  treino: 'Treino',
  academia: 'Academia',
  alimentacao: 'Alimentacao',
  folga: 'Descanso/Folga',
  pagamento: 'Pagamento',
  fisioterapia: 'Fisioterapia',
  reuniao: 'Reuniao',
}

export const STATUS_COLORS: Record<AthleteStatus, string> = {
  ativo: '#2E7D32',
  lesionado: '#C62828',
  emprestado: '#1565C0',
  desligado: '#757575',
  suspenso: '#F9A825',
}

export const POSITION_LABELS: Record<Position, string> = {
  goleiro: 'Goleiro',
  zagueiro: 'Zagueiro',
  'lateral-direito': 'Lateral Direito',
  'lateral-esquerdo': 'Lateral Esquerdo',
  volante: 'Volante',
  meia: 'Meia',
  'ponta-direita': 'Ponta Direita',
  'ponta-esquerda': 'Ponta Esquerda',
  centroavante: 'Centroavante',
  atacante: 'Atacante',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Direcao',
  tecnico: 'Tecnico',
  preparador: 'Preparador Fisico',
  fisioterapeuta: 'Fisioterapeuta',
  atleta: 'Atleta',
  convidado: 'Convidado',
}
