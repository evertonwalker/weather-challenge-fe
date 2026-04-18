<template>
  <div class="input-place">
    <input v-model="query" class="input-place__field" type="text" autocomplete="off" placeholder="Country or city"
      @keydown.enter.prevent="emitSearch" />
    <button type="button" class="input-place__btn" @click="emitSearch">Search</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const query = ref('')

const emit = defineEmits<{
  search: [value: string]
}>()

function emitSearch() {
  emit('search', query.value.trim())
}

defineExpose({
  clear: () => {
    query.value = ''
  },
})
</script>

<style scoped>
.input-place {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
}

.input-place__field {
  flex: 1 1 160px;
  min-width: 0;
  height: 38px;
  padding: 0 0.75rem;
  border: 1px solid rgba(0, 17, 51, 0.12);
  border-radius: 8px;
  font-size: 0.95rem;
  color: var(--color-primary);
  background: #fff;
}

.input-place__field::placeholder {
  color: rgba(0, 17, 51, 0.35);
}

.input-place__field:focus {
  outline: 2px solid #c3e0fb;
  outline-offset: 0;
  border-color: transparent;
}

.input-place__btn {
  height: 38px;
  padding: 0 1rem;
  border: none;
  border-radius: 8px;
  font-weight: var(--font-weight-semibold);
  color: var(--color-primary);
  background: #c3e0fb;
  cursor: pointer;
}

.input-place__btn:hover {
  filter: brightness(0.97);
}

.input-place__btn--secondary {
  background: #e8f4fc;
}
</style>
