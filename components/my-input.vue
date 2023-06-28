<script setup>
</script>
<template>
    <div>
        <label :for="$attrs.id" class="text-black dark:text-white"><slot /></label>
        <div class="flex flex-row">
            <div class="bg-black w-[2px] h-[3vh] mt-1"></div>
            <input v-bind="$attrs" :value="$attrs.modelValue" type="text" class="placeholder:text-black dark:placeholder:text-[#7F7F7F] placeholder:text-opacity-40 w-[95%] p-2 border-b-2 border-black mb-3 dark:border-white bg-transparent outline-0" @input="$emit('update:modelValue', $event.target.value)">
        </div>
    </div>
</template>