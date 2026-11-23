import { useEffect, useRef } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, lineNumbers } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { tags as t } from '@lezer/highlight'

// Warna sintaks memakai token yang sama dengan prototipe Ares Xcode (lihat index.css)
const gaya = HighlightStyle.define([
  { tag: [t.keyword, t.documentMeta, t.atom], color: 'var(--tok-meta)' },
  { tag: [t.string, t.attributeValue], color: 'var(--tok-str)' },
  { tag: [t.number, t.unit, t.color], color: 'var(--tok-attr)' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: 'var(--dim)', fontStyle: 'italic' },
  { tag: [t.tagName, t.className], color: 'var(--tok-tag)' },
  { tag: [t.attributeName, t.propertyName], color: 'var(--tok-attr)' },
  { tag: [t.punctuation, t.bracket, t.angleBracket, t.operator, t.separator], color: 'var(--tok-punc)' },
])

const BAHASA = {
  html: () => html(),
  css: () => css(),
}

export default function CodePanel({ kode, bahasa }) {
  const induk = useRef(null)

  useEffect(() => {
    const tampilan = new EditorView({
      parent: induk.current,
      state: EditorState.create({
        doc: kode.replace(/\n$/, ''),
        extensions: [
          lineNumbers(),
          BAHASA[bahasa](),
          syntaxHighlighting(gaya),
          EditorView.lineWrapping,
          EditorState.readOnly.of(true),
        ],
      }),
    })
    return () => tampilan.destroy()
  }, [])

  return <div ref={induk} className="h-full" />
}
