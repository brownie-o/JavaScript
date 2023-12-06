<template lang="pug">
#menu
  h1 社團介紹
  ul
    LeftMenuBtn(v-for="club in clubs" :text="club")
</template>

<script setup>
import LeftMenuBtn from '@/components/LeftMenuBtn.vue'
const clubs = [
  '吉他社',
  '熱舞社',
  '棒球社',
  '羽球社',
  '足球社',
  '童軍社'
]
</script>
