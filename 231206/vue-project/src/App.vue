<template>
  <h1>{{text}}</h1>
</template>

<!-- 1. option
<script>
export default {
  data () {
    return {
      text: 'abc'
    }
  }
}
</script>
-->

<!-- 2. composition
<script>
import { ref } from 'vue'
export default {
  setup() {
    const text = ref('abc')
    return {
      text
    }
  }
}
</script>
-->

<!-- 3. -->
<script setup>
import { ref } from 'vue'
const text = ref('abc')
</script>

<style></style>
