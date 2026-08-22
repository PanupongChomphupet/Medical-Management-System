<script setup lang="ts">
import { computed, ref, reactive } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import { hospitalData } from '@/mock/hospitalData'
import type { Hospital, HospitalForm } from '@/types/hospital'
import HospitalFormFields from '@/components/hospital/HospitalFormFields.vue'
import { equipmentData } from '@/mock/EquipmentData'

const createEmtyForm = (): HospitalForm => ({
  hospitalNameTh: '',
  hospitalNameEn: '',
  abbreviation: '',
  address: '',
  createdAt: '',
})

const hospitals = ref<Hospital[]>(hospitalData.map((item) => ({ ...item })))
const searchTerm = ref('')
const openModal = ref(false)
const editHospitalId = ref<string | null>(null)
const hospitalForm = reactive<HospitalForm>(createEmtyForm())

/* Error message */
const errorMessage = reactive({
  hospitalNameTh: '',
  abbreviation: '',
})

/* reset form and resert errors */
const resetForm = () => Object.assign(hospitalForm, createEmtyForm())
const resetErrors = () => Object.assign(errorMessage, { hospitalNameTh: '', abbreviation: '' })
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
    value: hospitals.value.reduce((total, hospital) => total + equipmentData.length, 0).toLocaleString(),
  },
  {
    label: 'Open Work Orders',
    value: hospitals.value.reduce((total, hospital) => total + 0, 0).toLocaleString(),
  },
])
/* modal open and close */
const openAddModal = () => {
  resetForm()
  resetErrors()
  editHospitalId.value = null
  openModal.value = true
}
const closeModal = () => {
  openModal.value = false
  resetForm()
  resetErrors()
  editHospitalId.value = null
}
/* validation hospital */
const validateHospital = (): boolean => {
  resetErrors()
  const hospitalNameTh = hospitalForm.hospitalNameTh.trim()
  const abbreviation = hospitalForm.abbreviation.trim()

  if (!hospitalNameTh) {
    errorMessage.hospitalNameTh = "กรุณากรอกชื่อโรงพยาบาล (TH)"
  }

  if (!abbreviation) errorMessage.abbreviation = "กรุณากรอกชื่อย่อโรงพยาบาล"

  else if (hospitals.value.some((hospital) => hospital.id !== editHospitalId.value &&
    hospital.abbreviation.trim().toLowerCase() === abbreviation.toLowerCase(),)) {
    errorMessage.abbreviation = 'ชื่อย่อโรงพยาบาลซ้ํา'
  }
  return !Object.values(errorMessage).some((message) => message !== '')
}
/* CRUD Hospital */
const saveform = () => {
  const isValid = validateHospital()
  if (!isValid) return
  const value = Object.fromEntries(Object.entries(hospitalForm).map(([key, text]) => [key, text.trim()])) as unknown as Hospital
  if (editHospitalId.value) {
    const index = hospitals.value.findIndex((item) => item.id === editHospitalId.value)
    if (index !== -1) hospitals.value[index] = value
  } else {
    hospitals.value.push({
      ...value,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  }
  editHospitalId.value = null
  openModal.value = false
  resetForm()
}

const editHospital = (item: Hospital) => {
  editHospitalId.value = item.id
  Object.assign(hospitalForm, item)
  openModal.value = true
}
const deleteHospital = (id: string) => {
  if (!confirm('Are you sure you want to delete this hospital?')) return
  const index = hospitals.value.findIndex((h) => h.id === id)

  if (index === -1) return

  hospitals.value.splice(index, 1)
}
</script>
<template>
  <div class="space-y-6">
    <header class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div v-for="card in statsCards" :key="card.label"
        class="p-5 bg-white border border-slate-200 rounded-lg shadow-sm">
        <p class="text-sm font-medium text-slate-500">
          {{ card.label }}
        </p>

        <p class="mt-3 text-3xl font-bold text-slate-950">
          {{ card.value }}
        </p>
      </div>
    </header>

    <div class="bg-white border border-slate-200 shadow-sm">
      <div class="flex flex-col gap-4 p-5 border-b border-slate-200 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 class="text-lg font-semibold text-slate-950">
            Hospital List
          </h3>

          <p class="mt-1 text-sm text-slate-500">
            Manage hospitals and open each hospital workspace.
          </p>
        </div>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label class="sr-only" for="hospital-search">
            Search hospital
          </label>

          <input id="hospital-search" v-model="searchTerm" type="search" placeholder="Search hospital"
            class="w-full h-10 px-3 text-sm text-slate-900 border border-slate-300 rounded-md outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:w-72" />

          <button type="button" @click="openAddModal"
            class="h-10 px-4 text-sm font-semibold text-white bg-teal-700 rounded-md shadow-sm transition hover:bg-teal-800">
            Add Hospital
          </button>

          <BaseModal v-model="openModal" :title="editHospitalId ? 'Edit Hospital' : 'Add Hospital'">
            <HospitalFormFields v-model="hospitalForm" :errors="errorMessage" />

            <template #footer>
              <button @click="closeModal"
                class="px-3 py-2 text-slate-500 bg-slate-50 border border-slate-200 rounded-md transition hover:bg-slate-100 hover:text-slate-600">
                Cancel
              </button>

              <button @click="saveform"
                class="px-3 py-2 text-white bg-teal-700 border border-teal-600 rounded-md transition hover:bg-teal-800">
                Save
              </button>
            </template>
          </BaseModal>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full text-sm text-left divide-y divide-slate-200">
          <thead class="text-xs font-semibold text-slate-500 uppercase bg-slate-50">
            <tr>
              <th class="px-5 py-3">hospitalNameTh</th>
              <th class="px-5 py-3">HospitatNameEn</th>
              <th class="px-5 py-3">Abbreviation</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody class="bg-white divide-y divide-slate-100">
            <tr v-for="hospital in filteredHospitals" :key="hospital.id" class="hover:bg-slate-50">
              <td class="px-5 py-4">
                <p class="font-semibold text-slate-900">
                  {{ hospital.hospitalNameTh }}
                </p>
              </td>

              <td class="px-5 py-4 text-slate-600">
                {{ hospital.hospitalNameEn }}
              </td>

              <td class="px-5 py-4 text-slate-600">
                {{ hospital.address }}
              </td>
              <td class="px-5 py-4">
                <span class="px-2 py-1 text-xs font-semibold rounded-md" :class="hospital.status === 'Active'
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
                  <RouterLink :to="{
                    name: 'hospital-overview',
                    params: { id: hospital.id },
                  }"
                    class="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-md transition hover:border-teal-600 hover:text-teal-700">
                    View
                  </RouterLink>

                  <button type="button" @click="editHospital(hospital)"
                    class="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-md transition hover:border-slate-400 hover:text-slate-950">
                    Edit
                  </button>

                  <button type="button" @click="deleteHospital(hospital.id)"
                    class="px-3 py-1.5 text-xs font-semibold text-rose-700 border border-rose-200 rounded-md transition hover:bg-rose-50 hover:border-rose-400">
                    Delete
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredHospitals.length === 0">
              <td colspan="7" class="px-5 py-10 text-sm text-center text-slate-500">
                Click "Add Hospital"
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
