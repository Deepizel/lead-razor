export const landingStats = [
  { value: '3.8×', label: 'More qualified leads' },
  { value: '62%', label: 'Higher open rates' },
  { value: '10×', label: 'Faster outreach' },
] as const

export const landingSteps = [
  {
    num: '01',
    title: 'Import & categorize',
    description:
      'Upload spreadsheets or add leads manually. Group them by category with your offering, ICP statement, and qualification purpose.',
  },
  {
    num: '02',
    title: 'AI scores every lead',
    description:
      'LeadRazor scores contacts hot, warm, or cold against your category criteria — so your team focuses on prospects that match your goals.',
  },
  {
    num: '03',
    title: 'Send assisted outreach',
    description:
      'Generate snapshot-based emails from your lead context. Send from your own email identity with personalized subject lines and body copy.',
  },
  {
    num: '04',
    title: 'Track engagement',
    description:
      'Monitor opens, clicks, and replies per lead. Review pipeline analytics and ROI dashboards to see what converts.',
  },
] as const

export const landingFeatures = [
  {
    tone: 'yellow' as const,
    title: 'AI lead scoring',
    description:
      'Every lead gets a 0–100 score and hot / warm / cold tier. Filter the pipeline instantly and prioritize outreach that matches your ICP.',
  },
  {
    tone: 'blue' as const,
    title: 'Category-based qualification',
    description:
      'Define categories with your product offering and ideal customer profile. Scoring and messaging stay aligned to each campaign purpose.',
  },
  {
    tone: 'red' as const,
    title: 'AI-assisted messaging',
    description:
      'Refresh LLM snapshots per lead for reasoning, intent signals, and suggested email copy — then send or edit before outreach goes out.',
  },
  {
    tone: 'green' as const,
    title: 'Open & reply tracking',
    description:
      'See who opened, clicked, and replied on every send. Timeline views keep engagement signals next to the lead record.',
  },
  {
    tone: 'yellow' as const,
    title: 'Pipeline & ROI analytics',
    description:
      'Tier distribution, category breakdowns, upload history, and ROI metrics — built for sales teams that need visibility without spreadsheets.',
  },
  {
    tone: 'blue' as const,
    title: 'Your email identities',
    description:
      'Connect Gmail, SMTP, Resend, or Brevo senders per user. Outreach runs from your configured identity, not a shared platform mailbox.',
  },
] as const

export const landingAboutPoints = [
  {
    title: 'Qualification on your terms',
    text: 'Define categories with your offering and ICP. AI scores every contact against that purpose automatically.',
  },
  {
    title: 'Outreach that stays personal',
    text: 'Snapshot-driven emails reference role, company, and context — assisted by AI, controlled by your team.',
  },
  {
    title: 'Engagement signals that matter',
    text: 'Open rates, replies, and click-throughs surfaced per lead so you know exactly where to follow up.',
  },
  {
    title: 'Full-stack in one workspace',
    text: 'Upload, score, compose, send, and report — from waitlist onboarding to admin user management.',
  },
  {
    title: 'Built for growing teams',
    text: 'Multi-tenant categories, per-user email identities, and role-based admin controls as you scale.',
  },
] as const

export const landingTestimonials = [
  {
    initials: 'AO',
    tone: 'blue' as const,
    quote:
      'LeadRazor cut our prospecting time dramatically. Reps only touch hot and warm leads now — and our close rate improved.',
    name: 'Adaeze Okonkwo',
    role: 'Head of Sales, FinEdge',
  },
  {
    initials: 'DM',
    tone: 'yellow' as const,
    quote:
      'The AI outreach reads like our best rep wrote it — except we sent hundreds in an afternoon. Reply rates jumped immediately.',
    name: 'David Mensah',
    role: 'Founder, GrowthHive',
  },
  {
    initials: 'NK',
    tone: 'green' as const,
    quote:
      'Scoring, sending, and tracking in one place replaced a stack of tabs. Pipeline analytics finally match what we see in outreach.',
    name: 'Ngozi Kalu',
    role: 'VP Growth, Stackline',
  },
] as const

export const landingPricing = [
  {
    plan: 'Starter',
    price: '$49',
    period: 'per month · up to 1 user',
    featured: false,
    features: [
      '500 leads / month',
      'AI lead scoring',
      'Category-based ICP',
      '50 AI outreach sends',
      'Open & reply tracking',
    ],
    cta: 'Join waitlist',
  },
  {
    plan: 'Growth',
    price: '$149',
    period: 'per month · up to 5 users',
    featured: true,
    features: [
      '5,000 leads / month',
      'AI snapshots & scoring',
      'Unlimited assisted outreach',
      'Pipeline & ROI analytics',
      'Multiple email identities',
      'Excel report exports',
    ],
    cta: 'Most popular',
  },
  {
    plan: 'Enterprise',
    price: 'Custom',
    period: 'tailored for large teams',
    featured: false,
    features: [
      'Unlimited leads',
      'Dedicated onboarding',
      'Admin user management',
      'Priority support',
      'Custom integrations',
    ],
    cta: 'Contact sales',
  },
] as const
