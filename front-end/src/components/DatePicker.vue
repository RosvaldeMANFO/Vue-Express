<script setup lang="ts">
const emit = defineEmits()
defineProps({
    label: {
        type: String,
        default: "Publishing date"
    },
    id: {
        type: String,
        default: "date"
    },
    required: {
        type: Boolean,
        required: false,
        default: false
    }
})

function dateChange(event: Event) {
    const date = (event.target as HTMLInputElement).valueAsDate
    emit("update:value", date?.toLocaleString())
}
</script>

<template>
    <div class="relative">
        <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">{{ label }}</label>
        <div class="relative max-w-sm">
            <input :id="id" type="date" @change="dateChange" :required="required"
                placeholder="Select a date "
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-300 dark:border dark:border-gray-700 dark:bg-gray-500 dark:text-gray-100 dark:placeholder:text-gray-600">
        </div>
    </div>
</template>