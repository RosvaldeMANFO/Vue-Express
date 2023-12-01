<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import router from '../../router';
import { IRequest, RequestService } from '../../services/Request.service';
import DatePicker from '../../components/DatePicker.vue';
import SearchBar from '../../components/SearchBar.vue';
import SelectOption from '../../components/SelectOption.vue';
import { RequestStatus } from '../../services/Request.service';
import Badge from '../../components/Badge.vue';
import UpdateRequestForm from './UpdateRequestForm.vue';
import { notify } from 'notiwind';
import NothingCard from '../../components/NothingCard.vue';
import Loader from '../../components/Loader.vue';

const loading: Ref<boolean> = ref(false)
const service = new RequestService()
const requests: Ref<IRequest[]> = ref([])
const requestStatus: Ref<string> = ref('')
const date: Ref<Date> = ref(new Date())
const filtered: Ref<boolean> = ref(false)
const searchState: Ref<boolean> = ref(false)
const selectedRequest: Ref<IRequest | unknown> = ref()
let readerId: Ref<string> = ref(router.currentRoute.value.params.readerId as string || '')

async function getAllRequest() {
    try {
        loading.value = true
        requests.value = await service.getAllRequest()
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

function sortByStatus(status: string) {
    filtered.value = true
    requestStatus.value = status
    requests.value = requests.value.filter((request) => request.requestStatus == status)
}
function sortByDate(createdAt: Date) {
    filtered.value = true
    date.value = createdAt
    requests.value = requests.value.filter(((request) =>
        new Date(request.createdAt).toLocaleDateString() == createdAt.toLocaleDateString())
    )
}

async function clearFilter() {
    requestStatus.value = ""
    date.value = new Date()
    filtered.value = false
    await getAllRequest()
}

async function submitSearchQuery(query: string) {
    try {
        loading.value = true
        searchState.value = true
        requests.value = await service.getRequestByIdOrEmail(query)
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
    await getAllRequest()
})


</script>
    
<template>
    <div class=" h-full flex flex-col gap-3 w-full relative ">
        <h1 class="dark:text-gray-100 text-4xl capitalize">Borrowing request</h1>
        <div class="whitespace-nowrap mt-7">
            <SearchBar :value.sync="readerId" :state="searchState" class=" w-full mb-7" placeholder="Email"
                @submit:query="submitSearchQuery" @clear:query="clearFilter" />
            <div class=" flex gap-3 items-end justify-between w-full">
                <div class="flex gap-3 items-center w-full ">
                    <SelectOption class="w-[30%]" label="Request status" @update:value="sortByStatus" placeholder="Select status"
                        :value="requestStatus" :options="Object.values(RequestStatus)" id="status" />
                    <DatePicker :value.sync="date" @update:value="sortByDate" label="Request on" />
                    <span v-if="filtered" class="cursor-pointer" @click="clearFilter">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M18 6L6 18M6 6l12 12" stroke="cyan" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </span>
                </div>
                <Badge :label="`${requests.length} Request(s)`"
                    class="w-fit h-fit p-1.5 text-gray-100 text-xl bg-slate-500 hover:bg-slate-500" />
            </div>
        </div>
        <Loader :state="loading" />
        <div v-if="requests.length != 0 && !loading" class="overflow-x-scroll rounded-lg dark:bg-gray-800 max-h-screen">
            <table
                class="whitespace-nowrap table-auto shadow-md border-separate border-spacing-y-0 w-full border dark:border-gray-700">
                <thead class="text-left tracking-wider sticky top-0 dark:bg-gray-900 bg-gray-500">
                    <tr>
                        <th class=" dark:text-gray-100  p-4">Email</th>
                        <th class=" dark:text-gray-100  p-4">Title</th>
                        <th class=" dark:text-gray-100  p-4">Request status</th>
                        <th class="dark:text-gray-100  p-4">Receiving state</th>
                        <th class="dark:text-gray-100  p-4">Returning state</th>
                        <th class="dark:text-gray-100  p-4">Request date</th>
                        <th class="dark:text-gray-100  p-4">Returning date</th>
                    </tr>
                </thead>
                <tbody class="overflow-y-scroll">
                    <tr :key="request._id" v-for="request in requests"
                        class="dark:hover:bg-gray-400 hover:bg-gray-300 cursor-pointer" @click="selectedRequest = request">
                        <td class="p-4 dark:text-gray-100">{{ request.userEmail }}</td>
                        <td class="p-4 dark:text-gray-100">{{ request.bookTitle }}</td>
                        <td class="p-4 dark:text-gray-100">{{ request.requestStatus }}</td>
                        <td class="p-4 dark:text-gray-100">{{ request.receivingState }}</td>
                        <td class="p-4 dark:text-gray-100">{{ request.returningState }}</td>
                        <td class="p-4 dark:text-gray-100">{{ new Date(request.receivingDate || new
                            Date()).toLocaleDateString() }}</td>
                        <td class="p-4 dark:text-gray-100">{{ new Date(request.returningDate || new
                            Date()).toLocaleDateString() }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <NothingCard v-else-if="requests.length == 0 && !loading" class="mt-10 self-center"
            message="There is no request matching this criteria🥲!" />
        <div v-if="selectedRequest != null" v-show="selectedRequest"
            class="h-full w-full opacity-5 bg-gray-700 dark:text-gray-100 absolute">
        </div>
        <UpdateRequestForm v-if="selectedRequest != null" :request.sync="(selectedRequest as IRequest)"
            @close:dialog="selectedRequest = null" />
    </div>
</template>