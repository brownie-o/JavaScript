// Composables
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/', // 首頁
    component: () => import('@/layouts/FrontLayout.vue'),
    children: [
      {
        path: '', // '' = '/ ' = '/' 首頁
        name: 'Home',
        component: () => import('@/views/front/HomeView.vue'),
        meta: {
          title: '購物網'
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/views/front/RegisterView.vue'),
        meta: {
          title: '購物網 | 註冊'
        }
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/front/LoginView.vue'),
        meta: {
          title: '購物網 | 登入'
        }
      }
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

// 進到每一頁之後把頁面的標題改掉
router.afterEach((to, from) => {
  document.title = to.meta.title
})

export default router
