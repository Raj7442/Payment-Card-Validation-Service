import { useState, useEffect } from 'react'

export default function History({ onNavigate }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('cardHistory') || '[]')
    setHistory(data)
  }, [])

  const clearHistory = () => {
    localStorage.removeItem('cardHistory')
    setHistory([])
  }

  return (
    <div className="container">
      <h1>Validation History</h1>
      <div className="scroll-container">
        {history.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>
            No validation history yet
          </p>
        ) : (
          history.map((item, i) => (
            <div key={i} className="history-item">
              <div style={{ fontWeight: '600', marginBottom: '0.3rem' }}>{item.card}</div>
              <div style={{ fontSize: '0.95rem', marginBottom: '0.3rem' }}>{item.result}</div>
              <small style={{ color: '#888', fontSize: '0.85rem' }}>{item.timestamp}</small>
            </div>
          ))
        )}
      </div>
      <div className="button-group">
        <button className="btn" onClick={() => onNavigate('validator')}>Back</button>
        {history.length > 0 && <button className="btn" onClick={clearHistory}>Clear All</button>}
      </div>
    </div>
  )
}
