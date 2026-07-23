<script setup lang="ts">
import { reactive } from 'vue';

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
            <label class="mb-1 block text-sm font-medium">
                Hospital Name (TH)
            </label>

            <input v-model="model.hospitalNameTh" type="text"
                class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none" />
        </div>

        <div>
            <label class="mb-1 block text-sm font-medium">
                Hospital Name (EN)
            </label>

            <input v-model="model.hospitalNameEn" type="text"
                class="w-full rounded-lg border border-slate-300 outline-none px-3 py-2" />
        </div>

        <div>
            <label class="mb-1 block text-sm font-medium">
                Hospital Code
            </label>

            <input v-model="model.abbreviation" type="text"
                class="w-full rounded-lg border border-slate-300 outline-none px-3 py-2" />
        </div>

        <div>
            <label class="mb-1 block text-sm font-medium">
                Address
            </label>
            <textarea v-model="model.address" rows="3"
                class="w-full rounded-lg border border-slate-300 outline-none px-3 py-2" />
        </div>
    </div>
</template>