export function Ikon({ children, ukuran = 20, isi = false, className }) {
  return (
    <svg
      width={ukuran}
      height={ukuran}
      viewBox="0 0 24 24"
      fill={isi ? 'currentColor' : 'none'}
      stroke={isi ? 'none' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  )
}

export const IKON = {
  beranda: (
    <>
      <path d="M4 10.5L12 4l8 6.5" />
      <path d="M6.5 9.5V19h11V9.5" />
    </>
  ),
  kode: <path d="M8.5 8L4.5 12l4 4M15.5 8l4 4-4 4" />,
  berkas: (
    <>
      <path d="M6 4h8l4 4v12H6z" />
      <path d="M14 4v4h4" />
    </>
  ),
  main: <path d="M7 5l12 7-12 7z" />,
  cari: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
  menu: <path d="M5 7h14M5 12h14M5 17h14" />,
  tutup: <path d="M6 6l12 12M18 6L6 18" />,
  ukuran: (
    <>
      <path d="M4 7V5h12v2M10 5v14M7 19h6" />
      <path d="M16 12h5M18.5 9.5v5" />
    </>
  ),
  tugas: (
    <>
      <path d="M5 7l2 2 3.5-3.5" />
      <path d="M13 7h6" />
      <path d="M5 12h14" />
      <path d="M5 17h10" />
    </>
  ),
  riwayat: (
    <>
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="7" cy="17" r="2.5" />
      <circle cx="17" cy="12" r="2.5" />
      <path d="M7 9.5v5M9.5 7h3a4.5 4.5 0 0 1 4.5 2.5" />
    </>
  ),
  bantuan: (
    <>
      <rect x="3.5" y="6" width="17" height="12" rx="2.5" />
      <path d="M7.5 10h1M11.5 10h1M15.5 10h1M8 14h8" />
    </>
  ),
  panahKiri: <path d="M15 6l-6 6 6 6" />,
  panahKanan: <path d="M9 6l6 6-6 6" />,
  bawah: <path d="M7 10l5 5 5-5" />,
  sidebar: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M9 4.5v15" />
    </>
  ),
  matahari: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </>
  ),
  bulan: <path d="M19 14.5A7.5 7.5 0 0 1 9.5 5a7.5 7.5 0 1 0 9.5 9.5z" />,
  monitor: (
    <>
      <rect x="3.5" y="4.5" width="17" height="12" rx="2" />
      <path d="M9 20h6M12 16.5V20" />
    </>
  ),
  sunting: <path d="M15.5 5.5l3 3L9 18H6v-3z" />,
  ulang: (
    <>
      <path d="M5 12a7 7 0 1 0 2-4.9L5 9" />
      <path d="M5 4.5V9h4.5" />
    </>
  ),
}
