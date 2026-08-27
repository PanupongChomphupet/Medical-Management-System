<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseModal from '@/components/common/BaseModal.vue'
import { equipmentData } from '@/mock/EquipmentData'
import { hospitalData } from '@/mock/hospitalData'
import { departmentData } from '@/mock/departmentData'
import { workOrder } from '@/mock/workorderData'
import { EquipOrderData } from '@/mock/workOrderEquipmentData'
import type { Equipment } from '@/types/equipment'
import type { WorkOrderEquipmentType } from '@/types/workorder'

type JobStatus = WorkOrderEquipmentType['status']
type JobType = WorkOrderEquipmentType['jobType']
type AddMode = 'single' | 'all'
interface EquipmentRow extends WorkOrderEquipmentType { equipment: Equipment }

const workOrderId = String(useRoute().params.id)
const workOrderData = computed(() => workOrder.find((item) => item.id === workOrderId))
const hospitalName = computed(() => hospitalData.find((item) => item.id === workOrderData.value?.hospitalId)?.hospitalNameTh ?? workOrderData.value?.hospitalId ?? '-')
const workOrderEquipments = ref<WorkOrderEquipmentType[]>(EquipOrderData.map((item) => ({ ...item })))
const searchTerm = ref('')
const showFilters = ref(false)
const addModalOpen = ref(false)
const addError = ref('')
const filters = reactive({ department: '', jobType: '', status: '' })
const addForm = reactive<{ mode: AddMode; equipmentId: string; jobType: JobType; status: JobStatus }>({ mode: 'single', equipmentId: '', jobType: 'CAL', status: 'Pending' })
const statuses: JobStatus[] = ['Pending', 'In Progress', 'Completed']
const jobTypes: JobType[] = ['CAL', 'PM', 'CAL/PM']

const relationsForThisWorkOrder = computed(() => workOrderEquipments.value.filter((item) => item.workOrderId === workOrderId))
const equipmentRows = computed<EquipmentRow[]>(() => relationsForThisWorkOrder.value.flatMap((relation) => {
    const equipment = equipmentData.find((item) => item.id === relation.equipmentId)
    return equipment ? [{ ...relation, equipment }] : []
}))
const totalCount = computed(() => equipmentRows.value.length)
const completedCount = computed(() => equipmentRows.value.filter((item) => item.status === 'Completed').length)
const remainingCount = computed(() => totalCount.value - completedCount.value)
const activeFilterCount = computed(() => Object.values(filters).filter(Boolean).length)
const availableEquipments = computed(() => equipmentData.filter((equipment) =>
    !relationsForThisWorkOrder.value.some((item) => item.equipmentId === equipment.id),
))
const departmentName = (id: string) => departmentData.find((item) => item.id === id)?.departmentName ?? id
const uniqueValues = (field: 'department' | 'jobType') => field === 'department'
    ? [...new Set(equipmentRows.value.map((item) => item.equipment.department).filter(Boolean))]
    : [...new Set(equipmentRows.value.map((item) => item.jobType).filter(Boolean))]
const filteredEquipments = computed(() => {
    const keyword = searchTerm.value.trim().toLowerCase()
    return equipmentRows.value.filter((item) =>
        (!keyword || [item.equipment.equipmentId, item.equipment.equipmentName, departmentName(item.equipment.department), item.jobType]
            .some((value) => value.toLowerCase().includes(keyword)))
        && (!filters.department || item.equipment.department === filters.department)
        && (!filters.jobType || item.jobType === filters.jobType)
        && (!filters.status || item.status === filters.status),
    )
})

