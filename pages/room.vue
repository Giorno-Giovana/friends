<script setup lang="ts">
// @ts-expect-error
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
useHead({ title: "Friends" });

interface Event {
    start: string,
    end: string,
    title: string
}

const events = ref<Event[]>([]);
events.value.push({ start: "2023-06-28 10:35", end: "2023-06-29 10:35", title: "event"})

</script>
<template>
    <div class="h-screen">
        <vue-cal
        :time-from="8 * 60"
        :time-to="19 * 60"
        :time-step="30"
        hide-weekends :events="events">
        </vue-cal>
    </div>
</template>