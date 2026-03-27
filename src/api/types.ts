/**
 * API 统一类型定义
 * @description 根据 IdeaSpark 前后端对接文档定义的所有接口类型
 */

// ==================== 通用类型 ====================

/**
 * 统一响应格式
 */
export interface ApiResponse<T = unknown> {
  status: number
  message: string
  data: T
}

/**
 * 分页请求参数
 */
export interface PaginationParams {
  page?: number
  size?: number
}

/**
 * 分页响应数据
 */
export interface PageData<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

/**
 * 列表分页响应数据
 */
export interface ListPageData<T> {
  items: T[]
  total: number
  page: number
  size: number
}

// ==================== 用户模块类型 ====================

/**
 * 用户登录参数
 */
export interface LoginParams {
  email: string
  password: string
}

/**
 * 用户注册参数
 */
export interface RegisterParams {
  username: string
  email: string
  password: string
}

/**
 * 更新用户信息参数
 */
export interface UpdateUserParams {
  username?: string
  email?: string
  password?: string
  avatar?: string | null
  role?: string
  bio?: string | null
  position?: string | null
  address?: string | null
  perWebsite?: string | null
  phone?: string | null
}

/**
 * 用户信息
 */
export interface User {
  id: number
  username: string
  email: string
  avatar?: string | null
  role?: string
  createdAt?: string
  updatedAt?: string
  bio?: string | null
  position?: string | null
  address?: string | null
  perWebsite?: string | null
  phone?: string | null
}

/**
 * 登录响应数据
 */
export interface LoginResult {
  token: string
  user: User
  userInfo?: User
}

/**
 * 查询用户列表参数
 */
export interface GetUsersParams extends PaginationParams {
  username?: string
  email?: string
}

/**
 * 删除用户参数
 */
export interface DeleteUsersParams {
  userIds: number[]
}

// ==================== 团队模块类型 ====================

/**
 * 团队角色枚举
 */
export type TeamRole = 'OWNER' | 'ADMIN' | 'MEMBER'

/**
 * 团队基本信息
 */
export interface Team {
  uuid: string
  name: string
  description: string
  memberCount: number
  role: TeamRole
}

/**
 * 团队详情
 */
export interface TeamDetail extends Team {
  ownerId: number
  createdAt: string
}

/**
 * 团队成员
 */
export interface TeamMember {
  id: number
  username: string
  email: string
  role: TeamRole
  joinedAt: string
}

/**
 * 团队列表响应
 */
export interface TeamListResult {
  teams: Team[]
  total: number
  page: number
  size: number
}

/**
 * 团队成员列表响应
 */
export interface TeamMembersResult {
  members: TeamMember[]
  total: number
  page: number
  size: number
}

/**
 * 创建团队参数
 */
export interface CreateTeamParams {
  name: string
  description?: string
}

/**
 * 更新团队参数
 */
export interface UpdateTeamParams {
  name?: string
  description?: string
}

/**
 * 邀请成员参数
 */
export interface InviteParams {
  emails: string[]
  role: 'ADMIN' | 'MEMBER'
}

/**
 * 更新成员角色参数
 */
export interface UpdateMemberRoleParams {
  role: TeamRole
}

/**
 * 转让所有权参数
 */
export interface TransferOwnershipParams {
  newOwnerId: number
}

// ==================== 项目模块类型 ====================

/**
 * 项目状态枚举
 */
export type ProjectStatus = 'ACTIVE' | 'INACTIVE' | 'ARCHIVED'

/**
 * 项目基本信息
 */
export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  memberCount: number
  createdAt: string
}

/**
 * 项目列表响应
 */
export interface ProjectListResult {
  projects: Project[]
  total: number
  page: number
  size: number
}

/**
 * 获取我的项目参数
 */
export interface GetMyProjectsParams extends PaginationParams {
  keyword?: string
  status?: ProjectStatus
}

// ==================== 项目市场模块类型 ====================

/**
 * 市场项目基本信息
 */
export interface MarketProject {
  id: string
  name: string
  description: string
  category: string
  likeCount: number
  viewCount: number
}

/**
 * 市场项目详情
 */
export interface MarketProjectDetail extends MarketProject {
  createdAt: string
  updatedAt: string
  author: {
    id: number
    username: string
  }
}

/**
 * 市场项目列表响应
 */
export interface MarketProjectListResult {
  projects: MarketProject[]
  total: number
  page: number
  size: number
}

/**
 * 获取市场项目列表参数
 */
export interface GetMarketProjectsParams extends PaginationParams {
  keyword?: string
  category?: string
}

// ==================== 社区帖子模块类型 ====================

/**
 * 帖子可见性枚举
 */
export type PostVisibility = 'PUBLIC' | 'PRIVATE' | 'FOLLOWERS'

/**
 * 帖子作者信息
 */
export interface PostAuthor {
  id: number
  username: string
  name?: string
  avatar?: string
}

/**
 * 帖子关联项目信息
 */
export interface PostProject {
  id: string
  name: string
}

/**
 * 帖子统计数据
 */
export interface PostStats {
  views: number
  likes: number
  comments: number
}

/**
 * 帖子基本信息
 */
