<template>
    <div
        class="flex flex-col min-h-screen bg-gray-50 w-full py-12 gap-6 items-center"
        v-if="state === 'playing' && playerToGuess"
    >
        <div class="flex w-5/12 gap-x-2 items-center">
            <div class="border rounded-xl py-2 px-4">
                <p class="text-xl">
                    {{ selectedPlayersCount }}/{{ maximumTrials }}
                </p>
            </div>
            <PlayerAutoComplete
                :players="filteredPlayers"
                :model-value="search"
                @update:modelValue="search = $event"
                @select="select($event)"
            />
            <BButton type="is-danger is-light" rounded @click="state = 'loose'">
                Give up
            </BButton>
        </div>
        <PlayerRow
            v-for="player in selectedPlayers"
            :key="player.id"
            class="w-5/12"
            :player="player"
            :player-to-guess="playerToGuess"
        />
    </div>
    <div
        v-else-if="(state === 'win' || state === 'loose') && playerToGuess"
        class="flex flex-col min-h-screen w-full items-center justify-center"
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
            class="mt-2 w-5/12"
            :show-title="false"
            :player-to-guess="playerToGuess"
        />
        <div class="flex mt-8 w-3/12 justify-center">
            <BButton @click="restart()" type="is-info" rounded size="is-medium">
                Restart
            </BButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "@nuxtjs/composition-api";
import { normalizeString, useSupabase } from "~/utils";
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
    const { data } = await supabase.from("players").select();

    players.value = data as Player[];
}

const filteredPlayers = computed(() => {
    return players.value
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

function select(player: Player) {
    if (!player) return;

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
    const playerWithMinimumRate = players.value.filter(
        (player) => player.rate > 81
    );

    playerToGuess.value =
        playerWithMinimumRate[
            Math.floor(Math.random() * playerWithMinimumRate.length)
        ];
}

function restart() {
    selectedPlayers.value = [];
    pickPlayerToGuess();
    state.value = "playing";
}
</script>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
    layout: "app",
});
</script>
