/**
 * 团队管理接口
 * @description 封装团队模块的所有 HTTP 请求方法
 */
import service from './request'
import type { ApiResponse } from './types'
import type {
  Team,
  TeamDetail,
  TeamMember,
  TeamListResult,
  TeamMembersResult,
  CreateTeamParams,
  UpdateTeamParams,
  InviteParams,
  UpdateMemberRoleParams,
  TransferOwnershipParams
} from './types'

/**
 * 团队项目信息
 */
export interface TeamProject {
  id: string
  name: string
  description?: string
  category?: string
  cover?: string
  createdAt?: string
  updatedAt?: string
  ownerId?: number
  teamId?: string
}

/**
 * 团队项目列表响应
 */
export interface TeamProjectsResult {
  projects: TeamProject[]
  total: number
  page: number
  size: number
}

/**
 * 获取我的团队列表
 * @param params - 分页参数
 */
export function getMyTeams(params?: { page?: number; size?: number }) {
  return service.get<ApiResponse<TeamListResult>>('/teams/my', { params })
}

/**
 * 获取团队详情
 * @param uuid - 团队 UUID
 */
export function getTeamDetail(uuid: string) {
  return service.get<ApiResponse<TeamDetail>>(`/teams/${uuid}`)
}

/**
 * 更新团队信息
 * @param uuid - 团队 UUID
 * @param params - 更新参数
 */
export function updateTeam(uuid: string, params: UpdateTeamParams) {
  return service.put<ApiResponse<Team>>(`/teams/${uuid}`, params)
}

/**
 * 创建协作团队
 * @param params - 创建参数
 */
export function createCollaborationTeam(params: CreateTeamParams) {
  return service.post<ApiResponse<TeamDetail>>('/teams/collaboration', params)
}

/**
 * 解散团队
 * @param uuid - 团队 UUID
 */
export function dissolveTeam(uuid: string) {
  return service.delete<ApiResponse<{ uuid: string }>>(`/teams/${uuid}`)
}

/**
 * 获取团队成员列表
 * @param uuid - 团队 UUID
 * @param params - 分页参数
 */
export function getTeamMembers(uuid: string, params?: { page?: number; size?: number }) {
  return service.get<ApiResponse<TeamMembersResult>>(`/teams/${uuid}/members`, { params })
}

/**
 * 更新成员角色
 * @param uuid - 团队 UUID
 * @param memberId - 成员 ID
 * @param params - 角色参数
 */
export function updateMemberRole(uuid: string, memberId: string | number, params: UpdateMemberRoleParams) {
  return service.put<ApiResponse<{ memberId: string; role: string }>>(
    `/teams/${uuid}/members/${memberId}/role`,
    params
  )
}

/**
 * 移除成员
 * @param uuid - 团队 UUID
 * @param memberId - 成员 ID
 */
export function removeMember(uuid: string, memberId: string | number) {
  return service.delete<ApiResponse<{ memberId: string }>>(`/teams/${uuid}/members/${memberId}`)
}

/**
 * 退出团队
 * @param uuid - 团队 UUID
 */
export function leaveTeam(uuid: string) {
  return service.delete<ApiResponse<{ uuid: string }>>(`/teams/${uuid}/members/self`)
}

/**
 * 转让团队所有权
 * @param uuid - 团队 UUID
 * @param params - 转让参数
 */
export function transferOwnership(uuid: string, params: TransferOwnershipParams) {
  return service.post<ApiResponse<{ uuid: string; newOwnerId: number }>>(
    `/teams/${uuid}/transfer-ownership`,
    params
  )
}

/**
 * 邀请结果项
 */
export interface InvitationItem {
  id: string
  inviteeId: number
  status: string
  token: string
  createdAt: string
}

/**
 * 发送团队邀请
 * @param uuid - 团队 UUID
 * @param params - 邀请参数
 */
export function sendInvitation(uuid: string, params: InviteParams) {
  return service.post<ApiResponse<{ invitations: InvitationItem[] }>>(
    `/teams/${uuid}/invitations`,
    params
  )
}

/**
 * 获取团队项目列表
 * @param uuid - 团队 UUID
 * @param params - 分页参数
 */
export function getTeamProjects(uuid: string, params?: { page?: number; size?: number }) {
  return service.get<ApiResponse<TeamProjectsResult>>(`/teams/${uuid}/projects`, { params })
}
