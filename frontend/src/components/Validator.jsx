import { useState } from 'react'

export default function Validator({ onNavigate, onToggleTheme }) {
  const [cardNumber, setCardNumber] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [brand, setBrand] = useState('')

  const formatCard = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16)
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || ''
    setCardNumber(formatted)
    
    if (cleaned.length >= 4) {
      const detectedBrand = detectBrand(cleaned)
      setBrand(detectedBrand)
    } else {
      setBrand('')
    }
  }

  const detectBrand = (num) => {
    if (num.startsWith('4')) return 'Visa'
    if (num.startsWith('5')) return 'MasterCard'
    if (num.startsWith('3')) return 'Amex'
    if (num.startsWith('6')) return 'Discover'
    return 'Unknown'
  }

  const validateCard = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult('')

    try {
      const response = await fetch('/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ card_number: cardNumber })
      })
      
      const data = await response.json()
      
      if (data.valid) {
        setResult(`success:✅ Valid ${data.brand} ${data.type} Card`)
        saveHistory(cardNumber, `✅ Valid ${data.brand} ${data.type} Card`)
      } else {
        setResult('error:❌ Invalid Card Number')
        saveHistory(cardNumber, '❌ Invalid Card Number')
      }
    } catch (error) {
      setResult('error:⚠️ Server Error')
    } finally {
      setLoading(false)
    }
  }

  const saveHistory = (card, res) => {
    const history = JSON.parse(localStorage.getItem('cardHistory') || '[]')
    const masked = card.replace(/.(?=.{4})/g, '*')
    history.unshift({ card: masked, result: res, timestamp: new Date().toLocaleString() })
    if (history.length > 10) history.pop()
    localStorage.setItem('cardHistory', JSON.stringify(history))
  }

  const [resultType, resultText] = result.split(':')

  return (
    <div className="container">
      <h1>Enter Your Card Number</h1>
      <form onSubmit={validateCard}>
        <input
          id="cardNumber"
          type="text"
          value={cardNumber}
          onChange={(e) => formatCard(e.target.value)}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
        />
        {brand && brand !== 'Unknown' && (
          <div className="card-brand">💳 {brand}</div>
        )}
        <button 
          type="submit" 
          className="btn" 
          disabled={loading || cardNumber.replace(/\s/g, '').length !== 16}
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          {loading ? 'Validating...' : 'Validate Card'}
        </button>
      </form>
      {result && (
        <div className={`result ${resultType}`}>
          {resultText}
        </div>
      )}
      <div className="button-group">
        <button className="btn" onClick={() => onNavigate('home')}>Home</button>
        <button className="btn" onClick={() => onNavigate('history')}>History</button>
        <button className="btn" onClick={() => onNavigate('batch')}>Batch</button>
        <button className="btn" onClick={onToggleTheme}>🌙</button>
      </div>
    </div>
  )
}
