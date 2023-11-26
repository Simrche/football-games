<template>
    <label
        @click="onClick()"
        class="cursor-pointer gap-2 inline-flex items-center select-none"
    >
        <input
            v-model="computedValue"
            type="checkbox"
            class="bg-white rounded cursor-pointer outline-none border-1 border-gray-300 flex-shrink-0 h-4 w-4 checkbox appearance-none static active:bg-blue-700 active:border-blue-700 checked:bg-blue-600 checked:border-blue-600"
        />
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

<style scoped>
.checkbox:checked,
.checkbox:indeterminate {
    border-color: transparent;
    background-color: currentColor;
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
}

.checkbox:checked {
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M5.707 7.293a1 1 0 0 0-1.414 1.414l2 2a1 1 0 0 0 1.414 0l4-4a1 1 0 0 0-1.414-1.414L7 8.586 5.707 7.293z'/%3e%3c/svg%3e");
}

.checkbox:indeterminate {
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='rgb(37, 99, 235)' xmlns='http://www.w3.org/2000/svg'%3e%3crect x='2.64014' y='2.64258' width='10.7192' height='10.7135' rx='2'/%3e%3c/svg%3e");
}
</style>
