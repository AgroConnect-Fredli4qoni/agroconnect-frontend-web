import React from 'react'

export default function App() {
  return (
    <div className="app-container">
      <header className="navbar">
        <div className="brand">
          <span className="brand-icon">🌱</span>
          <span className="brand-text">AgroConnect</span>
        </div>
        <span className="badge">BNSP Capstone Project</span>
      </header>

      <main className="hero">
        <h1>Smart Agro-Commerce & BMKG Weather Platform</h1>
        <p>Menghubungkan Petani Indonesia dengan Pasar Digital Terintegrasi & Prakiraan Cuaca Agrikultur BMKG.</p>
        <div className="status-grid">
          <div className="status-card">
            <h3>API Gateway</h3>
            <p className="port">:8080</p>
            <span className="tag ready">Ready</span>
          </div>
          <div className="status-card">
            <h3>Catalog Service</h3>
            <p className="port">:8081 (MongoDB)</p>
            <span className="tag ready">Ready</span>
          </div>
          <div className="status-card">
            <h3>Order Service</h3>
            <p className="port">:8082 (MySQL ACID)</p>
            <span className="tag ready">Ready</span>
          </div>
          <div className="status-card">
            <h3>Weather Service</h3>
            <p className="port">:8083 (BMKG Data)</p>
            <span className="tag ready">Ready</span>
          </div>
        </div>
      </main>
    </div>
  )
}
