import { useEffect, useState } from 'react'
import { BERKAS } from './data/berkas.js'
import CodePanel from './components/CodePanel.jsx'
import Lembar from './components/Lembar.jsx'
import Palet from './components/Palet.jsx'
import PanelFitur from './components/PanelFitur.jsx'
import Counter from './components/Counter.jsx'
import Tugas from './components/Tugas.jsx'
import Riwayat from './components/Riwayat.jsx'

const Ikon = ({ d, ukuran = 20, isi = false }) => (
  <svg width={ukuran} height={ukuran} viewBox="0 0 24 24" fill={isi ? 'currentColor' : 'none'} stroke={isi ? 'none' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)
const KODE = <path d="M8.5 8L4.5 12l4 4M15.5 8l4 4-4 4" />
const BERKAS_IKON = <><path d="M6 4h8l4 4v12H6z" /><path d="M14 4v4h4" /></>
const MAIN = <path d="M7 5l12 7-12 7z" />
const CARI = <><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></>
const MENU = <path d="M5 7h14M5 12h14M5 17h14" />

export default function App() {
  // Indeks file yang sedang dibuka di editor
  const [aktif, setAktif] = useState(0)

  // Preview terbuka? (di layar lebar preview tampil secara bawaan, jadi nilai ini
  // berarti "sembunyikan"; di layar sempit berarti "tampilkan")
  const [pv, setPv] = useState(false)

  // Lembar yang sedang terbuka: null | 'berkas' | 'palet' | 'ukuran' | 'tugas' | 'riwayat'
  const [lembar, setLembar] = useState(null)

  // Ukuran teks editor (px). Diubah oleh komponen Counter lewat onUkuran.
  const [ukuranEditor, setUkuranEditor] = useState(14)

  // Petunjuk pertama kali di ponsel
  const [petunjuk, setPetunjuk] = useState(true)

  const berkas = BERKAS[aktif]
  const jumlahBaris = berkas.kode.split('\n').length - 1
  const tutup = () => setLembar(null)

  // Pintasan keyboard: Ctrl/Cmd + K (palet), P (file), Enter (preview)
  useEffect(() => {
    function tekan(e) {
      if (!(e.ctrlKey || e.metaKey)) return
      const kunci = e.key.toLowerCase()
      if (kunci === 'k') { e.preventDefault(); setLembar('palet') }
      if (kunci === 'p') { e.preventDefault(); setLembar('berkas') }
      if (kunci === 'enter') { e.preventDefault(); setPv((sekarang) => !sekarang) }
    }
    window.addEventListener('keydown', tekan)
    return () => window.removeEventListener('keydown', tekan)
  }, [])

  // Aksi dari palet perintah
  function pilihAksi(aksi) {
    if (aksi === 'preview') { setPv(!pv); tutup() }
    else setLembar(aksi) // 'berkas' | 'ukuran' | 'tugas' | 'riwayat'
  }

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden">
      {/* ============ HEADER ============ */}
      <header className="flex h-14 flex-none items-center gap-2 border-b border-line bg-surface px-3 md:px-4">
        <div className="flex items-center gap-2 pr-1">
          <img src="./logo.svg" alt="" width="32" height="32" className="size-8" />
          <span className="hidden text-base font-bold tracking-tight sm:inline">
            Ares <span className="font-medium text-muted">Xcode</span>
          </span>
        </div>

        <button
          type="button"
          onClick={() => setLembar('berkas')}
          aria-haspopup="dialog"
          className="inline-flex min-h-12 min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-xl border border-line bg-raised/70 py-1 pl-2 pr-3 text-left text-ink hover:bg-raised focus-visible:outline-2 focus-visible:outline-signal md:flex-none"
        >
          <span className="grid size-8 flex-none place-items-center rounded-lg bg-signal text-signal-ink"><Ikon d={KODE} /></span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold leading-5">{berkas.nama}</span>
            <span className="block truncate text-xs leading-4 text-muted">{berkas.bahasa.toUpperCase()} · {jumlahBaris} baris</span>
          </span>
          <span className="flex-none text-dim"><Ikon d={<path d="M7 10l5 5 5-5" />} ukuran={16} /></span>
        </button>

        <div className="hidden flex-1 md:block" />

        <button
          type="button"
          onClick={() => setPv(!pv)}
          className="hidden h-10 cursor-pointer items-center gap-2 rounded-xl bg-ink px-4 font-bold text-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal md:inline-flex"
        >
          <Ikon d={MAIN} isi />
          <span className={pv ? 'hidden lg:inline' : 'inline lg:hidden'}>Preview</span>
          <span className={pv ? 'inline lg:hidden' : 'hidden lg:inline'}>Tutup</span>
        </button>

        <button
          type="button"
          onClick={() => setLembar('palet')}
          aria-haspopup="dialog"
          className="hidden h-10 cursor-pointer items-center gap-2 rounded-xl border border-line px-3 font-medium text-muted hover:bg-raised/60 focus-visible:outline-2 focus-visible:outline-signal md:inline-flex"
        >
          <Ikon d={CARI} />
          Perintah
          <kbd className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-ink/15 bg-ink/5 px-1.5 font-sans text-[11px] font-medium text-muted">Ctrl K</kbd>
        </button>
      </header>

      {/* ============ TAB ============ */}
      <nav aria-label="File proyek" className="hidden h-10 flex-none items-end gap-1 border-b border-line px-4 md:flex">
        {BERKAS.map((b, i) => (
          <button
            key={b.nama}
            type="button"
            aria-current={i === aktif ? 'page' : undefined}
            onClick={() => setAktif(i)}
            className={`relative flex h-10 cursor-pointer items-center gap-2 px-3 text-sm font-medium hover:text-ink ${i === aktif ? 'text-ink' : 'text-muted'}`}
          >
            <Ikon d={KODE} ukuran={16} />
            {b.nama}
            {i === aktif && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded bg-signal" />}
          </button>
        ))}
      </nav>

      {/* ============ AREA UTAMA ============ */}
      <main className="relative flex min-h-0 flex-1">
        <section aria-label="Editor" className="min-h-0 min-w-0 flex-1" style={{ '--ukuran-kode': `${ukuranEditor}px` }}>
          {/* key: ganti file = editor baru */}
          <CodePanel key={berkas.nama} kode={berkas.kode} bahasa={berkas.bahasa} />
        </section>

        {/* Petunjuk pertama kali (ponsel) */}
        {petunjuk && (
          <div className="absolute inset-x-3 bottom-3 z-10 flex items-center gap-3 rounded-2xl border border-line bg-raised p-3 text-sm shadow-lg md:hidden">
            <p className="flex-1 text-muted">Ketuk <b className="text-ink">Menu</b> untuk semua perintah, <b className="text-ink">File</b> untuk pindah file.</p>
            <button type="button" onClick={() => setPetunjuk(false)} className="inline-flex h-11 cursor-pointer items-center rounded-xl bg-signal px-4 font-bold text-signal-ink">Mengerti</button>
          </div>
        )}

        {/* Preview */}
        <aside
          aria-label="Preview"
          className={`fixed inset-0 z-30 flex-col border-l border-line bg-surface shadow-2xl md:absolute md:inset-y-0 md:left-auto md:right-0 md:w-104 lg:static lg:w-1/2 lg:flex-none lg:shadow-none ${pv ? 'flex lg:hidden' : 'hidden lg:flex'}`}
        >
          <div className="flex h-12 flex-none items-center gap-2 border-b border-line px-3">
            <span className="flex-1 truncate text-sm font-medium text-muted">Preview · {berkas.bahasa === 'css' ? 'index.html' : berkas.nama}</span>
            <button type="button" onClick={() => setPv(false)} className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-xl border border-line px-3 text-sm font-medium text-ink lg:hidden">
              <Ikon d={<path d="M15 6l-6 6 6 6" />} ukuran={18} />
              Kembali ke editor
            </button>
          </div>
          <iframe
            key={berkas.nama}
            title={`Preview ${berkas.nama}`}
            src={`./preview/${berkas.bahasa === 'css' ? 'index.html' : berkas.nama}`}
            className="w-full flex-1 border-0 bg-white"
          />
        </aside>
      </main>

      {/* ============ STATUS BAR ============ */}
      <footer className="hidden h-8 flex-none items-center gap-4 border-t border-line bg-surface px-4 text-xs text-muted md:flex">
        <span>{berkas.bahasa.toUpperCase()} · {jumlahBaris} baris</span>
        <span className="flex-1" />
        <span>Teks {ukuranEditor} px</span>
        <span>{BERKAS.length} file</span>
      </footer>

      {/* ============ BAR BAWAH (ponsel) ============ */}
      <nav aria-label="Aksi utama" className="grid h-16 flex-none grid-cols-3 gap-2 border-t border-line bg-surface p-2 md:hidden">
        <button type="button" onClick={() => setLembar('berkas')} className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line font-medium text-ink">
          <Ikon d={BERKAS_IKON} />File
        </button>
        <button type="button" onClick={() => setPv(!pv)} className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-signal font-bold text-signal-ink">
          <Ikon d={MAIN} isi />Jalankan
        </button>
        <button type="button" onClick={() => setLembar('palet')} className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl border border-line font-medium text-ink">
          <Ikon d={MENU} />Menu
        </button>
      </nav>

      {/* ============ LEMBAR: DAFTAR FILE ============ */}
      <Lembar
        buka={lembar === 'berkas'}
        onTutup={tutup}
        label="Buka file"
        className="fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-none overflow-auto rounded-t-2xl p-2 md:inset-x-auto md:bottom-auto md:left-4 md:top-14 md:w-80 md:rounded-xl"
      >
        <p className="px-3 pb-1 pt-2 text-xs font-medium uppercase tracking-wide text-dim">Buka file</p>
        <ul className="flex flex-col">
          {BERKAS.map((b, i) => (
            <li key={b.nama}>
              <button
                type="button"
                onClick={() => { setAktif(i); tutup() }}
                className={`flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left hover:bg-raised ${i === aktif ? 'bg-raised font-bold' : ''}`}
              >
                <span className="text-muted"><Ikon d={KODE} ukuran={16} /></span>
                <span className="flex-1">{b.nama}</span>
                {i === aktif && <span className="text-xs font-medium text-muted">Aktif</span>}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-1 flex items-center justify-between gap-2 border-t border-line px-1 pt-2">
          <span className="px-2 text-xs text-dim">+ File baru: belum aktif</span>
          <button type="button" onClick={tutup} className="inline-flex h-11 cursor-pointer items-center rounded-lg bg-ink px-4 font-bold text-bg">Selesai</button>
        </div>
      </Lembar>

      {/* ============ LEMBAR: PALET PERINTAH ============ */}
      <Palet buka={lembar === 'palet'} onTutup={tutup} onPilih={pilihAksi} ukuran={ukuranEditor} />

      {/* ============ LEMBAR: TIGA KOMPONEN LATIHAN ============ */}
      {/* Counter dan Tugas selalu terpasang (state-nya awet saat panel ditutup).
          Riwayat hanya dipasang saat panel terbuka, supaya efek fetch berjalan setiap kali dibuka. */}
      <PanelFitur buka={lembar === 'ukuran'} onTutup={tutup} judul="Ukuran teks editor">
        <Counter onUkuran={setUkuranEditor} />
      </PanelFitur>
      <PanelFitur buka={lembar === 'tugas'} onTutup={tutup} judul="Tugas proyek">
        <Tugas />
      </PanelFitur>
      <PanelFitur buka={lembar === 'riwayat'} onTutup={tutup} judul="Riwayat commit">
        {lembar === 'riwayat' && <Riwayat />}
      </PanelFitur>
    </div>
  )
}
