<script setup lang="ts">
const props = defineProps<{
    title: string

}>()
const model = defineModel<string>()
</script>
<template>
    <div>
        <label for="">{{ props.title }}</label>
        <textarea v-model="model" class="w-full rounded-lg border border-slate-300 outline-none px-3 py-2" rows="3">
        </textarea>
    </div>
</template>