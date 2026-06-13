<script setup lang="ts">
import type { SaUserRow } from '~/composables/useSaUsers'

const props = defineProps<{
  modelValue: boolean
  record: SaUserRow | null
  roles: { value: string; label: string }[]
  save: (payload: Record<string, unknown>, id?: number) => Promise<void>
}>()
const emit = defineEmits<{ 'update:modelValue': [v: boolean] }>()

const isEdit = computed(() => !!props.record)
const saving = ref(false)
const errors = ref<string[]>([])

const form = reactive({ name: '', email: '', admin_role: 'Admin', two_fa: 'true', status: 'active' })

// Exclude the "All" filter option for the form.
const roleOptions = computed(() => props.roles.filter((r) => r.value !== 'all'))

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return
    errors.value = []
    const r = props.record
    form.name = r?.name ?? ''
    form.email = r?.email ?? ''
    form.admin_role = r?.admin_role ?? 'Admin'
    form.two_fa = (r ? r.two_fa : true) ? 'true' : 'false'
    form.status = r?.status ?? 'active'
  },
)

async function onSave() {
  saving.value = true
  errors.value = []
  try {
    await props.save(
      {
        name: form.name,
        email: form.email,
        admin_role: form.admin_role,
        two_fa: form.two_fa === 'true',
        status: form.status,
      },
      props.record?.id,
    )
    emit('update:modelValue', false)
  } catch (e: any) {
    const errs = e?.data?.errors
    errors.value = errs ? (Object.values(errs).flat() as string[]) : [e?.data?.message || 'Could not save SA user.']
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <MModal
    :model-value="modelValue"
    :busy="saving"
    :width="560"
    :title="isEdit ? 'Edit SA User' : 'Add SA User'"
    subtitle="บัญชี Super Admin ภายในและสิทธิ์การเข้าถึง"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div class="med-form-grid">
      <div class="med-field med-field--full">
        <label>ชื่อ-นามสกุล</label>
        <MInput v-model="form.name" full placeholder="เช่น Akira Tanaka" />
      </div>
      <div class="med-field med-field--full">
        <label>อีเมล</label>
        <MInput v-model="form.email" full type="email" placeholder="name@medreco.io" />
      </div>
      <div class="med-field">
        <label>Admin Role</label>
        <MSelect v-model="form.admin_role" :options="roleOptions" />
      </div>
      <div class="med-field">
        <label>2FA</label>
        <MSelect v-model="form.two_fa" :options="[{ value: 'true', label: 'Enabled' }, { value: 'false', label: 'Disabled' }]" />
      </div>
      <div class="med-field">
        <label>สถานะ</label>
        <MSelect v-model="form.status" :options="[{ value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]" />
      </div>
    </div>

    <ul v-if="errors.length" class="med-form-errors">
      <li v-for="(e, i) in errors" :key="i">{{ e }}</li>
    </ul>

    <template #footer>
      <MButton variant="ghost" :disabled="saving" @click="emit('update:modelValue', false)">Cancel</MButton>
      <MButton variant="primary" :disabled="saving" @click="onSave">
        <MIcon v-if="!saving" name="check" :size="16" :stroke-width="2.2" />{{ saving ? 'Saving…' : 'Save' }}
      </MButton>
    </template>
  </MModal>
</template>
