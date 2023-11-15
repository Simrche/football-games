<template>
    <div>
        <div class="min-h-10vh flex items-center bg-gray-200">
            <nav class="gap-8 flex items-center group">
                <img
                    src="~/static/app/football_ball.png"
                    alt="Football ball"
                    class="h-10 w-10 transform rotate-0 group-hover:rotate-45 duration-200 ml-8 cursor-pointer"
                    @click="router.push('/')"
                />
                <p
                    v-for="game in games"
                    :key="game.path"
                    @click="router.push(game.path)"
                    class="cursor-pointer"
                    :class="{
                        'font-bold': route.fullPath.includes(game.path),
                    }"
                >
                    {{ game.title }}
                </p>
            </nav>
        </div>
        <Nuxt class="min-h-90vh bg-gray-50"></Nuxt>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "@nuxtjs/composition-api";

const router = useRouter();
const route = useRoute();

const games = [
    {
        title: "Wordle",
        path: "/wordle",
    },
    {
        title: "Blur",
        path: "/blur",
    },
];
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
