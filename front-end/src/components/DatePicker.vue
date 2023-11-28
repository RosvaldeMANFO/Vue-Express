<script setup lang="ts">
const emit = defineEmits()
defineProps({
    value: {
        type: Date,
        required: false,
        default: new Date()
    },
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
    },
    disabled: {
        type: Boolean,
        default: false,
        required: false
    }
})

function dateChange(event: Event) {
    const date = (event.target as HTMLDataElement).value
    emit("update:value", new Date(date))
}

function formatDate(date: Date) {
    let d = new Date(date)
    return d.toISOString().split('T')[0];
}

</script>

<template>
    <div>
        <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">{{ label }}</label>
        <div class="w-full">
            <input :id="id" type="date" @change="dateChange" :required="required" :value="formatDate(value)"
                placeholder="Select a date " :disabled="disabled"
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-300 dark:border dark:border-gray-700 dark:bg-gray-500 dark:text-gray-100 dark:placeholder:text-gray-600 disabled:bg-gray-400">
        </div>
    </div>
</template>