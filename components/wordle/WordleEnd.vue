<template>
    <div class="flex flex-col w-full items-center justify-center">
        <p class="text-xl md:text-2xl" v-if="state === 'win'">✅ Congrats !</p>
        <p class="text-xl md:text-2xl" v-else>❌ You loose !</p>
        <p class="text-center text-2xl md:text-4xl">
            The player was
            <span class="font-bold">{{ playerToGuess?.fullname }}</span>
        </p>
        <img
            class="mt-8"
            :src="playerToGuess?.photo"
            :alt="playerToGuess?.fullname"
            :title="playerToGuess?.fullname"
        />
        <PlayerRow
            :player="playerToGuess"
            class="mt-2 w-10/12 lg:w-5/12"
            :show-title="false"
            :player-to-guess="playerToGuess"
        />
        <div class="flex mt-8 w-3/12 gap-4 justify-center">
            <BButton
                @click="$emit('restart')"
                type="is-info"
                rounded
                size="is-medium"
            >
                Restart
            </BButton>
            <BButton
                type="is-light"
                rounded
                @click="$emit('state', 'config')"
                size="is-medium"
            >
                Menu
            </BButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Player } from "~/utils/types";

const emit = defineEmits<{
    (event: "state", value: "loose" | "config" | "win"): void;
    (event: "restart"): void;
}>();

defineProps<{
    state: string;
    playerToGuess: Player;
}>();
</script>
