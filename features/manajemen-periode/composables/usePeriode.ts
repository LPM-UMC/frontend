import { ref, reactive } from 'vue'
import { usePeriodeApi } from '../services/periode.api'
import type { PeriodeResponse } from '#types/periode'

export function usePeriode() {
  const api = usePeriodeApi()
  const toast = useToast()
  
  // State List
  const isLoading = ref(false)
  const periodes = ref<PeriodeResponse[]>([])
  const totalItems = ref(0)
  const totalPages = ref(1)

  // State Filters
  const page = ref(1)
  const size = ref(10)
  const sortOrder = ref<'asc' | 'desc'>('asc')
  const search = ref('')

  // State Aktif
  const periodeAktif = ref<PeriodeResponse | null>(null)

  // Forms
  const createForm = reactive({
    tahun_ajaran: '',
    semester: 'GANJIL',
    tanggal_mulai: '',
    tanggal_selesai: '',
  })

  const updateForm = reactive({
    tahun_ajaran: '',
    semester: 'GANJIL',
    tanggal_mulai: '',
    tanggal_selesai: '',
  })
  
  // File state
  const selectedFile = ref<File | null>(null)

  async function fetchPeriodes() {
    try {
      isLoading.value = true
      const t = new Date().getTime()
      const res = await api.listPeriodes({
        page: page.value,
        size: size.value,
        search: search.value,
        order: sortOrder.value,
        _t: t
      })
      periodes.value = res.data
      totalItems.value = res.meta.total
      totalPages.value = res.meta.total_pages
    } catch (err: any) {
      toast.add({ title: 'Error', description: err.data?.errors || err.message, color: 'error' })
    } finally {
      isLoading.value = false
    }
  }

  async function fetchPeriodeAktif() {
    try {
      const res = await api.getPeriodeAktif()
      periodeAktif.value = res.data
      if (res.data) {
        updateForm.tahun_ajaran = res.data.tahun_ajaran
        updateForm.semester = res.data.semester
        updateForm.tanggal_mulai = res.data.tanggal_mulai?.split('T')[0] || ''
        updateForm.tanggal_selesai = res.data.tanggal_selesai?.split('T')[0] || ''
      }
    } catch (err) {
      // Ignore error
    }
  }

  async function submitCreate() {
    if (!selectedFile.value) {
      toast.add({ title: 'Error', description: 'File kalender wajib diupload', color: 'error' })
      return
    }
    
    isLoading.value = true
    try {
      const fd = new FormData()
      fd.append('tahun_ajaran', createForm.tahun_ajaran)
      fd.append('semester', createForm.semester)
      fd.append('tanggal_mulai', createForm.tanggal_mulai)
      fd.append('tanggal_selesai', createForm.tanggal_selesai)
      fd.append('file_kalender', selectedFile.value)

      await api.createPeriode(fd)
      
      toast.add({ title: 'Sukses', description: 'Periode berhasil dibuat', color: 'success' })
      createForm.tahun_ajaran = ''
      createForm.tanggal_mulai = ''
      createForm.tanggal_selesai = ''
      selectedFile.value = null
      
      sortOrder.value = 'desc'
      page.value = 1
      
      await fetchPeriodes()
      await fetchPeriodeAktif()
    } catch (err: any) {
      toast.add({ title: 'Error', description: err.data?.errors || err.message, color: 'error' })
    } finally {
      isLoading.value = false
    }
  }

  async function submitUpdate() {
    if (!periodeAktif.value) return
    
    isLoading.value = true
    try {
      const fd = new FormData()
      fd.append('tanggal_mulai', updateForm.tanggal_mulai)
      fd.append('tanggal_selesai', updateForm.tanggal_selesai)
      if (selectedFile.value) {
        fd.append('file_kalender', selectedFile.value)
      }

      await api.updatePeriode(periodeAktif.value.id, fd)
      
      toast.add({ title: 'Sukses', description: 'Periode berhasil diupdate', color: 'success' })
      selectedFile.value = null
      await fetchPeriodes()
      await fetchPeriodeAktif()
    } catch (err: any) {
      toast.add({ title: 'Error', description: err.data?.errors || err.message, color: 'error' })
    } finally {
      isLoading.value = false
    }
  }

  async function nonaktifkanPeriode() {
    if (!periodeAktif.value) return
    if (!confirm('Apakah Anda yakin ingin menonaktifkan periode ini?')) return
    
    isLoading.value = true
    try {
      await api.nonaktifkanPeriode(periodeAktif.value.id)
      toast.add({ title: 'Sukses', description: 'Periode berhasil dinonaktifkan', color: 'success' })
      await fetchPeriodes()
      await fetchPeriodeAktif()
    } catch (err: any) {
      toast.add({ title: 'Error', description: err.data?.errors || err.message, color: 'error' })
    } finally {
      isLoading.value = false
    }
  }

  async function downloadKalender(id: string) {
    isLoading.value = true
    try {
      const blob = await api.downloadKalender(id)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `kalender-akademik.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      toast.add({ title: 'Error', description: 'Gagal mendownload kalender', color: 'error' })
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    periodes,
    totalItems,
    totalPages,
    page,
    size,
    sortOrder,
    search,
    periodeAktif,
    createForm,
    updateForm,
    selectedFile,
    fetchPeriodes,
    fetchPeriodeAktif,
    submitCreate,
    submitUpdate,
    nonaktifkanPeriode,
    downloadKalender
  }
}
