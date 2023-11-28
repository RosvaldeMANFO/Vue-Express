<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import { Borrow, UserService } from '../../services/User.service.js';
import router from '../../router/index.js';
import Button from '../../components/Button.vue';
import { notify } from 'notiwind';
import NothingCard from '../../components/NothingCard.vue';
import SelectOption from '../../components/SelectOption.vue';
import { BorrowingStatus } from '../../services/Borrowing.service'
import DatePicker from '../../components/DatePicker.vue';

const requests: Ref<Array<Borrow>> = ref([])
const listStatus: Ref<string> = ref('')
const filtered: Ref<boolean> = ref(false)
const period: Ref<Date> = ref(new Date())
const service = new UserService()

async function cancel(borrow: Borrow) {
    if (borrow.borrowStatus != "CANCELED") {
        const result = await service.cancelRequest(borrow._id)
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
        requests.value = await service.getAllRequest()
    } catch (err) {
        alert(JSON.stringify(err))
        router.push({ name: "error" })
    }
}

async function sortBorrowing(status: string) {
    filtered.value = true
    listStatus.value = status
    if (status.length != 0) {
        requests.value = requests.value.filter((request) => request.borrowStatus == status)
    }
}
async function setPeriod(date: Date) {
    filtered.value = true
    period.value = date
    requests.value = requests.value.filter((request) => new Date(request.createdAt).toLocaleDateString() == date.toLocaleDateString())
}
async function clearFilter() {
    filtered.value = false
    listStatus.value = ""
    period.value = new Date()
    await fetchAllBorrowing()
}
onMounted(async () => {
    await fetchAllBorrowing()
})
</script>

<template>
    <div class=" dark:bg-gray-600 h-full flex flex-col gap-3">
        <h1 class="dark:text-gray-100 text-4xl capitalize">My requests</h1>
        <div class="whitespace-nowrap flex justify-between gap-3 w-full items-end mt-7">
            <div class="flex gap-2 items-center">
                <SelectOption label="Request status" @update:value="sortBorrowing" placeholder="Select status"
                    class="w-[30%]" :value="listStatus" :options="Object.values(BorrowingStatus)" id="status" />
                <DatePicker :value.sync="period" @update:value="setPeriod" label="Request on" />
                <span v-if="filtered" class="cursor-pointer" @click="clearFilter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 6L6 18M6 6l12 12" stroke="white" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </span>
            </div>
            <span class="w-fit h-fit p-1.5 text-gray-100 text-xl bg-slate-500 rounded-md shadow-sm">
                {{ requests.length }} Request(s)</span>
        </div>
        <div v-if="requests.length != 0" class="overflow-x-scroll rounded-lg dark:bg-gray-800 max-h-screen">
            <table class="whitespace-nowrap table-auto shadow-md border-separate border-spacing-y-0 w-full">
                <thead class="text-left tracking-wider sticky top-0 dark:bg-gray-900 bg-gray-500">
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
                    <tr :key="request._id" v-for="request in requests" class="hover:bg-gray-500">
                        <td class="p-4 dark:text-gray-100">{{ request.bookTitle }}</td>
                        <td class="p-4 dark:text-gray-100">{{ request.borrowStatus }}</td>
                        <td class="p-4 dark:text-gray-100">{{ request.receivedState }}</td>
                        <td class="p-4 dark:text-gray-100">{{ request.returnState }}</td>
                        <td class="p-4 dark:text-gray-100">{{ new Date(request.createdAt).toLocaleDateString() }}</td>
                        <td class="p-4 dark:text-gray-100">{{ new Date(request.updatedAt).toLocaleDateString() }}</td>
                        <td class="p-4 dark:text-gray-100">
                            <Button @click="cancel(request)" :state="false"
                                :label="request.borrowStatus != 'CANCELED' ? 'Cancel' : 'Canceled'" type="button"
                                :class="{ 'bg-red-400 hover:bg-red-400': request.borrowStatus == 'CANCELED' }" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <NothingCard v-else-if="listStatus.length != 0" class="self-center mt-10"
            :message="`You do not have request with ${listStatus} status !🥲`" />
        <NothingCard v-else class="self-center mt-10" message="You have not make any request yet !🥲" />

    </div>
</template>