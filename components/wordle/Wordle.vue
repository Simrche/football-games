<template>
    <div class="flex flex-col w-full py-12 gap-6 items-center">
        <div
            class="flex flex-col-reverse w-10/12 gap-y-2 gap-x-2 items-center md:flex-row md:w-8/12 lg:w-5/12"
        >
            <PlayerAutoComplete
                class="w-full"
                :players="filteredPlayers"
                :model-value="search"
                @update:modelValue="search = $event"
                @select="select($event)"
            />
            <div
                class="flex w-full gap-x-2 items-center justify-between md:w-fit md:justify-normal"
            >
                <div class="border rounded-xl py-2 px-4">
                    <p class="text-xl">
                        {{ selectedPlayersCount }}/{{ maximumTrials }}
                    </p>
                </div>
                <BButton
                    type="is-danger is-light"
                    rounded
                    @click="$emit('state', 'loose')"
                >
                    Give up
                </BButton>
                <BButton
                    type="is-light"
                    rounded
                    @click="$emit('state', 'config')"
                >
                    Menu
                </BButton>
            </div>
        </div>
        <PlayerRow
            v-for="player in selectedPlayers"
            :key="player.id"
            class="w-10/12 md:w-8/12 lg:w-5/12"
            :player="player"
            :player-to-guess="playerToGuess"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "@nuxtjs/composition-api";
import { normalizeString } from "~/utils";
import { Player } from "~/utils/types";

const emit = defineEmits<{
    (event: "state", value: "loose" | "config" | "win"): void;
}>();

const props = defineProps<{
    playerToGuess: Player;
    players: Player[];
}>();

const selectedPlayers = ref<Player[]>([]);
const search = ref<string>("");
const selectedPlayersCount = computed(() => selectedPlayers.value.length);

const maximumTrials = 10;

function select(player: Player) {
    if (!player) return;

    selectedPlayers.value.unshift(player);

    if (props.playerToGuess && player.id === props.playerToGuess.id) {
        emit("state", "win");
        return;
    }

    if (selectedPlayersCount.value >= maximumTrials) {
        emit("state", "loose");
        return;
    }
}

const filteredPlayers = computed(() => {
    return props.players
        .filter((player) => {
            if (selectedPlayers.value.includes(player)) return false;

            return (
                player.firstname
                    ?.toString()
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .indexOf(search.value.toLowerCase()) >= 0 ||
                player.lastname
                    ?.toString()
                    .toLowerCase()
                    .indexOf(search.value.toLowerCase()) >= 0 ||
                player.fullname
                    ?.toString()
                    .toLowerCase()
                    .indexOf(search.value.toLowerCase()) >= 0 ||
                normalizeString(player.firstname?.toString())
                    .toLowerCase()
                    .indexOf(search.value.toLowerCase()) >= 0 ||
                normalizeString(player.lastname?.toString())
                    .toLowerCase()
                    .indexOf(search.value.toLowerCase()) >= 0 ||
                normalizeString(player.fullname?.toString())
                    .toLowerCase()
                    .indexOf(search.value.toLowerCase()) >= 0
            );
        })
        .splice(0, 15);
});
</script>
