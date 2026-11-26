import { useState } from 'react'
import { useWorkspace } from '../context/WorkspaceContext.jsx'

const DAFTAR_FILTER = [
  { nilai: 'semua', label: 'Semua' },
  { nilai: 'aktif', label: 'Aktif' },
  { nilai: 'selesai', label: 'Selesai' },
]

export default function TugasPage() {
  const { tugas, tambahTugas, centangTugas, ubahTugas, hapusTugas, hapusTugasSelesai } =
    useWorkspace()

  const [teksBaru, setTeksBaru] = useState('')
  const [galatInput, setGalatInput] = useState('')
  const [filter, setFilter] = useState('semua')
  const [editId, setEditId] = useState(null)
  const [teksEdit, setTeksEdit] = useState('')

  const jumlahAktif = tugas.filter((t) => !t.selesai).length
  const jumlahSelesai = tugas.length - jumlahAktif

  const tampil = tugas.filter((t) =>
    filter === 'semua' ? true : filter === 'aktif' ? !t.selesai : t.selesai,
  )

  function kirimForm(e) {
    e.preventDefault()
    if (!tambahTugas(teksBaru)) {
      setGalatInput('Isi nama tugas terlebih dahulu sebelum menambahkan.')
      return
    }
    setTeksBaru('')
    setGalatInput('')
  }

  function mulaiEdit(item) {
    setEditId(item.id)
    setTeksEdit(item.teks)
  }

  function simpanEdit() {
    if (editId && teksEdit.trim()) {
      ubahTugas(editId, teksEdit)
    }
    setEditId(null)
  }

  function jumlahPerFilter(nilai) {
    if (nilai === 'semua') return tugas.length
    if (nilai === 'aktif') return jumlahAktif
    return jumlahSelesai
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header>
        <h1 className="text-[clamp(1.625rem,3vw,2.125rem)] font-bold leading-[1.15] tracking-tight text-ink">
          Daftar tugas proyek
        </h1>
        <p className="mt-2 text-base text-muted">
          Kelola pekerjaan proyek dengan <code className="font-mono text-sm text-ink">useState</code>
          . Perubahan tersimpan saat Anda berpindah ke halaman lain.
        </p>
      </header>

      <form onSubmit={kirimForm} className="mt-6 space-y-2" noValidate>
        <label htmlFor="input-tugas-baru" className="block text-sm font-semibold text-ink">
          Tambah tugas baru
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="input-tugas-baru"
            name="tugasBaru"
            type="text"
            value={teksBaru}
            onChange={(e) => {
              setTeksBaru(e.target.value)
              if (galatInput) setGalatInput('')
            }}
            placeholder="Contoh: Uji navigasi keyboard di /riwayat"
            aria-invalid={galatInput ? 'true' : undefined}
            aria-describedby={galatInput ? 'galat-tugas-baru' : undefined}
            className={`input-ares flex-1 ${galatInput ? 'border-bad border-2' : ''}`}
          />
          <button type="submit" className="btn-utama sm:flex-none">
            Tambah tugas
          </button>
        </div>
        {galatInput && (
          <p id="galat-tugas-baru" role="alert" className="text-sm font-medium text-bad">
            {galatInput}
          </p>
        )}
      </form>

      <div
        className="mt-6 flex flex-wrap items-center justify-between gap-3"
        role="group"
        aria-label="Filter status tugas"
      >
        <div className="flex flex-wrap gap-2">
          {DAFTAR_FILTER.map((f) => (
            <button
              key={f.nilai}
              type="button"
              className="pil"
              aria-pressed={filter === f.nilai}
              onClick={() => setFilter(f.nilai)}
            >
              <span>{f.label}</span>
              <span className="font-mono text-xs tabular-nums opacity-80">
                {jumlahPerFilter(f.nilai)}
              </span>
            </button>
          ))}
        </div>

        <button
          type="button"
          className="btn text-sm"
          onClick={hapusTugasSelesai}
          disabled={jumlahSelesai === 0}
        >
          Hapus yang selesai ({jumlahSelesai})
        </button>
      </div>

      <section aria-label="Daftar item tugas" className="kartu mt-4 p-2 sm:p-3">
        {tampil.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="font-semibold text-ink">
              {tugas.length === 0
                ? 'Belum ada tugas di daftar ini'
                : `Tidak ada tugas berstatus "${filter}"`}
            </p>
            <p className="mt-1 text-sm text-muted">
              {tugas.length === 0
                ? 'Tambahkan tugas pertama melalui kolom di atas untuk mulai mencatat.'
                : 'Ubah filter untuk melihat tugas lainnya atau tambahkan tugas baru.'}
            </p>
            {filter !== 'semua' && tugas.length > 0 && (
              <button type="button" onClick={() => setFilter('semua')} className="btn mt-4">
                Tampilkan semua tugas
              </button>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {tampil.map((item) => {
              const sedangEdit = editId === item.id
              return (
                <li
                  key={item.id}
                  className="flex flex-wrap items-center gap-3 rounded-xl px-2 py-2.5 sm:flex-nowrap sm:px-3"
                >
                  <label className="flex min-h-11 min-w-0 flex-1 items-center gap-3">
                    <input
                      type="checkbox"
                      checked={item.selesai}
                      onChange={() => centangTugas(item.id)}
                      className="size-5 flex-none accent-[var(--color-signal)]"
                    />
                    {sedangEdit ? (
                      <input
                        type="text"
                        value={teksEdit}
                        autoFocus
                        onChange={(e) => setTeksEdit(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') simpanEdit()
                          if (e.key === 'Escape') setEditId(null)
                        }}
                        onBlur={simpanEdit}
                        aria-label={`Ubah nama tugas ${item.teks}`}
                        className="input-ares min-h-10"
                      />
                    ) : (
                      <span
                        className={`min-w-0 flex-1 break-words text-base sm:text-sm ${
                          item.selesai ? 'text-dim line-through' : 'font-medium text-ink'
                        }`}
                      >
                        {item.teks}
                      </span>
                    )}
                  </label>

                  <div className="flex flex-none items-center gap-2 pl-8 sm:pl-0">
                    {sedangEdit ? (
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={simpanEdit}
                        className="btn-utama min-h-10 px-3 text-sm"
                      >
                        Simpan
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => mulaiEdit(item)}
                        aria-label={`Ubah tugas: ${item.teks}`}
                        className="btn min-h-10 px-3 text-sm"
                      >
                        Ubah
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => hapusTugas(item.id)}
                      aria-label={`Hapus tugas: ${item.teks}`}
                      className="btn min-h-10 px-3 text-sm text-bad hover:border-bad"
                    >
                      Hapus
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <p className="stat-bar mt-5">
        tugas = {tugas.length} · tersisa = {jumlahAktif} · tampil = {tampil.length} · filter = "
        {filter}"
      </p>
    </div>
  )
}
