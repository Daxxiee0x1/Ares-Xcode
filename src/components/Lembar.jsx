import { useEffect, useRef } from 'react'

// Lembar = jendela kecil di atas halaman (palet, daftar file, panel fitur).
// Memakai elemen <dialog> bawaan browser: Esc menutup, fokus terkunci di dalamnya.
export default function Lembar({ buka, onTutup, label, className = '', children }) {
  const ref = useRef(null)

  // Sinkronkan state `buka` dengan <dialog>: buka -> showModal(), tutup -> close()
  useEffect(() => {
    const d = ref.current
    if (buka && !d.open) d.showModal()
    if (!buka && d.open) d.close()
  }, [buka])

  return (
    <dialog
      ref={ref}
      aria-label={label}
      // Esc: jangan biarkan browser menutup sendiri; ubah state, lalu efek di atas yang menutup
      onCancel={(e) => { e.preventDefault(); onTutup() }}
      // Klik di area gelap (backdrop) = target-nya <dialog> itu sendiri
      onClick={(e) => e.target === ref.current && onTutup()}
      className={`border border-line bg-surface p-0 text-ink shadow-2xl ${className}`}
    >
      {children}
    </dialog>
  )
}
