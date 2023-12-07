// createWebHistory -> createWebHashHistory 讓瀏覽器可以找到對的頁面 ex: about page
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // 什麼路徑
      path: '/',
      // 給他一個名字
      name: 'home',
      // 顯示什麼元件
      component: HomeView,
      meta: {
        title: '國家公園介紹網'
      }
    },
    // 另外打包 切換到about頁時才會跑about需要的js檔
    // 多設定一個路由
    {
      // 路徑是yangmingshan時
      path: '/yangmingshan',
      name: 'yangmingshan',
      // 讀取yangmingshan元件
      // 另外把元件用function import進來
      component: () => import('@/views/YangmingshanView.vue'),
      // 進入此頁前執行
      // beforeEnter () { },
      // 進入此頁後執行
      // afterEnter () { },
      meta: {
        title: '國家公園介紹網 | 陽明山'
      }
    },
    {
      path: '/sheipa',
      name: 'sheipa'
    }
  ]
})

// 進入每一頁前執行
// to = 目標頁面
// from = 來源頁面
// next = 重新導向，跳轉
router.beforeEach((to, from, next) => {
  // 如果目標頁是sheipa
  if (to.name === 'sheipa') {
    // 重新導向回首頁
    next('/')
  } else {
    // 該去哪就去哪
    next()
  }
})
// 進入每一頁後執行
// to = 目標頁面
// from = 來源頁面
router.afterEach((to, from) => {
  document.title = to.meta.title
})

export default router
