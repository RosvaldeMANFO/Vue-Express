<script setup lang="ts">
import { Ref, ref } from 'vue';

const props = defineProps({
    value: {
        type: String,
        required: false,
    },
    suggestedValues: {
        type: Array<string>,
        required: true,
    },
    required: {
        type: Boolean,
        required: true
    },
    id: {
        type: String,
        required: true,
    },
    placeholder: {
        type: String,
        required: false
    },
    label: {
        type: String,
        require: false
    },
    disabled: {
        type: Boolean, 
        default: false,
        required: false
    }
})
const showSuggestions = () => filteredSuggestions.value.length > 0
const emit = defineEmits()
const filteredSuggestions: Ref<Array<string>> = ref([])

function updateSuggestions(event: HTMLInputElement) {
    const inputLowerCase = event.value.toLowerCase();
    filteredSuggestions.value = props.suggestedValues.filter((suggestion) =>
        suggestion.toLowerCase().includes(`${inputLowerCase}`)
    );
    emit('selected', event.value)
}
function selectSuggestion(suggestion: string) {
    emit('selected', suggestion);
    filteredSuggestions.value = [];
}
function selectSuggestionOrEmit() {
    if (filteredSuggestions.value.length > 0) {
        selectSuggestion(filteredSuggestions.value[0]);
    } else {
        emit('selected', props.value?.valueOf());
    }
}
</script>

<template>
    <div class="text-entry-with-suggestions">
        <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
        <input :value="value" @input="updateSuggestions($event.target as HTMLInputElement)"
            @keydown.enter="selectSuggestionOrEmit" :placeholder="placeholder" :id="id" :required="required"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-300 dark:border dark:border-gray-700 dark:bg-gray-500 dark:text-gray-100 dark:placeholder:text-gray-600 disabled:bg-gray-400" :disabled="disabled" />
        <div v-show="showSuggestions" class="relative">
            <ul class="absolute mt-2 w-full bg-white border rounded-md shadow-md">
                <li v-for="(suggestion, index) in filteredSuggestions" :key="index" @click="selectSuggestion(suggestion)"
                    class="px-4 py-2 cursor-pointer hover:bg-gray-100">
                    {{ suggestion }}
                </li>
            </ul>
        </div>
    </div>
</template>
  
  
<style scoped></style>
  