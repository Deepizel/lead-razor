import { create } from 'zustand'
import type { LeadFilters } from '@/types/lead'

interface UiState {
  selectedLeadId: string | null
  chatOpen: boolean
  navOpen: boolean
  filters: LeadFilters
  setSelectedLeadId: (id: string | null) => void
  setChatOpen: (open: boolean) => void
  setNavOpen: (open: boolean) => void
  toggleChat: () => void
  setFilters: (filters: Partial<LeadFilters>) => void
  resetFilters: () => void
}

const defaultFilters: LeadFilters = {
  status: 'all',
  minScore: 0,
  maxScore: 100,
  source: 'All',
  uploadedPreset: 'all',
  uploadedFrom: '',
  uploadedTo: '',
}

export const useUiStore = create<UiState>((set) => ({
  selectedLeadId: null,
  chatOpen: false,
  navOpen: false,
  filters: defaultFilters,
  setSelectedLeadId: (id) => set({ selectedLeadId: id }),
  setChatOpen: (open) => set({ chatOpen: open }),
  setNavOpen: (open) => set({ navOpen: open }),
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),
  setFilters: (partial) =>
    set((state) => ({ filters: { ...state.filters, ...partial } })),
  resetFilters: () => set({ filters: defaultFilters }),
}))
