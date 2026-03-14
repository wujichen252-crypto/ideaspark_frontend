import service from './request'
import type { Result } from './request'

export interface InvitationValidateResult {
  valid: boolean
  team: {
    uuid: string
    name: string
  }
  role: string
}

export function validateInvitation(token: string) {
  return service.get<Result<InvitationValidateResult>>('/invitations/validate', { params: { token } })
}
