<script setup lang="ts">
import Button from './Button.vue';
import { BookMapped } from '../services/Book.service';

const emit = defineEmits()
defineProps<{mappedBook: BookMapped}>()

function requestBorrow(book: BookMapped) {
    emit("borrow:book", book)
}
</script>

<template>
    <div :key="mappedBook.book._id"
        class="w-full max-w-sm h-full  bg-white border border-gray-200 rounded-md shadow-md dark:bg-gray-800 dark:border-gray-700 flex flex-col justify-between">
        <img class="w-fill rounded-t-md max-h-60 min-h-max" :src="mappedBook.collection.bookCover || '../../public/vite.svg'" alt="Book cover">

        <div class="mt-2 px-5 pb-5 flex flex-col">
            <h3 class="capitalize tracking-tight dark:text-gray-100">{{ mappedBook.collection.title }}</h3>
            <h5 class="capitalize tracking-tight dark:text-gray-100">{{ mappedBook.collection.author }}</h5>
            <i class="dark:text-gray-100 text-sm">
                {{ mappedBook.collection.publishingHouse }}
                {{ new Date(mappedBook.collection.publicationDate).toLocaleDateString()}}
            </i>
            
            <div class="flex justify-between items-center mt-2">
                <p v-if="mappedBook.book.status == 'AVAILABLE'" class="text-green-300 text-sm">
                    {{ mappedBook.book.status }}
                </p>
                <p v-else class="text-red-300 text-sm">
                    {{ mappedBook.book.status }}
                </p>
                <div class="w-fit h-fit self-end">
                <Button label="Borrow" :state="false" type="button" v-on:click="requestBorrow(mappedBook)">
                    <svg stroke="white" class="w-6 h-6 fill-none text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
                        <path
                            d="M19 0H1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1ZM2 6v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6H2Zm11 3a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 2 0h2a1 1 0 0 1 2 0v1Z" />
                    </svg>
                 </Button>
            </div>
            </div>
        </div>
    </div>
</template>