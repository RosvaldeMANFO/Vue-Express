<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { notify } from 'notiwind';
import SearchDropdown from '../../components/SearchDropdown.vue'
import { Book, BookCopy, LiteralGender } from '../../services/Book.service';
import TextEntry from '../../components/TextEntry.vue';
import { BookService, BookInput } from '../../services/Book.service';
import DatePicker from '../../components/DatePicker.vue';
import Image from '../../components/Image.vue'
import CheckBox from '../../components/CheckBox.vue';
import Button from '../../components/Button.vue';
import TextArea from '../../components/TextArea.vue';
import SelectOption from '../../components/SelectOption.vue';
import router from '../../router'
import { AxiosResponse } from 'axios';

const useNewTitle: Ref<boolean> = ref(true)
const service = new BookService()
const state: Ref<boolean> = ref(false)
const titles: Ref<Array<BookCopy>> = ref([])
const updatedBook: Ref<Book | unknown> = ref()
const data: Ref<BookInput> = ref({
    isbn: "",
    title: "",
    genre: "",
    author: "",
    publicationDate: new Date(),
    publishingHouse: ""
})

async function crateBook() {
    const identifiers = data.value.isbn.trim().split(',').map(i => i)
    for (let i = 0; i < identifiers.length; i++) {
        data.value.isbn = identifiers[i]
        const result = await service.registerBook(data.value, useNewTitle.value && i == 0)
        notify({
            group: "top",
            title: "Success",
            text: result.message
        }, 4000)
    }
}

function initCopy() {
    return !titles.value.map(i => i.title).includes(data.value.title) || updatedBook.value
}

async function submit(event: Event) {
    event.preventDefault()
    try {
        state.value = true
        let result!: unknown
        if (updatedBook.value) {
            updatedBook.value = Object.assign(updatedBook.value, data.value)
            result = await service.updateBook((updatedBook.value as Book))
        } else {
            result = await crateBook()
        }
        notify({
            group: "top",
            title: "Success",
            text: (result as AxiosResponse).data
        }, 4000)
    } catch (err) {
        notify({
            group: "bottom",
            title: "Error",
            text: (err as Error).message
        }, 4000)
    } finally {
        state.value = false
    }
}

async function init() {
    try {
        titles.value = await service.getAllCopies()
        const isbn = router.currentRoute.value.params.isbn
        if (isbn) {
            updatedBook.value = (await service.searchBook({ isbn: isbn }))[0]
            data.value = Object.assign(data.value, updatedBook.value)
        }
    } catch (err) {
        notify({
            group: "bottom",
            title: "Error",
            text: (err as Error).message
        }, 4000)
    }
}

onMounted(() => {
    init()
})
</script>

<template>
    <main class="dark:bg-gray-600 h-full flex flex-col gap-7">
        <div class="flex w-full justify-start gap-3 items-center">
            <span v-on:click="$router.back">
                <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" stroke="white"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                </svg>
            </span>
            <h1 class="dark:text-gray-100 text-4xl capitalize">Register book</h1>

        </div>
        <div class="p-3 whitespace-nowrap overflow-x-scroll rounded-lg dark:bg-gray-800 max-h-screen w-full">
            <form class=" flex w-full justify-start gap-3" v-on:submit="submit">:
                <div class="flex flex-col gap-3 w-full">
                    <TextArea id="isbn" label="ISBN" :value.sync="data.isbn" type="textarea"
                        placeholder="Enter the book ISBN, to add more than one copy, you can separate them by a comma"
                        :required="true" @update:value="(value: string) => data.isbn = value" />
                    <SearchDropdown :value.sync="data.title" :required="true" id="title" placeholder="Book title"
                        label="Title" :suggestedValues="titles.map(item => item.title)"
                        @selected="value => data.title = value" />
                    <SelectOption :value.sync="data.genre" :options="Object.values(LiteralGender)" id="gender"
                        label="Literal gender" placeholder="Select a gender" @update:value="value => data.genre = value" />
                    <TextEntry id="author" label="Author" :value.sync="data.author" type="text"
                        placeholder="Enter or chose a title" :required="true"
                        @update:value="(value) => data.author = value" />
                    <TextEntry id="publishingHouse" label="Publishing house" :value.sync="data.publishingHouse" type="text"
                        placeholder="Enter the publishing house" :required="true"
                        @update:value="(value) => data.publishingHouse = value" />
                    <DatePicker :value.sync="new Date(data.publicationDate)"
                        @update:value="value => data.publicationDate = new Date(value)" :required="true" />
                </div>
                <div class="w-full flex flex-col gap-7">
                    <Image class="" />
                    <CheckBox v-show="initCopy()" :state.sync="useNewTitle" label="Create new stock for this title"
                        @update:value="useNewTitle = !useNewTitle" />
                    <div class="flex justify-between gap-7">
                        <Button :state="false" label="Reset" type="reset" class="bg-red-300 hover:bg-red-400" />
                        <Button :state="state" label="Save" type="submit" />
                    </div>
                </div>
            </form>
        </div>
    </main>
</template>