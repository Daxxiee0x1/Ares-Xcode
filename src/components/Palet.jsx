import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Lembar from './Lembar.jsx'
import { Ikon, IKON } from './Ikon.jsx'
import { useWorkspace } from '../context/WorkspaceContext.jsx'
import { KONTRIBUTOR_LIST } from '../data/proyek.js'

export default function Palet({ buka, onTutup, onBukaBerkas }) {
  const navigate = useNavigate()
  const {
    berkasList,
    setAktifIndex,
    ukuranEditor,
    tugas,
    togglePreview,
    tema,
    putarTema,
  } = useWorkspace()

  const [kueri, setKueri] = useState('')
  const [pilihanIndex, setPilihanIndex] = useState(0)
  const inputRef = useRef(null)

  const sisaTugas = tugas.filter((t) => !t.selesai).length
  const labelTema = tema === 'system' ? 'Sistem' : tema === 'light' ? 'Terang' : 'Gelap'

  const semuaPerintah = useMemo(() => {
    const pindah = (tujuan) => {
      navigate(tujuan)
      onTutup()
    }

    return [
      {
        id: 'aksi-preview',
        kelompok: 'Aksi cepat',
        judul: 'Tampilkan atau tutup preview editor',
        pintasan: 'Ctrl Enter',
        jalankan: () => {
          navigate('/editor')
          togglePreview()
          onTutup()
        },
      },
      {
        id: 'aksi-berkas',
        kelompok: 'Aksi cepat',
        judul: 'Pilih berkas proyek',
        pintasan: 'Ctrl P',
        jalankan: () => {
          onTutup()
          onBukaBerkas()
        },
      },
      {
        id: 'aksi-tema',
        kelompok: 'Aksi cepat',
        judul: `Ganti tema tampilan (saat ini: ${labelTema})`,
        jalankan: () => {
          putarTema()
        },
      },
      {
        id: 'rute-beranda',
        kelompok: 'Halaman',
        judul: 'Beranda ruang kerja',
        sub: '/',
        jalankan: () => pindah('/'),
      },
      {
        id: 'rute-editor',
        kelompok: 'Halaman',
        judul: 'Editor utama (CodeMirror)',
        sub: '/editor',
        jalankan: () => pindah('/editor'),
      },
      {
        id: 'rute-ukuran',
        kelompok: 'Halaman',
        judul: 'Ukuran teks editor',
        sub: '/ukuran',
        pintasan: `${ukuranEditor} px`,
        jalankan: () => pindah('/ukuran'),
      },
      {
        id: 'rute-tugas',
        kelompok: 'Halaman',
        judul: 'Daftar tugas proyek',
        sub: '/tugas',
        pintasan: `${sisaTugas} aktif`,
        jalankan: () => pindah('/tugas'),
      },
      {
        id: 'rute-riwayat',
        kelompok: 'Halaman',
        judul: 'Riwayat commit tim',
        sub: '/riwayat',
        jalankan: () => pindah('/riwayat'),
      },
      {
        id: 'rute-bantuan',
        kelompok: 'Halaman',
        judul: 'Bantuan dan pintasan keyboard',
        sub: '/bantuan',
        jalankan: () => pindah('/bantuan'),
      },
      ...berkasList.map((b, i) => ({
        id: `berkas-${b.nama}`,
        kelompok: 'Buka berkas di editor',
        judul: b.nama,
        sub: b.bahasa.toUpperCase(),
        jalankan: () => {
          setAktifIndex(i)
          navigate('/editor')
          onTutup()
        },
      })),
      ...KONTRIBUTOR_LIST.map((k) => ({
        id: `kontributor-${k.id}`,
        kelompok: 'Detail kontributor',
        judul: k.namaLengkap,
        sub: `/riwayat/${k.id} · ${k.peran}`,
        jalankan: () => pindah(`/riwayat/${k.id}`),
      })),
    ]
  }, [
    berkasList,
    labelTema,
    navigate,
    onBukaBerkas,
    onTutup,
    putarTema,
    setAktifIndex,
    sisaTugas,
    togglePreview,
    ukuranEditor,
  ])

  const hasil = useMemo(() => {
    const q = kueri.trim().toLowerCase()
    if (!q) return semuaPerintah
    return semuaPerintah.filter(
      (item) =>
        item.judul.toLowerCase().includes(q) ||
        item.kelompok.toLowerCase().includes(q) ||
        (item.sub && item.sub.toLowerCase().includes(q)),
    )
  }, [kueri, semuaPerintah])

  useEffect(() => {
    if (buka) {
      setKueri('')
      setPilihanIndex(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [buka])

  useEffect(() => {
    setPilihanIndex(0)
  }, [kueri])

  const terkelompok = useMemo(() => {
    const peta = new Map()
    hasil.forEach((item, idx) => {
      const daftar = peta.get(item.kelompok) ?? []
      daftar.push({ item, indexGlobal: idx })
      peta.set(item.kelompok, daftar)
    })
    return Array.from(peta.entries())
  }, [hasil])

  function tekanTombol(e) {
    if (hasil.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setPilihanIndex((i) => (i + 1) % hasil.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setPilihanIndex((i) => (i - 1 + hasil.length) % hasil.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      hasil[pilihanIndex]?.jalankan()
    }
  }

  return (
    <Lembar
      buka={buka}
      onTutup={onTutup}
      label="Palet perintah"
      className="fixed inset-x-0 bottom-auto top-[7vh] m-auto h-fit w-[min(38rem,calc(100%-1.5rem))] max-w-none overflow-hidden rounded-2xl"
    >
      <div className="flex items-center gap-3 border-b border-line px-4 py-2">
        <span className="flex-none text-muted">
          <Ikon>{IKON.cari}</Ikon>
        </span>
        <label htmlFor="palet-cari" className="sr-only">
          Cari halaman, berkas, atau perintah
        </label>
        <input
          ref={inputRef}
          id="palet-cari"
          type="search"
          value={kueri}
          onChange={(e) => setKueri(e.target.value)}
          onKeyDown={tekanTombol}
          placeholder="Cari halaman, berkas, atau kontributor..."
          className="h-11 min-w-0 flex-1 bg-transparent text-base text-ink placeholder:text-dim focus-visible:outline-none sm:text-sm"
        />
        <button
          type="button"
          onClick={onTutup}
          aria-label="Tutup palet perintah"
          className="kbd-cap hover:bg-surface"
        >
          Esc
        </button>
      </div>

      <div className="max-h-[58vh] overflow-auto p-2" role="listbox" aria-label="Daftar perintah">
        {hasil.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="font-semibold text-ink">Tidak ada perintah untuk "{kueri}"</p>
            <p className="mt-1 text-sm text-muted">
              Coba kata kunci seperti editor, tugas, riwayat, atau nama kontributor.
            </p>
            <button type="button" onClick={() => setKueri('')} className="btn mt-4">
              Hapus pencarian
            </button>
          </div>
        ) : (
          terkelompok.map(([kelompok, entri]) => (
            <div key={kelompok} className="mb-2 last:mb-0">
              <p className="px-3 pb-1 pt-2 text-xs font-semibold text-dim">{kelompok}</p>
              <ul className="space-y-0.5">
                {entri.map(({ item, indexGlobal }) => {
                  const aktif = indexGlobal === pilihanIndex
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={aktif}
                        onMouseEnter={() => setPilihanIndex(indexGlobal)}
                        onClick={item.jalankan}
                        className={`flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-[background-color,color] duration-150 ${
                          aktif ? 'bg-raised text-ink' : 'text-ink hover:bg-raised/70'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`h-4 w-1 flex-none rounded-full ${
                            aktif ? 'bg-signal' : 'bg-transparent'
                          }`}
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium">{item.judul}</span>
                          {item.sub && (
                            <span className="block truncate font-mono text-xs text-muted">
                              {item.sub}
                            </span>
                          )}
                        </span>
                        {item.pintasan && <kbd className="kbd-cap">{item.pintasan}</kbd>}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line bg-raised/40 px-4 py-2 text-xs text-muted">
        <span>Gunakan panah atas/bawah lalu Enter untuk menjalankan</span>
        <span className="font-mono tabular-nums">{hasil.length} item</span>
      </div>
    </Lembar>
  )
}
