<script setup lang="ts">
import Notifications from './components/Notifications.vue';
import { Ref, ref } from 'vue';
import { useSessionStore } from './store';
import ReaderDrawer from './views/user.views/ReaderDrawer.vue';
import { storeToRefs } from 'pinia';
import AdminDrawer from './views/admin.views/AdminDrawer.vue';

let store = useSessionStore()
const { exp } = storeToRefs(store)

const sessionExpired: Ref<boolean> = ref(exp.value < Math.floor(Date.now() / 1000))
</script>

<template>
   <ReaderDrawer class="absolute z-20" v-if="!sessionExpired && store.role == 'READER'" />
   <AdminDrawer class="absolute z-20" v-if="!sessionExpired && store.role == 'ADMIN'" />
    <div class="h-screen flex justify-center px-7 pt-20 -z-20 dark:bg-gray-600">
      <RouterView class="md:w-[80%] w-full"/>
    </div>
    <Notifications />
</template>