const statusClass = (status: JobStatus) => ({ Pending: 'bg-amber-100 text-amber-700', 'In Progress': 'bg-blue-100 text-blue-700', Completed: 'bg-emerald-100 text-emerald-700' }[status])
const clearFilters = () => Object.assign(filters, { department: '', jobType: '', status: '' })
const openAddModal = () => {
    Object.assign(addForm, { mode: 'single', equipmentId: '', jobType: 'CAL', status: 'Pending' })
    addError.value = ''
    addModalOpen.value = true
}
const closeAddModal = () => { addModalOpen.value = false; addError.value = '' }
const createRelation = (equipment: Equipment): WorkOrderEquipmentType => ({
    id: crypto.randomUUID(), workOrderId, equipmentId: equipment.id,
    jobType: addForm.jobType, status: addForm.status,
})
const addEquipment = () => {
    addError.value = ''
    if (addForm.mode === 'all') {
        workOrderEquipments.value.push(...availableEquipments.value.map(createRelation))
        closeAddModal()
        return
    }
    const equipment = availableEquipments.value.find((item) => item.id === addForm.equipmentId)
    if (!equipment) { addError.value = 'กรุณาเลือกเครื่องมือ'; return }
    workOrderEquipments.value.push(createRelation(equipment))
    closeAddModal()
}
</script>

