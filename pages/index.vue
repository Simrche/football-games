<template>
    <div class="flex flex-col justify-center w-screen">
        <h1 class="text-center mt-28 text-3xl font-bold">
            Welcome to Football games !
        </h1>
        <NuxtLink
            to="/wordle"
            class="text-center mt-28 text-lg hover:underline"
            >Try football Wordle</NuxtLink
        >
        <NuxtLink
            to="/logo"
            class="text-center text-lg hover:underline"
            >Try Blurred logos</NuxtLink
        >
        <NuxtLink
            to="/blur"
            class="text-center text-lg hover:underline"
            >Try Blurred players</NuxtLink
        >
    </div>
</template>
