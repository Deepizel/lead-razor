/** Manual lead form fields — aligned with Excel upload template columns */
export const LEAD_TEMPLATE_COLUMNS = [
  { key: 'firstName', label: 'First name', required: true, excelHeader: 'first_name' },
  { key: 'lastName', label: 'Last name', required: false, excelHeader: 'last_name' },
  { key: 'email', label: 'Email', required: true, excelHeader: 'email' },
  { key: 'company', label: 'Company', required: false, excelHeader: 'company' },
  { key: 'jobTitle', label: 'Job title', required: false, excelHeader: 'job_title' },
  { key: 'phone', label: 'Phone', required: false, excelHeader: 'phone' },
  { key: 'source', label: 'Source', required: false, excelHeader: 'source' },
  {
    key: 'initialMessage',
    label: 'Initial message',
    required: false,
    excelHeader: 'initial_message',
    multiline: true,
  },
] as const

export type LeadFormFieldKey = (typeof LEAD_TEMPLATE_COLUMNS)[number]['key']

export interface LeadManualFormValues {
  categoryId: string
  firstName: string
  lastName: string
  email: string
  company: string
  jobTitle: string
  phone: string
  source: string
  initialMessage: string
}

export const emptyLeadManualForm: LeadManualFormValues = {
  categoryId: '',
  firstName: '',
  lastName: '',
  email: '',
  company: '',
  jobTitle: '',
  phone: '',
  source: '',
  initialMessage: '',
}
