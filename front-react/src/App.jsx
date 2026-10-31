import React from 'react'

export default function App() {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', textAlign: 'center' }}>
      <h1>Prototype DMP - Dossier Médical Partagé</h1>
      <p style={{ color: '#059669', fontWeight: 'bold' }}>✓ Front-end React opérationnel</p>
      <p>API connectée sur : <code>{apiUrl}</code></p>
    </div>
  )
}
