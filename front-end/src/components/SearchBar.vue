<script setup lang="ts">
import { Ref, ref } from 'vue';
import Button from './Button.vue';
import TextEntry from './TextEntry.vue';

const query: Ref<string> = ref("")
const emit = defineEmits()
defineProps({
    state: {
        type: Boolean,
        default: false
    },
})

function submit(event: Event) {
    event.preventDefault()
    emit("submit:query", query.value)
}

</script>

<template>
    <form class="flex items-center gap-2" v-on:submit="submit">
        <TextEntry class="w-full" type="text" label="" placeholder="Search" :value.sync="query" id="search" @update:value="value => query=value"
            :required="false" />
        <div class="pt-2">
            <Button label="Search" :state.sync="state" type="submit">
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                </svg>
            </Button>
        </div>
    </form>
</template>