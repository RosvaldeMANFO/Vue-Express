<script setup lang="ts">
import SearchBar from '../../components/SearchBar.vue';
import { onMounted, ref, Ref } from "vue";
import { Book, BookService, BorrowInput } from '../../services/Book.service';
import router from '../../router';
import BookCard from '../../components/BookCard.vue';
import { useSessionStore } from '../../store';
import { notify } from 'notiwind';


const searchQuery: Ref<string> = ref("")
const searchState: Ref<boolean> = ref(false)
const books: Ref<Array<Book>> = ref([])
const service = new BookService()

function onSubmitSearch() {
   searchState.value = true
}

onMounted(async () => {
   try {
      books.value = await service.getAllBooks()
   } catch (err) {
      router.push({ name: "error" })
   }
})

async function borrow(book: Book) {
   const session = useSessionStore()
   const data: BorrowInput = {
      userId: session.userId,
      userEmail: session.email,
      bookId: book._id,
      bookTitle: book.title,
      bookIsbn: book.isbn
   }
   try {
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
   <div class="w-full bg-inherit flex flex-col items-center gap-3">
      <div class="md:w-[60%] w-full">
         <SearchBar :query.sync="searchQuery" @subit="onSubmitSearch" :state.sync="searchState" />
      </div>
      <div class="grid grid-flow-row items-center md:grid-cols-2 xl:grid-cols-3 place-items-center gap-2">
         <BookCard v-for="book in books" :book="book" @borrow:book="borrow"></BookCard>
      </div>
   </div>
</template>