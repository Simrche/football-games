<template>
    <div
        class="justify-center items-center gap-y-8 flex flex-col lg:flex-row lg:gap-x-40"
    >
        <NuxtLink
            to="/blur/logo"
            class="flex-col w-8/12 md:w-4/12 bg-gray-100 rounded-lg flex font-bold cursor-pointer border hover:shadow-lg group"
        >
            <div
                class="w-full h-20vh bg-center bg-[length:100%] group-hover:bg-[length:150%] transition-all rounded-t-lg"
                :style="{
                    'background-image': `url(${require('~/static/app/football_logos.jpeg')})`,
                }"
            ></div>
            <div class="h-8vh flex items-center">
                <h2 class="ml-8">Logos</h2>
            </div>
        </NuxtLink>
        <NuxtLink
            to="/blur/player"
            class="flex-col w-8/12 md:w-4/12 bg-gray-100 rounded-lg flex font-bold cursor-pointer border hover:shadow-lg group"
        >
            <div
                class="w-full h-20vh bg-center bg-[length:100%] group-hover:bg-[length:150%] transition-all rounded-t-lg"
                :style="{
                    'background-image': `url(${require('~/static/app/football_players.jpeg')})`,
                }"
            ></div>
            <div class="h-8vh flex items-center">
                <h2 class="ml-8">Players</h2>
            </div>
        </NuxtLink>
    </div>
</template>
