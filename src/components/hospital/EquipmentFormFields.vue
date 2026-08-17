<script setup lang="ts">
import type { EquipmentForm } from '@/types/equipment'
import BaseInput from '@/components/common/ฺBaseInput.vue'
import BaseSelect from '@/components/common/BaseSelect.vue'
import BaseTextarea from '@/components/common/BaseTextarea.vue'

defineProps<{ errorMessage: { equipmentId: string; equipmentName: string } }>()
const model = defineModel<EquipmentForm>({ required: true })
const departments = [{ label: 'ER', value: 'ER' }, { label: 'OPD', value: 'OPD' }, { label: 'TTM', value: 'TTM' }]
const workTypes = [{ label: 'Preventive Maintenance', value: 'Preventive Maintenance' }, { label: 'Calibration', value: 'Calibration' }, { label: 'Repair', value: 'Repair' }]
const riskLevels = [{ label: 'Low', value: 'Low' }, { label: 'Medium', value: 'Medium' }, { label: 'High', value: 'High' }]
const statuses = [{ label: 'Active', value: 'Active' }, { label: 'Maintenance', value: 'Maintenance' }, { label: 'Inactive', value: 'Inactive' }]
</script>

<template>
  <div class="grid max-h-[65vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
    <BaseInput v-model="model.assetNumber" title="เลขครุภัณฑ์" />
    <BaseInput v-model="model.equipmentId" title="รหัสเครื่องมือ" required :error="errorMessage.equipmentId" />
    <BaseInput v-model="model.equipmentName" title="ชื่อเครื่องมือ" required :error="errorMessage.equipmentName" />
    <BaseInput v-model="model.manufacturer" title="ผู้ผลิต" />
    <BaseInput v-model="model.model" title="รุ่น" />
    <BaseInput v-model="model.serialNumber" title="หมายเลขซีเรียล" />
    <BaseSelect v-model="model.department" title="แผนก" placeholder="เลือกแผนก" :options="departments" />
    <BaseSelect v-model="model.workType" title="ประเภทงาน" placeholder="เลือกประเภทงาน" :options="workTypes" />
    <BaseSelect v-model="model.riskLevel" title="ระดับความเสี่ยง" placeholder="เลือกระดับความเสี่ยง"
      :options="riskLevels" />
    <BaseInput v-model="model.registeredBy" title="ผู้ลงทะเบียน" />
    <BaseSelect v-model="model.status" title="สถานะ" :options="statuses" />
    <div class="sm:col-span-2">
      <BaseTextarea v-model="model.remark" title="หมายเหตุ" />
    </div>
  </div>
</template>
