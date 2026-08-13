<script setup lang="ts">
import { ref, computed } from 'vue'
import { equipmentData } from '@/mock/EquipmentData';


const equipments = ref([...equipmentData])
const serachTerm = ref('')

const filteredEquipments = computed(() => {
  const keyword = serachTerm.value.trim().toLowerCase()
  return equipments.value.filter((equipment) => equipment.equipmentName.toLowerCase().includes(keyword))
})

</script>

<template>
  <div class="bg-white border border-slate-200 shadow-sm">
    <div class="flex flex-col gap-4 p-5 border-b border-slate-200 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h3 class="text-base font-semibold text-slate-950">Equipment</h3>
        <p class="mt-3 text-sm text-slate-500">Manage Equipment System</p>
      </div>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label class="sr-only" for="equipment-serach">Search equipment</label>
        <input class = "w-full h-10 px-3 text-sm text-slate-900 border border-slate-300 rounded-md outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 sm:w-72" type="search" id="equipment-search" v-model="serachTerm" placeholder="Search equipment">
        <button class="h-10 px-4 text-sm font-semibold text-white bg-teal-700 rounded-md shadow-sm transition hover:bg-teal-800" type="button">Add Equipment</button>
      </div>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full text-sm text-left divide-y divide-slate-200">
        <thead>
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
          <tr class ="[&>td]:px-5 [&>td]:py-3" v-for="equipment in filteredEquipments" :key="equipment.id">
            <td>{{ equipment.id }}</td>
            <td>{{ equipment.assetNumber }}</td>
            <td>{{ equipment.equipmentCode }}</td>
            <td>{{ equipment.equipmentName }}</td>
            <td>{{ equipment.status }}</td>
            <td></td>

          </tr>
          <tr v-if="filteredEquipments.length === 0">
            <td colspan="6" class ="px-5 py-10 text-sm text-center text-slate-500">
              ไม่พบข้อมูล
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
