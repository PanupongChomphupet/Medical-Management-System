<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import BaseModal from '@/components/common/BaseModal.vue'
import WorkOrderFormFields from '@/components/workorder/WorkorderFormFields.vue'
import { hospitalData } from '@/mock/hospitalData'
import { workOrder } from '@/mock/workorderData'
import type { WorkOrder, WorkOrderForm } from '@/types/workorder'

type WorkOrderStatus = WorkOrder['status']

const createEmptyForm = (): WorkOrderForm => ({
  hospitalId: '',
  startDate: '',
  endDate: '',
  staffIds: [],
  status: 'Pending',
  remark: '',
})

const workOrders = ref<WorkOrder[]>(workOrder.map((item) => ({ ...item, })),)
const searchTerm = ref('')
const statusFilter = ref('')
const modalOpen = ref(false)
const viewModalOpen = ref(false)
const editWorkOrderId = ref<string | null>(null)
const selectedWorkOrder = ref<WorkOrder | null>(null)

const workorderForm = reactive<WorkOrderForm>(createEmptyForm())

const errors = reactive({
  hospitalId: '',
  startDate: '',
  endDate: '',
  staffIds: '',
})

const statuses: WorkOrderStatus[] = [
  'Pending',
  'In Progress',
  'Completed',
]

const filteredWorkOrders = computed(() => {
  const keyword = searchTerm.value.trim().toLowerCase()

  return workOrders.value.filter((item) => {
    const matchesSearch =
      !keyword ||
      [
        item.workOrderId,
        hospitalName(item.hospitalId),
        item.remark,
      ].some((value) =>
        value.toLowerCase().includes(keyword),
      )

    const matchesStatus =
      !statusFilter.value ||
      item.status === statusFilter.value

    return matchesSearch && matchesStatus
  })
})
const hospitalName = (id: string) => {
  return (
    hospitalData.find((hospital) => hospital.id === id)
      ?.hospitalNameEn ?? id
  )
}
const formatDate = (date: string) => {
  return date
    ? new Date(`${date}T00:00:00`).toLocaleDateString('en-GB')
    : '-'
}
const statusClass = (status: WorkOrderStatus) => ({
  Pending: 'bg-amber-100 text-amber-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-emerald-100 text-emerald-700',
})[status]

const resetErrors = () => {
  errors.hospitalId = ''
  errors.startDate = ''
  errors.endDate = ''
  errors.staffIds = ''
}
const openCreateModal = () => {
  editWorkOrderId.value = null

  Object.assign(
    workorderForm,
    createEmptyForm(),
  )

  resetErrors()

  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  editWorkOrderId.value = null

  Object.assign(
    workorderForm,
    createEmptyForm(),
  )

  resetErrors()
}
const validate = (): boolean => {
  resetErrors()

  if (!workorderForm.hospitalId) {
    errors.hospitalId =
      'กรุณาเลือกโรงพยาบาล'
  }

  if (!workorderForm.startDate) {
    errors.startDate =
      'กรุณาเลือกวันเริ่มต้น'
  }

  if (!workorderForm.endDate) {
    errors.endDate =
      'กรุณาเลือกวันสิ้นสุด'
  } else if (
    workorderForm.startDate &&
    workorderForm.endDate <
    workorderForm.startDate
  ) {
    errors.endDate =
      'วันสิ้นสุดต้องไม่ก่อนวันเริ่มต้น'
  }

  if (workorderForm.staffIds.length === 0) {
    errors.staffIds =
      'กรุณาเลือกเจ้าหน้าที่อย่างน้อย 1 คน'
  }

  return !Object.values(errors).some(Boolean)
}
const generateWorkOrderId = () => {
  const year = new Date().getFullYear()
  const prefix = `WO-${year}-`
  const maxNumber = workOrders.value.reduce((max, item) => {
    if (!item.workOrderId.startsWith(prefix)) return max
    const number = Number(item.workOrderId.slice(prefix.length))
    return Number.isFinite(number) ? Math.max(max, number) : max
  }, 0)
  return `${prefix}${String(maxNumber + 1).padStart(3, '0')}`
}
const saveWorkOrder = () => {
  if (!validate()) return

  const now = new Date().toISOString()
  const value: WorkOrderForm = {
    hospitalId: workorderForm.hospitalId,
    startDate: workorderForm.startDate,
    endDate: workorderForm.endDate,
    staffIds: [...workorderForm.staffIds],
    status: workorderForm.status,
    remark: workorderForm.remark.trim(),
  }

  if (editWorkOrderId.value) {
    const index = workOrders.value.findIndex(
      (item) =>
        item.id === editWorkOrderId.value,
    )

    if (index === -1) return

    const current = workOrders.value[index]
    if (!current) return
    workOrders.value[index] = { ...current, ...value, updatedAt: now }
  } else {
    workOrders.value.push({
      id: crypto.randomUUID(),
      workOrderId: generateWorkOrderId(),
      ...value,
      createdAt: now,
      updatedAt: now,
    })
  }

  closeModal()
}

