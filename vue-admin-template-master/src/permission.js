import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

import { constantRoutes } from './router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      // const hasGetUserInfo = store.getters.name

      // if (hasGetUserInfo) {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // let roles = store.getters.roles
      // const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
      // router.addRoutes(accessRoutes)

      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // 暂时将此处注释
          // await store.dispatch('user/getInfo')
          // next()
          
          // 这个获取roles，其实在登陆的时候就已经得到了，不需要重复发送请求
          let res = await store.dispatch('user/getInfo')
          let roles = []
          roles.push(res.rows[0].roles)
          // const { roles } = await store.dispatch('user/getInfo')
          // let roles = ['admin']
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
          router.addRoutes(accessRoutes)
          next()
          // next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          // console.log('----esle')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
