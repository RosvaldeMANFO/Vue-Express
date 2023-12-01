<script setup lang="ts">
import { onMounted, ref, Ref } from 'vue';
import { notify } from 'notiwind';
import SearchDropdown from '../../components/SearchDropdown.vue'
import { LiteralGender } from '../../services/Book.service';
import TextEntry from '../../components/TextEntry.vue';
import { BookService, BookMapped } from '../../services/Book.service';
import DatePicker from '../../components/DatePicker.vue';
import Image from '../../components/Image.vue'
import CheckBox from '../../components/CheckBox.vue';
import Button from '../../components/Button.vue';
import TextArea from '../../components/TextArea.vue';
import SelectOption from '../../components/SelectOption.vue';
import router from '../../router'
import { BookCollection, CollectionService } from '../../services/Collection.service';

const service = new BookService()
const state: Ref<boolean> = ref(false)
const disableField: Ref<boolean> = ref(false)
const initCollection: Ref<boolean> = ref(false)
const collections: Ref<Array<BookCollection>> = ref([])
const updatedBook: Ref<BookMapped | undefined> = ref()

const data: Ref<BookMapped> = ref({
    book: {
        isbn: ""
    },
    collection: {
        title: "",
        genre: "",
        author: "",
        publicationDate: new Date(),
        publishingHouse: ""
    }
})

async function createBook() {
    const identifiers = data.value.book?.isbn.trim().split(',').map(i => i)
    if (identifiers) {
        for (let i = 0; i < identifiers.length; i++) {
            data.value.book!.isbn = identifiers[i]
            const result = await service.registerBook(data.value, !disableField.value && i == 0)
            notify({
                group: "top",
                title: "Success",
                text: result
            }, 4000)
        }
    }
}

async function submit(event: Event) {
    event.preventDefault()
    try {
        state.value = true
        let result!: unknown
        if (updatedBook.value) {
            result = await service.updateBook(data.value)
            notify({
                group: "top",
                title: "Success",
                text: result
            }, 4000)
        } else {
            result = await createBook()
        }
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

function selectCollection(value: string) {
    const collection = collections.value.find(val => val.title == value)
    if (collection || updatedBook.value) {
        if (collection) {
            data.value.collection = collection
        } else {
            data.value.collection.title = value
        }
        disableField.value = true
    } else {
        data.value.collection.title = value
        disableField.value = false
    }
}

async function init() {
    try {
        const collectService = new CollectionService()
        collections.value = await collectService.getAllCollection()
        const id = router.currentRoute.value.params.bookId
        if (id) {
            updatedBook.value = await service.getBookById(id as string)
            if (updatedBook.value) {
                data.value = updatedBook.value
                disableField.value = true
            }
        }
    } catch (err) {
        notify({
            group: "bottom",
            title: "Error",
            text: (err as Error).message
        }, 4000)
    }
}

function createNewCollection() {
    initCollection.value = !initCollection.value
}
onMounted(() => {
    init()
})
</script>

<template>
    <main class="bg-inherit h-full flex flex-col gap-7">
        <div class="flex w-full justify-start gap-3 items-center">
            <span v-on:click="$router.back" class="text-white">
                <svg class="w-6 h-6" aria-hidden="true" stroke="cyan"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10"> 
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5H1m0 0 4 4M1 5l4-4" />
                </svg>
            </span>
            <h1 class="dark:text-gray-100 text-4xl capitalize">Register book</h1>
        </div>
        <div class="p-3 whitespace-nowrap rounded-lg dark:bg-gray-800 max-h-screen w-full border dark:border-gray-700">
            <form class=" flex w-full justify-start gap-3" v-on:submit="submit">
                <div class="flex flex-col gap-3 w-full">
                    <SearchDropdown :value.sync="data.collection.title" :required="true" id="title" placeholder="Book title"
                        label="Title" :suggestedValues="collections.map(item => item.title)" @selected="selectCollection" />
                    <TextArea id="isbn" label="ISBN" :value.sync="data.book.isbn" type="textarea"
                        placeholder="Enter the book ISBN, to add more than one copy, you can separate them by a comma"
                        :required="true" @update:value="(value: string) => data.book.isbn = value" />
                    <SelectOption :value.sync="data.collection.genre" :options="Object.values(LiteralGender)" id="gender"
                        label="Literal gender" placeholder="Select a gender" :disabled="disableField" :required="true"
                        @update:value="value => data.collection.genre = value" />
                    <TextEntry id="author" label="Author" :value.sync="data.collection.author" type="text"
                        placeholder="Enter or chose a title" :required="true" :disabled="disableField"
                        @update:value="(value) => data.collection.author = value" />
                    <TextEntry id="publishingHouse" label="Publishing house" :value.sync="data.collection.publishingHouse"
                        type="text" placeholder="Enter the publishing house" :required="true" :disabled="disableField"
                        @update:value="(value) => data.collection.publishingHouse = value" />
                    <DatePicker :value.sync="new Date(data.collection.publicationDate)" :disabled="disableField"
                        @update:value="value => data.collection.publicationDate = new Date(value)" :required="true" />
                </div>
                <div class="w-full flex flex-col gap-7">
                    <CheckBox v-show="!updatedBook" :state.sync="initCollection"
                        label="Create new collection with this title" @update:value="createNewCollection" />
                    <Image class="" :image.sync="data.collection.bookCover" :disabled="disableField"
                        @update:value="value => data.collection.bookCover = value"
                        @clear="data.collection.bookCover = ''" />
                    <div class="flex justify-between gap-7">
                        <Button :state="false" label="Reset" type="reset" class="bg-red-300 hover:bg-red-400" />
                        <Button :state="state" label="Save" type="submit" />
                    </div>
                </div>
            </form>
        </div>
    </main>
</template>