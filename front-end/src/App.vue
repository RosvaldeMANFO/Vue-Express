<script setup lang="ts">
import Notifications from './components/Notifications.vue';
import { Ref, onMounted, ref } from 'vue';
import { useSessionStore } from './store';
import ReaderDrawer from './views/user.views/ReaderDrawer.vue';
import { storeToRefs } from 'pinia';
import AdminDrawer from './views/admin.views/AdminDrawer.vue';
import router from './router';

const store = useSessionStore()
const { exp } = storeToRefs(store)
const sessionExpired: Ref<boolean> = ref(exp.value < Math.floor(Date.now() / 1000))
function resumeSession() {
  const session = localStorage.getItem("session");
  if (session) {
    const store = useSessionStore();
    store.$patch(JSON.parse(String(session)));
    sessionExpired.value = exp.value < Math.floor(Date.now() / 1000)
    if (sessionExpired.value) {
      router.push({ name: "login", replace: true })
    } else {
      router.push({ name: store.role, replace: true })
    }
  } else {
    router.push({ name: "onboarding", replace: true })
  }
}

resumeSession();
onMounted(() => {
  resumeSession()
})
</script>

<template>
  <ReaderDrawer class="absolute z-20" v-if=" exp > Math.floor(Date.now() / 1000) && store.role == 'READER'" />
  <AdminDrawer class="absolute z-20" v-if="exp > Math.floor(Date.now() / 1000) && store.role == 'ADMIN'" />
  <div class="h-full overflow-auto flex justify-center px-7 pt-20 -z-20 dark:bg-gray-600 md:px-2 w-full">
    <RouterView />
  </div>
  <Notifications />
</template>