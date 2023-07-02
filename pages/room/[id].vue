<script setup lang="ts">
// @ts-expect-error
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import { IRoom } from '~~/models/room';
useHead({ title: `Комната` });

const { id } = useRoute().params;

const username = ref("");
const room = ref<IRoom>({_id: id.toString(), title: '', users: [], events: []});
const events = ref<IEvent[]>([]);

interface IEvent {
  start: Date,
  end: Date,
  title: string,
  class: string,
  background: boolean
};

onMounted(async () => {
  if (typeof window !== 'undefined') {
    username.value = localStorage.getItem('username') || "";
  }

  room.value = await $fetch<IRoom>('/api/room', { query: { id: id } });
  updateDisplayedEvents();
  room.value.title = room.value.title.charAt(0).toUpperCase() + room.value.title.slice(1);
  room.value.title = room.value.title.replace(/^\s+|\s+$/g, '');
  useHead({ title: `${room.value.title}` });
});

async function copyRoute() {
  const baseIP: string = 'http://localhost:3000';
  navigator.clipboard.writeText(baseIP + useRoute().path);
  console.log(room.value);
}

const addEvent = (newEvent) => {
  room.value.events.push({ start: newEvent.start, end: newEvent.end, title: username.value });
  events.value.push({ start: newEvent.start, end: newEvent.end, title: username.value, class: 'event', background: false });
  const response = $fetch<IRoom>('/api/room', { method: 'PUT', body: { ...room.value } });
  console.log(response);
  findMeetingTime();
};

async function findMeetingTime() {
  if (room.value.events.length < 2) return;

  const array: Array<{ type: string, date: Date }> = [];

  room.value.events.forEach(item => {
    array.push({ type: 'start', date: new Date(item.start) });
    array.push({ type: 'end', date: new Date(item.end) });
  });

  array.sort((a, b) => {
    return a.date.getTime() - b.date.getTime();
  });

  let nesting = 1;
  let maxNesting = nesting;
  let bestRange: { start: Date, end: Date } = { start: array[0].date, end: array[1].date };
  for (let i = 1; i < array.length; i++) {
    if (array[i].type === 'start') {
      nesting++
    } else nesting--;

    if (nesting > maxNesting) {
      maxNesting = nesting;
      bestRange = { start: array[i].date, end: array[i + 1].date };
    }
  }

  let flag: boolean = false;
  events.value.forEach(item => {
    if (item.class === 'meeting') {
      item.start = bestRange.start;
      item.end = bestRange.end
      flag = true;
    }
  });

  if (!flag) events.value.push({ title: 'Meeting', start: bestRange.start, end: bestRange.end, class: 'meeting', background: true });
}

async function updateDisplayedEvents() {
  room.value.events.forEach( item => {
    if (item.title === username.value) {
      events.value.push({title: item.title, start: new Date(item.start), end: new Date(item.end), class: 'event', background: false});
    }
  });

  findMeetingTime();
}

async function saveUsername() {
  localStorage.setItem('username', username.value);
}

async function roomNameChange(e) {
  if (!e.target) return;
  const newName = <HTMLInputElement>(e.target).innerText;
  room.value.title = newName.toString();
  useHead({ title: `${room.value.title}` });
  const response = await $fetch<IRoom>('/api/room', { method: 'PUT', body: { ...room.value, title: room.value.title } });
  console.log(response);
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
        ref="vuecal"
          small
          :disable-views="['years', 'year', 'month']"
          :time-from="0 * 60"
          :time-to="24 * 60"
          :time-step="60"
          :snap-to-time="15"
          locale="ru"
          :events="events"
          @event-drag-create="addEvent"
          :editable-events="{ title: false, drag: true, resize: true, delete: true, create: true }">
        </vue-cal>
      </div>
    </div>
</template>
<style>
.vuecal__event.meeting {
  background: repeating-linear-gradient(45deg, transparent, transparent 10px, #f2f2f2 10px, #f2f2f2 20px);/* IE 10+ */
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>