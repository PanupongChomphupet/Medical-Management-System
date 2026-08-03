<script setup lang="ts">
interface Props {
    title: string
    type?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    error?: string
}

const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    placeholder: '',
    required: false,
    disabled: false,
    error: '',
})

const model = defineModel<string>()
</script>

<template>
    <div>
        <label class="mb-1 block text-sm font-medium">
            {{ props.title }} <span v-if="props.required" class="text-rose-500">*</span>
        </label>
        <input v-model="model" type="text" :placeholder="props.placeholder" :disabled="props.disabled" :class="['w-full rounded-lg border border-slate-300 px-3 py-2 outline-none',
            error
                ? 'border-rose-600 focus:border-rose-600 focus:ring-rose-100'
                : 'focus:border-teal-600 focus:ring-2 focus:ring-teal-100',
            props.disabled && 'cursor-not-allowed bg-slate-50 text-slate-400',
        ]" />
        <p v-if="error" class="mt-1 text-sm text-red-500">{{ props.error }}</p>
    </div>
</template>