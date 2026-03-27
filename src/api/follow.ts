/**
 * 用户关注接口
 * @description 封装用户关注模块的所有 HTTP 请求方法
 */
import service from './request'
import type { ApiResponse } from './types'
import type {
  MyFollowingItem,
  MyFollowerItem,
  FollowCountResult,
  FollowCheckResult
} from './types'

/**
 * 关注用户
 * @param followingId - 被关注用户 ID
 */
export function followUser(followingId: number) {
  return service.post<ApiResponse<null>>(`/follows/${followingId}`)
}

/**
 * 取消关注用户
 * @param followingId - 被取消关注的用户 ID
 */
export function unfollowUser(followingId: number) {
  return service.delete<ApiResponse<null>>(`/follows/${followingId}`)
}

/**
 * 获取我的关注列表
 */
export function getMyFollowing() {
  return service.get<ApiResponse<MyFollowingItem[]>>('/follows/my/following')
}

/**
 * 获取我的粉丝列表
 */
export function getMyFollowers() {
  return service.get<ApiResponse<MyFollowerItem[]>>('/follows/my/followers')
}

/**
 * 获取我的关注数
 */
export function getMyFollowingCount() {
  return service.get<ApiResponse<FollowCountResult>>('/follows/my/following/count')
}

/**
 * 获取我的粉丝数
 */
export function getMyFollowersCount() {
  return service.get<ApiResponse<FollowCountResult>>('/follows/my/followers/count')
}

/**
 * 检查是否已关注
 * @param followingId - 被检查的用户 ID
 */
export function checkFollowing(followingId: number) {
  return service.get<ApiResponse<FollowCheckResult>>(`/follows/check/${followingId}`)
}

/**
 * 获取指定用户的关注列表
 * @param userId - 用户 ID
 */
export function getUserFollowing(userId: number) {
  return service.get<ApiResponse<MyFollowingItem[]>>(`/follows/user/${userId}/following`)
}

/**
 * 获取指定用户的粉丝列表
 * @param userId - 用户 ID
 */
export function getUserFollowers(userId: number) {
  return service.get<ApiResponse<MyFollowerItem[]>>(`/follows/user/${userId}/followers`)
}

/**
 * 获取指定用户的关注数
 * @param userId - 用户 ID
 */
export function getUserFollowingCount(userId: number) {
  return service.get<ApiResponse<FollowCountResult>>(`/follows/user/${userId}/following/count`)
}

/**
 * 获取指定用户的粉丝数
 * @param userId - 用户 ID
 */
export function getUserFollowersCount(userId: number) {
  return service.get<ApiResponse<FollowCountResult>>(`/follows/user/${userId}/followers/count`)
}