const editWorkOrder = (item: WorkOrder) => {
  editWorkOrderId.value = item.id

  Object.assign(workorderForm, {
    hospitalId: item.hospitalId,
    startDate: item.startDate,
    endDate: item.endDate,

    // copy array แยกออกมา
    staffIds: [...item.staffIds],

    status: item.status,
    remark: item.remark,
  })

  resetErrors()

  modalOpen.value = true
}
const viewWorkOrder = (item: WorkOrder) => {
  selectedWorkOrder.value = item
  viewModalOpen.value = true
}

const deleteWorkOrder = (id: string) => {
  if (
    !window.confirm(
      'คุณต้องการลบ Work Order นี้ใช่หรือไม่?',
    )
  ) {
    return
  }

  workOrders.value =
    workOrders.value.filter(
      (item) => item.id !== id,
    )
}
</script>

<template>
  <section class="bg-white border border-slate-200 rounded-lg shadow-sm">
    <header class="flex flex-col gap-4 p-5 border-b border-slate-200 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 class="text-lg font-semibold text-slate-950">Work Orders</h1>
        <p class="mt-1 text-sm text-slate-500">Create and manage hospital work orders</p>
      </div>
      <div class="flex flex-col gap-3 sm:flex-row">
        <label class="sr-only" for="work-order-search">Search work order</label>
        <input id="work-order-search" v-model="searchTerm" type="search" placeholder="Search Work ID, hospital or staff"
          class="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:w-72">
        <label class="sr-only" for="status-filter">Filter status</label>
        <select id="status-filter" v-model="statusFilter"
          class="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100">
          <option value="">All Status</option>
          <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
        </select>
        <button type="button"
          class="h-10 whitespace-nowrap rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
          @click="openCreateModal">Create Work Order</button>
      </div>
    </header>

    <div class="overflow-x-auto">
      <table class="min-w-full text-left text-sm">
        <thead class="bg-slate-50 font-semibold uppercase text-slate-500">
          <tr class="[&>th]:px-5 [&>th]:py-3">
            <th>Work ID.</th>
            <th>Hospital</th>
            <th>Period</th>
            <th>Staff</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredWorkOrders" :key="item.id"
            class="border-t border-slate-100 [&>td]:px-5 [&>td]:py-4">
            <td class="font-semibold text-slate-950">{{ item.workOrderId }}</td>
            <td>{{ hospitalName(item.hospitalId) }}</td>
            <td class="whitespace-nowrap">{{ formatDate(item.startDate) }} – {{ formatDate(item.endDate) }}</td>
            <td>{{ item.staffIds.length}}</td>
            <td><span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                :class="statusClass(item.status)">{{ item.status }}</span></td>
            <td>
              <div class="flex gap-2">
                <button type="button"
                  class="rounded-md border border-teal-200 px-3 py-1.5 text-xs font-semibold text-teal-700 hover:bg-teal-50"
                  @click="viewWorkOrder(item)">View</button>
                <button type="button"
                  class="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400"
                  @click="editWorkOrder(item)">Edit</button>
                <button type="button"
                  class="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                  @click="deleteWorkOrder(item.id)">Delete</button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredWorkOrders.length === 0">
            <td colspan="6" class="px-5 py-12 text-center text-slate-500">ไม่พบข้อมูล Work Order</td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-model="modalOpen" :title="editWorkOrderId ? 'Edit Work Order' : 'Create Work Order'">
      <p v-if="!editWorkOrderId" class="mb-4 rounded-md bg-teal-50 px-3 py-2 text-sm text-teal-700">
        Work ID จะถูกสร้างให้อัตโนมัติเมื่อบันทึก
      </p>
      <WorkOrderFormFields v-model="workorderForm" :errors="errors" />
      <template #footer><button type="button"
          class="rounded-md border border-slate-300 px-4 py-2 text-slate-600 hover:bg-slate-50"
          @click="closeModal">Cancel</button><button type="button"
          class="rounded-md bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800"
          @click="saveWorkOrder">Save</button></template>
    </BaseModal>

    <BaseModal v-model="viewModalOpen" title="Work Order Details">
      <dl v-if="selectedWorkOrder" class="grid gap-4 sm:grid-cols-2">
        <div v-for="detail in [
          ['Work ID', selectedWorkOrder.workOrderId],
          ['Hospital', hospitalName(selectedWorkOrder.hospitalId)],
          ['Start Date', formatDate(selectedWorkOrder.startDate)],
          ['End Date', formatDate(selectedWorkOrder.endDate)],
          ['Staff', selectedWorkOrder.staffIds.join(', ') || '-'],
          ['Status', selectedWorkOrder.status],
          ['Remark', selectedWorkOrder.remark || '-'],
          ['Created At', new Date(selectedWorkOrder.createdAt).toLocaleString('th-TH')],
          ['Updated At', new Date(selectedWorkOrder.updatedAt).toLocaleString('th-TH')],
        ]" :key="detail[0]" class="rounded-lg bg-slate-50 p-4">
          <dt class="text-xs font-semibold uppercase text-slate-500">{{ detail[0] }}</dt>
          <dd class="mt-1 text-sm text-slate-900">{{ detail[1] }}</dd>
        </div>
      </dl>
      <template #footer>
        <button type="button" class="rounded-md bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800" @click="viewModalOpen = false">Close</button>
      </template>
    </BaseModal>
  </section>
</template>
