<script setup lang="ts">
export interface ThaiAddress {
  province: string | null
  district: string | null
  subdistrict: string | null
  postal_code: string | null
}

const props = defineProps<{ modelValue: ThaiAddress }>()
const emit = defineEmits<{ 'update:modelValue': [v: ThaiAddress] }>()

const geo = useThaiGeo()
onMounted(() => geo.load())

const v = computed<ThaiAddress>(
  () => props.modelValue ?? { province: null, district: null, subdistrict: null, postal_code: null },
)

const provinceOptions = computed(() => [
  { value: '', label: geo.loaded.value ? '— เลือกจังหวัด —' : 'กำลังโหลด…' },
  ...geo.provinces.value.map((p) => ({ value: p, label: p })),
])
const districtOptions = computed(() => {
  const list = geo.districtsOf(v.value.province)
  return [
    { value: '', label: v.value.province ? '— เลือกอำเภอ/เขต —' : 'เลือกจังหวัดก่อน' },
    ...list.map((d) => ({ value: d, label: d })),
  ]
})
const subOptions = computed(() => {
  const list = geo.subdistrictsOf(v.value.province, v.value.district)
  return [
    { value: '', label: v.value.district ? '— เลือกตำบล/แขวง —' : 'เลือกอำเภอก่อน' },
    ...list.map((s) => ({ value: s.name, label: s.name })),
  ]
})

function setProvince(val: string) {
  emit('update:modelValue', { province: val || null, district: null, subdistrict: null, postal_code: null })
}
function setDistrict(val: string) {
  emit('update:modelValue', { ...v.value, district: val || null, subdistrict: null, postal_code: null })
}
function setSub(val: string) {
  const zip = geo.zipOf(v.value.province, v.value.district, val)
  emit('update:modelValue', { ...v.value, subdistrict: val || null, postal_code: zip || null })
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
    <div class="med-field">
      <label>รหัสไปรษณีย์</label>
      <input class="med-zip" :value="v.postal_code ?? ''" readonly placeholder="—" />
    </div>
  </div>
</template>

<style scoped>
.med-addr {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 120px;
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
.med-zip {
  height: 38px;
  padding: 0 12px;
  background: var(--surface-sunken);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 13px;
  outline: none;
}
@media (max-width: 700px) {
  .med-addr {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
