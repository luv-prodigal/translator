export default function StatusBadge({ status, isCached }) {
  const isOfflineReady = isCached && (status === 'ready' || status === 'translating')
  const needsInternet = !isCached && status === 'loading'
  const isThreaded = typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {isOfflineReady && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ background: 'rgba(34,197,94,0.12)', color: 'var(--success)', border: '1px solid rgba(34,197,94,0.25)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          Offline Ready
        </span>
      )}
      {needsInternet && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ background: 'rgba(234,179,8,0.12)', color: 'var(--warning)', border: '1px solid rgba(234,179,8,0.25)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          Requires Internet
        </span>
      )}
      {!isThreaded && status !== 'idle' && (
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{ background: 'rgba(234,179,8,0.12)', color: 'var(--warning)', border: '1px solid rgba(234,179,8,0.25)' }}
        >
          Threading disabled — slower inference
        </span>
      )}
    </div>
  )
}