<template>
    <div class="space-y-6">
        <section class="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div
                class="flex flex-col gap-3 border-b border-slate-200 p-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h1 class="text-xl font-semibold text-slate-950">{{ workOrderData?.workOrderId ??
                        'Work Order notfound' }}</h1>
                    <h2 class="mt-3 text-lg font-semibold text-slate-900">{{ hospitalName }}</h2>
                    <p class="mt-1 text-sm text-slate-500">{{ workOrderData?.startDate ?? '-' }} - {{
                        workOrderData?.endDate ?? '-' }}</p>
                </div>
                <span class="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{{
                    workOrderData?.status ?? '-' }}</span>
            </div>
            <div class="grid gap-6 p-5 md:grid-cols-2">
                <div>
                    <p class="text-sm font-semibold text-slate-700">Assigned Staff</p>
                    <div class="mt-2 flex flex-wrap gap-2"><span v-for="staff in workOrderData?.staffIds ?? []"
                            :key="staff"
                            class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{{ staff
                            }}</span><span v-if="!workOrderData?.staffIds.length"
                            class="text-sm text-slate-400">-</span></div>
                </div>
                <div>
                    <p class="text-sm font-semibold text-slate-700">Remark</p>
                    <p class="mt-2 text-sm text-slate-500">{{ workOrderData?.remark || '-' }}</p>
                </div>
            </div>
        </section>

        <section>
            <h2 class="mb-3 text-base font-semibold text-slate-950">Summary</h2>
            <div class="grid gap-4 md:grid-cols-3">
                <article
                    v-for="card in [{ title: 'เครื่องมือทั้งหมดในรอบงาน', value: totalCount, style: 'border-slate-200 text-slate-950' }, { title: 'เสร็จแล้ว', value: completedCount, style: 'border-emerald-200 text-emerald-700' }, { title: 'เหลืออยู่', value: remainingCount, style: 'border-amber-200 text-amber-700' }]"
                    :key="card.title" class="rounded-lg border bg-white p-4 shadow-sm" :class="card.style">
                    <p class="text-sm font-medium text-slate-500">{{ card.title }}</p>
                    <p class="mt-2 text-3xl font-bold">{{ card.value }}</p>
                </article>
            </div>
        </section>

        <section class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <header
                class="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h2 class="text-base font-semibold text-slate-950">เครื่องมือในรอบงานนี้</h2>
                    <p class="mt-1 text-sm text-slate-500">จัดการรายการและติดตามสถานะงานของเครื่องมือ</p>
                </div>
                <div class="flex flex-col gap-3 sm:flex-row"><input v-model="searchTerm" type="search"
                        placeholder="Search equipment"
                        class="h-10 w-full rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:w-64"><button
                        type="button"
                        class="h-10 rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        :class="showFilters ? 'border-teal-600 bg-teal-50 text-teal-700' : ''"
                        @click="showFilters = !showFilters">Filter<span v-if="activeFilterCount"> ({{ activeFilterCount
                        }})</span></button><button type="button"
                        class="h-10 whitespace-nowrap rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
                        @click="openAddModal">Add Equipment</button></div>
            </header>
            <div v-if="showFilters"
                class="grid gap-4 border-b border-slate-200 bg-slate-50 p-5 sm:grid-cols-2 lg:grid-cols-4">
                <label class="text-sm font-medium">Department<select v-model="filters.department"
                        class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2">
                        <option value="">ทั้งหมด</option>
                        <option v-for="value in uniqueValues('department')" :key="value" :value="value">{{
                            departmentName(value) }}</option>
                    </select></label>
                <label class="text-sm font-medium">Job Type<select v-model="filters.jobType"
                        class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2">
                        <option value="">ทั้งหมด</option>
                        <option v-for="value in uniqueValues('jobType')" :key="value">{{ value }}</option>
                    </select></label>
                <label class="text-sm font-medium">Status<select v-model="filters.status"
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
                        <tr v-for="item in filteredEquipments" :key="item.id"
                            class="border-t border-slate-100 [&>td]:px-5 [&>td]:py-4">
                            <td class="font-semibold text-slate-950">{{ item.equipment.equipmentId }}</td>
                            <td>{{ item.equipment.equipmentName }}</td>
                            <td>{{ departmentName(item.equipment.department) }}</td>
                            <td>{{ item.jobType }}</td>
                            <td><span class="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold"
                                    :class="statusClass(item.status)">{{ item.status }}</span></td>
                        </tr>
                        <tr v-if="filteredEquipments.length === 0">
                            <td colspan="5" class="px-5 py-12 text-center text-slate-500">ไม่พบข้อมูลเครื่องมือ</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>

        <BaseModal v-model="addModalOpen" title="Add Equipment">
            <div class="grid gap-4">
                <fieldset>
                    <legend class="mb-2 text-sm font-medium">รูปแบบการเพิ่ม</legend>
                    <div class="grid gap-2 sm:grid-cols-2"><label
                            v-for="mode in [{ value: 'single', label: 'เลือกเครื่องมือ' }, { value: 'all', label: `เครื่องมือทั้งหมด (${availableEquipments.length})` }]"
                            :key="mode.value" class="flex cursor-pointer items-center gap-2 rounded-md border p-3"
                            :class="addForm.mode === mode.value ? 'border-teal-600 bg-teal-50' : 'border-slate-200'"><input
                                v-model="addForm.mode" type="radio" :value="mode.value">{{ mode.label }}</label></div>
                </fieldset>
                <label v-if="addForm.mode === 'single'" class="text-sm font-medium">Equipment <span
                        class="text-rose-500">*</span><select v-model="addForm.equipmentId"
                        class="mt-1 w-full rounded-md border bg-white px-3 py-2"
                        :class="addError ? 'border-rose-500' : 'border-slate-300'">
                        <option value="">Select equipment</option>
                        <option v-for="equipment in availableEquipments" :key="equipment.id" :value="equipment.id">{{
                            equipment.equipmentId }} — {{ equipment.equipmentName }}</option>
                    </select><span v-if="addError" class="mt-1 block text-sm text-rose-500">{{ addError
                    }}</span></label>
                <p v-else class="rounded-md bg-teal-50 p-3 text-sm text-teal-700">
                    จะเพิ่มเครื่องมือที่ยังไม่อยู่ในรอบงานนี้จำนวน {{ availableEquipments.length }} เครื่อง</p>
                <label class="text-sm font-medium">Job Type<select v-model="addForm.jobType"
                        class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2">
                        <option v-for="jobType in jobTypes" :key="jobType">{{ jobType }}</option>
                    </select></label>
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
                    @click="addEquipment">{{ addForm.mode === 'all' ? 'Add All' : 'Add' }}</button></template>
        </BaseModal>
    </div>
</template>
