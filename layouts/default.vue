<script setup lang="ts">
useHead({
  htmlAttrs: {
      lang: 'ru'
    },
  meta: [
    { name: 'Friends', content: 'Author: ebolblga and Zaver' }
  ]
});
</script>
<template>
    <div class="h-screen">
      <slot />
    </div>
</template>
<style>
body {
    margin: 0;
}
</style>