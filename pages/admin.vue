<template>
    <div class="flex justify-center items-center gap-x-40">
        <Nuxt v-if="!adminModal"></Nuxt>
        <b-modal
            v-model="adminModal"
            has-modal-card
            trap-focus
            :can-cancel="false"
            :destroy-on-hide="false"
            aria-role="dialog"
            aria-label="Example Modal"
            close-button-aria-label="Close"
            aria-modal
        >
            <template #default="props">
                <div class="modal-card bg-slate-700 text-white rounded-lg p-5">
                    <b-input
                        type="password"
                        v-model="secretKey"
                        password-reveal
                        placeholder="Secret key"
                        required
                        @keyup.native.enter="storeSecretKey()"
                        custom-class="bg-slate-500 border-none text-white"
                    >
                    </b-input>
                    <hr class="my-10 h-[1px] bg-slate-500" />
                    <b-button
                        label="Access to admin"
                        type="is-primary"
                        @click="storeSecretKey()"
                    />
                    <b-button
                        label="Go back"
                        class="mt-5 border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:border-none"
                        @click="router.push('/')"
                    />
                </div>
            </template>
        </b-modal>
    </div>
</template>

<script lang="ts" setup>
import { getData, setData } from "nuxt-storage/local-storage";
import { onMounted, ref, useRouter } from "@nuxtjs/composition-api";
import { ToastProgrammatic } from "buefy";

const router = useRouter();
const adminModal = ref<boolean>(false);
const secretKey = ref<string>("");

onMounted(async () => {
    if (
        !getData("secretKey") ||
        getData("secretKey").value !== process.env.secretKey
    ) {
        adminModal.value = true;
    }
});

function storeSecretKey() {
    if (secretKey.value === process.env.secretKey) {
        setData("secretKey", secretKey, 1, "h");
        adminModal.value = false;
        ToastProgrammatic.open({
            message: "Access granted",
            type: "is-success",
            pauseOnHover: true,
        });
    } else {
        ToastProgrammatic.open({
            message: "Wrong secret key",
            type: "is-danger",
            pauseOnHover: true,
        });
    }
}
</script>

<script lang="ts">
import { defineComponent } from "@nuxtjs/composition-api";

export default defineComponent({
    layout: "app",
});
</script>
