<script setup lang="ts">
interface SelectOption {
    label: string;
    value: string;
}

interface Props {
    title: string;
    options: SelectOption[];
    placeholder?: string;
    errorMessage?: string;
    disabled?: boolean;
    required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    placeholder: 'Select...',
    required: false,
    disabled: false,
    errorMessage: '',
})

const model = defineModel<string[]>({ required: true })

const addOption = (value: string) => {
    if (!value) return

    if (!model.value.includes(value)) {
        model.value.push(value)
    }
}
const removeOption = (value: string) => {
    model.value = model.value.filter((item) => item !== value)
}
const getLabel = (value: string) => {
    return props.options.find((option) => option.value === value)?.label ?? value
}

</script>

<template>
    <div>
        <label class="mb-1 block text-sm font-medium">
            {{ props.title }} <span v-if="props.required" class="text-rose-500">*</span>
        </label>
        <select v-model="model" :disabled="props.disabled" multiple :class="[
            'w-full px-3 py-2 outline-none border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100 rounded-lg border',
            props.errorMessage
                ? 'border-red-500 focus:border-red-500'
                : 'border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-100',
            props.disabled && 'cursor-not-allowed bg-slate-100',
        ]" @change="addOption(($event.target as HTMLSelectElement).value)">
            <option value="">{{ props.placeholder }}</option>
            <option v-for="option in props.options" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>
        <div v-if="model.length > 0" class="flex flex-wrap gap-2 mt-3">
            <span v-for="value in model" :key="value"
                class="inline-flex items-center gap-1 px-2 py-1 text-sm text-slate-700 bg-slate-100 rounded-full">
                {{ getLabel(value) }}

                <button type="button" :disabled="props.disabled" class="text-slate-400 hover:text-rose-600"
                    @click="removeOption(value)">
                    ×
                </button>
            </span>
        </div>
        <p v-if="props.errorMessage" class="mt-1 text-sm text-red-500">{{ props.errorMessage }}</p>
    </div>
</template>