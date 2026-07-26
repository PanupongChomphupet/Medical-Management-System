<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import { hospitals as hospitalData } from './hospitalData'
import BaseModal from '@/components/common/BaseModal.vue'
import HospitalForm from '@/components/hospital/HospitalForm.vue'

const searchTerm = ref('')
const openModal = ref(false)
const hospitals = ref([...hospitalData])

/* hospital form */
const hospitalForm = reactive({
  hospitalNameTh: '',
  hospitalNameEn: '',
  abbreviation: '', // ตัวย่อ
  address: '',
})
/* validation hospital */
const validateHospital = (): string | null => {
  const hospitalNameTh = hospitalForm.hospitalNameTh.trim()
  const abbreviation = hospitalForm.abbreviation.trim()

  if (!hospitalNameTh) {
    return 'กรุณากรอกชื่อโรงพยาบาล'
  }

  if (!abbreviation) {
    return "กรุณากรอกชื่อย่อโรงพยาบาล"
  }

  const exists = hospitals.value.some(
    (hospital) =>
      hospital.abbreviation.trim().toLowerCase() ===
      abbreviation.toLowerCase(),
  )
  if (exists) {
    return "ชื่อย่อโรงพยาบาลซ้ํา"
  }
  return null
}
/* save form */
const saveform = () => {
  const error = validateHospital()
  if (error) {
    alert(error)
    return
  }
  hospitals.value.push({
    id: crypto.randomUUID(),
    hospitalNameTh: hospitalForm.hospitalNameTh,
    hospitalNameEn: hospitalForm.hospitalNameEn,
    abbreviation: hospitalForm.abbreviation,
    address: hospitalForm.address,
    departments: 0,
    equipment: 0,
    workOrders: 0,
    status: 'Active',
  })

  openModal.value = false
  resetForm()
}
/* reset form */
const resetForm = () => {
  hospitalForm.hospitalNameTh = ''
  hospitalForm.hospitalNameEn = ''
  hospitalForm.abbreviation = ''
  hospitalForm.address = ''
}
/* filtered hospitals */
const filteredHospitals = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase()

  if (!keyword) {
    return hospitals.value
  }

  return hospitals.value.filter((hospital) =>
    [hospital.hospitalNameTh, hospital.hospitalNameEn, hospital.abbreviation, hospital.status]
      .join(' ')
      .toLowerCase()
      .includes(keyword),
  )
})
/* stats cards */
const statsCards = computed(() => [
  { label: 'Total Hospitals', value: String(hospitals.value.length) },
  {
    label: 'Active Hospitals',
    value: String(hospitals.value.filter((hospital) => hospital.status === 'Active').length),
  },
  {
    label: 'Total Equipment',
    value: hospitals.value.reduce((total, hospital) => total + hospital.equipment, 0).toLocaleString(),
  },
  {
    label: 'Open Work Orders',
    value: hospitals.value.reduce((total, hospital) => total + hospital.workOrders, 0).toLocaleString(),
  },
])
</script>

<template>
  <section class="space-y-6">
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article v-for="card in statsCards" :key="card.label"
        class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">{{ card.label }}</p>
        <p class="mt-3 text-3xl font-bold text-slate-950">{{ card.value }}</p>
      </article>
    </div>

    <div class="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div class="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 class="text-lg font-semibold text-slate-950">Hospital List</h3>
          <p class="mt-1 text-sm text-slate-500">Manage hospitals and open each hospital workspace.</p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label class="sr-only" for="hospital-search">Search hospital</label>
          <input id="hospital-search" v-model="searchTerm" type="search" placeholder="Search hospital"
            class="h-10 w-full rounded-md border border-slate-300 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:w-72" />
          <button type="button" @click="openModal = true"
            class="h-10 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white transition hover:bg-teal-800">
            Add Hospital
          </button>
          <BaseModal v-model="openModal" title="Add Hospital">
            <HospitalForm v-model="hospitalForm" />
            <template #footer>
              <button @click="openModal = false"
                class="px-3 py-2 text-slate-500 transition bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md hover:text-slate-600 ">
                Cancel
              </button>
              <button @click="saveform"
                class="px-3 py-2 text-white transition bg-teal-700 border border-teal-600 rounded-md hover:bg-teal-800">
                Save
              </button>
            </template>
          </BaseModal>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead class="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th class="px-5 py-3">hospitalNameTh</th>
              <th class="px-5 py-3">HospitatNameEn</th>
              <th class="px-5 py-3">Abbreviation</th>

              <th class="px-5 py-3">Departments</th>
              <th class="px-5 py-3">Equipment</th>
              <th class="px-5 py-3">Work Orders</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 bg-white">
            <tr v-for="hospital in filteredHospitals" :key="hospital.id" class="hover:bg-slate-50">
              <td class="px-5 py-4">
                <p class="font-semibold text-slate-950">{{ hospital.hospitalNameTh }}</p>
              </td>
              <td class="px-5 py-4 text-slate-600">{{ hospital.hospitalNameEn }}</td>
              <td class="px-5 py-4 text-slate-600">{{ hospital.address }}</td>
              <td class="px-5 py-4 text-slate-600">{{ hospital.departments }}</td>
              <td class="px-5 py-4 text-slate-600">{{ hospital.equipment }}</td>
              <td class="px-5 py-4 text-slate-600">{{ hospital.workOrders }}</td>
              <td class="px-5 py-4">
                <span class="rounded-md px-2 py-1 text-xs font-semibold" :class="hospital.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-700'
                  : hospital.status === 'Maintenance'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-slate-100 text-slate-600'
                  ">
                  {{ hospital.status }}
                </span>
              </td>
              <td class="px-5 py-4">
                <div class="flex justify-end gap-2">
                  <RouterLink :to="{ name: 'hospital-overview', params: { id: hospital.id } }"
                    class="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-teal-600 hover:text-teal-700">
                    View
                  </RouterLink>
                  <button type="button"
                    class="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950">
                    Edit
                  </button>
                  <button type="button"
                    class="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:border-rose-400 hover:bg-rose-50">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredHospitals.length === 0">
              <td colspan="7" class="px-5 py-10 text-center text-sm text-slate-500">
                No hospitals match your search.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
