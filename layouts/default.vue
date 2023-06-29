<script setup lang="ts">
useHead({
  htmlAttrs: {
      lang: 'ru'
    },
  meta: [
    { name: 'Friends', content: 'Author: ebolblga and Giorno-Giovana' }
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
    background-color: #202124;
    color: #BDC1C6;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: #ffffff86;
  outline: 1px solid slategrey;
  border-radius: 4px;
}

::-webkit-scrollbar-corner {
    background: transparent;
}
</style>