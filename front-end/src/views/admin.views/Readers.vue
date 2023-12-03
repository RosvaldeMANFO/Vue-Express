<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import { notify } from 'notiwind';
import NothingCard from '../../components/NothingCard.vue';
import SearchBar from "../../components/SearchBar.vue";
import { Reader, UserService } from '../../services/User.service';
import router from '../../router';
import Badge from '../../components/Badge.vue';
import Loader from '../../components/Loader.vue';

const loading: Ref<boolean> = ref(false)
const searchState: Ref<boolean> = ref(false)
const readers: Ref<Array<Reader>> = ref([])
const service = new UserService()

function countReader() {
    return readers.value.filter(e => e.role == "READER").length
}

async function getAllReader() {
    try {
        loading.value = true
        readers.value = await service.getAllReader()
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

async function submitSearch(query: string) {
    searchState.value = true
    try {
        const request = {
            email: query,
            fullName: query,
        }
        readers.value = await service.findReader(request)
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

function goToHistory(readerId: string) {
    router.push({ name: "requests", params: { readerId } })
}

onMounted(async () => {
    getAllReader()
})


</script>

<template>
    <div class=" dark:bg-gray-600 h-full flex flex-col gap-7">
        <h1 class="dark:text-gray-100 text-4xl capitalize">Readers</h1>
        <div class="flex justify-end gap-3 w-full items-center self-end">
            <SearchBar class="grow" @submit:query="submitSearch" :state.sync="searchState" @clear:query="getAllReader"
                :placeholder="'Email, Full name'" />
            <Badge :label="`${countReader()} Subscriber(s)`"
                class="block whitespace-nowrap self-end w-fit text-gray-100 p-2 text-xl bg-slate-500 hover:bg-slate-500 cursor-default rounded-md shadow-sm" />
        </div>
        <Loader :state="loading" />

        <div v-if="readers.length != 0 && !loading"
            class=" whitespace-nowrap overflow-x-scroll rounded-lg dark:bg-gray-800 max-h-screen w-full border dark:border-gray-700">
            <table class="table-auto shadow-md border-separate border-spacing-y-0 w-full">
                <thead class="text-left tracking-wider sticky top-0 dark:bg-gray-900 bg-gray-500">
                    <tr>
                        <th class=" dark:text-gray-100  p-4">N°</th>
                        <th class=" dark:text-gray-100  p-4">email</th>
                        <th class="dark:text-gray-100  p-4">Full name</th>
                        <th class="dark:text-gray-100  p-4">Member since</th>
                        <th class="dark:text-gray-100  p-4">Update at</th>
                        <th class=" dark:text-gray-100  p-4">Role</th>
                    </tr>
                </thead>
                <tbody v-for="reader, index in readers" class="overflow-y-scroll">
                    <tr :key="reader._id" v-if="reader.role == 'READER'" class="dark:hover:bg-gray-400 hover:bg-gray-300 cursor-pointer"
                        @click="goToHistory(reader._id)">
                        <td class="p-4 dark:text-gray-100">{{ index }}</td>
                        <td class="p-4 dark:text-gray-100">{{ reader.email }}</td>
                        <td class="p-4 dark:text-gray-100">{{ reader.fullName }}</td>
                        <td class="p-4 dark:text-gray-100">{{ new Date(reader.createdAt).toLocaleDateString() }}</td>
                        <td class="p-4 dark:text-gray-100">{{ new Date(reader.updatedAt).toLocaleDateString() }}</td>
                        <td class="p-4 dark:text-gray-100">{{ reader.role }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <NothingCard v-else-if="readers.length == 0 && !loading" class="self-center"
            message="There are no subscribers yet 🥲!" />
    </div>
</template>