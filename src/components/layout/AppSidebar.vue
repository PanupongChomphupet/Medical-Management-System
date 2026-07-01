<script setup lang="ts">
import { mainNavigationItems } from '@/constants/navigation'
</script>

<template>
  <aside class="border-b border-slate-200 bg-white lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
    <div class="border-b border-slate-200 px-5 py-4 lg:px-6 lg:py-5">
      <p class="text-xs font-semibold uppercase tracking-wide text-teal-700">MECMS</p>
      <h1 class="mt-1 text-lg font-bold text-slate-950">Medical Equipment Calibration</h1>
    </div>

    <nav
      class="flex gap-1 overflow-x-auto px-4 py-3 lg:flex-col lg:space-y-1 lg:overflow-visible lg:py-5"
      aria-label="Main navigation"
    >
      <RouterLink
        v-for="item in mainNavigationItems"
        :key="item.routeName"
        :to="{ name: item.routeName }"
        class="flex shrink-0 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
        active-class="bg-teal-50 text-teal-800"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
