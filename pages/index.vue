<template>
    <div class="flex w-full">
        <div
            class="bg-cover h-screen w-1/2 relative items-center justify-center hidden md:flex"
            :style="{
                'background-image': `url(${require('~/assets/img/index/background.png')})`,
            }"
        >
            <img
                src="~/assets/img/app/logo_white.png"
                class="top-5 left-5 absolute"
            />
            <h1 class="font-bold text-white mb-12 text-[68px] lg:text-[96px]">
                FOOTBALL <br />
                GAMES
            </h1>
        </div>
        <div
            class="flex flex-col h-screen w-full gap-y-4 justify-center items-center md:w-1/2"
        >
            <HomeButton v-for="game in games" :key="game.path" :game="game" />
            <AppParamButtons class="mt-4" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "@nuxtjs/composition-api";
import { games } from "~/utils/dicts";

const router = useRouter();
</script>

<style>
* {
    font-family: "Inter";
}
</style>
