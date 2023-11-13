<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import BorrowRow from '../../components/BorrowRow.vue.js';
import { Borrow, UserService } from '../../services/User.service.js';
import router from '../../router/index.js';


const borrows: Ref<Array<Borrow>> = ref([])

const service = new UserService()

function oncancel() {

}

onMounted(async () => {
    try {
        borrows.value = await service.getBorrows()
    } catch (err) {
        router.push({ name: "error" })
    }
})
</script>

<template>
    <div class="w-full bg-red-500 flex flex-col items-center gap-3">
        <div v-if="borrows.length != 0" class="md:w-[70%] w-full">
            <BorrowRow @request:cancel="oncancel" v-for="borrow in borrows" :borrow="borrow" />
        </div>
    </div>
</template>