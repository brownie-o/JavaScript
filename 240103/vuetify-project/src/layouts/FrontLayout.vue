<template lang="pug">
//- 手機版側欄 location: 開啟的位址
VNavigationDrawer(v-model="drawer" temporary location="left" v-if="isMobile")
  VList(nav)
    template(v-for="item in navItems" :key="item.to")
      VListItem(:to="item.to")
        template(#prepend)
          VIcon(:icon="item.icon")
        VListItemTitle {{ item.text }}
//- 導覽列
VAppBar(color = 'primary')
  VContainer.d-flex.align-center
    VBtn(to="/" :active="false")
      VAppBarTitle 購物網
    VSpacer
    //- 手機板導覽列
    template(v-if="isMobile")
      VAppBarNavIcon(@click="drawer = true")
    //- 電腦版導覽列 
    template(v-else)
      template(v-for="item in navItems" :key="item.to")
        VBtn(:to="item.to" :prepend-icon="item.icon") {{ item.text }}
//- 頁面內容
VMain
  RouterView
</template>

<script setup>
import { useDisplay } from 'vuetify';
import { ref, computed } from 'vue';

// 判斷是否為手機板
const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)

// 手機板側欄開關
const drawer = ref(false)

// 導覽列項目
const navItems = [
  { to: '/register', text: '註冊', icon: 'mdi-account-plus' },
  { to: '/login', text: '登入', icon: 'mdi-login' }
]
</script>