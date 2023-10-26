<template>
    <div class="flex flex-col mt-12 gap-8 justify-center items-center">
        <div
            v-for="player in players"
            :key="player.id"
            class="border flex bg-gray-100 border-gray-300 rounded-4xl h-28 px-4 w-4/10 items-center justify-around hover:shadow-lg"
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
                {{ player.nationality.toUpperCase().slice(0, 2) }}
            </div>
            <div
                class="rounded-full flex font-bold bg-gray-300 h-16 w-16 items-center justify-center"
            >
                {{ player.age }}
            </div>
            <div
                class="rounded-full flex font-bold bg-gray-300 h-16 w-16 items-center justify-center"
            >
                <img
                    class="rounded-full w-2/4"
                    :src="player.league_photo"
                    :alt="player.league_name"
                    :title="player.league_name"
                />
            </div>
            <div
                class="rounded-full flex font-bold bg-gray-300 h-16 w-16 items-center justify-center"
            >
                {{ positionDict[player.position] }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "@nuxtjs/composition-api";
import { uniqBy } from "lodash";
import { useSupabase } from "~/utils";
import { Player } from "~/utils/types";

const supabase = useSupabase();

console.log(supabase);

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
</script>
