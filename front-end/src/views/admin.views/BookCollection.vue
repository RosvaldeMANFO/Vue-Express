<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import Button from '../../components/Button.vue';
import { notify } from 'notiwind';
import NothingCard from '../../components/NothingCard.vue';
import { LiteralGender } from '../../services/Book.service.ts';
import SearchBar from "../../components/SearchBar.vue";
import { BookCollection, CollectionService } from '../../services/Collection.service';
import TextEntry from '../../components/TextEntry.vue';
import DatePicker from '../../components/DatePicker.vue';
import SelectOption from '../../components/SelectOption.vue';
import Image from '../../components/Image.vue';

const createNew: Ref<boolean> = ref(false)
const state: Ref<boolean> = ref(false)
const searchState: Ref<boolean> = ref(false)
const collections: Ref<BookCollection[]> = ref([])
const service = new CollectionService()
const data: Ref<BookCollection> = ref({
    title: "",
    genre: "",
    author: "",
    publicationDate: new Date(),
    publishingHouse: ""
})

async function getAllBook() {
    try {
        collections.value = await service.getAllCollection()
    } catch (err) {
        notify({
            group: "bottom",
            title: "Error",
            text: (err as Error).message
        }, 4000)
    }
}
async function deleteCollection(collection: BookCollection) {
    try {
        const result = await service.deleteCollection(collection._id!!)
        getAllBook()
        notify({
            group: "top",
            title: "Success",
            text: result
        }, 4000)
    } catch (err) {
        notify({
            group: "bottom",
            title: "Error",
            text: (err as Error).message
        }, 4000)
    }
}

async function updateCollection() {
    await service.updateCollection(data.value)
}
async function createCollection() {
    await service.createCollection(data.value)
}

async function submitSearch(query: string) {
    searchState.value = true
    try {
        const result = await service.findCollection(query)
        collections.value = result
    } catch (err) {
        notify({
            group: "bottom",
            title: "Error",
            text: (err as Error).message
        }, 4000)
    } finally {
        searchState.value = false
    }
}

async function submitCreateOrUpdate() {

}


async function resetForm() {
    createNew.value = true
    if (createNew.value) {
        data.value = {
            title: "",
            genre: "",
            author: "",
            publicationDate: new Date(),
            publishingHouse: ""
        }

    }
}

onMounted(async () => {
    getAllBook()
})

</script>

<template>
    <div class=" dark:bg-gray-600 h-full flex flex-col gap-7">
        <h1 class="dark:text-gray-100 text-4xl capitalize">Collections</h1>
        <div class="flex justify-center gap-3 w-full items-center self-end">
            <SearchBar placeholder="ISBN" class="grow" @submit:query="submitSearch" :state.sync="searchState"
                @clear:query="getAllBook" />
            <span class="whitespace-nowrap w-fit h-fit p-1.5 text-gray-100 text-xl bg-slate-500 rounded-md shadow-sm">
                {{ collections.length }} Title(s)</span>
            <span v-on:click="resetForm"
                class="cursor-pointer whitespace-nowrap w-fit h-fit p-1.5 text-gray-100 p-auto text-center text-xl bg-green-300 hover:bg-green-400 rounded-md shadow-sm">Add
                + </span>
        </div>
        <div class="w-full flex md:flex-row justify-start gap-3 flex-col">
            <div class="grow-0">
                <div v-if="collections.length != 0"
                    class=" whitespace-nowrap overflow-x-scroll rounded-lg dark:bg-gray-800 max-h-screen w-full">
                    <table class="table-auto shadow-md  border-separate border-spacing-y-0 w-full">
                        <thead class="text-left tracking-wider sticky top-0 dark:bg-gray-900 bg-gray-500">
                            <tr>
                                <th class=" dark:text-gray-100  p-4">Title</th>
                                <th class=" dark:text-gray-100  p-4">Author</th>
                                <th class=" dark:text-gray-100  p-4">NB Copy</th>
                                <th class=" dark:text-gray-100  p-4"></th>
                            </tr>
                        </thead>
                        <tbody class="overflow-y-scroll">
                            <tr :key="collection._id" v-for="collection in collections" class="hover:bg-gray-500">
                                <td class="p-4 dark:text-gray-100">{{ collection.title }}</td>
                                <td class="p-4 dark:text-gray-100">{{ collection.author }}</td>
                                <td class="p-4 dark:text-gray-100">{{ collection.quantity }}</td>
                                <td class="p-4 dark:text-gray-100">
                                    <Button @click="deleteCollection(collection)" :state="false" label="delete"
                                        type="button" class="bg-red-300 hover:bg-red-400" />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <NothingCard v-else class="self-center"
                    message="There is no book in the library. You can add them by clicking on create button 🥲!" />
            </div>

            <div class="p-3 whitespace-nowrap overflow-x-scroll rounded-lg dark:bg-gray-800 max-h-screen w-full">
                <form class=" flex w-full justify-start gap-3" v-on:submit="submitCreateOrUpdate"
                    v-on:reset="resetForm">:
                    <div class="flex flex-col gap-3 w-full">
                        <SelectOption :value.sync="data.genre" :options="Object.values(LiteralGender)" id="gender"
                            label="Literal gender" placeholder="Select a gender"
                            @update:value="value => data.genre = value" />
                        <TextEntry id="author" label="Author" :value.sync="data.author" type="text"
                            placeholder="Enter or chose a title" :required="true"
                            @update:value="(value) => data.author = value" />
                        <TextEntry id="publishingHouse" label="Publishing house" :value.sync="data.publishingHouse"
                            type="text" placeholder="Enter the publishing house" :required="true"
                            @update:value="(value) => data.publishingHouse = value" />
                        <DatePicker :value.sync="new Date(data.publicationDate)"
                            @update:value="value => data.publicationDate = new Date(value)" :required="true" />
                    </div>
                    <div class="w-full flex flex-col gap-7">
                        <Image class="" :image.sync="data.bookCover" @update:value="value => data.bookCover = value"
                            @clear="data.bookCover = ''" />
                        <div class="flex justify-between gap-7">
                            <Button :state="false" label="Reset" type="reset" class="bg-red-300 hover:bg-red-400" />
                            <Button :state="state" label="Save" type="submit" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>