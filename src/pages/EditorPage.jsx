import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import CodePanel from '../components/CodePanel.jsx'
import { Ikon, IKON } from '../components/Ikon.jsx'
import { useWorkspace } from '../context/WorkspaceContext.jsx'

function rakitDokumenPreview(htmlKode, cssKode) {
  const gayaInline = `<style>\n${cssKode}\n</style>`
  if (htmlKode.includes('<link rel="stylesheet" href="style.css">')) {
    return htmlKode.replace('<link rel="stylesheet" href="style.css">', gayaInline)
  }
  if (htmlKode.includes('</head>')) {
    return htmlKode.replace('</head>', `${gayaInline}\n</head>`)
  }
  return `${gayaInline}\n${htmlKode}`
}

export default function EditorPage() {
  const {
    berkasList,
    aktifIndex,
    setAktifIndex,
    updateKodeBerkas,
    resetBerkasAktif,
    berkasBerubah,
    ukuranEditor,
    modeEdit,
    setModeEdit,
    previewTerbuka,
    setPreviewTerbuka,
    togglePreview,
  } = useWorkspace()

  const [versiReset, setVersiReset] = useState(0)

  const berkas = berkasList[aktifIndex] ?? berkasList[0]
  const jumlahBaris = berkas.kode.replace(/\n$/, '').split('\n').length
  const sudahDiubah = berkasBerubah(aktifIndex)
  const adaPerubahanSembarang = berkasList.some((_, idx) => berkasBerubah(idx))

  const targetPreviewNama = berkas.bahasa === 'css' ? 'index.html' : berkas.nama

  const srcDocPreview = useMemo(() => {
    if (!adaPerubahanSembarang) return null
    const berkasHtml = berkasList.find((b) => b.nama === targetPreviewNama) ?? berkasList[0]
    const berkasCss = berkasList.find((b) => b.nama === 'style.css')
    return rakitDokumenPreview(berkasHtml.kode, berkasCss?.kode ?? '')
  }, [adaPerubahanSembarang, berkasList, targetPreviewNama])

  function kembalikanBerkas() {
    resetBerkasAktif(aktifIndex)
    setVersiReset((v) => v + 1)
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex flex-none flex-wrap items-center justify-between gap-2 border-b border-line bg-surface px-3 py-1.5 sm:px-4">
        <nav aria-label="Tab berkas proyek" className="flex min-w-0 items-end gap-1 overflow-x-auto">
          {berkasList.map((b, i) => {
            const aktif = i === aktifIndex
            const diubah = berkasBerubah(i)
            return (
              <button
                key={b.nama}
                type="button"
                aria-current={aktif ? 'page' : undefined}
                onClick={() => setAktifIndex(i)}
                className={`relative inline-flex min-h-11 flex-none items-center gap-2 rounded-t-lg px-3 text-sm transition-[color,background-color] duration-150 ${
                  aktif
                    ? 'font-bold text-ink'
                    : 'font-medium text-muted hover:bg-raised/50 hover:text-ink'
                }`}
              >
                <Ikon ukuran={15}>{IKON.kode}</Ikon>
                <span className="font-mono">{b.nama}</span>
                {diubah && <span className="sr-only">(sudah diubah)</span>}
                {diubah && <span aria-hidden="true" className="size-1.5 rounded-full bg-signal" />}
                {aktif && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-signal"
                  />
                )}
              </button>
            )
          })}
        </nav>

        <div className="flex flex-none items-center gap-2">
          <button
            type="button"
            aria-pressed={modeEdit}
            onClick={() => setModeEdit(!modeEdit)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-[background-color,color,border-color,transform] duration-150 active:scale-[0.96] ${
              modeEdit
                ? 'border-transparent bg-ink text-bg'
                : 'border-line-strong bg-surface text-ink hover:bg-raised'
            }`}
          >
            <Ikon ukuran={16}>{IKON.sunting}</Ikon>
            <span>{modeEdit ? 'Mode sunting' : 'Hanya baca'}</span>
          </button>

          {sudahDiubah && (
            <button
              type="button"
              onClick={kembalikanBerkas}
              className="btn px-3 text-sm"
              aria-label={`Kembalikan isi awal ${berkas.nama}`}
            >
              <Ikon ukuran={16}>{IKON.ulang}</Ikon>
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}

          <button type="button" onClick={togglePreview} className="btn-utama min-h-11 px-3.5 text-sm">
            <Ikon ukuran={16} isi>
              {IKON.main}
            </Ikon>
            <span className={previewTerbuka ? 'hidden lg:inline' : 'inline lg:hidden'}>Preview</span>
            <span className={previewTerbuka ? 'inline lg:hidden' : 'hidden lg:inline'}>
              Tutup preview
            </span>
          </button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <section
          aria-label={`Editor kode ${berkas.nama}`}
          className="min-h-0 min-w-0 flex-1 overflow-hidden bg-bg"
          style={{ '--ukuran-kode': `${ukuranEditor}px` }}
        >
          <CodePanel
            key={`${berkas.nama}-${modeEdit ? 'edit' : 'ro'}-${versiReset}`}
            kode={berkas.kode}
            bahasa={berkas.bahasa}
            readOnly={!modeEdit}
            onChange={(kodeBaru) => updateKodeBerkas(aktifIndex, kodeBaru)}
          />
        </section>

        <aside
          aria-label="Pratinjau halaman"
          className={`fixed inset-0 z-30 flex-col border-l border-line bg-surface shadow-[var(--shadow-elevated)] md:absolute md:inset-y-0 md:left-auto md:right-0 md:w-[26rem] lg:static lg:w-[46%] lg:flex-none lg:shadow-none ${
            previewTerbuka ? 'flex lg:hidden' : 'hidden lg:flex'
          }`}
        >
          <div className="flex h-12 flex-none items-center justify-between gap-2 border-b border-line bg-surface px-3">
            <span className="truncate font-mono text-xs font-semibold text-muted">
              Preview · {targetPreviewNama}
              {adaPerubahanSembarang ? ' (langsung)' : ''}
            </span>
            <button
              type="button"
              onClick={() => setPreviewTerbuka(false)}
              className="btn min-h-10 px-3 text-xs lg:hidden"
            >
              <Ikon ukuran={16}>{IKON.panahKiri}</Ikon>
              Kembali ke editor
            </button>
          </div>
          {srcDocPreview ? (
            <iframe
              title={`Preview langsung ${targetPreviewNama}`}
              srcDoc={srcDocPreview}
              sandbox="allow-same-origin"
              className="w-full flex-1 border-0 bg-white"
            />
          ) : (
            <iframe
              key={targetPreviewNama}
              title={`Preview ${targetPreviewNama}`}
              src={`/preview/${targetPreviewNama}`}
              className="w-full flex-1 border-0 bg-white"
            />
          )}
        </aside>
      </div>

      <footer className="hidden h-9 flex-none items-center gap-4 border-t border-line bg-surface px-4 font-mono text-xs tabular-nums text-muted sm:flex">
        <span>
          {berkas.bahasa.toUpperCase()} · {jumlahBaris} baris
        </span>
        <span>{modeEdit ? 'Mode sunting aktif' : 'Mode hanya-baca'}</span>
        <span className="flex-1" />
        <Link
          to="/ukuran"
          className="rounded-md px-2 py-1 text-ink underline decoration-line-strong underline-offset-4 hover:bg-raised"
        >
          Teks {ukuranEditor} px
        </Link>
        <span>{berkasList.length} file</span>
      </footer>
    </div>
  )
}
