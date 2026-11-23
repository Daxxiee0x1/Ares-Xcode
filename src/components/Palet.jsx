import Lembar from './Lembar.jsx'

// Palet perintah (Ctrl K): satu pintu untuk semua aksi.
export default function Palet({ buka, onTutup, onPilih, ukuran }) {
  return (
    <Lembar
      buka={buka}
      onTutup={onTutup}
      label="Palet perintah"
      className="fixed inset-x-0 bottom-auto top-[8vh] m-auto h-fit w-[min(36rem,calc(100%-2rem))] max-w-none overflow-hidden rounded-2xl"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <svg className="flex-none text-dim" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5" /></svg>
        <p className="h-14 flex-1 content-center text-base text-dim">Perintah</p>
        <kbd className="rounded border border-ink/15 bg-ink/5 px-1.5 py-0.5 font-sans text-[11px] font-medium text-muted">Esc</kbd>
      </div>

      <ul className="max-h-[60vh] overflow-auto p-2">
        <Item aksi="preview" onPilih={onPilih} utama tombol="Ctrl Enter">Jalankan preview</Item>
        <Item aksi="berkas" onPilih={onPilih} tombol="Ctrl P">Buka file…</Item>

        <li className="px-3 pt-3 text-xs uppercase tracking-wide text-dim">Alat proyek</li>
        <Item aksi="ukuran" onPilih={onPilih} tombol={`${ukuran} px`}>Ukuran teks editor</Item>
        <Item aksi="tugas" onPilih={onPilih}>Tugas proyek</Item>
        <Item aksi="riwayat" onPilih={onPilih}>Riwayat commit</Item>

        <li className="px-3 pt-3 text-xs uppercase tracking-wide text-dim">Belum tersedia</li>
        <Mati>File baru…</Mati>
        <Mati>Ganti nama file ini…</Mati>
        <Mati>Hapus file ini</Mati>
        <Mati>Bahasa: Indonesia / English</Mati>
        <Mati>Tema (saat ini mengikuti sistem)</Mati>
      </ul>
    </Lembar>
  )
}

function Item({ aksi, onPilih, tombol, utama, children }) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onPilih(aksi)}
        className={`flex min-h-11 w-full cursor-pointer items-center gap-3 rounded-lg px-3 text-left hover:bg-raised focus-visible:bg-raised focus-visible:outline-2 focus-visible:outline-signal ${utama ? 'bg-raised font-medium' : ''}`}
      >
        <span className="flex-1">{children}</span>
        {tombol && <kbd className="font-sans text-xs text-muted">{tombol}</kbd>}
      </button>
    </li>
  )
}

function Mati({ children }) {
  return <li className="flex min-h-11 items-center rounded-lg px-3 opacity-50" aria-disabled="true">{children}</li>
}
