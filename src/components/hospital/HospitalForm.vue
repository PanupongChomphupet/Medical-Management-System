<script setup lang="ts">
import { reactive } from 'vue';
import BaseInput from '../common/ฺBaseInput.vue';
import BaseTextarea from '../common/BaseTextarea.vue';

const model = defineModel<{
    hospitalNameTh: string,
    hospitalNameEn: string,
    abbreviation: string,
    address: string
}>({ required: true })

</script>

<template>
    <div class="grid gap-4">
        <div>
            <BaseInput title="Hospital Name (TH)" type="text" v-model="model.hospitalNameTh" />
        </div>

        <div>
            <BaseInput title="Hospital Name (EN)" type="text" v-model="model.hospitalNameEn" />
        </div>

        <div>
            <BaseInput title="Hospital Code" type="text" v-model="model.abbreviation" />
        </div>

        <div>
            <BaseTextarea title="Address" v-model="model.address" />
        </div>
    </div>
</template>