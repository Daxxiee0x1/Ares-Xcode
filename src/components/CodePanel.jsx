import { useEffect, useRef } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, lineNumbers } from '@codemirror/view'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { tags as t } from '@lezer/highlight'

const gayaSintaks = HighlightStyle.define([
  { tag: [t.keyword, t.documentMeta, t.atom], color: 'var(--tok-meta)' },
  { tag: [t.string, t.attributeValue], color: 'var(--tok-str)' },
  { tag: [t.number, t.unit, t.color], color: 'var(--tok-attr)' },
  { tag: [t.comment, t.lineComment, t.blockComment], color: 'var(--dim)', fontStyle: 'italic' },
  { tag: [t.tagName, t.className], color: 'var(--tok-tag)' },
  { tag: [t.attributeName, t.propertyName], color: 'var(--tok-attr)' },
  { tag: [t.punctuation, t.bracket, t.angleBracket, t.operator, t.separator], color: 'var(--tok-punc)' },
])

const BAHASA_EXT = {
  html: () => html(),
  css: () => css(),
}

export default function CodePanel({ kode, bahasa, readOnly = true, onChange }) {
  const indukRef = useRef(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  useEffect(() => {
    if (!indukRef.current) return

    const extensions = [
      lineNumbers(),
      BAHASA_EXT[bahasa](),
      syntaxHighlighting(gayaSintaks),
      EditorView.lineWrapping,
      EditorState.readOnly.of(readOnly),
      EditorView.editable.of(!readOnly),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChangeRef.current) {
          onChangeRef.current(update.state.doc.toString())
        }
      }),
    ]

    const tampilan = new EditorView({
      parent: indukRef.current,
      state: EditorState.create({
        doc: kode.replace(/\n$/, ''),
        extensions,
      }),
    })

    return () => tampilan.destroy()
    // Parent passes a composite key when switching files, resetting, or toggling readOnly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div ref={indukRef} className="h-full" />
}
