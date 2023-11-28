<script lang="ts" setup>
defineProps({
    label: {
        type: String,
        required: true
    }
})
</script>
<template>
    <span
        class="cursor-pointer whitespace-nowrap w-fit h-fit p-1.5 text-gray-100 p-auto text-center text-xl bg-green-300 hover:bg-green-400 rounded-md dark:border shadow-md dark:border-gray-700 ">{{ label }}
    </span>
</template>