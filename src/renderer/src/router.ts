import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Horizon',
    component: () => import('@renderer/views/Horizon/index.vue')
  },
  {
    path: '/control',
    name: 'Controls',
    component: () => import('@renderer/views/Controls/index.vue')
  },
  {
    path: '/annular',
    name: 'Annular',
    component: () => import('@renderer/views/Loop/index.vue')
  },

  {
    path: '/vertical',
    name: 'Vertical',
    component: () => import('@renderer/views/vertical/index.vue')
  },
  {
    path: '/product',
    name: 'Product',
    component: () => import('@renderer/views/product/index.vue')
  },
  {
    path: '/alarm',
    name: 'Alarm',
    component: () => import('@renderer/views/Alarm/index.vue')
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('@renderer/views/Setting/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
