import service from './request'
import type { Result } from './request'

export interface MarketProject {
  id: string
  name: string
  description: string
  category: string
  likeCount: number
  viewCount: number
}

export interface MarketProjectDetail extends MarketProject {
  createdAt: string
  updatedAt: string
  author: {
    id: number
    username: string
  }
}

export interface ProjectListResult {
  projects: MarketProject[]
  total: number
  page: number
  size: number
}

export interface GetProjectListParams {
  page?: number
  size?: number
  keyword?: string
  category?: string
}

export function getProjectList(params?: GetProjectListParams) {
  return service.get<Result<ProjectListResult>>('/market/projects/list', { params })
}

export function getProjectDetail(projectId: string) {
  return service.get<Result<MarketProjectDetail>>(`/market/projects/${projectId}`)
}
