import type { CreateLeadApiBody, CreateLeadRequest } from '@/types/api-lead'

/** Map form values to POST /api/leads JSON (spreadsheet column names). */
export function mapCreateLeadRequest(payload: CreateLeadRequest): CreateLeadApiBody {
  const body: CreateLeadApiBody = {
    category_id: payload.categoryId,
    first_name: payload.firstName.trim(),
    email: payload.email.trim(),
  }

  const lastName = payload.lastName?.trim()
  if (lastName) body.last_name = lastName

  const company = payload.company?.trim()
  if (company) body.company = company

  const jobTitle = payload.jobTitle?.trim()
  if (jobTitle) body.job_title = jobTitle

  const phone = payload.phone?.trim()
  if (phone) body.phone = phone

  const source = payload.source?.trim()
  if (source) body.source = source

  const initialMessage = payload.initialMessage?.trim()
  if (initialMessage) body.initial_message = initialMessage

  return body
}
