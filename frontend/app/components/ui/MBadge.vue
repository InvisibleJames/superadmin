<script setup lang="ts">
type Tone = 'neutral' | 'teal' | 'blue' | 'violet' | 'amber' | 'success' | 'danger'

const props = withDefaults(
  defineProps<{
    tone?: Tone
    role?: string
    dot?: boolean
    size?: 'sm' | 'md'
  }>(),
  { tone: 'neutral', role: '', dot: false, size: 'md' },
)

const TONES: Record<Tone, { fg: string; bg: string; bd: string; dot: string }> = {
  neutral: { fg: 'var(--tone-neutral)', bg: 'var(--tint-neutral)', bd: 'rgba(138,151,166,.26)', dot: '#8a97a6' },
  teal: { fg: 'var(--tone-teal)', bg: 'var(--tint-teal)', bd: 'rgba(24,199,181,.3)', dot: 'var(--teal-400)' },
  blue: { fg: 'var(--tone-blue)', bg: 'var(--tint-blue)', bd: 'rgba(45,127,249,.3)', dot: 'var(--blue-400)' },
  violet: { fg: 'var(--tone-violet)', bg: 'var(--tint-violet)', bd: 'rgba(139,92,246,.32)', dot: 'var(--role-manager)' },
  amber: { fg: 'var(--tone-amber)', bg: 'var(--tint-amber)', bd: 'rgba(245,165,36,.3)', dot: 'var(--role-owner)' },
  success: { fg: 'var(--tone-success)', bg: 'var(--tint-success)', bd: 'rgba(41,211,145,.3)', dot: 'var(--success-500)' },
  danger: { fg: 'var(--tone-danger)', bg: 'var(--tint-danger)', bd: 'rgba(244,71,90,.3)', dot: 'var(--danger-500)' },
}

const ROLE_TONE: Record<string, Tone> = {
  'Business Owner': 'amber',
  'Business Director': 'teal',
  Doctor: 'teal',
  Manager: 'violet',
  Staff: 'blue',
}

const t = computed(() => TONES[props.role ? ROLE_TONE[props.role] ?? 'neutral' : props.tone])
const pad = computed(() => (props.size === 'sm' ? '3px 8px' : '4px 11px'))
const fs = computed(() => (props.size === 'sm' ? 11 : 12))
</script>

<template>
  <span
    class="med-badge"
    :style="{
      padding: pad,
      fontSize: fs + 'px',
      color: t.fg,
      background: t.bg,
      border: `1px solid ${t.bd}`,
    }"
  >
    <span v-if="dot" class="med-badge__dot" :style="{ background: t.dot }" />
    <template v-if="role">{{ role }}</template>
    <slot v-else />
  </span>
</template>

<style scoped>
.med-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: var(--radius-pill, 999px);
  font-family: var(--font-sans);
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
}
.med-badge__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex: none;
}
</style>
