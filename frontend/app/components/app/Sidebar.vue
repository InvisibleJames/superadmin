<script setup lang="ts">
const props = defineProps<{ expanded: boolean }>()
const emit = defineEmits<{ toggle: [] }>()

const route = useRoute()
const isActive = (to: string) => route.path === to || (to === '/users' && route.path.startsWith('/users'))
</script>

<template>
  <aside
    class="med-sidebar"
    :style="{ width: expanded ? '256px' : '72px' }"
  >
    <!-- Brand -->
    <div class="med-sidebar__brand">
      <div class="flex items-center gap-2.5 min-w-0 cursor-pointer" @click="emit('toggle')">
        <img src="/medreco-mark.png" alt="MedReco" class="w-[30px] h-[30px] flex-none object-contain" />
        <div v-if="expanded" class="flex flex-col leading-none min-w-0">
          <span class="font-bold text-[17px] tracking-[-0.02em]">
            <span class="text-ink">Med</span><span class="brand-grad">Reco</span>
          </span>
          <span class="text-[10px] tracking-[0.16em] uppercase text-ink-3 mt-[3px]">Super Admin</span>
        </div>
      </div>
      <button v-if="expanded" class="med-sidebar__collapse" title="Collapse" @click="emit('toggle')">
        <MIcon name="collapse" :size="16" />
      </button>
    </div>

    <!-- Nav -->
    <nav class="med-sidebar__nav med-scroll">
      <div v-for="group in navGroups" :key="group.section" class="mb-2.5">
        <div v-if="expanded" class="med-sidebar__cap">{{ group.section }}</div>
        <div v-else class="h-px bg-[var(--border-subtle)] mx-1.5 my-2" />
        <div class="flex flex-col gap-0.5">
          <NuxtLink
            v-for="item in group.items"
            :key="item.id"
            :to="item.to"
            class="med-nav-item"
            :class="{ 'med-nav-item--active': isActive(item.to) }"
            :title="item.label"
          >
            <span class="med-nav-item__icon"><MIcon :name="item.icon" :size="18" /></span>
            <span v-if="expanded" class="truncate">{{ item.label }}</span>
          </NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Profile -->
    <div class="med-sidebar__profile">
      <div class="flex items-center gap-2.5 px-2.5 py-2 rounded-[var(--radius-md)]">
        <div class="relative flex-none">
          <div class="w-[34px] h-[34px] rounded-full grid place-items-center text-white font-bold text-[13px]" style="background: var(--grad-brand)">SA</div>
          <span class="absolute -right-px -bottom-px w-2.5 h-2.5 rounded-full bg-[var(--success-500)] border-2 border-[var(--bg-sidebar)]" />
        </div>
        <div v-if="expanded" class="min-w-0 flex-1">
          <div class="text-[13.5px] font-semibold text-ink">Super Admin</div>
          <div class="text-[11.5px] text-[var(--success-500)] flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full bg-[var(--success-500)]" />Online
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.med-sidebar {
  flex: none;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-subtle);
  transition: width var(--dur) var(--ease-out);
}
.med-sidebar__brand {
  height: 64px;
  flex: none;
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 0 16px;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-subtle);
}
.med-sidebar__collapse {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
}
.med-sidebar__collapse:hover {
  background: var(--surface-hover);
  color: var(--text-secondary);
}
.med-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: 14px 12px;
  display: flex;
  flex-direction: column;
}
.med-sidebar__cap {
  font-weight: 600;
  font-size: 10.5px;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--text-tertiary);
  padding: 8px 12px 7px;
}
.med-nav-item {
  display: flex;
  align-items: center;
  gap: 11px;
  height: 38px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 13.5px;
  font-weight: 500;
  text-decoration: none;
  box-shadow: inset 0 0 0 0 transparent;
  transition:
    background var(--dur) var(--ease-out),
    color var(--dur) var(--ease-out),
    box-shadow var(--dur) var(--ease-out);
}
.med-nav-item__icon {
  display: inline-flex;
  flex: none;
  color: var(--text-tertiary);
  transition: color var(--dur) var(--ease-out);
}
.med-nav-item:hover {
  box-shadow:
    inset 4px 0 0 var(--teal-600),
    inset 0 0 0 999px rgba(255, 255, 255, 0.06);
  color: #fff;
}
.med-nav-item:hover .med-nav-item__icon {
  color: var(--text-secondary);
}
.med-nav-item--active {
  background: var(--tint-teal);
  color: #fff;
  box-shadow: inset 4px 0 0 var(--accent-primary);
}
.med-nav-item--active .med-nav-item__icon {
  color: var(--accent-primary);
}
.med-sidebar__profile {
  flex: none;
  border-top: 1px solid var(--border-subtle);
  padding: 12px;
}
</style>
