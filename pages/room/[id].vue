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
  background: boolean,
  deletable: boolean,
  resizable: boolean,
  draggable: boolean
};

onMounted(async () => {
  room.value = await $fetch<IRoom>('/api/room', { query: { id: id } });
  updateDisplayedEvents();
  room.value.title = room.value.title.charAt(0).toUpperCase() + room.value.title.slice(1);
  room.value.title = room.value.title.replace(/^\s+|\s+$/g, '');
  useHead({ title: `${room.value.title}` });
});

const createEvent = async (newEvent: any) => {
  room.value.events.push({ start: newEvent.start.toISOString(), end: newEvent.end.toISOString(), title: username.value });
  events.value.push({ start: newEvent.start, end: newEvent.end, title: username.value, class: 'event', background: false, deletable: true, resizable: true, draggable: false });
  $fetch<IRoom>('/api/room', { method: 'PUT', body: { ...room.value } });
  findMeetingTime();
};

// Ну тут грязь без поля _eid в IEvent
const deleteEvent = async (originalEvent: any) => {
  for (let i = 0; i < room.value.events.length; i++) {
    if (room.value.events[i].title === originalEvent.title) {
      if (room.value.events[i].start === originalEvent.start.toISOString()) {
        if (room.value.events[i].end === originalEvent.end.toISOString()) {
          room.value.events.splice(i, 1);
          updateDisplayedEvents();
          $fetch<IRoom>('/api/room', { method: 'PUT', body: { ...room.value } });
          return;
        }
      }
    }
  }
}

// Ну тут тоже грязь без поля _eid в IEvent
const editEvent = async (eventForEdit: any) => {
  for (let i = 0; i < room.value.events.length; i++) {
    if (room.value.events[i].title === eventForEdit.originalEvent.title) {
      if (room.value.events[i].start === eventForEdit.originalEvent.start.toISOString()) {
        if (room.value.events[i].end === eventForEdit.originalEvent.end.toISOString()) {
          room.value.events[i].end = eventForEdit.event.end;
          updateDisplayedEvents();
          $fetch<IRoom>('/api/room', { method: 'PUT', body: { ...room.value } });
          return;
        }
      }
    }
  }
}

async function updateDisplayedEvents() {
  events.value = [];
  room.value.events.forEach( item => {
    if (item.title === username.value) {
      events.value.push({title: item.title, start: new Date(item.start), end: new Date(item.end), class: 'event', background: false, deletable: true, resizable: true, draggable: true});
    } else {
      events.value.push({title: item.title, start: new Date(item.start), end: new Date(item.end), class: getColorClass(item.title), background: true, deletable: false, resizable: false, draggable: false});
    }
  });

  findMeetingTime();
}

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

  if (!flag) events.value.push({ title: 'Встреча-', start: bestRange.start, end: bestRange.end, class: 'meeting', background: true, deletable: false, resizable: false, draggable: false });
}

function getColorClass(str: string) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) {
    sum += str.charCodeAt(i);
  }

  return '_' + sum % 10;
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
      <div class="h-[19vh] w-[81vw] lg:w-[50vw] min-w-[300px] mx-auto">
        <p class="text-center w-full inline">Комната: </p>
        <input v-model="room.title" class="outline-none bg-transparent cursor-pointer w-[70%]" />
        <my-input id="name" placeholder="Введите имя" v-model="username">Ваше имя</my-input>
        <my-button class="mt-1" @click="copyRoute">Копировать ссылку на комнату
          <Icon class="ml-3" name="ic:baseline-content-copy" size="24px" />
        </my-button>
      </div>
      <div class="h-[81vh] p-2">
        <vue-cal
        ref="vuecal"
          small
          :disable-views="['years', 'year', 'month', 'day']"
          hide-view-selector
          :time-step="60"
          :snap-to-time="15"
          locale="ru"
          :events="events"
          @event-drag-create="createEvent"
          @event-delete="deleteEvent"
          @event-duration-change="editEvent"
          :editable-events="{ title: true, drag: false, resize: true, delete: true, create: true }">
        </vue-cal>
      </div>
    </div>
</template>
<style>
/*Ивенты с классом meeting*/
.vuecal__event.meeting {
  background: repeating-linear-gradient(45deg, transparent, transparent 10px, #8d8d8d 10px, #8d8d8d 20px);/* IE 10+ */
  color: #FFFFFF;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  text-shadow: 2px 2px 1px black;
}

/*Ивенты с классом event*/
.vuecal__event.event {
  background: rgba(236, 129, 254, 0.5);
  color: #000000;
  font-weight: 500;
}

.vuecal__cell--today, .vuecal__cell--current {background-color: rgba(0, 0, 0, 0.25);} /*Цвет подсветки сегодняшнего дня*/
.vuecal__cell--selected {background-color: rgba(0, 0, 0, 0.5);} /*Цвет подсветки выделенного дня*/
.vuecal__now-line {color: #EC81FE;} /*Цвет линии времени*/

.vuecal__event._0 {background-color: rgba(223, 7, 114, 0.2);pointer-events: none;}
.vuecal__event._1 {background-color: rgba(254, 84, 111, 0.2);pointer-events: none;}
.vuecal__event._2 {background-color: rgba(255, 158, 125, 0.2);pointer-events: none;}
.vuecal__event._3 {background-color: rgba(255, 208, 128, 0.2);pointer-events: none;}
.vuecal__event._4 {background-color: rgba(255, 253, 255, 0.2);pointer-events: none;}
.vuecal__event._5 {background-color: rgba(11, 255, 230, 0.2);pointer-events: none;}
.vuecal__event._6 {background-color: rgba(1, 203, 207, 0.2);pointer-events: none;}
.vuecal__event._7 {background-color: rgba(1, 136, 165, 0.2);pointer-events: none;}
.vuecal__event._8 {background-color: rgba(62, 50, 100, 0.2);pointer-events: none;}
.vuecal__event._9 {background-color: rgba(53, 42, 85, 0.2);pointer-events: none;}
</style>