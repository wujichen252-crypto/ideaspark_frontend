/**
 * 社区帖子接口
 * @description 封装社区帖子模块的所有 HTTP 请求方法
 */
import service from '../request'
import type { ApiResponse } from '../types'
import type {
  Post,
  PostDetail,
  CreatePostParams,
  UpdatePostParams,
  UpdateLikesParams,
  UpdateCommentsParams
} from '../types'

/**
 * 创建帖子
 * @param params - 帖子创建参数
 */
export function createPost(params: CreatePostParams) {
  return service.post<ApiResponse<PostDetail>>('/community/posts', params)
}

/**
 * 获取帖子列表
 */
export function getPostList() {
  return service.get<ApiResponse<Post[]>>('/community/posts')
}

/**
 * 获取帖子详情
 * @param postId - 帖子 ID
 */
export function getPostDetail(postId: string) {
  return service.get<ApiResponse<PostDetail>>(`/community/posts/${postId}`)
}

/**
 * 更新帖子
 * @param postId - 帖子 ID
 * @param params - 更新参数
 */
export function updatePost(postId: string, params: UpdatePostParams) {
  return service.put<ApiResponse<PostDetail>>(`/community/posts/${postId}`, params)
}

/**
 * 删除帖子
 * @param postId - 帖子 ID
 */
export function deletePost(postId: string) {
  return service.delete<ApiResponse<null>>(`/community/posts/${postId}`)
}

/**
 * 更新帖子点赞数
 * @param postId - 帖子 ID
 * @param params - 点赞数参数
 */
export function updatePostLikes(postId: string, params: UpdateLikesParams) {
  return service.put<ApiResponse<null>>(`/community/posts/${postId}/likes`, params)
}

/**
 * 更新帖子评论数
 * @param postId - 帖子 ID
 * @param params - 评论数参数
 */
export function updatePostComments(postId: string, params: UpdateCommentsParams) {
  return service.put<ApiResponse<null>>(`/community/posts/${postId}/comments`, params)
}
