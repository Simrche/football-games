<template>
    <div
        class="flex flex-col bg-gray-50 min-h-100vh w-full py-12 gap-6 items-center"
    >
        <div class="w-4/10">
            <b-autocomplete
                class="w-full"
                rounded
                v-model="search"
                :data="filteredPlayers"
                placeholder="Select a player"
                icon="magnify"
                @select="
                    (option) =>
                        option ? selectedPlayers.unshift(option) : undefined
                "
                field="fullname"
            >
                <template #empty>No results found</template>
            </b-autocomplete>
        </div>
        <PlayerRow
            v-for="player in selectedPlayers"
            :key="player.id"
            class="w-4/10"
            :player="player"
            :player-to-guess="playerToGuess"
        />
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "@nuxtjs/composition-api";
import { useSupabase } from "~/utils";
import { Player } from "~/utils/types";

const supabase = useSupabase();

const players = ref<Player[]>([]);
const search = ref<string>("");
const selectedPlayers = ref<Player[]>([]);
const playerToGuess = ref<Player>();

onMounted(async () => {
    await fetchPlayers();

    playerToGuess.value =
        players.value[Math.floor(Math.random() * players.value.length)];
});

async function fetchPlayers() {
    const { data, error } = await supabase.from("players").select();

    players.value = data as Player[];
}

const filteredPlayers = computed(() => {
    return players.value.filter((player) => {
        if (selectedPlayers.value.includes(player)) return false;

        return (
            player.firstname
                ?.toString()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .indexOf(search.value.toLowerCase()) >= 0 ||
            player.lastname
                ?.toString()
                .normalize("NFD")
                .toLowerCase()
                .indexOf(search.value.toLowerCase()) >= 0 ||
            player.fullname
                ?.toString()
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .indexOf(search.value.toLowerCase()) >= 0
        );
    });
});
</script>
