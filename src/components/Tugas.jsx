import { useState } from 'react'

const TUGAS_AWAL = [
  { id: 1, teks: 'Tulis PRD Ares Xcode', selesai: true },
  { id: 2, teks: 'Rancang mockup layout', selesai: true },
  { id: 3, teks: 'Siapkan video demo hooks', selesai: false },
]

const FILTER = [
  { nilai: 'semua', label: 'Semua' },
  { nilai: 'aktif', label: 'Aktif' },
  { nilai: 'selesai', label: 'Selesai' },
]

export default function Tugas() {
  // state: daftar tugas
  const [tugas, setTugas] = useState(TUGAS_AWAL)

  // state: input tugas baru
  const [teksBaru, setTeksBaru] = useState('')

  // state: filter
  const [filter, setFilter] = useState('semua')

  // state: tugas yang sedang diubah
  const [editId, setEditId] = useState(null)
  const [teksEdit, setTeksEdit] = useState('')

  // nilai turunan (tidak disimpan di state)
  const tampil = tugas.filter((t) =>
    filter === 'semua' ? true : filter === 'aktif' ? !t.selesai : t.selesai
  )
  const sisa = tugas.filter((t) => !t.selesai).length

  function tambah(e) {
    e.preventDefault()
    const teks = teksBaru.trim()
    if (!teks) return
    setTugas([...tugas, { id: crypto.randomUUID(), teks, selesai: false }])
    setTeksBaru('')
  }

  function centang(id) {
    setTugas(tugas.map((t) => (t.id === id ? { ...t, selesai: !t.selesai } : t)))
  }

  function hapus(id) {
    setTugas(tugas.filter((t) => t.id !== id))
  }

  function hapusSelesai() {
    setTugas(tugas.filter((t) => !t.selesai))
  }

  function mulaiEdit(t) {
    setEditId(t.id)
    setTeksEdit(t.teks)
  }

  function simpanEdit() {
    const teks = teksEdit.trim()
    if (teks) setTugas(tugas.map((t) => (t.id === editId ? { ...t, teks } : t)))
    setEditId(null)
  }

  return (
    <section className="space-y-4">
      <p className="bantu">Tambah, centang, ubah, dan hapus tugas. Coba filter di bawah.</p>

      <form onSubmit={tambah} className="flex gap-2">
        <input
          className="input"
          value={teksBaru}
          onChange={(e) => setTeksBaru(e.target.value)}
          placeholder="Tugas baru…"
          aria-label="Tugas baru"
        />
        <button className="btn-utama" type="submit">Tambah</button>
      </form>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter tugas">
        {FILTER.map((f) => (
          <button key={f.nilai} className="pil" aria-pressed={filter === f.nilai} onClick={() => setFilter(f.nilai)}>
            {f.label}
          </button>
        ))}
      </div>

      <ul className="kartu space-y-1 p-2">
        {tampil.length === 0 && (
          <li className="bantu px-3 py-4">Belum ada tugas di filter ini.</li>
        )}
        {tampil.map((t) => (
          <li key={t.id} className="baris">
            <input
              type="checkbox"
              className="size-5 accent-[var(--color-signal)]"
              checked={t.selesai}
              onChange={() => centang(t.id)}
              aria-label={`Selesai: ${t.teks}`}
            />
            {editId === t.id ? (
              <input
                className="input"
                value={teksEdit}
                autoFocus
                onChange={(e) => setTeksEdit(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') simpanEdit()
                  if (e.key === 'Escape') setEditId(null)
                }}
                onBlur={simpanEdit}
                aria-label="Ubah nama tugas"
              />
            ) : (
              <span className={`min-w-0 flex-1 ${t.selesai ? 'text-dim line-through' : ''}`}>{t.teks}</span>
            )}
            <button className="btn px-3 text-sm" onClick={() => mulaiEdit(t)} aria-label={`Ubah: ${t.teks}`}>Ubah</button>
            <button className="btn px-3 text-sm" onClick={() => hapus(t.id)} aria-label={`Hapus: ${t.teks}`}>Hapus</button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-2">
        <p className="bantu">{sisa} tugas tersisa</p>
        <button className="btn" onClick={hapusSelesai} disabled={sisa === tugas.length}>Hapus yang selesai</button>
      </div>

      <p className="stat">
        tugas = {tugas.length} · tampil = {tampil.length} · filter = "{filter}"
      </p>
    </section>
  )
}
