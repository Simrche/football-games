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
        <Nuxt class="min-h-90vh"></Nuxt>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "@nuxtjs/composition-api";

const router = useRouter();
const route = useRoute();

const games = [
    {
        title: "Wordle",
        path: "wordle",
    },
    {
        title: "Blur",
        path: "blur",
    },
    {
        title: "Logo",
        path: "logo",
    },
];
</script>
