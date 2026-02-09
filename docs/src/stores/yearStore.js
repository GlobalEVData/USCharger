// stores/yearStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useYearStore = defineStore('Year', () => {
  // 响应式对象
  const currentYear = ref(2014);

  return {
    currentYear,
  }
})