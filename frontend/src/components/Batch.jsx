import { useState } from 'react'

export default function Batch({ onNavigate }) {
  const [input, setInput] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const validateBatch = async () => {
    const cards = input.split('\n').filter(c => c.trim())
    if (cards.length === 0) return

    setLoading(true)
    const batchResults = []

    for (const card of cards) {
      try {
        const response = await fetch('/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ card_number: card.trim() })
        })
        const data = await response.json()
        batchResults.push({
          card: card.trim(),
          valid: data.valid,
          brand: data.brand,
          type: data.type
        })
      } catch {
        batchResults.push({ card: card.trim(), valid: false, brand: 'Error', type: 'N/A' })
      }
    }

    setResults(batchResults)
    setLoading(false)
  }

  const exportCSV = () => {
    const csv = 'Card,Valid,Brand,Type\n' + 
      results.map(r => `${r.card.replace(/.(?=.{4})/g, '*')},${r.valid},${r.brand},${r.type}`).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'validation_results.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const validCount = results.filter(r => r.valid).length

  return (
    <div className="container">
      <h1>Batch Validation</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter card numbers (one per line)"
        rows="6"
        style={{ fontFamily: 'monospace', fontSize: '14px' }}
      />
      <button className="btn" onClick={validateBatch} disabled={loading}>
        {loading ? 'Validating...' : 'Validate All'}
      </button>
      
      {results.length > 0 && (
        <>
          <h3 style={{ margin: '20px 0' }}>Results: {validCount}/{results.length} Valid</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {results.map((r, i) => (
              <div key={i} style={{
                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                padding: '12px',
                margin: '8px 0',
                borderRadius: '12px',
                borderLeft: `4px solid ${r.valid ? '#28a745' : '#dc3545'}`
              }}>
                <strong>{r.card.replace(/.(?=.{4})/g, '*')}</strong><br />
                {r.valid ? '✅' : '❌'} {r.brand} {r.type}
              </div>
            ))}
          </div>
        </>
      )}
      
      <div className="button-group">
        <button className="btn" onClick={() => onNavigate('validator')}>Back</button>
        {results.length > 0 && <button className="btn" onClick={exportCSV}>Export CSV</button>}
      </div>
    </div>
  )
}
