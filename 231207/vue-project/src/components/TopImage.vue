<template lang="pug">
#top
  //- 自己網站內跳頁時要用RouterLink 不能用a 才不會跳頁
  //- 可以寫name
  //- RouterLink(:to="{ name: 'home' }")
  //- 也可以寫路徑
  RouterLink(to="/")
    img(src="@/assets/park.gif")
</template>
