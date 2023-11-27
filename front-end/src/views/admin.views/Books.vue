<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import Button from '../../components/Button.vue';
import { notify } from 'notiwind';
import NothingCard from '../../components/NothingCard.vue';
import { Book, BookService, BookMapped } from '../../services/Book.service';
import router from '../../router';
import SearchBar from "../../components/SearchBar.vue";
import { BookCollection, CollectionService } from '../../services/Collection.service';

const searchState: Ref<boolean> = ref(false)
const mappedBooks: Ref<Array<BookMapped>> = ref([])
const collections: Ref<Array<BookCollection>> = ref([])
const service = new BookService()

async function getAllBook() {
    try {
        const collectService = new CollectionService()
        collections.value = await collectService.getAllCollection()
        mappedBooks.value = await service.getAllBook()
    } catch (err) {
        notify({
            group: "bottom",
            title: "Error",
            text: (err as Error).message
        }, 4000)
    }
}
async function deleteBook(book: Book) {
    try {
        const result = await service.deleteBook(book._id!!)
        getAllBook()
        notify({
            group: "top",
            title: "Success",
            text: result.data
        }, 4000)
    } catch (err) {
        notify({
            group: "bottom",
            title: "Error",
            text: (err as Error).message
        }, 4000)
    }
}

async function updateBook(book: Book) {
    router.push({ name: "register_book", params: { bookId: book._id } })
}

function addBook() {
    router.push({ name: "register_book" })
}

function countBook(): number {
    if (collections.value.length != 0) {
        return collections.value.map(e => e.quantity).reduce((a, b) => a! + b!)!
    }
    return 0
}

async function submitSearch(query: string) {
    searchState.value = true
    try {
        const result = await service.findBookByISBN(query)
        mappedBooks.value = result
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

onMounted(async () => {
    getAllBook()
})

</script>

<template>
    <div class=" dark:bg-gray-600 h-full flex flex-col gap-7">
        <h1 class="dark:text-gray-100 text-4xl capitalize">Books</h1>
        <div class="flex justify-center gap-3 w-full items-center self-end">
            <SearchBar placeholder="ISBN" class="grow" @submit:query="submitSearch" :state.sync="searchState"
                @clear:query="getAllBook" />
            <span class="whitespace-nowrap w-fit h-fit p-1.5 text-gray-100 text-xl bg-slate-500 rounded-md shadow-sm">
                {{ countBook() }} book(s)</span>
            <span v-on:click="addBook"
                class="cursor-pointer whitespace-nowrap w-fit h-fit p-1.5 text-gray-100 p-auto text-center text-xl bg-green-300 hover:bg-green-400 rounded-md shadow-sm">Add
                + </span>
        </div>
        <div v-if="mappedBooks.length != 0"
            class=" whitespace-nowrap overflow-x-scroll rounded-lg dark:bg-gray-800 max-h-full w-full">
            <table class="table-auto shadow-md border-separate border-spacing-y-0 w-full">
                <thead class="text-left tracking-wider sticky top-0 dark:bg-gray-900 bg-gray-500">
                    <tr class="">
                        <th class="dark:text-gray-100  p-4">ISBN</th>
                        <th class=" dark:text-gray-100  p-4">Title</th>
                        <th class="dark:text-gray-100  p-4">Author</th>
                        <th class="dark:text-gray-100  p-4">Publishing house</th>
                        <th class="dark:text-gray-100  p-4">Publication date</th>
                        <th class=" dark:text-gray-100  p-4">Status</th>
                        <th class="grow-0 dark:text-gray-100  p-4"> </th>
                        <th class="grow-0 dark:text-gray-100  p-4"> </th>
                    </tr>
                </thead>
                <tbody class="overflow-y-scroll">
                    <tr :key="mappedBook.book.isbn" v-for="mappedBook in mappedBooks" class="hover:bg-gray-500">
                        <td class="p-4 dark:text-gray-100">{{ mappedBook.book.isbn }}</td>
                        <td class="p-4 dark:text-gray-100">{{ mappedBook.collection.title }}</td>
                        <td class="p-4 dark:text-gray-100">{{ mappedBook.collection.author }}</td>
                        <td class="p-4 dark:text-gray-100">{{ mappedBook.collection.publishingHouse }}</td>
                        <td class="p-4 dark:text-gray-100">{{ new
                            Date(mappedBook.collection.publicationDate).toLocaleDateString() }}</td>
                        <td class="p-4 dark:text-gray-100">{{ mappedBook.book.status }}</td>
                        <td class="p-4 grow-0 dark:text-gray-100">
                            <Button @click="updateBook(mappedBook.book)" :state="false" label="update" type="button"
                                class="bg-blue-300 hover:bg-blue-400" />
                        </td>
                        <td class="p-4 grow-0 dark:text-gray-100">
                            <Button @click="deleteBook(mappedBook.book)" :state="false" label="delete" type="button"
                                class="bg-red-300 hover:bg-red-400" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <NothingCard v-else class="self-center"
            message="There is no book in the library. You can add them by clicking on create button 🥲!" />
    </div>
</template>