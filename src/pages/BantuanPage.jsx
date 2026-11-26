import { Link } from 'react-router'
import { PINTASAN_LIST, RINGKASAN_HOOKS } from '../data/proyek.js'

export default function BantuanPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-[clamp(1.625rem,3vw,2.125rem)] font-bold leading-[1.15] tracking-tight text-ink">
          Bantuan dan pintasan keyboard
        </h1>
        <p className="mt-2 text-base text-muted">
          Panduan singkat cara memakai editor, pintasan papan ketik, serta cara kerja tiga modul
          latihan React di Ares Xcode.
        </p>
      </header>

      <section aria-labelledby="judul-pintasan" className="mt-8">
        <h2 id="judul-pintasan" className="text-lg font-bold tracking-tight text-ink">
          Pintasan papan ketik
        </h2>
        <p className="mt-1 text-sm text-muted">
          Pengguna macOS dapat mengganti tombol <kbd className="kbd-cap">Ctrl</kbd> dengan{' '}
          <kbd className="kbd-cap">Cmd</kbd>.
        </p>

        <div className="kartu mt-4 divide-y divide-line p-2 sm:p-3">
          {PINTASAN_LIST.map((item) => (
            <div
              key={item.aksi}
              className="flex flex-col gap-3 px-2 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-ink">{item.aksi}</h3>
                  <span className="rounded-md bg-raised px-2 py-0.5 text-xs font-semibold text-muted">
                    {item.cakupan}
                  </span>
                </div>
                <p className="mt-1 max-w-[60ch] text-sm text-muted">{item.keterangan}</p>
              </div>
              <div className="flex flex-none items-center gap-1.5">
                {item.tombol.map((k, idx) => (
                  <span key={k} className="inline-flex items-center gap-1.5">
                    {idx > 0 && <span className="text-xs text-dim">+</span>}
                    <kbd className="kbd-cap">{k}</kbd>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="judul-cara-pakai" className="mt-10">
        <h2 id="judul-cara-pakai" className="text-lg font-bold tracking-tight text-ink">
          Cara pakai setiap modul
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <article className="kartu-datar space-y-2">
            <p className="font-mono text-xs font-bold text-dim">01 · /editor</p>
            <h3 className="text-base font-bold text-ink">Membaca dan menyunting berkas</h3>
            <p className="text-sm leading-relaxed text-muted">
              Pilih tab <code className="font-mono text-ink">index.html</code>,{' '}
              <code className="font-mono text-ink">about.html</code>, atau{' '}
              <code className="font-mono text-ink">style.css</code>. Aktifkan tombol Mode sunting
              jika ingin mengubah kode dan melihat hasilnya langsung pada panel Preview.
            </p>
          </article>

          <article className="kartu-datar space-y-2">
            <p className="font-mono text-xs font-bold text-dim">02 · /ukuran</p>
            <h3 className="text-base font-bold text-ink">Mengatur ukuran huruf editor</h3>
            <p className="text-sm leading-relaxed text-muted">
              Ubah skala teks 12 sampai 24 px memakai langkah 1 px atau 2 px. Riwayat perubahan
              disimpan di state sehingga tombol Urungkan selalu dapat mengembalikan angka sebelumnya.
            </p>
          </article>

          <article className="kartu-datar space-y-2">
            <p className="font-mono text-xs font-bold text-dim">03 · /tugas</p>
            <h3 className="text-base font-bold text-ink">Mencatat dan menyaring tugas</h3>
            <p className="text-sm leading-relaxed text-muted">
              Tambahkan tugas lewat formulir atas, centang untuk menandai selesai, klik Ubah untuk
              menyunting baris langsung, dan gunakan filter Semua, Aktif, atau Selesai.
            </p>
          </article>

          <article className="kartu-datar space-y-2">
            <p className="font-mono text-xs font-bold text-dim">04 · /riwayat & /riwayat/:id</p>
            <h3 className="text-base font-bold text-ink">Menguji fetch, error, dan cleanup</h3>
            <p className="text-sm leading-relaxed text-muted">
              Pindah kontributor dengan cepat untuk melihat pembatalan permintaan lama lewat
              AbortController. Centang Simulasikan jaringan putus untuk menguji tampilan galat dan
              tombol Coba lagi.
            </p>
          </article>
        </div>
      </section>

      <section aria-labelledby="judul-hooks" className="mt-10">
        <h2 id="judul-hooks" className="text-lg font-bold tracking-tight text-ink">
          Ringkasan hooks latihan
        </h2>
        <div className="kartu mt-4 divide-y divide-line p-2 sm:p-3">
          {RINGKASAN_HOOKS.map((item) => (
            <div
              key={item.rute}
              className="flex flex-col gap-3 px-2 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <code className="rounded-md bg-signal px-2 py-0.5 font-mono text-xs font-bold text-signal-ink">
                    {item.hook}
                  </code>
                  <h3 className="text-base font-bold text-ink">{item.halaman}</h3>
                </div>
                <p className="mt-1 max-w-[60ch] text-sm text-muted">{item.penjelasan}</p>
              </div>
              <Link to={item.rute} className="btn flex-none text-sm">
                Buka {item.rute}
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
