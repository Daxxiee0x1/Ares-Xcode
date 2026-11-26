import { Link } from 'react-router'
import {
  UKURAN_AWAL,
  UKURAN_MAX,
  UKURAN_MIN,
  useWorkspace,
} from '../context/WorkspaceContext.jsx'

const CONTOH_KODE = `const pesan = "Halo, Ares Xcode";
const batas = { min: ${UKURAN_MIN}, max: ${UKURAN_MAX} };

export function skala(ukuran) {
  return \`\${ukuran}px Atkinson Hyperlegible Mono\`;
}`

export default function UkuranPage() {
  const {
    ukuranEditor,
    langkahUkuran,
    riwayatUkuran,
    setLangkahUkuran,
    ubahUkuran,
    urungkanUkuran,
    resetUkuran,
  } = useWorkspace()

  const rasio = ((ukuranEditor - UKURAN_MIN) / (UKURAN_MAX - UKURAN_MIN)) * 100

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="max-w-2xl">
        <h1 className="text-[clamp(1.625rem,3vw,2.125rem)] font-bold leading-[1.15] tracking-tight text-ink">
          Ukuran teks editor
        </h1>
        <p className="mt-2 text-base text-muted">
          Atur ukuran huruf antara {UKURAN_MIN} sampai {UKURAN_MAX} px dengan{' '}
          <code className="font-mono text-sm text-ink">useState</code>. Perubahan langsung
          diterapkan pada CodeMirror di halaman Editor.
        </p>
      </header>

      <div className="mt-7 grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)] lg:items-start">
        <section aria-label="Pengendali ukuran huruf" className="kartu space-y-6">
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              className="btn-ikon"
              onClick={() => ubahUkuran(-langkahUkuran)}
              disabled={ukuranEditor <= UKURAN_MIN}
              aria-label={`Perkecil ukuran teks sebesar ${langkahUkuran} piksel`}
            >
              −
            </button>

            <output className="text-center" aria-live="polite">
              <span className="block font-mono text-5xl font-bold leading-none tabular-nums text-ink">
                {ukuranEditor}
              </span>
              <span className="mt-1 block text-xs font-semibold text-muted">piksel (px)</span>
            </output>

            <button
              type="button"
              className="btn-ikon"
              onClick={() => ubahUkuran(langkahUkuran)}
              disabled={ukuranEditor >= UKURAN_MAX}
              aria-label={`Perbesar ukuran teks sebesar ${langkahUkuran} piksel`}
            >
              +
            </button>
          </div>

          <div>
            <div className="flex justify-between font-mono text-xs tabular-nums text-dim">
              <span>{UKURAN_MIN} px</span>
              <span>Bawaan {UKURAN_AWAL} px</span>
              <span>{UKURAN_MAX} px</span>
            </div>
            <div
              className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-raised"
              role="progressbar"
              aria-label="Posisi ukuran teks dalam rentang"
              aria-valuemin={UKURAN_MIN}
              aria-valuemax={UKURAN_MAX}
              aria-valuenow={ukuranEditor}
            >
              <div
                className="h-full rounded-full bg-signal transition-[width] duration-150 ease-out"
                style={{ width: `${rasio}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-dim">Besar langkah per klik</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Besar langkah">
              <button
                type="button"
                className="pil flex-1 justify-center"
                aria-pressed={langkahUkuran === 1}
                onClick={() => setLangkahUkuran(1)}
              >
                1 px
              </button>
              <button
                type="button"
                className="pil flex-1 justify-center"
                aria-pressed={langkahUkuran === 2}
                onClick={() => setLangkahUkuran(2)}
              >
                2 px
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="btn flex-1"
              onClick={urungkanUkuran}
              disabled={riwayatUkuran.length < 2}
            >
              Urungkan
            </button>
            <button
              type="button"
              className="btn flex-1"
              onClick={resetUkuran}
              disabled={ukuranEditor === UKURAN_AWAL && riwayatUkuran.length === 1}
            >
              Reset ke {UKURAN_AWAL} px
            </button>
          </div>
        </section>

        <section aria-label="Contoh tampilan kode" className="space-y-5">
          <div className="kartu space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
              <p className="font-mono text-xs font-semibold text-muted">
                Pratinjau spesimen · {ukuranEditor} px
              </p>
              <Link to="/editor" className="btn-utama min-h-10 px-3.5 text-sm">
                Buka di editor
              </Link>
            </div>

            <div className="overflow-x-auto rounded-xl bg-bg p-4">
              <pre
                className="font-mono leading-relaxed text-ink"
                style={{ fontSize: `${ukuranEditor}px` }}
              >
                <code>{CONTOH_KODE}</code>
              </pre>
            </div>

            <div>
              <p className="text-xs font-semibold text-dim">Jejak riwayat perubahan</p>
              <ol className="mt-2 flex flex-wrap gap-1.5" aria-label="Riwayat ukuran huruf">
                {riwayatUkuran.slice(-10).map((nilai, idx, arr) => {
                  const terbaru = idx === arr.length - 1
                  return (
                    <li
                      key={`${idx}-${nilai}`}
                      className={`rounded-lg px-2.5 py-1 font-mono text-xs font-semibold tabular-nums ${
                        terbaru
                          ? 'bg-signal text-signal-ink'
                          : 'border border-line bg-raised text-muted'
                      }`}
                    >
                      {nilai} px
                    </li>
                  )
                })}
              </ol>
            </div>

            <p className="stat-bar">
              ukuran = {ukuranEditor} · langkah = {langkahUkuran} · riwayat = [
              {riwayatUkuran.slice(-6).join(', ')}]
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
