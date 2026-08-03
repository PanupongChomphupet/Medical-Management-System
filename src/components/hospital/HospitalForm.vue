<script setup lang="ts">
import { reactive } from 'vue';
import BaseInput from '../common/ฺBaseInput.vue';
import BaseTextarea from '../common/BaseTextarea.vue';
import BaseSelect from '../common/BaseSelect.vue';
import type { HospitalForm } from '../../types/hospital';


const props = defineProps<{
    errors: {
        hospitalNameTh: string,
        hospitalNameEn: string,
        abbreviation: string,
        address: string,


    }
}>()
const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
]
const model = defineModel<HospitalForm>({ required: true })

</script>

<template>
    <div class="grid gap-4">
        <div>
            <BaseInput title="Hospital Name (TH)" v-model="model.hospitalNameTh" :error="props.errors.hospitalNameTh"
                required />
        </div>

        <div>
            <BaseInput title="Hospital Name (EN)" v-model="model.hospitalNameEn" />
        </div>

        <div>
            <BaseInput title="Hospital Code" v-model="model.abbreviation" :error="props.errors.abbreviation" />
        </div>

        <div>
            <BaseTextarea title="Address" v-model="model.address" />
        </div>
    </div>
</template>