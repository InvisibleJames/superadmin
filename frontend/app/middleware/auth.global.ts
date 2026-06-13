/**
 * Global guard: ensures the user is authenticated before reaching any page
 * except the login screen. Hydrates the auth store from the token cookie.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  const token = useCookie<string | null>('medreco_token')

  // Pages reachable without authentication.
  const publicPaths = ['/login', '/reset-password']
  const isPublic = publicPaths.includes(to.path)

  // Load the current user once if we have a token but no user in memory.
  if (token.value && !auth.user) {
    await auth.fetchMe()
  }

  if (!auth.isAuthenticated && !isPublic) {
    return navigateTo('/login')
  }

  // Already signed in: skip the login page, but allow /reset-password through.
  if (auth.isAuthenticated && to.path === '/login') {
    return navigateTo('/users')
  }
})
