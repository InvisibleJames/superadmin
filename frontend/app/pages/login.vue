<script setup lang="ts">
definePageMeta({ layout: false })

const auth = useAuthStore()

type Mode = 'signin' | 'forgot' | 'sent'
const mode = ref<Mode>('signin')

const email = ref('admin@medreco.com')
const password = ref('password')
const loading = ref(false)
const error = ref('')

const forgotLoading = ref(false)
const forgotError = ref('')

async function onLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    await navigateTo('/users')
  } catch (e: any) {
    error.value = e?.data?.message || 'The provided credentials are incorrect.'
  } finally {
    loading.value = false
  }
}

async function onSendReset() {
  forgotError.value = ''
  if (!email.value) {
    forgotError.value = 'Enter your email first.'
    return
  }
  forgotLoading.value = true
  try {
    await useApi()('/auth/forgot-password', { method: 'POST', body: { email: email.value } })
    mode.value = 'sent'
  } catch (e: any) {
    forgotError.value = e?.data?.message || 'Could not send the reset link. Try again.'
  } finally {
    forgotLoading.value = false
  }
}
</script>

<template>
  <div class="med-login">
    <!-- Brand panel -->
    <div class="med-login__brand">
      <div class="med-login__grid" />
      <div class="relative flex items-center gap-3">
        <img src="/medreco-mark.png" alt="MedReco" class="w-10 h-10 object-contain" />
        <span class="font-bold text-[20px] tracking-[-0.02em]"><span class="text-ink">Med</span><span class="brand-grad">Reco</span></span>
        <span class="ml-1.5 text-[11px] tracking-[0.14em] uppercase text-ink-3 border border-[var(--border-default)] px-2 py-[3px] rounded-full">Super Admin</span>
      </div>

      <div class="relative">
        <div class="text-[13px] tracking-[0.2em] uppercase text-[var(--teal-400)] mb-3.5">Electronic Medical Records · Enterprise</div>
        <div class="font-bold text-[40px] leading-[1.15] tracking-[-0.02em] text-ink max-w-[460px]">Manage healthcare operations at scale.</div>
        <div class="text-[14.5px] text-ink-3 mt-4 leading-[1.6] max-w-[440px]">Clinics, branches, users, patients and queues — unified in one secure command center for System Administrators.</div>
        <div class="flex flex-col gap-3 mt-7">
          <div v-for="f in ['Real-time queue & boarding board', 'Role-based access & full audit trail', 'Bulk import / export & backups']" :key="f" class="flex items-center gap-[11px] text-[13.5px] text-ink-2">
            <span class="w-[22px] h-[22px] rounded-full grid place-items-center flex-none" style="background: var(--tint-teal); color: var(--teal-400)">
              <MIcon name="check" :size="13" :stroke-width="2.4" />
            </span>{{ f }}
          </div>
        </div>
      </div>

      <div class="relative flex gap-2.5 flex-wrap">
        <span v-for="b in ['SOC 2 TYPE II', 'HIPAA', 'ISO 27001', '256-BIT ENCRYPTION']" :key="b" class="text-[11px] tracking-[0.08em] text-ink-3 border border-[var(--border-subtle)] bg-[var(--surface-sunken)] px-[11px] py-[5px] rounded-[var(--radius-sm)]">{{ b }}</span>
      </div>
    </div>

    <!-- Form panel -->
    <div class="med-login__form">
      <div class="med-login__card">
        <template v-if="mode === 'signin'">
          <div class="text-[24px] font-bold tracking-[-0.01em] text-ink">Sign in</div>
          <div class="text-[13.5px] text-ink-3 mt-[7px]">Enter your credentials to access the console.</div>

          <form @submit.prevent="onLogin">
            <div class="mt-[26px]">
              <label class="block text-[12.5px] font-medium text-ink-2 mb-2">Email</label>
              <MInput v-model="email" full size="lg" type="email" icon="mail" placeholder="you@medreco.com" />
            </div>
            <div class="mt-[18px]">
              <div class="flex items-center justify-between mb-2">
                <label class="text-[12.5px] font-medium text-ink-2">Password</label>
                <span class="text-[12.5px] text-[var(--text-link)] cursor-pointer" @click="mode = 'forgot'">Forgot?</span>
              </div>
              <MInput v-model="password" full size="lg" type="password" icon="lock" placeholder="••••••••" />
            </div>

            <p v-if="error" class="mt-3 text-[12.5px] text-[var(--danger-500)]">{{ error }}</p>

            <div class="mt-[26px]">
              <MButton variant="primary" size="lg" full type="submit" :disabled="loading">
                {{ loading ? 'Signing in…' : 'Sign In' }}
                <MIcon v-if="!loading" name="arrowRight" :size="17" />
              </MButton>
            </div>
          </form>
        </template>

        <template v-else-if="mode === 'forgot'">
          <div class="text-[24px] font-bold tracking-[-0.01em] text-ink">Reset password</div>
          <div class="text-[13.5px] text-ink-3 mt-[7px] leading-[1.5]">กรอกอีเมลของคุณ ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปให้</div>
          <div class="mt-[26px]">
            <label class="block text-[12.5px] font-medium text-ink-2 mb-2">Email</label>
            <MInput v-model="email" full size="lg" type="email" icon="mail" placeholder="you@medreco.com" />
          </div>
          <p v-if="forgotError" class="mt-3 text-[12.5px] text-[var(--danger-500)]">{{ forgotError }}</p>
          <div class="mt-6">
            <MButton variant="primary" size="lg" full :disabled="forgotLoading" @click="onSendReset">
              {{ forgotLoading ? 'กำลังส่ง…' : 'ส่งลิงก์รีเซ็ตรหัสผ่าน' }}
            </MButton>
          </div>
          <div class="text-center mt-[18px]">
            <span class="text-[13px] text-[var(--text-link)] cursor-pointer" @click="mode = 'signin'">← กลับไปหน้าเข้าสู่ระบบ</span>
          </div>
        </template>

        <template v-else>
          <div class="text-center py-1.5">
            <div class="w-[60px] h-[60px] rounded-full grid place-items-center mx-auto mb-4" style="background: var(--tint-success); color: var(--success-500); box-shadow: 0 0 0 6px rgba(41,211,145,0.08)">
              <MIcon name="mail" :size="28" />
            </div>
            <div class="text-[20px] font-bold text-ink">ส่งอีเมลแล้ว</div>
            <div class="text-[13.5px] text-ink-3 mt-2 leading-[1.55]">เราได้ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปที่<br><b class="text-ink-2 font-mono">{{ email }}</b><br>กรุณาตรวจสอบกล่องจดหมายของคุณ</div>
            <div class="mt-6">
              <MButton variant="secondary" size="lg" full @click="mode = 'signin'">กลับไปหน้าเข้าสู่ระบบ</MButton>
            </div>
          </div>
        </template>

        <div class="flex items-center gap-2 justify-center mt-6 pt-5 border-t border-[var(--border-subtle)] text-[12px] text-ink-3">
          <MIcon name="shield" :size="13" />Protected by MedReco Security · v2.4
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.med-login {
  position: fixed;
  inset: 0;
  display: flex;
  background: var(--bg-app);
  font-family: var(--font-sans);
}
.med-login__brand {
  flex: 1.15;
  position: relative;
  overflow: hidden;
  border-right: 1px solid var(--border-subtle);
  padding: 56px 56px 48px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background:
    radial-gradient(120% 80% at 80% 0%, rgba(45, 127, 249, 0.14), transparent 60%),
    radial-gradient(100% 80% at 0% 100%, rgba(24, 199, 181, 0.12), transparent 55%),
    var(--bg-sidebar);
}
.med-login__grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(120, 150, 180, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(120, 150, 180, 0.05) 1px, transparent 1px);
  background-size: 34px 34px;
  mask-image: radial-gradient(120% 100% at 50% 0%, #000 40%, transparent 90%);
  pointer-events: none;
}
.med-login__form {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
.med-login__card {
  width: 400px;
  max-width: 100%;
  background: var(--surface-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  padding: 32px;
}
@media (max-width: 860px) {
  .med-login__brand {
    display: none;
  }
}
</style>
