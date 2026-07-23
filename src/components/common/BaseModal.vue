<script setup lang="ts">

interface Props {
    modelValue: boolean
    title: string
}
defineProps < Props > ()

const emit = defineEmits < {
    (e: 'update:modelValue', value: boolean): void
}> ()

const close = () => {
    emit('update:modelValue', false)
}



</script>

<template>
    <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div class="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                <h2 class="text-lg font-bold">
                    {{ title }}
                </h2>

                <button @click="close" class="text-2xl leading-none text-gray-500 hover:text-gray-700">
                    ×
                </button>
            </div>

            <!-- Body -->
            <div class="p-6">
                <slot />
            </div>

            <!-- Footer -->
            <div class="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>