import { useState, useCallback, useRef } from 'react'
import { pipeline, env } from '@huggingface/transformers'

env.allowLocalModels = false

const MODEL_ID = 'Xenova/opus-mt-de-en'

let pipelineInstance = null
let initPromise = null

async function isModelCached() {
  try {
    const cache = await caches.open('transformers-cache')
    const keys = await cache.keys()
    return keys.some(r => r.url.includes('Xenova/opus-mt-de-en'))
  } catch {
    return false
  }
}

export function useTranslator() {
  const [status, setStatus] = useState('idle')
  const [progress, setProgress] = useState(null)
  const [translation, setTranslation] = useState('')
  const [error, setError] = useState(null)
  const [isCached, setIsCached] = useState(false)
  const abortRef = useRef(false)

  const initModel = useCallback(async () => {
    if (pipelineInstance) {
      setStatus('ready')
      return
    }
    if (initPromise) {
      setStatus('loading')
      await initPromise
      return
    }

    abortRef.current = false
    setStatus('loading')
    setError(null)

    const cached = await isModelCached()
    setIsCached(cached)

    const onProgress = (p) => {
      if (p.status === 'downloading' && p.file?.endsWith('.onnx')) {
        setProgress({ file: p.file, loaded: p.loaded ?? 0, total: p.total ?? 0 })
      } else if (p.status === 'initiate') {
        setProgress(prev => prev ? prev : { file: p.file ?? '', loaded: 0, total: 0 })
      }
    }

    initPromise = pipeline('translation', MODEL_ID, { dtype: 'fp32', progress_callback: onProgress })

    try {
      pipelineInstance = await initPromise
      if (!abortRef.current) {
        setStatus('ready')
        setProgress(null)
      }
    } catch (err) {
      initPromise = null
      pipelineInstance = null
      setError(err.message ?? 'Failed to load model')
      setStatus('idle')
    }
  }, [])

  const translate = useCallback(async (text) => {
    if (!pipelineInstance || !text.trim()) return
    setStatus('translating')
    setError(null)
    try {
      const result = await pipelineInstance(text)
      setTranslation(result[0]?.translation_text ?? '')
    } catch (err) {
      setError(err.message ?? 'Translation failed')
    } finally {
      setStatus('ready')
    }
  }, [])

  return { status, progress, translation, error, isCached, initModel, translate }
}
