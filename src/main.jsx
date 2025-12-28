import React from 'react'
import ReactDOM from 'react-dom/client'
import PortfolioExplorer from './portfolio-explorer.jsx'
import PasswordGate from './PasswordGate.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PasswordGate>
      <PortfolioExplorer />
    </PasswordGate>
  </React.StrictMode>,
)
