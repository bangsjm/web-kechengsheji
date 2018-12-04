import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/Login'
import Main from '@/pages/Main'
import Page404 from '@/pages/404'
import index from '@/pages/index'



import Management from '@/pages/setting/user/Management'
import ModuleManagement from '@/pages/setting/module/ModuleManagement'

import DictionaryQuery from '@/pages/setting/dictionary/DictionaryQuery'
import DictionaryEdit from '@/pages/setting/dictionary/DictionaryEdit'
import DataRole from '@/pages/setting/dataRole/DataRole'
import Role from  '@/pages/setting/role/Role'
import Organization from  '@/pages/setting/organization/Organization'
import Unit from '@/pages/setting/unit/UnitManagement'
Vue.use(Router)

const routes = [
  {
    path: '*',
    name: '404',
    component: Page404
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: '登录',
    component: Login,
  },
  {
    path: '/index',
    component: Main,
    children: [
      {
        path: 'p1',
        name: '首页',
        component: index
      }
    ]
  },

  



{
  path: '/setting/user',
    component
:
  Main,
    children
:
  [
    {
      path: 'menagement',
      name: '用户管理',
      component: Management,
      meta: {
        keepAlive: true
      }
    },
  ]
}
,
{
  path: '/setting/module',
    component
:
  Main,
    children
:
  [
    {
      path: 'moduleManagement',
      name: '模块管理',
      component: ModuleManagement,
      meta: {
        keepAlive: true
      }
    },
  ]
}
,
{
  path: '/setting/dictionary',
    component
:
  Main,
    children
:
  [
    {
      path: 'DictionaryQuery',
      name: '数据字典',
      component: DictionaryQuery,
      meta: {
        keepAlive: true
      }
    },
    {
      path: 'dictionaryEdit',
      name: '字典编辑',
      component: DictionaryEdit,
      meta: {
        keepAlive: true
      }
    },
  ]
}
,
{
  path: '/setting/datarole',
    component
:
  Main,
    children
:
  [
    {
      path: 'dataRole',
      name: '数据角色',
      component: DataRole,
      meta: {
        keepAlive: true
      }
    },
  ]
}
,
{
  path: '/setting/role',
    component
:
  Main,
    children
:
  [
    {
      path: 'role',
      name: '权限管理',
      component: Role,
      meta: {
        keepAlive: true
      }
    },
  ]
}
,
{
  path: '/setting/organization',
    component
:
  Main,
    children
:
  [
    {
      path: 'organization',
      name: '组织管理',
      component: Organization,
      meta: {
        keepAlive: true
      }
    },
  ]
}
,
{
  path: '/setting/unit',
    component
:
  Main,
    children
:
  [
    {
      path: 'unit',
      name: '单位管理',
      component: Unit,
      meta: {
        keepAlive: true
      }
    },
  ]
}
,




]

export default new Router({
  mode: 'history',
  routes: routes,
})
