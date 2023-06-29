<script setup>
</script>
<template>
  <div>
    <label :for="$attrs.id" class="text-white"><slot /></label>
    <div class="flex flex-row">
      <div class="bg-white w-[2px] h-[3vh] mt-1"></div>
      <input v-bind="$attrs" :value="$attrs.modelValue" type="text" class="placeholder:text-[#BDC1C6] w-[95%] p-2 border-b-2 border-white mb-3 bg-transparent outline-0" @input="$emit('update:modelValue', $event.target.value)">
    </div>
  </div>
</template>