<template>
    <div class="flex flex-col py-12 gap-6 justify-center items-center">
        <div v-for="player in players" :key="player.id" class="w-4/10">
            <div class="font-bold text-center text-lg w-full">
                {{ player.fullname }}
            </div>
            <div
                class="border flex bg-gray-100 border-gray-300 rounded-4xl h-28 mt-2 px-4 items-center justify-around hover:shadow-lg"
            >
                <div class="rounded-full bg-gray-300 h-16 w-16">
                    <img
                        class="rounded-full"
                        :src="player.photo"
                        :alt="player.fullname"
                        :title="player.fullname"
                    />
                </div>
                <div
                    class="rounded-full flex font-bold bg-gray-300 h-16 w-16 items-center justify-center"
                >
                    <img
                        class="rounded-full w-1/2"
                        :src="player.league_photo"
                        :alt="player.league_name"
                        :title="player.league_name"
                    />
                </div>
                <div
                    class="rounded-full flex font-bold bg-gray-300 h-16 w-16 items-center justify-center"
                >
                    <img
                        class="w-1/2"
                        :src="player.team_photo"
                        :alt="player.team_name"
                        :title="player.team_name"
                    />
                </div>
                <div
                    class="rounded-full flex font-bold bg-gray-300 h-16 w-16 items-center justify-center"
                >
                    <img
                        class="w-1/2"
                        :src="`https://media-4.api-sports.io/flags/${
                            iso3311a2.getCode(player.nationality) ??
                            nationalityDict[player.nationality]
                        }.svg`"
                        alt=""
                    />
                </div>
                <div
                    class="rounded-full flex font-bold bg-gray-300 h-16 w-16 items-center justify-center"
                >
                    {{ positionDict[player.position] }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "@nuxtjs/composition-api";
import * as iso3311a2 from "iso-3166-1-alpha-2";
import { uniqBy } from "lodash";
import { useSupabase } from "~/utils";
import { Player } from "~/utils/types";

const supabase = useSupabase();

const players = ref<Player[]>([]);

onMounted(async () => {
    await fetchPlayers();

    console.log(
        uniqBy(players.value, "nationality").map((player) => player.nationality)
    );
});

async function fetchPlayers() {
    const { data, error } = await supabase
        .from("players")
        .select()
        .in("league_name", [
            "Premier League",
            "Ligue 1",
            "Serie A",
            "La Liga",
            "Bundesliga",
        ]);

    players.value = data as Player[];
}

const positionDict: Record<string, string> = {
    Attacker: "FW",
    Midfielder: "MF",
    Defender: "DF",
    Goalkeeper: "GK",
};

const nationalityDict: Record<string, string> = {
    England: "GB",
    "Korea Republic": "KR",
};
</script>
