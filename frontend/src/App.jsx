import { useState } from 'react'
import Home from './components/Home'
import Validator from './components/Validator'
import History from './components/History'
import Batch from './components/Batch'
import FloatingIcons from './components/FloatingIcons'
import './App.css'

function App() {
  const [page, setPage] = useState('home')
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className={darkMode ? 'dark' : ''}>
      <FloatingIcons />
      <div className="page-container">
        <div className={`page ${page === 'home' ? 'active' : ''}`}>
          <Home onNavigate={setPage} />
        </div>
        <div className={`page ${page === 'validator' ? 'active' : ''}`}>
          <Validator onNavigate={setPage} onToggleTheme={() => setDarkMode(!darkMode)} />
        </div>
        <div className={`page ${page === 'history' ? 'active' : ''}`}>
          <History onNavigate={setPage} />
        </div>
        <div className={`page ${page === 'batch' ? 'active' : ''}`}>
          <Batch onNavigate={setPage} />
        </div>
      </div>
    </div>
  )
}

export default App
