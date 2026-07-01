<script setup lang="ts">
interface Props {
  title: string
  description: string
}

defineProps<Props>()
</script>

<template>
  <section class="rounded-lg border border-dashed border-slate-300 bg-white p-8">
    <p class="text-sm font-semibold uppercase tracking-wide text-teal-700">Module</p>
    <h3 class="mt-2 text-xl font-bold text-slate-950">{{ title }}</h3>
    <p class="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{{ description }}</p>
  </section>
</template>
