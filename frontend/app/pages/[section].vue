<script setup lang="ts">
const route = useRoute()
const title = computed(() => navLabelForPath(route.path))
</script>

<template>
  <div class="p-7 max-w-[1440px] mx-auto">
    <h1 class="text-[24px] font-semibold tracking-[-0.01em] text-ink m-0">{{ title }}</h1>
    <div class="med-placeholder">
      <div class="med-placeholder__icon">
        <MIcon name="settings" :size="24" />
      </div>
      <div class="text-[15px] font-semibold text-ink">{{ title }} is coming soon</div>
      <div class="text-[13px] text-ink-3 max-w-[360px] text-center">
        This screen is part of the MedReco Super Admin roadmap. The Users Management module is fully wired to the Laravel API — the remaining screens follow the same pattern.
      </div>
      <NuxtLink to="/users">
        <MButton variant="secondary" size="sm">Go to Users Management</MButton>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.med-placeholder {
  margin-top: 22px;
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  padding: 72px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.med-placeholder__icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-lg);
  background: var(--surface-raised);
  border: 1px solid var(--border-default);
  display: grid;
  place-items: center;
  color: var(--text-tertiary);
  margin-bottom: 4px;
}
</style>
