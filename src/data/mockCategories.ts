import type { Category } from '@/types/category'

export const seedCategories: Category[] = [
  {
    id: 'cat-001',
    name: 'Enterprise SaaS',
    offering:
      'AI-powered lead scoring and qualification platform for B2B sales teams with CRM integrations.',
    statement:
      'VP Sales or RevOps at 50+ employee SaaS companies with inbound demo requests and annual contract intent.',
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-04-01T10:00:00Z',
  },
  {
    id: 'cat-002',
    name: 'Healthcare GTM',
    offering:
      'HIPAA-aware lead triage and nurture playbooks for healthcare technology vendors.',
    statement:
      'Revenue or marketing leaders at health-tech firms evaluating tools to prioritize compliant inbound leads.',
    createdAt: '2026-04-15T14:30:00Z',
    updatedAt: '2026-04-15T14:30:00Z',
  },
  {
    id: 'cat-003',
    name: 'Logistics & Supply Chain',
    offering:
      'Outbound automation and ICP scoring for mid-market logistics and freight brokers.',
    statement:
      'Head of Growth or CRO at logistics companies with 20–500 employees and active LinkedIn outbound.',
    createdAt: '2026-05-01T09:00:00Z',
    updatedAt: '2026-05-01T09:00:00Z',
  },
]
