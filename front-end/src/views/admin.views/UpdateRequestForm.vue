<script setup lang="ts">
import { ref, Ref } from 'vue';
import Button from '../../components/Button.vue'
import { notify } from 'notiwind';
import SelectOption from '../../components/SelectOption.vue';
import { BookState, IRequest, RequestService, RequestStatus } from '../../services/Request.service';
import DatePicker from '../../components/DatePicker.vue';
const emit = defineEmits()
const props = defineProps<{ request: IRequest }>()
const service = new RequestService()
let state: Ref<boolean> = ref(false)


function closeDialogForm() {
    emit("close:dialog")
}

async function submit(event: Event) {
    event.preventDefault()
    try {
        state.value = true
        validateRequest()
        const result = await service.updateRequest(props.request)
        notify({
            group: "top",
            title: "Success",
            text: result
        }, 4000)
        closeDialogForm()
    } catch (err) {
        notify({
            group: "bottom",
            title: "Error",
            text: (err as Error).message
        }, 4000)
    } finally {
        state.value = false
    }
}

function validateRequest(){
    if(props.request?.receivingDate! > props.request.returningDate!){
        throw Error('Receiving date can not be greater than returning date')
    }
}

</script>

<template>
    <div
        class="p-5 rounded-md bg-inherit dark:text-gray-100 absolute shadow-md border dark:border-gray-700 -translate-y-1/2 top-1/2 right-1/2 translate-x-1/2 flex flex-col gap-3 w-[90%] h-fit sm:w-[70%]">
        <span class="cursor-pointer self-end" @click="closeDialogForm">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6L6 18M6 6l12 12" stroke="cyan" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round" />
            </svg>
        </span>
        <h2 class="text-inherit text-2xl">{{ request.userEmail }}</h2>
        <form @submit="submit" class="mt-7 w-full flex flex-col gap-3">
            <SelectOption label="Request status" :options="Object.values(RequestStatus)" id="requestStatus"
                :value="request.requestStatus" @update:value="(value: string) => request.requestStatus = value" />
            <SelectOption label="Returning state" :options="Object.values(BookState)" id="requestStatus"
                :value="request.returningState" @update:value="(value: string) => request.returningState = value" />
            <div class="flex justify-start w-full gap-3 flex-wrap">
                <DatePicker class="grow" label="Receiving date" :value.sync="new Date(request.receivingDate || new Date())"
                    @update:value="value => request.receivingDate = new Date(value)" />
                <DatePicker class="grow" label="Returning date" :value.sync="new Date(request.returningDate || new Date())"
                    @update:value="value => request.returningDate = new Date(value)" />
            </div>
            <Button label="Save" :state="state" class="bg-cyan-300 hover:bg-cyan-400 mt-7" type="submit" />
        </form>
    </div>
</template>