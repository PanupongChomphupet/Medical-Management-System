<script setup lang="ts">
import { computed } from 'vue'
import type { WorkOrderForm } from '@/types/workorder'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseMultiSelect from '@/components/common/BaseMultiSelect.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue'
import { hospitalData } from '@/mock/hospitalData'

defineProps<{ errors: { hospitalId: string; startDate: string; endDate: string; staffIds: string } }>()
const model = defineModel<WorkOrderForm>({ required: true })
const hospitals = computed(() => hospitalData.map((hospital) => ({ label: hospital.hospitalNameTh, value: hospital.id })))
const staffOptions = ['USERID1', 'USERID2', 'USERID3', 'USERID4'].map((id) => ({ label: id, value: id }))
const statusOptions = ['Pending', 'In Progress', 'Completed'].map((status) => ({ label: status, value: status }))
</script>

<template>
  <div class="grid max-h-[65vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
    <BaseSelect v-model="model.hospitalId" title="Hospital" placeholder="Select hospital" required :options="hospitals" :error="errors.hospitalId" />
    <BaseSelect v-model="model.status" title="Status" required :options="statusOptions" />
    <label class="text-sm font-medium">Start Date <span class="text-rose-500">*</span>
      <input v-model="model.startDate" type="date" class="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" :class="errors.startDate ? 'border-rose-500' : 'border-slate-300'">
      <span v-if="errors.startDate" class="mt-1 block text-sm text-rose-500">{{ errors.startDate }}</span>
    </label>
    <label class="text-sm font-medium">End Date <span class="text-rose-500">*</span>
      <input v-model="model.endDate" type="date" class="mt-1 w-full rounded-lg border px-3 py-2 outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" :class="errors.endDate ? 'border-rose-500' : 'border-slate-300'">
      <span v-if="errors.endDate" class="mt-1 block text-sm text-rose-500">{{ errors.endDate }}</span>
    </label>
    <div class="sm:col-span-2"><BaseMultiSelect v-model="model.staffIds" title="Staff" required :options="staffOptions" :error-message="errors.staffIds" /></div>
    <div class="sm:col-span-2"><BaseTextarea v-model="model.remark" title="Remark" /></div>
  </div>
</template>
