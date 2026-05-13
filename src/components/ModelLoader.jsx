function formatBytes(bytes) {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`
}

export default function ModelLoader({ progress, isCached }) {
  const pct = progress?.total ? Math.round((progress.loaded / progress.total) * 100) : 0
  const hasProgress = progress?.total > 0

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 px-4 w-full max-w-md mx-auto">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="text-4xl mb-2">🧠</div>
        <h2 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
          {isCached ? 'Loading model from cache…' : 'Downloading translation model…'}
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {isCached
            ? 'Model is cached locally — this will be fast.'
            : 'First time only (~100 MB). Cached permanently after this.'}
        </p>
      </div>

      <div className="w-full">
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: '6px', background: 'var(--surface-2)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: hasProgress ? `${pct}%` : '100%',
              background: 'var(--accent)',
              animation: !hasProgress ? 'pulse 1.5s ease-in-out infinite' : 'none',
            }}
          />
        </div>

        {hasProgress && (
          <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>{progress.file?.split('/').pop()}</span>
            <span>
              {formatBytes(progress.loaded)} / {formatBytes(progress.total)} ({pct}%)
            </span>
          </div>
        )}

        {!hasProgress && (
          <p className="text-xs text-center mt-2" style={{ color: 'var(--text-muted)' }}>
            Initialising runtime…
          </p>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
