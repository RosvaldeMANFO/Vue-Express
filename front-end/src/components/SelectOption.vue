<script lang="ts" setup>
defineProps({
    value: {
        type: String,
        required: true
    },
    options: {
        type: Array<String>,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: false
    },
    placeholder: {
        type: String,
        required: false
    }
})
</script>

<template>
    <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">{{ label }}</label>
    <select :id="id" @change="$emit('update:value', ($event.target as HTMLSelectElement).value)" :value="value"
        class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-300 dark:border dark:border-gray-700 dark:bg-gray-500 dark:text-gray-100 dark:placeholder:text-gray-600">
        <option v-for="option in options" :value="option">{{ option }}</option>
    </select>
</template>