import { useQuery } from '@tanstack/react-query'
import { fetchLeadById, fetchLeads, fetchPipelineStages, fetchROIMetrics } from '@/api/leads'
import { useUiStore } from '@/stores/uiStore'

export const leadKeys = {
  all: ['leads'] as const,
  list: (filters: ReturnType<typeof useUiStore.getState>['filters']) =>
    [...leadKeys.all, 'list', filters] as const,
  detail: (id: string) => [...leadKeys.all, 'detail', id] as const,
  pipeline: ['pipeline'] as const,
  roi: ['roi'] as const,
}

export function useLeads() {
  const filters = useUiStore((s) => s.filters)
  return useQuery({
    queryKey: leadKeys.list(filters),
    queryFn: () => fetchLeads(filters),
  })
}

export function useLead(id: string | undefined) {
  return useQuery({
    queryKey: leadKeys.detail(id ?? ''),
    queryFn: () => fetchLeadById(id!),
    enabled: Boolean(id),
  })
}

export function usePipelineStages() {
  return useQuery({
    queryKey: leadKeys.pipeline,
    queryFn: fetchPipelineStages,
  })
}

export function useROIMetrics() {
  return useQuery({
    queryKey: leadKeys.roi,
    queryFn: fetchROIMetrics,
  })
}
