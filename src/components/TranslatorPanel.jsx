import { useState, useRef } from 'react'

export default function TranslatorPanel({ translate, isTranslating, translation, onClear }) {
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)

  const inputValueRef = useRef('')
  const skipBlurRef = useRef(false)

  function syncInput(val) {
    setInput(val)
    inputValueRef.current = val
  }

  function handleTranslate() {
    const text = inputValueRef.current.trim()
    if (!text || isTranslating) return
    translate(text)
  }

  function handleClear() {
    syncInput('')
    onClear()
  }

  // Keyboard dismissed on iOS → trigger translate
  function handleBlur() {
    setTimeout(() => {
      if (!skipBlurRef.current) {
        const text = inputValueRef.current.trim()
        if (text && !isTranslating) translate(text)
      }
      skipBlurRef.current = false
    }, 150)
  }

  function handleButtonPointerDown() {
    skipBlurRef.current = true
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleTranslate()
    }
  }

  async function handleCopy() {
    if (!translation) return
    await navigator.clipboard.writeText(translation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col md:flex-row gap-4 w-full">

        {/* German input */}
        <div className="flex flex-col flex-1 gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            🇩🇪 German
          </label>
          <textarea
            value={input}
            onChange={e => syncInput(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Type German text here…"
            autoCorrect="off"
            spellCheck={false}
            className="w-full rounded-2xl p-4 text-base leading-relaxed transition-colors duration-150"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              minHeight: '180px',
              resize: 'none',
            }}
          />
        </div>

        {/* English output */}
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              🇬🇧 English
            </label>
            {translation && (
              <button
                onPointerDown={e => e.stopPropagation()}
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium transition-all duration-150 active:scale-95"
                style={{
                  background: copied ? 'rgba(34,197,94,0.15)' : 'var(--surface-2)',
                  color: copied ? 'var(--success)' : 'var(--text-muted)',
                  border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
                  minHeight: '30px',
                }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            )}
          </div>
          <textarea
            value={isTranslating ? '' : translation}
            readOnly
            placeholder={isTranslating ? 'Translating…' : 'Translation appears here…'}
            className="w-full rounded-2xl p-4 text-base leading-relaxed cursor-default"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: translation && !isTranslating ? 'var(--text)' : 'var(--text-muted)',
              minHeight: '180px',
              resize: 'none',
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        <button
          onPointerDown={handleButtonPointerDown}
          onClick={handleClear}
          disabled={!input && !translation}
          className="px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-150 disabled:opacity-30 active:scale-95"
          style={{
            background: 'var(--surface-2)',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            minHeight: '48px',
          }}
        >
          Clear
        </button>

        <button
          onPointerDown={handleButtonPointerDown}
          onClick={handleTranslate}
          disabled={!input.trim() || isTranslating}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-base font-semibold transition-all duration-150 disabled:opacity-40 active:scale-[0.98]"
          style={{
            background: 'var(--accent)',
            color: '#fff',
            minHeight: '48px',
          }}
        >
          {isTranslating ? <><Spinner /> Translating…</> : 'Translate'}
        </button>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin shrink-0"
      width="16" height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    >
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}
