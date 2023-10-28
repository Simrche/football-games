<template>
    <div
        class="flex flex-col bg-gray-50 min-h-100vh w-full py-12 gap-6 items-center"
        v-if="state === 'playing' && playerToGuess"
    >
        <div class="flex w-4/10 gap-x-2 items-center">
            <div class="border rounded-xl py-2 px-4">
                <p class="text-xl">
                    {{ selectedPlayersCount }}/{{ maximumTrials }}
                </p>
            </div>
            <b-autocomplete
                class="w-full autocomplete"
                rounded
                v-model="search"
                :data="filteredPlayers"
                placeholder="Select a player"
                icon="magnify"
                :clear-on-select="true"
                @select="select($event)"
                field="fullname"
            >
                <template #empty>No results found</template>
            </b-autocomplete>
            <BButton type="is-danger is-light" rounded @click="state = 'loose'">
                Give up
            </BButton>
        </div>
        <PlayerRow
            v-for="player in selectedPlayers"
            :key="player.id"
            class="w-4/10"
            :player="player"
            :player-to-guess="playerToGuess"
        />
    </div>
    <div
        v-else-if="(state === 'win' || state === 'loose') && playerToGuess"
        class="flex flex-col min-h-100vh w-full items-center justify-center"
    >
        <p class="text-2xl" v-if="state === 'win'">✅ Congrats !</p>
        <p class="text-2xl" v-else>❌ You loose !</p>
        <p class="text-4xl">
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
            class="mt-2 w-4/10"
            :show-title="false"
            :player-to-guess="playerToGuess"
        />
        <div class="flex mt-8 w-2/10 justify-center">
            <BButton @click="restart()" type="is-info" rounded size="is-medium">
                Rejouer
            </BButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "@nuxtjs/composition-api";
import { useSupabase } from "~/utils";
import { Player } from "~/utils/types";

const supabase = useSupabase();

const players = ref<Player[]>([]);
const search = ref<string>("");
const selectedPlayers = ref<Player[]>([]);
const playerToGuess = ref<Player>();
const state = ref<"playing" | "win" | "loose">("playing");
const maximumTrials = 10;

const selectedPlayersCount = computed(() => selectedPlayers.value.length);

onMounted(async () => {
    await fetchPlayers();

    pickPlayerToGuess();
});

async function fetchPlayers() {
    const { data, error } = await supabase.from("players").select();

    players.value = data as Player[];
}

const filteredPlayers = computed(() => {
    return players.value.filter((player) => {
        if (selectedPlayers.value.includes(player)) return false;

        return (
            player.firstname
                ?.toString()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .indexOf(search.value.toLowerCase()) >= 0 ||
            player.lastname
                ?.toString()
                .normalize("NFD")
                .toLowerCase()
                .indexOf(search.value.toLowerCase()) >= 0 ||
            player.fullname
                ?.toString()
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .indexOf(search.value.toLowerCase()) >= 0
        );
    });
});

function select(player: Player) {
    if (!player) return;

    search.value = "";

    selectedPlayers.value.unshift(player);

    if (playerToGuess.value && player.id === playerToGuess.value.id) {
        state.value = "win";
        return;
    }

    if (selectedPlayersCount.value >= maximumTrials) {
        state.value = "loose";
        return;
    }
}

function pickPlayerToGuess() {
    playerToGuess.value =
        players.value[Math.floor(Math.random() * players.value.length)];
}

function restart() {
    selectedPlayers.value = [];
    pickPlayerToGuess();
    state.value = "playing";
}
</script>

<style>
input:focus {
    outline-color: transparent;
    outline-style: none;
}
</style>
