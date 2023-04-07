import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home/index'
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    children: [{
      path: 'index',
      name: '/home/index',
      component: () => import('../views/index/Index.vue'),
      meta: {
        keepAlive: true
      }
    },{
      path: 'video',
      name: '/home/video',
      component: () => import('../views/video/Video.vue'),
    },{
      path: 'show',
      name: '/home/show',
      component: () => import('../views/show/Show.vue'),
    },{
      path: 'me',
      name: '/home/me',
      component: () => import('../views/me/Me.vue'),
    },]
  },
  {
    path: '/detail/:id',
    name: 'detail',
    component: () => import('../views/index/MovieDetail.vue')
  },
  {
    path: '/cinema-selection/:id',
    name: 'cinema-selection',
    component: () => import('../views/index/CinemaSelection.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
