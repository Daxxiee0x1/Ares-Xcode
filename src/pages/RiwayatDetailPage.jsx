import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { Ikon, IKON } from '../components/Ikon.jsx'
import { KONTRIBUTOR_LIST } from '../data/proyek.js'

export default function RiwayatDetailPage() {
  const { id } = useParams()
  const numericId = Number(id)
  const validId =
    Number.isInteger(numericId) && KONTRIBUTOR_LIST.some((k) => k.id === numericId)

  const [data, setData] = useState(null)
  const [status, setStatus] = useState(validId ? 'memuat' : 'tidak-ditemukan')
  const [pesanError, setPesanError] = useState('')
  const [percobaan, setPercobaan] = useState(0)

  useEffect(() => {
    if (!validId) {
      setData(null)
      setStatus('tidak-ditemukan')
      return
    }

    const pembatal = new AbortController()
    setStatus('memuat')

    async function muat() {
      try {
        const respons = await fetch(`/data/commits-${numericId}.json`, {
          signal: pembatal.signal,
        })
        if (!respons.ok) {
          throw new Error(`Berkas commits-${numericId}.json membalas ${respons.status}`)
        }
        const hasil = await respons.json()
        setData(hasil)
        setStatus('sukses')
      } catch (galat) {
        if (galat instanceof DOMException && galat.name === 'AbortError') return
        setPesanError(galat instanceof Error ? galat.message : 'Gagal memuat detail kontributor')
        setStatus('gagal')
      }
    }

    muat()
    return () => pembatal.abort()
  }, [numericId, validId, percobaan])

  const indexSekarang = KONTRIBUTOR_LIST.findIndex((k) => k.id === numericId)
  const profilRingkas = indexSekarang >= 0 ? KONTRIBUTOR_LIST[indexSekarang] : null
  const sebelumnya = indexSekarang > 0 ? KONTRIBUTOR_LIST[indexSekarang - 1] : null
  const berikutnya =
    indexSekarang >= 0 && indexSekarang < KONTRIBUTOR_LIST.length - 1
      ? KONTRIBUTOR_LIST[indexSekarang + 1]
      : null

  if (status === 'tidak-ditemukan') {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/riwayat"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-muted hover:text-ink"
        >
          <Ikon ukuran={16}>{IKON.panahKiri}</Ikon>
          Kembali ke riwayat commit
        </Link>
        <div className="kartu mt-4 space-y-4">
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            Kontributor "{id}" tidak ditemukan
          </h1>
          <p className="text-base text-muted">
            Data yang tersedia di <code className="font-mono text-sm text-ink">public/data/</code>{' '}
            mencakup ID 1 sampai 5. Pilih salah satu anggota tim di bawah ini.
          </p>
          <ul className="flex flex-wrap gap-2 pt-1">
            {KONTRIBUTOR_LIST.map((k) => (
              <li key={k.id}>
                <Link to={`/riwayat/${k.id}`} className="btn text-sm">
                  {k.id}. {k.namaLengkap}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted">
        <Link
          to="/riwayat"
          className="inline-flex min-h-11 items-center gap-1.5 font-semibold hover:text-ink"
        >
          <Ikon ukuran={16}>{IKON.panahKiri}</Ikon>
          Riwayat commit
        </Link>
        <span aria-hidden="true">/</span>
        <span className="font-mono text-ink">commits-{numericId}.json</span>
      </nav>

      <header className="mt-3 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
        <div className="flex items-center gap-4">
          <div className="grid size-14 flex-none place-items-center rounded-2xl bg-signal font-mono text-lg font-bold text-signal-ink">
            {profilRingkas?.inisial ?? `#${numericId}`}
          </div>
          <div>
            <h1 className="text-[clamp(1.5rem,3vw,2.125rem)] font-bold leading-tight tracking-tight text-ink">
              {data?.kontributor.nama ?? profilRingkas?.namaLengkap ?? `Kontributor #${numericId}`}
            </h1>
            <p className="mt-0.5 text-sm text-muted">
              Peran:{' '}
              <span className="font-semibold text-ink">
                {data?.kontributor.peran ?? profilRingkas?.peran}
              </span>
              {data && ` · ${data.commit.length} commit`}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5" aria-label="Pindah anggota cepat">
          {KONTRIBUTOR_LIST.map((k) => (
            <Link
              key={k.id}
              to={`/riwayat/${k.id}`}
              aria-current={k.id === numericId ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center rounded-xl border px-3 text-sm font-semibold transition-[background-color,color] duration-150 ${
                k.id === numericId
                  ? 'border-transparent bg-ink text-bg'
                  : 'border-line bg-surface text-muted hover:bg-raised hover:text-ink'
              }`}
            >
              {k.namaPanggilan}
            </Link>
          ))}
        </div>
      </header>

      <section aria-live="polite" aria-busy={status === 'memuat'} className="mt-6">
        {status === 'memuat' && (
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Memuat berkas <code className="font-mono">commits-{numericId}.json</code>...
            </p>
            <div className="skeleton-bar h-24" />
            <div className="skeleton-bar h-24" />
            <div className="skeleton-bar h-24" />
          </div>
        )}

        {status === 'gagal' && (
          <div role="alert" className="kartu space-y-3">
            <p className="font-bold text-bad">Gagal memuat data kontributor</p>
            <p className="text-sm text-muted">{pesanError}</p>
            <button
              type="button"
              className="btn-utama"
              onClick={() => setPercobaan((p) => p + 1)}
            >
              Muat ulang
            </button>
          </div>
        )}

        {status === 'sukses' && data && (
          <ol className="space-y-4">
            {data.commit.map((c, idx) => {
              const tanggalLengkap = new Date(c.tanggal).toLocaleString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
              return (
                <li key={c.hash} className="kartu">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <code className="rounded-md bg-signal px-2 py-0.5 font-mono text-xs font-bold text-signal-ink">
                        {c.hash}
                      </code>
                      <span className="font-mono text-xs tabular-nums text-dim">
                        #{data.commit.length - idx}
                      </span>
                    </div>
                    <time
                      dateTime={c.tanggal}
                      className="font-mono text-xs tabular-nums text-muted"
                    >
                      {tanggalLengkap} WIB
                    </time>
                  </div>
                  <h2 className="mt-3 text-base font-bold text-ink">{c.pesan}</h2>
                  <p className="mt-1.5 max-w-[65ch] text-sm leading-relaxed text-muted">
                    {c.deskripsi}
                  </p>
                </li>
              )
            })}
          </ol>
        )}
      </section>

      <nav
        aria-label="Navigasi antar kontributor"
        className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6"
      >
        {sebelumnya ? (
          <Link to={`/riwayat/${sebelumnya.id}`} className="btn">
            <Ikon ukuran={16}>{IKON.panahKiri}</Ikon>
            <span>{sebelumnya.namaLengkap}</span>
          </Link>
        ) : (
          <span />
        )}
        {berikutnya && (
          <Link to={`/riwayat/${berikutnya.id}`} className="btn">
            <span>{berikutnya.namaLengkap}</span>
            <Ikon ukuran={16}>{IKON.panahKanan}</Ikon>
          </Link>
        )}
      </nav>
    </div>
  )
}
