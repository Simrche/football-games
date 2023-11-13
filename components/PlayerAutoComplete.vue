<template>
    <b-autocomplete
        class="w-full"
        rounded
        v-model="search"
        :data="players"
        placeholder="Select a player"
        icon="magnify"
        field="fullname"
        :clear-on-select="true"
        @select="$emit('select', $event)"
    >
        <template slot-scope="player">
            <div class="flex gap-2 items-center">
                <img
                    :src="player.option.photo"
                    class="rounded-full h-12 w-12"
                    :alt="player.option.fullname"
                />
                <div>
                    <p class="font-bold text-md">
                        {{ player.option.fullname }} ({{
                            positionDict[player.option.position]
                        }})
                    </p>
                    <div class="flex gap-2 items-center">
                        <img
                            :src="
                                getNationalityFlagUrl(player.option.nationality)
                            "
                            class="h-4 w-4"
                            :alt="player.option.nationality"
                        />
                        <img
                            :src="player.option.team_photo"
                            class="h-4 w-4"
                            :alt="player.option.team_name"
                        />
                        <p>{{ player.option.team_name }}</p>
                    </div>
                </div>
            </div>
        </template>
        <template #empty>No results found</template>
    </b-autocomplete>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { getNationalityFlagUrl } from "~/utils";
import { positionDict } from "~/utils/dicts";
import { Player } from "~/utils/types";

const props = defineProps<{
    players: Player[];
    modelValue: string;
}>();

const emit = defineEmits<{
    (event: "select", value: Player): void;
    (event: "update:modelValue", value: string): void;
}>();

const search = computed<string>({
    get() {
        return props.modelValue;
    },
    set(str: string) {
        emit("update:modelValue", str);
    },
});
</script>
