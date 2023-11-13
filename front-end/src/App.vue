<script setup lang="ts">
import Notifications from './components/Notifications.vue';
import { Ref, ref } from 'vue';
import { useSessionStore } from './store';
import UserDash from './views/user.views/UserDash.vue';
import { storeToRefs } from 'pinia';

let store = useSessionStore()
const { exp } = storeToRefs(store)

const sessionExpired: Ref<boolean> = ref(exp.value < Math.floor(Date.now() / 1000))
</script>

<template>
  <RouterView v-show="sessionExpired" />
  <UserDash v-show="!sessionExpired && store.role == 'READER'" />
  <Notifications />
</template>