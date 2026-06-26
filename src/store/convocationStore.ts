import { create } from 'zustand'
import type { Convocation } from '@/types'

interface ConvocationState {
  convocations: Convocation[]
  addConvocation: (convocation: Convocation) => void
  updateConvocation: (id: string, updates: Partial<Convocation>) => void
  deleteConvocation: (id: string) => void
  getByEvent: (eventoId: string) => Convocation | undefined
}

export const useConvocationStore = create<ConvocationState>((set, get) => ({
  convocations: [],

  addConvocation: (convocation) =>
    set((state) => ({ convocations: [...state.convocations, convocation] })),

  updateConvocation: (id, updates) =>
    set((state) => ({
      convocations: state.convocations.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    })),

  deleteConvocation: (id) =>
    set((state) => ({
      convocations: state.convocations.filter((c) => c.id !== id),
    })),

  getByEvent: (eventoId) =>
    get().convocations.find((c) => c.eventoId === eventoId),
}))
