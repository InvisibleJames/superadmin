/**
 * Global guard: ensures the user is authenticated before reaching any page
 * except the login screen. Hydrates the auth store from the token cookie.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  const token = useCookie<string | null>('medreco_token')

  const isLoginPage = to.path === '/login'

  // Load the current user once if we have a token but no user in memory.
  if (token.value && !auth.user) {
    await auth.fetchMe()
  }

  if (!auth.isAuthenticated && !isLoginPage) {
    return navigateTo('/login')
  }

  if (auth.isAuthenticated && isLoginPage) {
    return navigateTo('/users')
  }
})
