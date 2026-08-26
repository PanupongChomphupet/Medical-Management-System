<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseModal from '@/components/common/BaseModal.vue'
import { equipmentData } from '@/mock/EquipmentData'
import { workOrder } from '@/mock/workorderData'
import type { Equipment } from '@/types/equipment'

type JobStatus = 'Pending' | 'In Progress' | 'Completed'
interface WorkOrderEquipment extends Equipment {
    jobType: string
    jobStatus: JobStatus
}

const workOrderEquipments = ref<WorkOrderEquipment[]>(
    equipmentData.slice(0, 1).map((equipment) => ({
        ...equipment,
        jobType: equipment.workType,
        jobStatus: 'Completed',
    })),
)
const workOrderID = String(useRoute().params.id)
const workOrderData = workOrder.find((item) => item.id === workOrderID)
console.log(workOrderData)
const workOrderHospital= computed(() => {
    workOrder.find((item) => item.id === workOrderID)
})
console.log(workOrderHospital)

const searchTerm = ref('')
const showFilters = ref(false)
const addModalOpen = ref(false)
const addError = ref('')
const filters = reactive({ department: '', jobType: '', status: '' })
const addForm = reactive({ equipmentId: '', jobType: '', status: 'Pending' as JobStatus })
const statuses: JobStatus[] = ['Pending', 'In Progress', 'Completed']

const totalCount = computed(() => workOrderEquipments.value.length)
const completedCount = computed(() => workOrderEquipments.value.filter((item) => item.jobStatus === 'Completed').length)
const remainingCount = computed(() => totalCount.value - completedCount.value)
const activeFilterCount = computed(() => Object.values(filters).filter(Boolean).length)
const availableEquipments = computed(() => equipmentData.filter(
    (equipment) => !workOrderEquipments.value.some((item) => item.id === equipment.id),
))
const uniqueValues = (field: 'department' | 'jobType') => [
    ...new Set(workOrderEquipments.value.map((item) => item[field]).filter(Boolean)),
]
const filteredEquipments = computed(() => {
    const keyword = searchTerm.value.trim().toLowerCase()
    return workOrderEquipments.value.filter((item) =>
        (!keyword || [item.equipmentId, item.equipmentName, item.department, item.jobType]
            .some((value) => value.toLowerCase().includes(keyword)))
        && (!filters.department || item.department === filters.department)
        && (!filters.jobType || item.jobType === filters.jobType)
        && (!filters.status || item.jobStatus === filters.status),
    )
})

const statusClass = (status: JobStatus) => ({
    Pending: 'bg-amber-100 text-amber-700',
    'In Progress': 'bg-blue-100 text-blue-700',
    Completed: 'bg-emerald-100 text-emerald-700',
}[status])
const clearFilters = () => Object.assign(filters, { department: '', jobType: '', status: '' })
const openAddModal = () => {
    Object.assign(addForm, { equipmentId: '', jobType: '', status: 'Pending' })
    addError.value = ''
    addModalOpen.value = true
}
const closeAddModal = () => {
    addModalOpen.value = false
    addError.value = ''
}
const addEquipment = () => {
    addError.value = ''
    const equipment = equipmentData.find((item) => item.id === addForm.equipmentId)
    if (!equipment) {
        addError.value = 'กรุณาเลือกเครื่องมือ'
        return
    }
    workOrderEquipments.value.push({
        ...equipment,
        jobType: addForm.jobType.trim() || equipment.workType,
        jobStatus: addForm.status,
    })
    closeAddModal()
}
</script>

