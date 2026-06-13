<script setup lang="ts">
import { TH_PROVINCES, districtsOf, subdistrictsOf } from '~/utils/thai-address'

export interface ThaiAddress {
  province: string | null
  district: string | null
  subdistrict: string | null
}

const props = defineProps<{ modelValue: ThaiAddress }>()
const emit = defineEmits<{ 'update:modelValue': [v: ThaiAddress] }>()

const v = computed<ThaiAddress>(() => props.modelValue ?? { province: null, district: null, subdistrict: null })

const provinceOptions = computed(() => [
  { value: '', label: '— เลือกจังหวัด —' },
  ...TH_PROVINCES.map((p) => ({ value: p, label: p })),
])
const districtOptions = computed(() => {
  const list = v.value.province ? districtsOf(v.value.province) : []
  return [
    { value: '', label: v.value.province ? '— เลือกอำเภอ/เขต —' : 'เลือกจังหวัดก่อน' },
    ...list.map((d) => ({ value: d, label: d })),
  ]
})
const subOptions = computed(() => {
  const list = v.value.district ? subdistrictsOf(v.value.district) : []
  const placeholder = !v.value.district
    ? 'เลือกอำเภอก่อน'
    : list.length
      ? '— เลือกตำบล/แขวง —'
      : '— ไม่มีข้อมูลตำบล —'
  return [{ value: '', label: placeholder }, ...list.map((t) => ({ value: t, label: t }))]
})

function setProvince(val: string) {
  emit('update:modelValue', { province: val || null, district: null, subdistrict: null })
}
function setDistrict(val: string) {
  emit('update:modelValue', { ...v.value, district: val || null, subdistrict: null })
}
function setSub(val: string) {
  emit('update:modelValue', { ...v.value, subdistrict: val || null })
}
</script>

<template>
  <div class="med-addr">
    <div class="med-field">
      <label>จังหวัด</label>
      <MSelect :model-value="v.province ?? ''" :options="provinceOptions" @update:model-value="setProvince" />
    </div>
    <div class="med-field">
      <label>อำเภอ / เขต</label>
      <MSelect :model-value="v.district ?? ''" :options="districtOptions" @update:model-value="setDistrict" />
    </div>
    <div class="med-field">
      <label>ตำบล / แขวง</label>
      <MSelect :model-value="v.subdistrict ?? ''" :options="subOptions" @update:model-value="setSub" />
    </div>
  </div>
</template>

<style scoped>
.med-addr {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.med-addr :deep(.med-select) {
  display: flex;
  width: 100%;
}
.med-addr :deep(.med-select__field),
.med-addr :deep(select) {
  width: 100%;
}
@media (max-width: 560px) {
  .med-addr {
    grid-template-columns: 1fr;
  }
}
</style>
