<script setup lang="ts">
import router from '../../router/index.js';
import Button from '../../components/Button.vue';
import { onMounted } from 'vue';
import { useSessionStore } from '../../store';
import { storeToRefs } from 'pinia';

const store = useSessionStore()
const {exp} = storeToRefs(store)

function register() {
    router.push({ name: "register", replace: true })
}
function login() {
    router.push({ name: "login", replace: true })
}

onMounted(() => {
    if (exp.value > Math.floor(Date.now() / 100)) {
        router.push({ name: store.role, replace: true })
    }
})

</script>

<template>
    <main class="w-screen h-screen justify-center items-center flex dark:bg-gray-700">
        <div
            class="w-[70%] md:w-[40%] h-[70%] p-7 pt-64 bg-white rounded-lg shadow dark:border  dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 flex flex-col gap-4">
            <Button type="button" v-on:click="login" :state="false" label="Login" />
            <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-center">You don't have an account?
                <a v-on:click="register" class="text-green-500 cursor-pointer">
                    create one here
                </a>
            </p>
        </div>
    </main>
</template>