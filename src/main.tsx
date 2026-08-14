import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/styles.css'
import AppClone from './AppClone.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppClone />
  </StrictMode>,
)
