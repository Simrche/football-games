<template>
    <WordleConfig
        v-if="state === 'config'"
        :selected-game-mode="selectedGameMode"
        :selected-leagues="selectedLeagues"
        @update:selectedLeagues="selectedLeagues = $event"
        @update:selectedGameMode="selectedGameMode = $event"
        @start="start()"
    />
    <div v-else-if="!playerToGuess" class="flex items-center justify-center">
        <AppSpinningBall />
    </div>
    <Wordle
        v-else-if="state === 'playing'"
        :players="players"
        :player-to-guess="playerToGuess"
        @state="state = $event"
    />
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
import { ref } from "@nuxtjs/composition-api";
import { useSupabase } from "~/utils";
import { leagueNames } from "~/utils/dicts";
import { Player } from "~/utils/types";

const supabase = useSupabase();

const players = ref<Player[]>([]);
const playerToGuess = ref<Player>();
const state = ref<"config" | "playing" | "win" | "loose">("config");

const selectedLeagues = ref<Record<string, boolean>>({
    [leagueNames.ligue1]: true,
    [leagueNames.serieA]: true,
    [leagueNames.premierLeague]: true,
    [leagueNames.bundesliga]: true,
    [leagueNames.laLiga]: true,
});
const selectedGameMode = ref<"normal" | "today">("normal");

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

    if (selectedGameMode.value === "normal") {
        pickPlayerToGuess();
    } else {
        getTodayChallengePlayer();
    }
    state.value = "playing";
}

function restart() {
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
