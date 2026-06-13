import type { $Fetch } from 'nitropack'

/**
 * A `$fetch` instance pre-configured with the API base URL and the bearer
 * token from the auth cookie. Works on both server and client.
 */
export function useApi(): $Fetch {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('medreco_token')

  return $fetch.create({
    baseURL: config.public.apiBase,
    headers: { Accept: 'application/json' },
    onRequest({ options }) {
      if (token.value) {
        options.headers.set('Authorization', `Bearer ${token.value}`)
      }
    },
    onResponseError({ response }) {
      // Token expired / revoked — bounce to login.
      if (response.status === 401 && import.meta.client) {
        const auth = useAuthStore()
        auth.clear()
        navigateTo('/login')
      }
    },
  })
}
