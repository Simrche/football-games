<template>
    <div class="flex gap-x-2">
        <div
            class="border-black rounded-md cursor-pointer flex border-[4px] h-10 shadow-lg w-10 items-center justify-center hover:bg-green-800 hover:text-white"
        >
            <i class="text-xl mdi mdi-weather-night"></i>
        </div>
        <div
            class="border-black rounded-md cursor-pointer flex border-[4px] h-10 shadow-lg w-10 items-center justify-center hover:bg-green-800 hover:text-white"
        >
            <i class="text-xl mdi mdi-cog"></i>
        </div>
        <div
            class="border-black rounded-md cursor-pointer flex border-[4px] h-10 shadow-lg w-10 items-center justify-center hover:bg-green-800 hover:text-white"
        >
            <i class="text-xl mdi mdi-book"></i>
        </div>
        <div
            v-if="isAdmin"
            class="border-black rounded-md cursor-pointer flex border-[4px] h-10 shadow-lg w-10 items-center justify-center hover:bg-green-800 hover:text-white"
            @click="router.push('/admin')"
        >
            <i class="text-xl mdi mdi-shield-crown-outline"></i>
        </div>
    </div>
</template>

<script setup last="ts">
import { computed, useRouter } from "@nuxtjs/composition-api";
import { getData } from "nuxt-storage/local-storage";

const router = useRouter();

const isAdmin = computed(() => {
    return (
        getData("secretKey") &&
        getData("secretKey").value === process.env.secretKey
    );
});
</script>
