<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopNav from '@/components/layout/AppTopNav.vue'
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <div class="flex min-h-screen flex-col lg:flex-row">
      <AppSidebar />

      <div class="flex min-w-0 flex-1 flex-col">
        <AppTopNav />

        <main class="flex-1 px-5 py-6 sm:px-8">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>
