<script setup lang="ts">
useHead({ title: "Friends" });

const roomName = ref("");

async function createRoom() {
    const { _id } = await $fetch('/api/create-room')
    useRouter().push('/room/'+_id)
}

</script>
<template>
    <div class="h-screen">
        <div class="w-[90vw] mx-auto">
            <p class="text-2xl mt-10 text-center">Привет!</p>
            <my-input id="Room_name" placeholder="Введите название комнаты" v-model="roomName">Название комнаты</my-input>
            <my-button class="mt-10" @click="createRoom">Создать комнату</my-button>
        </div>
    </div>
</template>