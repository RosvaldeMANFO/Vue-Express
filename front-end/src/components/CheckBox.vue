<script lang="ts" setup>
defineProps({
    state: {
        type: Boolean,
        default: false
    },
    label: {
        type: String,
        default: ""
    }
})
</script>

<template>
    <div class="flex items-center">
        <div class="" @click="$emit('update:value')">
            <input disabled id="disabled-checked-checkbox" type="checkbox" :checked="state"
                class="w-4 h-4 text-green-400 bg-gray-100 border-gray-300 rounded focus:ring-green-300 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
            <label for="disabled-checked-checkbox"
                class="ms-2 text-sm font-medium text-gray-400 dark:text-gray-500">{{ label }}</label>
        </div>
    </div>
</template>