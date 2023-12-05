<template>
    <div
        @click="router.push(game.path)"
        class="border-black rounded-lg cursor-pointer flex font-semibold border-[5px] shadow-xl p-4 transition-all w-5/6 duration-150 items-center justify-between hover:bg-green-800 hover:text-white"
    >
        <p class="font-semibold text-[16px] sm:text-[20px]">
            FOOTBALL {{ game.title.toUpperCase() }}
        </p>
        <i :class="`mdi mdi-arrow-right`" class="text-2xl"></i>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "@nuxtjs/composition-api";

defineProps<{
    game: { title: string; path: string };
}>();

const router = useRouter();
</script>
