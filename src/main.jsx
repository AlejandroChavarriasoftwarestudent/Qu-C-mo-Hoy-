import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/bootstrap-5.3.8-dist/css/bootstrap.min.css'
import './assets/bootstrap-icons-1.13.1/bootstrap-icons.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)