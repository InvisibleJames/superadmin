<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    full?: boolean
    disabled?: boolean
    type?: 'button' | 'submit'
  }>(),
  { variant: 'primary', size: 'md', full: false, disabled: false, type: 'button' },
)

const heights = { sm: 32, md: 38, lg: 44 }
const pads = { sm: '0 12px', md: '0 16px', lg: '0 20px' }
const fontSizes = { sm: 13, md: 14, lg: 14 }
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="med-btn"
    :class="`med-btn--${variant}`"
    :style="{
      width: full ? '100%' : undefined,
      display: full ? 'flex' : 'inline-flex',
      height: heights[size] + 'px',
      padding: pads[size],
      fontSize: fontSizes[size] + 'px',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }"
  >
    <slot />
  </button>
</template>

<style scoped>
.med-btn {
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: var(--font-sans);
  font-weight: 600;
  letter-spacing: -0.005em;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  white-space: nowrap;
  user-select: none;
  transition:
    background var(--dur) var(--ease-out),
    border-color var(--dur) var(--ease-out),
    box-shadow var(--dur) var(--ease-out),
    transform var(--dur-fast) var(--ease-out);
}
.med-btn:active:not(:disabled) {
  transform: translateY(0.5px) scale(0.99);
}

.med-btn--primary {
  background: var(--grad-cta);
  color: #06241f;
  box-shadow: var(--shadow-xs);
}
.med-btn--primary:hover:not(:disabled) {
  box-shadow: var(--glow-teal);
}

.med-btn--secondary {
  background: var(--surface-raised);
  color: var(--text-primary);
  border-color: var(--border-default);
  box-shadow: var(--inset-top);
}
.med-btn--secondary:hover:not(:disabled) {
  background: var(--surface-active);
  border-color: var(--border-strong);
}

.med-btn--ghost {
  background: transparent;
  color: var(--text-secondary);
}
.med-btn--ghost:hover:not(:disabled) {
  background: var(--surface-hover);
}

.med-btn--danger {
  background: var(--danger-500);
  color: #fff;
  box-shadow: var(--shadow-xs);
}
.med-btn--danger:hover:not(:disabled) {
  background: var(--danger-600);
}
</style>
