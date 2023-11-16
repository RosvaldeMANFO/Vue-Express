<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import Button from '../../components/Button.vue';
import { notify } from 'notiwind';
import NothingCard from '../../components/NothingCard.vue';
import { Book, BookCopy, BookService } from '../../services/Book.service';
import router from '../../router';
import SearchBar from "../../components/SearchBar.vue";
import DatePicker from "../../components/DatePicker.vue";

const searchState: Ref<boolean> = ref(false)
const books: Ref<Array<Book>> = ref([])
const bookCopies: Ref<Array<BookCopy>> = ref([])
const service = new BookService()
const publicationDate: Ref<Date | undefined> = ref()

async function getAllBook() {
    try {
        bookCopies.value = await service.getAllCopies()
        books.value = await service.getAllBooks()
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
        const result = await service.deleteBook(book._id)
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
    router.push({ name: "register_book", params: { isbn: book.isbn } })
}

function addBook() {
    router.push({ name: "register_book" })
}

function countBook(): number {
    if (bookCopies.value.length != 0) {
        return bookCopies.value.map(e => e.quantity).reduce((a, b) => a + b)
    }
    return 0
}

async function submitSearch(query: string) {
    searchState.value = true
    try {
        if (publicationDate.value || query.length != 0) {
            const request = publicationDate.value ? {
                isbn: query,
                title: query,
                genre: query,
                author: query,
                publishingHouse: query,
                publicationDate: publicationDate.value
            } : {
                isbn: query,
                title: query,
                genre: query,
                author: query,
                publishingHouse: query,
            }
            const result = await service.searchBook(request)
            if (result.length != 0) {
                books.value = result
            } else {
                books.value = await service.getAllBooks()
            }
        }
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
        <div class="flex justify-end gap-3 w-full items-center self-end">
            <div class="w-full flex justify-between items-center gap-3">
                <SearchBar class="grow" @submit:query="submitSearch" :state.sync="searchState" />
                <DatePicker class="grow-0" label="" @update:value="value => publicationDate = value" />
            </div>
            <span
                class="block whitespace-nowrap self-end w-fit text-gray-100 p-2 text-xl bg-slate-500 rounded-md shadow-sm">
                {{ countBook() }} book(s)</span>
            <span v-on:click="addBook"
                class="block cursor-pointer whitespace-nowrap self-end w-fit text-gray-100 p-2 text-xl bg-green-300 hover:bg-green-400 rounded-md shadow-sm">Add
                + </span>
        </div>
        <div v-if="books.length != 0"
            class=" whitespace-nowrap overflow-x-scroll rounded-lg dark:bg-gray-800 max-h-screen w-full">
            <table class="table-auto shadow-md mt-5   border-separate border-spacing-y-3 w-full">
                <thead class="text-left tracking-wider">
                    <tr>
                        <th class=" dark:text-gray-100  p-4">ISBN</th>
                        <th class=" dark:text-gray-100  p-4">Title</th>
                        <th class="dark:text-gray-100  p-4">Author</th>
                        <th class="dark:text-gray-100  p-4">Publishing house</th>
                        <th class="dark:text-gray-100  p-4">Publication date</th>
                        <th class=" dark:text-gray-100  p-4">Status</th>
                        <th class="dark:text-gray-100  p-4">Copies</th>
                        <th class="grow-0 dark:text-gray-100  p-4"> </th>
                        <th class="grow-0 dark:text-gray-100  p-4"> </th>
                    </tr>
                </thead>
                <tbody class="overflow-y-scroll">
                    <tr :key="book._id" v-for="book in books" class="hover:bg-gray-500">
                        <td class="p-4 dark:text-gray-100">{{ book.isbn }}</td>
                        <td class="p-4 dark:text-gray-100">{{ book.title }}</td>
                        <td class="p-4 dark:text-gray-100">{{ book.author }}</td>
                        <td class="p-4 dark:text-gray-100">{{ book.publishingHouse }}</td>
                        <td class="p-4 dark:text-gray-100">{{ new Date(book.publicationDate).toLocaleDateString() }}</td>
                        <td class="p-4 dark:text-gray-100">{{ book.status }}</td>
                        <td class="p-4 dark:text-gray-100 text-center">{{ bookCopies.find(cp => cp.title ==
                            book.title)?.quantity }}</td>
                        <td class="p-4 grow-0 dark:text-gray-100">
                            <Button @click="updateBook(book)" :state="false" label="update" type="button"
                                class="bg-blue-300 hover:bg-blue-400" />
                        </td>
                        <td class="p-4 grow-0 dark:text-gray-100">
                            <Button @click="deleteBook(book)" :state="false" label="delete" type="button"
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