<script setup lang="ts">
import { ref } from 'vue'
import { departmentData } from '@/mock/departmentData'

</script>

<template>
  <div class="bg-white border border-slate-200 shadow-sm">
    <div class="flex flex-col gap-4 p-5 border-b border-slate-200 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h3 class="text-lg font-bold text-slate-950">
          Departments
        </h3>

        <p class="mt-1 text-sm text-slate-500">
          Manage departments and open each department workspace
        </p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label for="department-search" class="sr-only">
          Search department
        </label>

        <input id="department-search" type="search" placeholder="Search department"
          class="w-full h-10 px-3 text-sm text-slate-900 border border-slate-300 rounded-md outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:w-72" />

        <button type="button"
          class="h-10 px-4 text-sm font-semibold text-white bg-teal-700 rounded-md shadow-sm transition hover:bg-teal-800">
          Add Department
        </button>
      </div>
    </div>
  </div>
</template>