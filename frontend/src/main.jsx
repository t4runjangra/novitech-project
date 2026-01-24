import React from 'react'
import ReactDom from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/toastContext.jsx'
import { ThemeProvider } from './context/themeContext.jsx'
ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter >

      <ToastProvider>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </ToastProvider>
    </BrowserRouter >
  </React.StrictMode>

)
