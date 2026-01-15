import type { RouteRecordRaw } from 'vue-router'

const projectRoutes: RouteRecordRaw[] = [
  {
    path: '/project/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/ProjectDetailView.vue')
  },
  {
    path: '/project/create',
    name: 'CreateProject',
    component: () => import('@/views/project/CreateProjectView.vue')
  },
  {
    path: '/project/doc/:id',
    name: 'DocumentEditor',
    component: () => import('@/views/editor/AiDocumentEditorView.vue')
  },
  {
    path: '/project/workspace/:id',
    name: 'ProjectWorkspace',
    component: () => import('@/views/project/ProjectWorkspaceView.vue')
  },
  {
    path: '/project/workspace/:id/file/:fileId',
    name: 'ProjectFileEditor',
    component: () => import('@/views/project/ProjectFileEditorView.vue')
  }
]

export default projectRoutes

