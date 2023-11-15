<script setup lang="ts">
import { Ref, ref } from 'vue';

const drawerState: Ref<boolean> = ref(true)
function toggleDrawer() {
    drawerState.value = !drawerState.value
}

</script>

<template>
    <div class="w-screen h-screen dark:bg-gray-600">
        <div class="w-full fixed top-0 shadow-md p-2 dark:bg-gray-700">
            <button @click="toggleDrawer">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="white" class="h-6 w-6">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
            </button>
            <div class="absolute top-12 inset-y-0 left-0 w-64 bg-gray-800 p-4 transition-transform transform"
                :class="{ '-translate-x-full': !drawerState }">
                <nav class="mt-4 flex flex-col gap-5">
                    <router-link to="/catalog"
                        class="block text-white py-2 px-4 hover:bg-gray-700 border dark:border-gray-800 rounded-md bg-gray-600"
                        :class="{ 'dark:bg-green-300 bg-gray-400': $route.name == 'catalog' }">
                        Catalog
                    </router-link>
                    <router-link to="/borrow"
                        class="block text-white py-2 px-4 hover:bg-gray-700 border dark:border-gray-800 rounded-md bg-gray-600"
                        :class="{ 'dark:bg-green-300 bg-gray-400': $route.name == 'borrow' }">Borrow</router-link>
                    <router-link to="/logout"
                        class="block text-white py-2 px-4 hover:bg-gray-700 border dark:border-gray-800 rounded-md bg-gray-600"
                        :class="{ 'dark:bg-green-300 bg-gray-400': $route.name == 'logout' }">Logout</router-link>
                </nav>
            </div>
        </div>
    </div>
</template>