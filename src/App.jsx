import { useEffect } from 'react'
import { useTranslator } from './hooks/useTranslator'
import ModelLoader from './components/ModelLoader'
import TranslatorPanel from './components/TranslatorPanel'
import StatusBadge from './components/StatusBadge'

export default function App() {
  const { status, progress, translation, error, isCached, initModel, translate, clear } = useTranslator()

  useEffect(() => {
    initModel()
  }, [initModel])

  const isLoading = status === 'idle' || status === 'loading'

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg)' }}
    >
      <header className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <span className="text-xl">🌐</span>
          <div>
            <h1 className="text-sm font-semibold leading-none" style={{ color: 'var(--text)' }}>
              DE → EN Translator
            </h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Runs entirely in your browser
            </p>
          </div>
        </div>
        <StatusBadge status={status} isCached={isCached} />
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl">
          {isLoading ? (
            <ModelLoader progress={progress} isCached={isCached} />
          ) : (
            <TranslatorPanel
              translate={translate}
              isTranslating={status === 'translating'}
              translation={translation}
              onClear={clear}
            />
          )}

          {error && (
            <div
              className="mt-4 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              {error}
            </div>
          )}
        </div>
      </main>

      <footer className="px-6 py-3 text-xs text-center border-t" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
        Powered by{' '}
        <span style={{ color: 'var(--accent)' }}>Xenova/opus-mt-de-en</span>
        {' '}· No data leaves your device
      </footer>
    </div>
  )
}
