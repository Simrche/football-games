<template>
    <div>
        <div class="font-bold text-center text-lg w-full" v-if="showTitle">
            {{ player.fullname }}
        </div>
        <div
            class="border flex bg-gray-100 border-gray-300 rounded-2xl h-28 mt-2 px-4 items-center justify-around hover:shadow-lg"
        >
            <div v-if="showParts.photo" class="rounded-full h-16 w-16">
                <img
                    class="rounded-full"
                    :src="player.photo"
                    :alt="player.fullname"
                    :title="player.fullname"
                />
            </div>
            <div
                v-if="showParts.league"
                class="rounded-full flex font-bold h-16 w-16 items-center justify-center fadeOpacity"
                :class="{
                    'border-2 border-green-500':
                        player.league_name === playerToGuess.league_name,
                    'border-2 border-red-500':
                        player.league_name !== playerToGuess.league_name,
                }"
            >
                <img
                    class="rounded-full w-1/2"
                    :src="player.league_photo"
                    :alt="player.league_name"
                    :title="player.league_name"
                />
            </div>
            <div class="h-16 w-16" v-else></div>
            <div
                v-if="showParts.team"
                class="rounded-full flex font-bold h-16 w-16 items-center justify-center fadeOpacity"
                :class="{
                    'border-2 border-green-500':
                        player.team_name === playerToGuess.team_name,
                    'border-2 border-red-500':
                        player.team_name !== playerToGuess.team_name,
                }"
            >
                <img
                    class="w-1/2"
                    :src="player.team_photo"
                    :alt="player.team_name"
                    :title="player.team_name"
                />
            </div>
            <div class="h-16 w-16" v-else></div>
            <div
                v-if="showParts.nationality"
                class="rounded-full flex font-bold h-16 w-16 items-center justify-center fadeOpacity"
                :class="{
                    'border-2 border-green-500':
                        player.nationality === playerToGuess.nationality,
                    'border-2 border-red-500':
                        player.nationality !== playerToGuess.nationality,
                }"
            >
                <img
                    class="w-1/2"
                    :src="getNationalityFlagUrl(player.nationality)"
                    alt=""
                />
            </div>
            <div class="h-16 w-16" v-else></div>
            <div
                v-if="showParts.position"
                class="rounded-full flex font-bold h-16 w-16 items-center justify-center fadeOpacity"
                :class="{
                    'border-2 border-green-500':
                        player.position === playerToGuess.position,
                    'border-2 border-red-500':
                        player.position !== playerToGuess.position,
                }"
            >
                {{ positionDict[player.position] }}
            </div>
            <div class="h-16 w-16" v-else></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "@nuxtjs/composition-api";
import { getNationalityFlagUrl } from "~/utils";
import { positionDict } from "~/utils/dicts";
import { Player } from "~/utils/types";

withDefaults(
    defineProps<{
        player: Player;
        playerToGuess: Player;
        showTitle?: boolean;
    }>(),
    {
        showTitle: true,
    }
);

onMounted(() => {
    setTimeout(() => (showParts.value.league = true), 6 * 100);
    setTimeout(() => (showParts.value.team = true), 12 * 100);
    setTimeout(() => (showParts.value.nationality = true), 18 * 100);
    setTimeout(() => (showParts.value.position = true), 24 * 100);
});

const showParts = ref<Record<string, boolean>>({
    photo: true,
    league: false,
    team: false,
    nationality: false,
    position: false,
});
</script>

<style scoped>
.fadeOpacity {
    -webkit-animation: fadein 2s; /* Safari, Chrome and Opera > 12.1 */
    -moz-animation: fadein 2s; /* Firefox < 16 */
    -ms-animation: fadein 2s; /* Internet Explorer */
    -o-animation: fadein 2s; /* Opera < 12.1 */
    animation: fadein 2s;
}

@keyframes fadein {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* Firefox < 16 */
@-moz-keyframes fadein {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* Safari, Chrome and Opera > 12.1 */
@-webkit-keyframes fadein {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* Internet Explorer */
@-ms-keyframes fadein {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

/* Opera < 12.1 */
@-o-keyframes fadein {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}
</style>