export interface Post {
  id: string
  title: string
  content: string
  author: PostAuthor
  viewsCount: number
  likesCount: number
  commentsCount: number
  createdAt: string
  images?: string[]
  tags?: string[]
  stats?: PostStats
  publishTime?: string
  isLiked?: boolean
}

/**
 * 帖子详情
 */
export interface PostDetail extends Post {
  images?: string[]
  tags?: string[]
  channel: string
  visibility: PostVisibility
  project?: PostProject
  updatedAt: string
}

/**
 * 创建帖子参数
 */
export interface CreatePostParams {
  title: string
  content: string
  images?: string[]
  tags?: string[]
  channel?: string
  visibility?: PostVisibility
  projectId?: string
}

/**
 * 更新帖子参数
 */
export interface UpdatePostParams {
  title?: string
  content?: string
  images?: string[]
  tags?: string[]
  visibility?: PostVisibility
}

/**
 * 更新点赞数参数
 */
export interface UpdateLikesParams {
  likesCount: number
}

/**
 * 更新评论数参数
 */
export interface UpdateCommentsParams {
  commentsCount: number
}

// ==================== 社区评论模块类型 ====================

/**
 * 评论用户信息
 */
export interface CommentUser {
  id: number
  username: string
}

/**
 * 评论关联帖子信息
 */
export interface CommentPost {
  id: string
  title: string
}

/**
 * 评论基本信息
 */
export interface Comment {
  id: string
  content: string
  user: CommentUser
  likesCount: number
  createdAt: string
  replies?: Comment[]
}

/**
 * 评论详情（包含父评论ID）
 */
export interface CommentDetail extends Comment {
  parentId: string | null
}

/**
 * 创建评论参数
 */
export interface CreateCommentParams {
  postId: string
  content: string
  parentId?: string
}

/**
 * 更新评论参数
 */
export interface UpdateCommentParams {
  content: string
}

// ==================== 社区圈子模块类型 ====================

/**
 * 圈子成员角色
 */
export type GroupMemberRole = 'admin' | 'member'

/**
 * 圈子创建者信息
 */
export interface GroupCreator {
  id: number
  username: string
}

/**
 * 圈子基本信息
 */
export interface Group {
  id: string
  name: string
  keyword: string
  description: string
  memberCount: number
  createdAt: string
  icon?: string
  cover?: string
  activeCount?: number
  postCount?: number
}

/**
 * 圈子详情
 */
export interface GroupDetail extends Group {
  iconUrl: string
  coverUrl: string
  createdBy: GroupCreator
}

/**
 * 创建圈子参数
 */
export interface CreateGroupParams {
  name: string
  keyword?: string
  description?: string
  iconUrl?: string
  coverUrl?: string
}

/**
 * 更新圈子参数
 */
export interface UpdateGroupParams {
  name?: string
  keyword?: string
  description?: string
  iconUrl?: string
  coverUrl?: string
}

/**
 * 圈子成员信息
 */
export interface GroupMember {
  id: string
  user: {
    id: number
    username: string
  }
  role: GroupMemberRole
  joinedAt: string
}

/**
 * 更新圈子成员角色参数
 */
export interface UpdateGroupMemberRoleParams {
  role: GroupMemberRole
}

/**
 * 我加入的圈子列表项
 */
export interface MyGroupItem {
  id: string
  group: {
    id: string
    name: string
    keyword: string
    description: string
  }
  role: GroupMemberRole
  joinedAt: string
}

/**
 * 圈子成员数响应
 */
export interface GroupMemberCountResult {
  count: number
}

/**
 * 圈子成员状态响应
 */
export interface GroupMembershipResult {
  member: boolean
}

// ==================== 社区点赞模块类型 ====================

/**
 * 点赞数响应
 */
export interface LikeCountResult {
  count: number
}

/**
 * 点赞状态响应
 */
export interface LikeCheckResult {
  liked: boolean
}

// ==================== 用户关注模块类型 ====================

/**
 * 关注关系用户信息
 */
export interface FollowUser {
  id: number
  username: string
}

/**
 * 我的关注列表项（简化格式）
 */
export interface MyFollowingItem {
  id: string
  followingId: number
  followingName: string
  followingAvatar: string
  createdAt: string
}

/**
 * 我的粉丝列表项（简化格式）
 */
export interface MyFollowerItem {
  id: string
  followerId: number
  followerName: string
  followerAvatar: string
  createdAt: string
}

/**
 * 关注关系信息（旧格式，保留兼容）
 */
export interface FollowRelation {
  id: string
  followerId: number
  followingId: number
  createdAt: string
}

/**
 * 关注数响应
 */
export interface FollowCountResult {
  count: number
}

/**
 * 关注状态响应
 */
export interface FollowCheckResult {
  following: boolean
}

// ==================== 文件上传模块类型 ====================

/**
 * 文件上传结果
 */
export interface UploadResult {
  url: string
  filename: string
  size: number
}

// ==================== 邀请管理模块类型 ====================

/**
 * 邀请验证结果
 */
export interface InvitationValidateResult {
  valid: boolean
  team: {
    uuid: string
    name: string
  }
  role: string
}

// ==================== 系统接口类型 ====================

/**
 * 系统主页响应
 */
export interface SystemHomeResult {
  version: string
  docs: string
}

/**
 * 健康检查响应
 */
export interface HealthCheckResult {
  status: number
  message: string
  data: string
}
