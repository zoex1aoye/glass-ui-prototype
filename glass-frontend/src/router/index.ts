import { createRouter, createWebHistory } from 'vue-router'

import DocsShell from '@/layouts/DocsShell.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: DocsShell,
      children: [
        {
          path: '',
          name: 'overview',
          component: () => import('@/views/system/lab/LabOverviewView.vue'),
          meta: { title: 'Overview' },
        },
        {
          path: 'layout',
          name: 'layout',
          component: () => import('@/views/system/lab/LabLayoutView.vue'),
          meta: { title: 'Layout' },
        },
        {
          path: 'poster',
          name: 'poster',
          component: () => import('@/views/system/lab/LabPosterView.vue'),
          meta: { title: 'Poster 技法' },
        },
        {
          path: 'actions',
          name: 'actions',
          component: () => import('@/views/system/lab/LabActionsView.vue'),
          meta: { title: 'Actions' },
        },
        {
          path: 'inputs',
          name: 'inputs',
          component: () => import('@/views/system/lab/LabInputsView.vue'),
          meta: { title: 'Inputs' },
        },
        {
          path: 'forms',
          name: 'forms',
          component: () => import('@/views/system/lab/LabFormView.vue'),
          meta: { title: 'Forms' },
        },
        {
          path: 'overlay',
          name: 'overlay',
          component: () => import('@/views/system/lab/LabOverlayView.vue'),
          meta: { title: 'Overlay' },
        },
        {
          path: 'feedback',
          name: 'feedback',
          component: () => import('@/views/system/lab/LabFeedbackView.vue'),
          meta: { title: 'Feedback' },
        },
        {
          path: 'data',
          name: 'data',
          component: () => import('@/views/system/lab/LabDataView.vue'),
          meta: { title: 'Data' },
        },
        {
          path: 'navigation',
          name: 'navigation',
          component: () => import('@/views/system/lab/LabNavigationView.vue'),
          meta: { title: 'Navigation' },
        },
      ],
    },
    // 旧 /system/lab/* 与 /workbench → 扁平 path / 首页
    { path: '/system/lab', redirect: '/' },
    { path: '/system/lab/workbench', redirect: '/' },
    { path: '/system/lab/containers', redirect: '/layout' },
    { path: '/system/lab/layout', redirect: '/layout' },
    { path: '/system/lab/poster', redirect: '/poster' },
    { path: '/system/lab/actions', redirect: '/actions' },
    { path: '/system/lab/inputs', redirect: '/inputs' },
    { path: '/system/lab/form', redirect: '/forms' },
    { path: '/system/lab/forms', redirect: '/forms' },
    { path: '/system/lab/overlay', redirect: '/overlay' },
    { path: '/system/lab/feedback', redirect: '/feedback' },
    { path: '/system/lab/data', redirect: '/data' },
    { path: '/system/lab/navigation', redirect: '/navigation' },
    { path: '/system/lab/flow', redirect: '/navigation' },
    { path: '/containers', redirect: '/layout' },
    { path: '/flow', redirect: '/navigation' },
    { path: '/system/components', redirect: '/' },
    { path: '/workbench', redirect: '/' },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
