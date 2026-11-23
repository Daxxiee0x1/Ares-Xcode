import { useState } from 'react'

const MIN = 12
const MAX = 24
const AWAL = 14

export default function Counter({ onUkuran }) {
  // state: ukuran
  const [ukuran, setUkuran] = useState(AWAL)

  // state: langkah
  const [langkah, setLangkah] = useState(1)

  // state: riwayat
  const [riwayat, setRiwayat] = useState([AWAL])

  function ubah(selisih) {
    const baru = Math.min(MAX, Math.max(MIN, ukuran + selisih))
    if (baru === ukuran) return

    setUkuran(baru)
    setRiwayat([...riwayat, baru]) // array baru, bukan push
    onUkuran(baru)
  }

  function urungkan() {
    if (riwayat.length < 2) return
    const sisa = riwayat.slice(0, -1)
    setRiwayat(sisa)
    setUkuran(sisa[sisa.length - 1])
    onUkuran(sisa[sisa.length - 1])
  }

  function reset() {
    setUkuran(AWAL)
    setRiwayat([AWAL])
    onUkuran(AWAL)
  }

  return (
    <section className="space-y-4">
      <p className="bantu">Atur ukuran huruf di editor Ares Xcode. Contoh kode di bawah ikut berubah.</p>

      <div className="kartu flex items-center justify-between gap-3">
        <button className="btn-ikon" onClick={() => ubah(-langkah)} disabled={ukuran <= MIN} aria-label="Perkecil">−</button>
        <output className="text-center" aria-live="polite">
          <span className="block text-4xl font-bold tabular-nums">{ukuran}</span>
          <span className="bantu">px</span>
        </output>
        <button className="btn-ikon" onClick={() => ubah(langkah)} disabled={ukuran >= MAX} aria-label="Perbesar">+</button>
      </div>

      <div className="kartu overflow-x-auto">
        <code className="font-mono whitespace-pre text-ink" style={{ fontSize: ukuran }}>
          {'const pesan = "Halo, Ares Xcode"'}
        </code>
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Besar langkah">
        <span className="bantu">Langkah</span>
        <button className="pil" aria-pressed={langkah === 1} onClick={() => setLangkah(1)}>1 px</button>
        <button className="pil" aria-pressed={langkah === 2} onClick={() => setLangkah(2)}>2 px</button>
      </div>

      <div className="flex gap-2">
        <button className="btn" onClick={urungkan} disabled={riwayat.length < 2}>Urungkan</button>
        <button className="btn" onClick={reset} disabled={ukuran === AWAL && riwayat.length === 1}>Reset</button>
      </div>

      <p className="stat">
        ukuran = {ukuran} · langkah = {langkah} · riwayat = [{riwayat.slice(-6).join(', ')}]
      </p>
    </section>
  )
}
