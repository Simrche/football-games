<template>
    <div class="flex justify-center items-center gap-x-40">
        <div class="w-25vw bg-gray-100 rounded-lg border">
            <h2 class="p-3 border-b-2 font-bold">Add player image</h2>
            <div class="w-10/12 mx-auto my-3">
                <PlayerAutoComplete
                    :players="filteredPlayers"
                    :clear-on-select="false"
                    :model-value="search"
                    :rounded="false"
                    @update:modelValue="search = $event"
                    @select="select($event)"
                />
            </div>
            <b-field class="w-10/12 mx-auto">
                <b-upload
                    v-model="filesSelected"
                    multiple
                    drag-drop
                    expanded
                    rounded=""
                >
                    <section class="section p-0">
                        <div class="content has-text-centered">
                            <p class="mb-0">
                                <b-icon icon="upload" size="is-medium">
                                </b-icon>
                            </p>
                            <p class="text-xs">
                                Drop your files here or click to upload
                            </p>
                        </div>
                    </section>
                </b-upload>
            </b-field>
            <div class="tags w-10/12 mx-auto">
                <span
                    v-for="(file, index) in filesSelected"
                    :key="index"
                    class="tag is-primary"
                >
                    {{ file.name }}
                    <button
                        class="delete is-small"
                        type="button"
                        @click="deleteDropFile(index)"
                    ></button>
                </span>
            </div>

            <b-button
                class="w-10/12 flex mx-auto mb-3 bg-purple-800 text-white"
                label="Add image"
                @click="addImage()"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "@nuxtjs/composition-api";
import { normalizeString, useSupabase } from "~/utils";
import { Player } from "~/utils/types";
import { ToastProgrammatic } from "buefy";

const supabase = useSupabase();

const filesSelected = ref<File[]>([]);
const players = ref<Player[]>([]);
const playerSelected = ref<Player>();
const search = ref<string>("");

function deleteDropFile(index: number) {
    filesSelected.value.splice(index, 1);
}

onMounted(async () => {
    await fetchPlayers();
});

async function fetchPlayers() {
    const { data } = await supabase.from("players").select();
    players.value = data as Player[];
}

const filteredPlayers = computed(() => {
    return players.value
        .filter((player) => {
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
    playerSelected.value = player;
}

function selectFile(file: any) {
    filesSelected.value = file.target.files[0];
}

async function addImage() {
    if (!filesSelected.value || !filesSelected.value.length) {
        ToastProgrammatic.open({
            message: "Please select an image",
            type: "is-danger",
            pauseOnHover: true,
        });
        return;
    } else if (!playerSelected.value) {
        ToastProgrammatic.open({
            message: "Please select a player",
            type: "is-danger",
            pauseOnHover: true,
        });
        return;
    }

    for (const file of filesSelected.value) {
        const { data, error } = await supabase.storage
            .from("photos")
            .upload(file.name, file, {
                upsert: false,
            });

        if (error) {
            ToastProgrammatic.open({
                message: error.message,
                type: "is-danger",
                pauseOnHover: true,
            });
            continue;
        }

        const { error: errorbis } = await supabase
            .from("players_photos")
            .insert([
                {
                    player_id: playerSelected.value.id,
                    photo: data.path,
                },
            ]);

        if (errorbis) {
            ToastProgrammatic.open({
                message: errorbis.message,
                type: "is-danger",
                pauseOnHover: true,
            });
            continue;
        }

        ToastProgrammatic.open({
            message: data.path + " added",
            type: "is-success",
            pauseOnHover: true,
        });
    }
}
</script>
