<template lang="pug">
//- 元件在HTML有兩種寫法 
//- HomeView or 
//- home-view

//- router也是
//- RouterView or 
//- router-view

//- 最外層要包一個VApp的div
//- v-app 
VApp
  VAppBar
    //- 加上 d-flex align-center 才不會跑版 
    VContainer.d-flex.align-center
      VAppBarTitle 測試 
      //- VBtn有to功能 可以不用設@click
      VBtn(prepend-icon="mdi-home" to="/") 首頁
      VBtn(prepend-icon="mdi-information" to="/about") 關於
  VMain 
    RouterView
</template>

<script setup>

</script>
