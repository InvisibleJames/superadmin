<script setup lang="ts">
type Accent = 'teal' | 'blue' | 'success' | 'danger' | 'amber' | 'neutral'

const props = withDefaults(
  defineProps<{
    label: string
    value: string | number
    icon?: string
    accent?: Accent
    delta?: string | null
    deltaDirection?: 'up' | 'down'
    sublabel?: string | null
  }>(),
  { icon: '', accent: 'teal', delta: null, deltaDirection: 'up', sublabel: null },
)

const accents: Record<Accent, string> = {
  teal: 'var(--teal-400)',
  blue: 'var(--blue-400)',
  success: 'var(--success-500)',
  danger: 'var(--danger-500)',
  amber: 'var(--warning-500)',
  neutral: 'var(--text-secondary)',
}
const tints: Record<Accent, string> = {
  teal: 'var(--tint-teal)',
  blue: 'var(--tint-blue)',
  success: 'var(--tint-success)',
  danger: 'var(--tint-danger)',
  amber: 'var(--tint-amber)',
  neutral: 'var(--tint-neutral)',
}

const valueColor = computed(() =>
  props.accent === 'success' || props.accent === 'danger' ? accents[props.accent] : 'var(--text-primary)',
)
const up = computed(() => props.deltaDirection === 'up')
</script>

<template>
  <div class="med-stat">
    <div class="med-stat__head">
      <span class="med-stat__label">{{ label }}</span>
      <span v-if="icon" class="med-stat__icon" :style="{ background: tints[accent], color: accents[accent] }">
        <MIcon :name="icon" :size="18" />
      </span>
    </div>
    <div class="med-stat__body">
      <span class="med-stat__value" :style="{ color: valueColor }">{{ value }}</span>
      <span v-if="delta != null" class="med-stat__delta" :style="{ color: up ? 'var(--success-500)' : 'var(--danger-500)' }">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" :style="{ transform: up ? 'none' : 'rotate(180deg)' }">
          <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ delta }}
      </span>
      <span v-if="sublabel" class="med-stat__sub">{{ sublabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.med-stat {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 20px;
  background: var(--surface-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xs);
  min-width: 0;
  transition:
    border-color var(--dur) var(--ease-out),
    box-shadow var(--dur) var(--ease-out);
}
.med-stat:hover {
  border-color: var(--border-default);
  box-shadow: var(--shadow-md);
}
.med-stat__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.med-stat__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.med-stat__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex: none;
  border-radius: var(--radius-md);
}
.med-stat__body {
  display: flex;
  align-items: baseline;
  gap: 9px;
  flex-wrap: wrap;
}
.med-stat__value {
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: 30px;
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.med-stat__delta {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  font-size: 12.5px;
  font-weight: 600;
}
.med-stat__sub {
  font-size: 12.5px;
  color: var(--text-tertiary);
}
</style>
