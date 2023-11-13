<script setup lang="ts">
import { Ref, ref } from 'vue';
const emit = defineEmits()
const props = defineProps({
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
    }
})
const inputText: Ref<string> = ref('')
const filteredSuggestions: Ref<Array<string>> = ref([])

const showSuggestions = () => filteredSuggestions.value.length > 0

function updateSuggestions() {
    const inputLowerCase = inputText.value.toLowerCase();
    filteredSuggestions.value = props.suggestedValues.filter((suggestion) =>
        suggestion.toLowerCase().includes(inputLowerCase)
    );
}
function selectSuggestion(suggestion: string) {
    inputText.value = suggestion;
    emit('selected', suggestion);
    filteredSuggestions.value = [];
}
function selectSuggestionOrEmit() {
    if (filteredSuggestions.value.length > 0) {
        selectSuggestion(filteredSuggestions.value[0]);
    } else {
        emit('selected', inputText);
    }
}
</script>

<template>
    <div class="relative text-entry-with-suggestions">
        <label :for="id" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{{ label }}</label>
        <input v-model="inputText" @input="updateSuggestions" @keydown.enter="selectSuggestionOrEmit"
            :placeholder="placeholder" :id="id" :required="required"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-green-300 dark:border dark:border-gray-700 dark:bg-gray-500 dark:text-gray-100 dark:placeholder:text-gray-600" />
        <ul v-show="showSuggestions" class="absolute z-10 mt-2 w-full bg-white border rounded-md shadow-md">
            <li v-for="(suggestion, index) in filteredSuggestions" :key="index" @click="selectSuggestion(suggestion)"
                class="px-4 py-2 cursor-pointer hover:bg-gray-100">
                {{ suggestion }}
            </li>
        </ul>
    </div>
</template>
  
  
<style scoped></style>
  