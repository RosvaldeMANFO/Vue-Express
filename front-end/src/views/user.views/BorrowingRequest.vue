<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import { UserService } from '../../services/User.service.js';
import router from '../../router/index.js';
import Button from '../../components/Button.vue';
import { notify } from 'notiwind';
import NothingCard from '../../components/NothingCard.vue';
import SelectOption from '../../components/SelectOption.vue';
import { IRequest, RequestStatus } from '../../services/Request.service'
import DatePicker from '../../components/DatePicker.vue';
import Loader from '../../components/Loader.vue';


const loading: Ref<boolean> = ref(false)
const requests: Ref<Array<IRequest>> = ref([])
const listStatus: Ref<string> = ref('')
const filtered: Ref<boolean> = ref(false)
const period: Ref<Date> = ref(new Date())
const service = new UserService()

async function cancel(request: IRequest) {
    if (request.requestStatus != "CANCELED") {
        const result = await service.cancelRequest(request._id)
        notify({
            group: "top",
            title: "Success",
            text: result
        }, 4000)
        fetchAllRequest()
    }
}

async function fetchAllRequest() {
    try {
        loading.value = true
        requests.value = await service.getAllRequest()
    } catch (err) {
        alert(JSON.stringify(err))
        router.push({ name: "error" })
    } finally {
        loading.value = false
    }
}

async function sortRequest(status: string) {
    filtered.value = true
    listStatus.value = status
    if (status.length != 0) {
        requests.value = requests.value.filter((request) => request.requestStatus == status)
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
    await fetchAllRequest()
}
onMounted(async () => {
    await fetchAllRequest()
})
</script>

<template>
    <div class=" dark:bg-gray-600 h-full flex flex-col gap-3">
        <h1 class="dark:text-gray-100 text-4xl capitalize">My requests</h1>
        <div class="whitespace-nowrap flex justify-between gap-3 w-full items-end mt-7">
            <div class="flex gap-2 items-center w-full">
                <SelectOption label="Request status" @update:value="sortRequest" placeholder="Select status" class="w-[30%]"
                    :value="listStatus" :options="Object.values(RequestStatus)" id="status" />
                <DatePicker :value.sync="period" @update:value="setPeriod" label="Request on" />
                <span v-if="filtered" class="cursor-pointer" @click="clearFilter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 6L6 18M6 6l12 12" stroke="cyan" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </span>
            </div>
            <span class="w-fit h-fit p-1.5 text-gray-100 text-xl bg-slate-500 rounded-md shadow-sm">
                {{ requests.length }} Request(s)</span>
        </div>
        <Loader :state="loading" />
        <div v-if="requests.length != 0 && !loading"
            class="overflow-x-scroll rounded-lg dark:bg-gray-800 max-h-screen border dark:border-gray-700">
            <table class="whitespace-nowrap table-auto shadow-md border-separate border-spacing-y-0 w-full">
                <thead class="text-left tracking-wider sticky top-0 dark:bg-gray-900 bg-gray-500">
                    <tr>
                        <th class=" dark:text-gray-100  p-4">Title</th>
                        <th class=" dark:text-gray-100  p-4">Status</th>
                        <th class=" dark:text-gray-100  p-4">Request state</th>
                        <th class="dark:text-gray-100  p-4">Return state</th>
                        <th class="dark:text-gray-100  p-4">Request date</th>
                        <th class="dark:text-gray-100  p-4">Return date</th>
                        <th class="dark:text-gray-100  p-4"> </th>
                    </tr>
                </thead>
                <tbody class="overflow-y-scroll">
                    <tr :key="request._id" v-for="request in requests" class="dark:hover:bg-gray-400 hover:bg-gray-300">
                        <td class="p-4 dark:text-gray-100">{{ request.bookTitle }}</td>
                        <td class="p-4 dark:text-gray-100">{{ request.requestStatus }}</td>
                        <td class="p-4 dark:text-gray-100">{{ request.receivingState }}</td>
                        <td class="p-4 dark:text-gray-100">{{ request.returningState }}</td>
                        <td class="p-4 dark:text-gray-100">{{ new Date(request.createdAt).toLocaleDateString() }}</td>
                        <td class="p-4 dark:text-gray-100">{{ new Date(request.updatedAt).toLocaleDateString() }}</td>
                        <td class="p-4 flex items-center justify-center">
                            <Button v-if="request.requestStatus == RequestStatus.OnHold.valueOf()" @click="cancel(request)" :state="false"
                                label="Cancel" type="button" />
                            <svg v-else xmlns="http://www.w3.org/2000/svg" height="16" width="14"
                                viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.-->
                                <path fill="gray"
                                    d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" />
                            </svg>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <NothingCard v-else-if="requests.length == 0 && !loading" class="self-center mt-10"
            :message="`You do not have request matching to this criteria !🥲`" />
    </div>
</template>