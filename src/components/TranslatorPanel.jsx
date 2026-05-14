import { useState, useRef } from 'react'

export default function TranslatorPanel({ translate, isTranslating, translation }) {
  const [input, setInput] = useState('')
  const [lastInput, setLastInput] = useState('')
  const [copied, setCopied] = useState(false)

  // Keep a ref in sync so blur's setTimeout closure always reads current value
  const inputValueRef = useRef('')
  const skipBlurRef = useRef(false)
  const textareaRef = useRef(null)

  function syncInput(val) {
    setInput(val)
    inputValueRef.current = val
  }

  function doTranslate(text) {
    setLastInput(text)
    syncInput('')
    translate(text)
    // Re-focus so user can type next sentence immediately
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  function handleTranslate() {
    const text = inputValueRef.current.trim()
    if (!text || isTranslating) return
    doTranslate(text)
  }

  // Fires when iOS keyboard is dismissed or user taps away
  function handleBlur() {
    setTimeout(() => {
      if (!skipBlurRef.current) {
        const text = inputValueRef.current.trim()
        if (text && !isTranslating) doTranslate(text)
      }
      skipBlurRef.current = false
    }, 150)
  }

  // pointerdown fires before blur, so we can suppress the blur-translate
  // when the user taps the Translate button (avoiding double-fire)
  function handleButtonPointerDown() {
    skipBlurRef.current = true
  }

  async function handleCopy() {
    if (!translation) return
    await navigator.clipboard.writeText(translation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasResult = lastInput && (translation || isTranslating)

  return (
    <div className="flex flex-col gap-4 w-full">

      {/* Result card — shown after translate is triggered */}
      {hasResult && (
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          {/* German source row */}
          <div className="px-5 pt-5 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--text-muted)' }}>
              🇩🇪 German
            </p>
            <p className="text-base leading-relaxed" style={{ color: 'var(--text)' }}>
              {lastInput}
            </p>
          </div>

          {/* English result row */}
          <div className="px-5 pt-4 pb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                🇬🇧 English
              </p>
              {!isTranslating && translation && (
                <button
                  onPointerDown={e => e.stopPropagation()}
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 active:scale-95"
                  style={{
                    background: copied ? 'rgba(34,197,94,0.15)' : 'var(--surface-2)',
                    color: copied ? 'var(--success)' : 'var(--text-muted)',
                    border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
                    minHeight: '36px',
                    minWidth: '76px',
                  }}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              )}
            </div>

            {isTranslating ? (
              <div className="flex items-center gap-2.5 py-1" style={{ color: 'var(--text-muted)' }}>
                <Spinner />
                <span className="text-sm">Translating…</span>
              </div>
            ) : (
              <p className="text-base leading-relaxed" style={{ color: 'var(--text)' }}>
                {translation}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex flex-col gap-3">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => syncInput(e.target.value)}
          onBlur={handleBlur}
          placeholder="Type German text here…"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          className="w-full rounded-2xl p-4 text-lg leading-relaxed transition-colors duration-150"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            minHeight: '140px',
            resize: 'none',
          }}
        />

        <button
          onPointerDown={handleButtonPointerDown}
          onClick={handleTranslate}
          disabled={!input.trim() || isTranslating}
          className="w-full flex items-center justify-center gap-2 rounded-2xl text-base font-semibold transition-all duration-150 disabled:opacity-40 active:scale-[0.98]"
          style={{
            background: 'var(--accent)',
            color: '#fff',
            minHeight: '56px',
          }}
        >
          Translate
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
