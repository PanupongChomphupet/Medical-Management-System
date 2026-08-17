<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { departmentData } from '@/mock/departmentData'
import type { Department, DepartmentForm } from '@/types/department'
import BaseModal from '@/components/common/BaseModal.vue'
import DepartmentFormFields from '@/components/hospital/DepartmentFormFields.vue'

const createEmptyForm = (): DepartmentForm => ({
  departmentCode: '',
  departmentName: '',
})
const departments = ref<Department[]>(departmentData.map((item) => ({ ...item })))
const editDepartmentId = ref<string | null>(null)
const searchTerm = ref('')
const openModal = ref(false)
const openDetailModal = ref(false)
const selectedDepartment = ref<Department | null>(null)
const departmentForm = reactive<DepartmentForm>(createEmptyForm())

const errorMessage = reactive({ departmentName: '', })
const resetForm = () => Object.assign(departmentForm, createEmptyForm())
const resetErrors = () => { errorMessage.departmentName = '' }

const filteredDepartments = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase()
  return departments.value.filter((department) => department.departmentName.toLowerCase().includes(keyword))
})

const openAddModal = () => {
  openModal.value = true
}
const closeModal = () => {
  editDepartmentId.value = null
  openModal.value = false
  resetForm()
  resetErrors()
}
const validateDepartment = () => {
  resetErrors()
  const departmentName = departmentForm.departmentName.trim()

  if (!departmentName) {
    errorMessage.departmentName = "กรุณากรอกชื่อแผนก"
  }
  return !Object.values(errorMessage).some((message) => message !== '')
}

const saveform = () => {
  const isValid = validateDepartment()
  if (!isValid) return
  const value = Object.fromEntries(Object.entries(departmentForm).map(([key, text]) => [key, text.trim()])) as unknown as Department
  if (editDepartmentId.value) {
    const index = departments.value.findIndex((item) => item.id === editDepartmentId.value)
    if (index !== -1) departments.value[index] = { ...departments.value[index], ...value, updatedAt: new Date().toISOString() }
  } else {
    departments.value.push({
      ...value,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }
  closeModal()
}

const editDepartment = (department: Department) => {
  editDepartmentId.value = department.id
  Object.assign(departmentForm, department)
  openModal.value = true
}
const viewDepartment = (department: Department) => {
  selectedDepartment.value = department
  openDetailModal.value = true
}
const deleteDepartment = (departmentId: string) => {
  if (!confirm('Are you sure you want to delete this hospital?')) return
  const index = departments.value.findIndex((d) => d.id === departmentId)
  if (index === -1) return
  departments.value.splice(index, 1)
}
</script>

<template>
  <div class="bg-white border border-slate-200 shadow-sm">
    <div class="flex flex-col gap-4 p-5 border-b border-slate-200 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h3 class="text-base font-semibold text-slate-950">
          Departments
        </h3>

        <p class="mt-3 text-sm text-slate-500">
          Manage departments and open each department workspace
        </p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label for="department-search" class="sr-only">
          Search department
        </label>
        <input id="department-search" v-model="searchTerm" type="search" placeholder="Search department"
          class="w-full h-10 px-3 text-sm text-slate-900 border border-slate-300 rounded-md outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:w-72" />
        <button type="button"
          class="h-10 px-4 text-sm font-semibold text-white bg-teal-700 rounded-md shadow-sm transition hover:bg-teal-800"
          @click="openAddModal">
          Add Department
        </button>
        <!-- Modal -->
        <BaseModal v-model="openModal" :title="editDepartmentId ? 'Edit Department' : 'Add Department'">
          <DepartmentFormFields v-model="departmentForm" :errors="errorMessage" />
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
        <BaseModal v-model="openDetailModal" title="Department Details">
          <dl v-if="selectedDepartment" class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-lg bg-slate-50 p-4"><dt class="text-xs font-semibold uppercase text-slate-500">ชื่อแผนก</dt><dd class="mt-1 text-sm font-semibold text-slate-900">{{ selectedDepartment.departmentName }}</dd></div>
            <div class="rounded-lg bg-slate-50 p-4"><dt class="text-xs font-semibold uppercase text-slate-500">รายละเอียด</dt><dd class="mt-1 text-sm text-slate-900">{{ selectedDepartment.departmentCode || '-' }}</dd></div>
            <div class="rounded-lg bg-slate-50 p-4"><dt class="text-xs font-semibold uppercase text-slate-500">วันที่สร้าง</dt><dd class="mt-1 text-sm text-slate-900">{{ new Date(selectedDepartment.createdAt).toLocaleString('th-TH') }}</dd></div>
            <div class="rounded-lg bg-slate-50 p-4"><dt class="text-xs font-semibold uppercase text-slate-500">แก้ไขล่าสุด</dt><dd class="mt-1 text-sm text-slate-900">{{ new Date(selectedDepartment.updatedAt).toLocaleString('th-TH') }}</dd></div>
          </dl>
          <template #footer><button type="button" class="px-4 py-2 text-white bg-teal-700 rounded-md hover:bg-teal-800" @click="openDetailModal = false">Close</button></template>
        </BaseModal>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm text-left divide-y divide-slate-200">
        <thead class="text-sm font-semibold text-slate-500 uppercase bg-slate-50">
          <tr class="[&>th]:px-5 [&>th]:py-3">
            <th>ลำดับ</th>
            <th>ชื่อแผนก</th>
            <th>รายละเอียด</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr class="[&>td]:px-5 [&>td]:py-3 " v-for="(department, index) in filteredDepartments" :key="department.id">
            <td>
              {{ index + 1 }}
            </td>
            <td class="font-semibold text-slate-950">
              {{ department.departmentName }}
            </td>
            <td>
              {{ department.departmentCode }}
            </td>
            <td class="px-5 py-3">
              <div class="flex gap-2">
                <button
                  class="px-3 py-1.5 text-xs font-semibold text-teal-700 border border-teal-200 rounded-md transition hover:bg-teal-50"
                  @click="viewDepartment(department)">
                  view
                </button>
                <button
                  class="px-3 py-1.5 text-xs font-semibold text-slate-700 border border-slate-200 rounded-md transition hover:border-slate-400 hover:text-slate-950"
                  @click="editDepartment(department)">
                  edit
                </button>
                <button
                  class="px-3 py-1.5 text-xs font-semibold text-rose-700 border border-rose-200 rounded-md transition hover:bg-rose-50 hover:border-rose-400"
                  @click="deleteDepartment(department.id)">
                  delete
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredDepartments.length === 0">
            <td colspan="4" class="px-5 py-10 text-sm text-center text-slate-500">ไม่พบข้อมูล</td>
          </tr>
        </tbody>

      </table>
    </div>
  </div>
</template>
