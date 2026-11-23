import Lembar from './Lembar.jsx'

// Panel fitur: jendela berisi satu komponen latihan.
// Di layar sempit tampil sebagai lembar dari bawah, di layar lebar sebagai jendela di tengah.
export default function PanelFitur({ buka, onTutup, judul, children }) {
  return (
    <Lembar
      buka={buka}
      onTutup={onTutup}
      label={judul}
      className="fixed inset-x-0 bottom-0 top-auto m-0 h-[90dvh] w-full max-w-none flex-col overflow-hidden rounded-t-2xl open:flex md:inset-auto md:left-1/2 md:top-1/2 md:h-[min(44rem,88dvh)] md:w-[min(36rem,94vw)] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-2xl"
    >
      <header className="flex h-14 flex-none items-center gap-2 border-b border-line px-4">
        <h2 className="min-w-0 flex-1 truncate text-base font-bold tracking-tight">{judul}</h2>
        <button type="button" className="btn-ikon size-10" onClick={onTutup} aria-label="Tutup">×</button>
      </header>
      <div className="min-h-0 flex-1 overflow-auto p-4 md:p-6">{children}</div>
    </Lembar>
  )
}
