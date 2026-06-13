<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md'
    variant?: 'ghost' | 'secondary'
    title?: string
  }>(),
  { size: 'md', variant: 'ghost', title: '' },
)

const dim = computed(() => (props.size === 'sm' ? 30 : 36))
</script>

<template>
  <button
    type="button"
    :title="title"
    class="med-iconbtn"
    :class="`med-iconbtn--${variant}`"
    :style="{ width: dim + 'px', height: dim + 'px' }"
  >
    <slot />
  </button>
</template>

<style scoped>
.med-iconbtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--text-tertiary);
  transition:
    background var(--dur) var(--ease-out),
    color var(--dur) var(--ease-out),
    border-color var(--dur) var(--ease-out);
}
.med-iconbtn--ghost {
  background: transparent;
  border: 1px solid transparent;
}
.med-iconbtn--ghost:hover {
  background: var(--surface-hover);
  color: var(--text-secondary);
}
.med-iconbtn--secondary {
  background: var(--surface-raised);
  border: 1px solid var(--border-default);
  box-shadow: var(--inset-top);
}
.med-iconbtn--secondary:hover {
  background: var(--surface-active);
  border-color: var(--border-strong);
  color: var(--text-secondary);
}
</style>
