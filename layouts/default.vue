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
    <div class="h-screen bg-[#DFDFDF] dark:bg-[#0C0C0C]">
      <slot />
    </div>
</template>
<style>
body {
    margin: 0;
}
</style>