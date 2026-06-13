<script setup lang="ts">
const expanded = ref(true)
</script>

<template>
  <div class="med-shell">
    <Sidebar :expanded="expanded" @toggle="expanded = !expanded" />
    <div class="med-main">
      <Topbar />
      <div class="med-content med-scroll">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.med-shell {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  background: var(--bg-app);
  color: var(--text-primary);
}
.med-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.med-content {
  flex: 1;
  overflow-y: auto;
  position: relative;
}
</style>
