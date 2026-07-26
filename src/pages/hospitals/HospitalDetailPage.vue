<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { hospitals } from './hospitalData'

const route = useRoute()

const hospitalId = computed(() => String(route.params.id ?? ''))

const hospital = computed(
  () =>
    hospitals.find((hospitalItem) => hospitalItem.id === hospitalId.value) ?? {
      id: hospitalId.value,
      hospitalNameTh: 'Unknown Hospital',
      hospitalNameEn: 'Unknown Hospital',
      abbreviation: '-',
      address: '-',
      departments: 0,
      equipment: 0,
      workOrders: 0,
      status: 'Inactive' as const,
    },
)

const tabs = [
  { label: 'Overview', routeName: 'hospital-overview' },
  { label: 'Departments', routeName: 'hospital-departments' },
  { label: 'Equipment', routeName: 'hospital-equipment' },
  { label: 'Work Orders', routeName: 'hospital-work-orders' },
  { label: 'Reports', routeName: 'hospital-reports' },
  { label: 'Certificates', routeName: 'hospital-certificates' },
]
</script>

<template>
  <section class="space-y-6">
    <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <RouterLink
            :to="{ name: 'hospitals' }"
            class="text-sm font-semibold text-teal-700 transition hover:text-teal-900"
          >
            Back to Hospitals
          </RouterLink>
          <h3 class="mt-3 text-2xl font-bold text-slate-950">{{ hospital.hospitalNameTh }}</h3>
          <p class="mt-1 text-sm text-slate-500">
            {{ hospital.address }} · {{ hospital.abbreviation }}
          </p>
        </div>

        <div class="grid grid-cols-3 gap-3 text-center">
          <div class="rounded-md border border-slate-200 px-4 py-3">
            <p class="text-xs font-medium text-slate-500">Departments</p>
            <p class="mt-1 text-lg font-bold text-slate-950">{{ hospital.departments }}</p>
          </div>
          <div class="rounded-md border border-slate-200 px-4 py-3">
            <p class="text-xs font-medium text-slate-500">Equipment</p>
            <p class="mt-1 text-lg font-bold text-slate-950">{{ hospital.equipment }}</p>
          </div>
          <div class="rounded-md border border-slate-200 px-4 py-3">
            <p class="text-xs font-medium text-slate-500">Work Orders</p>
            <p class="mt-1 text-lg font-bold text-slate-950">{{ hospital.workOrders }}</p>
          </div>
        </div>
      </div>

      <nav class="mt-6 flex gap-2 overflow-x-auto border-b border-slate-200" aria-label="Hospital sections">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.routeName"
          :to="{ name: tab.routeName, params: { id: hospital.id } }"
          class="-mb-px shrink-0 border-b-2 border-transparent px-3 py-3 text-sm font-semibold text-slate-500 transition hover:text-slate-950"
          active-class="border-teal-700 text-teal-800"
        >
          {{ tab.label }}
        </RouterLink>
      </nav>
    </div>

    <RouterView />
  </section>
</template>
