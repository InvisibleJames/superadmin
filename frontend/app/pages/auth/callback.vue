<script setup lang="ts">
// Landing page for the Authentik/Google SSO redirect. The backend hands us a
// Sanctum token in the query; we persist it, hydrate the user, and continue.
definePageMeta({ layout: false })

const route = useRoute()
const auth = useAuthStore()

onMounted(async () => {
  const token = String(route.query.token ?? '')
  if (!token) {
    await navigateTo('/login?error=oauth_token')
    return
  }

  const cookie = useCookie<string | null>('medreco_token', {
    maxAge: 60 * 60 * 24 * 14,
    sameSite: 'lax',
  })
  cookie.value = token

  const user = await auth.fetchMe()
  await navigateTo(user ? '/users' : '/login?error=oauth_token')
})
</script>

<template>
  <div class="med-callback">
    <div class="flex flex-col items-center gap-4">
      <img src="/medreco-mark.png" alt="MedReco" class="w-10 h-10 object-contain" />
      <div class="text-[14px] text-ink-3">Signing you in…</div>
    </div>
  </div>
</template>

<style scoped>
.med-callback {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-app);
  font-family: var(--font-sans);
}
</style>
