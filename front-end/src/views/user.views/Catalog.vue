<script setup lang="ts">
import SearchBar from "../../components/SearchBar.vue";
import { onMounted, ref, Ref } from "vue";
import { Book, BookAggregation, BookMapped, BookService } from '../../services/Book.service';
import BookCard from "../../components/BookCard.vue";
import { notify } from 'notiwind';
import NothingCard from "../../components/NothingCard.vue";
import { RequestService } from "../../services/Request.service";
import { RequestInput } from "../../services/Request.service";
import { useSessionStore } from "../../store";
import { storeToRefs } from "pinia";
import Loader from "../../components/Loader.vue";


const loading: Ref<boolean> = ref(false)
const searchState: Ref<boolean> = ref(false)
const books: Ref<BookMapped[]> = ref([])
const aggregatedBooks: Ref<BookAggregation[]> = ref([])
const service = new BookService()
const store = useSessionStore()
const { userId, email } = storeToRefs(store)

async function submitSearch(query: string) {
   searchState.value = true
   try {
      loading.value = true
      books.value = service.findBook(books.value, query)
      aggregatedBooks.value = aggregateBook(books.value)
   } catch (err) {
      notify({
         group: "bottom",
         title: "Error",
         text: (err as Error).message
      }, 4000)
   } finally {
      loading.value = false
      searchState.value = false
   }
}

onMounted(async () => {
   await getAllBook()
})

async function borrow(book: Book, title: string) {
   try {
      const data: RequestInput = {
         userId: userId.value,
         bookId: book._id!,
         collectionId: book._id!,
         userEmail: email.value,
         bookIsbn: book.isbn,
         bookTitle: title,
      }
      const borrowService = new RequestService()
      await borrowService.sendRequest(data)
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

async function getAllBook() {
   try {
      loading.value = true
      books.value = await service.getAllBook()
      aggregatedBooks.value = aggregateBook(books.value)
   } catch (err) {
      notify({
         group: "bottom",
         title: "Error",
         text: (err as Error).message
      }, 4000)
   } finally {
      loading.value = false
   }
}

function aggregateBook(mappedBooks: BookMapped[]): BookAggregation[] {
   const result: BookAggregation[] = []
   mappedBooks.flatMap((current, _index, array) => {
      const aggregate: BookAggregation = {
         books: array.filter(value => current.book.collectionId == value.book.collectionId && current.book.status == 'AVAILABLE').map(mappedBook => mappedBook.book),
         collection: current.collection
      }
      if (!result.find(element => element.collection._id == aggregate.collection._id)) {
         result.push(aggregate)
      } 

   })
   return result;
}


</script>

<template>
   <div class="dark:bg-gray-600 flex-col gap-3 flex items-center h-full">
      <h1 class="dark:text-gray-100 text-4xl capitalize text-left justify-self-start self-start">Books</h1>
      <SearchBar class="w-full mb-7" @submit:query="submitSearch" :state.sync="searchState" @clear:query="getAllBook"
         placeholder="Title, Author, publishing house/date (YYYY-MM-dd)" />
      <Loader :state="loading" />
      <div v-if="books.length != 0 && !loading"
         class=" w-full grid grid-flow-row items-center md:grid-cols-2 xl:grid-cols-3 place-items-center gap-5">
         <BookCard v-for="aggregate in aggregatedBooks" :aggregate="aggregate" @borrow:book="borrow"></BookCard>
      </div>
      <NothingCard v-else-if="books.length == 0 && !loading"
         message="There is no book matching to this word try again please 🥲!" />
   </div>
</template>