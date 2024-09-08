import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from "@/components/theme-provider"
import Auth from './views/auth/Auth'
import { Toaster } from './components/ui/toaster.tsx'
import { AuthProvider } from './views/auth/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <App />
        <Toaster />
        {/* <Auth /> */}
      </AuthProvider>

    </ThemeProvider>

  </StrictMode>,
)
