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
}

export interface BackendUser {
  id: number
  username: string
  email: string
}

export interface LoginResult {
  token: string
  user: BackendUser
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
