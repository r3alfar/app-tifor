// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from './components/ui/toaster.tsx'
import { AuthProvider } from './views/auth/AuthContext.tsx'
import api from './lib/axios.ts'
window.api = api

createRoot(document.getElementById('root')!).render(

  <AuthProvider>
    <App />
    <Toaster />
  </AuthProvider>


)
