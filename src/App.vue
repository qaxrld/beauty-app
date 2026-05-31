<template>
  <div class="app">
    <AppHeader />
    <main>
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>

import { onMounted } from 'vue'
import { useMastersStore } from './stores/mastersStore'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

const mastersStore = useMastersStore()
onMounted(() => {
  mastersStore.fetchMasters()
})
</script>

<style>
main {
  min-height: calc(100vh - 140px);
}
</style>