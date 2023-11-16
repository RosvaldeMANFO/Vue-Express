<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import { Borrow, UserService } from '../../services/User.service.js';
import router from '../../router/index.js';
import Button from '../../components/Button.vue';
import { notify } from 'notiwind';
import NothingCard from '../../components/NothingCard.vue';


const borrows: Ref<Array<Borrow>> = ref([])

const service = new UserService()

function cancel(borrow: Borrow) {
    if (borrow.borrowStatus != "CANCELED") {
        const result = service.cancelRequest(borrow._id)
        notify({
            group: "top",
            title: "Success",
            text: result
        }, 4000)
        fetchAllBorrowing()
    }
}

async function fetchAllBorrowing() {
    try {
        borrows.value = await service.getBorrows()
    } catch (err) {
        alert(JSON.stringify(err))
        router.push({ name: "error" })
    }
}
onMounted(async () => {
    fetchAllBorrowing()
})
</script>

<template>
    <div class="dark:bg-gray-600 h-full flex flex-col">
        <h1 class="dark:text-gray-100 text-4xl capitalize">My requests</h1>
        <div v-if="borrows.length != 0" class=" mt-10 overflow-x-scroll rounded-lg dark:bg-gray-800 max-h-screen">
            <table class=" whitespace-nowrap table-auto shadow-md mt-5   border-separate border-spacing-y-3">
                <thead class="text-left tracking-wider">
                    <tr>
                        <th class=" dark:text-gray-100  p-4">Title</th>
                        <th class=" dark:text-gray-100  p-4">Status</th>
                        <th class=" dark:text-gray-100  p-4">Borrowing state</th>
                        <th class="dark:text-gray-100  p-4">Return state</th>
                        <th class="dark:text-gray-100  p-4">Borrowing date</th>
                        <th class="dark:text-gray-100  p-4">Return date</th>
                        <th class="dark:text-gray-100  p-4"> </th>
                    </tr>
                </thead>
                <tbody class="overflow-y-scroll">
                    <tr :key="borrow._id" v-for="borrow in borrows" class="hover:bg-gray-500">
                        <td class="p-4 dark:text-gray-100">{{ borrow.bookTitle }}</td>
                        <td class="p-4 dark:text-gray-100">{{ borrow.borrowStatus }}</td>
                        <td class="p-4 dark:text-gray-100">{{ borrow.receivedState }}</td>
                        <td class="p-4 dark:text-gray-100">{{ borrow.returnState }}</td>
                        <td class="p-4 dark:text-gray-100">{{ new Date(borrow.createdAt).toLocaleDateString() }}</td>
                        <td class="p-4 dark:text-gray-100">{{ new Date(borrow.updatedAt).toLocaleDateString() }}</td>
                        <td class="p-4 dark:text-gray-100">
                            <Button @click="cancel(borrow)" :state="false"
                                :label="borrow.borrowStatus != 'CANCELED' ? 'Cancel' : 'Canceled'" type="button"
                                :class="{ 'bg-red-300 hover:bg-red-400': borrow.borrowStatus == 'CANCELED' }" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <NothingCard v-else class="self-center"
            message="You haven't yet request for a borrowing. Make one an comes back here to track it 🥲!" />
    </div>
</template>