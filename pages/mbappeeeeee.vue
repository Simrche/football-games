<template>
    <div>
        <section>
            <img ref="bg" id="bg" src="~/static/app/field.png" />
            <img id="text" ref="textEl" src="~/static/app/mbappe.png" />
            <h1 id="football" class="text-[56px] lg:text-[124px]">
                FOOTBALL <br />
                GAMES
            </h1>
        </section>
        <!-- <div class="flex flex-col h-screen w-screen gap-8 justify-center">
            <h1 class="font-bold text-center text-3xl">
                Welcome to Football games !
            </h1>
            <div class="flex flex-col">
                <NuxtLink
                    to="/wordle"
                    class="text-center text-lg hover:underline"
                >
                    Try football Wordle
                </NuxtLink>
                <NuxtLink
                    to="/blur"
                    class="text-center text-lg hover:underline"
                >
                    Try Blurred games
                </NuxtLink>
                <NuxtLink
                    to="/split"
                    class="text-center text-lg hover:underline"
                >
                    Try Split
                </NuxtLink>
            </div>
        </div> -->
    </div>
</template>

<script setup lang="ts">
import { ref } from "@nuxtjs/composition-api";

const bg = ref<HTMLImageElement>();
const textEl = ref<HTMLTitleElement>();

window.addEventListener("scroll", () => {
    if (!bg.value || !textEl.value) return;

    const value = window.scrollY;

    bg.value.style.top = value * 1 + "px";
    textEl.value.style.top = value * 1.2 - 400 + "px";
    textEl.value.style.left = -(value * 1) + 340 + "px";
});
</script>

<style scoped>
h1 {
    font-family: "verdana";
}

section {
    position: relative;
    width: 100%;
    height: 200vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient();
}

section img {
    position: absolute;
    top: -340px;
    left: 400px;
    height: 100vh;
    pointer-events: none;
}

section #bg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    pointer-events: none;
    z-index: -2;
}

section #football {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    margin: 32px 0 0 32px;
    color: #fff;
}

#text {
    position: relative;
    color: #fff;
    z-index: 1;
}

#bg {
    z-index: 2;
}
</style>
