<script setup lang="ts">
import { ref, Ref } from 'vue';
import { UserService } from '../../services/User.service';
import TextEntry from '../../components/TextEntry.vue';
import Button from '../../components/Button.vue'
import { notify } from 'notiwind';
import router from '../../router';
import { Payload, useSessionStore } from '../../store';


const store = useSessionStore()

type LoginModel = {
    email: string,
    password: string
}

let state: Ref<boolean> = ref(false)

let data: Ref<LoginModel> = ref({
    email: "",
    password: "",
})

async function submit(event: Event) {
    event.preventDefault()
    state.value = true
    const service = new UserService()
    try {
        const result = (await service.login(data.value.email, data.value.password) as Payload)
        store.$patch(result)
        localStorage.setItem("session", JSON.stringify(store.$state))
        router.push({ name: store.role, replace: true })
    } catch (err) {
        state.value = false
        notify({
            group: "bottom",
            title: "Error",
            text: (err as Error).message
        }, 4000)
    }
}

</script>

<template>
    <div class="w-full flex items-center justify-center">
        <div class="bg-white w-[70%] md:w-[40%] rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8 ">
                <h1
                    class="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Login
                </h1>
                <form class="space-y-4 md:space-y-6" v-on:submit="submit">
                    <TextEntry id="fullName" label="Your email" :value.sync="data.email" type="email"
                        placeholder="name@company.com" :required="true" @update:value="(value) => data.email = value" />
                    <TextEntry id="email" label="Password" :value.sync="data.password" type="password"
                        placeholder="••••••••" :required="true" @update:value="(value) => data.password = value" />
                    <Button label="Login" :state.sync="state" type="submit" />
                    <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                        Don’t have an account yet? <a href="#" @click="router.push({ name: 'register' })"
                            class="text-green-500">Register</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
</template>