import { useState } from 'react'

export default function TranslatorPanel({ translate, isTranslating, translation, onClear }) {
  const [input, setInput] = useState('')

  function handleTranslate() {
    if (input.trim()) translate(input)
  }

  function handleClear() {
    setInput('')
    onClear()
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleTranslate()
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="flex flex-col flex-1 gap-2">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            German
          </label>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Guten Morgen…"
            rows={8}
            className="w-full rounded-xl p-4 text-base leading-relaxed transition-colors duration-150"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
            }}
          />
        </div>

        <div className="flex flex-col flex-1 gap-2">
          <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            English
          </label>
          <textarea
            value={translation}
            readOnly
            placeholder="Translation will appear here…"
            rows={8}
            className="w-full rounded-xl p-4 text-base leading-relaxed cursor-default"
            style={{
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: translation ? 'var(--text)' : 'var(--text-muted)',
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleClear}
          disabled={!input && !translation}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          style={{ background: 'var(--surface-2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
        >
          Clear
        </button>

        <button
          onClick={handleTranslate}
          disabled={!input.trim() || isTranslating}
          className="flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          {isTranslating ? (
            <>
              <Spinner />
              Translating…
            </>
          ) : (
            <>Translate <span className="opacity-60 text-xs font-normal">⌘↵</span></>
          )}
        </button>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="14"
      height="14"
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
