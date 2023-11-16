<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import { notify } from 'notiwind';
import NothingCard from '../../components/NothingCard.vue';
import SearchBar from "../../components/SearchBar.vue";
import { Reader, UserService } from '../../services/User.service';
import router from '../../router';

const searchState: Ref<boolean> = ref(false)
const readers: Ref<Array<Reader>> = ref([])
const service = new UserService()

function countReader() {
    return readers.value.filter(e => e.role == "READER").length
}

async function getAllBook() {
    try {
        readers.value = await service.getAllReaders()
    } catch (err) {
        notify({
            group: "bottom",
            title: "Error",
            text: (err as Error).message
        }, 4000)
    }
}

async function submitSearch(query: string) {
    searchState.value = true
    try {
        if (query.length != 0) {
            const request = {
                email: query,
                fullName: query,
            }
            const result = await service.findReader(request)
            if (result.length != 0) {
                readers.value = result
            } else {
                readers.value = await service.getAllReaders()
            }
        } else {
            readers.value = await service.getAllReaders()
        }
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

function goToHistory(readerId: string){
    router.push({name: "reader_history", params:{readerId}})
}

onMounted(async () => {
    getAllBook()
})


</script>

<template>
    <div class=" dark:bg-gray-600 h-full flex flex-col gap-7">
        <h1 class="dark:text-gray-100 text-4xl capitalize">Readers</h1>
        <div class="flex justify-end gap-3 w-full items-center self-end">
            <SearchBar class="grow" @submit:query="submitSearch" :state.sync="searchState" />
            <span
                class="block whitespace-nowrap self-end w-fit text-gray-100 p-2 text-xl bg-slate-500 rounded-md shadow-sm">
                {{ countReader() }} Subscriber(s)</span>
        </div>
        <div v-if="readers.length != 0"
            class=" whitespace-nowrap overflow-x-scroll rounded-lg dark:bg-gray-800 max-h-screen w-full">
            <table class="table-auto shadow-md mt-5   border-separate border-spacing-y-3 w-full">
                <thead class="text-left tracking-wider">
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
                    <tr :key="reader._id" v-if="reader.role == 'READER'" class="hover:bg-gray-500" @click="goToHistory(reader._id)">
                        <td class="p-4 dark:text-gray-100">{{ index + 1 }}</td>
                        <td class="p-4 dark:text-gray-100">{{ reader.email }}</td>
                        <td class="p-4 dark:text-gray-100">{{ reader.fullName }}</td>
                        <td class="p-4 dark:text-gray-100">{{ new Date(reader.createdAt).toLocaleDateString() }}</td>
                        <td class="p-4 dark:text-gray-100">{{ new Date(reader.updatedAt).toLocaleDateString() }}</td>
                        <td class="p-4 dark:text-gray-100">{{ reader.role }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <NothingCard v-else class="self-center" message="There are no subscribers yet 🥲!" />
    </div>
</template>