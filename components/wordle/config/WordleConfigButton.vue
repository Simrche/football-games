<template>
    <div
        class="rounded-lg cursor-pointer flex border-[5px] w-full pl-2 items-center"
        :class="{
            'bg-green-800': selected,
            'border-black': !selected,
            'border-green-800': selected,
            'text-white': selected,
        }"
        @click="$emit('update:selectedGameMode', 'today')"
    >
        <div
            class="rounded-md flex border-2 h-8 shadow-xl w-8 items-center justify-center"
            :class="{
                'text-white': selected,
                'border-white': selected,
                'border-black': !selected,
            }"
        >
            <i v-if="selected" class="text-xl mdi mdi-check"></i>
        </div>
        <div class="flex h-full w-full justify-between" v-if="img">
            <p class="font-semibold text-xl ml-4 py-2">{{ title }}</p>
            <div
                :style="{
                    'background-image': `url(${require('~/assets/img/leagues/' +
                        img)})`,
                    'background-position': '0 center',
                }"
                class="bg-cover border-black h-full bg-red-500 border-l-2 w-1/3"
            ></div>
        </div>
        <p v-else class="font-semibold text-xl ml-4 py-2">{{ title }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    selected: boolean;
    title: string;
    img?: string;
}>();
</script>
