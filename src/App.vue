<script setup lang="ts">
import TitlePage from '@/presentation/components/TitlePage.vue'
</script>

<template>
  <div class="main-container">
    <TitlePage name="Samantha" />
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  padding: 1rem;
}
</style>
