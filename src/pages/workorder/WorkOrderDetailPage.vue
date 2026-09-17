<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseModal from '@/components/common/BaseModal.vue'
import { equipmentData } from '@/mock/EquipmentData'
import { hospitalData } from '@/mock/hospitalData'
import { departmentData } from '@/mock/departmentData'
import { workOrderData } from '@/mock/workorderData'
import { EquipOrderData } from '@/mock/workOrderEquipmentData'
import type { Equipment } from '@/types/equipment'
import type { WorkOrderEquipment } from '@/types/workorder'

type JobStatus = WorkOrderEquipment['status']
type JobType = WorkOrderEquipment['jobType']
interface EquipmentRow extends WorkOrderEquipment { equipment: Equipment }

const route = useRoute()
const workOrderId = computed(() => route.params.id as string)
const workOrder = computed(() => workOrderData.find((item) => item.id === workOrderId.value))
const hospitalName = computed(() => hospitalData.find((item) => item.id === workOrder.value?.hospitalId)?.hospitalNameTh ?? workOrder.value?.hospitalId ?? '-')
const workOrderEquipments = ref<WorkOrderEquipment[]>(EquipOrderData.map((item) => ({ ...item })))
const searchTerm = ref('')
const showFilters = ref(false)
const addModalOpen = ref(false)
const addError = ref('')
const addSearchTerm = ref('')
const addDepartmentFilter = ref('')
const filters = reactive({ department: '', jobType: '', status: '' })
const addForm = reactive({ equipmentIds: [] as string[] })
const statuses: JobStatus[] = ['Pending', 'In Progress', 'Completed']

const ordersEquip = computed(() => workOrderEquipments.value.filter((item) => item.workOrderId === workOrderId.value))
const equipmentRows = computed<EquipmentRow[]>(() => ordersEquip.value.flatMap((relation) => {
    const equipment = equipmentData.find((item) => item.id === relation.equipmentId)
    return equipment ? [{ ...relation, equipment }] : []
}))

const totalCount = computed(() => equipmentRows.value.length)
const completedCount = computed(() => equipmentRows.value.filter((item) => item.status === 'Completed').length)
const remainingCount = computed(() => totalCount.value - completedCount.value)
const activeFilterCount = computed(() => Object.values(filters).filter(Boolean).length)
const availableEquipments = computed(() => {
    if (!workOrder.value) return []

    return equipmentData.filter((equipment) => {
        const isSameHospital = equipment.hospitalId === workOrder.value?.hospitalId

        const isNotAdded = !ordersEquip.value.some((item) => item.equipmentId === equipment.id)

        return isSameHospital && isNotAdded
    })
})
const departmentName = (id: string) => departmentData.find((item) => item.id === id)?.departmentName ?? id
const addDepartmentOptions = computed(() => [
    ...new Set(availableEquipments.value.map((item) => item.department).filter(Boolean)),
])
const filteredAvailableEquipments = computed(() => {
    const keyword = addSearchTerm.value.trim().toLowerCase()
    return availableEquipments.value.filter((equipment) =>
        (!keyword || [equipment.equipmentId, equipment.equipmentName, equipment.assetNumber, equipment.workType]
            .some((value) => value.toLowerCase().includes(keyword)))
        && (!addDepartmentFilter.value || equipment.department === addDepartmentFilter.value),
    )
})
const selectedEquipments = computed(() => availableEquipments.value.filter((item) => addForm.equipmentIds.includes(item.id)))
const selectedVisibleCount = computed(() => filteredAvailableEquipments.value.filter((item) => addForm.equipmentIds.includes(item.id)).length)
const allSelected = computed(() => filteredAvailableEquipments.value.length > 0 && selectedVisibleCount.value === filteredAvailableEquipments.value.length)
const partiallySelected = computed(() => selectedVisibleCount.value > 0 && !allSelected.value)
const toggleSelectAll = () => {
    const visibleIds = new Set(filteredAvailableEquipments.value.map((item) => item.id))
    addForm.equipmentIds = allSelected.value
        ? addForm.equipmentIds.filter((id) => !visibleIds.has(id))
        : [...new Set([...addForm.equipmentIds, ...visibleIds])]
    addError.value = ''
}
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
    Object.assign(addForm, { equipmentIds: [], })
    addSearchTerm.value = ''
    addDepartmentFilter.value = ''
    addError.value = ''
    addModalOpen.value = true
}
const closeAddModal = () => { addModalOpen.value = false; addError.value = '' }
const createRelation = (equipment: Equipment): WorkOrderEquipment => ({
    id: crypto.randomUUID(), workOrderId: workOrderId.value, equipmentId: equipment.id,
    jobType: equipment.workType, status: 'Pending',
})
const addEquipment = () => {
    addError.value = ''
    if (selectedEquipments.value.length === 0) { addError.value = 'กรุณาเลือกเครื่องมืออย่างน้อย 1 เครื่อง'; return }
    workOrderEquipments.value.push(...selectedEquipments.value.map(createRelation))
    closeAddModal()
}
const removeEquipment = (id: string) => workOrderEquipments.value = workOrderEquipments.value.filter((item) => item.id !== id)
</script>

