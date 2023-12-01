<script setup lang="ts">
import { Ref, ref } from 'vue';
import router from '../../router';
import { useSessionStore } from '../../store';

const drawerState: Ref<boolean> = ref(false)
function toggleDrawer() {
    drawerState.value = !drawerState.value
}

function logout() {
    toggleDrawer()
    localStorage.clear()
    const session = useSessionStore()
    session.$reset()
    router.push({ name: "onboarding", replace: true })
}

</script>

<template>
    <div>
        <div class="w-full fixed top-0 z-20 shadow-md p-3 dar:bg-gray-700 bg-gray-500">
            <button @click="toggleDrawer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" class="h-6 w-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
            </button>
        </div>
        <div class="mt-12 fixed h-screen inset-y-0 left-0 w-64 dar:bg-gray-700 p-4 transition-transform transform bg-gray-500"
            :class="{ '-translate-x-full': !drawerState }">
            <nav class="mt-4 flex flex-col gap-5">
                <router-link to="/books" @click="toggleDrawer"
                    class="flex gap-2 text-white py-2 px-4 hover:bg-gray-700 border dark:border-gray-800 rounded-md bg-gray-600"
                    :class="{ 'bg-green-300': $route.name?.toString().includes('book') }">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" stroke="white" viewBox="0 0 16 20">
                        <path
                            d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z" />
                    </svg>
                    Books
                </router-link>
                <router-link to="/collections" @click="toggleDrawer"
                    class="flex gap-2 text-white py-2 px-4 hover:bg-gray-700 border dark:border-gray-800 rounded-md bg-gray-600"
                    :class="{ 'bg-green-300': $route.name?.toString().includes('collection') }">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 20 20">
                        <path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 12.25V1m0 11.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M4 19v-2.25m6-13.5V1m0 2.25a2.25 2.25 0 0 0 0 4.5m0-4.5a2.25 2.25 0 0 1 0 4.5M10 19V7.75m6 4.5V1m0 11.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM16 19v-2" />
                    </svg>
                    Collections
                </router-link>
                <router-link to="/readers" @click="toggleDrawer"
                    class="flex gap-2 text-white py-2 px-4 hover:bg-gray-700 border dark:border-gray-800 rounded-md bg-gray-600"
                    :class="{ 'bg-green-300': $route.name?.toString().includes('reader') }">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        fill="none" stroke="white" viewBox="0 0 18 20">
                        <path
                            d="M16 0H4a2 2 0 0 0-2 2v1H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v2H1a1 1 0 0 0 0 2h1v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4.5a3 3 0 1 1 0 6 3 3 0 0 1 0-6ZM13.929 17H7.071a.5.5 0 0 1-.5-.5 3.935 3.935 0 1 1 7.858 0 .5.5 0 0 1-.5.5Z" />

                    </svg>
                    Readers
                </router-link>
                <router-link to="/requests" @click="toggleDrawer"
                    class="flex gap-2 text-white py-2 px-4 hover:bg-gray-700 border dark:border-gray-800 rounded-md bg-gray-600"
                    :class="{ 'bg-green-300': $route.name == 'requests' }">
                    <svg stroke="white" class="w-6 h-6 fill-none text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                        <path
                            d="M19 0H1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1ZM2 6v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6H2Zm11 3a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 2 0h2a1 1 0 0 1 2 0v1Z" />
                    </svg>
                    Request
                </router-link>
                <button @click="logout"
                    class="flex gap-2  text-white py-2 px-4 hover:bg-gray-700 border dark:border-gray-800 rounded-md bg-gray-600"
                    :class="{ 'bg-green-300 ': $route.name == 'logout' }">
                    <svg class="w-6 h-6 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                        stroke="white" fill="none" viewBox="0 0 18 16">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                    </svg>
                    Logout
                </button>
            </nav>
        </div>
    </div>
</template>