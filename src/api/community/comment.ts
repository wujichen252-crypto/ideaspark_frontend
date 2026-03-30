/**
 * 社区评论接口
 * @description 封装社区评论模块的所有 HTTP 请求方法
 */
import service from '../request'
import type { ApiResponse } from '../types'
import type {
  Comment,
  CommentDetail,
  CreateCommentParams,
  UpdateCommentParams
} from '../types'

/**
 * 发布评论
 * @param params - 评论创建参数
 * @returns 返回标准响应格式 { status, message, data }
 */
export function createComment(params: CreateCommentParams) {
  return service.post<ApiResponse<CommentDetail>>('/api/community/comments', params)
}

/**
 * 获取帖子的一级评论
 * @param postId - 帖子 ID
 * @returns 直接返回评论数组（非标准包装格式）
 */
export function getPostComments(postId: string) {
  return service.get<Comment[]>(`/api/community/comments/post/${postId}`)
}

/**
 * 获取帖子的所有评论（包括回复）
 * @param postId - 帖子 ID
 * @returns 直接返回评论数组（非标准包装格式）
 */
export function getAllPostComments(postId: string) {
  return service.get<CommentDetail[]>(`/api/community/comments/post/${postId}/all`)
}

/**
 * 获取评论的回复列表
 * @param parentId - 父评论 ID
 * @returns 直接返回评论数组（非标准包装格式）
 */
export function getCommentReplies(parentId: string) {
  return service.get<Comment[]>(`/api/community/comments/replies/${parentId}`)
}

/**
 * 更新评论
 * @param commentId - 评论 ID
 * @param params - 更新参数
 * @returns 直接返回更新后的评论对象（非标准包装格式）
 */
export function updateComment(commentId: string, params: UpdateCommentParams) {
  return service.put<Comment>(`/api/community/comments/${commentId}`, params)
}

/**
 * 删除评论
 * @param commentId - 评论 ID
 * @returns 返回标准响应格式 { status, message }
 */
export function deleteComment(commentId: string) {
  return service.delete<ApiResponse<null>>(`/api/community/comments/${commentId}`)
}

/**
 * 更新评论点赞数
 * @param commentId - 评论 ID
 * @param count - 点赞数
 * @returns 直接返回 { id, likesCount } 对象（非标准包装格式）
 */
export function updateCommentLikes(commentId: string, count: number) {
  return service.put<{ id: string; likesCount: number }>(
    `/api/community/comments/${commentId}/likes`,
    null,
    { params: { count } }
  )
}
