<template>
  <div class="sidebar">
    <h2>Admin Panel</h2>

    <NuxtLink to="/dashboard">Dashboard</NuxtLink>
    <NuxtLink to="/quote">Quote</NuxtLink>
    <NuxtLink to="/messages">Messages</NuxtLink>

   <div class="sidebar-item" @click="toggleCms">Cms</div>

    <div v-if="showCms" class="cms-links" style="margin-left: 16px;">
      <NuxtLink to="/cms/carousel">Carousel</NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showCms = ref(false)

function toggleCms() {
  showCms.value = !showCms.value
}
</script>
