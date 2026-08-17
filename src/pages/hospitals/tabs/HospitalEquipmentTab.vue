<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import EquipmentFormFields from '@/components/hospital/EquipmentFormFields.vue'
import { equipmentData } from '@/mock/EquipmentData'
import type { Equipment, EquipmentForm } from '@/types/equipment'

const createEmptyForm = (): EquipmentForm => ({
  assetNumber: '',
  equipmentId: '',
  equipmentName: '',
  manufacturer: '',
  model: '',
  serialNumber: '',
  department: '',
  workType: '',
  riskLevel: '',
  registeredBy: '',
  remark: '',
  status: 'Active'
})
const equipments = ref<Equipment[]>(equipmentData.map((item) => ({ ...item })))
const searchTerm = ref('')
const openModal = ref(false)
const openDetailModal = ref(false)
const showFilters = ref(false)
const editingId = ref<string | null>(null)
const selectedEquipment = ref<Equipment | null>(null)
const filters = reactive({ department: '', workType: '', riskLevel: '', status: '' })
const equipmentForm = reactive<EquipmentForm>(createEmptyForm())
const errorMessage = reactive({
  equipmentId: '',
  equipmentName: ''
})

const filteredEquipments = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase()
  return equipments.value.filter((item) =>
    (!keyword || [item.assetNumber, item.equipmentId, item.equipmentName, item.status]
      .some((value) => value.toLowerCase().includes(keyword)))
    && (!filters.department || item.department === filters.department)
    && (!filters.workType || item.workType === filters.workType)
    && (!filters.riskLevel || item.riskLevel === filters.riskLevel)
    && (!filters.status || item.status === filters.status),
  )
})
const uniqueOptions = (field: 'department' | 'workType' | 'riskLevel' | 'status') =>
  [...new Set(equipments.value.map((item) => item[field]).filter(Boolean))]
