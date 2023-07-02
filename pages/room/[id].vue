<script setup lang="ts">
// @ts-expect-error
import VueCal from 'vue-cal';
import 'vue-cal/dist/vuecal.css';
import { useLocalStorage } from '@vueuse/core';
import type { IRoom } from '~~/models/room';

const { id } = useRoute().params;

const username = useLocalStorage('username', '');
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
  room.value = await $fetch<IRoom>('/api/room', { query: { id: id } });
  updateDisplayedEvents();
  room.value.title = room.value.title.charAt(0).toUpperCase() + room.value.title.slice(1);
  room.value.title = room.value.title.replace(/^\s+|\s+$/g, '');
  useHead({ title: `${room.value.title}` });
});

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

  if (!flag) events.value.push({ title: 'Встреча', start: bestRange.start, end: bestRange.end, class: 'meeting', background: true });
}

async function updateDisplayedEvents() {
  room.value.events.forEach( item => {
    if (item.title === username.value) {
      events.value.push({title: item.title, start: new Date(item.start), end: new Date(item.end), class: 'event', background: false});
    }
  });

  findMeetingTime();
}

async function roomNameChange(e) {
  if (!e.target) return;
  const newName = <HTMLInputElement>(e.target).innerText;
  room.value.title = newName.toString();
  useHead({ title: `${room.value.title}` });
  const response = await $fetch<IRoom>('/api/room', { method: 'PUT', body: { ...room.value, title: room.value.title } });
  console.log(response);
}

async function copyRoute() {
  navigator.clipboard.writeText(window.location.href);
}
</script>
<template>
    <div class="h-screen flex flex-col justify-center relative">
      <NuxtLink to="/" class="absolute left-1 top-2">
        <Icon class="hover:scale-95" name="ic:baseline-arrow-back-ios-new" size="32px" color="#EC81FE" />
      </NuxtLink>
      <div class="h-[17vh] w-[90vw] lg:w-[50vw] min-w-[300px] mx-auto">
        <p class="text-center">Комната "<span contenteditable class="cursor-pointer" @input="roomNameChange($event)">{{ room.title }}</span>"</p>
        <my-input id="name" placeholder="Введите имя" v-model="username">Ваше имя</my-input>
        <my-button class="mt-1" @click="copyRoute">Копировать ссылку на комнату
          <Icon class="ml-3" name="ic:baseline-content-copy" size="24px" />
        </my-button>
      </div>
      <div class="h-[83vh]">
        <vue-cal
        ref="vuecal"
          small
          :disable-views="['years', 'year', 'month', 'day']"
          hide-view-selector
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
  color: #EC81FE;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vuecal__event.event {
  background: rgba(236, 129, 254, 0.5);
  color: #000000;
  font-weight: 400;
}
</style>