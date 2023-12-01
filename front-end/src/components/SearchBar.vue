<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import Button from './Button.vue';
import TextEntry from './TextEntry.vue';

const query: Ref<string> = ref("")
const hasSearch: Ref<boolean> = ref(false)
const emit = defineEmits()
const props = defineProps({
    value: {
        type: String,
        required: false,
        default: ""
    },
    state: {
        type: Boolean,
        default: false
    },
    placeholder: {
        type: String,
        required: false,
        default: "Search"
    }
})

function submit(event: Event) {
    event.preventDefault()
    if (query.value.length != 0) {
        hasSearch.value = true
        emit("submit:query", query.value)
    }
}

function clearSearch() {
    hasSearch.value = false
    query.value = ""
    emit("clear:query")
}

onMounted(() => {
    if (props.value.length != 0) {
        query.value = props.value
        if (query.value.length != 0) {
            hasSearch.value = true
            emit("submit:query", query.value)
        }
    }
})

</script>

<template>
    <form class="flex items-center gap-2 h-fill" v-on:submit="submit">
        <div class="relative self-center w-full h-fit">
            <TextEntry class="w-full" type="text" label="" :placeholder="placeholder" :value.sync="query" id="search"
                @update:value="value => query = value" :required="false" />
            <span v-if="hasSearch" class="absolute right-3 top-1/2 transform -translate-y-1/2 h-fill" @click="clearSearch">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </span>
        </div>
        <div class="w-fit h-fit">
            <Button label="Search" :state.sync="state" type="submit">
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
            </Button>
        </div>
    </form>
</template>