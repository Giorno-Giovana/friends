<script setup lang="ts">
useHead({ title: "Friends" });

async function createRoom() {
    const { _id } = await $fetch('/api/room', { method: 'POST' });
    useRouter().push({ path: '/room/' + _id });
}
</script>
<template>
    <div class="h-screen flex justify-center">
        <div class="w-[90vw] lg:w-[50vw] my-52 min-w-[300px]">
            <p class="text-2xl mt-10 text-center font-bold">Привет!</p>
            <p class="text-center mt-3">Планируйте встречу с друзьями? Просто создайте комнату, выделите удобное вам время для встречи и поделитесь ссылкой с остальными</p>
            <my-button class="mt-3" @click="createRoom">Создать новую комнату
                <Icon class="ml-3" name="ic:outline-groups" size="32px" />
            </my-button>
        </div>
    </div>
</template>