<template lang="pug">
li {{ text }}
</template>

<script setup>
// defineProps() 定義props
defineProps({
  text: String
})
</script>
