<script setup lang="ts">
import Button from './Button.vue';
import { Book } from '../services/Book.service';

const emit = defineEmits()
defineProps<{book: Book}>()

function bookClicked(book: Book) {
    emit("selected:book", book)
}

function requestBorrow(book: Book) {
    emit("borrow:book", book)
}
</script>

<template>
    <div :key="book._id"
        class="w-full max-w-sm bg-white border border-gray-200 rounded-md shadow-md dark:bg-gray-800 dark:border-gray-700">
        <img @click="bookClicked(book)" class="w-fill rounded-t-md cursor-pointer" :src="book.bookCover" alt="Book image">

        <div class="mt-2 px-5 pb-5 flex flex-col">
            <h3 class="capitalize tracking-tight dark:text-gray-100">{{ book.title }}</h3>
            <h5 class="capitalize tracking-tight dark:text-gray-100">{{ book.author }}</h5>
            <i class="dark:text-gray-100 text-sm">
                {{ book.publishingHouse }}
                {{ new Date(book.publicationDate).toLocaleDateString()}}
            </i>
            
            <div class="flex justify-between items-center mt-2">
                <p v-if="book.status == 'AVAILABLE'" class="text-green-300 text-sm">
                    {{ book.status }}
                </p>
                <p v-else class="text-red-300 text-sm">
                    {{ book.status }}
                </p>
                <div class="w-fit h-fit self-end">
                <Button label="Borrow" :state="false" type="button" v-on:click="requestBorrow(book)" />
            </div>
            </div>
        </div>
    </div>
</template>