/**
 * API 统一导出
 * @description 导出所有 API 模块和工具
 */

// 类型定义
export * from './types'

// 请求实例
export { default as service } from './request'
export type { Result } from './request'

// 缓存工具
export { requestCache, withCache } from './cache'

// 去重工具
export { deduplicator, shouldDeduplicate } from './deduplicate'

// 用户管理
export * from './user'

// 团队管理
export * from './team'

// 项目管理
export * from './project'

// 项目市场
export * from './market'

// 文件上传
export * from './file'

// 邀请管理
export * from './invitation'

// 用户关注
export * from './follow'

// 系统接口
export * from './system'

// 社区模块
export * from './community'

// 报名审核统计
export * from './sign'
