export interface ClinicRow {
  id: number
  code: string
  no: string | null
  name: string
  province: string | null
  status: 'active' | 'inactive'
  branches_count: number
  patients_count: number
  created_at: string | null
}

export interface ClinicStats {
  total: number
  active: number
  inactive: number
  branches: number
}

interface ClinicMeta {
  provinces: { value: string; label: string }[]
  statuses: { value: string; label: string }[]
}

const PER_PAGE_OPTIONS = [10, 25, 50, 100]

export function useClinics() {
  const api = useApi()

  const filters = reactive({ q: '', status: 'all', province: '' })
  const sort = ref<'name' | 'status' | 'created' | 'patients'>('created')
  const dir = ref<'asc' | 'desc'>('desc')
  const page = ref(1)
  const perPage = ref(10)

  const rows = ref<ClinicRow[]>([])
  const total = ref(0)
  const lastPage = ref(1)
  const loading = ref(false)
  const stats = ref<ClinicStats | null>(null)
  const meta = ref<ClinicMeta | null>(null)
  const selected = ref<Set<number>>(new Set())

  function buildQuery() {
    const q: Record<string, string | number> = {
      page: page.value,
      per_page: perPage.value,
      sort: sort.value,
      dir: dir.value,
    }
    if (filters.q) q.q = filters.q
    if (filters.status && filters.status !== 'all') q.status = filters.status
    if (filters.province) q.province = filters.province
    return q
  }

  async function fetchClinics() {
    loading.value = true
    try {
      const res = await api<{ data: ClinicRow[]; meta: { total: number; last_page: number } }>('/clinics', {
        query: buildQuery(),
      })
      rows.value = res.data
      total.value = res.meta.total
      lastPage.value = res.meta.last_page
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    const q: Record<string, string | number> = {}
    if (filters.q) q.q = filters.q
    if (filters.province) q.province = filters.province
    stats.value = await api<ClinicStats>('/clinics/stats', { query: q })
  }

  async function fetchMeta() {
    const full = await api<{ provinces: ClinicMeta['provinces']; statuses: ClinicMeta['statuses'] }>('/meta')
    meta.value = { provinces: full.provinces, statuses: full.statuses }
  }

  async function refresh() {
    await Promise.all([fetchClinics(), fetchStats()])
  }

  function toggleSort(column: 'name' | 'status' | 'created' | 'patients') {
    if (sort.value === column) {
      dir.value = dir.value === 'asc' ? 'desc' : 'asc'
    } else {
      sort.value = column
      dir.value = 'asc'
    }
    page.value = 1
    fetchClinics()
  }

  function resetFilters() {
    filters.q = ''
    filters.status = 'all'
    filters.province = ''
    page.value = 1
    refresh()
  }

  function setPage(p: number) {
    if (p < 1 || p > lastPage.value || p === page.value) return
    page.value = p
    fetchClinics()
  }
  function setPerPage(n: number) {
    perPage.value = n
    page.value = 1
    fetchClinics()
  }

  function toggleRow(id: number) {
    const s = new Set(selected.value)
    s.has(id) ? s.delete(id) : s.add(id)
    selected.value = s
  }
  function clearSelection() {
    selected.value = new Set()
  }
  const allChecked = computed(() => rows.value.length > 0 && rows.value.every((r) => selected.value.has(r.id)))
  const someChecked = computed(() => rows.value.some((r) => selected.value.has(r.id)) && !allChecked.value)
  function toggleAll() {
    allChecked.value ? clearSelection() : (selected.value = new Set(rows.value.map((r) => r.id)))
  }

  async function bulk(action: 'activate' | 'deactivate' | 'delete') {
    const ids = [...selected.value]
    if (!ids.length) return
    await api('/clinics/bulk', { method: 'POST', body: { action, ids } })
    clearSelection()
    await refresh()
  }

  async function deleteClinic(id: number) {
    await api(`/clinics/${id}`, { method: 'DELETE' })
    await refresh()
  }

  async function toggleStatus(row: ClinicRow) {
    await api(`/clinics/${row.id}`, {
      method: 'PUT',
      body: {
        code: row.code,
        no: row.no,
        name: row.name,
        province: row.province,
        patients_count: row.patients_count,
        status: row.status === 'active' ? 'inactive' : 'active',
      },
    })
    await refresh()
  }

  let searchTimer: ReturnType<typeof setTimeout> | null = null
  watch(
    () => filters.q,
    () => {
      if (searchTimer) clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
        page.value = 1
        refresh()
      }, 300)
    },
  )
  watch(
    () => [filters.status, filters.province],
    () => {
      page.value = 1
      refresh()
    },
  )


  async function save(payload: Record<string, unknown>, id?: number) {
    if (id) await api(`/clinics/${id}`, { method: 'PUT', body: payload })
    else await api('/clinics', { method: 'POST', body: payload })
    await refresh()
  }

  async function bulkDeleteWithProgress(onProgress: (done: number, total: number) => void) {
    const ids = [...selected.value]
    const total = ids.length
    let done = 0
    for (const id of ids) {
      try {
        await api(`/clinics/${id}`, { method: 'DELETE' })
      } catch {
        // skip records the API refuses (e.g. a protected super admin)
      }
      onProgress(++done, total)
    }
    clearSelection()
    await refresh()
  }

  return {
    filters,
    sort,
    dir,
    page,
    perPage,
    perPageOptions: PER_PAGE_OPTIONS,
    rows,
    total,
    lastPage,
    loading,
    stats,
    meta,
    selected,
    allChecked,
    someChecked,
    fetchMeta,
    refresh,
    toggleSort,
    resetFilters,
    setPage,
    setPerPage,
    toggleRow,
    toggleAll,
    clearSelection,
    bulk,
    deleteClinic,
    toggleStatus,
    save,
    bulkDeleteWithProgress,
  }
}
