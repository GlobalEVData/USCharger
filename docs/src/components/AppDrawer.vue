<template>
  <el-drawer 
    :model-value="modelValue" 
    @update:model-value="$emit('update:modelValue', $event)"
    :show-close="true" 
    :with-header="true" 
    direction="rtl" 
    :size="'30%'"
  >
    <slot></slot>
  </el-drawer>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>

