export interface GeoSubdistrict {
  code: number
  name: string
  zip: number
}
export interface GeoDistrict {
  code: number
  name: string
  subdistricts: GeoSubdistrict[]
}
export interface GeoProvince {
  code: number
  name: string
  districts: GeoDistrict[]
}

// Module-level cache so the ~500KB dataset is fetched at most once per session.
let cache: GeoProvince[] | null = null
let pending: Promise<GeoProvince[]> | null = null

/**
 * Lazy access to the full Thai administrative dataset (77 provinces / 928
 * amphoe / 7,436 tambon, each with a postal code). Served statically from
 * /thai-geo.json and loaded on demand.
 */
export function useThaiGeo() {
  const data = ref<GeoProvince[]>(cache ?? [])
  const loaded = ref(!!cache)

  async function load() {
    if (cache) {
      data.value = cache
      loaded.value = true
      return
    }
    if (!pending) pending = $fetch<GeoProvince[]>('/thai-geo.json')
    cache = await pending
    data.value = cache
    loaded.value = true
  }

  const provinces = computed(() => data.value.map((p) => p.name))

  function districtsOf(province: string | null): string[] {
    if (!province) return []
    return data.value.find((p) => p.name === province)?.districts.map((d) => d.name) ?? []
  }

  function subdistrictsOf(province: string | null, district: string | null): GeoSubdistrict[] {
    if (!province || !district) return []
    return (
      data.value
        .find((p) => p.name === province)
        ?.districts.find((d) => d.name === district)?.subdistricts ?? []
    )
  }

  function zipOf(province: string | null, district: string | null, subdistrict: string | null): string {
    if (!subdistrict) return ''
    const s = subdistrictsOf(province, district).find((x) => x.name === subdistrict)
    return s ? String(s.zip) : ''
  }

  return { data, loaded, load, provinces, districtsOf, subdistrictsOf, zipOf }
}
