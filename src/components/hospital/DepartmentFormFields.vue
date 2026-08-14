<script setup lang="ts">
import BaseInput from '../common/ฺBaseInput.vue';
import type { DepartmentForm } from '@/types/department.ts';

const props = defineProps<{
    errors: {
        departmentName: string,
    }
}>()

const model = defineModel<DepartmentForm>({ required: true })

</script>

<template>
    <div class="grid gap-4">
        <div>
            <BaseInput title="ชื่อแผนก" v-model="model.departmentName" :error="props.errors.departmentName"
                required />
        </div>
        <div>
            <BaseInput title="รายละเอียด" v-model="model.departmentCode" required />
        </div>
    </div>
</template>