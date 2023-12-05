<template>
    <div v-if="!photoToGuess" class="flex items-center justify-center">
        <AppSpinningBall />
    </div>
    <div
        v-else-if="state === 'playing'"
        class="flex flex-col w-full items-center"
    >
        <div
            class="flex mt-8 w-10/12 items-center justify-center md:w-4/12"
            :class="{
                'blur-10': selectedPlayersCount === 0 && !isLoading,
                'blur-8': selectedPlayersCount === 1 && !isLoading,
                'blur-6': selectedPlayersCount === 2 && !isLoading,
                'blur-4': selectedPlayersCount === 3 && !isLoading,
                'blur-2': selectedPlayersCount === 4 && !isLoading,
            }"
        >
            <img class="w-full" :src="photoToGuess.url" v-if="!isLoading" />
            <AppSpinningBall v-else />
        </div>

        <div
            class="flex flex-col-reverse w-10/12 gap-y-2 gap-x-2 items-center justify-center md:flex-row md:w-5/12"
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

        <div class="flex flex-col mt-8 w-10/12 md:w-5/12">
            <p class="font-bold text-lg">Guesses</p>
            <div class="w-full grid grid-cols-5">
                <div
                    v-for="guess in selectedPlayers"
                    :key="guess.id"
                    class="flex mt-2 items-center justify-center"
                >
                    <img
                        class="h-16 w-16"
                        :src="guess.photo"
                        :alt="guess.fullname"
                    />
                </div>
            </div>
        </div>
    </div>

    <div
        @keyup.native.enter="restart()"
        v-else-if="state === 'win' || state === 'loose'"
        class="flex flex-col w-full items-center justify-center"
    >
        <p class="text-xl md:text-2xl" v-if="state === 'win'">✅ Congrats !</p>
        <p class="text-xl md:text-2xl" v-else>❌ You loose !</p>
        <p class="text-center text-2xl md:text-4xl">
            The player was
            <span class="font-bold">{{ photoToGuess.players.fullname }}</span>
        </p>
        <img
            class="mt-8 w-2/12"
            :src="photoToGuess.url"
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
const photoToGuess = ref<PlayerPhoto & { url: string }>();
const selectedPlayers = ref<Player[]>([]);
const state = ref<"playing" | "win" | "loose">("playing");
const maximumTrials = 5;
const isLoading = ref<boolean>(false);

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
    console.log("player-to-guess", photoToGuess);
    console.log("player-selected", player);
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
    isLoading.value = true;

    if (!playersPhotos.value || !playersPhotos.value.length) {
        const { data } = await supabase
            .from("players_photos")
            .select("*, players(*)");
        playersPhotos.value = data as PlayerPhoto[];
    }

    const selectedPlayer: PlayerPhoto =
        playersPhotos.value[
            Math.floor(Math.random() * playersPhotos.value.length)
        ];

    // requete url
    const { data: data2 } = await supabase.storage
        .from("photos")
        .download(selectedPlayer.photo);

    photoToGuess.value = {
        ...selectedPlayer,
        url: URL.createObjectURL(data2),
    };

    isLoading.value = false;
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
