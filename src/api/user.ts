import service from './request'
import type { Result } from './request'

export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams {
  username: string
  email: string
  password: string
}

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

export interface BackendUser {
  id: number
  username: string
  email: string
  avatar?: string | null
  role?: string
  createdAt?: string
  updatedAt?: string
  isHide?: boolean
  isNotifSys?: boolean
  isNotifTrends?: boolean
  isNotifPost?: boolean
  bio?: string | null
  position?: string | null
  address?: string | null
  perWebsite?: string | null
  phone?: string | null
}

export interface LoginResult {
  token: string
  userInfo: BackendUser
}

export interface GetUsersParams {
  page?: number
  size?: number
  username?: string
  email?: string
}

export interface PageResult<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export function login(params: LoginParams) {
  return service.post<Result<LoginResult>>('/user/login', params)
}

export function register(params: RegisterParams) {
  return service.post<Result<BackendUser>>('/user/register', params)
}

export function updateUser(params: UpdateUserParams) {
  return service.post<Result<BackendUser>>('/user/update', params)
}

export function getAllUsers(params?: GetUsersParams) {
  return service.get<Result<PageResult<BackendUser>>>('/user/getAllUsers', { params })
}

export function deleteUsers(userIds: number[]) {
  return service.post<Result<null>>('/user/deleteUsers', { userIds })
}
