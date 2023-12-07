<template lang="pug">
table
  //- eslint規定要綁key 綁i = 綁陣列索引
  template(v-for="(link, i) in links", :key="i")
    tr
      td
        RouterLink(:to="link.to")
          img(:src="link.img")
    tr
      td &nbsp;
  p
    RouterLink(to="/") 檔案下載
</template>

<script setup>
const links = [
  { to: '/yangmingshan', img: new URL('@/assets/park0302.jpg', import.meta.url).href },
  { to: '/sheipa', img: new URL('@/assets/park0303.jpg', import.meta.url).href },
  { to: '/', img: new URL('@/assets/park0304.jpg', import.meta.url).href },
  { to: '/', img: new URL('@/assets/park0305.jpg', import.meta.url).href }
]
</script>
