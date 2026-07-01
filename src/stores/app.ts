import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebarOpen = ref(false)

  const isSidebarOpen = computed(() => sidebarOpen.value)

  function openSidebar(): void {
    sidebarOpen.value = true
  }

  function closeSidebar(): void {
    sidebarOpen.value = false
  }

  return {
    sidebarOpen,
    isSidebarOpen,
    openSidebar,
    closeSidebar,
  }
})
