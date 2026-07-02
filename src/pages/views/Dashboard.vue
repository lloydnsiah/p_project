<template>
  <main class=" flex flex-col gap-8 overflow-hidden no-scrollbar overflow-y-auto h-[94vh] section_container">
    <div
      class="flex justify-between bg-primary py-2 px-4 rounded-sm items-center text-white"
    >
      <div class="flex flex-col gap-1">
        <h1 class="text-lg font-bold">{{ route.name }}</h1>
        <p class="text-sm italic text-gray-300">{{ route.meta.description }}</p>
      </div>
      
    </div>
    <Charts />
  </main>
</template>

<script setup>
import { useRoute } from "vue-router";
import Loader from "../../components/Loader.vue";
import Charts from "../../components/Charts.vue";

const route = useRoute();
</script>
