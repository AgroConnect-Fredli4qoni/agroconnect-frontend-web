import React from 'react'

/**
 * ServiceStatusItem defines the schema for backend service status representation.
 */
export interface ServiceStatusItem {
  name: string
  port: string
  database?: string
  status: 'Ready' | 'Starting' | 'Degraded'
}

/**
 * Initial microservices registry displayed on the portal dashboard.
 */
const initialServices: ServiceStatusItem[] = [
  { name: 'API Gateway', port: ':8080', status: 'Ready' },
  { name: 'Catalog Service', port: ':8081', database: 'MongoDB', status: 'Ready' },
  { name: 'Order Service', port: ':8082', database: 'MySQL ACID', status: 'Ready' },
  { name: 'Weather Service', port: ':8083', database: 'BMKG Data', status: 'Ready' },
]

/**
 * AgroConnect Web Portal root component.
 *
 * @returns JSX Element representing the application layout and monitoring overview.
 */
export default function App(): React.JSX.Element {
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
          {initialServices.map((service) => (
            <div key={service.name} className="status-card">
              <h3>{service.name}</h3>
              <p className="port">
                {service.port}
                {service.database ? ` (${service.database})` : ''}
              </p>
              <span className="tag ready">{service.status}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
