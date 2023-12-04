<template>
    <div class="flex w-full">
        <div
            class="bg-cover h-screen w-1/2 relative items-center justify-center hidden md:flex"
            :style="{
                'background-image': `url(${require('~/assets/img/index/background.png')})`,
            }"
        >
            <img
                src="~/assets/img/index/logo_white.png"
                class="top-5 left-5 absolute"
            />
            <h1 class="font-bold text-white text-[68px] lg:text-[96px]">
                FOOTBALL <br />
                GAMES
            </h1>
        </div>
        <div
            class="flex flex-col h-screen w-full gap-y-4 justify-center items-center md:w-1/2"
        >
            <div
                v-for="game in games"
                @click="router.push(game.path)"
                class="border-black rounded-lg cursor-pointer flex font-semibold border-[5px] shadow-xl p-4 transition-all w-5/6 duration-150 items-center justify-between hover:bg-green-800 hover:text-white"
            >
                <p class="font-semibold text-[16px] sm:text-[20px]">
                    FOOTBALL {{ game.title.toUpperCase() }}
                </p>
                <i :class="`mdi mdi-arrow-right`" class="text-2xl"></i>
            </div>
            <div class="flex mt-4 gap-x-2">
                <div
                    class="border-black rounded-md cursor-pointer flex border-[4px] h-10 w-10 items-center justify-center hover:bg-green-800 hover:text-white"
                >
                    <i :class="`mdi mdi-weather-night`" class="text-xl"></i>
                </div>
                <div
                    class="border-black rounded-md cursor-pointer flex border-[4px] h-10 w-10 items-center justify-center hover:bg-green-800 hover:text-white"
                >
                    <i :class="`mdi mdi-cog`" class="text-xl"></i>
                </div>
                <div
                    class="border-black rounded-md cursor-pointer flex border-[4px] h-10 w-10 items-center justify-center hover:bg-green-800 hover:text-white"
                >
                    <i :class="`mdi mdi-book`" class="text-xl"></i>
                </div>
            </div>
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
