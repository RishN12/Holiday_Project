import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerSW } from 'virtual:pwa-register'

// Register PWA service worker for full offline support
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('New version of Orlando Trip App available.');
  },
  onOfflineReady() {
    console.log('Orlando Trip App is ready to work offline!');
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
