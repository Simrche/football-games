<template>
    <label @click="onClick()" class="cursor-pointer">
        <input v-model="computedValue" type="checkbox" class="cursor-pointer" />
        <slot></slot>
    </label>
</template>

<script setup lang="ts">
import { computed } from "@nuxtjs/composition-api";

const props = defineProps<{
    modelValue?: boolean;
}>();

const emit = defineEmits<{
    (event: "update:modelValue", modelValue: boolean): void;
}>();

const computedValue = computed({
    get() {
        return () => props.modelValue;
    },
    set(value: any) {
        emit("update:modelValue", value);
    },
});

function onClick() {
    emit("update:modelValue", !props.modelValue);
}
</script>
