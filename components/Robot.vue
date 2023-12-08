<template>
    <div class="z-30 absolute">
        <div
            v-if="open"
            class="bg-white border flex flex-col rounded-2xl h-96 p-4 right-5 bottom-20 w-72 fixed justify-between"
        >
            <div class="h-80">
                <p class="font-bold h-8 text-md">{{ title }}</p>
                <div
                    class="flex flex-col h-64 mt-2 gap-y-4 overflow-y-scroll"
                    ref="feedDiv"
                >
                    <div
                        v-for="message in feed"
                        :key="message.id"
                        class="max-w-64"
                    >
                        <div v-if="message.isUser" class="flex flex-col">
                            <div class="flex gap-x-2 items-center">
                                <img
                                    src="~/assets/profil.png"
                                    class="rounded-full h-8 w-8"
                                />
                                <p class="rounded-md bg-gray-200 text-xs p-2">
                                    {{ message.text }}
                                </p>
                            </div>
                        </div>
                        <div v-else class="flex flex-col items-end">
                            <div class="flex gap-x-2 items-center">
                                <p class="rounded-md bg-gray-200 text-xs p-2">
                                    {{ message.text }}
                                </p>
                                <img
                                    src="~/assets/robot.png"
                                    class="rounded-full h-8 w-8"
                                />
                            </div>
                        </div>
                    </div>
                    <div v-if="completing" class="flex flex-col items-end">
                        <div class="flex gap-x-2 items-center">
                            <div
                                class="rounded-md flex bg-gray-200 text-xs p-2 gap-x-2"
                            >
                                <div
                                    class="rounded-full bg-gray-400 h-2 w-2"
                                ></div>
                                <div
                                    class="rounded-full bg-gray-400 h-2 w-2"
                                ></div>
                                <div
                                    class="rounded-full bg-gray-400 h-2 w-2"
                                ></div>
                            </div>
                            <img
                                src="~/assets/robot.png"
                                class="rounded-full h-8 w-8"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex h-16 gap-x-2 items-end">
                <input
                    v-model="message"
                    type="text"
                    class="rounded-md border-2 border-gray-300 h-10 text-xs w-full p-2"
                />
                <button
                    class="rounded-md flex bg-slate-200 h-10 text-white w-12 items-center justify-center"
                    @click="createMessage()"
                >
                    <img src="~/assets/envoyer.png" class="w-6" />
                </button>
            </div>
        </div>
        <div
            class="rounded-full cursor-pointer flex bg-slate-400 h-12 text-white right-5 bottom-5 w-12 fixed items-center justify-center"
        >
            <img @click="open = !open" src="~/assets/robot.png" class="w-8" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, useContext } from "@nuxtjs/composition-api";

const { $openai } = useContext();

type Message = {
    id: number;
    text: string;
    isUser: boolean;
};

const props = withDefaults(
    defineProps<{
        title?: string;
        envVarName: string;
        firstMessage?: string;
    }>(),
    {
        title: "Comment puis-je vous aider ?",
        firstMessage: "Comment puis-je vous aider ?",
    }
);

onMounted(() => {
    scrollToBottomOfFeed();
});

const open = ref(false);
const message = ref("");
const feedDiv = ref<HTMLDivElement>();
const completing = ref(false);

async function createMessage() {
    if (!message.value) return;

    feed.value.push({ text: message.value, isUser: true, id: Math.random() });

    message.value = "";

    setTimeout(() => {
        scrollToBottomOfFeed();
    }, 100);

    console.log("start response");

    console.log($openai);

    completing.value = true;

    const gptResponse = await $openai.complete({
        engine: "davinci",
        prompt: "How to sleep ?",
        maxTokens: 1000,
        temperature: 0.9,
        frequencyPenalty: 0,
        bestOf: 1,
        stop: ["\n", "lol"],
    });

    console.log("end response");

    console.log(gptResponse.data.choices[0].text);
    console.log(gptResponse.data);

    completing.value = false;

    feed.value.push({
        text: gptResponse.data.choices[0].text,
        isUser: false,
        id: Math.random(),
    });
}

function scrollToBottomOfFeed() {
    if (!feedDiv.value) return;

    feedDiv.value.scrollTop = feedDiv.value.scrollHeight;
}

const feed = ref<Message[]>([
    {
        id: Math.random(),
        text: props.firstMessage,
        isUser: false,
    },
]);
</script>
