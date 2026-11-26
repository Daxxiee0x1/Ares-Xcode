import { Link, useNavigate } from 'react-router'
import { Ikon, IKON } from '../components/Ikon.jsx'
import { useWorkspace } from '../context/WorkspaceContext.jsx'
import { KONTRIBUTOR_LIST } from '../data/proyek.js'

export default function BerandaPage() {
  const navigate = useNavigate()
  const { berkasList, aktifIndex, setAktifIndex, ukuranEditor, tugas, berkasBerubah } =
    useWorkspace()

  const tugasAktif = tugas.filter((t) => !t.selesai)
  const tugasSelesai = tugas.length - tugasAktif.length

  function bukaBerkasDiEditor(index) {
    setAktifIndex(index)
    navigate('/editor')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <header className="max-w-2xl">
        <h1 className="text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.12] tracking-tight text-ink">
          Ruang kerja Ares Xcode
        </h1>
        <p className="mt-3 text-base leading-relaxed text-muted">
          Editor kode CodeMirror 6 dengan pratinjau langsung, dilengkapi modul latihan React untuk
          mengatur ukuran huruf, mencatat tugas proyek, dan memantau riwayat commit tim.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link to="/editor" className="btn-utama">
            <Ikon ukuran={18}>{IKON.kode}</Ikon>
            Buka editor
          </Link>
          <Link to="/bantuan" className="btn">
            Lihat pintasan keyboard
          </Link>
        </div>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
        <section aria-labelledby="judul-berkas">
          <div className="flex items-baseline justify-between gap-4 pb-3">
            <h2 id="judul-berkas" className="text-lg font-bold tracking-tight text-ink">
              Berkas proyek
            </h2>
            <span className="font-mono text-xs tabular-nums text-muted">
              {berkasList.length} berkas siap dibuka
            </span>
          </div>

          <div className="kartu p-2">
            <ul className="divide-y divide-line">
              {berkasList.map((b, i) => {
                const baris = b.kode.replace(/\n$/, '').split('\n').length
                const terakhirDibuka = i === aktifIndex
                const disunting = berkasBerubah(i)
                return (
                  <li key={b.nama}>
                    <button
                      type="button"
                      onClick={() => bukaBerkasDiEditor(i)}
                      className="flex min-h-16 w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-[background-color] duration-150 hover:bg-raised"
                    >
                      <span className="grid size-10 flex-none place-items-center rounded-lg border border-line bg-raised font-mono text-xs font-bold uppercase text-ink">
                        {b.bahasa}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-sm font-bold text-ink">{b.nama}</span>
                          {terakhirDibuka && (
                            <span className="rounded-md bg-raised px-1.5 py-0.5 text-[11px] font-semibold text-muted">
                              Aktif
                            </span>
                          )}
                          {disunting && (
                            <span className="rounded-md bg-signal px-1.5 py-0.5 text-[11px] font-bold text-signal-ink">
                              Diubah
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 block truncate text-sm text-muted">
                          {b.ringkasan}
                        </span>
                      </span>
                      <span className="flex-none font-mono text-xs tabular-nums text-dim">
                        {baris} baris
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="mt-8">
            <div className="flex items-baseline justify-between gap-4 pb-3">
              <h2 className="text-lg font-bold tracking-tight text-ink">Kontributor tim</h2>
              <Link
                to="/riwayat"
                className="text-sm font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
              >
                Buka riwayat commit
              </Link>
            </div>

            <ul className="grid gap-2.5 sm:grid-cols-2">
              {KONTRIBUTOR_LIST.map((k) => (
                <li key={k.id}>
                  <Link
                    to={`/riwayat/${k.id}`}
                    className="flex min-h-14 items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-2.5 transition-[background-color,border-color] duration-150 hover:border-line-strong hover:bg-raised/60"
                  >
                    <span className="grid size-9 flex-none place-items-center rounded-lg bg-raised font-mono text-xs font-bold text-ink">
                      {k.inisial}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-ink">
                        {k.namaLengkap}
                      </span>
                      <span className="block truncate text-xs text-muted">{k.peran}</span>
                    </span>
                    <span className="font-mono text-xs text-dim">#{k.id}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside aria-label="Status modul latihan" className="space-y-4">
          <h2 className="text-lg font-bold tracking-tight text-ink">Status saat ini</h2>

          <div className="kartu space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-dim">Ukuran teks editor</p>
                <p className="mt-1 font-mono text-3xl font-bold tabular-nums text-ink">
                  {ukuranEditor} <span className="text-base font-medium text-muted">px</span>
                </p>
                <p className="mt-1 text-sm text-muted">
                  Diterapkan langsung pada CodeMirror di halaman Editor.
                </p>
              </div>
              <Link to="/ukuran" className="btn flex-none text-sm">
                Atur
              </Link>
            </div>

            <div className="border-t border-line pt-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold text-dim">Daftar tugas proyek</p>
                  <p className="mt-1 text-xl font-bold tabular-nums text-ink">
                    {tugasAktif.length} aktif · {tugasSelesai} selesai
                  </p>
                </div>
                <Link to="/tugas" className="btn flex-none text-sm">
                  Kelola
                </Link>
              </div>

              {tugasAktif.length > 0 ? (
                <ul className="mt-3 space-y-1.5">
                  {tugasAktif.slice(0, 3).map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center gap-2.5 rounded-lg bg-raised/70 px-3 py-2 text-sm text-ink"
                    >
                      <span
                        aria-hidden="true"
                        className="size-1.5 flex-none rounded-full bg-signal"
                      />
                      <span className="truncate">{item.teks}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  Semua tugas sudah selesai. Tambah tugas baru di halaman Daftar Tugas.
                </p>
              )}
            </div>

            <div className="border-t border-line pt-5">
              <p className="text-xs font-semibold text-dim">Pintasan cepat</p>
              <dl className="mt-2.5 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">Palet perintah</dt>
                  <dd>
                    <kbd className="kbd-cap">Ctrl K</kbd>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">Pilih berkas</dt>
                  <dd>
                    <kbd className="kbd-cap">Ctrl P</kbd>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted">Tampilkan preview</dt>
                  <dd>
                    <kbd className="kbd-cap">Ctrl Enter</kbd>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
