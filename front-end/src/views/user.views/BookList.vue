<script setup lang="ts">
import SearchBar from "../../components/SearchBar.vue";
import { onMounted, ref, Ref } from "vue";
import { Book, BookService, BorrowInput } from '../../services/Book.service.js';
import router from '../../router/index.js';
import BookCard from "../../components/BookCard.vue";
import { useSessionStore } from '../../store/index.js';
import { notify } from 'notiwind';
import NothingCard from "../../components/NothingCard.vue";
import DatePicker from "../../components/DatePicker.vue";

const searchState: Ref<boolean> = ref(false)
const publicationDate: Ref<Date | undefined> = ref()
const books: Ref<Array<Book>> = ref([])
const service = new BookService()

async function submitSearch(query: string) {
   searchState.value = true
   try {
      if (publicationDate || query.length != 0) {
         const result = await service.searchBook(
            {
               title: query,
               genre: query,
               author: query,
               publishingHouse: query,
               publicationDate: publicationDate.value
            }
         )
         books.value = result
      } else {
         books.value = await service.getAllBooks()
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
   try {
      books.value = await service.getAllBooks()
   } catch (err) {
      router.push({ name: "error" })
   }
})

async function borrow(book: Book) {
   try {
      const session = useSessionStore()
      const data: BorrowInput = {
         userId: session.userId,
         userEmail: session.email,
         bookId: book._id,
         bookTitle: book.title,
         bookIsbn: book.isbn
      }
      await service.requestBorrow(data)
      notify({
         group: "top",
         title: "Success",
         text: "Your request have been sent, we will return to you as soon as possible"
      }, 4000)
   } catch (err) {
      notify({
         group: "bottom",
         title: "Error",
         text: (err as Error).message
      }, 4000)
   }
}

</script>

<template>
   <div class="dark:bg-gray-600 flex-col gap-3 flex items-center h-screen">
      <h1 class="dark:text-gray-100 text-4xl capitalize text-left justify-self-start self-start">Books</h1>
      <div class="w-full mb-7 flex justify-between items-center gap-3">
         <SearchBar class="grow" @submit:query="submitSearch" :state.sync="searchState" />
         <DatePicker class="grow-0" label="" @update:value="value => publicationDate = value" />
      </div>
      <div v-if="books.length != 0"
         class=" w-full grid grid-flow-row items-center md:grid-cols-2 xl:grid-cols-3 place-items-center gap-2">
         <BookCard v-for="book in books" :book="book" @borrow:book="borrow"></BookCard>
      </div>
      <NothingCard v-else message="There is no book matching to this word try again please 🥲!" />
   </div>
</template>