<script setup lang="ts">
import { Borrow } from "../services/User.service";
import Button from "./Button.vue";

const emit = defineEmits()

defineProps<{ borrow: Borrow }>()

function cancel(borrow: Borrow){
    emit("request:cancel", borrow._di)
}

</script>

<template>
    <tr>
       <td>{{ borrow.bookTitle }}</td>
       <td>{{ borrow.borrowStatus }}</td>
       <td>{{ borrow.receivedState }}</td>
       <td>{{ borrow.returnState }}</td>
       <td>{{ borrow.createdAt }}</td>
       <td>{{ borrow.updatedAt }}</td>
       <td>
        <Button @click="cancel(borrow)" :state="false" label="Cancel" type="button"/>
       </td>
    </tr>
</template>