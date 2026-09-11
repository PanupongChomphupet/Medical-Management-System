<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
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

const searchTerm = ref('')
const isOpen = ref(false)
const multiSelectRef = ref<HTMLDivElement | null>(null)
const model = defineModel<string[]>({ required: true })

const filteredOptions = computed(() => {
    const keyword = searchTerm.value.trim().toLowerCase()

    return props.options.filter((option) => {
        const isNotSelect = !model.value.includes(option.value)
        const matchesSearch =
            !keyword || option.label.toLowerCase().includes(keyword)
        return isNotSelect && matchesSearch
    })
})

const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node

    if (
        multiSelectRef.value &&
        !multiSelectRef.value.contains(target)
    ) {
        isOpen.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
const addOption = (value: string) => {
    if (!value) return

    if (!model.value.includes(value)) {
        model.value.push(value)
    }
    searchTerm.value = ''
    isOpen.value = false
}
const removeOption = (value: string) => {
    model.value = model.value.filter((item) => item !== value)
}
const getLabel = (value: string) => {
    return props.options.find((option) => option.value === value)?.label ?? value
}

</script>

<template>
    <div ref="multiSelectRef">
        <label class="mb-1 block text-sm font-medium">
            {{ props.title }} <span v-if="props.required" class="text-rose-500">*</span>
        </label>
        <div class="relative">
            <input v-model="searchTerm" type="text" :placeholder="props.placeholder" :disabled="props.disabled"
                @focus="isOpen = true"
                class="w-full px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100" />

            <div v-if="isOpen"
                class="absolute z-10 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-lg">
                <button v-for="option in filteredOptions" :key="option.value" type="button"
                    class="block w-full px-3 py-2 text-left text-sm hover:bg-slate-100"
                    @click="addOption(option.value)">
                    {{ option.label }}
                </button>
                <p v-if="filteredOptions.length === 0" class="p-3 text-sm text-slate-500">ไม่พบข้อมูล</p>
            </div>
        </div>
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