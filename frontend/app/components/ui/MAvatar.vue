<script setup lang="ts">
const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 34 })

// Deterministic gradient from the name so each avatar is stable but distinct.
const hue = computed(() => {
  let h = 0
  for (let i = 0; i < props.name.length; i++) h = (h * 31 + props.name.charCodeAt(i)) % 360
  return h
})
const bg = computed(
  () => `linear-gradient(135deg, hsl(${hue.value} 70% 45%), hsl(${(hue.value + 40) % 360} 65% 42%))`,
)
</script>

<template>
  <span
    class="med-avatar"
    :style="{ width: size + 'px', height: size + 'px', background: bg, fontSize: size * 0.38 + 'px' }"
  >
    {{ initials(name) }}
  </span>
</template>

<style scoped>
.med-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.12);
  flex: none;
}
</style>
