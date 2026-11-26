import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router'
import { Ikon, IKON } from './Ikon.jsx'
import Lembar from './Lembar.jsx'
import Palet from './Palet.jsx'
import { useWorkspace } from '../context/WorkspaceContext.jsx'

const JUDUL_RUTE = {
  '/': 'Beranda',
  '/editor': 'Editor Utama',
  '/ukuran': 'Ukuran Teks Editor',
  '/tugas': 'Daftar Tugas',
  '/riwayat': 'Riwayat Commit',
  '/bantuan': 'Bantuan & Pintasan',
}

function resolveJudulRute(pathname) {
  if (pathname in JUDUL_RUTE) return JUDUL_RUTE[pathname]
  if (pathname.startsWith('/riwayat/')) return 'Detail Kontributor'
  return 'Halaman Tidak Ditemukan'
}

export default function ShellLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    berkasList,
    aktifIndex,
    setAktifIndex,
    ukuranEditor,
    tugas,
    togglePreview,
    tema,
    putarTema,
  } = useWorkspace()

  const [railRingkas, setRailRingkas] = useState(false)
  const [lembarAktif, setLembarAktif] = useState(null)

  const sisaTugas = tugas.filter((t) => !t.selesai).length
  const judulHalaman = resolveJudulRute(location.pathname)
  const adalahEditor = location.pathname === '/editor'

  useEffect(() => {
    document.title = `${judulHalaman} · Ares Xcode`
    document.documentElement.lang = 'id'
  }, [judulHalaman])

  useEffect(() => {
    function tekan(e) {
      if (!(e.ctrlKey || e.metaKey)) return
      const kunci = e.key.toLowerCase()
      if (kunci === 'k') {
        e.preventDefault()
        setLembarAktif((lama) => (lama === 'palet' ? null : 'palet'))
      } else if (kunci === 'p') {
        e.preventDefault()
        setLembarAktif((lama) => (lama === 'berkas' ? null : 'berkas'))
      } else if (kunci === 'enter' && location.pathname === '/editor') {
        e.preventDefault()
        togglePreview()
      }
    }
    window.addEventListener('keydown', tekan)
    return () => window.removeEventListener('keydown', tekan)
  }, [location.pathname, togglePreview])

  const kelompokNav = [
    {
      judul: 'Ruang kerja',
      item: [
        { ke: '/', label: 'Beranda', ikon: IKON.beranda, akhir: true },
        { ke: '/editor', label: 'Editor', ikon: IKON.kode },
      ],
    },
    {
      judul: 'Alat latihan',
      item: [
        { ke: '/ukuran', label: 'Ukuran teks', ikon: IKON.ukuran, lencana: `${ukuranEditor}px` },
        {
          ke: '/tugas',
          label: 'Daftar tugas',
          ikon: IKON.tugas,
          lencana: sisaTugas > 0 ? String(sisaTugas) : undefined,
        },
        { ke: '/riwayat', label: 'Riwayat commit', ikon: IKON.riwayat },
      ],
    },
    {
      judul: 'Dokumentasi',
      item: [
        { ke: '/bantuan', label: 'Bantuan', ikon: IKON.bantuan },
      ],
    },
  ]

  const labelTema =
    tema === 'system' ? 'Tema: Sistem' : tema === 'light' ? 'Tema: Terang' : 'Tema: Gelap'
  const ikonTema = tema === 'system' ? IKON.monitor : tema === 'light' ? IKON.matahari : IKON.bulan

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden bg-bg text-ink">
      <a href="#konten-utama" className="skip-link">
        Langsung ke konten utama
      </a>

      <div className="flex min-h-0 flex-1">
        <aside
          aria-label="Navigasi utama"
          className={`hidden flex-none flex-col border-r border-line bg-surface transition-[width] duration-200 ease-out lg:flex ${
            railRingkas ? 'w-[4.5rem]' : 'w-60'
          }`}
        >
          <div className="flex h-14 flex-none items-center justify-between gap-2 border-b border-line px-3">
            <Link
              to="/"
              className="flex min-h-11 min-w-0 items-center gap-2.5 rounded-lg px-1.5 text-ink hover:bg-raised/70"
              aria-label="Ares Xcode, kembali ke beranda"
            >
              <img
                src="/logo.svg"
                alt=""
                width={28}
                height={28}
                className="size-7 flex-none rounded-lg"
              />
              {!railRingkas && (
                <span className="truncate text-base font-bold tracking-tight">
                  Ares <span className="font-medium text-muted">Xcode</span>
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setRailRingkas((r) => !r)}
              aria-expanded={!railRingkas}
              aria-label={railRingkas ? 'Lebarkan bilah navigasi' : 'Ringkaskan bilah navigasi'}
              title={railRingkas ? 'Lebarkan bilah navigasi' : 'Ringkaskan bilah navigasi'}
              className="inline-flex size-9 flex-none items-center justify-center rounded-lg text-muted hover:bg-raised hover:text-ink"
            >
              <Ikon ukuran={18}>{IKON.sidebar}</Ikon>
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-2.5 py-3" aria-label="Menu halaman">
            {kelompokNav.map((kelompok, idx) => (
              <div key={kelompok.judul} className={idx > 0 ? 'mt-5' : ''}>
                {!railRingkas ? (
                  <p className="px-2.5 pb-1.5 text-xs font-semibold text-dim">{kelompok.judul}</p>
                ) : (
                  idx > 0 && <div className="mx-2 mb-2 border-t border-line" aria-hidden="true" />
                )}
                <ul className="space-y-1">
                  {kelompok.item.map((nav) => (
                    <li key={nav.ke}>
                      <NavLink
                        to={nav.ke}
                        end={nav.akhir}
                        title={railRingkas ? nav.label : undefined}
                        aria-label={railRingkas ? nav.label : undefined}
                        className={({ isActive }) =>
                          `group relative flex min-h-11 items-center gap-3 rounded-xl px-2.5 text-sm transition-[background-color,color] duration-150 ${
                            railRingkas ? 'justify-center' : ''
                          } ${
                            isActive
                              ? 'bg-raised font-bold text-ink'
                              : 'font-medium text-muted hover:bg-raised/60 hover:text-ink'
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <span
                                aria-hidden="true"
                                className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-signal"
                              />
                            )}
                            <Ikon
                              ukuran={18}
                              className={isActive ? 'text-ink' : 'text-muted group-hover:text-ink'}
                            >
                              {nav.ikon}
                            </Ikon>
                            {!railRingkas && (
                              <>
                                <span className="min-w-0 flex-1 truncate">{nav.label}</span>
                                {nav.lencana && (
                                  <span className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[11px] font-semibold tabular-nums text-muted">
                                    {nav.lencana}
                                  </span>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="border-t border-line p-2.5">
            <button
              type="button"
              onClick={putarTema}
              aria-label={labelTema}
              title={labelTema}
              className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-2.5 text-sm font-medium text-muted transition-[background-color,color] duration-150 hover:bg-raised hover:text-ink ${
                railRingkas ? 'justify-center' : ''
              }`}
            >
              <Ikon ukuran={18}>{ikonTema}</Ikon>
              {!railRingkas && <span className="truncate">{labelTema}</span>}
            </button>
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="flex h-14 flex-none items-center gap-2 border-b border-line bg-surface px-3 sm:px-4">
            <Link
              to="/"
              className="flex min-h-11 items-center gap-2 rounded-lg pr-1 text-ink lg:hidden"
              aria-label="Ares Xcode, beranda"
            >
              <img
                src="/logo.svg"
                alt=""
                width={28}
                height={28}
                className="size-7 flex-none rounded-lg"
              />
              <span className="hidden text-base font-bold tracking-tight sm:inline">
                Ares <span className="font-medium text-muted">Xcode</span>
              </span>
            </Link>

            <div className="hidden h-5 w-px bg-line sm:block lg:hidden" aria-hidden="true" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-ink">{judulHalaman}</p>
              <p className="truncate font-mono text-xs text-muted">{location.pathname}</p>
            </div>

            <nav
              aria-label="Navigasi tablet"
              className="hidden items-center gap-1 md:flex lg:hidden"
            >
              {[
                { ke: '/editor', label: 'Editor' },
                { ke: '/ukuran', label: 'Ukuran' },
                { ke: '/tugas', label: 'Tugas' },
                { ke: '/riwayat', label: 'Riwayat' },
              ].map((item) => (
                <NavLink
                  key={item.ke}
                  to={item.ke}
                  className={({ isActive }) =>
                    `inline-flex min-h-10 items-center rounded-lg px-2.5 text-sm font-medium transition-[background-color,color] duration-150 ${
                      isActive
                        ? 'bg-raised font-bold text-ink'
                        : 'text-muted hover:bg-raised/60 hover:text-ink'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button
              type="button"
              onClick={putarTema}
              aria-label={labelTema}
              title={labelTema}
              className="inline-flex size-11 flex-none items-center justify-center rounded-xl border border-line bg-surface text-muted transition-[background-color,color] duration-150 hover:bg-raised hover:text-ink lg:hidden"
            >
              <Ikon ukuran={18}>{ikonTema}</Ikon>
            </button>

            <button
              type="button"
              onClick={() => setLembarAktif('palet')}
              aria-haspopup="dialog"
              className="hidden min-h-11 items-center gap-2 rounded-xl border border-line-strong bg-surface px-3 text-sm font-semibold text-ink transition-[background-color,transform] duration-150 hover:bg-raised active:scale-[0.96] sm:inline-flex"
            >
              <Ikon ukuran={17}>{IKON.cari}</Ikon>
              <span>Perintah</span>
              <kbd className="kbd-cap">Ctrl K</kbd>
            </button>

            <button
              type="button"
              onClick={() => setLembarAktif('menu')}
              aria-haspopup="dialog"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-line-strong bg-surface px-3 text-sm font-semibold text-ink transition-[background-color,transform] duration-150 hover:bg-raised active:scale-[0.96] lg:hidden"
            >
              <Ikon ukuran={18}>{IKON.menu}</Ikon>
              <span>Menu</span>
            </button>
          </header>

          <main
            id="konten-utama"
            tabIndex={-1}
            className={`min-h-0 flex-1 focus:outline-none ${
              adalahEditor ? 'flex flex-col overflow-hidden' : 'overflow-y-auto'
            }`}
          >
            <Outlet />
          </main>
        </div>
      </div>

      <nav
        aria-label="Navigasi cepat ponsel"
        className="grid flex-none grid-cols-4 gap-1.5 border-t border-line bg-surface px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
      >
        {[
          { ke: '/editor', label: 'Editor', ikon: IKON.kode },
          { ke: '/tugas', label: 'Tugas', ikon: IKON.tugas },
          { ke: '/riwayat', label: 'Riwayat', ikon: IKON.riwayat },
        ].map((item) => (
          <NavLink
            key={item.ke}
            to={item.ke}
            className={({ isActive }) =>
              `relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-xs transition-[background-color,color] duration-150 ${
                isActive
                  ? 'bg-raised font-bold text-ink'
                  : 'font-medium text-muted hover:bg-raised/60 hover:text-ink'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-4 top-0 h-0.5 rounded-b-full bg-signal"
                  />
                )}
                <Ikon ukuran={18}>{item.ikon}</Ikon>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
        <button
          type="button"
          onClick={() => setLembarAktif('menu')}
          aria-haspopup="dialog"
          className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-xs font-medium text-muted transition-[background-color,color] duration-150 hover:bg-raised/60 hover:text-ink"
        >
          <Ikon ukuran={18}>{IKON.menu}</Ikon>
          <span>Menu</span>
        </button>
      </nav>

      <Lembar
        buka={lembarAktif === 'menu'}
        onTutup={() => setLembarAktif(null)}
        label="Menu navigasi"
        className="fixed inset-x-0 bottom-0 top-auto m-0 max-h-[85dvh] w-full max-w-none overflow-y-auto rounded-t-2xl p-4 sm:inset-auto sm:right-4 sm:top-16 sm:w-80 sm:rounded-2xl"
      >
        <div className="flex items-center justify-between gap-2 pb-3">
          <p className="text-base font-bold text-ink">Navigasi Ares Xcode</p>
          <button
            type="button"
            onClick={() => setLembarAktif(null)}
            aria-label="Tutup menu navigasi"
            className="btn-ikon"
          >
            <Ikon ukuran={18}>{IKON.tutup}</Ikon>
          </button>
        </div>

        <div className="space-y-4">
          {kelompokNav.map((kelompok) => (
            <div key={kelompok.judul}>
              <p className="px-2 pb-1.5 text-xs font-semibold text-dim">{kelompok.judul}</p>
              <ul className="space-y-1">
                {kelompok.item.map((nav) => (
                  <li key={nav.ke}>
                    <NavLink
                      to={nav.ke}
                      end={nav.akhir}
                      onClick={() => setLembarAktif(null)}
                      className={({ isActive }) =>
                        `relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm ${
                          isActive
                            ? 'bg-raised font-bold text-ink'
                            : 'font-medium text-muted hover:bg-raised/60 hover:text-ink'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {isActive && (
                            <span
                              aria-hidden="true"
                              className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-signal"
                            />
                          )}
                          <Ikon ukuran={18}>{nav.ikon}</Ikon>
                          <span className="flex-1">{nav.label}</span>
                          {nav.lencana && (
                            <span className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-xs tabular-nums text-muted">
                              {nav.lencana}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3">
          <button type="button" onClick={() => setLembarAktif('palet')} className="btn flex-1">
            <Ikon ukuran={16}>{IKON.cari}</Ikon>
            Palet perintah
          </button>
          <button type="button" onClick={() => setLembarAktif('berkas')} className="btn flex-1">
            <Ikon ukuran={16}>{IKON.berkas}</Ikon>
            Buka berkas
          </button>
        </div>
      </Lembar>

      <Lembar
        buka={lembarAktif === 'berkas'}
        onTutup={() => setLembarAktif(null)}
        label="Buka berkas proyek"
        className="fixed inset-x-0 bottom-0 top-auto m-0 w-full max-w-none overflow-auto rounded-t-2xl p-3 md:inset-x-auto md:bottom-auto md:left-1/2 md:top-16 md:w-96 md:-translate-x-1/2 md:rounded-2xl"
      >
        <div className="flex items-center justify-between px-2 pb-2 pt-1">
          <p className="text-sm font-bold text-ink">Pilih berkas proyek</p>
          <kbd className="kbd-cap">Ctrl P</kbd>
        </div>
        <ul className="space-y-1">
          {berkasList.map((b, i) => {
            const baris = b.kode.replace(/\n$/, '').split('\n').length
            const aktif = i === aktifIndex && location.pathname === '/editor'
            return (
              <li key={b.nama}>
                <button
                  type="button"
                  onClick={() => {
                    setAktifIndex(i)
                    navigate('/editor')
                    setLembarAktif(null)
                  }}
                  className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-[background-color] duration-150 hover:bg-raised ${
                    aktif ? 'bg-raised font-bold' : ''
                  }`}
                >
                  <span className="grid size-8 flex-none place-items-center rounded-lg bg-signal text-signal-ink">
                    <Ikon ukuran={16}>{IKON.kode}</Ikon>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-ink">{b.nama}</span>
                    <span className="block truncate font-mono text-xs text-muted">
                      {b.bahasa.toUpperCase()} · {baris} baris
                    </span>
                  </span>
                  {aktif && <span className="text-xs font-semibold text-muted">Dibuka</span>}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="mt-3 flex items-center justify-end border-t border-line pt-3">
          <button type="button" onClick={() => setLembarAktif(null)} className="btn-tinta">
            Selesai
          </button>
        </div>
      </Lembar>

      <Palet
        buka={lembarAktif === 'palet'}
        onTutup={() => setLembarAktif(null)}
        onBukaBerkas={() => setLembarAktif('berkas')}
      />
    </div>
  )
}
