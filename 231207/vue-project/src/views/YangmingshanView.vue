<template lang="pug">
h1 陽明山
//- $可加可不加 但如果沒有用useRoute就需要加$
p {{ $route.path }}
//- qqery參數 把變數跟值存在網址裡
p {{ $route.fullPath }}
input(type="button" value="上一頁" @click="goPrev")
input(type="button" value="回首頁" @click="goHome")
</template>

<script setup>
// useRoute 取資料
// useRouter 轉分頁
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
// 取目前路由資訊
const route = useRoute()
// 路由操作
const router = useRouter()

const goPrev = () => {
  // router.go(相對數字)
  // > 0  後幾頁
  // < 0  前幾頁
  router.go(-1)
}

const goHome = () => {
  // router.push(路徑)
  // router.push('/')

  // router.push - 跳轉到本網站的頁面
  // router.push(指定路由名稱)
  router.push({ name: 'home' })
}

onMounted(() => {
  console.log(route.path)
})
</script>

<!-- <script>
export default {
  methods: {
    goPrev () {
      this.$router.go(-1)
    },
    goHome () {
      this.$router.push('/')
    }
  },
  mounted () {
    console.log(this.$route.path)
  }
}
</script> -->
