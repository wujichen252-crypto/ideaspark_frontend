import service from './request'
import type { Result } from './request'

export interface Team {
  uuid: string
  name: string
  description: string
  memberCount: number
  role: string
}

export interface TeamDetail extends Team {
  ownerId: number
  createdAt: string
}

export interface TeamMember {
  id: number
  username: string
  email: string
  role: string
  joinedAt: string
}

export interface TeamListResult {
  teams: Team[]
  total: number
  page: number
  size: number
}

export interface MembersListResult {
  members: TeamMember[]
  total: number
  page: number
  size: number
}

export interface CreateTeamParams {
  name: string
  description?: string
}

export interface UpdateTeamParams {
  name?: string
  description?: string
}

export interface InviteParams {
  emails: string[]
  role: string
}

export function getMyTeams(params?: { page?: number; size?: number }) {
  return service.get<Result<TeamListResult>>('/teams/my', { params })
}

export function getTeamDetail(uuid: string) {
  return service.get<Result<TeamDetail>>(`/teams/${uuid}`)
}

export function updateTeam(uuid: string, params: UpdateTeamParams) {
  return service.put<Result<Team>>(`/teams/${uuid}`, params)
}

export function createCollaborationTeam(params: CreateTeamParams) {
  return service.post<Result<TeamDetail>>('/teams/collaboration', params)
}

export function dissolveTeam(uuid: string) {
  return service.delete<Result<{ uuid: string }>>(`/teams/${uuid}`)
}

export function getTeamMembers(uuid: string, params?: { page?: number; size?: number }) {
  return service.get<Result<MembersListResult>>(`/teams/${uuid}/members`, { params })
}

export function updateMemberRole(uuid: string, memberId: string | number, role: string) {
  return service.put<Result<{ memberId: string; role: string }>>(`/teams/${uuid}/members/${memberId}/role`, { role })
}

export function removeMember(uuid: string, memberId: string | number) {
  return service.delete<Result<{ memberId: string }>>(`/teams/${uuid}/members/${memberId}`)
}

export function leaveTeam(uuid: string) {
  return service.delete<Result<{ uuid: string }>>(`/teams/${uuid}/members/self`)
}

export function transferOwnership(uuid: string, newOwnerId: number) {
  return service.post<Result<{ uuid: string; newOwnerId: number }>>(`/teams/${uuid}/transfer-ownership`, { newOwnerId })
}

export function sendInvitation(uuid: string, params: InviteParams) {
  return service.post<Result<{ uuid: string; invitedCount: number }>>(`/teams/${uuid}/invitations`, params)
}
