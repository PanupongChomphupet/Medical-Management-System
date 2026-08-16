<script setup lang="ts">
interface SelectOption {
    label: string
    value: string | number
}

interface Props {
    title: string
    options: SelectOption[]
    placeholder?: string
    required?: boolean
    disabled?: boolean
    error?: string
}
const props = withDefaults(defineProps<Props>(), {
    placeholder: '',
    required: false,
    disabled: false,
    error: '',
})

const model = defineModel<string | number>({
    required: true
})
</script>
<template>
    <div>
        <label for="" class="mb-1 block text-sm font-medium">
            {{ props.title }} <span v-if="required">*</span>
        </label>
        <select v-model="model" :disabled="disabled" name="" id=""
            :class="['w-full px-3 py-2 outline-none border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 rounded-lg border']">
            <option value="">{{ props.placeholder }}</option>
            <option v-for="option in props.options" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>
        <p v-if="error" class="mt-1 text-sm text-red-500">{{ props.error }}</p>
    </div>


</template>