import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home.vue'
import StrategyEdit from '@/views/StrategyEdit.vue'


import CustomTree from '@/views/CustomTree.vue'
import CustomTreea from '@/views/CustomTreea.vue'
import CustomTreeb from '@/views/CustomTreeb.vue'

import EventList from '@/views/Event.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '事件系统'
    },
    redirect: '/event',

    children: [
      {
        path: '/event',
        name: 'Event',
        meta: {
          title: '事件列表'
        },
        component: () => import('@/views/Event.vue')
      },
      {
        path: "/dash",
        name: "Dash",
        meta: {
          title: 'Dashboard'
        },
        component: () => import('@/views/Dash.vue')
      },
      {
        path: '/strategy',
        name: 'Strategy',
        meta: {
          title: '策略管理'
        },
        component: () => import('@/views/Strategy.vue')
      },
    ]
  },
  {
    path: '/Strategy_Edit',
    name: 'StrategyEdit',
    component: StrategyEdit,
    meta: {
      title: '策略配置'
    }
  },
  {
    path: '/CustomTree',
    name: 'CustomTree',
    component: CustomTree,
    meta: {
      title: 'CustomTree'
    }
  },
  {
    path: '/CustomTreea',
    name: 'CustomTreea',
    component: CustomTreea,
    meta: {
      title: 'CustomTreea'
    }
  },
  {
    path: '/CustomTreeb',
    name: 'CustomTreeb',
    component: CustomTreeb,
    meta: {
      title: 'CustomTreeb'
    }
  },
  {
    path: '/EventList',
    name: 'EventList',
    component: EventList,
    meta: {
      title: 'EventList'
    }
  }

]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}


export default router
