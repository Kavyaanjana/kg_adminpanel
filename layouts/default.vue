
<template>
  <div class="layout">
    <AppSidebar />
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '@/components/AppSidebar.vue'
</script>
