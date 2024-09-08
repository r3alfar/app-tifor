import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/views/app/Aapp.tsx'
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"
import Auth from './views/auth/Auth'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {/* <App /> */}
      <Auth />
    </ThemeProvider>

  </StrictMode>,
)
