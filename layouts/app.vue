<template>
    <div>
        <div class="flex bg-gray-200 min-h-10vh items-center">
            <nav class="flex w-screen px-8 items-center justify-between">
                <div class="flex gap-8 items-center group">
                    <img
                        src="~/static/app/football_ball.png"
                        alt="Football ball"
                        class="cursor-pointer h-10 transform w-10 rotate-0 duration-200 group-hover:rotate-45"
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
                </div>

                <p
                    v-if="isAdmin"
                    @click="router.push('/admin')"
                    class="cursor-pointer"
                    :class="{
                        'font-bold': route.fullPath.includes('/admin'),
                    }"
                >
                    Admin
                </p>
            </nav>
        </div>
        <Nuxt class="min-h-90vh"></Nuxt>
    </div>
</template>

<script setup lang="ts">
import { computed, useRoute, useRouter } from "@nuxtjs/composition-api";
import { getData } from "nuxt-storage/local-storage";
import { games } from "~/utils/dicts";

const router = useRouter();
const route = useRoute();

const isAdmin = computed(() => {
    return (
        getData("secretKey") &&
        getData("secretKey").value === process.env.secretKey
    );
});
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