const activeFilterCount = computed(() => Object.values(filters).filter(Boolean).length)
const clearFilters = () => Object.assign(filters, { department: '', workType: '', riskLevel: '', status: '' })
const resetForm = () => Object.assign(equipmentForm, createEmptyForm())
const resetErrors = () => Object.assign(errorMessage, { equipmentId: '', equipmentName: '' })
const openAddModal = () => {
  editingId.value = null
  resetForm()
  resetErrors()
  openModal.value = true
}
const closeModal = () => {
  openModal.value = false
  editingId.value = null
  resetForm()
  resetErrors()
}
const validateForm = () => {
  resetErrors()
  const id = equipmentForm.equipmentId.trim()
  if (!id) errorMessage.equipmentId = 'กรุณากรอกรหัสเครื่องมือ'
  else if (equipments.value.some((item) => item.equipmentId.toLowerCase() === id.toLowerCase() && item.id !== editingId.value)) {
    errorMessage.equipmentId = 'รหัสเครื่องมือนี้มีอยู่แล้ว'
  }
  if (!equipmentForm.equipmentName.trim()) errorMessage.equipmentName = 'กรุณากรอกชื่อเครื่องมือ'
  return !Object.values(errorMessage).some(Boolean)
}
const saveForm = () => {
  if (!validateForm()) return
  const value = Object.fromEntries(Object.entries(equipmentForm).map(([key, text]) => [key, text.trim()])) as unknown as Equipment
  if (editingId.value) {
    const index = equipments.value.findIndex((item) => item.id === editingId.value)
    if (index !== -1) equipments.value[index] = { ...equipments.value[index], ...value, updatedAt: new Date().toISOString() }
  } else {
    equipments.value.push({
      ...value,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  closeModal()
}
const editEquipment = (equipment: Equipment) => {
  editingId.value = equipment.id
  Object.assign(equipmentForm, equipment)
  resetErrors()
  openModal.value = true
}
const viewEquipment = (equipment: Equipment) => {
  selectedEquipment.value = equipment
  openDetailModal.value = true
}
const deleteEquipment = (equipmentId: string) => {
  if (!window.confirm('คุณต้องการลบเครื่องมือนี้ใช่หรือไม่?')) return
  equipments.value = equipments.value.filter((item) => item.equipmentId !== equipmentId)
}
</script>

<template>
  <div class="bg-white border border-slate-200 shadow-sm">
    <div class="flex flex-col gap-4 p-5 border-b border-slate-200 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h3 class="text-base font-semibold text-slate-950">Equipment</h3>
        <p class="mt-3 text-sm text-slate-500">Manage Equipment System</p>
      </div>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label class="sr-only" for="equipment-search">Search equipment</label>
        <input id="equipment-search" v-model="searchTerm"
          class="w-full h-10 px-3 text-sm border border-slate-300 rounded-md outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:w-72"
          type="search" placeholder="Search equipment">
        <button type="button"
          class="h-10 px-4 text-sm font-semibold text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50"
          :class="showFilters ? 'border-teal-600 bg-teal-50 text-teal-700' : ''"
          @click="showFilters = !showFilters">
          Filters<span v-if="activeFilterCount"> ({{ activeFilterCount }})</span>
        </button>
        <button type="button"
          class="h-10 px-4 text-sm font-semibold text-white bg-teal-700 rounded-md hover:bg-teal-800"
          @click="openAddModal">Add Equipment</button>
        <BaseModal v-model="openModal" :title="editingId ? 'Edit Equipment' : 'Add Equipment'">
          <EquipmentFormFields v-model="equipmentForm" :error-message="errorMessage" />
          <template #footer>
            <button type="button"
              class="px-3 py-2 text-slate-500 bg-slate-50 border border-slate-200 rounded-md hover:bg-slate-100"
              @click="closeModal">Cancel</button>
            <button type="button"
              class="px-3 py-2 text-white bg-teal-700 border border-teal-600 rounded-md hover:bg-teal-800"
              @click="saveForm">Save</button>
          </template>
        </BaseModal>
        <BaseModal v-model="openDetailModal" title="Equipment Details">
          <dl v-if="selectedEquipment" class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            <div v-for="item in [
              ['เลขครุภัณฑ์', selectedEquipment.assetNumber], ['รหัสเครื่องมือ', selectedEquipment.equipmentId],
              ['ชื่อเครื่องมือ', selectedEquipment.equipmentName], ['แผนก', selectedEquipment.department],
              ['ผู้ผลิต', selectedEquipment.manufacturer], ['รุ่น', selectedEquipment.model],
              ['หมายเลขซีเรียล', selectedEquipment.serialNumber], ['ประเภทงาน', selectedEquipment.workType],
              ['ระดับความเสี่ยง', selectedEquipment.riskLevel], ['สถานะ', selectedEquipment.status],
              ['ผู้ลงทะเบียน', selectedEquipment.registeredBy], ['หมายเหตุ', selectedEquipment.remark],
            ]" :key="item[0]" class="rounded-lg bg-slate-50 p-3">
              <dt class="text-xs font-semibold uppercase text-slate-500">{{ item[0] }}</dt>
              <dd class="mt-1 text-sm text-slate-900">{{ item[1] || '-' }}</dd>
            </div>
          </dl>
          <template #footer><button type="button" class="px-4 py-2 text-white bg-teal-700 rounded-md hover:bg-teal-800" @click="openDetailModal = false">Close</button></template>
        </BaseModal>
      </div>
    </div>
    <div v-if="showFilters" class="grid gap-4 border-b border-slate-200 bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-5">
      <label v-for="filter in [
        { key: 'department', label: 'Department' }, { key: 'workType', label: 'Work Type' },
        { key: 'riskLevel', label: 'Risk Level' }, { key: 'status', label: 'Status' },
      ]" :key="filter.key" class="text-sm font-medium text-slate-700">
        {{ filter.label }}
        <select v-model="filters[filter.key as keyof typeof filters]" class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100">
          <option value="">ทั้งหมด</option>
          <option v-for="option in uniqueOptions(filter.key as 'department' | 'workType' | 'riskLevel' | 'status')" :key="option" :value="option">{{ option }}</option>
        </select>
      </label>
      <div class="flex items-end"><button type="button" class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100" @click="clearFilters">Clear Filters</button></div>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm text-left divide-y divide-slate-200">
        <thead class="text-sm font-semibold text-slate-500 uppercase bg-slate-50">
          <tr class="[&>th]:px-5 [&>th]:py-3">
            <th>ลำดับ</th>
            <th>เลขครุภัณฑ์</th>
            <th>รหัสเครื่องมือ</th>
            <th>ชื่อเครื่องมือ</th>
            <th>สถานะ</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(equipment, index) in filteredEquipments" :key="equipment.equipmentId"
            class="[&>td]:px-5 [&>td]:py-3 border-b border-slate-100">
            <td>{{ index + 1 }}</td>
            <td>{{ equipment.assetNumber }}</td>
            <td>{{ equipment.equipmentId }}</td>
            <td class="font-semibold text-slate-950">{{ equipment.equipmentName }}</td>
            <td>{{ equipment.status }}</td>
            <td>
              <div class="flex gap-2">
                <button type="button"
                  class="px-3 py-1.5 text-xs font-semibold text-teal-700 border border-teal-200 rounded-md hover:bg-teal-50"
                  @click="viewEquipment(equipment)">View</button>
                <button type="button"
                  class="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-md hover:border-slate-400"
                  @click="editEquipment(equipment)">Edit</button>
                <button type="button"
                  class="px-3 py-1.5 text-xs font-semibold text-rose-700 border border-rose-200 rounded-md hover:bg-rose-50"
                  @click="deleteEquipment(equipment.equipmentId)">Delete</button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredEquipments.length === 0">
            <td colspan="6" class="px-5 py-10 text-center text-slate-500">ไม่พบข้อมูล</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
