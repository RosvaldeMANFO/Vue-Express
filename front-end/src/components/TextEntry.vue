<script setup lang="ts">
defineProps({
    value: {
        type: String,
        required: true
    },
    required:{
        type: Boolean,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    placeholder: {
        type: String,
        required: false,
    },
    
})
</script>

<template>
    <div>
        <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">{{ label }}</label>
        <input :value="value" :id="id" :type="type" :required="required" 
            @change="$emit('update:value', ($event.target as HTMLInputElement).value)" :placeholder="placeholder"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-300 dark:border dark:border-gray-700 dark:bg-gray-500 dark:text-gray-100 dark:placeholder:text-gray-600">
    </div>
</template>