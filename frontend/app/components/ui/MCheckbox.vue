<script setup lang="ts">
const props = withDefaults(
  defineProps<{ checked?: boolean; indeterminate?: boolean }>(),
  { checked: false, indeterminate: false },
)
const emit = defineEmits<{ change: [value: boolean] }>()
</script>

<template>
  <button
    type="button"
    role="checkbox"
    :aria-checked="checked"
    class="med-check"
    :class="{ 'med-check--on': checked || indeterminate }"
    @click="emit('change', !checked)"
  >
    <MIcon v-if="indeterminate" name="check" :size="12" :stroke-width="3" class="med-check__mark" />
    <svg v-else-if="checked" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#06241f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="med-check__mark">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  </button>
</template>

<style scoped>
.med-check {
  width: 18px;
  height: 18px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-xs, 4px);
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition:
    background var(--dur-fast) var(--ease-out),
    border-color var(--dur-fast) var(--ease-out);
}
.med-check--on {
  background: var(--accent-primary);
  border-color: var(--accent-primary);
}
.med-check__mark {
  color: #06241f;
}
</style>
