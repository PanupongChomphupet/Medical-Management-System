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
  workType: '',
  riskLevel: '',
  registeredBy: '',
  remark: '',
  status: 'Active'
})
const equipments = ref<Equipment[]>(equipmentData.map((item) => ({ ...item })))
const searchTerm = ref('')
const openModal = ref(false)
const editingId = ref<string | null>(null)
const equipmentForm = reactive<EquipmentForm>(createEmptyForm())
const errorMessage = reactive({
  equipmentId: '',
  equipmentName: ''
})

const filteredEquipments = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase()
  if (!keyword) return equipments.value
  return equipments.value.filter((item) =>
    [item.assetNumber, item.equipmentId, item.equipmentName, item.status]
      .some((value) => value.toLowerCase().includes(keyword)),
  )
})
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
    const index = equipments.value.findIndex((item) => item.equipmentId === editingId.value)
    if (index !== -1) equipments.value[index] = value
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
      </div>
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
