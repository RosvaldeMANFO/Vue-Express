<script setup lang="ts">
defineProps({
    message: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: false,
        default: "Nothing to show !"
    }
})
</script>

<template>
    <div
        class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{{ title }}</h5>
        <p class="text-center font-normal text-gray-700 dark:text-gray-400">{{ message }}</p>
    </div>
</template>