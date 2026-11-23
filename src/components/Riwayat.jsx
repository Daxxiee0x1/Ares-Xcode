import { useEffect, useState } from 'react'

const KONTRIBUTOR = [
  { id: 1, nama: 'Budi' },
  { id: 2, nama: 'Siti' },
  { id: 3, nama: 'Agus' },
  { id: 4, nama: 'Dewi' },
  { id: 5, nama: 'Rizky' },
]

// jeda buatan agar loading terlihat saat demo
function jeda(ms, signal) {
  return new Promise((selesai, tolak) => {
    const timer = setTimeout(selesai, ms)
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      tolak(new DOMException('Dibatalkan', 'AbortError'))
    })
  })
}

function catat(setLog, teks) {
  const jam = new Date().toLocaleTimeString('id-ID')
  setLog((lama) => [...lama.slice(-7), `${jam}  ${teks}`])
}

export default function Riwayat() {
  // state: kontributor terpilih
  const [kontributor, setKontributor] = useState(1)

  // state: data dan status ('memuat' | 'sukses' | 'gagal')
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('memuat')
  const [pesanError, setPesanError] = useState('')

  // state: pemicu tombol Coba lagi
  const [percobaan, setPercobaan] = useState(0)

  // state: simulasi jaringan putus
  const [simulasiError, setSimulasiError] = useState(false)

  // state: log efek
  const [log, setLog] = useState([])

  // state: commit yang dibuka
  const [terbuka, setTerbuka] = useState(null)

  // efek: ambil data
  useEffect(() => {
    const pembatal = new AbortController()
    catat(setLog, `Efek berjalan: kontributor=${kontributor}`)
    setStatus('memuat')
    setTerbuka(null)

    async function muat() {
      try {
        await jeda(700, pembatal.signal)
        if (simulasiError) throw new Error('Jaringan terputus (simulasi)')

        const alamat = `${import.meta.env.BASE_URL}data/commits-${kontributor}.json`
        const respons = await fetch(alamat, { signal: pembatal.signal })
        if (!respons.ok) throw new Error(`Server membalas ${respons.status}`)

        const hasil = await respons.json()
        setData(hasil)
        setStatus('sukses')
        catat(setLog, `Data diterima: ${hasil.commit.length} commit`)
      } catch (galat) {
        if (galat.name === 'AbortError') return
        setPesanError(galat.message)
        setStatus('gagal')
        catat(setLog, `Gagal: ${galat.message}`)
      }
    }
    muat()

    // cleanup
    return () => {
      pembatal.abort()
      catat(setLog, `Cleanup: permintaan kontributor=${kontributor} dibatalkan`)
    }
  }, [kontributor, percobaan, simulasiError]) // dependency array

  return (
    <section className="space-y-4">
      <p className="bantu">Data dummy dari file JSON. Ganti kontributor untuk melihat efek berjalan lagi.</p>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Pilih kontributor">
        {KONTRIBUTOR.map((k) => (
          <button key={k.id} className="pil" aria-pressed={kontributor === k.id} onClick={() => setKontributor(k.id)}>
            {k.nama}
          </button>
        ))}
      </div>

      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
        <input
          type="checkbox"
          className="size-5 accent-[var(--color-signal)]"
          checked={simulasiError}
          onChange={(e) => setSimulasiError(e.target.checked)}
        />
        Simulasikan jaringan putus
      </label>

      <div className="kartu space-y-2" aria-live="polite" aria-busy={status === 'memuat'}>
        {status === 'memuat' && (
          <>
            <div className="skeleton" />
            <div className="skeleton" />
            <div className="skeleton" />
          </>
        )}

        {status === 'gagal' && (
          <div className="space-y-3 p-2">
            <p className="font-bold text-bad">Data gagal dimuat</p>
            <p className="bantu">{pesanError}. Matikan simulasi jika perlu, lalu coba lagi.</p>
            <button className="btn-utama" onClick={() => setPercobaan(percobaan + 1)}>Coba lagi</button>
          </div>
        )}

        {status === 'sukses' && data && (
          <>
            <p className="bantu px-2">{data.kontributor.nama} · {data.kontributor.peran}</p>
            <ul className="space-y-1">
              {data.commit.map((c) => (
                <li key={c.hash}>
                  <button
                    className="baris w-full text-left"
                    aria-expanded={terbuka === c.hash}
                    onClick={() => setTerbuka(terbuka === c.hash ? null : c.hash)}
                  >
                    <code className="rounded bg-signal px-1.5 py-0.5 font-mono text-xs font-bold text-signal-ink">{c.hash}</code>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{c.pesan}</span>
                      <span className="bantu">{new Date(c.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </span>
                  </button>
                  {terbuka === c.hash && <p className="bantu px-3 pb-3 pl-11">{c.deskripsi}</p>}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div>
        <p className="bantu mb-1">Log efek</p>
        <pre className="kartu min-h-24 overflow-x-auto font-mono text-xs leading-5 text-muted" aria-label="Log efek">
          {log.length ? log.join('\n') : 'Belum ada.'}
        </pre>
      </div>

      <p className="stat">
        kontributor = {kontributor} · status = {status} · percobaan = {percobaan}
      </p>
    </section>
  )
}
