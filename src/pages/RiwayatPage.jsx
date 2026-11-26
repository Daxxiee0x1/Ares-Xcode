import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { KONTRIBUTOR_LIST } from '../data/proyek.js'

function jeda(ms, signal) {
  return new Promise((selesai, tolak) => {
    const timer = window.setTimeout(selesai, ms)
    signal.addEventListener('abort', () => {
      window.clearTimeout(timer)
      tolak(new DOMException('Dibatalkan', 'AbortError'))
    })
  })
}

export default function RiwayatPage() {
  const [kontributorId, setKontributorId] = useState(1)
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('memuat')
  const [pesanError, setPesanError] = useState('')
  const [percobaan, setPercobaan] = useState(0)
  const [simulasiError, setSimulasiError] = useState(false)
  const [logEfek, setLogEfek] = useState([])
  const [hashTerbuka, setHashTerbuka] = useState(null)

  useEffect(() => {
    const pembatal = new AbortController()
    const tambahLog = (teks) => {
      const jam = new Date().toLocaleTimeString('id-ID')
      setLogEfek((lama) => [...lama.slice(-9), `${jam}  ${teks}`])
    }

    tambahLog(`Efek berjalan: kontributor=${kontributorId}`)
    setStatus('memuat')
    setHashTerbuka(null)

    async function muat() {
      try {
        await jeda(500, pembatal.signal)
        if (simulasiError) {
          throw new Error('Jaringan terputus (simulasi)')
        }

        const respons = await fetch(`/data/commits-${kontributorId}.json`, {
          signal: pembatal.signal,
        })
        if (!respons.ok) {
          throw new Error(`Server membalas ${respons.status}`)
        }

        const hasil = await respons.json()
        setData(hasil)
        setStatus('sukses')
        tambahLog(`Data diterima: ${hasil.commit.length} commit (${hasil.kontributor.nama})`)
      } catch (galat) {
        if (galat instanceof DOMException && galat.name === 'AbortError') return
        const pesan = galat instanceof Error ? galat.message : 'Gagal mengambil data'
        setPesanError(pesan)
        setStatus('gagal')
        tambahLog(`Gagal: ${pesan}`)
      }
    }

    muat()

    return () => {
      pembatal.abort()
      tambahLog(`Cleanup: permintaan kontributor=${kontributorId} dibatalkan`)
    }
  }, [kontributorId, percobaan, simulasiError])

  const kontributorDipilih = KONTRIBUTOR_LIST.find((k) => k.id === kontributorId)

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-[clamp(1.625rem,3vw,2.125rem)] font-bold leading-[1.15] tracking-tight text-ink">
          Riwayat commit tim
        </h1>
        <p className="mt-2 text-base text-muted">
          Mengambil data dari{' '}
          <code className="font-mono text-sm text-ink">public/data/commits-N.json</code> memakai{' '}
          <code className="font-mono text-sm text-ink">useEffect</code> dan{' '}
          <code className="font-mono text-sm text-ink">AbortController</code>. Ganti anggota dengan
          cepat untuk mengamati urutan Cleanup pada log.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Pilih kontributor">
          {KONTRIBUTOR_LIST.map((k) => (
            <button
              key={k.id}
              type="button"
              className="pil"
              aria-pressed={kontributorId === k.id}
              onClick={() => setKontributorId(k.id)}
            >
              {k.namaPanggilan}
            </button>
          ))}
        </div>

        <label className="inline-flex min-h-11 items-center gap-3 rounded-xl border border-line bg-surface px-3.5 text-sm font-medium text-ink">
          <input
            type="checkbox"
            className="size-5 accent-[var(--color-signal)]"
            checked={simulasiError}
            onChange={(e) => setSimulasiError(e.target.checked)}
          />
          Simulasikan jaringan putus
        </label>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
        <section
          aria-label="Daftar commit kontributor"
          aria-live="polite"
          aria-busy={status === 'memuat'}
          className="kartu space-y-4"
        >
          {status === 'memuat' && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted">
                Memuat riwayat commit untuk{' '}
                {kontributorDipilih?.namaLengkap ?? `ID ${kontributorId}`}...
              </p>
              <div className="skeleton-bar" />
              <div className="skeleton-bar" />
              <div className="skeleton-bar" />
            </div>
          )}

          {status === 'gagal' && (
            <div role="alert" className="space-y-3 py-2">
              <p className="text-base font-bold text-bad">Data commit gagal dimuat</p>
              <p className="text-sm text-muted">
                Penyebab: {pesanError}. Matikan simulasi jaringan putus jika aktif, lalu muat ulang.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  className="btn-utama"
                  onClick={() => setPercobaan((p) => p + 1)}
                >
                  Coba lagi
                </button>
                {simulasiError && (
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setSimulasiError(false)}
                  >
                    Matikan simulasi
                  </button>
                )}
              </div>
            </div>
          )}

          {status === 'sukses' && data && (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                <div>
                  <h2 className="text-lg font-bold text-ink">{data.kontributor.nama}</h2>
                  <p className="text-sm text-muted">
                    {data.kontributor.peran} · {data.commit.length} commit tercatat
                  </p>
                </div>
                <Link to={`/riwayat/${data.kontributor.id}`} className="btn text-sm">
                  Buka detail {kontributorDipilih?.namaPanggilan ?? data.kontributor.nama}
                </Link>
              </div>

              <ul className="divide-y divide-line">
                {data.commit.map((c) => {
                  const terbuka = hashTerbuka === c.hash
                  const tanggal = new Date(c.tanggal).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                  return (
                    <li key={c.hash} className="py-1">
                      <button
                        type="button"
                        aria-expanded={terbuka}
                        onClick={() => setHashTerbuka(terbuka ? null : c.hash)}
                        className="flex min-h-14 w-full items-start gap-3 rounded-xl px-2.5 py-2.5 text-left transition-[background-color] duration-150 hover:bg-raised"
                      >
                        <code className="mt-0.5 flex-none rounded-md bg-signal px-1.5 py-0.5 font-mono text-xs font-bold text-signal-ink">
                          {c.hash}
                        </code>
                        <span className="min-w-0 flex-1">
                          <span className="block font-semibold text-ink">{c.pesan}</span>
                          <span className="mt-0.5 block font-mono text-xs tabular-nums text-muted">
                            {tanggal}
                          </span>
                        </span>
                        <span className="flex-none text-xs font-semibold text-dim">
                          {terbuka ? 'Tutup' : 'Catatan'}
                        </span>
                      </button>
                      {terbuka && (
                        <p className="px-3 pb-3 pt-1 text-sm leading-relaxed text-muted sm:pl-[5.25rem]">
                          {c.deskripsi}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </section>

        <aside aria-label="Log siklus useEffect" className="kartu-datar space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-ink">Log efek (useEffect)</h2>
            <button
              type="button"
              onClick={() => setLogEfek([])}
              disabled={logEfek.length === 0}
              className="text-xs font-semibold text-muted underline underline-offset-4 hover:text-ink disabled:opacity-40"
            >
              Bersihkan
            </button>
          </div>
          <pre
            aria-label="Catatan eksekusi efek"
            className="min-h-48 overflow-x-auto rounded-xl border border-line bg-surface p-3 font-mono text-xs leading-6 tabular-nums text-muted"
          >
            {logEfek.length > 0 ? logEfek.join('\n') : 'Belum ada catatan efek.'}
          </pre>
          <p className="stat-bar">
            kontributor = {kontributorId} · status = {status} · percobaan = {percobaan}
          </p>
        </aside>
      </div>
    </div>
  )
}
