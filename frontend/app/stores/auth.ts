import { defineStore } from 'pinia'

export interface AuthUser {
  id: number
  code: string
  name: string
  username: string | null
  email: string
  status: string
  is_super_admin: boolean
  role?: { id: number; name: string; hue: string } | null
  clinic?: { id: number; name: string } | null
  branch?: { id: number; name: string } | null
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as AuthUser | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async login(email: string, password: string) {
      const api = useApi()
      const token = useCookie<string | null>('medreco_token', {
        maxAge: 60 * 60 * 24 * 14,
        sameSite: 'lax',
      })

      const res = await api<{ token: string; user: AuthUser }>('/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      token.value = res.token
      this.user = res.user
      return res.user
    },

    async fetchMe() {
      const token = useCookie<string | null>('medreco_token')
      if (!token.value) {
        this.user = null
        return null
      }
      try {
        const api = useApi()
        this.user = await api<AuthUser>('/auth/me')
      } catch {
        this.clear()
      }
      return this.user
    },

    async logout() {
      try {
        await useApi()('/auth/logout', { method: 'POST' })
      } catch {
        // ignore network errors on logout
      }
      this.clear()
    },

    clear() {
      const token = useCookie<string | null>('medreco_token')
      token.value = null
      this.user = null
    },
  },
})
