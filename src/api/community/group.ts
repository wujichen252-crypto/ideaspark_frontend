/**
 * 社区圈子接口
 * @description 封装社区圈子模块的所有 HTTP 请求方法
 */
import service from '../request'
import type { ApiResponse } from '../types'
import type {
  Group,
  GroupDetail,
  GroupMember,
  CreateGroupParams,
  UpdateGroupParams,
  UpdateGroupMemberRoleParams
} from '../types'

/**
 * 创建圈子
 * @param params - 圈子创建参数
 */
export function createGroup(params: CreateGroupParams) {
  return service.post<ApiResponse<GroupDetail>>('/community/groups', params)
}

/**
 * 获取圈子列表
 */
export function getGroupList() {
  return service.get<ApiResponse<Group[]>>('/community/groups')
}

/**
 * 获取圈子详情
 * @param groupId - 圈子 ID
 */
export function getGroupDetail(groupId: string) {
  return service.get<ApiResponse<GroupDetail>>(`/community/groups/${groupId}`)
}

/**
 * 更新圈子
 * @param groupId - 圈子 ID
 * @param params - 更新参数
 */
export function updateGroup(groupId: string, params: UpdateGroupParams) {
  return service.put<ApiResponse<GroupDetail>>(`/community/groups/${groupId}`, params)
}

/**
 * 删除圈子
 * @param groupId - 圈子 ID
 */
export function deleteGroup(groupId: string) {
  return service.delete<ApiResponse<null>>(`/community/groups/${groupId}`)
}

/**
 * 加入圈子
 * @param groupId - 圈子 ID
 */
export function joinGroup(groupId: string) {
  return service.post<ApiResponse<null>>(`/community/groups/${groupId}/join`)
}

/**
 * 退出圈子
 * @param groupId - 圈子 ID
 */
export function quitGroup(groupId: string) {
  return service.delete<ApiResponse<null>>(`/community/groups/${groupId}/quit`)
}

/**
 * 获取圈子成员列表
 * @param groupId - 圈子 ID
 */
export function getGroupMembers(groupId: string) {
  return service.get<ApiResponse<GroupMember[]>>(`/community/groups/${groupId}/members`)
}

/**
 * 移除圈子成员
 * @param groupId - 圈子 ID
 * @param memberId - 成员 ID
 */
export function removeGroupMember(groupId: string, memberId: string) {
  return service.delete<ApiResponse<null>>(`/community/groups/${groupId}/members/${memberId}`)
}

/**
 * 更新圈子成员角色
 * @param groupId - 圈子 ID
 * @param memberId - 成员 ID
 * @param params - 角色参数
 */
export function updateGroupMemberRole(
  groupId: string,
  memberId: string,
  params: UpdateGroupMemberRoleParams
) {
  return service.put<ApiResponse<{ memberId: string; role: string }>>(
    `/community/groups/${groupId}/members/${memberId}/role`,
    params
  )
}
