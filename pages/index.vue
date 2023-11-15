<template>
    <div class="flex flex-col justify-center w-screen gap-8">
        <h1 class="text-center text-3xl font-bold">
            Welcome to Football games !
        </h1>
        <div class="flex flex-col">
            <NuxtLink to="/wordle" class="text-center text-lg hover:underline">
                Try football Wordle
            </NuxtLink>
            <NuxtLink to="/blur" class="text-center text-lg hover:underline">
                Try Blurred games
            </NuxtLink>
            <NuxtLink to="/split" class="text-center text-lg hover:underline">
                Try Split
            </NuxtLink>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
    layout: "app",
});
</script>
