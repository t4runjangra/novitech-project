import React from 'react'
import ReactDom from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './context/toastContext.jsx'
ReactDom.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter >
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter >
  </React.StrictMode>

)
