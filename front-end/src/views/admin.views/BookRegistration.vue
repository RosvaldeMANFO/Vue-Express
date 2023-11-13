<script setup lang="ts">
import { ref, Ref } from 'vue';
import { notify } from 'notiwind';
import SearchDropdown from '../../components/SearchDropdown.vue'

type RegisterModel = {
    isbn: string,
    title: string,
    genre: string,
    author: string,
    publicationDate: Date,
    publicationHouse: string
}

let state: Ref<boolean> = ref(false)
let titles: Ref<Array<string>> = ref([
    "JAVA", "ANDROID", "C#"
])

let data: Ref<RegisterModel> = ref({
    isbn: "",
    title: "",
    genre: "",
    author: "",
    publicationDate: new Date(),
    publicationHouse: ""
})

async function submit(event: Event) {
    event.preventDefault()
    try {
        alert(data.value.title)
    } catch (err) {
        state.value = false
        notify({
            group: "bottom",
            title: "Error",
            text: (err as Error).message
        }, 4000)
    }
}

</script>

<template>
    <main class="h-full w-full flex items-center justify-center">
        <div class="w-[70%] md:w-[30%] bg-white rounded-lg shadow dark:border  dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1
                    class="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Register
                </h1>
                <form class="space-y-4 md:space-y-6" v-on:submit="submit">
                    <SearchDropdown :required="true" id="language" placeholder="Select a language" label="Language" :suggestedValues="titles" @selected="value => data.title = value" />
                </form>
            </div>
        </div>
    </main>
</template>