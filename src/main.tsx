import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import 'leaflet/dist/leaflet.css'
import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found in DOM hierarchy')
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
