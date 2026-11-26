import { useEffect, useRef } from 'react'

export default function Lembar({ buka, onTutup, label, className = '', children }) {
  const dialogRef = useRef(null)
  const pemicuSebelumnyaRef = useRef(null)

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return

    if (buka && !d.open) {
      pemicuSebelumnyaRef.current = document.activeElement
      d.showModal()
    } else if (!buka && d.open) {
      d.close()
      pemicuSebelumnyaRef.current?.focus?.()
    }
  }, [buka])

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      onCancel={(e) => {
        // Keep React state as the single source of truth when Escape is pressed.
        e.preventDefault()
        onTutup()
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) onTutup()
      }}
      className={`border border-line bg-surface p-0 text-ink shadow-[var(--shadow-elevated)] overscroll-contain ${className}`}
    >
      {children}
    </dialog>
  )
}
