import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App'

// When a new service worker is installed and takes over, reload so users
// always get the latest version automatically after a deploy.
registerSW({
  onNeedRefresh() {},
  onOfflineReady() {},
  onRegisteredSW(_, registration) {
    if (!registration) return
    // Poll for updates every 60 s so a deploy reaches users within a minute
    setInterval(() => registration.update(), 60_000)
  },
})

// Force reload whenever the active service worker changes (new deploy took over)
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  window.location.reload()
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
