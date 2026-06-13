<script setup lang="ts">
interface Option {
  value: string | number
  label: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    options: Option[]
    label?: string
  }>(),
  { modelValue: '', label: '' },
)

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <div class="med-select">
    <span v-if="label" class="med-select__label">{{ label }}</span>
    <div class="med-select__field">
      <select
        :value="modelValue"
        @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      >
        <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
      </select>
      <MIcon name="chevronDown" :size="14" class="med-select__chevron" />
    </div>
  </div>
</template>

<style scoped>
.med-select {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
}
.med-select__label {
  font-size: 12.5px;
  color: var(--text-tertiary);
  white-space: nowrap;
}
.med-select__field {
  position: relative;
  display: inline-flex;
  align-items: center;
  height: 38px;
}
.med-select__field select {
  appearance: none;
  height: 38px;
  padding: 0 32px 0 12px;
  background: var(--surface-input);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: 13px;
  font-family: var(--font-sans);
  cursor: pointer;
  transition:
    border-color var(--dur) var(--ease-out),
    box-shadow var(--dur) var(--ease-out);
}
.med-select__field select:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: var(--ring-accent);
}
.med-select__field select option {
  background: var(--surface-raised);
  color: var(--text-primary);
}
.med-select__chevron {
  position: absolute;
  right: 10px;
  color: var(--text-tertiary);
  pointer-events: none;
}
</style>
