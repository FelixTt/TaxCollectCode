import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-s-home' }
    }]
  },
  {
    path: '/projectManage',
    component: Layout,
    children: [{
      path: 'index',
      name: 'ProjectManage',
      component: () => import('@/views/projectManage/index'),
      meta: { title: '研发项目管理', icon: 'el-icon-s-management' }
    }]
  },
  {
    path: '/auxiliaryDetail',
    component: Layout,
    redirect: '/auxiliaryDetail',
    children: [{
      path: '/auxiliaryDetail',
      name: 'AuxiliaryDetail',
      component: () => import('@/views/dataDetail/auxiliaryDetail'),
      hidden: true,
      meta: { title: '辅助帐明细', icon: 'dashboard' }
    }]
  },
  // {
  //   path: '/dataDetail',
  //   component: Layout,
  //   redirect: '/dataDetail',
  //   children: [{
  //     path: '/dataDetail',
  //     name: 'DataDetail',
  //     component: () => import('@/views/dataDetail/index'),
  //     hidden: true,
  //     meta: { title: '辅助帐明细', icon: 'dashboard' }
  //   }]
  // },
  
  {
    path: '/projectDetail',
    component: Layout,
    redirect: '/detail',
    hidden: true,
    children: [{
      path: '/detail',
      name: 'ProjectDetail',
      hidden: true,
      component: () => import('@/views/projectDetail/index'),
      meta: { title: '项目费用填报', icon: 'dashboard' }
    }]
  },


  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: 'Example', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: 'Table', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: 'Tree', icon: 'tree' }
  //     }
  //   ]
  // },
  // {
  //   path: '/form',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       name: 'Form',
  //       component: () => import('@/views/form/index'),
  //       meta: { title: 'Form', icon: 'form' },
  //       hidden: true
  //     }
  //   ]
  // },
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://anhui.chinatax.gov.cn/col/col9483/index.html',
  //       meta: { title: '友情链接', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  // {
  //   path: '/roleManage',
  //   component: Layout,
  //   children: [{
  //     path: 'roleManage',
  //     name: 'RoleManage',
  //     component: () => import('@/views/projectManage/index'),
  //     meta: { title: '人员管理', icon: 'dashboard', roles: ['admin'] }
  //   }]
  // },
  {
    path: '/auxiliarySummary',
    component: Layout,
    // hidden: true,
    children: [{
      path: '/auxiliarySummary',
      name: 'AuxiliarySummary',
      component: () => import('@/views/dataDetail/auxiliarySummary.vue'),
      meta: { title: '辅助汇总表', icon: 'el-icon-notebook-1', roles: ['admin'] }
    }]
  },
  {
    path: '/userManage',
    component: Layout,
    children: [{
      path: '/userManage',
      name: 'UserManage',
      component: () => import('@/views/userManage/index'),
      meta: { title: '用户管理', icon: 'el-icon-user', roles: ['admin'] }
    }]
  },
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
