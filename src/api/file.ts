import service from './request'
import type { Result } from './request'

export interface UploadResult {
  url: string
  filename: string
  size: number
}

export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return service.post<Result<UploadResult>>('/file/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
