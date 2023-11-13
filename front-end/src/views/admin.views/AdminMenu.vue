<script setup lang="ts">

defineProps<{ isDrawerOpen: boolean }>()
</script>

<template>
    <div class="fixed inset-y-0 left-0 w-64 bg-gray-800 p-4 transition-transform transform"
        :class="{ '-translate-x-full': !isDrawerOpen }">

        <!-- Menu Items -->
        <nav class="mt-4 flex flex-col gap-5">
            <router-link to="/books"
                class="block text-white py-2 px-4 hover:bg-gray-700 border dark:border-gray-800 rounded-md bg-gray-600"
                :class="{ 'dark:bg-green-300 bg-gray-400': $route.name == 'catalog' }">
                Catalog
            </router-link>
            <router-link to="/requests"
                class="block text-white py-2 px-4 hover:bg-gray-700 border dark:border-gray-800 rounded-md bg-gray-600"
                :class="{ 'dark:bg-green-300 bg-gray-400': $route.name == 'borrow' }">Borrow</router-link>
            <router-link to="/logout"
                class="block text-white py-2 px-4 hover:bg-gray-700 border dark:border-gray-800 rounded-md bg-gray-600"
                :class="{ 'dark:bg-green-300 bg-gray-400': $route.name == 'logout' }">Logout</router-link>
        </nav>
    </div>
</template>