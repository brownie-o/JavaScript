<template lang="pug">
VNavigationDrawer(permanent)
  VList
    VListItem(:prepend-avatar :title="user.account")
  VDivider
  VList
    VListItem(
      v-for="item in navItems" :key="item.to"
      :to="item.to" :title="item.text" :prepend-icon="item.icon"
    )
VMain
  RouterView
</template>

<script setup>
import { useUserStore } from '@/store/user';
import { computed } from 'vue';

const user = useUserStore()

const navItems = [
  { to: '/admin/products', text: '商品管理', icon: 'mdi-shopping' },
  { to: '/admin/orders', text: '訂單管理', icon: 'mdi-list-box' },
  { to: '/', text: '回首頁', icon: 'mdi-home' }
]

const prependAvatar = computed(() => {
  return `https://source.boringavatars.com/beam/120/${user.account}?colors=379F7A,78AE62,BBB749,E0FBAC,1F1C0D`
})
</script>
