<template>
    <div
        class="flex flex-col mx-auto w-2/3 gap-y-4 items-center justify-center md:gap-y-8 lg:w-1/2"
    >
        <p class="font-semibold text-center text-2xl md:text-6xl">
            FOOTBALL WORDLE
        </p>
        <p class="font-normal text-xl text-green-800 imprima md:text-4xl">
            Game mode
        </p>
        <div class="w-full grid gap-4 grid-cols-1 lg:grid-cols-2">
            <WordleConfigButton
                title="Today's Game"
                :selected="selectedGameMode === 'today'"
                @click.native="$emit('update:selectedGameMode', 'today')"
            />
            <WordleConfigButton
                title="Normal Game"
                :selected="selectedGameMode === 'normal'"
                @click.native="$emit('update:selectedGameMode', 'normal')"
            />
        </div>
        <template v-if="selectedGameMode === 'normal'">
            <p class="font-normal text-xl text-green-800 imprima md:text-4xl">
                Leagues
            </p>
            <div class="w-full grid gap-4 grid-cols-1 lg:grid-cols-2">
                <WordleConfigButton
                    :title="leagueNames.ligue1"
                    :selected="selectedLeagues[leagueNames.ligue1]"
                    img="ligue1.png"
                    @click.native="toggleLeague(leagueNames.ligue1)"
                />
                <WordleConfigButton
                    :title="leagueNames.premierLeague"
                    :selected="selectedLeagues[leagueNames.premierLeague]"
                    img="premierLeague.jpeg"
                    @click.native="toggleLeague(leagueNames.premierLeague)"
                />
                <WordleConfigButton
                    :title="leagueNames.serieA"
                    :selected="selectedLeagues[leagueNames.serieA]"
                    img="serieA.jpeg"
                    @click.native="toggleLeague(leagueNames.serieA)"
                />
                <WordleConfigButton
                    :title="leagueNames.bundesliga"
                    :selected="selectedLeagues[leagueNames.bundesliga]"
                    img="bundesliga.svg"
                    @click.native="toggleLeague(leagueNames.bundesliga)"
                />
                <WordleConfigButton
                    :title="leagueNames.laLiga"
                    :selected="selectedLeagues[leagueNames.laLiga]"
                    img="laLiga.jpeg"
                    @click.native="toggleLeague(leagueNames.laLiga)"
                />
            </div>
        </template>
        <BButton
            class="bg-green-800 shadow-xl text-white hover:text-white"
            @click="$emit('start')"
        >
            Validate
        </BButton>
    </div>
</template>

<script setup lang="ts">
import { leagueNames } from "../../../utils/dicts";
const props = defineProps<{
    selectedGameMode: string;
    selectedLeagues: Record<string, boolean>;
}>();

const emit = defineEmits<{
    (event: "start"): void;
    (event: "update:selectedGameMode", value: string): void;
    (event: "update:selectedLeagues", value: Record<string, boolean>): void;
}>();

function toggleLeague(league: leagueNames) {
    if (
        !props.selectedLeagues[league] &&
        props.selectedLeagues[league] !== false
    )
        return;

    emit("update:selectedLeagues", {
        ...props.selectedLeagues,
        [league]: !props.selectedLeagues[league],
    });
}
</script>
