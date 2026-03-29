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
 */
export function createComment(params: CreateCommentParams) {
  return service.post<ApiResponse<CommentDetail>>('/community/comments', params)
}

/**
 * 获取帖子的一级评论
 * @param postId - 帖子 ID
 */
export function getPostComments(postId: string) {
  return service.get<ApiResponse<Comment[]>>(`/community/comments/post/${postId}`)
}

/**
 * 获取帖子的所有评论（包括回复）
 * @param postId - 帖子 ID
 */
export function getAllPostComments(postId: string) {
  return service.get<ApiResponse<CommentDetail[]>>(`/community/comments/post/${postId}/all`)
}

/**
 * 获取评论的回复列表
 * @param parentId - 父评论 ID
 */
export function getCommentReplies(parentId: string) {
  return service.get<ApiResponse<Comment[]>>(`/community/comments/replies/${parentId}`)
}

/**
 * 更新评论
 * @param commentId - 评论 ID
 * @param params - 更新参数
 */
export function updateComment(commentId: string, params: UpdateCommentParams) {
  return service.put<ApiResponse<Comment>>(`/community/comments/${commentId}`, params)
}

/**
 * 删除评论
 * @param commentId - 评论 ID
 */
export function deleteComment(commentId: string) {
  return service.delete<ApiResponse<null>>(`/community/comments/${commentId}`)
}

/**
 * 更新评论点赞数
 * @param commentId - 评论 ID
 * @param count - 点赞数
 */
export function updateCommentLikes(commentId: string, count: number) {
  return service.put<ApiResponse<{ id: string; likesCount: number }>>(
    `/community/comments/${commentId}/likes`,
    null,
    { params: { count } }
  )
}
