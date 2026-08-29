<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { hospitalData } from '@/mock/hospitalData'

const route = useRoute()

const hospital = computed(() =>
  hospitalData.find((hospitalItem) => hospitalItem.id === String(route.params.id)),
)
</script>

<template>
  <div class="grid gap-4 lg:grid-cols-3">
    <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
      <h4 class="text-base font-semibold text-slate-900">Overview</h4>
      <p class="mt-3 text-sm leading-6 text-slate-600">
        {{ hospital?.hospitalNameEn ?? 'This hospital' }} workspace groups operational modules under the hospital
        record so departments, equipment, work orders, reports, and certificates stay in one context.
      </p>
    </article>

    <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h4 class="text-base font-semibold text-slate-950">Status</h4>
      <p class="mt-3 text-sm text-slate-500">Current operating status</p>
      <p class="mt-2 text-xl font-bold text-slate-950">{{ hospital?.status ?? 'Inactive' }}</p>
    </article>
  </div>
</template>
