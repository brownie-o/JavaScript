<template lang="pug">
TopImage
#left
  LeftMenu
#right
  RightMarquee
  #content
    RouterView
</template>

<script setup>
import TopImage from '@/components/TopImage.vue'
import LeftMenu from '@/components/LeftMenu.vue'
import RightMarquee from '@/components/RightMarquee.vue'
</script>
