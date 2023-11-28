<script setup lang="ts">
import SearchBar from "../../components/SearchBar.vue";
import { onMounted, ref, Ref } from "vue";
import { BookMapped, BookService } from '../../services/Book.service';
import router from '../../router/index.js';
import BookCard from "../../components/BookCard.vue";
import { notify } from 'notiwind';
import NothingCard from "../../components/NothingCard.vue";
import { BorrowingService } from "../../services/Borrowing.service";
import { BorrowInput } from "../../services/Borrowing.service";
import { useSessionStore } from "../../store";
import { storeToRefs } from "pinia";

const searchState: Ref<boolean> = ref(false)
const books: Ref<Array<BookMapped>> = ref([])
const service = new BookService()
const store = useSessionStore()
const {userId, email} = storeToRefs(store)

async function submitSearch(query: string) {
   searchState.value = true
   try {
      books.value = service.findBook(books.value, query)
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
      books.value = await service.getAllBook()
   } catch (err) {
      router.push({ name: "error" })
   }
})

async function borrow(map: BookMapped) {
   try {
      const data: BorrowInput = {
         userId: userId.value,
         bookId: map.book._id!,
         collectionId: map.collection._id!,
         userEmail: email.value,
         bookIsbn: map.book.isbn,
         bookTitle: map.collection.title,
      }
      const borrowService = new BorrowingService()
      await borrowService.requestBorrow(data)
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

async function getAllBook(){
   books.value = await service.getAllBook()
}
</script>

<template>
   <div class="dark:bg-gray-600 flex-col gap-3 flex items-center h-full">
      <h1 class="dark:text-gray-100 text-4xl capitalize text-left justify-self-start self-start">Books</h1>
      <SearchBar class="w-full mb-7" @submit:query="submitSearch" :state.sync="searchState" @clear:query="getAllBook" placeholder="Title, Author, publishing house/date (YYYY-MM-dd)"/>
      <div v-if="books.length != 0"
         class=" w-full grid grid-flow-row items-center md:grid-cols-2 xl:grid-cols-3 place-items-center gap-2">
         <BookCard v-for="book in books" :mappedBook="book" @borrow:book="borrow"></BookCard>
      </div>
      <NothingCard v-else message="There is no book matching to this word try again please 🥲!" />
   </div>
</template>