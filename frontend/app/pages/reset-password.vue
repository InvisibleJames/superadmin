<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()
const token = computed(() => String(route.query.token ?? ''))
const email = ref(String(route.query.email ?? ''))

const password = ref('')
const confirm = ref('')
const loading = ref(false)
const error = ref('')
const done = ref(false)

const invalidLink = computed(() => !token.value || !email.value)

async function onSubmit() {
  error.value = ''
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    return
  }
  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  try {
    await useApi()('/auth/reset-password', {
      method: 'POST',
      body: {
        token: token.value,
        email: email.value,
        password: password.value,
        password_confirmation: confirm.value,
      },
    })
    done.value = true
  } catch (e: any) {
    error.value = e?.data?.message || e?.data?.errors?.email?.[0] || 'Could not reset your password. The link may have expired.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="med-reset">
    <div class="med-reset__card">
      <div class="flex items-center gap-3 mb-6">
        <img src="/medreco-mark.png" alt="MedReco" class="w-9 h-9 object-contain" />
        <span class="font-bold text-[18px] tracking-[-0.02em]"><span class="text-ink">Med</span><span class="brand-grad">Reco</span></span>
      </div>

      <template v-if="done">
        <div class="text-center py-1.5">
          <div class="w-[60px] h-[60px] rounded-full grid place-items-center mx-auto mb-4" style="background: var(--tint-success); color: var(--success-500); box-shadow: 0 0 0 6px rgba(41,211,145,0.08)">
            <MIcon name="check" :size="28" :stroke-width="2.4" />
          </div>
          <div class="text-[20px] font-bold text-ink">Password updated</div>
          <div class="text-[13.5px] text-ink-3 mt-2 leading-[1.55]">Your password has been reset. You can now sign in with your new credentials.</div>
          <div class="mt-6">
            <NuxtLink to="/login"><MButton variant="primary" size="lg" full>Go to sign in<MIcon name="arrowRight" :size="17" /></MButton></NuxtLink>
          </div>
        </div>
      </template>

      <template v-else-if="invalidLink">
        <div class="text-[24px] font-bold tracking-[-0.01em] text-ink">Invalid reset link</div>
        <div class="text-[13.5px] text-ink-3 mt-[7px] leading-[1.5]">This password-reset link is missing required information or has expired. Request a new one from the sign-in page.</div>
        <div class="mt-6">
          <NuxtLink to="/login"><MButton variant="secondary" size="lg" full>Back to sign in</MButton></NuxtLink>
        </div>
      </template>

      <template v-else>
        <div class="text-[24px] font-bold tracking-[-0.01em] text-ink">Set a new password</div>
        <div class="text-[13.5px] text-ink-3 mt-[7px]">Choose a new password for <b class="text-ink-2 font-mono">{{ email }}</b>.</div>

        <form @submit.prevent="onSubmit">
          <div class="mt-[26px]">
            <label class="block text-[12.5px] font-medium text-ink-2 mb-2">New password</label>
            <MInput v-model="password" full size="lg" type="password" icon="lock" placeholder="••••••••" />
          </div>
          <div class="mt-[18px]">
            <label class="block text-[12.5px] font-medium text-ink-2 mb-2">Confirm password</label>
            <MInput v-model="confirm" full size="lg" type="password" icon="lock" placeholder="••••••••" />
          </div>

          <p v-if="error" class="mt-3 text-[12.5px] text-[var(--danger-500)]">{{ error }}</p>

          <div class="mt-[26px]">
            <MButton variant="primary" size="lg" full type="submit" :disabled="loading">
              {{ loading ? 'Updating…' : 'Reset password' }}
            </MButton>
          </div>
        </form>
        <div class="text-center mt-[18px]">
          <NuxtLink to="/login" class="text-[13px] text-[var(--text-link)]">← Back to sign in</NuxtLink>
        </div>
      </template>

      <div class="flex items-center gap-2 justify-center mt-6 pt-5 border-t border-[var(--border-subtle)] text-[12px] text-ink-3">
        <MIcon name="shield" :size="13" />Protected by MedReco Security · v2.4
      </div>
    </div>
  </div>
</template>

<style scoped>
.med-reset {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background:
    radial-gradient(120% 80% at 80% 0%, rgba(45, 127, 249, 0.1), transparent 60%),
    radial-gradient(100% 80% at 0% 100%, rgba(24, 199, 181, 0.08), transparent 55%),
    var(--bg-app);
  font-family: var(--font-sans);
}
.med-reset__card {
  width: 420px;
  max-width: 100%;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: 32px;
}
</style>
