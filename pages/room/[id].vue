<script setup lang="ts">
// @ts-expect-error
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import { IRoom } from '~~/models/room';
useHead({ title: `Комната` });

const { id } = useRoute().params;


const username = ref("");
const events = ref<IEvent[]>([]);
const room = ref<IRoom>({_id: '', title: '', users: [], events: []});

interface IEvent {
  start: string,
  end: string,
  title: string
};

onMounted(async () => {
  if (typeof window !== 'undefined') {
    username.value = localStorage.getItem('username') || "";
  }

  room.value = await $fetch<IRoom>('/api/room', { query: { id: id } });
  room.value.title = room.value.title.charAt(0).toUpperCase() + room.value.title.slice(1);
  room.value.title = room.value.title.replace(/^\s+|\s+$/g,'');
  useHead({ title: `${ room.value.title }` });

  // events.value.push({ start: "2023-06-28 10:35", end: "2023-06-29 10:35", title: ""});
});

async function copyRoute() {
  const baseIP: string = 'http://localhost:3000';
  navigator.clipboard.writeText(baseIP + useRoute().path);
  console.log(events.value);
}

async function saveUsername() {
  localStorage.setItem('username', username.value);
}

async function roomNameChange(e) {
  if (!e.target) return;
  const bruh = <HTMLInputElement>(e.target).innerText;
  room.value.title = bruh.toString();
  console.log(room.value.title);
}
</script>
<template>
    <div class="h-screen flex flex-col justify-center relative">
      <NuxtLink to="/" class="absolute left-1 top-1">
        <svg class="fill-[#EC81FE] scale-50 hover:scale-[45%]" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M400-80 0-480l400-400 56 57-343 343 343 343-56 57Z"/></svg>
      </NuxtLink>
      <div class="h-[17vh] w-[90vw] lg:w-[50vw] min-w-[300px] mx-auto">
        <p class="text-center">Комната "<span contenteditable class="cursor-pointer" @input="roomNameChange($event)">{{ room.title }}</span>"</p>
        <my-input id="username" placeholder="Введите имя" v-model="username" @change="saveUsername">Ваше имя</my-input>
        <my-button class="mt-1" @click="copyRoute">Копировать ссылку на комнату
          <svg class="ml-1 scale-50" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M176-45q-38.225 0-65.112-27.406Q84-99.812 84-136v-589h92v589h459v91H176Zm148-148q-37.812 0-64.406-27.612Q233-248.225 233-284v-542q0-36.188 26.594-63.594T324-917h421q37.588 0 64.794 27.406Q837-862.188 837-826v542q0 35.775-27.206 63.388Q782.588-193 745-193H324Zm0-91h421v-542H324v542Zm0 0v-542 542Z"/></svg>
        </my-button>
      </div>
      <div class="h-[83vh]">
        <vue-cal
          :disable-views="['years', 'year', 'month']"
          :time-from="0 * 60"
          :time-to="24 * 60"
          :time-step="60"
          locale="ru"
          :events="events"
          :editable-events="{ title: false, drag: true, resize: true, delete: true, create: true }">
        </vue-cal>
      </div>
    </div>
</template>