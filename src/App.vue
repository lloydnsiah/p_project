<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const router = useRouter();
const route = useRoute();
const auth = getAuth();

onBeforeMount(() => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.replace({ name: 'Home' })
    } else if (route.name === 'Home') {
      router.replace({ name: 'LoadingPage' })
    }
  })
})
</script>

<template>
  <router-view />
</template>
