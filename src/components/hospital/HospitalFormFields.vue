<script setup lang="ts">
import { reactive } from 'vue';
import BaseInput from '../common/ฺBaseInput.vue';
import BaseTextarea from '../common/BaseTextarea.vue';
import BaseSelect from '../common/BaseSelect.vue';
import type { HospitalForm } from '@/types/hospital.ts';


defineProps<{ errors: { hospitalNameTh: string, abbreviation: string } }>()
const statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
]
const model = defineModel<HospitalForm>({ required: true })

</script>
<template>
    <section class="space-y-4">
        <div>
            <div class="grid gap-4 sm:grid-cols-2">
                <BaseInput title="Hospital Name (TH)" v-model="model.hospitalNameTh" :error="errors.hospitalNameTh"
                    required />
                <BaseInput title="Hospital Name (EN)" v-model="model.hospitalNameEn" />
                <BaseInput title="Hospital Code" v-model="model.initial" :error="errors.abbreviation" />
                <BaseInput title="ที่อยู่" v-model="model.address" />
                <BaseInput title="ตำลบ" v-model="model.subdistrict" />
                <BaseInput title="อำเภอ" v-model="model.district" />
                <BaseInput title="จังหวัด" v-model="model.province" />
                <BaseInput title="รหัสไปรษณีย์" v-model="model.postalCode" />
                <BaseSelect title="สถานะ" v-model="model.status" :options="statusOptions" />
            </div>

        </div>
    </section>
</template>