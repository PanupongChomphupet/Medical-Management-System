<script setup lang="ts">
import AppBreadcrumb from '@/components/layout/AppBreadcrumb.vue'
import { usePageTitle } from '@/composables/usePageTitle'

const pageTitle = usePageTitle()
</script>

<template>
  <header class="border-b border-slate-200 bg-white">
    <div class="flex min-h-20 flex-col justify-center gap-2 px-5 py-4 sm:px-8">
      <AppBreadcrumb />
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-2xl font-bold text-slate-950">{{ pageTitle }}</h2>
        <div class="rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600">
          Admin Console
        </div>
      </div>
    </div>
  </header>
</template>
