<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    subtitle?: string
    width?: number
    busy?: boolean
  }>(),
  { title: '', subtitle: '', width: 560, busy: false },
)
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()

function close() {
  if (props.busy) return
  emit('update:modelValue', false)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}
watch(
  () => props.modelValue,
  (open) => {
    if (import.meta.client) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = open ? 'hidden' : ''
      if (!open) document.removeEventListener('keydown', onKey)
    }
  },
)
onBeforeUnmount(() => {
  if (import.meta.client) {
    document.removeEventListener('keydown', onKey)
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="med-modal-root">
      <div class="med-modal-scrim" @click="close" />
      <div class="med-modal-card" :style="{ width: width + 'px' }" role="dialog" aria-modal="true">
        <div v-if="title || $slots.header" class="med-modal-head">
          <div v-if="$slots.header"><slot name="header" /></div>
          <div v-else>
            <div class="text-[18px] font-bold tracking-[-0.01em] text-ink">{{ title }}</div>
            <div v-if="subtitle" class="text-[13px] text-ink-3 mt-1">{{ subtitle }}</div>
          </div>
          <button class="med-modal-x" :disabled="busy" @click="close"><MIcon name="x" :size="18" /></button>
        </div>
        <div class="med-modal-body med-scroll"><slot /></div>
        <div v-if="$slots.footer" class="med-modal-foot"><slot name="footer" /></div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.med-modal-root {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.med-modal-scrim {
  position: absolute;
  inset: 0;
  background: var(--overlay-scrim);
  backdrop-filter: blur(3px);
  animation: med-scrim-in 0.18s var(--ease-out);
}
.med-modal-card {
  position: relative;
  max-width: 100%;
  max-height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-xl);
  animation: med-modal-in 0.2s var(--ease-out);
}
.med-modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px 14px;
  border-bottom: 1px solid var(--border-subtle);
}
.med-modal-x {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: background var(--dur) var(--ease-out), color var(--dur) var(--ease-out);
}
.med-modal-x:hover:not(:disabled) {
  background: var(--surface-hover);
  color: var(--text-secondary);
}
.med-modal-body {
  padding: 20px 22px;
  overflow-y: auto;
}
.med-modal-foot {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding: 14px 22px 18px;
  border-top: 1px solid var(--border-subtle);
}
</style>
