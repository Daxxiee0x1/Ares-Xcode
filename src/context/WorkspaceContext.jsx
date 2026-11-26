import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { BERKAS_AWAL } from '../data/berkas.js'

export const UKURAN_MIN = 12
export const UKURAN_MAX = 24
export const UKURAN_AWAL = 14

const TUGAS_AWAL = [
  { id: 'tugas-1', teks: 'Tulis PRD Ares Xcode', selesai: true },
  { id: 'tugas-2', teks: 'Rancang mockup layout', selesai: true },
  { id: 'tugas-3', teks: 'Siapkan video demo hooks', selesai: false },
]

const WorkspaceContext = createContext(null)

function bacaTemaAwal() {
  try {
    const tersimpan = window.localStorage.getItem('ares-tema')
    if (tersimpan === 'light' || tersimpan === 'dark' || tersimpan === 'system') {
      return tersimpan
    }
  } catch {
    // Storage may be unavailable in restricted iframes.
  }
  return 'system'
}

export function WorkspaceProvider({ children }) {
  const [berkasList, setBerkasList] = useState(() => BERKAS_AWAL.map((b) => ({ ...b })))
  const [aktifIndex, setAktifIndex] = useState(0)
  const [modeEdit, setModeEdit] = useState(false)
  const [previewTerbuka, setPreviewTerbuka] = useState(false)

  const [ukuranEditor, setUkuranEditor] = useState(UKURAN_AWAL)
  const [langkahUkuran, setLangkahUkuran] = useState(1)
  const [riwayatUkuran, setRiwayatUkuran] = useState([UKURAN_AWAL])

  const [tugas, setTugas] = useState(TUGAS_AWAL)
  const [tema, setTemaState] = useState(bacaTemaAwal)

  useEffect(() => {
    const root = document.documentElement
    if (tema === 'system') {
      delete root.dataset.theme
    } else {
      root.dataset.theme = tema
    }
    try {
      window.localStorage.setItem('ares-tema', tema)
    } catch {
      // Ignore write failures when storage is blocked.
    }
  }, [tema])

  const setTema = useCallback((baru) => {
    setTemaState(baru)
  }, [])

  const putarTema = useCallback(() => {
    setTemaState((sekarang) =>
      sekarang === 'system' ? 'light' : sekarang === 'light' ? 'dark' : 'system',
    )
  }, [])

  const togglePreview = useCallback(() => {
    setPreviewTerbuka((sekarang) => !sekarang)
  }, [])

  const updateKodeBerkas = useCallback((index, kodeBaru) => {
    setBerkasList((daftar) =>
      daftar.map((item, i) => (i === index ? { ...item, kode: kodeBaru } : item)),
    )
  }, [])

  const resetBerkasAktif = useCallback((index) => {
    const bawaan = BERKAS_AWAL[index]
    if (!bawaan) return
    setBerkasList((daftar) =>
      daftar.map((item, i) => (i === index ? { ...item, kode: bawaan.kode } : item)),
    )
  }, [])

  const berkasBerubah = useCallback(
    (index) => {
      const sekarang = berkasList[index]
      const bawaan = BERKAS_AWAL[index]
      if (!sekarang || !bawaan) return false
      return sekarang.kode.trimEnd() !== bawaan.kode.trimEnd()
    },
    [berkasList],
  )

  const ubahUkuran = useCallback((selisih) => {
    setUkuranEditor((sekarang) => {
      const baru = Math.min(UKURAN_MAX, Math.max(UKURAN_MIN, sekarang + selisih))
      if (baru !== sekarang) {
        setRiwayatUkuran((riwayat) => [...riwayat, baru])
      }
      return baru
    })
  }, [])

  const urungkanUkuran = useCallback(() => {
    setRiwayatUkuran((riwayat) => {
      if (riwayat.length < 2) return riwayat
      const sisa = riwayat.slice(0, -1)
      setUkuranEditor(sisa[sisa.length - 1])
      return sisa
    })
  }, [])

  const resetUkuran = useCallback(() => {
    setUkuranEditor(UKURAN_AWAL)
    setRiwayatUkuran([UKURAN_AWAL])
  }, [])

  const tambahTugas = useCallback((teks) => {
    const bersih = teks.trim()
    if (!bersih) return false
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `tugas-${Date.now()}`
    setTugas((daftar) => [...daftar, { id, teks: bersih, selesai: false }])
    return true
  }, [])

  const centangTugas = useCallback((id) => {
    setTugas((daftar) =>
      daftar.map((item) => (item.id === id ? { ...item, selesai: !item.selesai } : item)),
    )
  }, [])

  const ubahTugas = useCallback((id, teksBaru) => {
    const bersih = teksBaru.trim()
    if (!bersih) return
    setTugas((daftar) =>
      daftar.map((item) => (item.id === id ? { ...item, teks: bersih } : item)),
    )
  }, [])

  const hapusTugas = useCallback((id) => {
    setTugas((daftar) => daftar.filter((item) => item.id !== id))
  }, [])

  const hapusTugasSelesai = useCallback(() => {
    setTugas((daftar) => daftar.filter((item) => !item.selesai))
  }, [])

  return (
    <WorkspaceContext.Provider
      value={{
        berkasList,
        aktifIndex,
        setAktifIndex,
        updateKodeBerkas,
        resetBerkasAktif,
        berkasBerubah,
        modeEdit,
        setModeEdit,
        previewTerbuka,
        setPreviewTerbuka,
        togglePreview,
        ukuranEditor,
        langkahUkuran,
        riwayatUkuran,
        setLangkahUkuran,
        ubahUkuran,
        urungkanUkuran,
        resetUkuran,
        tugas,
        tambahTugas,
        centangTugas,
        ubahTugas,
        hapusTugas,
        hapusTugasSelesai,
        tema,
        setTema,
        putarTema,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext)
  if (!ctx) {
    throw new Error('useWorkspace harus dipanggil di dalam WorkspaceProvider')
  }
  return ctx
}
