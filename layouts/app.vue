<template>
    <div>
        <div class="flex min-h-10vh items-center">
            <nav class="flex w-screen px-8 items-center justify-between">
                <div class="flex w-full gap-8 justify-between">
                    <img
                        src="~/assets/img/app/logo_black.png"
                        alt="Football ball"
                        class="cursor-pointer h-10 transform w-10 rotate-0 duration-200"
                        @click="router.push('/')"
                    />
                    <AppParamButtons />
                </div>
            </nav>
        </div>
        <Nuxt class="min-h-90vh"></Nuxt>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "@nuxtjs/composition-api";

const router = useRouter();
</script>

<style>
/* // scrollbar style */

::-webkit-scrollbar,
::-webkit-scrollbar-track {
    visibility: visible;
    width: 5px;
}

::-webkit-scrollbar-thumb {
    background-color: var(--color-gray);
    border-radius: 100vw;
}

::-webkit-scrollbar-thumb:hover {
    background-color: rgb(175, 175, 175);
}

::-webkit-scrollbar-thumb:active {
    background-color: rgb(150, 150, 150);
}

body::webkit-scrollbar {
    width: 12px;
}

body::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
}

body::-webkit-scrollbar-thumb {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}
</style>
