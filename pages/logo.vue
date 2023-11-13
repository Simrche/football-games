<template>
    <div
        v-if="logoToGuess && state === 'playing'"
        class="flex flex-col items-center w-full"
    >
        <div
            class="w-72 h-72 flex items-center justify-center mt-8"
            :class="{
                'blur-xl': guesses.length === 0,
                'blur-lg': guesses.length === 1,
                'blur-md': guesses.length === 2,
                blur: guesses.length === 3,
                'blur-sm': guesses.length === 4,
            }"
        >
            <img :src="logoToGuess.team_photo" />
        </div>
        <div class="flex w-5/12 gap-x-2 items-center justify-center">
            <div class="border rounded-xl py-2 px-4">
                <p class="text-xl">{{ guessesCount }}/{{ maximumTrials }}</p>
            </div>
            <BAutocomplete
                class="w-5/12"
                v-model="search"
                :data="filteredLogos"
                placeholder="Select a logo"
                icon="magnify"
                :clear-on-select="true"
                @select="select($event)"
            >
                <template slot-scope="logo">
                    <div class="flex gap-2 items-center">
                        <img
                            :src="logo.option.league_country_flag"
                            class="h-4 w-4"
                            :alt="logo.option.team_name"
                        />
                        <p>{{ logo.option.team_name }}</p>
                    </div>
                </template>
                <template #empty>No results found</template></BAutocomplete
            >
            <BButton type="is-danger is-light" rounded @click="state = 'loose'">
                Give up
            </BButton>
        </div>
        <div class="mt-8 flex flex-col w-5/12">
            <p class="text-lg font-bold">Guesses</p>
            <div class="w-full grid grid-cols-5">
                <div
                    v-for="guess in guesses"
                    :key="guess.team_name"
                    class="flex items-center justify-center mt-2"
                >
                    <img
                        class="w-16 h-16"
                        :src="guess.team_photo"
                        :alt="logoToGuess.team_name"
                    />
                </div>
            </div>
        </div>
    </div>
    <div
        v-else-if="(state === 'win' || state === 'loose') && logoToGuess"
        class="flex flex-col min-h-screen w-full items-center justify-center"
    >
        <p class="text-2xl" v-if="state === 'win'">✅ Congrats !</p>
        <p class="text-2xl" v-else>❌ You loose !</p>
        <p class="text-4xl">
            The team was
            <span class="font-bold">{{ logoToGuess?.team_name }}</span>
        </p>
        <img
            class="mt-8 w-2/12"
            :src="logoToGuess?.team_photo"
            :alt="logoToGuess?.team_name"
            :title="logoToGuess?.team_name"
        />
        <div class="flex mt-8 w-3/12 justify-center">
            <BButton @click="restart()" type="is-info" rounded size="is-medium">
                Restart
            </BButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "@nuxtjs/composition-api";
import { uniqBy } from "lodash";
import { normalizeString, useSupabase } from "~/utils";

type Logo = {
    team_name: string;
    team_photo: string;
    league_country_flag: string;
};

const supabase = useSupabase();

onMounted(async () => {
    await fetchLogos();

    pickLogoToGuess();
});

const logos = ref<Logo[]>([]);
const logoToGuess = ref<Logo>();
const guesses = ref<Logo[]>([]);
const search = ref("");
const maximumTrials = 5;
const state = ref<"playing" | "win" | "loose">("playing");

const guessesCount = computed(() => guesses.value.length);

const filteredLogos = computed(() => {
    return logos.value.filter(
        (logo) =>
            logo.team_name
                ?.toString()
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .indexOf(search.value.toLowerCase()) >= 0 ||
            normalizeString(logo.team_name?.toString())
                .toLowerCase()
                .indexOf(search.value.toLowerCase()) >= 0
    );
});

async function fetchLogos() {
    const { data } = await supabase
        .from("players")
        .select("team_name, team_photo, league_country_flag");

    logos.value = uniqBy(data, "team_name") as Logo[];
}

function pickLogoToGuess() {
    logoToGuess.value =
        logos.value[Math.floor(Math.random() * logos.value.length)];
}

function select(logo: Logo) {
    if (!logo) return;

    guesses.value.push(logo);

    if (logoToGuess.value && logo.team_name === logoToGuess.value.team_name) {
        state.value = "win";
        search.value = "";
        return;
    }

    if (guessesCount.value >= maximumTrials) {
        state.value = "loose";
        return;
    }
}

function restart() {
    guesses.value = [];
    pickLogoToGuess();
    state.value = "playing";
}
</script>
