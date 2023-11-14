<template>
    <div
        v-if="photoToGuess && state === 'playing'"
        class="flex flex-col items-center w-full"
    >
        <div
            class="w-72 h-72 flex items-center justify-center mt-8"
            :class="{
                'blur-10': selectedPlayersCount === 0,
                'blur-8': selectedPlayersCount === 1,
                'blur-6': selectedPlayersCount === 2,
                'blur-4': selectedPlayersCount === 3,
                'blur-2': selectedPlayersCount === 4,
            }"
        >
            <img
                :src="require(`~/assets/img/blur/${photoToGuess.photo}.jpg`)"
            />
        </div>

        <div class="flex w-5/12 gap-x-2 items-center justify-center">
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

        <div class="mt-8 flex flex-col w-5/12">
            <p class="text-lg font-bold">Guesses</p>
            <div class="w-full grid grid-cols-5">
                <div
                    v-for="guess in selectedPlayers"
                    :key="guess.id"
                    class="flex items-center justify-center mt-2"
                >
                    <img
                        class="w-16 h-16"
                        :src="guess.photo"
                        :alt="guess.fullname"
                    />
                </div>
            </div>
        </div>
    </div>

    <div
        v-else-if="(state === 'win' || state === 'loose') && photoToGuess"
        class="flex flex-col min-h-screen w-full items-center justify-center"
    >
        <p class="text-2xl" v-if="state === 'win'">✅ Congrats !</p>
        <p class="text-2xl" v-else>❌ You loose !</p>
        <p class="text-4xl">
            The player was
            <span class="font-bold">{{ photoToGuess.players.fullname }}</span>
        </p>
        <img
            class="mt-8 w-2/12"
            :src="require(`~/assets/img/blur/${photoToGuess.photo}.jpg`)"
            :alt="photoToGuess.players.fullname"
            :title="photoToGuess.players.fullname"
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
import { Player, PlayerPhoto } from "~/utils/types";

const supabase = useSupabase();

const players = ref<Player[]>([]);
const playersPhotos = ref<PlayerPhoto[]>([]);
const search = ref<string>("");
const photoToGuess = ref<PlayerPhoto>();
const selectedPlayers = ref<Player[]>([]);
const state = ref<"playing" | "win" | "loose">("playing");
const maximumTrials = 5;

const selectedPlayersCount = computed(() => selectedPlayers.value.length);

onMounted(async () => {
    await fetchPlayers();

    pickPhoto();
});

async function fetchPlayers() {
    const { data } = await supabase.from("players").select();
    players.value = data as Player[];
}

function select(player: Player) {
    if (!player) return;

    selectedPlayers.value.unshift(player);

    if (photoToGuess.value && player.id === photoToGuess.value.player_id) {
        state.value = "win";
        search.value = "";
        return;
    }

    if (selectedPlayersCount.value >= maximumTrials) {
        state.value = "loose";
        search.value = "";
        return;
    }
}

async function pickPhoto() {
    const { data } = await supabase
        .from("players_photos")
        .select("*, players(*)");
    playersPhotos.value = data as PlayerPhoto[];

    photoToGuess.value =
        playersPhotos.value[
            Math.floor(Math.random() * playersPhotos.value.length)
        ];
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

function restart() {
    selectedPlayers.value = [];
    pickPhoto();
    state.value = "playing";
}
</script>