<template>
    <div class="space-y-6">
        <!-- Work Order Main -->
        <div class="bg-white border border-slate-200 rounded-lg shadow-sm">
            <div
                class="flex flex-col gap-3 p-5 border-b border-slate-200 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h1 class="text-xl font-semibold text-slate-950">{{ workOrderData?.workOrderId}}</h1>
                    <h2 class="mt-3 text-lg font-semibold text-slate-900">{{ workOrderData?.hospitalId  }}</h2>
                    <p class="mt-1 text-sm text-slate-500">{{ workOrderData?.startDate }} - {{ workOrderData?.endDate }}</p>
                </div>
                <span class="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{{ workOrderData?.status }}</span>
            </div>
            <div class="grid gap-6 p-5 md:grid-cols-2">
                <div>
                    <p class="text-sm font-semibold text-slate-700">Assigned Staff</p>
                    <div class="mt-2 flex flex-wrap gap-2">
                        <span v-for="staff in ['PANUPONG CHOMPHUPET', 'THANAKRIT CHOMPHUPET', 'CHAIWUT CHOMPHUPET']"
                            :key="staff"
                            class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{{ staff
                            }}</span>
                    </div>
                </div>
                <div>
                    <p class="text-sm font-semibold text-slate-700">Remark</p>
                    <p class="mt-2 text-sm text-slate-500">จำกัดจำนวนเครื่องมือที่ 250 เครื่อง บวกลบได้ 10 เครื่อง</p>
                </div>
            </div>
        </div>

        <!-- Summary -->
        <div>
            <h2 class="mb-3 text-base font-semibold text-slate-950">Summary</h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <article v-for="card in [
                    { title: 'เครื่องมือทั้งหมดในรอบงาน', value: totalCount, style: 'border-slate-200 text-slate-950' },
                    { title: 'เสร็จแล้ว', value: completedCount, style: 'border-emerald-200 text-emerald-700' },
                    { title: 'เหลืออยู่', value: remainingCount, style: 'border-amber-200 text-amber-700' },
                ]" :key="card.title" class="rounded-lg border bg-white p-4 shadow-sm" :class="card.style">
                    <p class="text-sm font-medium text-slate-500">{{ card.title }}</p>
                    <p class="mt-2 text-3xl font-bold">{{ card.value }}</p>
                </article>
            </div>
        </div>

        <!-- Equipment in this work order -->
        <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <header
                class="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 class="text-base font-semibold text-slate-950">เครื่องมือในรอบงานนี้</h2>
                    <p class="mt-1 text-sm text-slate-500">จัดการรายการและติดตามสถานะงานของเครื่องมือ</p>
                </div>
                <div class="flex flex-col gap-3 sm:flex-row">
                    <label class="sr-only" for="equipment-search">Search equipment</label>
                    <input id="equipment-search" v-model="searchTerm" type="search" placeholder="Search equipment"
                        class="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:w-64">
                    <button type="button"
                        class="h-10 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        :class="showFilters ? 'border-teal-600 bg-teal-50 text-teal-700' : ''"
                        @click="showFilters = !showFilters">Filter<span v-if="activeFilterCount"> ({{ activeFilterCount
                            }})</span></button>
                    <button type="button"
                        class="h-10 whitespace-nowrap rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
                        @click="openAddModal">Add Equipment</button>
                </div>
            </header>

            <div v-if="showFilters"
                class="grid gap-4 border-b border-slate-200 bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-4">
                <label class="text-sm font-medium text-slate-700">Department<select v-model="filters.department"
                        class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2">
                        <option value="">ทั้งหมด</option>
                        <option v-for="value in uniqueValues('department')" :key="value">{{ value }}</option>
                    </select></label>
                <label class="text-sm font-medium text-slate-700">Job Type<select v-model="filters.jobType"
                        class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2">
                        <option value="">ทั้งหมด</option>
                        <option v-for="value in uniqueValues('jobType')" :key="value">{{ value }}</option>
                    </select></label>
                <label class="text-sm font-medium text-slate-700">Status<select v-model="filters.status"
                        class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2">
                        <option value="">ทั้งหมด</option>
                        <option v-for="status in statuses" :key="status">{{ status }}</option>
                    </select></label>
                <div class="flex items-end"><button type="button"
                        class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                        @click="clearFilters">Clear Filters</button></div>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full text-left text-sm">
                    <thead class="bg-slate-50 font-semibold uppercase text-slate-500">
                        <tr class="[&>th]:px-5 [&>th]:py-3">
                            <th>Equipment ID</th>
                            <th>Equipment Name</th>
                            <th>Department</th>
                            <th>Job Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="equipment in filteredEquipments" :key="equipment.id"
                            class="border-t border-slate-100 [&>td]:px-5 [&>td]:py-4">
                            <td class="font-semibold text-slate-950">{{ equipment.equipmentId }}</td>
                            <td>{{ equipment.equipmentName }}</td>
                            <td>{{ equipment.department || '-' }}</td>
                            <td>{{ equipment.jobType || '-' }}</td>
                            <td><span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                    :class="statusClass(equipment.jobStatus)">{{ equipment.jobStatus }}</span></td>
                        </tr>
                        <tr v-if="filteredEquipments.length === 0">
                            <td colspan="5" class="px-5 py-12 text-center text-slate-500">ไม่พบข้อมูลเครื่องมือ</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <BaseModal v-model="addModalOpen" title="Add Equipment">
            <div class="grid gap-4">
                <label class="text-sm font-medium">Equipment <span class="text-rose-500">*</span>
                    <select v-model="addForm.equipmentId"
                        class="mt-1 w-full rounded-md border bg-white px-3 py-2 outline-none focus:border-teal-600"
                        :class="addError ? 'border-rose-500' : 'border-slate-300'">
                        <option value="">Select equipment</option>
                        <option v-for="equipment in availableEquipments" :key="equipment.id" :value="equipment.id">{{
                            equipment.equipmentId }} — {{ equipment.equipmentName }}</option>
                    </select><span v-if="addError" class="mt-1 block text-sm text-rose-500">{{ addError }}</span>
                </label>
                <label class="text-sm font-medium">Job Type<input v-model="addForm.jobType"
                        placeholder="ใช้ Work Type เดิมหากไม่ระบุ"
                        class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-teal-600"></label>
                <label class="text-sm font-medium">Status<select v-model="addForm.status"
                        class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2">
                        <option v-for="status in statuses" :key="status">{{ status }}</option>
                    </select></label>
                <p v-if="availableEquipments.length === 0" class="rounded-md bg-amber-50 p-3 text-sm text-amber-700">
                    เครื่องมือทั้งหมดถูกเพิ่มในรอบงานนี้แล้ว</p>
            </div>
            <template #footer><button type="button"
                    class="rounded-md border border-slate-300 px-4 py-2 text-slate-600 hover:bg-slate-50"
                    @click="closeAddModal">Cancel</button><button type="button"
                    :disabled="availableEquipments.length === 0"
                    class="rounded-md bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                    @click="addEquipment">Add</button></template>
        </BaseModal>
    </div>
</template>
