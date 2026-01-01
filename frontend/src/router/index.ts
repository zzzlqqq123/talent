import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/Auth/Login.vue'),
        meta: { title: '登录' }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/Auth/Register.vue'),
        meta: { title: '注册' }
      }
    ]
  },
  {
    path: '/test',
    children: [
      {
        path: 'intro',
        name: 'TestIntro',
        component: () => import('@/views/Test/Intro.vue'),
        meta: { title: '测试介绍', requiresAuth: true }
      },
      {
        path: 'questions/:page?',
        name: 'TestQuestions',
        component: () => import('@/views/Test/Questions.vue'),
        meta: { title: '答题', requiresAuth: true }
      },
      {
        path: 'complete',
        name: 'TestComplete',
        component: () => import('@/views/Test/Complete.vue'),
        meta: { title: '测试完成', requiresAuth: true }
      }
    ]
  },
  {
    path: '/report',
    children: [
      {
        path: 'history',
        name: 'ReportHistory',
        component: () => import('@/views/Report/History.vue'),
        meta: { title: '历史记录', requiresAuth: true }
      },
      {
        path: 'comparison',
        name: 'ReportComparison',
        component: () => import('@/views/Report/Comparison.vue'),
        meta: { title: '对比分析', requiresAuth: true }
      },
      {
        path: ':reportId',
        name: 'ReportDetail',
        component: () => import('@/views/Report/Detail.vue'),
        meta: { title: '报告详情', requiresAuth: true }
      }
    ]
  },
  {
    path: '/user',
    children: [
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('@/views/User/Profile.vue'),
        meta: { title: '个人中心', requiresAuth: true }
      },
      {
        path: 'settings',
        name: 'UserSettings',
        component: () => import('@/views/User/Settings.vue'),
        meta: { title: '设置', requiresAuth: true }
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/About.vue'),
    meta: { title: '关于' }
  },
  {
    path: '/share/:shareId',
    name: 'ReportShare',
    component: () => import('@/views/Report/Share.vue'),
    meta: { title: '分享报告' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || '个人天赋测试系统'} - 天赋测试`

  const token = localStorage.getItem('token')

  // 需要登录的页面
  if (to.meta.requiresAuth && !token) {
    next({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 已登录用户访问登录页，跳转到首页
  if ((to.path === '/auth/login' || to.path === '/auth/register') && token) {
    next('/')
    return
  }

  next()
})

export default router
