<script setup lang="ts">
const props = defineProps<{
    title: string
    type: string
}>()

const model = defineModel<string>()
</script>

<template>
    <div>
        <label class="mb-1 block text-sm font-medium">
            {{ props.title }}
        </label>
        <input class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" v-model="model" :type="type" />
    </div>
</template>