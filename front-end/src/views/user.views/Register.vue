<script setup lang="ts">
import { ref, Ref } from 'vue';
import { UserService } from '../../services/User.service';
import { notify } from 'notiwind';
import TextEntry from '../../components/TextEntry.vue';
import Button from '../../components/Button.vue';
import router from '../../router';
import PasswordInput from '../../components/PasswordInput.vue';

type RegisterModel = {
    fullName: string,
    email: string,
    password: string
}

let state: Ref<boolean> = ref(false)

let data: Ref<RegisterModel> = ref({
    fullName: "",
    email: "",
    password: "",
})

async function submit(event: Event) {
    event.preventDefault()
    state.value = true
    const service = new UserService()
    try {
        await service.register(data.value.fullName, data.value.email, data.value.password)
        router.push({ name: "login", replace: true })
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
        <div class="bg-white w-[70%] md:w-[40%] rounded-lg shadow dark:border dark:bg-inherit border dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1
                    class="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Register
                </h1>
                <form class="space-y-4 md:space-y-6" v-on:submit="submit">
                    <TextEntry id="fullName" label="Your full name" :value.sync="data.fullName" type="text"
                        placeholder="Thomas Windsor" :required="true" @update:value="(value) => data.fullName = value" />
                    <TextEntry id="email" label="Your email" :value.sync="data.email" type="email"
                        placeholder="name@company.com" :required="true" @update:value="(value) => data.email = value" />
                    <PasswordInput :value.sync="data.password" @update:value="(value) => data.password = value" />
                    <Button label="Register" :state.sync="state" type="submit" />
                    <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                        You already have an account ? <a href="#" @click="router.push({ name: 'login' })"
                            class="text-green-500 cursor-pointer">Login</a>
                    </p>
                </form>
            </div>
        </div>
    </div>
</template>