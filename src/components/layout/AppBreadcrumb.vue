<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface BreadcrumbItem {
  label: string
  path: string
}

const route = useRoute()

const breadcrumbs = computed<BreadcrumbItem[]>(() =>
  route.matched
    .filter((matchedRoute) => Boolean(matchedRoute.meta.title))
    .map((matchedRoute) => ({
      label: String(matchedRoute.meta.title),
      path: matchedRoute.path,
    })),
)
</script>

<template>
  <nav class="text-sm text-slate-500" aria-label="Breadcrumb">
    <ol class="flex flex-wrap items-center gap-2">
      <li v-for="(item, index) in breadcrumbs" :key="item.path" class="flex items-center gap-2">
        <span v-if="index > 0" aria-hidden="true">/</span>
        <span
          :class="[
            index === breadcrumbs.length - 1 ? 'font-medium text-slate-800' : 'text-slate-500',
          ]"
        >
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