<template>
    <div class="space-y-6">
        <section class="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div
                class="flex flex-col gap-3 border-b border-slate-200 p-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <RouterLink :to="{ name: 'workorder' }"
                        class="my-2 text-sm font-semibold text-teal-600 transition hover:text-teal-900">
                        Black to WorkOrder
                    </RouterLink>
                    <h1 class="text-xl font-semibold text-slate-950">{{ workOrder?.workOrderId ??
                        'Work Order notfound' }}</h1>
                    <h2 class="mt-3 text-lg font-semibold text-slate-900">{{ hospitalName }}</h2>
                    <p class="mt-1 text-sm text-slate-500">{{ workOrder?.startDate ?? '-' }} - {{
                        workOrder?.endDate ?? '-' }}</p>
                </div>
                <span class="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{{
                    workOrder?.status ?? '-' }}</span>
            </div>
            <div class="grid gap-6 p-5 md:grid-cols-2">
                <div>
                    <p class="text-sm font-semibold text-slate-700">Assigned Staff</p>
                    <div class="mt-2 flex flex-wrap gap-2"><span v-for="staff in workOrder?.staffIds ?? []" :key="staff"
                            class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{{ staff
                            }}</span><span v-if="!workOrder?.staffIds.length" class="text-sm text-slate-400">-</span>
                    </div>
                </div>
                <div>
                    <p class="text-sm font-semibold text-slate-700">Remark</p>
                    <p class="mt-2 text-sm text-slate-500">{{ workOrder?.remark || '-' }}</p>
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
                            <th>Actions</th>
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
                            <td>
                                <button type="button"
                                    class="rounded-md border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                                    @click="removeEquipment(item.id)">Delete</button>
                            </td>
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
                    <legend class="mb-2 text-sm font-medium">เครื่องมือที่ยังไม่อยู่ในรอบงาน <span
                            class="text-rose-500">*</span></legend>
                    <div class="mb-3 grid gap-3 sm:grid-cols-2">
                        <label class="text-sm font-medium text-slate-700">Search
                            <input v-model="addSearchTerm" type="search" placeholder="Equipment ID, name, asset number"
                                class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100">
                        </label>
                        <label class="text-sm font-medium text-slate-700">Department
                            <select v-model="addDepartmentFilter"
                                class="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100">
                                <option value="">All Departments</option>
                                <option v-for="departmentId in addDepartmentOptions" :key="departmentId"
                                    :value="departmentId">{{ departmentName(departmentId) }}</option>
                            </select>
                        </label>
                    </div>
                    <div class="overflow-hidden rounded-md border"
                        :class="addError ? 'border-rose-500' : 'border-slate-200'">
                        <div class="flex items-center justify-between gap-3 bg-slate-50 px-3 py-3">
                            <label class="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
                                <input type="checkbox" :checked="allSelected" :indeterminate="partiallySelected"
                                    :disabled="filteredAvailableEquipments.length === 0" class="h-4 w-4 accent-teal-700"
                                    @change="toggleSelectAll">
                                เลือกทั้งหมดที่แสดง
                            </label>
                            <span class="text-xs text-slate-500">เลือก {{ selectedEquipments.length }} เครื่อง · พบ {{
                                filteredAvailableEquipments.length }} เครื่อง</span>
                        </div>
                        <div class="max-h-56 overflow-y-auto divide-y divide-slate-100">
                            <label v-for="equipment in filteredAvailableEquipments" :key="equipment.id"
                                class="flex cursor-pointer items-start gap-3 px-3 py-3 hover:bg-teal-50">
                                <input v-model="addForm.equipmentIds" type="checkbox" :value="equipment.id"
                                    class="mt-1 h-4 w-4 shrink-0 accent-teal-700" @change="addError = ''">
                                <span class="min-w-0 text-sm"><span class="block font-semibold text-slate-900">{{
                                    equipment.equipmentId }}</span>
                                    <span class="block text-slate-600">{{ equipment.equipmentName }}</span>
                                    <span class="block text-xs text-slate-400">Department: {{
                                        departmentName(equipment.department) }}</span>
                                    <span class="block text-xs font-medium text-teal-700">Job Type: {{
                                        equipment.workType }}</span>
                                </span>
                            </label>
                            <p v-if="filteredAvailableEquipments.length === 0"
                                class="p-4 text-center text-sm text-slate-500">
                                {{ availableEquipments.length === 0 ? 'ไม่มีเครื่องมือที่สามารถเพิ่มได้' :
                                    'ไม่พบเครื่องมือตามคำค้นหาและตัวกรอง' }}</p>
                        </div>
                    </div>
                    <p v-if="addError" class="mt-1 text-sm text-rose-500">{{ addError }}</p>
                </fieldset>
                <p class="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    <!-- เครื่องมือที่เพิ่มใหม่จะมีสถานะ <span class="font-semibold text-amber-700">Pending</span> อัตโนมัติ -->
                </p>
                <p v-if="availableEquipments.length === 0" class="rounded-md bg-amber-50 p-3 text-sm text-amber-700">
                    เครื่องมือทั้งหมดถูกเพิ่มในรอบงานนี้แล้ว</p>
            </div>
            <template #footer><button type="button"
                    class="rounded-md border border-slate-300 px-4 py-2 text-slate-600 hover:bg-slate-50"
                    @click="closeAddModal">Cancel</button><button type="button"
                    :disabled="selectedEquipments.length === 0"
                    class="rounded-md bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-50"
                    @click="addEquipment">Add ({{ selectedEquipments.length }})</button></template>
        </BaseModal>
    </div>
</template>
