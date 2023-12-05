<template>
    <div
        v-if="state === 'config'"
        class="flex flex-col items-center justify-center"
    >
        <div class="flex flex-col gap-y-4">
            <p class="font-bold text-md">Game mode</p>
            <label for="today" class="cursor-pointer flex gap-2 items-center">
                <input
                    type="radio"
                    v-model="selectedGameMode"
                    name="gameMode"
                    id="today"
                    value="today"
                    class="cursor-pointer"
                />
                <p>Today's game</p>
            </label>
            <label for="normal" class="cursor-pointer flex gap-2 items-center">
                <input
                    type="radio"
                    v-model="selectedGameMode"
                    name="gameMode"
                    id="normal"
                    value="normal"
                    class="cursor-pointer"
                />
                <p>Normal game</p>
            </label>
            <template v-if="selectedGameMode === 'normal'">
                <p class="font-bold text-md">Leagues</p>
                <UiCheckbox
                    :model-value="selectedLeagues.ligue1"
                    @update:modelValue="
                        selectedLeagues[leagueNames.ligue1] = $event
                    "
                >
                    Ligue 1
                </UiCheckbox>
                <UiCheckbox
                    :model-value="selectedLeagues.premierLeague"
                    @update:modelValue="
                        selectedLeagues[leagueNames.premierLeague] = $event
                    "
                >
                    Premier League
                </UiCheckbox>
                <UiCheckbox
                    :model-value="selectedLeagues.serieA"
                    @update:modelValue="
                        selectedLeagues[leagueNames.serieA] = $event
                    "
                >
                    Serie A
                </UiCheckbox>
                <UiCheckbox
                    :model-value="selectedLeagues.laLiga"
                    @update:modelValue="
                        selectedLeagues[leagueNames.laLiga] = $event
                    "
                >
                    La Liga
                </UiCheckbox>
                <UiCheckbox
                    :model-value="selectedLeagues.bundesliga"
                    @update:modelValue="
                        selectedLeagues[leagueNames.bundesliga] = $event
                    "
                >
                    Bundesliga
                </UiCheckbox>
            </template>
            <BButton type="is-info" rounded @click="start()">
                Validate
            </BButton>
        </div>
    </div>
    <div v-else-if="!playerToGuess" class="flex items-center justify-center">
        <SpinningBall />
    </div>
    <div
        class="flex flex-col w-full py-12 gap-6 items-center"
        v-else-if="state === 'playing'"
    >
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
                    @click="state = 'loose'"
                >
                    Give up
                </BButton>
                <BButton type="is-light" rounded @click="state = 'config'">
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
    <div
        v-else-if="state === 'win' || state === 'loose'"
        class="flex flex-col w-full items-center justify-center"
    >
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
            <BButton @click="restart()" type="is-info" rounded size="is-medium">
                Restart
            </BButton>
            <BButton
                type="is-light"
                rounded
                @click="state = 'config'"
                size="is-medium"
            >
                Menu
            </BButton>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "@nuxtjs/composition-api";
import { normalizeString, useSupabase } from "~/utils";
import { leagueNames } from "~/utils/dicts";
import { Player } from "~/utils/types";

const supabase = useSupabase();

const players = ref<Player[]>([]);
const search = ref<string>("");
const selectedPlayers = ref<Player[]>([]);
const playerToGuess = ref<Player>();
const state = ref<"config" | "playing" | "win" | "loose">("config");
const maximumTrials = 10;

const selectedLeagues = ref<Record<string, boolean>>({
    [leagueNames.ligue1]: true,
    [leagueNames.serieA]: true,
    [leagueNames.premierLeague]: true,
    [leagueNames.bundesliga]: true,
    [leagueNames.laLiga]: true,
});
const selectedGameMode = ref<"normal" | "today">("normal");

const selectedPlayersCount = computed(() => selectedPlayers.value.length);

async function fetchPlayers() {
    if (selectedGameMode.value === "normal") {
        const { data } = await supabase
            .from("players")
            .select()
            .neq("is_active", false)
            .in(
                "league_name",
                Object.keys(selectedLeagues.value).filter(
                    (league) => selectedLeagues.value[league]
                )
            );

        players.value = data as Player[];
    } else {
        const { data } = await supabase
            .from("players")
            .select()
            .neq("is_active", false);

        players.value = data as Player[];
    }
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
        search.value = "";
        return;
    }

    if (selectedPlayersCount.value >= maximumTrials) {
        state.value = "loose";
        search.value = "";
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

async function getTodayChallengePlayer() {
    const { data } = await supabase.from("games").select().eq("name", "wordle");

    if (!data) return;

    const { data: player } = await supabase
        .from("players")
        .select()
        .eq("id", data[0].today_challenge_data.player_id);

    if (!player) return;

    playerToGuess.value = player[0];
}

async function start() {
    await fetchPlayers();
    selectedPlayers.value = [];

    if (selectedGameMode.value === "normal") {
        pickPlayerToGuess();
    } else {
        getTodayChallengePlayer();
    }
    state.value = "playing";
}

function restart() {
    selectedPlayers.value = [];
    if (selectedGameMode.value === "normal") {
        pickPlayerToGuess();
    } else {
        getTodayChallengePlayer();
    }
    state.value = "playing";
}
</script>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
    layout: "app",
});
</script>
