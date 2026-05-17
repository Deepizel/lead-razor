import type { Lead, PipelineStage, ROIMetric } from '@/types/lead'

export const mockLeads: Lead[] = [
  {
    id: 'lead-001',
    name: 'Sarah Chen',
    company: 'NovaStack AI',
    role: 'VP of Sales',
    email: 'sarah.chen@novastack.ai',
    score: 92,
    status: 'hot',
    source: 'Inbound Demo',
    lastAction: 'AI drafted follow-up',
    createdAt: '2026-05-14T09:12:00Z',
    reasoning: [
      'Requested enterprise pricing within first conversation.',
      'Team size (120+) matches ICP for annual contracts.',
      'Mentioned Q2 budget approval window.',
    ],
    intentSignals: [
      'Asked about SOC 2 compliance',
      'Downloaded security whitepaper',
      'Visited pricing page 4 times',
    ],
    riskFlags: ['Procurement cycle may extend past Q2'],
    draftEmail:
      'Hi Sarah — great speaking with you about scaling outbound with AI scoring. I attached a tailored ROI snapshot for NovaStack. Would Thursday at 2pm PT work for a 20-minute walkthrough with your RevOps lead?',
  },
  {
    id: 'lead-002',
    name: 'Marcus Webb',
    company: 'Brightline Logistics',
    role: 'Head of Growth',
    email: 'marcus@brightlinelogistics.com',
    score: 68,
    status: 'warm',
    source: 'LinkedIn',
    lastAction: 'Opened email',
    createdAt: '2026-05-13T14:30:00Z',
    reasoning: [
      'Engaged with two nurture emails but has not booked a call.',
      'Company growth signals are positive but budget authority unclear.',
    ],
    intentSignals: ['Replied asking for case studies', 'Clicked calendar link'],
    riskFlags: ['No decision-maker CC’d on thread'],
    draftEmail:
      'Hi Marcus — following up on the logistics case study you requested. Teams similar to Brightline typically see a 22% lift in qualified meetings within 30 days. Happy to share specifics — does early next week work?',
  },
  {
    id: 'lead-003',
    name: 'Elena Ruiz',
    company: 'Harbor Health',
    role: 'Revenue Operations Manager',
    email: 'elena.ruiz@harborhealth.io',
    score: 41,
    status: 'cold',
    source: 'Webinar',
    lastAction: 'No response',
    createdAt: '2026-05-11T11:05:00Z',
    reasoning: [
      'Attended webinar but no follow-up engagement.',
      'Healthcare vertical has longer evaluation cycles.',
    ],
    intentSignals: ['Registered for webinar', 'Downloaded slide deck'],
    riskFlags: ['Competitor evaluation mentioned in notes', 'Low email open rate'],
    draftEmail:
      'Hi Elena — thanks for joining our AI qualification webinar. I put together a short playbook on how healthcare GTM teams prioritize inbound without adding headcount. Worth a quick look?',
  },
  {
    id: 'lead-004',
    name: 'James Okonkwo',
    company: 'Vertex Payments',
    role: 'CRO',
    email: 'j.okonkwo@vertexpay.com',
    score: 88,
    status: 'hot',
    source: 'Referral',
    lastAction: 'Meeting scheduled',
    createdAt: '2026-05-10T16:45:00Z',
    reasoning: [
      'Referred by existing customer with strong expansion history.',
      'Explicit pain around SDR ramp time and lead triage.',
    ],
    intentSignals: [
      'Introduced RevOps counterpart',
      'Shared current lead routing doc',
    ],
    riskFlags: [],
    draftEmail:
      'Hi James — looking forward to our session on Tuesday. I’ll bring a live walkthrough of how Vertex could auto-score inbound and push actions to your CRM. Anything specific you want the team to see?',
  },
  {
    id: 'lead-005',
    name: 'Priya Nair',
    company: 'CloudForge',
    role: 'Director of Marketing',
    email: 'priya@cloudforge.dev',
    score: 55,
    status: 'warm',
    source: 'Content',
    lastAction: 'Re-scored by AI',
    createdAt: '2026-05-09T08:20:00Z',
    reasoning: [
      'Marketing-led inquiry; needs sales alignment before upgrade.',
      'Moderate fit on company size, strong on tech stack match.',
    ],
    intentSignals: ['MQL from product-led signup', 'Uses HubSpot'],
    riskFlags: ['Not primary economic buyer'],
    draftEmail:
      'Hi Priya — based on CloudForge’s inbound volume, an AI scoring layer could help your team focus on accounts ready for sales conversations. Open to a 15-minute fit check with your AE?',
  },
  {
    id: 'lead-006',
    name: 'Tom Bradley',
    company: 'Summit Retail',
    role: 'Sales Manager',
    email: 't.bradley@summitretail.co',
    score: 34,
    status: 'cold',
    source: 'Cold Outbound',
    lastAction: 'Bounced follow-up',
    createdAt: '2026-05-08T13:10:00Z',
    reasoning: [
      'Retail segment outside core ICP.',
      'Low engagement across three touchpoints.',
    ],
    intentSignals: ['Accepted LinkedIn connection'],
    riskFlags: ['Company size below threshold', 'No product fit signals'],
    draftEmail:
      'Hi Tom — quick note in case timing improves later. We help B2B SaaS teams qualify inbound with AI — happy to reconnect when Summit scales outbound.',
  },
]

export const pipelineStages: PipelineStage[] = [
  { stage: 'New', count: 248 },
  { stage: 'Qualified', count: 142 },
  { stage: 'Contacted', count: 89 },
  { stage: 'Meeting', count: 41 },
  { stage: 'Closed', count: 18 },
]

export const roiMetrics: ROIMetric[] = [
  { month: 'Jan', revenue: 42000, conversionRate: 12, emailToMeeting: 8, avgScore: 58 },
  { month: 'Feb', revenue: 51000, conversionRate: 14, emailToMeeting: 11, avgScore: 61 },
  { month: 'Mar', revenue: 63000, conversionRate: 16, emailToMeeting: 14, avgScore: 64 },
  { month: 'Apr', revenue: 78000, conversionRate: 19, emailToMeeting: 17, avgScore: 67 },
  { month: 'May', revenue: 92000, conversionRate: 22, emailToMeeting: 21, avgScore: 71 },
]

export const leadSources = ['All', 'Inbound Demo', 'LinkedIn', 'Webinar', 'Referral', 'Content', 'Cold Outbound']
