<script setup lang="ts">
type Tone = 'teal' | 'blue' | 'success' | 'danger'

const props = withDefaults(
  defineProps<{ value?: number; tone?: Tone; height?: number; animated?: boolean; showLabel?: boolean }>(),
  { value: 0, tone: 'teal', height: 10, animated: true, showLabel: false },
)

const fills: Record<Tone, string> = {
  teal: 'var(--grad-cta)',
  blue: 'linear-gradient(90deg, var(--blue-500), var(--blue-400))',
  success: 'linear-gradient(90deg, var(--success-600, #1fb87c), var(--success-500))',
  danger: 'linear-gradient(90deg, var(--danger-600), var(--danger-500))',
}
const pct = computed(() => Math.max(0, Math.min(100, props.value)))
</script>

<template>
  <div class="med-progress" :style="{ gap: showLabel ? '12px' : '0' }">
    <div class="med-progress__track" :style="{ height: height + 'px' }">
      <div
        class="med-progress__fill"
        :style="{ width: pct + '%', background: fills[tone], backgroundSize: animated ? '28px 28px' : undefined }"
      >
        <div v-if="animated" class="med-progress__stripes" />
      </div>
    </div>
    <span v-if="showLabel" class="med-progress__label">{{ Math.round(pct) }}%</span>
  </div>
</template>

<style scoped>
.med-progress {
  display: flex;
  align-items: center;
}
.med-progress__track {
  position: relative;
  flex: 1;
  border-radius: var(--radius-pill, 999px);
  background: var(--surface-sunken);
  overflow: hidden;
  border: 1px solid var(--border-subtle);
}
.med-progress__fill {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-pill, 999px);
  transition: width var(--dur-slow, 240ms) var(--ease-out);
  box-shadow: 0 0 12px rgba(24, 199, 181, 0.35);
}
.med-progress__stripes {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.16) 0 8px, transparent 8px 16px);
  animation: medreco-stripe 0.7s linear infinite;
}
.med-progress__label {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  min-width: 42px;
  text-align: right;
}
@keyframes medreco-stripe {
  to {
    background-position: 28px 0;
  }
}
</style>
