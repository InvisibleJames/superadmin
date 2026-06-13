<script setup lang="ts">
const route = useRoute()
const auth = useAuthStore()

const breadcrumbLast = computed(() => navLabelForPath(route.path))
const profileOpen = ref(false)
const search = ref('')

async function onLogout() {
  profileOpen.value = false
  await auth.logout()
  navigateTo('/login')
}
</script>

<template>
  <header class="med-topbar">
    <!-- Breadcrumb -->
    <div class="flex items-center gap-2 text-[13.5px] flex-none">
      <span class="text-ink-3">Home</span>
      <MIcon name="chevronRight" :size="15" class="text-ink-3" />
      <span class="text-ink font-semibold">{{ breadcrumbLast }}</span>
    </div>

    <!-- Global search -->
    <div class="flex-1 max-w-[420px] ml-2">
      <MInput v-model="search" full icon="search" placeholder="Search anything across MedReco…" />
    </div>

    <div class="ml-auto flex items-center gap-2">
      <MIconButton title="Notifications">
        <span class="relative inline-flex">
          <MIcon name="bell" :size="18" />
          <span class="absolute top-0 right-0 w-[7px] h-[7px] rounded-full bg-[var(--teal-500)] border-2 border-[var(--bg-sidebar)]" />
        </span>
      </MIconButton>
      <MIconButton title="Help"><MIcon name="help" :size="18" /></MIconButton>

      <div class="w-px h-[26px] bg-[var(--border-subtle)] mx-1" />

      <!-- Profile -->
      <div class="relative">
        <button class="med-profile" @click="profileOpen = !profileOpen">
          <div class="w-[30px] h-[30px] rounded-full grid place-items-center text-white font-bold text-[12px]" style="background: var(--grad-brand)">SA</div>
          <div class="text-left leading-[1.2]">
            <div class="text-[13px] font-semibold">{{ auth.user?.name ?? 'Super Admin' }}</div>
            <div class="text-[11px] text-ink-3">{{ auth.user?.email ?? 'admin@medreco.com' }}</div>
          </div>
          <MIcon name="chevronDown" :size="15" class="text-ink-3" />
        </button>
        <div v-if="profileOpen" class="med-profile-menu">
          <div class="px-2.5 pt-2 pb-2.5 border-b border-[var(--border-subtle)] mb-1">
            <div class="text-[13px] font-semibold">{{ auth.user?.name ?? 'Super Admin' }}</div>
            <div class="text-[11.5px] text-ink-3">Full system access</div>
          </div>
          <button class="med-profile-menu__item" @click="onLogout">
            <span class="inline-flex text-ink-3"><MIcon name="logout" :size="16" /></span>Sign out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.med-topbar {
  height: 64px;
  flex: none;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 22px;
  border-bottom: 1px solid var(--border-subtle);
  background: var(--bg-topbar);
  backdrop-filter: blur(8px);
  position: relative;
  z-index: 20;
}
.med-profile {
  display: flex;
  align-items: center;
  gap: 9px;
  height: 40px;
  padding: 0 8px 0 6px;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  background: transparent;
  cursor: pointer;
  color: var(--text-primary);
  transition: background var(--dur) var(--ease-out);
}
.med-profile:hover {
  background: var(--surface-hover);
}
.med-profile-menu {
  position: absolute;
  top: 50px;
  right: 0;
  width: 220px;
  background: var(--surface-raised);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 6px;
  z-index: 60;
  animation: med-modal-in 0.16s var(--ease-out);
}
.med-profile-menu__item {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 8px 10px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  font-family: var(--font-sans);
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-align: left;
}
.med-profile-menu__item:hover {
  background: var(--surface-hover);
}
</style>
