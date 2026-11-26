import { Link, useLocation } from 'react-router'
import { Ikon, IKON } from '../components/Ikon.jsx'

export default function NotFoundPage() {
  const location = useLocation()

  return (
    <div className="mx-auto flex max-w-xl flex-col justify-center px-4 py-14 sm:px-6 sm:py-20">
      <p className="font-mono text-sm font-bold text-dim">404</p>
      <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.375rem)] font-bold leading-tight tracking-tight text-ink">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-3 text-base text-muted">
        Alamat{' '}
        <code className="break-all rounded-md bg-raised px-1.5 py-0.5 font-mono text-sm text-ink">
          {location.pathname}
        </code>{' '}
        tidak terdaftar di Ares Xcode. Periksa kembali alamat atau buka salah satu halaman utama di
        bawah.
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <Link to="/editor" className="btn-utama">
          <Ikon ukuran={18}>{IKON.kode}</Ikon>
          Buka editor
        </Link>
        <Link to="/" className="btn">
          Kembali ke beranda
        </Link>
        <Link to="/bantuan" className="btn">
          Lihat bantuan
        </Link>
      </div>
    </div>
  )
}
