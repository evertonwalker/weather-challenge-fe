<script setup lang="ts">
defineProps<{
  color: string
  name: string
}>()
</script>

<template>
  <button class="button-place" :style="{ backgroundColor: color }" type="button">
    {{ name }}
  </button>
</template>

<style scoped>
.button-place {
  width: 133px;
  height: 38px;
  border: none;
  border-radius: 8px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
}
</style>
