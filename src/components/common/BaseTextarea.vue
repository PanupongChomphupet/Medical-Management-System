<script setup lang="ts">

interface Props {
    title: string
    rows?: number
}

withDefaults(defineProps<Props>(), {
    rows: 3
})
const model = defineModel<string>()
</script>
<template>
    <div>
        <label for="" class="mb-1 block text-sm font-medium">{{ title }}</label>
        <textarea v-model="model"
            class="w-full rounded-lg border border-slate-300 outline-none px-3 py-2 focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            :rows="rows">
        </textarea>
    </div>
</template>