<template>
    <div
        class="flex flex-col gap-y-8 justify-center items-center lg:flex-row lg:gap-x-40"
    >
        <NuxtLink
            to="/blur/logo"
            class="border rounded-lg cursor-pointer flex-col flex font-bold bg-gray-100 w-8/12 group md:w-4/12 hover:shadow-lg"
        >
            <div
                class="bg-center rounded-t-lg bg-[length:100%] h-25vh w-full transition-all group-hover:bg-[length:150%]"
                :style="{
                    'background-image': `url(${require('~/assets/img/app/football_logos.jpeg')})`,
                }"
            ></div>
            <div class="flex h-8vh items-center">
                <h2 class="ml-8">Logos</h2>
            </div>
        </NuxtLink>
        <NuxtLink
            to="/blur/player"
            class="border rounded-lg cursor-pointer flex-col flex font-bold bg-gray-100 w-8/12 group md:w-4/12 hover:shadow-lg"
        >
            <div
                class="bg-center rounded-t-lg bg-[length:100%] h-25vh w-full transition-all group-hover:bg-[length:150%]"
                :style="{
                    'background-image': `url(${require('~/assets/img/app/football_players.jpeg')})`,
                }"
            ></div>
            <div class="flex h-8vh items-center">
                <h2 class="ml-8">Players</h2>
            </div>
        </NuxtLink>
    </div>
</template>
