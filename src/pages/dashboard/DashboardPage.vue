<script setup lang="ts">
interface SummaryCard {
  label: string
  value: string
}

const summaryCards: SummaryCard[] = [
  { label: 'Total Hospitals', value: '-' },
  { label: 'Total Equipment', value: '-' },
  { label: 'Work Orders', value: '-' },
  { label: 'Certificates', value: '-' },
]
</script>

<template>
  <section>
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article
        v-for="card in summaryCards"
        :key="card.label"
        class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      >
        <p class="text-sm font-medium text-slate-500">{{ card.label }}</p>
        <p class="mt-4 text-3xl font-bold text-slate-950">{{ card.value }}</p>
      </article>
    </div>
  </section>
</template>
