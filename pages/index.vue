<template>
    <div class="flex flex-wrap mt-12 gap-8 justify-center items-center">
        <div
            v-for="player in players"
            :key="player.id"
            class="border flex bg-gray-100 border-gray-300 rounded-4xl h-28 px-4 w-64 justify-between hover:shadow-lg"
        >
            <div class="flex w-3/10 items-center justify-center">
                <img
                    class="w-9/10"
                    :src="player.photo"
                    :alt="player.fullname"
                    :title="player.fullname"
                />
            </div>
            <div class="flex flex-col ml-2 w-7/10 justify-center">
                <p class="text-md">
                    {{ player.fullname }}
                </p>
                <div class="flex">
                    <img class="h-5 w-5" :src="player.team_photo" alt="" />
                    <p class="text-sm ml-2">
                        {{ player.team_name }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "@nuxtjs/composition-api";
import { useSupabase } from "~/utils";
import { Player } from "~/utils/types";

const supabase = useSupabase();

console.log(supabase);

const players = ref<Player[]>([]);

onMounted(async () => {
    await fetchPlayers();
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

    players.value = data;
}
</script>
