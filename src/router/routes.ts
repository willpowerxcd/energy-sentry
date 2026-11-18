import type { RouteRecordRaw } from 'vue-router'

const PlaceholderView = () => import('@/views/common/PlaceholderView.vue')

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: { title: '登录', public: true },
  },
  {
    path: '/',
    name: 'root',
    component: () => import('@/layouts/AdminLayout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { title: '首页总览', headerTitle: '园区能耗总览', icon: 'home' },
      },
      {
        path: 'monitoring',
        name: 'monitoring',
        component: PlaceholderView,
        meta: {
          title: '能耗监测',
          icon: 'monitoring',
          description: '能耗曲线、数据质量面板、小时数据表与 CSV 上传将在 M4 接入。',
        },
      },
      {
        path: 'alarms',
        name: 'alarms',
        component: PlaceholderView,
        meta: {
          title: '异常告警',
          icon: 'alarm',
          description: '告警筛选、风险分级、处置抽屉与派单闭环将在 M3 接入。',
        },
      },
      {
        path: 'buildings/:id',
        name: 'building-detail',
        component: PlaceholderView,
        meta: {
          title: '楼栋详情',
          hidden: true,
          description: '楼栋画像、能耗曲线、告警与建议汇总将在 M4 接入。',
        },
      },
      {
        path: 'efficiency',
        name: 'efficiency',
        component: PlaceholderView,
        meta: {
          title: '能效分析',
          icon: 'efficiency',
          description: '基线精度、楼栋对比与模型评估将在 M5 接入。',
        },
      },
      {
        path: 'suggestions',
        name: 'suggestions',
        component: PlaceholderView,
        meta: {
          title: '节能建议',
          icon: 'suggestion',
          description: '节能措施、收益测算与治理清单将在 M5 接入。',
        },
      },
      {
        path: 'reports',
        name: 'reports',
        component: PlaceholderView,
        meta: {
          title: '报表中心',
          icon: 'report',
          description: '周报/月报生成、A4 预览与导出将在 M6 接入。',
        },
      },
      {
        path: 'reports/:id/preview',
        name: 'report-preview',
        component: PlaceholderView,
        meta: {
          title: '报告预览',
          hidden: true,
          description: '两页 A4 节能诊断报告将在 M6 接入。',
        },
      },
      {
        path: 'devices',
        name: 'devices',
        component: PlaceholderView,
        meta: {
          title: '设备管理',
          icon: 'device',
          description: '表计、网关在线状态与离线事件将在 M7 接入。',
        },
      },
      {
        path: 'settings',
        name: 'settings',
        component: PlaceholderView,
        meta: {
          title: '系统设置',
          icon: 'settings',
          roles: ['admin'],
          description: '用户角色、楼栋档案、告警阈值、模型版本与审计日志将在 M7 接入。',
        },
      },
      {
        path: 'dev/ui-kit',
        name: 'ui-kit',
        component: () => import('@/views/dev/UiKitView.vue'),
        meta: { title: 'UI Kit', hidden: true, devOnly: true },
      },
    ],
  },
  {
    path: '/screen',
    name: 'screen',
    component: () => import('@/views/screen/ScreenView.vue'),
    meta: { title: '可视化大屏' },
  },
  {
    path: '/403',
    name: 'forbidden',
    component: () => import('@/views/error/ForbiddenView.vue'),
    meta: { title: '无访问权限', public: true },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/error/NotFoundView.vue'),
    meta: { title: '页面不存在', public: true },
  },
]
