import Vue from 'vue'
import Router from 'vue-router'
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading
/* layout */
import Layout from '../views/layout/Layout'

const _import = require('./_import_' + process.env.NODE_ENV)
Vue.use(Router)
export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {path: '/404', component: _import('404'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'home' }
    }]
  }
]
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})
export const asyncRouterMap = [
  {
    path: '/auth',
    component: Layout,
    redirect: '/auth',
    name: '',
    meta: {title: '用户权限', icon: 'table'},
    children: [
      {
        path: 'user',
        name: '用户管理',
        component: _import('auth/user'),
        meta: {title: '用户列表', icon: 'user'},
        menu: 'user:list'
      },
      {
        path: 'role',
        name: '角色管理',
        component: _import('auth/role'),
        meta: {title: '角色管理', icon: 'role'},
        menu: 'role:list'
      },
      {
        path: 'auth',
        name: '权限管理',
        component: _import('auth/permission'),
        meta: {title: '权限管理', icon: 'password'},
        menu: 'permission:list'
      },
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system',
    name: '',
    meta: {title: '系统管理', icon: 'system'},
    children: [
      {
        path: 'log',
        name: '操作日志',
        component: _import('system/log'),
        meta: {title: '操作日志', icon: 'log'},
        menu: 'system:log-list'
      },
      {
        path: 'session',
        name: '在线用户',
        component: _import('system/session'),
        meta: {title: '在线用户', icon: 'online'},
        menu: 'system:session-list'
      },
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]
