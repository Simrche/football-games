<template>
    <div v-if="!playersToGuess" class="flex items-center justify-center">
        <AppSpinningBall />
    </div>
    <div
        class="flex flex-col w-full py-12 gap-6 items-center"
        v-else-if="state === 'playing'"
    >
        <div
            class="flex flex-col-reverse w-10/12 gap-y-2 gap-x-2 items-center md:flex-row md:w-5/12"
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
                    @click="state = 'loose'"
                >
                    Give up
                </BButton>
            </div>
        </div>
        <div class="flex w-10/12 justify-center md:w-5/12">
            <div>
                <div
                    class="h-[100px] w-[250px] overflow-hidden"
                    v-for="(player, index) in playersToGuess"
                    :key="player.id"
                    :style="{
                        'background-image': `url(${player.photo})`,
                        'background-repeat': 'no-repeat',
                        'background-position': `${
                            index === 0
                                ? 'top'
                                : index === 1
                                ? 'center'
                                : 'bottom'
                        }`,
                        'background-size': '300px',
                    }"
                ></div>
            </div>
            <div>
                <div
                    v-for="(player, index) in playersToGuess"
                    :key="player.id"
                    class="flex h-[100px] ml-12 items-center"
                >
                    {{ selectedPlayers.includes(player) ? "✅" : "⏳" }}
                </div>
            </div>
        </div>
    </div>
    <div
        v-else-if="state === 'win' || state === 'loose'"
        class="flex flex-col w-full items-center justify-center"
    >
        <p class="text-xl md:text-2xl" v-if="state === 'win'">✅ Congrats !</p>
        <p class="text-xl md:text-2xl" v-else>❌ You loose !</p>
        <p class="text-center text-2xl md:text-4xl">
            The players was
            <span class="font-bold">
                {{ playersToGuess[0].fullname }},
                {{ playersToGuess[1].fullname }},
                {{ playersToGuess[2].fullname }}
            </span>
        </p>
        <div class="flex flex-col mt-8 gap-x-4 md:flex-row">
            <img
                v-for="(player, index) in playersToGuess"
                :key="player.id"
                :src="player?.photo"
                :alt="player?.fullname"
                :title="player?.fullname"
            />
        </div>
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
const playersToGuess = ref<Player[]>();
const state = ref<"playing" | "win" | "loose">("playing");
const maximumTrials = 20;

const selectedPlayersCount = computed(() => selectedPlayers.value.length);

onMounted(async () => {
    await fetchPlayers();

    pickPlayersToGuess();
});

async function fetchPlayers() {
    const { data } = await supabase
        .from("players")
        .select()
        .neq("is_active", false);

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

    if (
        playersToGuess.value?.every((player) =>
            selectedPlayers.value.includes(player)
        )
    ) {
        state.value = "win";
        return;
    }

    if (selectedPlayersCount.value >= maximumTrials) {
        state.value = "loose";
        return;
    }
}

function pickPlayersToGuess() {
    playersToGuess.value = [];

    const playerWithMinimumRate = players.value.filter(
        (player) => player.rate > 81
    );

    for (let index = 0; index < 3; index++) {
        playersToGuess.value.push(
            playerWithMinimumRate[
                Math.floor(Math.random() * playerWithMinimumRate.length)
            ]
        );
    }
}

function restart() {
    selectedPlayers.value = [];
    pickPlayersToGuess();
    state.value = "playing";
}
</script>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
    layout: "app",
});
</script>
