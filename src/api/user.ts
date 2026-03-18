/**
 * 用户管理接口
 * @description 封装用户模块的所有 HTTP 请求方法
 */
import service from './request'
import type { ApiResponse } from './types'
import type {
  LoginParams,
  RegisterParams,
  UpdateUserParams,
  User,
  LoginResult,
  GetUsersParams,
  PageData,
  DeleteUsersParams
} from './types'

/**
 * 用户登录
 * @param params - 登录参数
 */
export function login(params: LoginParams) {
  return service.post<ApiResponse<LoginResult>>('/user/login', params)
}

/**
 * 用户注册
 * @param params - 注册参数
 */
export function register(params: RegisterParams) {
  return service.post<ApiResponse<User>>('/user/register', params)
}

/**
 * 更新用户信息
 * @param params - 更新参数
 */
export function updateUser(params: UpdateUserParams) {
  return service.post<ApiResponse<User>>('/user/update', params)
}

/**
 * 分页查询用户列表
 * @param params - 查询参数
 */
export function getAllUsers(params?: GetUsersParams) {
  return service.get<ApiResponse<PageData<User>>>('/user/getAllUsers', { params })
}

/**
 * 批量删除用户
 * @param params - 删除参数
 */
export function deleteUsers(params: DeleteUsersParams) {
  return service.post<ApiResponse<null>>('/user/deleteUsers', params)
}
