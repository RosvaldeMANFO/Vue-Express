<script setup lang="ts">
import router from '../../router/index.js';
import Button from '../../components/Button.vue';
import { Payload, useSessionStore } from '../../store';
import { UserService } from '../../services/User.service';
import { onMounted } from 'vue';

const store = useSessionStore()
const service = new UserService()

function register() {
    router.push({ name: "register", replace: true })
}
function login() {
    router.push({ name: "login", replace: true })
}

onMounted(async () => {
    try {
        const payload = (await service.tokenValidation(store.token) as Payload)
        if (payload) {
            store.$patch(payload)
            if(store.exp > Math.floor(Date.now() / 1000)){
                router.push({ name: store.role, replace: true })
            }else{
                router.push({ name: "login", replace: true })
            }
        } else{
            router.push({ name: "login", replace: true })
        }
    } catch (err) {
        
    }
})

</script>

<template>
    <main
        class="w-full h-full justify-center items-center flex dark:bg-inherit">
        <div
            class="w-[70%] md:w-[40%] h-[70%] p-7 pt-64 bg-white rounded-lg shadow dark:border  dark:bg-inherit border dark:border-gray-700 dark:text-gray-400 flex flex-col gap-4">
            <Button type="button" v-on:click="login" :state="false" label="Login" />
            <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-center">You don't have an account?
                <a v-on:click="register" class="text-green-500 cursor-pointer">
                    create one here
                </a>
            </p>
        </div>
    </main>
</template>